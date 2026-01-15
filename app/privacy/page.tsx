import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Sahara Mart',
  description: 'Kebijakan privasi dan perlindungan data pelanggan Sahara Mart',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Kebijakan Privasi
      </h1>
      <p className="text-gray-600 mb-8">
        Terakhir diperbarui: 14 Januari 2026
      </p>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Pendahuluan */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            Pendahuluan
          </h2>
          <p className="text-gray-700">
            Sahara Mart ("kami", "kita", atau "milik kami") berkomitmen untuk melindungi
            privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda saat Anda
            menggunakan situs web kami dan layanan terkait.
          </p>
        </section>

        {/* Informasi yang Dikumpulkan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Informasi yang Kami Kumpulkan
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.1. Informasi yang Anda Berikan
          </h3>
          <p className="text-gray-700 mb-4">
            Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Data Pemesanan:</strong> Nama, nomor telepon, alamat pengiriman</li>
            <li><strong>Informasi Komunikasi:</strong> Pesan WhatsApp, catatan pesanan</li>
            <li><strong>Preferensi:</strong> Produk favorit, riwayat pencarian</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            1.2. Informasi yang Dikumpulkan Secara Otomatis
          </h3>
          <p className="text-gray-700 mb-4">
            Saat Anda menggunakan layanan kami, kami secara otomatis mengumpulkan:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, sistem operasi</li>
            <li><strong>Data Penggunaan:</strong> Halaman yang dikunjungi, waktu akses, durasi kunjungan</li>
            <li><strong>Cookies:</strong> Informasi preferensi pengguna dan keranjang belanja</li>
          </ul>
        </section>

        {/* Penggunaan Informasi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            2. Bagaimana Kami Menggunakan Informasi Anda
          </h2>
          <p className="text-gray-700 mb-4">
            Kami menggunakan informasi yang dikumpulkan untuk:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Memproses dan mengelola pesanan Anda</li>
            <li>Berkomunikasi dengan Anda tentang pesanan via WhatsApp</li>
            <li>Memberikan layanan pelanggan dan dukungan</li>
            <li>Meningkatkan pengalaman berbelanja Anda</li>
            <li>Mengirimkan informasi promosi (dengan persetujuan Anda)</li>
            <li>Menganalisis pola penggunaan untuk meningkatkan layanan</li>
            <li>Mencegah penipuan dan aktivitas ilegal</li>
          </ul>
        </section>

        {/* Pembagian Informasi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            3. Pembagian Informasi
          </h2>
          <p className="text-gray-700 mb-4">
            Kami TIDAK menjual informasi pribadi Anda. Kami hanya membagikan informasi Anda dengan:
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Pihak Tepercaya:</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>Kurir Pengiriman:</strong> Untuk mengirimkan pesanan Anda</li>
              <li><strong>Payment Gateway:</strong> Untuk memproses pembayaran (jika applicable)</li>
              <li><strong>WhatsApp Business:</strong> Untuk komunikasi pesanan</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Kewajiban Hukum:</h4>
            <p className="text-gray-700 text-sm">
              Kami dapat mengungkapkan informasi Anda jika diwajibkan oleh hukum atau untuk
              melindungi hak, properti, atau keselamatan kami, pelanggan kami, atau pihak lain.
            </p>
          </div>
        </section>

        {/* Keamanan Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Keamanan Data
          </h2>
          <p className="text-gray-700 mb-4">
            Kami mengimplementasikan langkah-langkah keamanan untuk melindungi informasi Anda:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🔒 Enkripsi Data</h4>
              <p className="text-sm text-gray-600">
                Semua data sensitif dienkripsi menggunakan SSL/TLS
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🔐 Akses Terbatas</h4>
              <p className="text-sm text-gray-600">
                Hanya staf yang berwenang yang dapat mengakses data pelanggan
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">💾 Backup Rutin</h4>
              <p className="text-sm text-gray-600">
                Data di-backup secara berkala untuk mencegah kehilangan data
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🛡️ Firewall</h4>
              <p className="text-sm text-gray-600">
                Sistem dilindungi dengan firewall dan monitoring 24/7
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4 italic">
            ⚠️ Catatan: Tidak ada metode transmisi internet yang 100% aman. Kami berusaha
            keras melindungi data Anda, tetapi tidak dapat menjamin keamanan absolut.
          </p>
        </section>

        {/* Hak Pengguna */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            5. Hak-Hak Anda
          </h2>
          <p className="text-gray-700 mb-4">
            Anda memiliki hak untuk:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-800">Akses Data:</strong>
                <p className="text-gray-600">Meminta salinan data pribadi yang kami simpan tentang Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-800">Koreksi Data:</strong>
                <p className="text-gray-600">Memperbarui atau memperbaiki informasi yang tidak akurat</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-800">Penghapusan Data:</strong>
                <p className="text-gray-600">Meminta penghapusan data pribadi Anda (dengan syarat tertentu)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <strong className="text-gray-800">Opt-Out Marketing:</strong>
                <p className="text-gray-600">Berhenti menerima komunikasi pemasaran kapan saja</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-gray-700">
              <strong>Cara Menggunakan Hak Anda:</strong><br/>
              Hubungi kami via WhatsApp di <strong>+62 123-4567-890</strong> atau email
              ke <strong>privacy@saharamart.com</strong> dengan subjek "Permintaan Data Pribadi"
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            6. Cookies dan Teknologi Pelacakan
          </h2>
          <p className="text-gray-700 mb-4">
            Kami menggunakan cookies dan teknologi serupa untuk:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Menyimpan preferensi Anda</li>
            <li>Mengingat item di keranjang belanja</li>
            <li>Menganalisis traffic website</li>
            <li>Personalisasi konten dan iklan</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Anda dapat menonaktifkan cookies melalui pengaturan browser Anda, tetapi ini
            mungkin mempengaruhi fungsionalitas website.
          </p>
        </section>

        {/* Privasi Anak */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            7. Privasi Anak-Anak
          </h2>
          <p className="text-gray-700">
            Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak
            secara sengaja mengumpulkan informasi pribadi dari anak-anak. Jika Anda adalah
            orang tua atau wali dan mengetahui bahwa anak Anda memberikan informasi pribadi
            kepada kami, silakan hubungi kami.
          </p>
        </section>

        {/* Perubahan Kebijakan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            8. Perubahan Kebijakan Privasi
          </h2>
          <p className="text-gray-700">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan
            memberi tahu Anda tentang perubahan dengan memposting kebijakan baru di halaman
            ini dan memperbarui tanggal "Terakhir diperbarui".
          </p>
          <p className="text-gray-700 mt-4">
            Perubahan signifikan akan dikomunikasikan melalui email atau notifikasi website.
            Penggunaan layanan kami setelah perubahan berarti Anda menerima kebijakan yang diperbarui.
          </p>
        </section>

        {/* Kontak */}
        <section className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            9. Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Sahara Mart</strong></p>
            <p>📧 Email: privacy@saharamart.com</p>
            <p>📱 WhatsApp: +62 123-4567-890</p>
            <p>📍 Alamat: [Alamat Kantor Sahara Mart]</p>
            <p>🕐 Jam Operasional: Senin - Sabtu, 08:00 - 17:00 WIB</p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            Dengan menggunakan layanan Sahara Mart, Anda menyetujui pengumpulan dan
            penggunaan informasi sesuai dengan kebijakan ini.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Dokumen ini sesuai dengan Undang-Undang Perlindungan Data Pribadi Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
