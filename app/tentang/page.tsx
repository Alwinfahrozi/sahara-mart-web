import { Target, Eye, Award, Users, TrendingUp, Heart } from 'lucide-react';

export default function TentangKami() {
  return (
    <div>
      {/* Hero Section */}
      {/* Hero Section */}
<section className="bg-gradient-to-r from-[#E60000] to-[#cc0000] text-white py-16">
  <div className="container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tentang Sahara Mart</h1>
    <p className="text-xl font-medium text-white/90 max-w-3xl mx-auto">
      Tumbuh Bersama Masyarakat Sejak 2023
    </p>
  </div>
</section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
             <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
  Tumbuh Bersama Masyarakat
</h2>
<div className="space-y-4 text-gray-700 leading-relaxed">
  <p className="font-normal">
    Sahara Mart dimulai dari sebuah toko kelontong kecil di tahun 2023 yang kini telah berkembang
    menjadi minimarket modern yang melayani kebutuhan masyarakat dengan lengkap.
  </p>
                <p>
                  Kami percaya bahwa setiap keluarga Indonesia berhak mendapatkan akses mudah terhadap
                  produk-produk berkualitas. Berlokasi di Hapesong Baru, Batang Toru, Tapanuli Selatan,
                  Sahara Mart hadir untuk memenuhi kebutuhan sehari-hari Anda dengan lengkap.
                </p>
                <p>
                  Tidak hanya menyediakan produk dari brand ternama, kami juga mendukung UMKM lokal
                  dengan memberikan ruang bagi produk-produk lokal berkualitas untuk dipasarkan lebih luas.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FEE2E2] p-8 rounded-xl text-center">
                <p className="text-4xl font-bold text-[#E60000] mb-2">2023</p>
                <p className="text-gray-600">Tahun Berdiri</p>
              </div>
              <div className="bg-[#FEE2E2] p-8 rounded-xl text-center">
                <p className="text-4xl font-bold text-[#E60000] mb-2">6000+</p>
                <p className="text-gray-600">Produk Tersedia</p>
              </div>
              <div className="bg-[#FEE2E2] p-8 rounded-xl text-center">
                <p className="text-4xl font-bold text-[#E60000] mb-2">7 Hari</p>
                <p className="text-gray-600">Buka Seminggu</p>
              </div>
              <div className="bg-[#FEE2E2] p-8 rounded-xl text-center">
                <p className="text-4xl font-bold text-[#E60000] mb-2">15 Jam</p>
                <p className="text-gray-600">Operasional/Hari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Visi & Misi Kami</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Visi */}
            <div className="bg-white p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12 bg-[#E60000] rounded-full"></div>
                <Eye className="w-8 h-8 text-[#E60000]" />
                <h3 className="text-xl font-bold text-gray-800">Visi</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menjadi minimarket pilihan utama masyarakat Tapanuli Selatan dengan
                pelayanan terbaik dan produk lengkap yang berkualitas.
              </p>
            </div>

            {/* Misi 1 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12 bg-[#E60000] rounded-full"></div>
                <Target className="w-8 h-8 text-[#E60000]" />
                <h3 className="text-xl font-bold text-gray-800">Misi 1</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menyediakan produk berkualitas dengan harga kompetitif yang dapat dijangkau 
                oleh seluruh lapisan masyarakat.
              </p>
            </div>

            {/* Misi 2 */}
            <div className="bg-white p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-12 bg-[#E60000] rounded-full"></div>
                <Users className="w-8 h-8 text-[#E60000]" />
                <h3 className="text-xl font-bold text-gray-800">Misi 2</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Memberikan pengalaman belanja yang nyaman, cepat, dan menyenangkan dengan 
                pelayanan ramah dan profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Keunggulan Sahara Mart
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-[#E60000] transition-all hover:shadow-lg group">
              <div className="bg-[#FEE2E2] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-3 text-gray-800">Produk Terjamin</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Semua produk yang kami jual telah melalui proses seleksi ketat untuk 
                memastikan kualitas dan keamanan.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-[#E60000] transition-all hover:shadow-lg group">
              <div className="bg-[#FEE2E2] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-3 text-gray-800">Harga Kompetitif</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kami berkomitmen memberikan harga terbaik dengan promo dan diskon menarik 
                setiap minggunya.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-[#E60000] transition-all hover:shadow-lg group">
              <div className="bg-[#FEE2E2] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-3 text-gray-800">Layanan Ramah</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tim kami terlatih untuk memberikan pelayanan terbaik dan membantu Anda 
                menemukan produk yang dibutuhkan.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-[#E60000] transition-all hover:shadow-lg group">
              <div className="bg-[#FEE2E2] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-[#E60000]" />
              </div>
              <h3 className="font-bold mb-3 text-gray-800">Dukungan UMKM Lokal</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kami bangga mendukung produk lokal berkualitas dan membantu UMKM Indonesia 
                berkembang lebih luas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#E60000] to-[#cc0000] py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Keluarga Sahara Mart</h2>
          <p className="text-xl mb-8 text-white/90">
            Kunjungi toko kami atau belanja online untuk pengalaman berbelanja yang lebih mudah
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white text-[#E60000] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Cari Toko Terdekat
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Lihat Katalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}