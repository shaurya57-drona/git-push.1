import React from 'react';
import { ConicType, Language } from '../types';
import { ShieldCheck, Award, TrendingUp, CheckCircle2, Compass, Layers, Globe } from 'lucide-react';

interface CityScorecardProps {
  mode?: 'city' | 'shape';
  conicType?: ConicType;
  lang: Language;
}

export const CityScorecard: React.FC<CityScorecardProps> = ({ mode = 'city', conicType = 'circle', lang }) => {
  if (mode === 'shape') {
    const shapeScorecards: Record<
      ConicType,
      {
        score: number;
        efficiencyLabelEn: string;
        efficiencyLabelHi: string;
        metrics: { labelEn: string; labelHi: string; value: string; rating: string }[];
        badgeColor: string;
      }
    > = {
      circle: {
        score: 99,
        efficiencyLabelEn: 'Uniform Hoop Stress & Volumetric Optimization',
        efficiencyLabelHi: 'समान हूप तनाव व आयतन अनुकूलन',
        badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
        metrics: [
          { labelEn: 'Eccentricity (e)', labelHi: 'उत्केंद्रता (e)', value: '0.000', rating: 'Strictly Constant' },
          { labelEn: 'Circumferential Hoop Tension', labelHi: 'परिधीय हूप तनाव', value: '99.4%', rating: 'Pure Membrane' },
          { labelEn: 'Floor Area to Perimeter Ratio', labelHi: 'क्षेत्रफल से परिधि अनुपात', value: 'r / 2', rating: 'Maximum Possible' },
          { labelEn: 'Bending Moment Elimination', labelHi: 'बेंडिंग मोमेंट निवारण', value: '100%', rating: 'Zero Corner Stress' },
        ],
      },
      parabola: {
        score: 98,
        efficiencyLabelEn: 'Pure Axial Compression & Focal Collimation',
        efficiencyLabelHi: 'शुद्ध अक्षीय संपीड़न व फोकस संरेखण',
        badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
        metrics: [
          { labelEn: 'Eccentricity (e)', labelHi: 'उत्केंद्रता (e)', value: '1.000', rating: 'Unitary' },
          { labelEn: 'Uniform Load Thrust Line Fit', labelHi: 'थ्रस्ट लाइन सटीकता', value: '99.8%', rating: 'Zero Shear Arch' },
          { labelEn: 'Focal Parallel Wave Reflection', labelHi: 'समानांतर तरंग परावर्तन', value: '100%', rating: 'Optical & Acoustic' },
          { labelEn: 'Abutment Dead Load Direction', labelHi: 'आधार भार दिशा', value: 'Axial', rating: 'Zero Lateral Sag' },
        ],
      },
      ellipse: {
        score: 97,
        efficiencyLabelEn: 'Bifocal Acoustic Echo & Controlled Spans',
        efficiencyLabelHi: 'दोहरी नाभि प्रतिध्वनि व नियंत्रित विस्तार',
        badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
        metrics: [
          { labelEn: 'Eccentricity Range', labelHi: 'उत्केंद्रता सीमा', value: '0.45 – 0.88', rating: 'Dynamic Major/Minor' },
          { labelEn: 'Dual-Focal Echo Precision', labelHi: 'दोहरी नाभि ध्वनि परिशुद्धता', value: '98.2%', rating: 'Whispering Gallery' },
          { labelEn: 'Aerodynamic Wind Deflection', labelHi: 'पवन विक्षेपण दक्षता', value: '96.5%', rating: 'Turbulence Free' },
          { labelEn: 'Horizontal Clearance Envelope', labelHi: 'क्षैतिज निकासी', value: '2a Spans', rating: 'Low Rise Rise Profile' },
        ],
      },
      hyperbola: {
        score: 98,
        efficiencyLabelEn: 'Doubly Ruled Construction & Thermal Convection',
        efficiencyLabelHi: 'सीधी बीम निर्माण व प्राकृतिक वायु प्रवाह',
        badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
        metrics: [
          { labelEn: 'Eccentricity (e)', labelHi: 'उत्केंद्रता (e)', value: '> 1.000', rating: 'Hyperbolic Branch' },
          { labelEn: 'Straight-Line Ruled Fabrication', labelHi: 'सीधी बीम द्वारा निर्माण', value: '100%', rating: 'Zero Curved Forms' },
          { labelEn: 'Natural Thermal Draft Convection', labelHi: 'प्राकृतिक वायु संवहन', value: '+42%', rating: 'Venturi Acceleration' },
          { labelEn: 'Torsional Wind Resistance', labelHi: 'घुमावदार हवा प्रतिरोध', value: '97.9%', rating: 'Negative Curvature' },
        ],
      },
    };

    const current = shapeScorecards[conicType];

    return (
      <div className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium border ${current.badgeColor}`}>
                {lang === 'en' ? 'SHAPE SCORECARD' : 'ज्यामिति स्कोरकार्ड'}
              </span>
              <span className="text-xs text-neutral-400 font-mono">Rating: {current.score}/100</span>
            </div>
            <h4 className="text-base font-bold text-white font-display mt-1">
              {lang === 'en' ? current.efficiencyLabelEn : current.efficiencyLabelHi}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B6FFED]" />
            <span>{lang === 'en' ? 'Calculated via Finite Element Theory' : 'संरचनात्मक विश्लेषण प्रमाणित'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {current.metrics.map((m, idx) => (
            <div key={idx} className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3">
              <div className="text-[11px] text-neutral-400 mb-1 truncate">
                {lang === 'en' ? m.labelEn : m.labelHi}
              </div>
              <div className="text-base font-mono font-bold text-white mb-0.5">
                {m.value}
              </div>
              <div className="text-[10px] font-medium text-neutral-400 font-mono truncate">
                {m.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // City-wide scorecard preview for Homepage
  return (
    <div id="city-scorecard" className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B6FFED]" />
            <span>
              {lang === 'en'
                ? 'Engineering Performance Index'
                : 'इंजीनियरिंग प्रदर्शन सूचकांक'}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            {lang === 'en'
              ? 'Structural mechanics, material efficiency, and acoustic performance across 16 monuments.'
              : 'संरचनात्मक यांत्रिकी, सामग्री दक्षता और ध्वनिक प्रदर्शन का मूल्यांकन।'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto bg-[#0b0d0f] px-3.5 py-1.5 rounded-lg border border-neutral-800">
          <div className="text-right">
            <div className="text-[10px] text-neutral-500 uppercase font-mono">
              {lang === 'en' ? 'Score' : 'स्कोर'}
            </div>
            <div className="text-base font-mono font-bold text-white">
              98.4<span className="text-xs text-neutral-500 font-normal">/100</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-[#B6FFED]/10 border border-[#B6FFED]/30 flex items-center justify-center text-[#B6FFED]">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 4 Conic Quadrant Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {/* Circle Score */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-sky-300 border border-neutral-800">
              e = 0.000
            </span>
            <span className="text-xs font-mono font-bold text-neutral-200">99.4%</span>
          </div>
          <div className="text-sm font-semibold text-white font-display">
            {lang === 'en' ? 'Circle Zone' : 'वृत्त क्षेत्र'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {lang === 'en' ? 'Hoop tension dome equilibrium; 4 structures.' : 'हूप तनाव व गुंबद संतुलन; 4 इमारतें।'}
          </div>
        </div>

        {/* Parabola Score */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-orange-300 border border-neutral-800">
              e = 1.000
            </span>
            <span className="text-xs font-mono font-bold text-neutral-200">99.8%</span>
          </div>
          <div className="text-sm font-semibold text-white font-display">
            {lang === 'en' ? 'Parabola Zone' : 'परवलय क्षेत्र'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {lang === 'en' ? 'Zero-shear thrust catenaries; 4 structures.' : 'शून्य-कतरनी थ्रस्ट आर्च; 4 इमारतें।'}
          </div>
        </div>

        {/* Ellipse Score */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-emerald-300 border border-neutral-800">
              0 &lt; e &lt; 1
            </span>
            <span className="text-xs font-mono font-bold text-neutral-200">97.5%</span>
          </div>
          <div className="text-sm font-semibold text-white font-display">
            {lang === 'en' ? 'Ellipse Zone' : 'दीर्घवृत्त क्षेत्र'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {lang === 'en' ? 'Bifocal acoustic chambers; 4 structures.' : 'दोहरी नाभि ध्वनि कक्ष; 4 इमारतें।'}
          </div>
        </div>

        {/* Hyperbola Score */}
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-purple-300 border border-neutral-800">
              e &gt; 1.000
            </span>
            <span className="text-xs font-mono font-bold text-neutral-200">98.1%</span>
          </div>
          <div className="text-sm font-semibold text-white font-display">
            {lang === 'en' ? 'Hyperbola Zone' : 'अतिपरवलय क्षेत्र'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {lang === 'en' ? 'Doubly ruled wind-shedding shells; 4 structures.' : 'सीधी बीम से निर्मित मीनारें; 4 इमारतें।'}
          </div>
        </div>
      </div>

      {/* Global Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800 text-center font-mono">
        <div>
          <div className="text-lg sm:text-xl font-bold text-white">16</div>
          <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
            {lang === 'en' ? 'Structures' : 'इमारतें'}
          </div>
        </div>
        <div>
          <div className="text-lg sm:text-xl font-bold text-white">12</div>
          <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
            {lang === 'en' ? 'Countries' : 'देश'}
          </div>
        </div>
        <div>
          <div className="text-lg sm:text-xl font-bold text-white">4</div>
          <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
            {lang === 'en' ? 'Conic Curves' : 'शंकु वक्र'}
          </div>
        </div>
        <div>
          <div className="text-lg sm:text-xl font-bold text-[#B6FFED]">98.4%</div>
          <div className="text-[11px] text-neutral-400 font-sans mt-0.5">
            {lang === 'en' ? 'Structural Fit' : 'संरचनात्मक सटीकता'}
          </div>
        </div>
      </div>
    </div>
  );
};
