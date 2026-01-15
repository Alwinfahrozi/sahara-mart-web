'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type ImageUploadProps = {
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
};

export default function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return 'Ukuran file maksimal 2MB';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format file harus JPG, PNG, atau WebP';
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      onUploadError?.(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const supabase = createClient();

      // Generate unique filename: timestamp-originalname
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      // Callback with URL
      onUploadComplete(publicUrl);
      setUploading(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploading(false);
      setPreview(currentImageUrl || null); // Revert preview
      onUploadError?.(error.message || 'Gagal upload gambar');

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete(''); // Clear URL
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      {preview ? (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {!uploading && !disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              title="Hapus gambar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#E60000]" />
                <span className="text-gray-900 font-semibold">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 hover:border-[#E60000] transition-colors">
          <ImageIcon className="w-16 h-16 text-gray-400" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">Belum ada gambar</p>
            <p className="text-sm text-gray-500 mt-1">Upload gambar produk di bawah</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
            transition-all cursor-pointer
            ${
              disabled || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#E60000] hover:bg-[#CC0000] hover:shadow-lg'
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {preview ? 'Ganti Gambar' : 'Upload Gambar'}
            </>
          )}
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Format: JPG, PNG, WebP • Max: 2MB
        </p>
      </div>
    </div>
  );
}
