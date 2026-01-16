import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BUCKET_NAME = 'product-images';

// ============================================================
// Upload Image to Supabase Storage
// ============================================================
export async function uploadProductImage(file: File): Promise<{ url: string; path: string } | null> {
  try {
    console.log('Starting image upload:', file.name, file.type, file.size);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Upload path:', filePath);

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log('✅ Public URL:', publicUrl);

    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    console.error('❌ Upload exception:', error);
    console.error('Error message:', error?.message);
    throw error; // Re-throw untuk ditangkap oleh komponen
  }
}

// ============================================================
// Delete Image from Supabase Storage
// ============================================================
export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/products/filename.jpg
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.indexOf(BUCKET_NAME);

    if (bucketIndex === -1) {
      console.error('Invalid image URL format');
      return false;
    }

    // Get path after bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    // Delete file
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

// ============================================================
// Validate Image File
// ============================================================
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak valid. Gunakan JPG, PNG, atau WebP.',
    };
  }

  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Ukuran file terlalu besar. Maksimal 2MB.',
    };
  }

  return { valid: true };
}

// ============================================================
// Get Storage URL (for display)
// ============================================================
export function getStorageUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}
