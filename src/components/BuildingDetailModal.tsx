import React, { useState } from 'react';
import { Building, Language, ConicType } from '../types';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { BuildingModel3D } from './BuildingModel3D';
import { useAuth } from '../context/AuthContext';
import { X, MapPin, Calendar, User, Compass, Layers, Sparkles, ChevronLeft, ChevronRight, BookOpen, ShieldCheck, Heart, ExternalLink, Camera } from 'lucide-react';
import { HighlightText } from './HighlightText';

interface BuildingDetailModalProps {
  building: Building | null;
  lang: Language;
  isOpen?: boolean;
  searchQuery?: string;
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  onOpenARCamera?: (conicType: ConicType, buildingName: string) => void;
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  building,
  lang,
  isOpen = true,
  searchQuery,
  onClose,
  onSelectNext,
  onSelectPrev,
  onOpenARCamera,
}) => {
  const [activeTab, setActiveTab] = useState<'math' | 'structure' | 'acoustic' | 'specs'>('math');
  const { isFavorited, toggleFavorite } = useAuth();

  // AR Camera Bug Fix:
  // IF current view is an opened shape card:
  //    hide the AR Camera option only inside that shape-card view
  // ELSE:
  //    keep the AR Camera option visible and functional
  const isOpenedShapeCard = Boolean(isOpen);
  const showARCameraInShapeCard = !isOpenedShapeCard;

  if (!building) return null;

  const conic = CONIC_INFO[building.conicType];
  const favorited = isFavorited(building.id);

  return (
    <div
      id="building-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#111316] border border-neutral-800/80 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-[#0e1012] shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-medium border ${conic.badgeBg}`}>
              {conic.symbol} {lang === 'en' ? conic.nameEn : conic.nameHi}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
              e={building.eccentricity.toFixed(3)}
            </span>
            <button
              id="modal-fav-btn"
              onClick={() => toggleFavorite(building.id, building.conicType)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                favorited
                  ? 'text-rose-300 bg-rose-500/15 border border-rose-500/30'
                  : 'text-neutral-400 hover:text-rose-300 bg-neutral-900 border border-neutral-800'
              }`}
              title={favorited ? 'Remove from saved' : 'Save structure'}
            >
              <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current text-rose-400' : ''}`} />
              <span className="hidden sm:inline">{favorited ? (lang === 'en' ? 'Saved' : 'सहेजा') : (lang === 'en' ? 'Save' : 'सहेजें')}</span>
            </button>

            {showARCameraInShapeCard && onOpenARCamera && (
              <button
                id="modal-header-ar-camera-btn"
                onClick={() => onOpenARCamera(building.conicType, lang === 'en' ? building.nameEn : building.nameHi)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-[#B6FFED]/40 text-[#B6FFED] hover:border-[#B6FFED] transition-all shadow-[0_0_10px_rgba(182,255,237,0.15)] cursor-pointer"
                title={UI_TEXT[lang].viewInARCamera}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? 'AR Camera' : 'एआर कैमरा'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onSelectPrev && (
              <button
                id="modal-prev-building"
                onClick={onSelectPrev}
                title="Previous Building"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onSelectNext && (
              <button
                id="modal-next-building"
                onClick={onSelectNext}
                title="Next Building"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-modal-button"
              onClick={onClose}
              title="Close Dossier"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Header Title Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-1">
              <HighlightText
                text={lang === 'en' ? building.nameEn : building.nameHi}
                query={searchQuery}
              />
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-sans">
              <span className="flex items-center gap-1 text-sky-400 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <HighlightText text={building.city} query={searchQuery} />, {building.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {building.yearBuilt}
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <HighlightText text={building.architect} query={searchQuery} />
              </span>
              <a
                id={`modal-wikipedia-link-${building.id}`}
                href={`https://en.wikipedia.org/wiki/${building.wikipediaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-sky-400/50 transition-colors group"
                title={lang === 'en' ? `Read on Wikipedia: ${building.nameEn}` : `विकिपीडिया पर पढ़ें: ${building.nameHi}`}
              >
                <span className="w-3.5 h-3.5 rounded bg-slate-100 text-slate-900 flex items-center justify-center font-serif font-black text-[9px] leading-none shrink-0 group-hover:scale-105 transition-transform">
                  W
                </span>
                <span>{UI_TEXT[lang].readOnWikipedia}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-300 shrink-0" />
              </a>
            </div>
          </div>

          {/* Interactive 3D Model Section */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold tracking-wider text-slate-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                {UI_TEXT[lang].view3DModel}
              </span>
              <span className="font-mono text-neutral-400 text-[11px]">
                {lang === 'en' ? 'Drag to rotate • Scroll to zoom' : 'घुमाने के लिए ड्रैग करें'}
              </span>
            </div>
            <BuildingModel3D building={building} lang={lang} />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-800 gap-1 overflow-x-auto pb-0.5">
            <button
              onClick={() => setActiveTab('math')}
              className={`text-xs px-3 py-2 rounded-t-md font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-neutral-800 text-[#B6FFED] border-b-2 border-[#B6FFED]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{UI_TEXT[lang].mathematicalDerivation}</span>
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`text-xs px-3 py-2 rounded-t-md font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'structure'
                  ? 'bg-neutral-800 text-[#B6FFED] border-b-2 border-[#B6FFED]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{UI_TEXT[lang].structuralAdvantage}</span>
            </button>
            <button
              onClick={() => setActiveTab('acoustic')}
              className={`text-xs px-3 py-2 rounded-t-md font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'acoustic'
                  ? 'bg-neutral-800 text-[#B6FFED] border-b-2 border-[#B6FFED]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{UI_TEXT[lang].acousticOrLoadBearing}</span>
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs px-3 py-2 rounded-t-md font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-neutral-800 text-[#B6FFED] border-b-2 border-[#B6FFED]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{UI_TEXT[lang].keyDimensions}</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="bg-[#0b0d0f] rounded-lg p-4 border border-neutral-800">
            {activeTab === 'math' && (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {/* Equations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#111316] p-3 rounded-lg border border-neutral-800 font-mono">
                    <div className="text-[10px] text-neutral-500 uppercase font-sans mb-1">
                      {UI_TEXT[lang].realWorldEquation}
                    </div>
                    <div className="text-[#B6FFED] font-bold text-sm sm:text-base">
                      {building.realWorldEquation}
                    </div>
                  </div>
                  <div className="bg-[#111316] p-3 rounded-lg border border-neutral-800 font-mono">
                    <div className="text-[10px] text-neutral-500 uppercase font-sans mb-1">
                      {UI_TEXT[lang].standardEquation}
                    </div>
                    <div className="text-amber-300 font-bold text-sm sm:text-base">
                      {building.standardEquation}
                    </div>
                  </div>
                </div>

                {/* Mathematical Derivation */}
                <div className="p-3 bg-[#111316] rounded-lg border border-neutral-800">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                    {lang === 'en' ? 'Rigorous Geometric Derivation' : 'सटीक ज्यामितीय निगमन'}
                  </h4>
                  <p className="text-slate-200">
                    {lang === 'en'
                      ? building.mathematicalSignificanceEn
                      : building.mathematicalSignificanceHi}
                  </p>
                </div>

                {/* Parameters table */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                    {UI_TEXT[lang].parameters}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    {Object.entries(building.parameters).map(([key, val]) => (
                      <div key={key} className="bg-slate-900/80 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-500">{key}</div>
                        <div className="text-slate-200 font-semibold truncate">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'structure' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-purple-900/30">
                  <h4 className="text-xs uppercase tracking-wider text-purple-300 font-bold mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    {UI_TEXT[lang].structuralAdvantage}
                  </h4>
                  <p className="text-slate-200">
                    {lang === 'en'
                      ? building.architecturalAdvantageEn
                      : building.architecturalAdvantageHi}
                  </p>
                </div>
                <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-1">
                    {lang === 'en' ? 'Conic Geometric Advantage:' : 'शंकु ज्यामितीय लाभ:'}
                  </span>
                  {lang === 'en' ? building.formulaNoteEn : building.formulaNoteHi}
                </div>
              </div>
            )}

            {activeTab === 'acoustic' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 bg-slate-900/70 rounded-xl border border-emerald-900/30">
                  <h4 className="text-xs uppercase tracking-wider text-emerald-300 font-bold mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    {UI_TEXT[lang].acousticOrLoadBearing}
                  </h4>
                  <p className="text-slate-200">
                    {lang === 'en'
                      ? building.acousticOrStructuralPropertyEn
                      : building.acousticOrStructuralPropertyHi}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {/* Dimensions Table */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2.5">
                    {UI_TEXT[lang].keyDimensions}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(building.keyDimensions).map(([metric, value]) => (
                      <div key={metric} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">{metric}:</span>
                        <span className="font-mono text-slate-200 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fun Fact / Secret */}
                <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/20 rounded-xl border border-amber-800/40">
                  <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {UI_TEXT[lang].funFact}
                  </h4>
                  <p className="text-slate-300 text-xs">
                    {lang === 'en' ? building.funFactEn : building.funFactHi}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-t border-[#333333] bg-[#141414] shrink-0">
          <div className="flex items-center gap-2">
            <a
              id={`modal-footer-wikipedia-link-${building.id}`}
              href={`https://en.wikipedia.org/wiki/${building.wikipediaId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-sky-400/60 shadow-sm transition-all group"
              title={lang === 'en' ? `Read full historical article on Wikipedia for ${building.nameEn}` : `विकिपीडिया पर पूरा लेख पढ़ें: ${building.nameHi}`}
            >
              <span className="w-4 h-4 rounded bg-slate-100 text-slate-900 flex items-center justify-center font-serif font-black text-[10px] leading-none shrink-0 group-hover:scale-110 transition-transform">
                W
              </span>
              <span>{UI_TEXT[lang].readOnWikipedia}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 shrink-0 transition-colors" />
            </a>

            {showARCameraInShapeCard && onOpenARCamera && (
              <button
                id="modal-footer-ar-camera-btn"
                onClick={() => onOpenARCamera(building.conicType, lang === 'en' ? building.nameEn : building.nameHi)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#B6FFED]/15 hover:bg-[#B6FFED]/25 text-[#B6FFED] border border-[#B6FFED]/40 shadow-[0_0_12px_rgba(182,255,237,0.15)] transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#B6FFED]" />
                <span>{UI_TEXT[lang].viewInARCamera}</span>
              </button>
            )}
          </div>

          <button
            id="modal-footer-close-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            {UI_TEXT[lang].close}
          </button>
        </div>
      </div>
    </div>
  );
};
