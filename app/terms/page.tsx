import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - Sahara Mart',
  description: 'Syarat dan ketentuan penggunaan layanan Sahara Mart',
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Syarat & Ketentuan
      </h1>
      <p className="text-gray-600 mb-8">
        Terakhir diperbarui: 14 Januari 2026
      </p>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Penerimaan */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            Penerimaan Syarat
          </h2>
          <p className="text-gray-700">
            Dengan mengakses dan menggunakan situs web Sahara Mart, Anda setuju untuk terikat
            oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon
            untuk tidak menggunakan layanan kami.
          </p>
        </section>

        {/* Definisi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Definisi
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="text-gray-700">
              <strong>"Kami", "Kita":</strong> Sahara Mart dan afiliasinya
            </p>
            <p className="text-gray-700">
              <strong>"Anda", "Pengguna":</strong> Setiap orang yang mengakses website kami
            </p>
            <p className="text-gray-700">
              <strong>"Layanan":</strong> Platform e-commerce Sahara Mart dan semua fiturnya
            </p>
            <p className="text-gray-700">
              <strong>"Produk":</strong> Barang yang ditawarkan untuk dijual di platform kami
            </p>
          </div>
        </section>

        {/* Penggunaan Layanan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            2. Penggunaan Layanan
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2.1. Kelayakan
          </h3>
          <p className="text-gray-700 mb-4">
            Untuk menggunakan layanan kami, Anda harus:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Berusia minimal 17 tahun atau memiliki izin orang tua/wali</li>
            <li>Memiliki kapasitas hukum untuk membuat kontrak yang mengikat</li>
            <li>Memberikan informasi yang akurat dan lengkap</li>
            <li>Mematuhi semua hukum yang berlaku di Indonesia</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            2.2. Larangan Penggunaan
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-700 mb-2 font-semibold">Anda TIDAK BOLEH:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Menggunakan layanan untuk tujuan ilegal atau penipuan</li>
              <li>Mengganggu atau merusak operasi website</li>
              <li>Mengakses sistem kami secara tidak sah (hacking)</li>
              <li>Menyalahgunakan atau mengeksploitasi celah keamanan</li>
              <li>Mengumpulkan data pengguna lain tanpa izin</li>
              <li>Mengirimkan spam atau konten berbahaya</li>
            </ul>
          </div>
        </section>

        {/* Pemesanan dan Pembayaran */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            3. Pemesanan & Pembayaran
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            3.1. Proses Pemesanan
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Pilih produk dan tambahkan ke keranjang</li>
              <li>Checkout melalui WhatsApp</li>
              <li>Konfirmasi pesanan dan detail pengiriman</li>
              <li>Lakukan pembayaran sesuai instruksi</li>
              <li>Terima konfirmasi pesanan</li>
              <li>Lacak status pengiriman</li>
            </ol>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            3.2. Harga dan Ketersediaan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Semua harga dalam Rupiah (IDR) dan sudah termasuk PPN</li>
            <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan</li>
            <li>Ketersediaan stok tidak dijamin hingga pembayaran dikonfirmasi</li>
            <li>Kami berhak menolak atau membatalkan pesanan karena alasan tertentu</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            3.3. Metode Pembayaran
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💳 Transfer Bank</h4>
              <p className="text-sm text-gray-600">
                BCA, Mandiri, BNI, BRI
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">📦 COD</h4>
              <p className="text-sm text-gray-600">
                Bayar di tempat (area tertentu)
              </p>
            </div>
          </div>
        </section>

        {/* Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Pengiriman
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.1. Waktu Pengiriman
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="space-y-2 text-gray-700">
              <li><strong>Proses:</strong> 1-2 hari kerja setelah pembayaran</li>
              <li><strong>Pengiriman:</strong> 2-5 hari kerja (tergantung lokasi)</li>
              <li><strong>Total:</strong> Maksimal 7 hari kerja</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            4.2. Ongkos Kirim
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Biaya pengiriman dihitung berdasarkan berat dan jarak</li>
            <li>Free ongkir untuk pembelian di atas Rp 100.000 (area tertentu)</li>
            <li>Estimasi biaya ditampilkan saat checkout</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            4.3. Tanggung Jawab Pengiriman
          </h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700">
              <strong>⚠️ Penting:</strong> Risiko kehilangan atau kerusakan berpindah ke
              pembeli setelah kurir konfirmasi penerimaan. Pastikan untuk:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 text-sm">
              <li>Cek kondisi paket sebelum menerima</li>
              <li>Foto/video unboxing untuk bukti</li>
              <li>Laporkan kerusakan dalam 1x24 jam</li>
            </ul>
          </div>
        </section>

        {/* Pengembalian dan Penukaran */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            5. Pengembalian & Penukaran
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            5.1. Kebijakan Pengembalian
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 mb-2"><strong>Anda dapat mengembalikan produk jika:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Produk rusak atau cacat saat diterima</li>
              <li>Produk tidak sesuai dengan deskripsi</li>
              <li>Produk salah kirim</li>
              <li>Dalam waktu 7 hari sejak penerimaan</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-700 mb-2"><strong>❌ Tidak dapat dikembalikan:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Produk makanan/minuman yang sudah dibuka</li>
              <li>Produk yang sudah digunakan</li>
              <li>Produk tanpa kemasan asli</li>
              <li>Produk sale/clearance (kecuali cacat produksi)</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            5.2. Cara Pengembalian
          </h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Hubungi customer service via WhatsApp</li>
            <li>Kirim foto/video produk yang bermasalah</li>
            <li>Dapatkan approval dan alamat return</li>
            <li>Kirim barang kembali dengan kemasan aman</li>
            <li>Refund diproses dalam 7-14 hari kerja</li>
          </ol>
        </section>

        {/* Hak Kekayaan Intelektual */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            6. Hak Kekayaan Intelektual
          </h2>
          <p className="text-gray-700 mb-4">
            Semua konten di website ini (teks, gambar, logo, video, dll) adalah milik
            Sahara Mart dan dilindungi oleh hukum hak cipta Indonesia dan internasional.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-2"><strong>Anda TIDAK BOLEH:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Menyalin, memodifikasi, atau mendistribusikan konten kami</li>
              <li>Menggunakan logo atau merek kami tanpa izin tertulis</li>
              <li>Scraping atau crawling data dari website</li>
            </ul>
          </div>
        </section>

        {/* Batasan Tanggung Jawab */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            7. Batasan Tanggung Jawab
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700 mb-4">
              Sahara Mart tidak bertanggung jawab atas:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Kerugian tidak langsung, insidental, atau konsekuensial</li>
              <li>Gangguan layanan karena maintenance atau force majeure</li>
              <li>Kesalahan pengguna dalam melakukan pemesanan</li>
              <li>Keterlambatan pengiriman di luar kendali kami</li>
              <li>Konten pihak ketiga yang tertaut di website kami</li>
            </ul>
          </div>
          <p className="text-gray-600 text-sm mt-4 italic">
            Tanggung jawab maksimal kami terbatas pada nilai transaksi yang bersangkutan.
          </p>
        </section>

        {/* Ganti Rugi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            8. Ganti Rugi
          </h2>
          <p className="text-gray-700">
            Anda setuju untuk mengganti rugi, membela, dan membebaskan Sahara Mart dari
            segala klaim, kerugian, atau kerusakan yang timbul dari:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
            <li>Pelanggaran Anda terhadap Syarat & Ketentuan ini</li>
            <li>Penggunaan layanan yang melanggar hukum</li>
            <li>Pelanggaran hak pihak ketiga</li>
          </ul>
        </section>

        {/* Perubahan Syarat */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            9. Perubahan Syarat & Ketentuan
          </h2>
          <p className="text-gray-700">
            Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku
            segera setelah dipublikasikan di website. Penggunaan layanan setelah perubahan
            berarti Anda menerima syarat yang baru.
          </p>
          <p className="text-gray-700 mt-4">
            Perubahan signifikan akan dikomunikasikan melalui email atau notifikasi website.
          </p>
        </section>

        {/* Hukum yang Berlaku */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            10. Hukum yang Berlaku
          </h2>
          <p className="text-gray-700">
            Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum
            Republik Indonesia. Setiap sengketa akan diselesaikan melalui:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mt-4">
            <li>Musyawarah (mediasi) antara kedua belah pihak</li>
            <li>Jika gagal, melalui Pengadilan Negeri Jakarta Selatan</li>
          </ol>
        </section>

        {/* Pemisahan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            11. Pemisahan Klausul
          </h2>
          <p className="text-gray-700">
            Jika ada ketentuan dalam Syarat & Ketentuan ini yang dinyatakan tidak sah atau
            tidak dapat dilaksanakan, ketentuan tersebut akan dipisahkan dan tidak
            mempengaruhi validitas ketentuan lainnya.
          </p>
        </section>

        {/* Kontak */}
        <section className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            12. Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Pertanyaan tentang Syarat & Ketentuan? Hubungi kami:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Sahara Mart</strong></p>
            <p>📧 Email: support@saharamart.com</p>
            <p>📱 WhatsApp: +62 123-4567-890</p>
            <p>📍 Alamat: [Alamat Kantor Sahara Mart]</p>
            <p>🕐 Jam Operasional: Senin - Sabtu, 08:00 - 17:00 WIB</p>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 font-semibold">
            Dengan melakukan pemesanan, Anda menyatakan telah membaca, memahami,
            dan menyetujui Syarat & Ketentuan ini.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            © 2026 Sahara Mart. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
