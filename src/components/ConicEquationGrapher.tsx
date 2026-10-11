import React, { useState } from 'react';
import { ConicType, Language } from '../types';
import { UI_TEXT, CONIC_INFO } from '../data/translations';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import { Calculator, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConicEquationGrapherProps {
  lang: Language;
}

export const ConicEquationGrapher: React.FC<ConicEquationGrapherProps> = ({ lang }) => {
  const { showGrid } = useBlueprintGrid();
  const [selectedType, setSelectedType] = useState<ConicType>('ellipse');

  // Sliders for parameters
  const [paramA, setParamA] = useState<number>(5); // a
  const [paramB, setParamB] = useState<number>(3); // b
  const [paramH, setParamH] = useState<number>(0); // h center
  const [paramK, setParamK] = useState<number>(0); // k center
  const [paramP, setParamP] = useState<number>(2); // p for parabola

  // Calculate geometric properties
  let eccentricity = 0;
  let fociDistance = 0;
  let discriminant = 0;
  let discriminantType = '';
  let standardEquationText = '';
  let generalEquationText = '';
  let latusRectum = 0;

  if (selectedType === 'circle') {
    eccentricity = 0;
    fociDistance = 0;
    discriminant = -4 * 1 * 1; // A=1, C=1, B=0 => -4
    discriminantType = 'Δ < 0, A = C (Circle)';
    standardEquationText = `(x - ${paramH})² + (y - ${paramK})² = ${paramA}²`;
    generalEquationText = `x² + y² - ${2 * paramH}x - ${2 * paramK}y + ${paramH * paramH + paramK * paramK - paramA * paramA} = 0`;
    latusRectum = 2 * paramA;
  } else if (selectedType === 'ellipse') {
    const a = Math.max(paramA, paramB);
    const b = Math.min(paramA, paramB);
    fociDistance = Math.sqrt(Math.max(0, a * a - b * b));
    eccentricity = fociDistance / a;
    discriminant = -4 * (1 / (a * a)) * (1 / (b * b));
    discriminantType = 'Δ < 0, A ≠ C (Ellipse)';
    standardEquationText = `(x - ${paramH})²/${a * a} + (y - ${paramK})²/${b * b} = 1`;
    latusRectum = (2 * b * b) / a;
    generalEquationText = `${b * b}x² + ${a * a}y² - ${2 * b * b * paramH}x - ${2 * a * a * paramK}y + C₀ = 0`;
  } else if (selectedType === 'parabola') {
    eccentricity = 1.0;
    fociDistance = paramP;
    discriminant = 0;
    discriminantType = 'Δ = 0 (Parabola)';
    standardEquationText = `(x - ${paramH})² = ${4 * paramP}(y - ${paramK})`;
    generalEquationText = `x² - ${2 * paramH}x - ${4 * paramP}y + ${paramH * paramH + 4 * paramP * paramK} = 0`;
    latusRectum = 4 * paramP;
  } else {
    // Hyperbola
    const a = paramA;
    const b = paramB;
    fociDistance = Math.sqrt(a * a + b * b);
    eccentricity = fociDistance / a;
    discriminant = -4 * (1 / (a * a)) * (-1 / (b * b)); // > 0
    discriminantType = 'Δ > 0 (Hyperbola)';
    standardEquationText = `(x - ${paramH})²/${a * a} - (y - ${paramK})²/${b * b} = 1`;
    latusRectum = (2 * b * b) / a;
    generalEquationText = `${b * b}x² - ${a * a}y² - ${2 * b * b * paramH}x + ${2 * a * a * paramK}y + C₀ = 0`;
  }

  // SVG coordinate transformation
  const svgWidth = 460;
  const svgHeight = 360;
  const originX = svgWidth / 2 + paramH * 22;
  const originY = svgHeight / 2 - paramK * 22;
  const scale = 22; // 22 pixels per math unit

  // Generate SVG path for conic curve
  const renderConicPath = () => {
    if (selectedType === 'circle') {
      return (
        <circle
          cx={originX}
          cy={originY}
          r={paramA * scale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        />
      );
    } else if (selectedType === 'ellipse') {
      const rx = paramA * scale;
      const ry = paramB * scale;
      return (
        <ellipse
          cx={originX}
          cy={originY}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="#c084fc"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
        />
      );
    } else if (selectedType === 'parabola') {
      // (x - h)² = 4p (y - k) => y = k + (x - h)² / (4p)
      const pts: string[] = [];
      for (let xMath = -9; xMath <= 9; xMath += 0.2) {
        const yMath = (xMath * xMath) / (4 * paramP);
        const px = originX + xMath * scale;
        const py = originY - yMath * scale;
        pts.push(`${px},${py}`);
      }
      return (
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
        />
      );
    } else {
      // Hyperbola: x²/a² - y²/b² = 1 => x = ± a * sqrt(1 + y²/b²)
      const ptsRight: string[] = [];
      const ptsLeft: string[] = [];
      for (let yMath = -7; yMath <= 7; yMath += 0.2) {
        const xVal = paramA * Math.sqrt(1 + (yMath * yMath) / (paramB * paramB));
        ptsRight.push(`${originX + xVal * scale},${originY - yMath * scale}`);
        ptsLeft.push(`${originX - xVal * scale},${originY - yMath * scale}`);
      }
      return (
        <>
          <polyline
            points={ptsRight.join(' ')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          />
          <polyline
            points={ptsLeft.join(' ')}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          />
          {/* Asymptotes: y = ± (b/a) x */}
          <line
            x1={originX - 9 * scale}
            y1={originY + 9 * (paramB / paramA) * scale}
            x2={originX + 9 * scale}
            y2={originY - 9 * (paramB / paramA) * scale}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <line
            x1={originX - 9 * scale}
            y1={originY - 9 * (paramB / paramA) * scale}
            x2={originX + 9 * scale}
            y2={originY + 9 * (paramB / paramA) * scale}
            stroke="#ef4444"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </>
      );
    }
  };

  return (
    <div id="equation-engine" className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white font-display">
              {UI_TEXT[lang].discriminantTitle}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl font-mono">
            {UI_TEXT[lang].discriminantFormula} &nbsp;|&nbsp; {UI_TEXT[lang].discriminantCalc}
          </p>
        </div>

        {/* Conic Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(['circle', 'ellipse', 'parabola', 'hyperbola'] as ConicType[]).map((type) => {
            const info = CONIC_INFO[type];
            return (
              <button
                key={type}
                id={`graph-tab-${type}`}
                onClick={() => setSelectedType(type)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all border ${
                  selectedType === type
                    ? `${info.badgeBg} shadow-md`
                    : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {info.symbol} {lang === 'en' ? info.nameEn : info.nameHi}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: SVG Graph & Math Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-7 bg-[#070a14] rounded-xl border border-slate-800 p-2 relative overflow-hidden flex items-center justify-center shadow-inner min-h-[360px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[380px] select-none"
          >
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={svgWidth} height={svgHeight} fill={showGrid ? "url(#grid)" : "transparent"} />

            {/* Axes */}
            <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#475569" strokeWidth="1.5" />
            <line x1={svgWidth / 2} y1="0" x2={svgWidth / 2} y2={svgHeight} stroke="#475569" strokeWidth="1.5" />

            {/* Origin Marker */}
            <circle cx={svgWidth / 2} cy={svgHeight / 2} r="3" fill="#64748b" />
            <text x={svgWidth / 2 + 6} y={svgHeight / 2 + 14} fill="#64748b" fontSize="10" fontFamily="Fira Code">
              (0,0)
            </text>

            {/* Dynamic Conic Path */}
            {renderConicPath()}

            {/* Center/Vertex Point */}
            <circle cx={originX} cy={originY} r="4" fill="#38bdf8" />
            <text x={originX + 6} y={originY - 6} fill="#38bdf8" fontSize="10" fontFamily="Fira Code">
              C({paramH},{paramK})
            </text>

            {/* Foci Markers */}
            {selectedType === 'ellipse' && (
              <>
                <circle cx={originX - fociDistance * scale} cy={originY} r="4" fill="#f59e0b" />
                <circle cx={originX + fociDistance * scale} cy={originY} r="4" fill="#f59e0b" />
                <text x={originX + fociDistance * scale + 5} y={originY - 5} fill="#f59e0b" fontSize="10" fontFamily="Fira Code">
                  F₂
                </text>
                <text x={originX - fociDistance * scale - 18} y={originY - 5} fill="#f59e0b" fontSize="10" fontFamily="Fira Code">
                  F₁
                </text>
              </>
            )}

            {selectedType === 'parabola' && (
              <>
                <circle cx={originX} cy={originY - paramP * scale} r="4" fill="#f59e0b" />
                <text x={originX + 6} y={originY - paramP * scale - 6} fill="#f59e0b" fontSize="10" fontFamily="Fira Code">
                  F(0, p)
                </text>
                {/* Directrix line: y = -p */}
                <line
                  x1="0"
                  y1={originY + paramP * scale}
                  x2={svgWidth}
                  y2={originY + paramP * scale}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text x="10" y={originY + paramP * scale - 5} fill="#ef4444" fontSize="10" fontFamily="Fira Code">
                  Directrix y = -p
                </text>
              </>
            )}

            {selectedType === 'hyperbola' && (
              <>
                <circle cx={originX - fociDistance * scale} cy={originY} r="4" fill="#f59e0b" />
                <circle cx={originX + fociDistance * scale} cy={originY} r="4" fill="#f59e0b" />
                <text x={originX + fociDistance * scale + 5} y={originY - 5} fill="#f59e0b" fontSize="10" fontFamily="Fira Code">
                  F₂
                </text>
                <text x={originX - fociDistance * scale - 18} y={originY - 5} fill="#f59e0b" fontSize="10" fontFamily="Fira Code">
                  F₁
                </text>
              </>
            )}
          </svg>

          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
            Scale: 1 unit = 22px
          </div>
        </div>

        {/* Math Breakdown & Interactive Sliders */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Sliders Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-slate-200 font-medium text-xs uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'en' ? 'Geometric Parameters' : 'ज्यामितीय पैरामीटर्स'}</span>
            </div>

            {/* Slider a */}
            {selectedType !== 'parabola' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">
                    {selectedType === 'circle' ? (lang === 'en' ? 'Radius (r)' : 'त्रिज्या (r)') : (lang === 'en' ? 'Semi-Major Axis (a)' : 'अर्ध-दीर्घ अक्ष (a)')}
                  </span>
                  <span className="font-mono text-sky-400 font-bold">{paramA}</span>
                </div>
                <input
                  id="param-a"
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={paramA}
                  onChange={(e) => setParamA(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            )}

            {/* Slider b */}
            {(selectedType === 'ellipse' || selectedType === 'hyperbola') && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{lang === 'en' ? 'Semi-Minor Axis (b)' : 'अर्ध-लघु अक्ष (b)'}</span>
                  <span className="font-mono text-purple-400 font-bold">{paramB}</span>
                </div>
                <input
                  id="param-b"
                  type="range"
                  min="1"
                  max="7"
                  step="0.5"
                  value={paramB}
                  onChange={(e) => setParamB(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            )}

            {/* Slider p for Parabola */}
            {selectedType === 'parabola' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{lang === 'en' ? 'Focal Distance (p)' : 'नाभीय दूरी (p)'}</span>
                  <span className="font-mono text-emerald-400 font-bold">{paramP}</span>
                </div>
                <input
                  id="param-p"
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.25"
                  value={paramP}
                  onChange={(e) => setParamP(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            )}

            {/* Center offsets */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">h:</span>
                  <span className="font-mono text-slate-200">{paramH}</span>
                </div>
                <input
                  id="param-h"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={paramH}
                  onChange={(e) => setParamH(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-slate-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">k:</span>
                  <span className="font-mono text-slate-200">{paramK}</span>
                </div>
                <input
                  id="param-k"
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={paramK}
                  onChange={(e) => setParamK(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Mathematical Analysis Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs font-mono space-y-2.5">
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-sans mb-0.5">
                {lang === 'en' ? 'Standard Canonical Form' : 'मानक कैनोनिकल रूप'}
              </div>
              <div className="text-sm font-bold text-amber-300">{standardEquationText}</div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400 font-sans">{lang === 'en' ? 'Discriminant Condition:' : 'विविक्तकर शर्त:'}</span>
              <span className="text-emerald-400 font-semibold">{discriminantType}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400 font-sans">{lang === 'en' ? 'Eccentricity (e):' : 'उत्केंद्रता (e):'}</span>
              <span className="text-sky-400 font-bold">{eccentricity.toFixed(3)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-400 font-sans">{lang === 'en' ? 'Focal Length (c):' : 'नाभीय लंबाई (c):'}</span>
              <span className="text-purple-400 font-semibold">{fociDistance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 font-sans">{lang === 'en' ? 'Latus Rectum Length:' : 'नाभिलम्ब जीवा (Latus Rectum):'}</span>
              <span className="text-amber-400 font-semibold">{latusRectum.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
