import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, CheckCircle2, Lock, Snowflake, Flame, Wifi, Sparkles } from 'lucide-react';
import { DebitCard } from '../../types';

interface GoldVisaCardVisualProps {
  card?: DebitCard | null;
  onToggleFreeze?: (cardId: string) => void;
  showControls?: boolean;
}

export const GoldVisaCardVisual: React.FC<GoldVisaCardVisualProps> = ({
  card,
  onToggleFreeze,
  showControls = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  if (!card) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/80 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto border border-amber-300/40">
          <Lock className="w-6 h-6 text-amber-700" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
          <span>No Active Card / Unissued</span>
        </div>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
          You do not have an active Visa Debit Card yet. Contact support or wait for admin authorization.
        </p>
      </div>
    );
  }

  const isFrozen = card.status === 'frozen';
  const cleanNumber = card.cardNumber.replace(/\s+/g, '');
  const formattedNumber = showDetails
    ? card.cardNumber
    : `•••• •••• •••• ${cleanNumber.slice(-4)}`;

  return (
    <div className="space-y-4 max-w-md mx-auto sm:mx-0">
      {/* 3D Realistic Gold Visa Card */}
      <div
        className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-slate-900 shadow-2xl transition-all duration-500 overflow-hidden select-none border group hover:scale-[1.01] ${
          isFrozen
            ? 'grayscale contrast-125 border-slate-600'
            : 'border-amber-300/50 hover:shadow-amber-500/20'
        }`}
        style={{
          background: isFrozen
            ? 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%)'
            : 'radial-gradient(circle at 10% 10%, #fff6d6 0%, #f7d570 25%, #d49f30 55%, #996f12 90%, #684a05 100%)',
          boxShadow: isFrozen
            ? '0 16px 32px -8px rgba(15,23,42,0.6)'
            : '0 20px 40px -12px rgba(180, 130, 20, 0.45), inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.25)',
        }}
      >
        {/* Holographic metallic sheen reflections */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60 pointer-events-none transform -skew-x-12" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-white/25 rounded-full blur-2xl pointer-events-none" />

        {/* Brushed metal fine lines pattern overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25 pointer-events-none mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C140,160 260,-40 400,90 L400,250 L0,250 Z"
            fill="url(#goldFlowGrad)"
          />
          <path
            d="M0,110 C160,230 290,10 400,150 L400,250 L0,250 Z"
            fill="#ffffff"
            opacity="0.25"
          />
          <defs>
            <linearGradient id="goldFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top Row: Greendot Brand + Gold & Status Badge */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white/90 shadow-md flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base tracking-tight text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                greendot
              </span>
              <span className="text-[8px] uppercase tracking-widest font-extrabold text-amber-950/80 -mt-1 font-mono">
                Private Reserve
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFrozen ? (
              <span className="bg-slate-950/85 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-md flex items-center gap-1">
                <Snowflake className="w-3 h-3 text-cyan-300" />
                FROZEN
              </span>
            ) : (
              <span className="bg-emerald-950/80 text-emerald-300 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30 shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-black/15 text-slate-950 font-black text-[11px] tracking-widest border border-white/50 shadow-inner backdrop-blur-xs">
              GOLD
            </span>
          </div>
        </div>

        {/* Realistic EMV Chip & Contactless Wave */}
        <div className="flex items-center gap-3.5 my-3 sm:my-4 relative z-10">
          <div
            className="w-12 h-9 rounded-md border border-amber-950/40 relative shadow-md overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #fef08a 0%, #eab308 40%, #ca8a04 80%, #854d0e 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {/* Chip circuitry lines */}
            <div className="absolute inset-1.5 border border-amber-950/35 rounded-[3px]" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-950/35" />
            <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-amber-950/35" />
            <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-amber-950/35" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 border border-amber-950/40 bg-amber-200/50" />
          </div>

          {/* Contactless Signal Wave SVG */}
          <div className="p-1 rounded-full bg-black/5 backdrop-blur-xs">
            <svg className="w-5 h-5 text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M8.5 16.5a5 5 0 0 1 0-9" />
              <path d="M12 19a8.5 8.5 0 0 0 0-14" />
              <path d="M15.5 21.5a12 12 0 0 0 0-19" />
            </svg>
          </div>
        </div>

        {/* Card Number with Embossed 3D styling */}
        <div className="relative z-10 my-2">
          <div className="font-mono text-lg sm:text-xl lg:text-2xl font-black tracking-[3px] text-slate-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] text-shadow">
            {formattedNumber}
          </div>
        </div>

        {/* Bottom Row: Cardholder & Expiry & VISA Wordmark */}
        <div className="flex items-end justify-between relative z-10 pt-2 text-slate-950">
          <div>
            <div className="text-[9px] uppercase tracking-widest font-black text-slate-800/90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              Cardholder
            </div>
            <div className="text-xs sm:text-sm font-black tracking-wide uppercase font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              {card.cardHolder}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[9px] uppercase tracking-widest font-black text-slate-800/90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              Valid Thru
            </div>
            <div className="text-xs font-mono font-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
            </div>
          </div>

          {/* VISA Wordmark */}
          <div className="text-right">
            <span className="font-display font-black italic text-2xl sm:text-3xl text-blue-950 tracking-tighter drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              VISA
            </span>
            <div className="text-[8px] font-bold tracking-widest text-slate-900 uppercase -mt-1 font-mono">
              Signature
            </div>
          </div>
        </div>
      </div>

      {/* Modern Fintech Card Controls Toolbar */}
      {showControls && (
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/80 text-xs shadow-lg text-slate-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 font-medium text-slate-300 hover:text-white transition-all active:scale-95"
          >
            {showDetails ? <EyeOff className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-semibold">{showDetails ? 'Mask PAN' : 'Show PAN'}</span>
          </button>

          <button
            onClick={() => setShowCvv(!showCvv)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-800/80 font-medium text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-semibold">CVV: {showCvv ? card.cvv : '•••'}</span>
          </button>

          {onToggleFreeze && (
            <button
              onClick={() => onToggleFreeze(card.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 ${
                isFrozen
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
              }`}
            >
              {isFrozen ? <Flame className="w-3.5 h-3.5 text-amber-400" /> : <Snowflake className="w-3.5 h-3.5 text-red-400" />}
              <span>{isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
