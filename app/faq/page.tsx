'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { ChevronDown, ChevronUp, Search, ShoppingCart, Truck, CreditCard, RefreshCw, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Pemesanan',
    icon: ShoppingCart,
    color: 'blue',
    questions: [
      {
        q: 'Bagaimana cara memesan produk?',
        a: 'Pilih produk yang Anda inginkan, klik "Tambah ke Keranjang", lalu klik icon keranjang di pojok kanan atas. Klik "Checkout via WhatsApp" untuk menyelesaikan pesanan melalui WhatsApp.'
      },
      {
        q: 'Apakah bisa pesan tanpa checkout WhatsApp?',
        a: 'Saat ini, semua pemesanan harus melalui WhatsApp untuk memastikan komunikasi yang lancar dan konfirmasi pesanan yang akurat. Ini juga memudahkan Anda untuk bertanya langsung tentang produk.'
      },
      {
        q: 'Minimal pemesanan berapa?',
        a: 'Tidak ada minimal pemesanan. Anda bisa membeli 1 item saja. Namun, kami menawarkan free ongkir untuk pembelian di atas Rp 100.000 untuk area tertentu.'
      },
      {
        q: 'Bagaimana cara membatalkan pesanan?',
        a: 'Jika pesanan belum diproses (status: Pending), Anda bisa membatalkan dengan menghubungi kami via WhatsApp. Jika sudah diproses, pembatalan akan dikenakan biaya sesuai kebijakan.'
      },
      {
        q: 'Apakah data pemesanan saya aman?',
        a: 'Ya, semua data Anda dienkripsi dan disimpan dengan aman. Kami tidak membagikan informasi Anda kepada pihak ketiga tanpa izin. Lihat Kebijakan Privasi kami untuk detail lebih lanjut.'
      }
    ]
  },
  {
    category: 'Pembayaran',
    icon: CreditCard,
    color: 'green',
    questions: [
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'Kami menerima: (1) Transfer Bank (BCA, Mandiri, BNI, BRI), (2) COD (Bayar di Tempat) untuk area tertentu. Payment gateway online (GoPay, OVO, dll) akan segera hadir!'
      },
      {
        q: 'Berapa lama harus membayar setelah pesan?',
        a: 'Pembayaran harus dilakukan maksimal 1x24 jam setelah konfirmasi pesanan. Jika belum dibayar, pesanan akan otomatis dibatalkan.'
      },
      {
        q: 'Bagaimana cara konfirmasi pembayaran?',
        a: 'Setelah transfer, kirim bukti pembayaran (screenshot) via WhatsApp ke nomor yang tertera di detail pesanan Anda. Tim kami akan konfirmasi dalam 1-2 jam kerja.'
      },
      {
        q: 'Apakah bisa bayar sebagian (DP)?',
        a: 'Untuk saat ini, pembayaran harus lunas sebelum barang dikirim. Fitur DP/cicilan akan tersedia di masa mendatang.'
      },
      {
        q: 'Apakah ada biaya tambahan?',
        a: 'Harga yang tertera sudah termasuk PPN. Biaya tambahan hanya ongkos kirim yang dihitung saat checkout. Tidak ada biaya tersembunyi!'
      }
    ]
  },
  {
    category: 'Pengiriman',
    icon: Truck,
    color: 'purple',
    questions: [
      {
        q: 'Berapa lama pengiriman?',
        a: 'Proses: 1-2 hari kerja setelah pembayaran dikonfirmasi. Pengiriman: 2-5 hari kerja tergantung lokasi. Total maksimal 7 hari kerja.'
      },
      {
        q: 'Bagaimana cara melacak pesanan?',
        a: 'Setelah pesanan dikirim, Anda akan menerima nomor resi via WhatsApp. Anda juga bisa cek status pesanan di halaman "Lacak Pesanan" dengan memasukkan nomor pesanan Anda.'
      },
      {
        q: 'Apakah ada free ongkir?',
        a: 'Ya! Free ongkir untuk pembelian di atas Rp 100.000 untuk area Jabodetabek. Untuk area lain, cek promo yang sedang berlangsung.'
      },
      {
        q: 'Barang rusak saat pengiriman, bagaimana?',
        a: 'Foto/video unboxing paket saat terima barang. Jika ada kerusakan, laporkan dalam 1x24 jam via WhatsApp dengan bukti foto/video. Kami akan proses penggantian atau refund.'
      },
      {
        q: 'Bisa kirim ke luar kota/pulau?',
        a: 'Bisa! Kami kirim ke seluruh Indonesia melalui JNE, J&T, SiCepat, dan Anteraja. Ongkir dihitung otomatis saat checkout berdasarkan berat dan jarak.'
      },
      {
        q: 'Pengiriman same day/instant tersedia?',
        a: 'Untuk saat ini belum. Kami sedang mempertimbangkan layanan same day delivery untuk area tertentu di masa mendatang.'
      }
    ]
  },
  {
    category: 'Pengembalian & Penukaran',
    icon: RefreshCw,
    color: 'orange',
    questions: [
      {
        q: 'Bisa retur/tukar barang?',
        a: 'Bisa! Anda dapat mengembalikan barang dalam 7 hari jika: (1) Produk rusak/cacat, (2) Salah kirim, (3) Tidak sesuai deskripsi. Barang harus dalam kondisi baru dengan kemasan asli.'
      },
      {
        q: 'Produk apa yang tidak bisa diretur?',
        a: 'Produk yang tidak dapat dikembalikan: (1) Makanan/minuman yang sudah dibuka, (2) Produk yang sudah digunakan, (3) Produk sale/clearance (kecuali cacat produksi), (4) Produk tanpa kemasan asli.'
      },
      {
        q: 'Bagaimana cara retur barang?',
        a: 'Hubungi CS via WhatsApp → Kirim foto/video produk → Dapatkan alamat return → Kirim barang kembali → Refund diproses 7-14 hari kerja setelah barang kami terima.'
      },
      {
        q: 'Ongkir retur ditanggung siapa?',
        a: 'Jika kesalahan dari kami (salah kirim, barang rusak), ongkir retur ditanggung kami. Jika alasan pribadi (tidak suka warna, salah ukuran), ongkir ditanggung pembeli.'
      },
      {
        q: 'Berapa lama proses refund?',
        a: 'Setelah barang return kami terima dan cek kondisi, refund diproses dalam 7-14 hari kerja ke rekening yang Anda berikan.'
      }
    ]
  },
  {
    category: 'Produk & Kualitas',
    icon: HelpCircle,
    color: 'red',
    questions: [
      {
        q: 'Bagaimana memastikan produk asli/original?',
        a: 'Semua produk kami dijamin original dari distributor resmi. Kami tidak menjual barang KW/palsu. Setiap produk dapat dilacak keasliannya dengan barcode yang tertera pada kemasan.'
      },
      {
        q: 'Produk habis, kapan restock?',
        a: 'Waktu restock bervariasi (1-2 minggu). Anda bisa subscribe notifikasi restock dengan menghubungi CS atau follow media sosial kami untuk update. Admin akan dinotifikasi otomatis saat stok produk mencapai level rendah untuk memastikan restocking tepat waktu.'
      },
      {
        q: 'Bisa request produk yang tidak ada?',
        a: 'Bisa! Kirim request produk via WhatsApp. Kami akan coba sediakan jika memungkinkan dan ada demand yang cukup. Setiap request akan kami evaluasi dan pertimbangkan untuk menambah variasi produk kami.'
      },
      {
        q: 'Harga di website sama dengan toko offline?',
        a: 'Harga online dan offline mungkin berbeda karena promo khusus. Namun kami selalu berusaha memberikan harga terbaik di semua channel. Follow media sosial kami untuk mendapatkan info promo eksklusif!'
      },
      {
        q: 'Apakah ada garansi produk?',
        a: 'Garansi tergantung jenis produk. Produk elektronik biasanya memiliki garansi distributor 1-2 tahun. Untuk produk makanan/minuman, kami jamin kualitas dan tanggal kadaluarsa yang masih lama. Cek detail garansi di deskripsi masing-masing produk.'
      },
      {
        q: 'Bagaimana standar kualitas produk di Sahara Mart?',
        a: 'Semua produk melalui quality control ketat sebelum dipasarkan. Kami hanya bekerja sama dengan supplier dan distributor resmi yang terpercaya. Produk rusak atau cacat dapat dikembalikan 100%.'
      }
    ]
  },
  {
    category: 'Akun & Teknis',
    icon: MessageCircle,
    color: 'indigo',
    questions: [
      {
        q: 'Apakah harus daftar akun untuk belanja?',
        a: 'Tidak wajib! Saat ini Anda bisa belanja sebagai guest tanpa registrasi. Checkout langsung via WhatsApp.'
      },
      {
        q: 'Website error/tidak bisa diakses, bagaimana?',
        a: 'Coba: (1) Refresh halaman (Ctrl+R), (2) Clear cache browser, (3) Gunakan browser lain, (4) Cek koneksi internet Anda. Jika masih error, hubungi kami via WhatsApp.'
      },
      {
        q: 'Keranjang belanja hilang setelah close browser?',
        a: 'Keranjang disimpan di browser Anda (cookies). Jika Anda clear cookies atau private browsing, keranjang akan hilang. Pastikan don\'t delete cookies agar keranjang tersimpan.'
      },
      {
        q: 'Nomor WhatsApp tidak aktif/tidak bisa dihubungi?',
        a: 'Jika nomor WA kami tidak aktif, coba hubungi via email: support@saharamart.com atau social media kami. Kami akan update nomor WA baru jika ada perubahan.'
      },
      {
        q: 'Ada promo/diskon?',
        a: 'Ya! Kami sering ada promo spesial: (1) Flash sale setiap hari, (2) Diskon hari raya, (3) Voucher pelanggan setia. Follow Instagram kami @saharamart untuk update promo!'
      },
      {
        q: 'Bagaimana cara menggunakan barcode scanner?',
        a: 'Di halaman admin, klik tombol "Scan Barcode" untuk mengaktifkan kamera. Arahkan kamera ke barcode produk, dan sistem akan otomatis mencari produk tersebut. Fitur ini memudahkan admin untuk mencari produk dengan cepat.'
      }
    ]
  },
  {
    category: 'Keamanan & Privasi',
    icon: HelpCircle,
    color: 'red',
    questions: [
      {
        q: 'Bagaimana Sahara Mart melindungi data pribadi saya?',
        a: 'Kami sangat serius dalam melindungi data Anda. Semua data dienkripsi dengan HTTPS, disimpan di server aman (Supabase), dan tunduk pada UU PDP Indonesia. Kami tidak pernah menjual data Anda ke pihak ketiga. Lihat Kebijakan Privasi untuk detail lengkap.'
      },
      {
        q: 'Apakah website ini aman untuk transaksi?',
        a: 'Ya, sangat aman! Website kami dilengkapi dengan: (1) Enkripsi HTTPS, (2) CSRF Protection untuk mencegah serangan, (3) Rate limiting untuk melindungi dari spam, (4) Database encryption, (5) Regular security audit. Semua transaksi melalui WhatsApp juga dienkripsi end-to-end.'
      },
      {
        q: 'Apa yang dilakukan dengan informasi yang saya berikan?',
        a: 'Informasi Anda digunakan hanya untuk: (1) Memproses pesanan, (2) Mengirim produk, (3) Komunikasi terkait pesanan, (4) Meningkatkan layanan kami. Kami TIDAK menggunakan data Anda untuk spam atau menjualnya ke pihak lain.'
      },
      {
        q: 'Apakah cookies digunakan? Untuk apa?',
        a: 'Ya, kami menggunakan cookies untuk: (1) Menyimpan keranjang belanja, (2) Mengingat preferensi Anda, (3) Keamanan (CSRF token), (4) Analytics untuk meningkatkan website. Anda dapat mengatur atau menolak cookies di browser Anda.'
      },
      {
        q: 'Bagaimana cara menghapus data pribadi saya?',
        a: 'Anda memiliki hak untuk menghapus data pribadi Anda. Hubungi kami via WhatsApp atau email dengan permintaan penghapusan data. Kami akan proses dalam 14 hari kerja sesuai UU PDP Indonesia. Data transaksi yang diperlukan untuk kepatuhan hukum akan tetap disimpan sesuai regulasi.'
      }
    ]
  },
  {
    category: 'Stok & Inventory',
    icon: HelpCircle,
    color: 'purple',
    questions: [
      {
        q: 'Bagaimana cara kerja notifikasi stok rendah?',
        a: 'Admin akan menerima notifikasi otomatis ketika stok produk mencapai 5 unit atau kurang. Notifikasi muncul di dashboard admin untuk memastikan restocking tepat waktu dan mencegah kehabisan stok.'
      },
      {
        q: 'Apakah ada riwayat perubahan stok?',
        a: 'Ya! Sistem kami mencatat setiap penambahan dan pengurangan stok secara otomatis. Admin dapat melihat riwayat lengkap termasuk tanggal, jumlah perubahan, dan alasan (penjualan, restocking, adjustment) di dashboard admin.'
      },
      {
        q: 'Bagaimana cara menambah stok produk?',
        a: 'Admin dapat menambah stok melalui dashboard admin dengan fitur "Tambah Stok". Setiap penambahan akan tercatat otomatis dengan timestamp dan jumlah, memastikan akuntabilitas dan audit trail yang jelas.'
      },
      {
        q: 'Apakah stok tersinkronisasi real-time?',
        a: 'Ya! Stok diupdate secara real-time. Ketika pelanggan melakukan pemesanan atau admin mengubah stok, perubahan langsung tercermin di database dan website. Ini mencegah overselling dan memastikan keakuratan stok.'
      }
    ]
  },
  {
    category: 'Fitur Admin',
    icon: MessageCircle,
    color: 'indigo',
    questions: [
      {
        q: 'Bagaimana cara mengakses dashboard admin?',
        a: 'Klik menu hamburger di pojok kiri atas, pilih "Admin Dashboard". Anda akan diarahkan ke halaman admin dengan berbagai fitur manajemen produk, kategori, pesanan, dan analytics.'
      },
      {
        q: 'Fitur apa saja yang tersedia di admin dashboard?',
        a: 'Admin dashboard menyediakan: (1) Manajemen Produk (CRUD, barcode scanner), (2) Manajemen Kategori, (3) Manajemen Pesanan & Tracking, (4) Analytics & Reporting, (5) Stok Management dengan notifikasi, (6) CSV Upload untuk bulk import, (7) Search & Filter canggih.'
      },
      {
        q: 'Bagaimana cara upload produk massal via CSV?',
        a: 'Di halaman admin, pilih "Upload CSV". Format CSV harus memiliki kolom: name, category, price, stock, unit, barcode (opsional). Download template CSV yang disediakan, isi data produk, lalu upload. Sistem akan memproses dan import semua produk sekaligus.'
      },
      {
        q: 'Apakah bisa mengedit produk yang sudah ada?',
        a: 'Ya! Di halaman admin, klik produk yang ingin diedit, ubah informasi (nama, harga, stok, kategori, gambar, dll), lalu klik "Update". Perubahan akan langsung tersimpan dan terlihat di website.'
      },
      {
        q: 'Bagaimana cara melihat analytics dan laporan?',
        a: 'Dashboard admin menampilkan analytics real-time termasuk: (1) Total penjualan, (2) Produk terlaris, (3) Revenue trends, (4) Kategori populer, (5) Status pesanan. Data diupdate otomatis untuk membantu pengambilan keputusan bisnis.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat =>
    !selectedCategory || cat.category === selectedCategory
  ).filter(cat => cat.questions.length > 0);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'bg-blue-500',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'bg-green-500',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'bg-purple-500',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'bg-orange-500',
      hover: 'hover:bg-orange-100'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'bg-red-500',
      hover: 'hover:bg-red-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      icon: 'bg-indigo-500',
      hover: 'hover:bg-indigo-100'
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ❓ Pertanyaan yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
          Temukan jawaban untuk pertanyaan umum tentang berbelanja di Sahara Mart
        </p>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            📚 {faqs.reduce((acc, cat) => acc + cat.questions.length, 0)} Pertanyaan
          </span>
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            🗂️ {faqs.length} Kategori
          </span>
          <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
            🔄 Update: 16 Jan 2026
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari pertanyaan... (misal: 'cara pesan', 'pengiriman', 'retur')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-[#E60000] focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            !selectedCategory
              ? 'bg-[#E60000] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua Kategori
        </button>
        {faqs.map((cat) => {
          const Icon = cat.icon;
          const colors = colorClasses[cat.color as keyof typeof colorClasses];
          return (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                selectedCategory === cat.category
                  ? `${colors.bg} ${colors.text} ${colors.border} border-2`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.category}
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="space-y-8">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category) => {
            const Icon = category.icon;
            const colors = colorClasses[category.color as keyof typeof colorClasses];

            return (
              <div key={category.category}>
                <div className={`flex items-center gap-3 mb-4 ${colors.text}`}>
                  <div className={`${colors.icon} p-2 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                  <span className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.questions.length} pertanyaan
                  </span>
                </div>

                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const key = `${category.category}-${index}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={index}
                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                          isOpen
                            ? `${colors.border} ${colors.bg}`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(category.category, index)}
                          className={`w-full px-6 py-4 flex items-start justify-between gap-4 text-left ${colors.hover} transition-colors`}
                        >
                          <span className="font-semibold text-gray-800 flex-1">
                            {faq.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className={`w-5 h-5 flex-shrink-0 ${colors.text}`} />
                          ) : (
                            <ChevronDown className="w-5 h-5 flex-shrink-0 text-gray-400" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 pt-2">
                            <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-500">
              Coba kata kunci lain atau hubungi kami langsung via WhatsApp
            </p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#E60000] to-red-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">
          Tidak Menemukan Jawaban?
        </h3>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Tim customer service kami siap membantu Anda 24/7 via WhatsApp.
          Dapatkan respon cepat untuk pertanyaan Anda!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://wa.me/621234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#E60000] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Chat via WhatsApp
          </a>
          <a
            href="mailto:support@saharamart.com"
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors"
          >
            📧 Email Support
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">1-2 jam</div>
          <div className="text-gray-600">Waktu Respon CS</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-gray-600">Layanan WhatsApp</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
          <div className="text-gray-600">Kepuasan Pelanggan</div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          💡 Tips Berbelanja di Sahara Mart
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-green-600">✅</span> Sebelum Memesan
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-6">
              <li>• Pastikan stok tersedia di halaman produk</li>
              <li>• Cek detail produk, harga, dan spesifikasi</li>
              <li>• Siapkan alamat lengkap untuk pengiriman</li>
              <li>• Screenshot produk jika perlu referensi</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-blue-600">📦</span> Saat Menerima Paket
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-6">
              <li>• Cek kondisi paket sebelum terima</li>
              <li>• Foto/video proses unboxing sebagai bukti</li>
              <li>• Periksa kelengkapan dan kondisi produk</li>
              <li>• Laporkan kerusakan dalam 1x24 jam</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-orange-600">💳</span> Pembayaran Aman
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-6">
              <li>• Transfer ke rekening resmi Sahara Mart</li>
              <li>• Simpan bukti transfer dengan baik</li>
              <li>• Konfirmasi pembayaran via WhatsApp</li>
              <li>• Jangan transfer ke rekening pribadi</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-purple-600">🎁</span> Hemat Lebih Banyak
            </h4>
            <ul className="text-sm text-gray-700 space-y-1 ml-6">
              <li>• Manfaatkan free ongkir min. Rp 100.000</li>
              <li>• Follow Instagram untuk promo eksklusif</li>
              <li>• Gabung grup WhatsApp untuk flash sale</li>
              <li>• Belanja saat ada diskon hari raya</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Links */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          📄 Dokumen Terkait
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/privacy"
            className="bg-white border-2 border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            🔒 Kebijakan Privasi
          </a>
          <a
            href="/terms"
            className="bg-white border-2 border-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            📜 Syarat & Ketentuan
          </a>
          <a
            href="/return-policy"
            className="bg-white border-2 border-orange-200 text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            🔄 Kebijakan Pengembalian
          </a>
          <a
            href="/shipping-policy"
            className="bg-white border-2 border-purple-200 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            🚚 Kebijakan Pengiriman
          </a>
        </div>
      </div>
    </div>
  );
}
