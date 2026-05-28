'use client';

import React from 'react';
import { Entity as EntityType } from '../lib/types';

interface EntityProps {
  entity: EntityType;
  onSelect: () => void;
  disabled?: boolean;
  isPassenger?: boolean;
}

// Gorgeous Scalable Cartoon SVG Face Components

const HusbandASVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradA" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="30" fill="url(#skinGradA)" />
    <circle cx="42" cy="45" r="3.5" fill="#1E293B" />
    <circle cx="58" cy="45" r="3.5" fill="#1E293B" />
    <circle cx="58" cy="45" r="7" stroke="#FCD34D" strokeWidth="2" />
    <line x1="64" y1="48" x2="72" y2="60" stroke="#FCD34D" strokeWidth="1.5" />
    <path d="M25 28 h50 v6 h-50 z" fill="#1D4ED8" />
    <path d="M32 8 h36 v20 h-36 z" fill="url(#blueGrad)" />
    <rect x="32" y="22" width="36" height="3" fill="#FCD34D" />
    <path d="M38 56 Q50 50 62 56 Q50 62 38 56 Z" fill="#1E3A8A" />
    <path d="M46 64 Q50 68 54 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 78 Q50 82 70 78 L68 95 H32 Z" fill="#1E3A8A" />
    <path d="M42 78 L50 88 L58 78 Z" fill="#FFFFFF" />
    <path d="M48 83 L50 86 L52 83 Z" fill="#EF4444" />
  </svg>
);

const WifeASVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradA" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      <linearGradient id="blueGradW" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M22 40 C12 60 12 85 25 90 C30 92 70 92 75 90 C88 85 88 60 78 40 Z" fill="#1E293B" />
    <circle cx="50" cy="50" r="28" fill="url(#skinGradA)" />
    <circle cx="42" cy="46" r="3" fill="#1E293B" />
    <circle cx="58" cy="46" r="3" fill="#1E293B" />
    <circle cx="38" cy="54" r="3" fill="#F87171" opacity="0.5" />
    <circle cx="62" cy="54" r="3" fill="#F87171" opacity="0.5" />
    <path d="M45 62 Q50 68 55 62" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M22 38 Q50 18 78 38 Q65 30 50 35 Q35 30 22 38 Z" fill="#1E293B" />
    <circle cx="50" cy="18" r="10" fill="#1E293B" />
    <path d="M40 18 Q50 10 60 18 Q50 26 40 18 Z" fill="url(#blueGradW)" />
    <circle cx="50" cy="18" r="3.5" fill="#FCD34D" />
    <path d="M30 76 Q50 82 70 76 L72 95 H28 Z" fill="url(#blueGradW)" />
    <path d="M38 76 C38 82 62 82 62 76" stroke="#FCD34D" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="80" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
  </svg>
);

const HusbandBSVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradB" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEE2E2" />
        <stop offset="100%" stopColor="#FCA5A5" />
      </linearGradient>
      <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="46" r="28" fill="url(#skinGradB)" />
    <circle cx="43" cy="42" r="3.5" fill="#1E293B" />
    <circle cx="57" cy="42" r="3.5" fill="#1E293B" />
    <path d="M24 44 C22 68 35 90 50 90 C65 90 78 68 76 44 C72 52 68 56 62 56 Q50 62 38 56 C32 56 28 52 24 44 Z" fill="#9D174D" />
    <path d="M34 52 Q50 42 66 52 Q50 58 34 52 Z" fill="#C2185B" />
    <path d="M46 60 Q50 64 54 60" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 24 L36 10 L50 18 L64 10 L68 24 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="36" cy="9" r="2" fill="#EF4444" />
    <circle cx="50" cy="17" r="2" fill="#3B82F6" />
    <circle cx="64" cy="9" r="2" fill="#EF4444" />
    <path d="M30 76 Q50 82 70 76 L68 95 H32 Z" fill="url(#pinkGrad)" />
    <circle cx="50" cy="78" r="4.5" fill="#FCD34D" />
  </svg>
);

const WifeBSVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradB" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEE2E2" />
        <stop offset="100%" stopColor="#FCA5A5" />
      </linearGradient>
      <linearGradient id="pinkGradW" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M18 42 C10 60 10 90 22 92 C34 94 66 94 78 92 C90 90 90 60 82 42 Z" fill="#BE185D" />
    <circle cx="50" cy="48" r="27" fill="url(#skinGradB)" />
    <circle cx="43" cy="44" r="3" fill="#1E293B" />
    <circle cx="57" cy="44" r="3" fill="#1E293B" />
    <circle cx="39" cy="51" r="3.5" fill="#F472B6" opacity="0.6" />
    <circle cx="61" cy="51" r="3.5" fill="#F472B6" opacity="0.6" />
    <path d="M45 58 Q50 63 55 58" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M23 38 Q50 20 77 38 Q65 30 50 33 Q35 30 23 38 Z" fill="#BE185D" />
    <path d="M38 26 L50 14 L62 26 Z" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    <circle cx="50" cy="13" r="2.5" fill="#EC4899" />
    <path d="M30 74 Q50 80 70 74 L72 95 H28 Z" fill="url(#pinkGradW)" />
    <path d="M36 74 C36 82 64 82 64 74" stroke="#FCD34D" strokeWidth="2" fill="none" />
    <polygon points="50,77 53,82 50,87 47,82" fill="#EF4444" />
  </svg>
);

const HusbandCSVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradC" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2DD4BF" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="30" fill="url(#skinGradC)" />
    <circle cx="41" cy="46" r="3.5" fill="#1E293B" />
    <circle cx="59" cy="46" r="3.5" fill="#1E293B" />
    <circle cx="41" cy="46" r="8" stroke="#1E293B" strokeWidth="2" />
    <circle cx="59" cy="46" r="8" stroke="#1E293B" strokeWidth="2" />
    <line x1="49" y1="46" x2="51" y2="46" stroke="#1E293B" strokeWidth="2" />
    <line x1="33" y1="46" x2="30" y2="46" stroke="#1E293B" strokeWidth="1.5" />
    <line x1="67" y1="46" x2="70" y2="46" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M26 36 C24 20 76 20 74 36 Z" fill="url(#tealGrad)" />
    <ellipse cx="50" cy="24" rx="26" ry="8" fill="#0D9488" />
    <rect x="49" y="12" width="2" height="6" fill="#FCD34D" />
    <circle cx="50" cy="12" r="2.5" fill="#FCD34D" />
    <path d="M36 58 Q50 52 64 58 M50 54 L50 62" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
    <path d="M46 66 Q50 70 54 66" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 78 Q50 82 70 78 L68 95 H32 Z" fill="#047857" />
    <path d="M30 78 L50 95 L70 78 Z" fill="#115E59" />
    <path d="M42 78 L50 86 L58 78 Z" fill="#FEF3C7" />
    <circle cx="50" cy="90" r="2.5" fill="#FCD34D" />
  </svg>
);

const WifeCSVG = () => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="skinGradC" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="tealGradW" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#99F6E4" />
        <stop offset="100%" stopColor="#14B8A6" />
      </linearGradient>
    </defs>
    <path d="M22 42 C15 55 15 85 24 91 C30 93 70 93 76 91 C85 85 85 55 78 42 Z" fill="#0F766E" />
    <circle cx="50" cy="50" r="27" fill="url(#skinGradC)" />
    <circle cx="43" cy="46" r="3" fill="#1E293B" />
    <circle cx="57" cy="46" r="3" fill="#1E293B" />
    <circle cx="39" cy="53" r="3" fill="#F59E0B" opacity="0.6" />
    <circle cx="61" cy="53" r="3" fill="#F59E0B" opacity="0.6" />
    <path d="M45 61 Q50 66 55 61" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M22 36 Q50 14 78 36 Z" fill="url(#tealGradW)" />
    <path d="M12 36 Q50 28 88 36 Q50 44 12 36 Z" fill="#0F766E" />
    <circle cx="70" cy="30" r="5" fill="#FFFFFF" />
    <circle cx="66" cy="27" r="3.5" fill="#FFFFFF" />
    <circle cx="74" cy="27" r="3.5" fill="#FFFFFF" />
    <circle cx="66" cy="33" r="3.5" fill="#FFFFFF" />
    <circle cx="74" cy="33" r="3.5" fill="#FFFFFF" />
    <circle cx="70" cy="30" r="3" fill="#FCD34D" />
    <path d="M30 76 Q50 82 70 76 L72 95 H28 Z" fill="url(#tealGradW)" />
    <path d="M34 76 C40 85 60 85 66 76 Z" fill="#0F766E" />
    <circle cx="50" cy="81" r="3" fill="#FFFFFF" />
  </svg>
);

export function Entity({ entity, onSelect, disabled = false, isPassenger = false }: EntityProps) {
  // Map standard entity identity key to beautiful SVG avatar
  const renderAvatar = () => {
    switch (entity.id) {
      case 'H_A': return <HusbandASVG />;
      case 'W_A': return <WifeASVG />;
      case 'H_B': return <HusbandBSVG />;
      case 'W_B': return <WifeBSVG />;
      case 'H_C': return <HusbandCSVG />;
      case 'W_C': return <WifeCSVG />;
      default: return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect();
    }
  };

  const displayName = `${entity.type === 'husband' ? 'Husband' : 'Wife'} ${entity.coupleId}`;
  
  // Choose beautiful border glowing lines based on couple ID
  const glowColors = {
    A: 'border-indigo-400/50 shadow-indigo-500/20 text-indigo-300',
    B: 'border-pink-400/50 shadow-pink-500/20 text-pink-300',
    C: 'border-teal-400/50 shadow-teal-500/20 text-teal-300',
  }[entity.coupleId];

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
      aria-label={`${displayName}, ${isPassenger ? 'onboard' : `on the ${entity.bank} bank`}`}
      className={`
        group relative flex flex-col items-center justify-center select-none animate-hop
        transition-all duration-500 ease-out origin-bottom
        ${disabled ? 'filter grayscale opacity-45 cursor-not-allowed scale-90' : 'cursor-pointer hover:scale-105 active:scale-95'}
      `}
    >
      {/* Avatar Container */}
      <div
        className={`
          w-16 h-16 md:w-[72px] md:h-[72px] rounded-full border-2 bg-slate-900/90 shadow-lg p-0.5 relative overflow-hidden transition-all duration-300
          ${isPassenger ? 'scale-90 border-yellow-400 shadow-yellow-500/10' : glowColors}
          ${!disabled && 'group-hover:shadow-2xl group-hover:border-white'}
        `}
      >
        {renderAvatar()}
        
        {/* Berth passenger badge */}
        {isPassenger && (
          <span className="absolute bottom-0 inset-x-0 bg-yellow-500/80 text-[8px] font-bold text-slate-950 font-mono py-0.5 tracking-wider uppercase text-center block select-none">
            Onboard
          </span>
        )}
      </div>

      {/* Floating Name Plate Label (only for mouseover or subtle standing look) */}
      <div className="mt-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 shadow-sm transition-all duration-200 select-none">
        <span className="font-mono text-[9px] font-extrabold uppercase tracking-wider text-slate-300 block text-center">
          {displayName}
        </span>
      </div>
    </div>
  );
}
