'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Customer information state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Validate name (minimal 3 karakter, hanya huruf dan spasi)
  const validateName = (name: string): boolean => {
    setNameError('');

    if (!name.trim()) {
      setNameError('Nama harus diisi');
      return false;
    }

    if (name.trim().length < 3) {
      setNameError('Nama minimal 3 karakter');
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setNameError('Nama hanya boleh berisi huruf dan spasi');
      return false;
    }

    return true;
  };

  // Validate phone (format 08xx atau 62xx, minimal 10 digit)
  const validatePhone = (phone: string): boolean => {
    setPhoneError('');

    if (!phone.trim()) {
      setPhoneError('Nomor WhatsApp harus diisi');
      return false;
    }

    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Check if only numbers
    if (!/^\d+$/.test(cleanPhone)) {
      setPhoneError('Nomor WhatsApp hanya boleh berisi angka');
      return false;
    }

    // Check format 08xx or 62xx
    if (!cleanPhone.startsWith('08') && !cleanPhone.startsWith('62')) {
      setPhoneError('Nomor WhatsApp harus diawali 08 atau 62');
      return false;
    }

    // Check length (minimal 10 digit, maksimal 15 digit)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setPhoneError('Nomor WhatsApp harus 10-15 digit');
      return false;
    }

    return true;
  };

  // Validate address (minimal 10 karakter)
  const validateAddress = (address: string): boolean => {
    setAddressError('');

    if (!address.trim()) {
      setAddressError('Alamat pengiriman harus diisi');
      return false;
    }

    if (address.trim().length < 10) {
      setAddressError('Alamat minimal 10 karakter');
      return false;
    }

    return true;
  };

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;

    // Validate all fields
    const isNameValid = validateName(customerName);
    const isPhoneValid = validatePhone(customerPhone);
    const isAddressValid = validateAddress(customerAddress);

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
      toast.error('Mohon perbaiki data yang tidak valid');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Build WhatsApp message
      let message = `Halo, saya ingin memesan:\n\n`;
      message += `*Data Customer:*\n`;
      message += `Nama: ${customerName}\n`;
      message += `HP: ${customerPhone}\n`;
      message += `Alamat: ${customerAddress}\n`;
      if (customerNotes) {
        message += `Catatan: ${customerNotes}\n`;
      }
      message += `\n*Detail Pesanan:*\n`;

      items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Jumlah: ${item.quantity} pcs\n`;
        message += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
        message += `   Subtotal: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n\n`;
      });

      message += `*Total: Rp ${total.toLocaleString('id-ID')}*\n\n`;
      message += `Mohon konfirmasi ketersediaan produk dan ongkos kirim. Terima kasih!`;

      // Create order in database first
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_notes: customerNotes,
        cart: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_cost: 0, // Will be calculated later
        payment_method: 'whatsapp',
        whatsapp_message: message,
        honeypot: '' // Anti-bot honeypot field (should always be empty)
      };

      console.log('📤 Sending order to database...', {
        customerName,
        customerPhone,
        payload: orderPayload
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      console.log('📨 Response status:', response.status);

      const data = await response.json();
      console.log('📨 Response data:', data);

      if (response.ok) {
        const order = data.order;

        console.log('✅ Order created successfully:', order.order_number);

        // Show alert to confirm order was created
        alert(`✅ Pesanan berhasil dibuat!\n\nOrder Number: ${order.order_number}\n\nAnda akan diarahkan ke halaman tracking.`);

        // Clear cart immediately after successful order
        clearCart();

        // Add order number to WhatsApp message
        const finalMessage = `${message}\n\n📋 *Order #${order.order_number}*`;

        // Show success message
        toast.success(`Order berhasil dibuat! Order Number: ${order.order_number}`, {
          duration: 5000,
        });

        // Open WhatsApp
        window.open(
          `https://wa.me/6282267567946?text=${encodeURIComponent(finalMessage)}`,
          '_blank'
        );

        // Navigate to tracking page
        setTimeout(() => {
          router.push(`/tracking/${order.order_number}`);
        }, 500);
      } else {
        // Show error to user
        console.error('❌ Failed to create order:', data);
        toast.error(data.message || data.error || 'Gagal membuat pesanan. Silakan coba lagi.');

        // If it's a validation error, don't proceed with WhatsApp
        if (response.status === 400 || response.status === 429) {
          return;
        }

        // If it's a server error, still allow WhatsApp checkout as fallback
        console.log('Proceeding with WhatsApp only as fallback...');
        window.open(
          `https://wa.me/6282267567946?text=${encodeURIComponent(message)}`,
          '_blank'
        );
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Fallback: open WhatsApp anyway
      let message = `Halo, saya ingin memesan:\n\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Jumlah: ${item.quantity} pcs\n`;
        message += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n\n`;
      });
      message += `*Total: Rp ${total.toLocaleString('id-ID')}*`;

      window.open(
        `https://wa.me/6282161173844?text=${encodeURIComponent(message)}`,
        '_blank'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-sm">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Keranjang Belanja Kosong
              </h1>
              <p className="text-gray-600 mb-8">
                Anda belum menambahkan produk ke keranjang. Yuk, mulai belanja sekarang!
              </p>
              <Link
                href="/katalog"
                className="inline-block bg-[#E60000] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#CC0000] transition-colors"
              >
                Mulai Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#E60000] mb-4 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Lanjut Belanja
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Keranjang Belanja</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} item{itemCount > 1 ? 's' : ''} dalam keranjang
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">📦</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            href={`/produk/${item.id}`}
                            className="font-semibold text-gray-800 hover:text-[#E60000] line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.categories?.icon} {item.categories?.name}
                          </p>
                          <p className="text-sm text-gray-500">Berat: {item.weight}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold min-w-[40px] text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-600 ml-2 font-medium">
                            Max: {item.stock}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-xl font-bold text-[#E60000]">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                  clearCart();
                }
              }}
              className="mt-4 text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              Kosongkan Keranjang
            </button>
          </div>

          {/* Cart Summary & Customer Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Pembeli</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setNameError('');
                    }}
                    onBlur={() => validateName(customerName)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      nameError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {nameError && (
                    <p className="text-xs text-red-600 mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      setPhoneError('');
                    }}
                    onBlur={() => validatePhone(customerPhone)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400 ${
                      phoneError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {phoneError ? (
                    <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Format: 08xx atau 62xx</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Alamat Pengiriman *
                  </label>
                  <textarea
                    placeholder="Masukkan alamat lengkap untuk pengiriman"
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      setAddressError('');
                    }}
                    onBlur={() => validateAddress(customerAddress)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none ${
                      addressError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {addressError && (
                    <p className="text-xs text-red-600 mt-1">{addressError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan untuk pesanan Anda"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E60000] focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Belanja</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                  <span className="font-semibold">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkir</span>
                  <span className="text-sm text-green-600 font-semibold">
                    Akan dihitung saat checkout
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#E60000]">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                disabled={isCheckingOut}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Checkout via WhatsApp'
                )}
              </button>

              <Link
                href="/katalog"
                className="block w-full text-center border-2 border-[#E60000] text-[#E60000] py-4 rounded-xl font-bold hover:bg-[#FEE2E2] transition-colors"
              >
                Lanjut Belanja
              </Link>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>💡 Gratis Ongkir</strong> untuk belanja minimal Rp 100.000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}