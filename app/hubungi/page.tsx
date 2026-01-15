'use client';

import { MapPin, MessageSquare, Phone, ChevronDown } from 'lucide-react';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build WhatsApp message
      const waMessage = `*Pesan Baru dari Website*\n\n` +
        `*Nama:* ${formData.name}\n` +
        `*Email:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.phone}\n` +
        `*Subjek:* ${formData.subject || 'Lainnya'}\n\n` +
        `*Pesan:*\n${formData.message}`;

      // Open WhatsApp
      window.open(
        `https://wa.me/6282267567946?text=${encodeURIComponent(waMessage)}`,
        '_blank'
      );

      // Show success message
      toast.success('Pesan akan dikirim via WhatsApp. Terima kasih!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-['Poppins'] text-[#374151]">
      {/* 1. Header Banner Merah - Lebih Compact */}
      <section className="bg-[#E60000] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Hubungi Kami</h1>
          <p className="text-white/90 text-base">Kami siap membantu Anda</p>
        </div>
      </section>

      {/* 2. Konten Utama (2 Kolom) - NO OVERLAP */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Kolom Kiri: Informasi Kontak */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#1F2937] mb-8">Informasi Kontak</h2>
              
              <div className="space-y-6">
                {/* Card: Kantor Pusat */}
                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                  <div className="bg-[#FEE2E2] p-3 rounded-full text-[#E60000] flex-shrink-0">
                    <MapPin size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-base mb-2">Kantor Pusat</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      Hapesong Baru, Batang Toru<br />
                      Tapanuli Selatan, North Sumatra 22738<br />
                      Indonesia
                    </p>
                  </div>
                </div>

                {/* Card: WhatsApp CS */}
                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                  <div className="bg-[#FEE2E2] p-3 rounded-full text-[#E60000] flex-shrink-0">
                    <MessageSquare size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1F2937] text-base mb-2">WhatsApp Customer Service</h3>
                    <p className="text-sm text-[#4B5563] mb-3 font-medium">+62 822-6756-7946</p>
                    <a
                      href="https://wa.me/6282267567946?text=Halo%20Sahara%20Mart%2C%20saya%20butuh%20bantuan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#25D366] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#20BA5A] transition-colors"
                    >
                      Chat Sekarang
                    </a>
                  </div>
                </div>

                {/* Card: Email */}
                <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                  <div className="bg-[#FEE2E2] p-3 rounded-full text-[#E60000] flex-shrink-0">
                    <Phone size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F2937] text-base mb-2">Email</h3>
                    <p className="text-sm text-[#4B5563] font-medium mb-1">saharamart12@gmail.com</p>
                    <p className="text-xs text-[#9CA3AF]">Senin - Minggu: 07:00 - 22:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Form Kirim Pesan */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#1F2937] mb-8">Kirim Pesan</h2>
              
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-5">

                {/* Input: Nama Lengkap */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#1F2937]">
                    Nama Lengkap <span className="text-[#E60000]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-4 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all placeholder:text-[#9CA3AF]"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                </div>

                {/* Input: Email */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#1F2937]">
                    Alamat Email <span className="text-[#E60000]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-4 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all placeholder:text-[#9CA3AF]"
                    placeholder="contoh@email.com"
                    required
                  />
                </div>

                {/* Input: WhatsApp */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#1F2937]">
                    Nomor WhatsApp <span className="text-[#E60000]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-4 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all placeholder:text-[#9CA3AF]"
                    placeholder="0821-xxxx-xxxx"
                    required
                  />
                </div>

                {/* Select: Subjek */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2 text-[#1F2937]">
                    Subjek <span className="text-[#E60000]">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-4 pr-10 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Pilih subjek pesan</option>
                    <option value="Keluhan Produk">Keluhan Produk</option>
                    <option value="Informasi Produk">Informasi Produk</option>
                    <option value="Kerjasama">Kerjasama</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-[42px] text-[#9CA3AF] pointer-events-none" size={18} />
                </div>

                {/* Textarea: Pesan */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#1F2937]">
                    Pesan <span className="text-[#E60000]">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl py-3 px-4 text-sm text-[#1F2937] focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] outline-none transition-all h-28 resize-none placeholder:text-[#9CA3AF]"
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  />
                </div>

                {/* Button Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E60000] text-white py-3 rounded-xl font-bold text-base hover:bg-[#CC0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section Lokasi - Setelah Form */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-[#1F2937] text-center mb-8">Lokasi Kantor Pusat</h2>
          
          {/* Container Peta */}
          <div className="w-full h-[450px] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15951.106842421714!2d99.05609447265913!3d1.4862419409545415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x302cb248cb08b191%3A0xc12b1c6c98492bc7!2sWek%20I%20Batang%20Toru%2C%20Kec.%20Batang%20Toru%2C%20Kabupaten%20Tapanuli%20Selatan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1735903063851!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Sahara Mart"
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="font-bold text-[#1F2937] text-base mb-1">Wek I Batang Toru</p>
            <p className="text-sm text-[#6B7280]">Kec. Batang Toru, Kabupaten Tapanuli Selatan, Sumatera Utara 22738</p>
          </div>
        </div>
      </section>
    </main>
  );
}