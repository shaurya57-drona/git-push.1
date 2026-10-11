import React, { useState, useEffect } from 'react';
import { Building, Language } from '../types';
import { CONIC_INFO } from '../data/translations';
import { getCompareState, addToCompare, removeFromCompare } from '../utils/compareStorage';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Eye, Scale, Check, Heart, User } from 'lucide-react';
import { HighlightText } from './HighlightText';

interface BuildingCardProps {
  building: Building;
  lang: Language;
  searchQuery?: string;
  onOpenDetails: (building: Building) => void;
  onOpenCompare?: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  lang,
  searchQuery,
  onOpenDetails,
  onOpenCompare,
}) => {
  const conic = CONIC_INFO[building.conicType];
  const [compareState, setCompareState] = useState(() => getCompareState());
  const { isFavorited, toggleFavorite } = useAuth();
  const favorited = isFavorited(building.id);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCompareState(detail || getCompareState());
    };
    window.addEventListener('conic_compare_change', handleUpdate);
    return () => window.removeEventListener('conic_compare_change', handleUpdate);
  }, []);

  const isSelectedA = compareState.idA === building.id;
  const isSelectedB = compareState.idB === building.id;
  const isSelected = isSelectedA || isSelectedB;

  const isSearchMatch = Boolean(
    searchQuery &&
      searchQuery.trim() &&
      (building.nameEn.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        building.nameHi.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        building.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        building.country.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        building.architect.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeFromCompare(building.id);
    } else {
      const { isComplete } = addToCompare(building.id);
      if (isComplete && onOpenCompare) {
        onOpenCompare();
      }
    }
  };

  return (
    <div
      id={`building-card-${building.id}`}
      className={`group relative bg-[#111316] hover:bg-[#14171b] border rounded-xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? 'border-[#B6FFED] ring-1 ring-[#B6FFED]/40 shadow-lg shadow-[#B6FFED]/10'
          : isSearchMatch
          ? 'border-[#B6FFED]/80 ring-1 ring-[#B6FFED]/30'
          : 'border-neutral-800/80 hover:border-neutral-700'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-medium border ${conic.badgeBg}`}>
            {conic.symbol} {lang === 'en' ? conic.nameEn : conic.nameHi}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              id={`fav-btn-${building.id}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(building.id, building.conicType);
              }}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                favorited
                  ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                  : 'text-neutral-500 hover:text-rose-300 hover:bg-neutral-800 border border-transparent'
              }`}
              title={
                favorited
                  ? (lang === 'en' ? 'Saved. Click to remove.' : 'सहेजा गया। हटाने हेतु क्लिक करें।')
                  : (lang === 'en' ? 'Bookmark structure' : 'संरचना सहेजें')
              }
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <a
              id={`card-wiki-link-${building.id}`}
              href={`https://en.wikipedia.org/wiki/${building.wikipediaId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors flex items-center justify-center border border-transparent"
              title={lang === 'en' ? `Wikipedia: ${building.nameEn}` : `विकिपीडिया: ${building.nameHi}`}
            >
              <span className="w-3.5 h-3.5 rounded bg-neutral-300 text-neutral-900 flex items-center justify-center font-serif font-black text-[9px] leading-none">
                W
              </span>
            </a>
            {isSelected && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#B6FFED]/15 text-[#B6FFED] font-semibold border border-[#B6FFED]/40 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{isSelectedA ? 'A' : 'B'}</span>
              </span>
            )}
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
              e={building.eccentricity.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Building Title */}
        <h3 className="text-base font-bold text-white group-hover:text-[#B6FFED] transition-colors tracking-tight font-display mb-2">
          <HighlightText
            text={lang === 'en' ? building.nameEn : building.nameHi}
            query={searchQuery}
          />
        </h3>

        {/* Mathematical Equation */}
        <div className="bg-[#0b0d0f] border border-neutral-800 group-hover:border-neutral-700 rounded-md px-2.5 py-1.5 mb-2.5 font-mono text-xs text-[#B6FFED] font-medium truncate transition-colors" title={building.realWorldEquation}>
          {building.realWorldEquation}
        </div>

        {/* Structural Summary */}
        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-3.5">
          {lang === 'en' ? building.architecturalAdvantageEn : building.architecturalAdvantageHi}
        </p>
      </div>

      {/* Metadata & Action Footer */}
      <div>
        <div className="space-y-1.5 text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2.5 mb-3 font-sans">
          {/* Architect Row */}
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="text-neutral-300 truncate">
              <HighlightText text={building.architect} query={searchQuery} />
            </span>
          </div>

          {/* City, Country & Year Built */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="truncate">
                <span className="text-neutral-300">
                  <HighlightText text={building.city} query={searchQuery} />
                </span>
                , {building.country}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>{building.yearBuilt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Inspect & Compare */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`view-details-${building.id}`}
            onClick={() => onOpenDetails(building)}
            className="py-1.5 px-2.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors flex items-center justify-center gap-1.5 border border-neutral-800 hover:border-neutral-700 cursor-pointer"
            title={lang === 'en' ? 'Inspect 3D model & dossier' : '3D मॉडल व डोजियर देखें'}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'en' ? '3D Dossier' : '3D डोजियर'}</span>
          </button>

          <button
            id={`compare-btn-${building.id}`}
            onClick={handleCompareClick}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border cursor-pointer ${
              isSelected
                ? 'bg-[#B6FFED] border-[#B6FFED] text-[#0a0a0a] font-semibold'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800 hover:border-neutral-700'
            }`}
            title={
              isSelected
                ? (lang === 'en' ? 'Selected for comparison' : 'तुलना हेतु चयनित')
                : (lang === 'en' ? 'Add to comparison' : 'तुलना में जोड़ें')
            }
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isSelected
                ? (lang === 'en' ? 'Selected' : 'चयनित')
                : (lang === 'en' ? 'Compare' : 'तुलना')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

