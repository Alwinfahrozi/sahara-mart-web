import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Pengembalian & Penukaran - Sahara Mart',
  description: 'Kebijakan pengembalian dan penukaran produk Sahara Mart. Pelajari syarat, proses, dan ketentuan return produk.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        🔄 Kebijakan Pengembalian & Penukaran
      </h1>
      <p className="text-gray-600 mb-8">
        Terakhir diperbarui: 16 Januari 2026
      </p>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
        <p className="text-gray-800 leading-relaxed">
          <strong className="text-green-800">✅ Komitmen Kami:</strong> Kepuasan Anda adalah prioritas kami. Jika Anda tidak puas dengan produk yang diterima, kami menyediakan kebijakan pengembalian dan penukaran yang adil dan transparan. Harap membaca dengan saksama untuk memahami hak dan kewajiban Anda.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Ringkasan Kebijakan */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            📋 Ringkasan Kebijakan
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">⏰ Periode Return</h3>
              <p className="text-gray-700 text-sm">7 hari sejak penerimaan produk</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">📦 Kondisi Produk</h3>
              <p className="text-gray-700 text-sm">Tidak digunakan, kemasan asli utuh</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">💰 Proses Refund</h3>
              <p className="text-gray-700 text-sm">7-14 hari kerja setelah barang diterima</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">🚚 Ongkir Return</h3>
              <p className="text-gray-700 text-sm">Tergantung alasan pengembalian</p>
            </div>
          </div>
        </section>

        {/* Syarat Pengembalian */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Syarat Pengembalian Produk
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.1. Produk yang Dapat Dikembalikan
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 mb-2 font-semibold">✅ Anda dapat mengembalikan produk jika:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Produk Rusak/Cacat:</strong> Produk diterima dalam kondisi rusak atau cacat produksi</li>
              <li><strong>Salah Kirim:</strong> Produk yang diterima tidak sesuai dengan pesanan Anda</li>
              <li><strong>Tidak Sesuai Deskripsi:</strong> Produk berbeda signifikan dari deskripsi di website</li>
              <li><strong>Produk Kadaluarsa:</strong> Produk makanan/minuman diterima dalam kondisi kadaluarsa atau mendekati kadaluarsa (&lt; 1 bulan)</li>
              <li><strong>Produk Tidak Lengkap:</strong> Item yang seharusnya ada tidak disertakan dalam paket</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            1.2. Produk yang TIDAK Dapat Dikembalikan
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gray-700 mb-2 font-semibold">❌ Produk berikut TIDAK dapat dikembalikan:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Makanan/Minuman Terbuka:</strong> Produk konsumsi yang kemasannya sudah dibuka</li>
              <li><strong>Produk yang Sudah Digunakan:</strong> Produk menunjukkan tanda-tanda penggunaan</li>
              <li><strong>Tanpa Kemasan Asli:</strong> Produk tanpa kemasan, label, atau segel asli</li>
              <li><strong>Produk Sale/Clearance:</strong> Kecuali ada cacat produksi yang terbukti</li>
              <li><strong>Produk Custom/Personal:</strong> Produk yang dibuat khusus atas permintaan</li>
              <li><strong>Produk Hygiene:</strong> Kosmetik, produk perawatan pribadi yang telah dibuka</li>
              <li><strong>Perubahan Pikiran:</strong> Tidak suka warna, model, atau ukuran (kecuali kesalahan dari kami)</li>
            </ul>
          </div>
        </section>

        {/* Periode Pengembalian */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            2. Periode Pengembalian
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700 mb-3">
              <strong>⏰ Batas Waktu:</strong> Anda memiliki <strong className="text-yellow-800">7 (tujuh) hari kalender</strong> sejak tanggal penerimaan produk untuk mengajukan pengembalian.
            </p>
            <p className="text-gray-700 mb-3">
              <strong>📅 Perhitungan Waktu:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Hari ke-1 dimulai dari tanggal yang tertera pada tanda terima kurir</li>
              <li>Termasuk hari Sabtu, Minggu, dan hari libur nasional</li>
              <li>Pengajuan setelah 7 hari tidak akan diproses</li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm font-semibold">
              💡 Tip: Segera cek kondisi produk saat diterima dan laporkan masalah dalam 1x24 jam untuk proses yang lebih cepat.
            </p>
          </div>
        </section>

        {/* Kondisi Produk Return */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            3. Kondisi Produk yang Dapat Dikembalikan
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3 font-semibold">
              Untuk pengembalian karena alasan pribadi (bukan kesalahan kami):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Kondisi Baru:</strong> Produk tidak pernah digunakan dan dalam kondisi seperti baru</li>
              <li><strong>Kemasan Asli Utuh:</strong> Semua kemasan, box, label, dan segel masih lengkap dan utuh</li>
              <li><strong>Aksesoris Lengkap:</strong> Semua aksesoris, manual, bonus yang disertakan harus dikembalikan</li>
              <li><strong>Tag/Label Terpasang:</strong> Label harga dan tag produk tidak boleh dilepas</li>
              <li><strong>Tidak Ada Kerusakan:</strong> Produk tidak rusak akibat kesalahan penggunaan</li>
            </ul>
            <p className="text-gray-600 text-sm mt-3 italic">
              Catatan: Produk yang dikembalikan karena kesalahan kami (rusak, salah kirim) tidak harus memenuhi semua kriteria di atas.
            </p>
          </div>
        </section>

        {/* Proses Pengembalian */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Proses Pengembalian Produk
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Langkah-langkah Return:</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Hubungi Customer Service</h4>
                  <p className="text-gray-700 text-sm">
                    Hubungi kami via WhatsApp di +62 123-4567-890 atau email support@saharamart.com dengan informasi:
                  </p>
                  <ul className="list-disc pl-4 mt-1 text-gray-700 text-sm">
                    <li>Nomor pesanan</li>
                    <li>Alasan pengembalian</li>
                    <li>Produk yang ingin dikembalikan</li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Kirim Bukti Foto/Video</h4>
                  <p className="text-gray-700 text-sm">
                    Kirimkan foto/video produk yang bermasalah dengan jelas:
                  </p>
                  <ul className="list-disc pl-4 mt-1 text-gray-700 text-sm">
                    <li>Foto keseluruhan produk</li>
                    <li>Foto detail masalah (kerusakan, cacat, dll)</li>
                    <li>Foto label/barcode produk</li>
                    <li>Video unboxing (jika ada)</li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Dapatkan Approval Return</h4>
                  <p className="text-gray-700 text-sm">
                    Tim kami akan mengevaluasi permintaan Anda dalam 1x24 jam. Jika disetujui, Anda akan menerima:
                  </p>
                  <ul className="list-disc pl-4 mt-1 text-gray-700 text-sm">
                    <li>Nomor RMA (Return Merchandise Authorization)</li>
                    <li>Alamat return yang dituju</li>
                    <li>Instruksi pengepakan</li>
                    <li>Label return (jika biaya ditanggung kami)</li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Kemas dan Kirim Produk</h4>
                  <p className="text-gray-700 text-sm">
                    Kemas produk dengan aman:
                  </p>
                  <ul className="list-disc pl-4 mt-1 text-gray-700 text-sm">
                    <li>Gunakan kemasan yang aman dan kuat</li>
                    <li>Masukkan nomor RMA di dalam paket</li>
                    <li>Tulis nomor RMA di luar paket</li>
                    <li>Kirim via kurir terpercaya (JNE, J&T, SiCepat)</li>
                    <li>Simpan resi pengiriman</li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Konfirmasi Pengiriman Return</h4>
                  <p className="text-gray-700 text-sm">
                    Kirimkan nomor resi return via WhatsApp atau email agar kami dapat tracking barang Anda.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Terima Refund/Penukaran</h4>
                  <p className="text-gray-700 text-sm">
                    Setelah barang return kami terima dan lolos inspeksi:
                  </p>
                  <ul className="list-disc pl-4 mt-1 text-gray-700 text-sm">
                    <li>Refund diproses dalam 7-14 hari kerja</li>
                    <li>Penukaran produk dikirim dalam 3-5 hari kerja</li>
                    <li>Anda akan menerima konfirmasi via WhatsApp/Email</li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Ongkos Kirim Return */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            5. Biaya Ongkir Return
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                ✅ Kami yang Tanggung
              </h3>
              <p className="text-gray-700 text-sm mb-2">Ongkir return GRATIS jika:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700 text-sm">
                <li>Produk rusak/cacat saat diterima</li>
                <li>Salah kirim produk</li>
                <li>Produk tidak sesuai deskripsi</li>
                <li>Produk tidak lengkap</li>
                <li>Kesalahan dari pihak Sahara Mart</li>
              </ul>
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                💳 Anda yang Tanggung
              </h3>
              <p className="text-gray-700 text-sm mb-2">Ongkir return ditanggung pembeli jika:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700 text-sm">
                <li>Perubahan pikiran (tidak suka)</li>
                <li>Salah pesan ukuran/warna</li>
                <li>Alasan pribadi lainnya</li>
                <li>Produk tidak sesuai ekspektasi (tapi sesuai deskripsi)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            6. Proses Refund (Pengembalian Dana)
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            6.1. Timeline Refund
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Hari 1-3:</span>
                <span>Produk dalam perjalanan return ke gudang kami</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Hari 4-5:</span>
                <span>Inspeksi dan verifikasi kondisi produk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Hari 6-7:</span>
                <span>Approval refund dan proses administrasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px]">Hari 8-14:</span>
                <span>Transfer dana ke rekening Anda</span>
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            6.2. Metode Refund
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Transfer Bank:</strong> Refund akan ditransfer ke rekening bank yang Anda berikan</li>
              <li><strong>E-Wallet:</strong> Jika tersedia, refund bisa via GoPay, OVO, DANA (sesuai pembayaran awal)</li>
              <li><strong>Store Credit:</strong> Opsional - dapatkan refund dalam bentuk voucher + bonus 5%</li>
            </ul>
            <p className="text-gray-600 text-sm mt-3">
              <strong>Catatan:</strong> Biaya admin transfer (jika ada) ditanggung oleh pembeli.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
            6.3. Jumlah Refund
          </h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700 mb-2"><strong>Yang Dikembalikan:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Harga produk (100%)</li>
              <li>Ongkir awal (jika kesalahan dari kami)</li>
            </ul>
            <p className="text-gray-700 mt-3 mb-2"><strong>Yang TIDAK Dikembalikan:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Biaya asuransi pengiriman</li>
              <li>Biaya kemasan khusus (jika ada)</li>
              <li>Ongkir return (kecuali kesalahan kami)</li>
              <li>Diskon voucher (voucher tetap hangus)</li>
            </ul>
          </div>
        </section>

        {/* Exchange Process */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            7. Proses Penukaran Produk
          </h2>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🔄 Kapan Penukaran Tersedia?
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Produk rusak/cacat → tukar dengan yang baru (exact item)</li>
              <li>Salah kirim → tukar dengan pesanan yang benar</li>
              <li>Salah ukuran/varian → tukar dengan ukuran/varian lain (stock tersedia)</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Proses Penukaran:
          </h3>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Ikuti langkah 1-5 dari proses return di atas</li>
            <li>Saat mengajukan return, nyatakan keinginan untuk tukar (bukan refund)</li>
            <li>Tentukan produk pengganti yang diinginkan</li>
            <li>Setelah produk return kami terima dan lolos inspeksi, produk pengganti akan dikirim dalam 3-5 hari kerja</li>
            <li>Jika ada selisih harga:
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>Produk pengganti lebih mahal → Anda bayar selisih</li>
                <li>Produk pengganti lebih murah → Selisih direfund atau store credit</li>
              </ul>
            </li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>💡 Catatan:</strong> Penukaran hanya dapat dilakukan 1 kali per produk. Jika produk pengganti masih bermasalah, Anda akan mendapatkan full refund.
            </p>
          </div>
        </section>

        {/* Inspeksi Return */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            8. Inspeksi Produk Return
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3">
              Setiap produk yang dikembalikan akan melalui inspeksi menyeluruh untuk memastikan memenuhi syarat return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Verifikasi Kondisi:</strong> Produk diperiksa sesuai syarat yang berlaku</li>
              <li><strong>Kelengkapan:</strong> Semua aksesoris dan bonus harus lengkap</li>
              <li><strong>Autentikasi:</strong> Memastikan produk yang dikembalikan adalah produk asli dari kami</li>
              <li><strong>Dokumentasi:</strong> Foto/video kondisi produk return untuk arsip</li>
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <p className="text-gray-700 text-sm font-semibold mb-2">
                ⚠️ Penolakan Return:
              </p>
              <p className="text-gray-700 text-sm">
                Return akan ditolak jika produk tidak memenuhi syarat. Produk akan dikembalikan ke Anda dengan biaya ongkir ditanggung pembeli. Anda akan diberitahu via WhatsApp/Email beserta alasan penolakan yang jelas.
              </p>
            </div>
          </div>
        </section>

        {/* Pengecualian */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            9. Pengecualian dan Kondisi Khusus
          </h2>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              ⚠️ Kondisi Khusus:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Produk Sale/Clearance:</strong> Umumnya tidak dapat dikembalikan, kecuali ada cacat produksi yang dapat dibuktikan</li>
              <li><strong>Produk Promosi:</strong> Produk gratis/bonus tidak dapat dikembalikan secara terpisah</li>
              <li><strong>Pembelian Grosir/Bulk:</strong> Kebijakan return khusus berlaku (hubungi CS untuk detail)</li>
              <li><strong>Produk Pre-Order:</strong> Pembatalan hanya dapat dilakukan sebelum produk dikirim</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              🚫 Kami Berhak Menolak Return Jika:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Produk dikembalikan setelah periode 7 hari</li>
              <li>Produk rusak karena kesalahan penggunaan</li>
              <li>Produk tidak lengkap atau aksesori hilang</li>
              <li>Kemasan/label/segel rusak atau hilang (untuk return non-defect)</li>
              <li>Tanda-tanda produk telah digunakan</li>
              <li>Produk yang dikembalikan bukan dari pembelian di Sahara Mart</li>
              <li>Indikasi penyalahgunaan kebijakan return (return fraud)</li>
            </ul>
          </div>
        </section>

        {/* Hak Konsumen */}
        <section className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            10. Hak Konsumen
          </h2>
          <p className="text-gray-700 mb-3">
            Sesuai dengan UU Perlindungan Konsumen No. 8 Tahun 1999, Anda memiliki hak:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Mendapatkan produk yang sesuai dengan yang dijanjikan</li>
            <li>Mendapatkan kompensasi jika produk tidak sesuai</li>
            <li>Pengembalian dana untuk produk yang cacat atau tidak sesuai</li>
            <li>Informasi yang jelas dan jujur mengenai produk</li>
            <li>Diperlakukan secara benar, jujur, dan tidak diskriminatif</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Jika Anda merasa hak Anda dilanggar, silakan hubungi kami atau laporkan ke Badan Perlindungan Konsumen Nasional (BPKN).
          </p>
        </section>

        {/* Kontak */}
        <section className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            11. Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Pertanyaan tentang return atau refund? Hubungi kami:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Sahara Mart - Customer Service Return</strong></p>
            <p>📧 Email: returns@saharamart.com</p>
            <p>📱 WhatsApp: +62 123-4567-890</p>
            <p>📍 Alamat Return: [Alamat Gudang/Kantor Sahara Mart]</p>
            <p>🕐 Jam Operasional: Senin - Sabtu, 08:00 - 17:00 WIB</p>
          </div>
          <div className="bg-white rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600">
              <strong>💡 Tips Respon Cepat:</strong> Sertakan nomor pesanan dan foto produk saat menghubungi kami untuk proses yang lebih cepat!
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 font-semibold">
            Kebijakan ini berlaku untuk semua pembelian di Sahara Mart. Kami berhak mengubah kebijakan ini sewaktu-waktu dengan pemberitahuan di website.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            © 2026 Sahara Mart. All Rights Reserved. | Terakhir Diperbarui: 16 Januari 2026
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Lihat juga:{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Kebijakan Privasi</a>
            {' | '}
            <a href="/terms" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>
            {' | '}
            <a href="/shipping-policy" className="text-blue-600 hover:underline">Kebijakan Pengiriman</a>
            {' | '}
            <a href="/faq" className="text-blue-600 hover:underline">FAQ</a>
          </p>
        </div>
      </div>
    </div>
  );
}
