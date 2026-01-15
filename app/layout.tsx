import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';  // ✅ IMPORT
import { Toaster } from 'react-hot-toast';
import Analytics from '@/components/seo/Analytics';
import StructuredData from '@/components/seo/StructuredData';
import { organizationSchema, websiteSchema } from '@/lib/seo/structured-data';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Sahara Mart - Belanja Cermat, Hemat Setiap Hari',
  description: 'Minimarket online terpercaya dengan produk berkualitas dan harga terjangkau. Belanja kebutuhan sehari-hari mudah dan hemat di Sahara Mart.',
  keywords: 'minimarket online, belanja online, toko online, sahara mart, kebutuhan sehari-hari, sembako online, grocery online',
  authors: [{ name: 'Sahara Mart' }],
  creator: 'Sahara Mart',
  publisher: 'Sahara Mart',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://saharamart.com',
    siteName: 'Sahara Mart',
    title: 'Sahara Mart - Belanja Cermat, Hemat Setiap Hari',
    description: 'Minimarket online terpercaya dengan produk berkualitas dan harga terjangkau.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sahara Mart - Minimarket Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahara Mart - Belanja Cermat, Hemat Setiap Hari',
    description: 'Minimarket online terpercaya dengan produk berkualitas dan harga terjangkau.',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#E60000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* Analytics */}
        <Analytics />

        {/* Structured Data */}
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />

        {/* ✅ WRAP dengan CartProvider */}
        <CartProvider>
          <Toaster position="top-right" />
          <Header />
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}