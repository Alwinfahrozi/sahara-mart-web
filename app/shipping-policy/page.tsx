import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Pengiriman - Sahara Mart',
  description: 'Informasi lengkap mengenai kebijakan pengiriman Sahara Mart. Pelajari area pengiriman, estimasi waktu, biaya, dan prosedur pengiriman.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        🚚 Kebijakan Pengiriman
      </h1>
      <p className="text-gray-600 mb-8">
        Terakhir diperbarui: 16 Januari 2026
      </p>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-8">
        <p className="text-gray-800 leading-relaxed">
          <strong className="text-purple-800">📦 Komitmen Pengiriman:</strong> Kami berkomitmen untuk mengirimkan produk Anda dengan aman, cepat, dan tepat waktu. Dokumen ini menjelaskan seluruh proses pengiriman, dari pemrosesan pesanan hingga produk sampai di tangan Anda.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Ringkasan */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            📋 Ringkasan Pengiriman
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">⏱️ Waktu Proses</h3>
              <p className="text-gray-700 text-sm">1-2 hari kerja setelah pembayaran dikonfirmasi</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">🚛 Waktu Pengiriman</h3>
              <p className="text-gray-700 text-sm">2-5 hari kerja (tergantung lokasi)</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">🌍 Jangkauan</h3>
              <p className="text-gray-700 text-sm">Seluruh Indonesia</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">🎁 Free Ongkir</h3>
              <p className="text-gray-700 text-sm">Min. Rp 100.000 (area Jabodetabek)</p>
            </div>
          </div>
        </section>

        {/* Area Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            1. Area Pengiriman
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              ✅ Pengiriman ke Seluruh Indonesia
            </h3>
            <p className="text-gray-700 mb-3">
              Kami mengirimkan produk ke seluruh wilayah Indonesia tanpa terkecuali, termasuk:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Pulau Jawa (semua provinsi)</li>
                <li>Pulau Sumatera (semua provinsi)</li>
                <li>Pulau Kalimantan (semua provinsi)</li>
                <li>Pulau Sulawesi (semua provinsi)</li>
              </ul>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Bali & Nusa Tenggara</li>
                <li>Maluku & Papua</li>
                <li>Kepulauan Indonesia lainnya</li>
                <li>Daerah terpencil (sesuai jangkauan ekspedisi)</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700 text-sm">
              <strong>⚠️ Catatan Daerah Terpencil:</strong> Untuk area yang tidak terjangkau oleh ekspedisi reguler, kami akan menghubungi Anda untuk konfirmasi tambahan biaya pengiriman dan estimasi waktu yang lebih lama.
            </p>
          </div>
        </section>

        {/* Ekspedisi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            2. Ekspedisi & Kurir
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">🚚 JNE (Jalur Nugraha Ekakurir)</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reguler: 2-5 hari kerja</li>
                <li>• YES: 1-2 hari kerja</li>
                <li>• Jangkauan: Seluruh Indonesia</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">📦 J&T Express</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reguler: 2-4 hari kerja</li>
                <li>• Super Cepat: 1-2 hari kerja</li>
                <li>• Jangkauan: Seluruh Indonesia</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">⚡ SiCepat</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reguler: 2-4 hari kerja</li>
                <li>• BEST: 1-2 hari kerja</li>
                <li>• Jangkauan: Jawa, Sumatera, Bali</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">🎯 Anteraja</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Reguler: 2-5 hari kerja</li>
                <li>• Next Day: 1-2 hari kerja</li>
                <li>• Jangkauan: Jawa, Sumatera, Kalimantan</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm">
              <strong>📝 Catatan:</strong> Pemilihan ekspedisi dilakukan secara otomatis berdasarkan lokasi tujuan, berat paket, dan ketersediaan layanan. Anda dapat request ekspedisi tertentu dengan menghubungi CS saat checkout.
            </p>
          </div>
        </section>

        {/* Proses Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            3. Timeline & Proses Pengiriman
          </h2>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Alur Pengiriman Lengkap:</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  H+0
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Pembayaran Dikonfirmasi</h4>
                  <p className="text-gray-700 text-sm">
                    Setelah Anda mengirimkan bukti transfer, tim kami akan verifikasi pembayaran dalam 1-2 jam (jam kerja). Anda akan menerima konfirmasi pembayaran via WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  H+1
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Pemrosesan Pesanan</h4>
                  <p className="text-gray-700 text-sm">
                    Pesanan Anda diproses: picking produk dari gudang, quality check, dan pengemasan dengan aman. Status berubah menjadi "Diproses" di halaman tracking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  H+2
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Dikirim ke Ekspedisi</h4>
                  <p className="text-gray-700 text-sm">
                    Paket diserahkan ke kurir. Anda menerima nomor resi via WhatsApp/Email. Status berubah menjadi "Dikirim". Mulai dapat tracking paket.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  H+3-7
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Dalam Perjalanan</h4>
                  <p className="text-gray-700 text-sm">
                    Paket dalam perjalanan menuju alamat Anda. Update tracking tersedia di website ekspedisi. Estimasi tiba sesuai layanan yang dipilih.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div className="flex-1 bg-white rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Paket Diterima</h4>
                  <p className="text-gray-700 text-sm">
                    Paket sampai di alamat Anda. Kurir akan meminta tanda tangan sebagai bukti penerimaan. Status berubah menjadi "Selesai".
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
            <p className="text-gray-700 text-sm">
              <strong>⏰ Waktu Kerja:</strong> Senin - Jumat (08:00 - 17:00 WIB). Sabtu (08:00 - 14:00 WIB). Minggu & Hari Libur: Tutup. Pesanan yang dibayar setelah jam kerja akan diproses hari kerja berikutnya.
            </p>
          </div>
        </section>

        {/* Biaya Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            4. Biaya Pengiriman (Ongkir)
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.1. Perhitungan Ongkir
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 mb-3">Biaya pengiriman dihitung berdasarkan:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Berat Produk:</strong> Dihitung dalam kilogram (kg), pembulatan ke atas per 1 kg</li>
              <li><strong>Volume Produk:</strong> Untuk produk besar dengan berat ringan (berat volumetrik)</li>
              <li><strong>Jarak Pengiriman:</strong> Dari gudang kami ke alamat tujuan</li>
              <li><strong>Tipe Layanan:</strong> Reguler vs Express</li>
              <li><strong>Lokasi Tujuan:</strong> Perkotaan vs daerah terpencil</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.2. Program Free Ongkir
          </h3>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-green-800 mb-3">🎁 Gratis Ongkir - Syarat & Ketentuan:</h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 mb-1 text-sm">✅ Jabodetabek</h5>
                <p className="text-gray-700 text-sm">
                  Minimal belanja: <strong>Rp 100.000</strong><br/>
                  Berlaku untuk: Jakarta, Bogor, Depok, Tangerang, Bekasi
                </p>
              </div>

              <div className="bg-white rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 mb-1 text-sm">✅ Jawa Barat</h5>
                <p className="text-gray-700 text-sm">
                  Minimal belanja: <strong>Rp 150.000</strong><br/>
                  Berlaku untuk: Bandung, Cirebon, Sukabumi, dst
                </p>
              </div>

              <div className="bg-white rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 mb-1 text-sm">✅ Pulau Jawa (selain Jabodetabek & Jabar)</h5>
                <p className="text-gray-700 text-sm">
                  Minimal belanja: <strong>Rp 200.000</strong><br/>
                  Berlaku untuk: Jawa Tengah, Jawa Timur, Yogyakarta
                </p>
              </div>

              <div className="bg-white rounded-lg p-3">
                <h5 className="font-semibold text-gray-800 mb-1 text-sm">🎉 Promo Khusus</h5>
                <p className="text-gray-700 text-sm">
                  Minimal belanja: <strong>Rp 300.000</strong><br/>
                  Berlaku untuk: <strong>Seluruh Indonesia</strong> (saat ada promo)
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            4.3. Estimasi Biaya Ongkir
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 mb-3 text-sm">
              <strong>Contoh Perhitungan</strong> (untuk 1 kg, JNE Reguler):
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-3 py-2 text-left">Tujuan</th>
                    <th className="px-3 py-2 text-right">Estimasi Ongkir</th>
                    <th className="px-3 py-2 text-center">Waktu</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="px-3 py-2">Jabodetabek</td>
                    <td className="px-3 py-2 text-right">Rp 10.000 - 15.000</td>
                    <td className="px-3 py-2 text-center">1-2 hari</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Jawa Barat</td>
                    <td className="px-3 py-2 text-right">Rp 12.000 - 18.000</td>
                    <td className="px-3 py-2 text-center">2-3 hari</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Jawa Tengah & Timur</td>
                    <td className="px-3 py-2 text-right">Rp 15.000 - 25.000</td>
                    <td className="px-3 py-2 text-center">2-4 hari</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Sumatera</td>
                    <td className="px-3 py-2 text-right">Rp 25.000 - 40.000</td>
                    <td className="px-3 py-2 text-center">3-5 hari</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2">Kalimantan</td>
                    <td className="px-3 py-2 text-right">Rp 30.000 - 50.000</td>
                    <td className="px-3 py-2 text-center">3-6 hari</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Sulawesi, Maluku, Papua</td>
                    <td className="px-3 py-2 text-right">Rp 35.000 - 60.000</td>
                    <td className="px-3 py-2 text-center">4-7 hari</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-xs mt-3 italic">
              *Harga dapat berubah sewaktu-waktu sesuai tarif ekspedisi. Ongkir pasti akan ditampilkan saat checkout.
            </p>
          </div>
        </section>

        {/* Tracking Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            5. Tracking & Lacak Paket
          </h2>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📍 Cara Lacak Paket:
            </h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-purple-600">1.</span>
                <div>
                  <strong className="text-gray-800">Via Website Sahara Mart:</strong>
                  <p className="text-gray-700 text-sm mt-1">
                    Kunjungi halaman "Lacak Pesanan" → Masukkan nomor pesanan Anda → Lihat status real-time
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-purple-600">2.</span>
                <div>
                  <strong className="text-gray-800">Via WhatsApp:</strong>
                  <p className="text-gray-700 text-sm mt-1">
                    Klik link tracking yang kami kirim → Langsung terhubung ke website ekspedisi
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span className="flex-shrink-0 font-bold text-purple-600">3.</span>
                <div>
                  <strong className="text-gray-800">Via Website Ekspedisi:</strong>
                  <p className="text-gray-700 text-sm mt-1">
                    Buka website ekspedisi (JNE.co.id, jet.co.id, dll) → Masukkan nomor resi → Cek detail pengiriman
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📱 Informasi yang Anda Dapatkan:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Status pengiriman real-time (dikemas, dikirim, dalam perjalanan, dll)</li>
              <li>Lokasi paket saat ini</li>
              <li>Riwayat perjalanan paket</li>
              <li>Estimasi waktu sampai</li>
              <li>Nama kurir yang mengantar (saat out for delivery)</li>
            </ul>
          </div>
        </section>

        {/* Penerimaan Paket */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            6. Prosedur Penerimaan Paket
          </h2>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              ✅ Checklist Saat Menerima Paket:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">1. Cek Kondisi Paket Luar</strong>
                  <p className="text-gray-700 text-sm">
                    Pastikan paket tidak rusak, basah, atau terbuka. Jika ada kerusakan, JANGAN terima dan minta kurir untuk foto sebagai bukti.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">2. Verifikasi Identitas Penerima</strong>
                  <p className="text-gray-700 text-sm">
                    Pastikan nama penerima sesuai. Jika diterima orang lain, catat nama dan hubungan dengan penerima asli.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">3. Tanda Tangan Bukti Terima</strong>
                  <p className="text-gray-700 text-sm">
                    Kurir akan meminta tanda tangan sebagai bukti penerimaan. Pastikan nomor resi sesuai.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">4. Foto/Video Unboxing</strong>
                  <p className="text-gray-700 text-sm">
                    SANGAT DISARANKAN untuk merekam proses unboxing sebagai bukti jika ada kerusakan produk.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">5. Cek Kelengkapan Produk</strong>
                  <p className="text-gray-700 text-sm">
                    Pastikan semua produk yang dipesan ada di dalam paket. Cek kondisi produk, kemasan, aksesoris, dan bonus (jika ada).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" disabled />
                <div>
                  <strong className="text-gray-800">6. Laporkan Masalah (Jika Ada)</strong>
                  <p className="text-gray-700 text-sm">
                    Jika ada kerusakan atau kekurangan, segera hubungi kami dalam 1x24 jam dengan bukti foto/video.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-gray-700 font-semibold mb-2">
              ⚠️ PENTING - Tanggung Jawab Penerimaan:
            </p>
            <p className="text-gray-700 text-sm">
              Setelah Anda menandatangani bukti penerimaan dari kurir, barang dianggap telah diterima dalam kondisi baik. Klaim kerusakan atau kekurangan tanpa bukti foto/video akan sulit diproses. Oleh karena itu, SANGAT PENTING untuk cek kondisi paket sebelum tanda tangan dan merekam proses unboxing.
            </p>
          </div>
        </section>

        {/* Masalah Pengiriman */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            7. Masalah Pengiriman & Solusi
          </h2>

          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">📦 Paket Hilang dalam Pengiriman</h3>
              <p className="text-gray-700 text-sm mb-2">
                Jika paket tidak sampai setelah estimasi waktu + 3 hari kerja:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Hubungi kami via WhatsApp dengan nomor resi</li>
                <li>Kami akan koordinasi dengan ekspedisi untuk tracking lanjutan</li>
                <li>Jika paket terbukti hilang, kami akan kirim ulang atau refund penuh</li>
                <li>Proses klaim: 7-14 hari kerja</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">📋 Paket Rusak saat Diterima</h3>
              <p className="text-gray-700 text-sm mb-2">
                Jika paket diterima dalam kondisi rusak:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>JANGAN terima paket - minta kurir untuk foto kondisi</li>
                <li>Jika sudah terlanjur terima, segera foto/video kondisi paket</li>
                <li>Hubungi kami dalam 1x24 jam dengan bukti</li>
                <li>Kami akan proses retur/penggantian sesuai kebijakan return</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">🏠 Penerima Tidak Ada di Tempat</h3>
              <p className="text-gray-700 text-sm mb-2">
                Jika kurir datang tapi tidak ada yang menerima:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Kurir akan coba hubungi via telepon (pastikan nomor aktif)</li>
                <li>Kurir akan coba lagi keesokan harinya</li>
                <li>Setelah 3x kunjungan gagal, paket dikembalikan ke gudang kami</li>
                <li>Anda dapat request kirim ulang (ongkir tambahan berlaku)</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">📍 Alamat Salah/Tidak Lengkap</h3>
              <p className="text-gray-700 text-sm mb-2">
                Jika alamat yang diberikan salah atau tidak lengkap:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Paket akan dikembalikan ke gudang kami</li>
                <li>Anda bertanggung jawab atas biaya kirim ulang</li>
                <li>Update alamat dengan benar untuk pengiriman ulang</li>
                <li>Pastikan mencantumkan: nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, provinsi, kode pos, dan nomor telepon aktif</li>
              </ul>
            </div>
          </div>
        </section>

        {/* COD */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            8. COD (Cash on Delivery / Bayar di Tempat)
          </h2>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              💵 Layanan COD Sahara Mart
            </h3>

            <h4 className="font-semibold text-gray-800 mb-2">Syarat & Ketentuan COD:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Area Tersedia:</strong> Jabodetabek dan kota-kota besar di Jawa (konfirmasi saat checkout)</li>
              <li><strong>Minimal Transaksi:</strong> Rp 50.000</li>
              <li><strong>Maksimal Transaksi:</strong> Rp 5.000.000</li>
              <li><strong>Biaya COD:</strong> Rp 5.000 - 10.000 (tergantung lokasi)</li>
              <li><strong>Pembayaran:</strong> Uang pas sangat diapresiasi, kurir tidak selalu bisa kembalian besar</li>
            </ul>

            <h4 className="font-semibold text-gray-800 mb-2">Prosedur COD:</h4>
            <ol className="list-decimal pl-6 space-y-1 text-gray-700 text-sm">
              <li>Pilih metode pembayaran "COD" saat checkout</li>
              <li>Konfirmasi pesanan via WhatsApp</li>
              <li>Pesanan diproses dan dikirim tanpa perlu transfer dahulu</li>
              <li>Saat paket sampai, cek kondisi produk terlebih dahulu</li>
              <li>Bayar total tagihan (harga produk + ongkir + biaya COD) ke kurir</li>
              <li>Dapatkan bukti pembayaran dari kurir</li>
            </ol>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <p className="text-gray-700 text-sm">
                <strong>⚠️ Penting:</strong> Jika Anda menolak paket COD tanpa alasan yang jelas, akun Anda dapat di-blacklist dari layanan COD untuk transaksi selanjutnya.
              </p>
            </div>
          </div>
        </section>

        {/* Pengiriman Khusus */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            9. Layanan Pengiriman Khusus
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">⚡ Same Day Delivery</h3>
              <p className="text-gray-700 text-sm mb-2">
                <em className="text-gray-600">(Coming Soon - Dalam Pengembangan)</em>
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Dikirim di hari yang sama</li>
                <li>• Area: Jakarta & sekitarnya</li>
                <li>• Minimal: Rp 200.000</li>
                <li>• Biaya: Rp 25.000 - 50.000</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">🎁 Gift Wrapping</h3>
              <p className="text-gray-700 text-sm mb-2">
                <em className="text-gray-600">(Coming Soon - Dalam Pengembangan)</em>
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kemasan hadiah eksklusif</li>
                <li>• Kartu ucapan gratis</li>
                <li>• Biaya: Rp 15.000/paket</li>
                <li>• Request via WhatsApp saat checkout</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Force Majeure */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            10. Force Majeure & Keterlambatan
          </h2>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <p className="text-gray-700 mb-3">
              Sahara Mart dan ekspedisi tidak bertanggung jawab atas keterlambatan atau kegagalan pengiriman yang disebabkan oleh keadaan di luar kendali, termasuk:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li>Bencana alam (gempa bumi, banjir, longsor, kebakaran)</li>
              <li>Cuaca buruk ekstrem (badai, hujan deras berkepanjangan)</li>
              <li>Kerusuhan, demo, atau gangguan keamanan</li>
              <li>Pandemi atau wabah penyakit</li>
              <li>Kebijakan pemerintah (lockdown, pembatasan mobilitas)</li>
              <li>Gangguan sistem ekspedisi (server down, sistem error)</li>
              <li>Kondisi jalan rusak atau tertutup</li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm">
              Dalam kondisi force majeure, kami akan berupaya semaksimal mungkin untuk mengirimkan paket Anda dan memberikan informasi update secara berkala.
            </p>
          </div>
        </section>

        {/* Asuransi */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            11. Asuransi Pengiriman
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🛡️ Perlindungan Paket Anda
            </h3>
            <p className="text-gray-700 mb-3">
              Untuk melindungi paket Anda dari risiko kehilangan atau kerusakan, kami menyediakan layanan asuransi pengiriman:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Biaya Asuransi:</strong> 0,5% dari nilai barang (minimal Rp 2.000)</li>
              <li><strong>Coverage:</strong> Kehilangan, kerusakan, atau kekurangan barang saat pengiriman</li>
              <li><strong>Klaim:</strong> Diproses melalui ekspedisi dengan koordinasi dari Sahara Mart</li>
              <li><strong>Rekomendasi:</strong> Sangat disarankan untuk barang bernilai tinggi (&gt; Rp 500.000)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-gray-700 text-sm">
              <strong>Catatan:</strong> Tanpa asuransi, tanggung jawab ekspedisi terbatas (umumnya max 10x ongkir). Untuk barang elektronik atau barang berharga, kami SANGAT MENYARANKAN untuk mengambil asuransi.
            </p>
          </div>
        </section>

        {/* Kontak */}
        <section className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-0">
            12. Hubungi Kami
          </h2>
          <p className="text-gray-700 mb-4">
            Pertanyaan tentang pengiriman? Hubungi kami:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Sahara Mart - Customer Service Pengiriman</strong></p>
            <p>📧 Email: shipping@saharamart.com</p>
            <p>📱 WhatsApp: +62 123-4567-890</p>
            <p>📍 Alamat Gudang: [Alamat Gudang Sahara Mart]</p>
            <p>🕐 Jam Operasional: Senin - Sabtu, 08:00 - 17:00 WIB</p>
          </div>
          <div className="bg-white rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600">
              <strong>💡 Tips Tracking Cepat:</strong> Sertakan nomor pesanan atau nomor resi saat menghubungi kami untuk respon yang lebih cepat!
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 font-semibold">
            Kebijakan pengiriman ini berlaku untuk semua pembelian di Sahara Mart. Kami berhak mengubah kebijakan ini sewaktu-waktu dengan pemberitahuan di website.
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
            <a href="/return-policy" className="text-blue-600 hover:underline">Kebijakan Pengembalian</a>
            {' | '}
            <a href="/faq" className="text-blue-600 hover:underline">FAQ</a>
          </p>
        </div>
      </div>
    </div>
  );
}
