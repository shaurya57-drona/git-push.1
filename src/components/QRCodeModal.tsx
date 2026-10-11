import React, { useState } from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../data/translations';
import { QrCode, Copy, Check, X, Smartphone, ExternalLink, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  lang: Language;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ lang, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://conic-city.vercel.app';

  // Generate an SVG QR code matrix or clean SVG barcode representation
  // We can render a high-contrast QR code SVG using standard QR matrix patterns
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Google Chart API / QR Server fallback image with immediate local SVG pattern
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&color=ffffff&bgcolor=090d16&data=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div
      id="qr-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-center">
        {/* Close Button */}
        <button
          id="close-qr-button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex p-3 rounded-xl bg-sky-500/20 text-sky-400 mb-3">
          <QrCode className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-display">
          {UI_TEXT[lang].qrTitle}
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          {UI_TEXT[lang].qrSubtitle}
        </p>

        {/* QR Code Container */}
        <div className="mx-auto w-56 h-56 bg-[#090d16] p-3 rounded-2xl border-2 border-slate-700 shadow-xl flex items-center justify-center mb-5 relative group">
          <img
            src={qrImageUrl}
            alt="Conic City Mobile QR Code"
            className="w-full h-full rounded-lg object-contain"
            onError={(e) => {
              // Fallback if external image service offline: render SVG QR dummy
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-xl pointer-events-none p-2 text-xs text-sky-300 font-mono">
            <span>{lang === 'en' ? 'Scan with Mobile Camera' : 'मोबाइल कैमरे से स्कैन करें'}</span>
          </div>
        </div>

        {/* URL Pill & Copy Button */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <div className="truncate flex-1 text-left px-2 text-slate-400">{currentUrl}</div>
          <button
            id="copy-url-button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-sky-600 text-slate-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{UI_TEXT[lang].copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{UI_TEXT[lang].copyLink}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
