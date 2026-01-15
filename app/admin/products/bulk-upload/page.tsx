'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

type ParsedProduct = {
  name: string;
  category_id: number;
  price: number;
  original_price?: number;
  stock: number;
  weight?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
};

type UploadResult = {
  total: number;
  successful: number;
  failed: number;
};

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadErrors, setUploadErrors] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download template XLSX
  const downloadTemplate = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Template data dengan contoh sesuai format user
    const templateData = [
      {
        'Kode Item': '0001',
        'Barcode': '0001',
        'Nama Item': 'SEL PANCING',
        'Jenis': 'PRT',
        'Merek': 'PRT',
        'Rak': 'INV',
        'Tipe Item': 'INV',
        'Harga Pokok': 900,
        'Harga Jual': 70000,
        'Satuan': 'PCS',
        'Keterangan': '',
      },
      {
        'Kode Item': '0002',
        'Barcode': '0002',
        'Nama Item': 'CUPS MINUM TRANSPARAN',
        'Jenis': 'PRT',
        'Merek': 'PRT',
        'Rak': 'INV',
        'Tipe Item': 'INV',
        'Harga Pokok': 13600,
        'Harga Jual': 18000,
        'Satuan': 'PCS',
        'Keterangan': '',
      },
      {
        'Kode Item': '0004',
        'Barcode': '0004',
        'Nama Item': 'PENERUS 3,5/5 BULAT',
        'Jenis': 'PRT',
        'Merek': 'PRT',
        'Rak': 'INV',
        'Tipe Item': 'INV',
        'Harga Pokok': 66600,
        'Harga Jual': 88000,
        'Satuan': 'PCS',
        'Keterangan': '',
      },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Kode Item
      { wch: 15 }, // Barcode
      { wch: 35 }, // Nama Item
      { wch: 10 }, // Jenis
      { wch: 15 }, // Merek
      { wch: 10 }, // Rak
      { wch: 12 }, // Tipe Item
      { wch: 15 }, // Harga Pokok
      { wch: 15 }, // Harga Jual
      { wch: 10 }, // Satuan
      { wch: 30 }, // Keterangan
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Add instructions sheet
    const instructions = [
      ['INSTRUKSI PENGGUNAAN TEMPLATE BULK UPLOAD PRODUK - SAHARA MART'],
      [''],
      ['FORMAT KOLOM EXCEL:'],
      [''],
      ['1. KOLOM WAJIB DIISI (Required):'],
      ['   - Kode Item: Kode unik produk (teks/angka, contoh: "0001", "A001")'],
      ['   - Nama Item: Nama produk (teks, contoh: "SEL PANCING")'],
      ['   - Harga Jual: Harga jual ke customer (angka, contoh: 70000)'],
      [''],
      ['2. KOLOM OPSIONAL (Optional - boleh dikosongkan):'],
      ['   - Barcode: Kode barcode produk (teks/angka, kosongkan jika tidak ada)'],
      ['   - Jenis: Jenis/kategori produk (teks, contoh: "PRT", "FOOD", dll)'],
      ['   - Merek: Merek produk (teks, contoh: "PRT", "Indomie", dll)'],
      ['   - Rak: Lokasi rak penyimpanan (teks, contoh: "INV", "A1", "B2")'],
      ['   - Tipe Item: Tipe inventory (teks, default: "INV")'],
      ['   - Harga Pokok: Harga beli/modal (angka, contoh: 900)'],
      ['   - Satuan: Satuan produk (teks, contoh: "PCS", "BOX", "KG")'],
      ['   - Keterangan: Catatan tambahan (teks, boleh kosong)'],
      [''],
      ['3. MAPPING KE DATABASE:'],
      ['   Format Excel Anda akan otomatis dimapping ke database:'],
      ['   - Kode Item → SKU (sku)'],
      ['   - Barcode → SKU alternatif jika Kode Item kosong'],
      ['   - Nama Item → Nama Produk (name)'],
      ['   - Harga Jual → Harga (price)'],
      ['   - Harga Pokok → Harga Asli/Coret (original_price)'],
      ['   - Satuan → Berat/Satuan (weight)'],
      ['   - Keterangan → Deskripsi (description)'],
      ['   - Jenis/Merek/Rak → Digabung ke deskripsi'],
      [''],
      ['4. KATEGORI PRODUK (akan auto-mapping):'],
      ['   Sistem akan mapping otomatis berdasarkan "Jenis":'],
      ['   - Jika kosong atau "PRT" → Kategori: Lainnya (ID: 6)'],
      ['   - Anda bisa edit kategori manual di admin panel setelah upload'],
      [''],
      ['4. FORMAT DATA:'],
      ['   - Harga: Gunakan angka saja (contoh: 25000, BUKAN "Rp 25.000")'],
      ['   - Boolean: Gunakan true atau false (huruf kecil)'],
      ['   - Teks: Jangan gunakan tanda kutip'],
      [''],
      ['5. TIPS:'],
      ['   - Maksimal 1000 produk per file untuk performa optimal'],
      ['   - Untuk upload 10,000+ produk, split menjadi beberapa file'],
      ['   - Hapus baris contoh (baris 2-3) sebelum mengisi data Anda'],
      ['   - Pastikan tidak ada baris kosong di tengah data'],
      ['   - Gunakan Excel atau Google Sheets untuk edit'],
      [''],
      ['6. VALIDASI:'],
      ['   - Sistem akan validasi setiap baris sebelum upload'],
      ['   - Jika ada error, akan ditampilkan detail error per baris'],
      ['   - Produk yang valid akan tetap terupload meski ada yang error'],
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instruksi');

    // Write file
    XLSX.writeFile(wb, 'Template_Bulk_Upload_Produk_Sahara_Mart.xlsx');
    toast.success('Template berhasil didownload!');
  };

  // Parse XLSX file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setFile(selectedFile);
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);
    setUploadErrors([]);

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Format file harus .xlsx atau .xls');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('Ukuran file maksimal 10MB');
      return;
    }

    try {
      // Read file
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);

      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

      if (jsonData.length === 0) {
        toast.error('File tidak berisi data produk');
        return;
      }

      // Validate and parse data
      const parsed: ParsedProduct[] = [];
      const errors: ValidationError[] = [];

      jsonData.forEach((row, index) => {
        const rowNumber = index + 2; // Excel row (header = 1, data starts at 2)

        // Map kolom dari format user ke format database
        const namaItem = row['Nama Item'] || row.name;
        const kodeItem = row['Kode Item'] || row.sku;
        const barcode = row['Barcode'] || row.barcode;
        const hargaJual = row['Harga Jual'] || row.price;
        const hargaPokok = row['Harga Pokok'] || row.original_price;
        const jenis = row['Jenis'] || row.category;
        const merek = row['Merek'] || row.brand;
        const rak = row['Rak'] || row.location;
        const tipeItem = row['Tipe Item'] || row.type;
        const satuan = row['Satuan'] || row.weight || row.unit;
        const keterangan = row['Keterangan'] || row.description;

        // Validate required fields - Nama Item dan Harga Jual
        if (!namaItem || String(namaItem).trim() === '') {
          errors.push({
            row: rowNumber,
            field: 'Nama Item',
            message: 'Nama Item wajib diisi',
          });
        }

        if (hargaJual === undefined || hargaJual === null || hargaJual === '') {
          errors.push({
            row: rowNumber,
            field: 'Harga Jual',
            message: 'Harga Jual wajib diisi',
          });
        } else if (typeof hargaJual !== 'number' || hargaJual < 0) {
          errors.push({
            row: rowNumber,
            field: 'Harga Jual',
            message: 'Harga Jual harus angka positif',
          });
        }

        // Validate optional fields
        if (hargaPokok !== undefined && hargaPokok !== null && hargaPokok !== '') {
          if (typeof hargaPokok !== 'number' || hargaPokok < 0) {
            errors.push({
              row: rowNumber,
              field: 'Harga Pokok',
              message: 'Harga Pokok harus angka positif',
            });
          }
        }

        // If no validation errors for this row, add to parsed data
        const rowErrors = errors.filter(e => e.row === rowNumber);
        if (rowErrors.length === 0) {
          // Build description dari multiple fields
          const descParts = [];
          if (jenis && jenis !== 'PRT') descParts.push(`Jenis: ${jenis}`);
          if (merek && merek !== 'PRT') descParts.push(`Merek: ${merek}`);
          if (rak) descParts.push(`Rak: ${rak}`);
          if (tipeItem && tipeItem !== 'INV') descParts.push(`Tipe: ${tipeItem}`);
          if (keterangan) descParts.push(keterangan);

          const finalDescription = descParts.length > 0 ? descParts.join(' | ') : undefined;

          parsed.push({
            name: String(namaItem).trim(),
            category_id: 6, // Default: Lainnya (user bisa edit manual nanti)
            price: hargaJual,
            original_price: hargaPokok || undefined,
            stock: 0, // Default 0, user bisa update manual
            weight: satuan ? String(satuan).trim() : undefined,
            sku: kodeItem ? String(kodeItem).trim() : (barcode ? String(barcode).trim() : undefined),
            barcode: barcode ? String(barcode).trim() : undefined,
            description: finalDescription,
            image_url: undefined,
            is_active: true,
            is_featured: false,
          });
        }
      });

      setParsedData(parsed);
      setValidationErrors(errors);

      if (errors.length > 0) {
        toast.error(`${errors.length} baris memiliki error validasi. Perbaiki sebelum upload.`);
      } else {
        toast.success(`${parsed.length} produk siap diupload!`);
      }

    } catch (error: any) {
      console.error('Error parsing XLSX:', error);
      toast.error('Gagal membaca file. Pastikan format file benar.');
    }
  };

  // Upload to API in batches
  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('Tidak ada data yang valid untuk diupload');
      return;
    }

    if (validationErrors.length > 0) {
      toast.error('Perbaiki error validasi terlebih dahulu');
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: parsedData.length });
    setUploadErrors([]);

    const batchSize = 100; // Upload 100 products per batch
    const batches = [];

    // Split into batches
    for (let i = 0; i < parsedData.length; i += batchSize) {
      batches.push(parsedData.slice(i, i + batchSize));
    }

    let totalSuccessful = 0;
    let totalFailed = 0;
    const allErrors: any[] = [];

    try {
      // Upload each batch
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        const response = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: batch }),
        });

        const result = await response.json();

        if (response.ok) {
          totalSuccessful += result.summary.successful;
          totalFailed += result.summary.failed;

          if (result.errors && result.errors.length > 0) {
            allErrors.push(...result.errors);
          }

          // Update progress
          setUploadProgress({
            current: (i + 1) * batchSize,
            total: parsedData.length,
          });
        } else {
          throw new Error(result.error || 'Upload failed');
        }

        // Small delay between batches to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setUploadResult({
        total: parsedData.length,
        successful: totalSuccessful,
        failed: totalFailed,
      });

      setUploadErrors(allErrors);

      if (totalFailed === 0) {
        toast.success(`🎉 Semua ${totalSuccessful} produk berhasil diupload!`);
      } else {
        toast.error(`${totalSuccessful} berhasil, ${totalFailed} gagal. Lihat detail error di bawah.`);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Gagal upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Produk (Excel)</h1>
        <p className="text-gray-600 mt-1">
          Upload banyak produk sekaligus menggunakan file Excel (.xlsx)
        </p>
      </div>

      {/* Step 1: Download Template */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">1</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Download Template Excel</h2>
            <p className="text-gray-600 mb-4">
              Download template Excel dengan format yang benar. Template sudah berisi contoh data dan instruksi lengkap.
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Template Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Upload File */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-green-600">2</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload File Excel</h2>
            <p className="text-gray-600 mb-4">
              Pilih file Excel (.xlsx) yang sudah diisi dengan data produk. Maksimal 1000 produk per file.
            </p>

            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <FileSpreadsheet className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Pilih File Excel
                    </button>
                    <p className="text-sm text-gray-500 mt-1">atau drag & drop file disini</p>
                  </div>
                  <p className="text-xs text-gray-400">Format: .xlsx atau .xls (max 10MB)</p>
                </div>
              )}
            </div>

            {/* Validation Summary */}
            {file && (
              <div className="mt-4 space-y-2">
                {parsedData.length > 0 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{parsedData.length} produk valid siap diupload</span>
                  </div>
                )}

                {validationErrors.length > 0 && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">{validationErrors.length} baris memiliki error</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-3">
                Error Validasi ({validationErrors.length} baris)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-800 bg-white rounded p-2">
                    <span className="font-medium">Baris {error.row}</span> - {error.field}: {error.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Upload to Database */}
      {parsedData.length > 0 && validationErrors.length === 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload ke Database</h2>
              <p className="text-gray-600 mb-4">
                Siap upload {parsedData.length} produk ke database. Proses akan dilakukan secara bertahap (batch 100 produk).
              </p>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Mengupload... {uploadProgress.current} / {uploadProgress.total}
                    </span>
                    <span className="text-sm text-gray-500">
                      {((uploadProgress.current / uploadProgress.total) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center space-x-2 bg-[#E60000] text-white px-6 py-3 rounded-lg hover:bg-[#CC0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengupload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload {parsedData.length} Produk</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hasil Upload</h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{uploadResult.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Berhasil</p>
              <p className="text-2xl font-bold text-green-900">{uploadResult.successful}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Gagal</p>
              <p className="text-2xl font-bold text-red-900">{uploadResult.failed}</p>
            </div>
          </div>

          {/* Upload Errors */}
          {uploadErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Detail Error:</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {uploadErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-800">
                    Baris {error.row}: {error.product} - {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadResult.failed === 0 && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Semua produk berhasil diupload! 🎉</span>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Tips Upload 10,000 Produk</span>
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Split file menjadi beberapa bagian (max 1000 produk per file) untuk performa optimal</li>
          <li>• Upload di waktu traffic rendah (malam hari) untuk menghindari timeout</li>
          <li>• Pastikan koneksi internet stabil selama proses upload</li>
          <li>• Backup data Excel sebelum upload untuk berjaga-jaga</li>
          <li>• Gunakan category_id yang benar (1-6), lihat template untuk referensi</li>
          <li>• Kosongkan kolom image_url jika belum ada gambar (bisa diupdate nanti)</li>
          <li>• Proses upload dilakukan secara bertahap (100 produk per batch)</li>
        </ul>
      </div>
    </div>
  );
}
