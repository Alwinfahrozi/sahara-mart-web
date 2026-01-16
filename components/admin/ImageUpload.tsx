'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadProductImage, validateImageFile, deleteProductImage } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  // Upload image
  const handleUpload = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'File tidak valid');
      return;
    }

    setUploading(true);
    toast.loading('Mengupload gambar...', { id: 'upload' });

    try {
      // Delete old image if exists
      if (previewUrl && previewUrl !== currentImageUrl) {
        await deleteProductImage(previewUrl);
      }

      // Upload new image
      const result = await uploadProductImage(file);

      if (!result) {
        throw new Error('Upload failed - no result returned');
      }

      // Update preview and parent component
      setPreviewUrl(result.url);
      onImageUpload(result.url);

      toast.success('Gambar berhasil diupload!', { id: 'upload' });
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      const errorMsg = error?.message || 'Gagal upload gambar';

      // Show detailed error untuk debugging
      if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
        toast.error('Bucket "product-images" belum dibuat di Supabase Storage!', { id: 'upload', duration: 5000 });
      } else if (errorMsg.includes('permission') || errorMsg.includes('policy')) {
        toast.error('RLS policy belum di-setup! Cek SUPABASE_STORAGE_SETUP.md', { id: 'upload', duration: 5000 });
      } else {
        toast.error(`Upload gagal: ${errorMsg}`, { id: 'upload', duration: 5000 });
      }
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const handleRemove = async () => {
    if (!previewUrl) return;

    const confirmRemove = window.confirm('Hapus gambar ini?');
    if (!confirmRemove) return;

    setUploading(true);
    toast.loading('Menghapus gambar...', { id: 'remove' });

    try {
      // Delete from storage
      const deleted = await deleteProductImage(previewUrl);

      if (deleted) {
        setPreviewUrl(null);
        onImageRemove();
        toast.success('Gambar berhasil dihapus', { id: 'remove' });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus gambar', { id: 'remove' });
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        Gambar Produk
      </label>

      {/* Upload Area */}
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            cursor-pointer transition-all duration-200
            ${dragActive
              ? 'border-[#E60000] bg-red-50'
              : 'border-gray-300 hover:border-[#E60000] hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-[#E60000] animate-spin" />
                <p className="text-sm text-gray-600 font-medium">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Klik atau drag & drop gambar di sini
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, atau WebP (max 2MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Preview Area */
        <div className="relative border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Product preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>

          {/* Change Image Button */}
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="mt-4 w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-[#E60000] hover:text-[#E60000] transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Ganti Gambar'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* Helper Text */}
      <div className="flex items-start gap-2 text-xs text-gray-600">
        <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Tips:</strong> Gunakan gambar dengan resolusi minimal 500x500px untuk hasil terbaik.
          Format JPG lebih kecil ukurannya dibanding PNG.
        </p>
      </div>
    </div>
  );
}
