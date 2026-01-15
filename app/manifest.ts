import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sahara Mart - Minimarket Online',
    short_name: 'Sahara Mart',
    description: 'Minimarket online terpercaya dengan produk berkualitas dan harga terjangkau',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E60000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
