import React, { useState } from 'react';
import { Building, Language } from '../types';
import { BUILDINGS_DATA } from '../data/buildings';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { Scale, ArrowLeftRight, Check, MapPin, Calendar, Compass, Shield, ExternalLink } from 'lucide-react';

interface BuildingComparisonProps {
  lang: Language;
}

export const BuildingComparison: React.FC<BuildingComparisonProps> = ({ lang }) => {
  const [buildingAId, setBuildingAId] = useState<string>('gateway-arch'); // Parabola
  const [buildingBId, setBuildingBId] = useState<string>('canton-tower'); // Hyperbola

  const buildingA = BUILDINGS_DATA.find((b) => b.id === buildingAId) || BUILDINGS_DATA[0];
  const buildingB = BUILDINGS_DATA.find((b) => b.id === buildingBId) || BUILDINGS_DATA[4];

  const conicA = CONIC_INFO[buildingA.conicType];
  const conicB = CONIC_INFO[buildingB.conicType];

  return (
    <div id="compare-matrix" className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-neutral-800 text-[#B6FFED]">
              <Scale className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {UI_TEXT[lang].compareTitle}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            {UI_TEXT[lang].compareSubtitle}
          </p>
        </div>

        {/* Quick swap button */}
        <button
          id="swap-comparison"
          onClick={() => {
            const temp = buildingAId;
            setBuildingAId(buildingBId);
            setBuildingBId(temp);
          }}
          className="text-xs px-3 py-1.5 rounded-lg font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-colors flex items-center gap-1.5 self-start md:self-auto border border-neutral-800 cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#B6FFED]" />
          <span>{lang === 'en' ? 'Swap' : 'स्थान बदलें'}</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-mono font-semibold text-[#B6FFED] uppercase tracking-wider mb-1.5">
            {UI_TEXT[lang].selectBuildingA}
          </label>
          <select
            id="select-building-a"
            value={buildingAId}
            onChange={(e) => setBuildingAId(e.target.value)}
            className="w-full bg-[#0b0d0f] border border-neutral-800 text-neutral-200 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#B6FFED]/60 cursor-pointer"
          >
            {BUILDINGS_DATA.map((b) => (
              <option key={b.id} value={b.id}>
                {lang === 'en' ? b.nameEn : b.nameHi} ({b.conicType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
            {UI_TEXT[lang].selectBuildingB}
          </label>
          <select
            id="select-building-b"
            value={buildingBId}
            onChange={(e) => setBuildingBId(e.target.value)}
            className="w-full bg-[#0b0d0f] border border-neutral-800 text-neutral-200 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            {BUILDINGS_DATA.map((b) => (
              <option key={b.id} value={b.id}>
                {lang === 'en' ? b.nameEn : b.nameHi} ({b.conicType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monument A Card */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium border ${conicA.badgeBg}`}>
                {conicA.symbol} {lang === 'en' ? conicA.nameEn : conicA.nameHi}
              </span>
              <span className="text-[11px] font-mono text-neutral-300 font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                e={buildingA.eccentricity.toFixed(3)}
              </span>
            </div>

            <h4 className="text-xl font-bold text-white font-display mb-1">
              {lang === 'en' ? buildingA.nameEn : buildingA.nameHi}
            </h4>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {buildingA.city}, {buildingA.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {buildingA.yearBuilt}
                </span>
              </div>
              <a
                id={`comparison-wiki-link-${buildingA.id}`}
                href={`https://en.wikipedia.org/wiki/${buildingA.wikipediaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors group"
                title={lang === 'en' ? `Read on Wikipedia: ${buildingA.nameEn}` : `विकिपीडिया पर पढ़ें: ${buildingA.nameHi}`}
              >
                <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-900 flex items-center justify-center font-serif font-black text-[9px] leading-none">
                  W
                </span>
                <span>{UI_TEXT[lang].readOnWikipedia}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-400 shrink-0" />
              </a>
            </div>

            {/* Real Equation */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs mb-3">
              <div className="text-[10px] text-slate-500 uppercase font-sans mb-0.5">
                {UI_TEXT[lang].realWorldEquation}
              </div>
              <div className="text-sky-300 font-bold text-sm">{buildingA.realWorldEquation}</div>
            </div>

            {/* Structural Rationale */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3">
              <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                {UI_TEXT[lang].structuralAdvantage}
              </div>
              <p>{lang === 'en' ? buildingA.architecturalAdvantageEn : buildingA.architecturalAdvantageHi}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="border-t border-slate-800 pt-3 text-xs space-y-1.5 font-mono">
            {Object.entries(buildingA.parameters).slice(0, 3).map(([key, val]) => (
              <div key={key} className="flex justify-between text-slate-400">
                <span>{key}:</span>
                <span className="text-slate-200 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monument B Card */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium border ${conicB.badgeBg}`}>
                {conicB.symbol} {lang === 'en' ? conicB.nameEn : conicB.nameHi}
              </span>
              <span className="text-[11px] font-mono text-neutral-300 font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                e={buildingB.eccentricity.toFixed(3)}
              </span>
            </div>

            <h4 className="text-xl font-bold text-white font-display mb-1">
              {lang === 'en' ? buildingB.nameEn : buildingB.nameHi}
            </h4>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="text-xs text-neutral-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  {buildingB.city}, {buildingB.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {buildingB.yearBuilt}
                </span>
              </div>
              <a
                id={`comparison-wiki-link-${buildingB.id}`}
                href={`https://en.wikipedia.org/wiki/${buildingB.wikipediaId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-colors group"
                title={lang === 'en' ? `Read on Wikipedia: ${buildingB.nameEn}` : `विकिपीडिया पर पढ़ें: ${buildingB.nameHi}`}
              >
                <span className="w-3.5 h-3.5 rounded bg-neutral-200 text-neutral-900 flex items-center justify-center font-serif font-black text-[9px] leading-none">
                  W
                </span>
                <span>{UI_TEXT[lang].readOnWikipedia}</span>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-purple-400 shrink-0" />
              </a>
            </div>

            {/* Real Equation */}
            <div className="bg-black/50 p-3 rounded-lg border border-neutral-800 font-mono text-xs mb-3">
              <div className="text-[10px] text-neutral-500 uppercase font-sans mb-0.5">
                {UI_TEXT[lang].realWorldEquation}
              </div>
              <div className="text-purple-300 font-bold text-sm">{buildingB.realWorldEquation}</div>
            </div>

            {/* Structural Rationale */}
            <div className="bg-black/30 p-3 rounded-lg border border-neutral-800 text-xs text-neutral-300 leading-relaxed mb-3">
              <div className="font-semibold text-neutral-200 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                {UI_TEXT[lang].structuralAdvantage}
              </div>
              <p>{lang === 'en' ? buildingB.architecturalAdvantageEn : buildingB.architecturalAdvantageHi}</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="border-t border-neutral-800 pt-3 text-xs space-y-1.5 font-mono">
            {Object.entries(buildingB.parameters).slice(0, 3).map(([key, val]) => (
              <div key={key} className="flex justify-between text-neutral-400">
                <span>{key}:</span>
                <span className="text-neutral-200 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
