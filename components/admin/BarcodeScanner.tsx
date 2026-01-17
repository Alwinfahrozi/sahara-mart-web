'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Scan, X } from 'lucide-react';

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void; // Live search support
  value?: string; // Controlled input
};

export default function BarcodeScanner({
  onScan,
  placeholder = 'Scan barcode atau ketik manual...',
  autoFocus = false,
  onChange,
  value,
}: BarcodeScannerProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Use controlled value if provided, otherwise use internal state
  const inputValue = value !== undefined ? value : internalValue;
  const setInputValue = (val: string) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val); // Call onChange for live search
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle barcode scanner input
  // Barcode scanners typically type very fast and end with Enter
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

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
      // Don't clear if using controlled value
      if (value === undefined) {
        setInputValue('');
      }
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
        {/* Search Icon */}
        <div className="absolute left-3 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000] transition-all outline-none"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtle Scanning Indicator */}
      {isScanning && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
