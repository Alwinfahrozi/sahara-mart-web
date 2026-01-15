'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Scan, X } from 'lucide-react';

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export default function BarcodeScanner({
  onScan,
  placeholder = 'Scan barcode atau ketik manual...',
  autoFocus = false,
}: BarcodeScannerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle barcode scanner input
  // Barcode scanners typically type very fast and end with Enter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear previous timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // If input is fast (like from scanner), trigger scanning state
    setIsScanning(true);

    // Reset scanning state after 100ms of no input
    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const barcode = inputValue.trim();
    if (barcode) {
      onScan(barcode);
      setInputValue('');
      setIsScanning(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setInputValue('');
    setIsScanning(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        {/* Scan Icon with Animation */}
        <div className={`absolute left-4 transition-colors ${isScanning ? 'text-green-500' : 'text-gray-400'}`}>
          <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:border-[#E60000] focus:ring-2 focus:ring-[#E60000]/20 transition-all outline-none text-lg font-mono"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-14 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!inputValue.trim()}
          className="absolute right-2 bg-[#E60000] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="button"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Scanning Indicator */}
      {isScanning && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">Scanning barcode...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <Scan className="w-3 h-3" />
        <span>Scan dengan barcode scanner atau ketik manual lalu tekan Enter</span>
      </div>
    </div>
  );
}
