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
    category: 'Produk & Stok',
    icon: HelpCircle,
    color: 'red',
    questions: [
      {
        q: 'Bagaimana memastikan produk asli/original?',
        a: 'Semua produk kami dijamin original dari distributor resmi. Kami tidak menjual barang KW/palsu. Setiap produk dapat dilacak keasliannya.'
      },
      {
        q: 'Stok produk real-time?',
        a: 'Stok yang ditampilkan di website adalah real-time. Namun, stok dapat berubah cepat. Kami akan konfirmasi ketersediaan saat Anda checkout.'
      },
      {
        q: 'Produk habis, kapan restock?',
        a: 'Waktu restock bervariasi (1-2 minggu). Anda bisa subscribe notifikasi restock dengan menghubungi CS atau follow media sosial kami untuk update.'
      },
      {
        q: 'Bisa request produk yang tidak ada?',
        a: 'Bisa! Kirim request produk via WhatsApp. Kami akan coba sediakan jika memungkinkan dan ada demand yang cukup.'
      },
      {
        q: 'Harga di website sama dengan toko offline?',
        a: 'Harga online dan offline mungkin berbeda karena promo khusus. Namun kami selalu berusaha memberikan harga terbaik di semua channel.'
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
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Temukan jawaban untuk pertanyaan umum tentang berbelanja di Sahara Mart
        </p>
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
    </div>
  );
}
