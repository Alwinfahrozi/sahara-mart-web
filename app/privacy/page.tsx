import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Sahara Mart',
  description: 'Kebijakan privasi dan perlindungan data pelanggan Sahara Mart sesuai UU PDP Indonesia',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Kebijakan Privasi
      </h1>
      <p className="text-gray-600 mb-8">
        Terakhir diperbarui: 16 Januari 2026
      </p>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Pendahuluan */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            📋 Pendahuluan
          </h2>
          <p className="text-gray-700 mb-4">
            Sahara Mart ("kami", "kita", atau "milik kami") berkomitmen untuk melindungi
            privasi dan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda saat Anda
            menggunakan situs web kami dan layanan terkait.
          </p>
          <p className="text-gray-700">
            Dengan menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi
            sesuai dengan kebijakan ini. Kebijakan ini disusun sesuai dengan Undang-Undang Perlindungan
            Data Pribadi (UU PDP) Indonesia dan standar internasional.
          </p>
        </section>

        {/* Informasi yang Dikumpulkan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Informasi yang Kami Kumpulkan
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.1. Informasi yang Anda Berikan Secara Langsung
          </h3>
          <p className="text-gray-700 mb-4">
            Ketika Anda melakukan pemesanan atau berinteraksi dengan kami, kami mengumpulkan:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Informasi Identitas:</strong> Nama lengkap</li>
            <li><strong>Informasi Kontak:</strong> Nomor telepon, alamat WhatsApp</li>
            <li><strong>Informasi Pengiriman:</strong> Alamat lengkap pengiriman</li>
            <li><strong>Informasi Pesanan:</strong> Produk yang dipesan, jumlah, catatan khusus</li>
            <li><strong>Informasi Komunikasi:</strong> Pesan dan komunikasi melalui WhatsApp</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.2. Informasi yang Dikumpulkan Secara Otomatis
          </h3>
          <p className="text-gray-700 mb-4">
            Saat Anda menggunakan situs web kami, kami mengumpulkan:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, sistem operasi</li>
            <li><strong>Data Penggunaan:</strong> Halaman yang dikunjungi, waktu kunjungan, durasi</li>
            <li><strong>Data Perangkat:</strong> Jenis perangkat, resolusi layar</li>
            <li><strong>Cookies:</strong> Data cookie untuk pengalaman pengguna yang lebih baik</li>
            <li><strong>Log Server:</strong> Catatan aktivitas server untuk keamanan</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.3. Informasi dari Pihak Ketiga
          </h3>
          <p className="text-gray-700 mb-4">
            Kami dapat menerima informasi dari:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>WhatsApp:</strong> Informasi profil publik saat Anda menghubungi kami</li>
            <li><strong>Google Analytics:</strong> Data agregat tentang penggunaan situs (anonim)</li>
            <li><strong>Platform Hosting:</strong> Log server dari Vercel (penyedia hosting kami)</li>
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

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2.1. Penyediaan Layanan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Memproses dan memenuhi pesanan Anda</li>
            <li>Mengirimkan konfirmasi pesanan melalui WhatsApp</li>
            <li>Mengatur pengiriman produk ke alamat Anda</li>
            <li>Memberikan dukungan pelanggan</li>
            <li>Menanggapi pertanyaan dan permintaan Anda</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2.2. Peningkatan Layanan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Menganalisis pola penggunaan untuk meningkatkan pengalaman pengguna</li>
            <li>Mengidentifikasi dan memperbaiki masalah teknis</li>
            <li>Mengembangkan fitur dan produk baru</li>
            <li>Melakukan riset pasar dan analisis tren</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2.3. Komunikasi
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Mengirimkan update status pesanan</li>
            <li>Memberitahu tentang promosi dan penawaran khusus (dengan persetujuan Anda)</li>
            <li>Mengirimkan pengumuman penting terkait layanan</li>
            <li>Menanggapi feedback dan keluhan</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            2.4. Keamanan dan Kepatuhan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Mencegah penipuan dan penyalahgunaan layanan</li>
            <li>Melindungi keamanan situs web dan pengguna</li>
            <li>Mematuhi kewajiban hukum dan regulasi</li>
            <li>Menyelesaikan sengketa dan menegakkan perjanjian</li>
          </ul>
        </section>

        {/* Pembagian Informasi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            3. Pembagian Informasi
          </h2>
          <p className="text-gray-700 mb-4">
            Kami TIDAK menjual data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi dalam situasi berikut:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            3.1. Penyedia Layanan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>WhatsApp:</strong> Untuk komunikasi dan konfirmasi pesanan</li>
            <li><strong>Vercel:</strong> Untuk hosting website dan infrastruktur</li>
            <li><strong>Supabase:</strong> Untuk penyimpanan data dan database</li>
            <li><strong>Jasa Pengiriman:</strong> Untuk mengirimkan produk (hanya nama dan alamat)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            3.2. Kewajiban Hukum
          </h3>
          <p className="text-gray-700 mb-6">
            Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum, perintah pengadilan,
            atau permintaan resmi dari pihak berwenang.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            3.3. Perlindungan Hak
          </h3>
          <p className="text-gray-700">
            Kami dapat mengungkapkan informasi untuk melindungi hak, properti, atau keselamatan
            Sahara Mart, pengguna kami, atau publik sesuai hukum yang berlaku.
          </p>
        </section>

        {/* Keamanan Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Keamanan Data
          </h2>
          <p className="text-gray-700 mb-4">
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data pribadi Anda:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.1. Keamanan Teknis
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Enkripsi HTTPS:</strong> Semua data ditransmisikan melalui koneksi terenkripsi</li>
            <li><strong>Database Aman:</strong> Data disimpan di server aman dengan enkripsi</li>
            <li><strong>Rate Limiting:</strong> Perlindungan terhadap serangan DDoS dan abuse</li>
            <li><strong>CSRF Protection:</strong> Perlindungan terhadap serangan cross-site</li>
            <li><strong>Authentication:</strong> Akses admin dilindungi dengan autentikasi kuat</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.2. Keamanan Organisasi
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Akses data terbatas hanya untuk staf yang memerlukan</li>
            <li>Pelatihan keamanan data untuk semua karyawan</li>
            <li>Audit keamanan berkala</li>
            <li>Kebijakan privasi dan keamanan yang ketat</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <p className="text-gray-700">
              <strong>Catatan:</strong> Meskipun kami melakukan upaya terbaik, tidak ada metode
              transmisi internet atau penyimpanan elektronik yang 100% aman. Kami tidak dapat
              menjamin keamanan absolut.
            </p>
          </div>
        </section>

        {/* Hak Anda */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            5. Hak Anda
          </h2>
          <p className="text-gray-700 mb-4">
            Sesuai UU PDP Indonesia, Anda memiliki hak berikut:
          </p>

          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda
            </li>
            <li>
              <strong>Hak Koreksi:</strong> Meminta perbaikan data yang tidak akurat atau tidak lengkap
            </li>
            <li>
              <strong>Hak Penghapusan:</strong> Meminta penghapusan data pribadi Anda (dengan pengecualian tertentu)
            </li>
            <li>
              <strong>Hak Pembatasan:</strong> Meminta pembatasan pemrosesan data Anda
            </li>
            <li>
              <strong>Hak Portabilitas:</strong> Meminta transfer data ke penyedia layanan lain
            </li>
            <li>
              <strong>Hak Keberatan:</strong> Menolak pemrosesan data untuk tujuan pemasaran
            </li>
            <li>
              <strong>Hak Penarikan Persetujuan:</strong> Menarik persetujuan kapan saja
            </li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
            <p className="text-gray-700">
              <strong>Cara Menggunakan Hak Anda:</strong><br/>
              Hubungi kami melalui WhatsApp atau email. Kami akan merespons dalam 14 hari kerja.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            6. Cookies dan Teknologi Pelacakan
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            6.1. Apa itu Cookies?
          </h3>
          <p className="text-gray-700 mb-4">
            Cookies adalah file teks kecil yang disimpan di perangkat Anda untuk meningkatkan
            pengalaman browsing.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            6.2. Jenis Cookies yang Kami Gunakan
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li><strong>Essential Cookies:</strong> Diperlukan untuk fungsi dasar situs (keranjang belanja, login)</li>
            <li><strong>Analytics Cookies:</strong> Membantu kami memahami bagaimana pengunjung menggunakan situs</li>
            <li><strong>Functional Cookies:</strong> Mengingat preferensi Anda (bahasa, lokasi)</li>
            <li><strong>Security Cookies:</strong> Melindungi dari serangan CSRF dan keamanan</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            6.3. Mengelola Cookies
          </h3>
          <p className="text-gray-700 mb-4">
            Anda dapat mengontrol cookies melalui pengaturan browser Anda. Namun, menonaktifkan
            cookies dapat mempengaruhi fungsi situs.
          </p>
        </section>

        {/* Retensi Data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            7. Retensi Data
          </h2>
          <p className="text-gray-700 mb-4">
            Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang dijelaskan
            dalam kebijakan ini:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Data Pesanan:</strong> 3 tahun (untuk tujuan akuntansi dan pajak)</li>
            <li><strong>Data Akun Admin:</strong> Selama akun aktif</li>
            <li><strong>Log Server:</strong> 90 hari (untuk keamanan dan troubleshooting)</li>
            <li><strong>Data Analytics:</strong> Data agregat dan anonim disimpan tanpa batas waktu</li>
          </ul>
        </section>

        {/* Anak-anak */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            8. Privasi Anak-anak
          </h2>
          <p className="text-gray-700">
            Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak dengan
            sengaja mengumpulkan informasi pribadi dari anak-anak. Jika Anda yakin kami memiliki
            informasi anak di bawah umur, silakan hubungi kami agar kami dapat menghapusnya.
          </p>
        </section>

        {/* Transfer Internasional */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            9. Transfer Data Internasional
          </h2>
          <p className="text-gray-700 mb-4">
            Data Anda mungkin diproses di server yang berlokasi di luar Indonesia (Vercel menggunakan
            server global). Kami memastikan bahwa transfer data dilakukan sesuai dengan standar
            perlindungan data internasional.
          </p>
          <p className="text-gray-700">
            Penyedia layanan kami (Vercel, Supabase) memiliki sertifikasi keamanan internasional
            dan mematuhi standar perlindungan data yang ketat.
          </p>
        </section>

        {/* Perubahan Kebijakan */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            10. Perubahan Kebijakan Privasi
          </h2>
          <p className="text-gray-700 mb-4">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan
            ditampilkan di halaman ini dengan tanggal "Terakhir diperbarui" yang diubah.
          </p>
          <p className="text-gray-700">
            Untuk perubahan material, kami akan memberitahu Anda melalui email atau notifikasi
            di situs web. Penggunaan layanan yang berkelanjutan setelah perubahan berarti Anda
            menerima kebijakan yang diperbarui.
          </p>
        </section>

        {/* Kontak */}
        <section className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            📞 Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini atau
            praktik privasi kami, silakan hubungi kami:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Nama:</strong> Sahara Mart</li>
            <li><strong>WhatsApp:</strong> +62 812-3456-7890</li>
            <li><strong>Email:</strong> privacy@saharamart.com</li>
            <li><strong>Alamat:</strong> [Alamat Lengkap Toko]</li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Waktu Respons:</strong> Kami akan merespons pertanyaan privasi Anda dalam 14 hari kerja.
          </p>
        </section>

        {/* Persetujuan */}
        <section className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            ✅ Persetujuan Anda
          </h2>
          <p className="text-gray-700">
            Dengan menggunakan situs web kami, Anda menyetujui Kebijakan Privasi ini dan
            menyetujui syarat-syaratnya. Jika Anda tidak setuju dengan kebijakan ini,
            harap tidak menggunakan layanan kami.
          </p>
        </section>

        {/* Footer Note */}
        <div className="text-center text-gray-600 text-sm pt-8 border-t">
          <p>Dokumen ini terakhir diperbarui pada 16 Januari 2026</p>
          <p>© 2026 Sahara Mart. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
}
