import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { BUILDINGS_DATA } from '../data/buildings';
import { getCompareState, clearCompare } from '../utils/compareStorage';
import { Scale, X, ArrowRight } from 'lucide-react';

interface CompareFloatingBarProps {
  lang: Language;
  onOpenCompare: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({ lang, onOpenCompare }) => {
  const [compareState, setCompareState] = useState(() => getCompareState());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCompareState(detail || getCompareState());
    };
    window.addEventListener('conic_compare_change', handleUpdate);
    return () => window.removeEventListener('conic_compare_change', handleUpdate);
  }, []);

  // If nothing selected or both selected (auto-opened), no floating banner needed unless 1 is selected
  const hasOne = compareState.idA && !compareState.idB;
  const hasBoth = compareState.idA && compareState.idB;

  if (!hasOne && !hasBoth) return null;

  const bA = BUILDINGS_DATA.find((b) => b.id === compareState.idA);
  const bB = BUILDINGS_DATA.find((b) => b.id === compareState.idB);

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md w-full">
      <div className="bg-[#101214]/95 border border-neutral-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#B6FFED]/10 border border-[#B6FFED]/30 flex items-center justify-center text-[#B6FFED] shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
              <span className="text-[#B6FFED] font-mono text-[11px]">
                {hasBoth ? '2/2' : '1/2'}:
              </span>
              <span className="truncate">
                {bA ? (lang === 'en' ? bA.nameEn : bA.nameHi) : 'Structure A'}
                {bB ? ` & ${lang === 'en' ? bB.nameEn : bB.nameHi}` : ''}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {hasBoth
                ? (lang === 'en' ? 'Ready to compare' : 'तुलना के लिए तैयार')
                : (lang === 'en' ? 'Select 1 more structure' : '1 और इमारत चुनें')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenCompare}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#B6FFED] hover:bg-[#9effe4] text-[#0a0a0a] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{lang === 'en' ? 'Compare' : 'तुलना'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => clearCompare()}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
