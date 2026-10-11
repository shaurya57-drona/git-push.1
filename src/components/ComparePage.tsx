import React, { useState, useEffect } from 'react';
import { Building, ConicType, Language } from '../types';
import { BUILDINGS_DATA } from '../data/buildings';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import {
  getCompareState,
  saveCompareState,
  clearCompare,
} from '../utils/compareStorage';
import {
  ArrowLeft,
  ArrowLeftRight,
  RotateCcw,
  Scale,
  Shield,
  Compass,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Grid3X3,
} from 'lucide-react';

interface ComparePageProps {
  lang: Language;
  onNavigateHome: () => void;
  onNavigateShape: (shape: ConicType) => void;
  onToggleLanguage: () => void;
}

// Architectural context metadata mappings
const ARCHITECTURAL_METADATA: Record<
  string,
  {
    functionEn: string;
    functionHi: string;
    styleEn: string;
    styleHi: string;
    bestUseContextEn: string;
    bestUseContextHi: string;
  }
> = {
  // Circles
  pantheon: {
    functionEn: 'Civic Monument & Roman Temple Dome',
    functionHi: 'नागरिक स्मारक व रोमन मंदिर गुंबद',
    styleEn: 'Classical Roman Imperial Architecture',
    styleHi: 'शास्त्रीय रोमन साम्राज्यवादी वास्तुकला',
    bestUseContextEn: 'Monumental civic halls where maximizing internal volume with zero corner stress is essential.',
    bestUseContextHi: 'भव्य नागरिक हॉल जहां शून्य कोने के तनाव के साथ आंतरिक स्थान को अधिकतम करना आवश्यक हो।',
  },
  'apple-park': {
    functionEn: 'Corporate Global Headquarters & Collaborative Office Ring',
    functionHi: 'कॉर्पोरेट वैश्विक मुख्यालय व सहयोगात्मक कार्यालय वलय',
    styleEn: 'Neo-Futuristic High-Tech Sustainable Architecture',
    styleHi: 'नव-भविष्यवादी उच्च तकनीक पर्यावरण-अनुकूल वास्तुकला',
    bestUseContextEn: 'Campus facilities promoting continuous loop circulation and seamless 360-degree daylighting.',
    bestUseContextHi: 'परिसर सुविधाएं जो निरंतर परिसंचरण और 360 डिग्री प्राकृतिक प्रकाश को बढ़ावा देती हैं।',
  },
  'lotus-temple': {
    functionEn: 'Baháʼí House of Worship & Public Sanctuary',
    functionHi: 'बहाई उपासना स्थल व सार्वजनिक अभयारण्य',
    styleEn: 'Expressionist Biomimetic Geometry',
    styleHi: 'अभिव्यक्तिवादी बायोमिमेटिक ज्यामिति',
    bestUseContextEn: 'Spiritual or meditative sanctuaries requiring radial symmetry and petal-derived daylight intake.',
    bestUseContextHi: 'आध्यात्मिक या ध्यान केंद्र जहां रेडियल समरूपता और प्राकृतिक प्रकाश की आवश्यकता होती है।',
  },
  'cappadocia-church': {
    functionEn: 'Troglodyte Monastic Sanctuary & Subterranean Church',
    functionHi: 'भूमिगत रॉक-कट मठ व गुफा चर्च',
    styleEn: 'Early Christian Byzantine Rock-Cut Architecture',
    styleHi: 'प्रारंभिक ईसाई बीजान्टिन रॉक-कट वास्तुकला',
    bestUseContextEn: 'Underground subterranean excavations where radial ceiling compression prevents geological cave-ins.',
    bestUseContextHi: 'भूमिगत उत्खनन जहां रेडियल संपीड़न भूगर्भीय गुहाओं को ढहने से रोकता है।',
  },

  // Parabolas
  'gateway-arch': {
    functionEn: 'National Monument & Transcontinental Gateway',
    functionHi: 'राष्ट्रीय स्मारक व प्रवेश द्वार',
    styleEn: 'Structural Mid-Century Modern Monumentalism',
    styleHi: 'संरचनात्मक मध्य-शताब्दी आधुनिकतावाद',
    bestUseContextEn: 'Freestanding soaring gateways and wide river-crossing spans subjected to uniform gravity loading.',
    bestUseContextHi: 'स्वतंत्र ऊंचे प्रवेश द्वार और नदी पुल जो समान गुरुत्वाकर्षण भार के अधीन होते हैं।',
  },
  'golden-gate-bridge': {
    functionEn: 'Interstate Suspension Highway Bridge',
    functionHi: 'अंतरराज्यीय निलंबन राजमार्ग पुल',
    styleEn: 'Art Deco Industrial Civil Engineering',
    styleHi: 'आर्ट डेको औद्योगिक सिविल इंजीनियरिंग',
    bestUseContextEn: 'Extreme deep-water nautical channels where intermediate piers cannot be physically founded.',
    bestUseContextHi: 'अत्यधिक गहरे पानी के समुद्री चैनल जहां मध्यवर्ती खंभे नहीं बनाए जा सकते।',
  },
  'valle-de-los-caidos': {
    functionEn: 'Subterranean Basilica Vault & Monumental Crypt',
    functionHi: 'भूमिगत बेसिलिका वॉल्ट व विशाल समाधि',
    styleEn: 'Neo-Herrerian Colossal Monolithic Vaulting',
    styleHi: 'विशाल अखंड रॉक वॉल्टिंग',
    bestUseContextEn: 'Heavily surcharged mountainous tunnels requiring pure compressive thrust arching.',
    bestUseContextHi: 'पहाड़ी सुरंगें जहां शुद्ध संपीड़न थ्रस्ट आर्चिंग की आवश्यकता होती है।',
  },
  'st-louis-planetarium': {
    functionEn: 'Public Celestial Observatory & Science Museum',
    functionHi: 'तारामंडल वेधशाला व विज्ञान संग्रहालय',
    styleEn: 'Space Age Expressionist Concrete Shell',
    styleHi: 'अंतरिक्ष युग अभिव्यक्तिवादी कंक्रीट शेल',
    bestUseContextEn: 'Science exhibition pavilions and planetariums needing acoustic shielding and aerodynamic wind flow.',
    bestUseContextHi: 'विज्ञान प्रदर्शनी मंडप और तारामंडल जिन्हें ध्वनिक ढाल और वायु प्रवाह की आवश्यकता होती है।',
  },

  // Ellipses
  colosseum: {
    functionEn: 'Imperial Roman Amphitheater & Spectator Arena',
    functionHi: 'शाही रोमन एम्फीथिएटर व दर्शक दीर्घा',
    styleEn: 'Ancient Roman Classical Concrete & Travertine Arches',
    styleHi: 'प्राचीन रोमन कंक्रीट व ट्रैवर्टाइन मेहराब',
    bestUseContextEn: 'High-capacity civic sporting arenas requiring dual focal vistas and continuous crowd egress routes.',
    bestUseContextHi: 'उच्च क्षमता वाले खेल स्टेडियम जहां दोहरे फोकस वाले दृश्य और त्वरित निकास मार्ग चाहिए।',
  },
  'st-pauls-cathedral': {
    functionEn: 'Anglican Cathedral & Whispering Dome Gallery',
    functionHi: 'एंग्लिकन कैथेड्रल व व्हिस्परिंग गैलरी गुंबद',
    styleEn: 'English Baroque Masterpiece',
    styleHi: 'इंग्लिश बारोक उत्कृष्ट कृति',
    bestUseContextEn: 'Chamber auditoriums and parliamentary chambers utilizing passive acoustic focus without microphones.',
    bestUseContextHi: 'ऑडिटोरियम और संसदीय कक्ष जहां बिना माइक्रोफोन के ध्वनि तरंगों का संचरण आवश्यक हो।',
  },
  'statuary-hall': {
    functionEn: 'Legislative Chamber & United States National Statuary Hall',
    functionHi: 'विधायी कक्ष व राष्ट्रीय मूर्ति हॉल',
    styleEn: 'Neoclassical Civic Hall',
    styleHi: 'नियोक्लासिकल नागरिक हॉल',
    bestUseContextEn: 'Historic assembly chambers designed for bifocal debate and distinct directional acoustic paths.',
    bestUseContextHi: 'संसदीय सभा कक्ष जो द्विनाभीय बहस और विशिष्ट दिशात्मक ध्वनिक मार्गों के लिए डिज़ाइन किए गए हों।',
  },
  'sydney-olympic-stadium': {
    functionEn: 'International Multi-Sport Olympic Stadium',
    functionHi: 'अंतरराष्ट्रीय बहु-खेल ओलंपिक स्टेडियम',
    styleEn: 'High-Tech Contemporary Tensile Stadium Truss',
    styleHi: 'उच्च तकनीक समकालीन स्टेडियम ट्रस',
    bestUseContextEn: 'Modern Olympic super-stadiums needing unobstructed sightlines and aerodynamic wind deflection.',
    bestUseContextHi: 'आधुनिक ओलंपिक स्टेडियम जहां अबाधित दृश्य और तेज हवाओं से सुरक्षा की आवश्यकता होती है।',
  },

  // Hyperbolas
  'canton-tower': {
    functionEn: 'Telecommunications & Observation Supertall Needle',
    functionHi: 'दूरसंचार व अवलोकन सुपरटॉल मीनार',
    styleEn: 'Twisted Parametric Hyperboloid Lattice',
    styleHi: 'ट्विस्टेड पैरामीट्रिक हाइपरबोलोइड लैटिस',
    bestUseContextEn: 'Typhoon-zone megatowers requiring straight-beam erection, torsional stiffness, and vortex shedding.',
    bestUseContextHi: 'तूफान-प्रवण क्षेत्र जहां सीधी बीम निर्माण, मरोड़ कठोरता और हवा काटने की क्षमता चाहिए।',
  },
  'sagrada-familia': {
    functionEn: 'Basilica & Transverse Vaulted Nave',
    functionHi: 'बेसिलिका व ट्रांसवर्स वॉल्टेड नेव',
    styleEn: 'Catalan Modernisme & Ruled Geometric Organicism',
    styleHi: 'कैटलन आधुनिकतावाद व ज्यामितीय ऑर्गेनिज़्म',
    bestUseContextEn: 'Cathedral naves where hyperbolic paraboloid vaults transition sunlight seamlessly through column forests.',
    bestUseContextHi: 'कैथेड्रल वॉल्ट जहां सूर्य का प्रकाश सीधी रेखाओं के माध्यम से जमीन तक सुचारू रूप से पहुंचे।',
  },
  'kobe-port-tower': {
    functionEn: 'Maritime Harbor Beacon & Landmark Observatory',
    functionHi: 'समुद्री बंदरगाह लाइटहाउस व वेधशाला',
    styleEn: 'Japanese Postwar Structural Red Steel Truss',
    styleHi: 'जापानी युद्धोत्तर लाल स्टील ट्रस',
    bestUseContextEn: 'High-seismic coastal ports where straight tubular steel diagonals resist destructive earthquake shear.',
    bestUseContextHi: 'भूकंप प्रवण तटीय बंदरगाह जहां सीधी स्टील नलिकाएं भूकंपीय झटकों को आसानी से झेल सकें।',
  },
  'cooling-towers': {
    functionEn: 'Industrial Evaporative Thermodynamic Heat Sink',
    functionHi: 'औद्योगिक वाष्पीकरणीय थर्मोडायनामिक हीट सिंक',
    styleEn: 'Thin-Shell Reinforced Concrete Hyperboloid',
    styleHi: 'पतला शेल प्रबलित कंक्रीट हाइपरबोलोइड',
    bestUseContextEn: 'Thermal power facilities needing passive aerodynamic chimney draft without mechanical exhaust fans.',
    bestUseContextHi: 'थर्मल पावर स्टेशन जिन्हें बिना पंखों के प्राकृतिक रूप से गर्म हवा ऊपर फेंकने की आवश्यकता हो।',
  },
};

export const ComparePage: React.FC<ComparePageProps> = ({
  lang,
  onNavigateHome,
  onNavigateShape,
  onToggleLanguage,
}) => {
  const { showGrid, toggleGrid } = useBlueprintGrid();
  const [selectedAId, setSelectedAId] = useState<string>(() => {
    const s = getCompareState();
    return s.idA || 'pantheon';
  });

  const [selectedBId, setSelectedBId] = useState<string>(() => {
    const s = getCompareState();
    return s.idB || (s.idA === 'gateway-arch' ? 'canton-tower' : 'gateway-arch');
  });

  // Listen to global compare changes
  useEffect(() => {
    const handleCompareChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.idA) setSelectedAId(detail.idA);
      if (detail?.idB) setSelectedBId(detail.idB);
    };
    window.addEventListener('conic_compare_change', handleCompareChange);
    return () => window.removeEventListener('conic_compare_change', handleCompareChange);
  }, []);

  const bA = BUILDINGS_DATA.find((b) => b.id === selectedAId) || BUILDINGS_DATA[0];
  const bB = BUILDINGS_DATA.find((b) => b.id === selectedBId) || BUILDINGS_DATA[4];

  const conicA = CONIC_INFO[bA.conicType];
  const conicB = CONIC_INFO[bB.conicType];

  const metaA = ARCHITECTURAL_METADATA[bA.id] || {
    functionEn: 'Civic Architectural Masterpiece',
    functionHi: 'नागरिक स्थापत्य उत्कृष्ट कृति',
    styleEn: 'Modern Structural Engineering',
    styleHi: 'आधुनिक संरचनात्मक इंजीनियरिंग',
    bestUseContextEn: 'Optimized conic structural execution.',
    bestUseContextHi: 'अनुकूलित कॉनिक संरचनात्मक निर्माण।',
  };

  const metaB = ARCHITECTURAL_METADATA[bB.id] || {
    functionEn: 'Civic Architectural Masterpiece',
    functionHi: 'नागरिक स्थापत्य उत्कृष्ट कृति',
    styleEn: 'Modern Structural Engineering',
    styleHi: 'आधुनिक संरचनात्मक इंजीनियरिंग',
    bestUseContextEn: 'Optimized conic structural execution.',
    bestUseContextHi: 'अनुकूलित कॉनिक संरचनात्मक निर्माण।',
  };

  const handleSwap = () => {
    const tempA = selectedAId;
    const tempB = selectedBId;
    setSelectedAId(tempB);
    setSelectedBId(tempA);
    saveCompareState({ idA: tempB, idB: tempA });
  };

  const handleReset = () => {
    clearCompare();
    setSelectedAId('pantheon');
    setSelectedBId('gateway-arch');
  };

  const handleSelectA = (id: string) => {
    setSelectedAId(id);
    saveCompareState({ idA: id, idB: selectedBId });
  };

  const handleSelectB = (id: string) => {
    setSelectedBId(id);
    saveCompareState({ idA: selectedAId, idB: id });
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#3b82f6]/30 selection:text-white transition-colors ${showGrid ? 'has-blueprint-grid' : 'no-blueprint-grid'}`}>
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर वापस'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-neutral-800 text-[#B6FFED]">
              <Scale className="w-4 h-4" />
            </span>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide font-display">
              {lang === 'en' ? 'STRUCTURE COMPARISON' : 'संरचना तुलना'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Blueprint Grid Overlay Toggle Button */}
            <button
              onClick={toggleGrid}
              className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                showGrid
                  ? 'bg-neutral-900 border-[#B6FFED]/40 text-[#B6FFED] hover:border-[#B6FFED]/80 shadow-[0_0_12px_rgba(182,255,237,0.1)]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
              title={
                showGrid
                  ? (lang === 'en' ? 'Blueprint grid: On (Click to turn off for a clean visual experience)' : 'ब्लूप्रिंट ग्रिड: चालू (बंद करने हेतु क्लिक करें)')
                  : (lang === 'en' ? 'Blueprint grid: Off (Click to turn on grid overlay)' : 'ब्लूप्रिंट ग्रिड: बंद (ग्रिड दिखाने हेतु क्लिक करें)')
              }
              aria-label="Toggle blueprint grid overlay"
              aria-pressed={showGrid}
            >
              <Grid3X3 className={`w-3.5 h-3.5 transition-colors ${showGrid ? 'text-[#B6FFED]' : 'text-neutral-400'}`} />
              <span className="hidden sm:inline">
                {showGrid ? UI_TEXT[lang].gridOn : UI_TEXT[lang].gridOff}
              </span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111316] p-4 sm:p-5 rounded-xl border border-neutral-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {lang === 'en' ? 'Structure Comparison' : 'संरचना तुलना'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              {lang === 'en'
                ? 'Compare geometry, equations, and structural mechanics.'
                : 'ज्यामिति, समीकरण और संरचनात्मक यांत्रिकी की तुलना करें।'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'Swap A ↔ B' : 'स्थान बदलें'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
              <span>{lang === 'en' ? 'Reset' : 'रीसेट'}</span>
            </button>
          </div>
        </div>

        {/* Structure Selector Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111316] p-4 rounded-xl border border-neutral-800/80">
            <label className="block text-xs font-mono font-semibold text-[#B6FFED] uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Structure A' : 'इमारत A'}
            </label>
            <select
              value={selectedAId}
              onChange={(e) => handleSelectA(e.target.value)}
              className="w-full bg-[#0b0d0f] border border-neutral-800 text-neutral-200 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#B6FFED]/60 font-sans cursor-pointer"
            >
              {BUILDINGS_DATA.map((b) => (
                <option key={`a-${b.id}`} value={b.id}>
                  {lang === 'en' ? b.nameEn : b.nameHi} — ({b.conicType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#111316] p-4 rounded-xl border border-neutral-800/80">
            <label className="block text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Structure B' : 'इमारत B'}
            </label>
            <select
              value={selectedBId}
              onChange={(e) => handleSelectB(e.target.value)}
              className="w-full bg-[#0b0d0f] border border-neutral-800 text-neutral-200 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-purple-400 font-sans cursor-pointer"
            >
              {BUILDINGS_DATA.map((b) => (
                <option key={`b-${b.id}`} value={b.id}>
                  {lang === 'en' ? b.nameEn : b.nameHi} — ({b.conicType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SIDE-BY-SIDE MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ============================================================ */}
          {/* STRUCTURE A */}
          {/* ============================================================ */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${conicA.badgeBg}`}>
                  {conicA.symbol} {lang === 'en' ? conicA.nameEn : conicA.nameHi}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300">
                  e = {bA.eccentricity.toFixed(3)}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                {lang === 'en' ? bA.nameEn : bA.nameHi}
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {bA.city}, {bA.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {bA.yearBuilt}
                  </span>
                </div>
                <a
                  id={`compare-wiki-link-${bA.id}`}
                  href={`https://en.wikipedia.org/wiki/${bA.wikipediaId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors group"
                  title={lang === 'en' ? `Read on Wikipedia: ${bA.nameEn}` : `विकिपीडिया पर पढ़ें: ${bA.nameHi}`}
                >
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-900 flex items-center justify-center font-serif font-black text-[9px] leading-none">
                    W
                  </span>
                  <span>{UI_TEXT[lang].readOnWikipedia}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-400 shrink-0" />
                </a>
              </div>
            </div>

            {/* 1. Shape Type */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Shape Type & Geometric Definition' : 'ज्यामितीय प्रकार व परिभाषा'}
              </div>
              <div className="text-sm font-semibold text-white">
                {lang === 'en' ? conicA.nameEn : conicA.nameHi} ({conicA.eccentricityDef})
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? conicA.planeAngleDescEn : conicA.planeAngleDescHi}
              </p>
            </div>

            {/* 2. Architectural Function */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Architectural Function' : 'स्थापत्य कार्य'}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {lang === 'en' ? metaA.functionEn : metaA.functionHi}
              </div>
            </div>

            {/* 3. Visual Style */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Visual Style & Design Philosophy' : 'दृश्य शैली व डिजाइन दर्शन'}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {lang === 'en' ? metaA.styleEn : metaA.styleHi}
              </div>
            </div>

            {/* 4. Engineering Meaning */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'en' ? 'Engineering Meaning & Structural Load' : 'इंजीनियरिंग महत्व व संरचनात्मक भार'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? bA.architecturalAdvantageEn : bA.architecturalAdvantageHi}
              </p>
              <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{lang === 'en' ? 'Acoustic/Statics: ' : 'ध्वनिकी/यांत्रिकी: '}</span>
                {lang === 'en' ? bA.acousticOrStructuralPropertyEn : bA.acousticOrStructuralPropertyHi}
              </div>
            </div>

            {/* 5. Equation Reference */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-sans tracking-wider font-bold">
                {lang === 'en' ? 'Equation Reference' : 'समीकरण संदर्भ'}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-sky-300">
                {bA.realWorldEquation}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {lang === 'en' ? bA.formulaNoteEn : bA.formulaNoteHi}
              </div>
            </div>

            {/* 6. Best-Use Context */}
            <div className="bg-sky-950/20 p-4 rounded-xl border border-sky-900/40 space-y-1">
              <div className="text-[10px] text-sky-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Best-Use Context' : 'उपयोग के लिए सर्वोत्तम संदर्भ'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? metaA.bestUseContextEn : metaA.bestUseContextHi}
              </p>
            </div>

            {/* Key Dimensions */}
            <div className="border-t border-slate-800 pt-4 space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-2">
                {lang === 'en' ? 'Engineering Dimensions' : 'इंजीनियरिंग आयाम'}
              </div>
              {Object.entries(bA.parameters).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-400">
                  <span>{key}:</span>
                  <span className="text-slate-200 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* STRUCTURE B */}
          {/* ============================================================ */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${conicB.badgeBg}`}>
                  {conicB.symbol} {lang === 'en' ? conicB.nameEn : conicB.nameHi}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-300">
                  e = {bB.eccentricity.toFixed(3)}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                {lang === 'en' ? bB.nameEn : bB.nameHi}
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5">
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {bB.city}, {bB.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {bB.yearBuilt}
                  </span>
                </div>
                <a
                  id={`compare-wiki-link-${bB.id}`}
                  href={`https://en.wikipedia.org/wiki/${bB.wikipediaId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors group"
                  title={lang === 'en' ? `Read on Wikipedia: ${bB.nameEn}` : `विकिपीडिया पर पढ़ें: ${bB.nameHi}`}
                >
                  <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-900 flex items-center justify-center font-serif font-black text-[9px] leading-none">
                    W
                  </span>
                  <span>{UI_TEXT[lang].readOnWikipedia}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-purple-400 shrink-0" />
                </a>
              </div>
            </div>

            {/* 1. Shape Type */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Shape Type & Geometric Definition' : 'ज्यामितीय प्रकार व परिभाषा'}
              </div>
              <div className="text-sm font-semibold text-white">
                {lang === 'en' ? conicB.nameEn : conicB.nameHi} ({conicB.eccentricityDef})
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? conicB.planeAngleDescEn : conicB.planeAngleDescHi}
              </p>
            </div>

            {/* 2. Architectural Function */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Architectural Function' : 'स्थापत्य कार्य'}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {lang === 'en' ? metaB.functionEn : metaB.functionHi}
              </div>
            </div>

            {/* 3. Visual Style */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {lang === 'en' ? 'Visual Style & Design Philosophy' : 'दृश्य शैली व डिजाइन दर्शन'}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {lang === 'en' ? metaB.styleEn : metaB.styleHi}
              </div>
            </div>

            {/* 4. Engineering Meaning */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'en' ? 'Engineering Meaning & Structural Load' : 'इंजीनियरिंग महत्व व संरचनात्मक भार'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? bB.architecturalAdvantageEn : bB.architecturalAdvantageHi}
              </p>
              <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{lang === 'en' ? 'Acoustic/Statics: ' : 'ध्वनिकी/यांत्रिकी: '}</span>
                {lang === 'en' ? bB.acousticOrStructuralPropertyEn : bB.acousticOrStructuralPropertyHi}
              </div>
            </div>

            {/* 5. Equation Reference */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-sans tracking-wider font-bold">
                {lang === 'en' ? 'Equation Reference' : 'समीकरण संदर्भ'}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-purple-300">
                {bB.realWorldEquation}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {lang === 'en' ? bB.formulaNoteEn : bB.formulaNoteHi}
              </div>
            </div>

            {/* 6. Best-Use Context */}
            <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-900/40 space-y-1">
              <div className="text-[10px] text-purple-400 uppercase tracking-wider font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Best-Use Context' : 'उपयोग के लिए सर्वोत्तम संदर्भ'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'en' ? metaB.bestUseContextEn : metaB.bestUseContextHi}
              </p>
            </div>

            {/* Key Dimensions */}
            <div className="border-t border-slate-800 pt-4 space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-slate-500 uppercase font-sans font-bold mb-2">
                {lang === 'en' ? 'Engineering Dimensions' : 'इंजीनियरिंग आयाम'}
              </div>
              {Object.entries(bB.parameters).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-400">
                  <span>{key}:</span>
                  <span className="text-slate-200 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CLEAR CONCLUSION BOX (Exact Requirement) */}
        {/* ============================================================ */}
        <div id="compare-conclusion" className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              {lang === 'en' ? 'Engineering Synthesis & Conclusion' : 'इंजीनियरिंग निष्कर्ष व संश्लेषण'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>{lang === 'en' ? `${bA.nameEn} Mechanics` : `${bA.nameHi} यांत्रिकी`}</span>
              </h4>
              <p className="text-slate-400">
                {lang === 'en'
                  ? `Leverages ${conicA.nameEn.toLowerCase()} geometry (eccentricity e = ${bA.eccentricity.toFixed(2)}) to achieve structural efficiency. It transforms applied dead loads into optimal stress channels without dangerous localized shears.`
                  : `${bA.nameHi} ${conicA.nameHi} ज्यामिति (e = ${bA.eccentricity.toFixed(2)}) का उपयोग करके संरचनात्मक दक्षता प्राप्त करता है और सभी भारों को सुरक्षित रूप से नींव में स्थानांतरित करता है।`}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>{lang === 'en' ? `${bB.nameEn} Mechanics` : `${bB.nameHi} यांत्रिकी`}</span>
              </h4>
              <p className="text-slate-400">
                {lang === 'en'
                  ? `Employs ${conicB.nameEn.toLowerCase()} geometry (eccentricity e = ${bB.eccentricity.toFixed(2)}) tailored to its site-specific constraints, demonstrating how pure conic mathematics directly solves monumental engineering challenges.`
                  : `${bB.nameHi} ${conicB.nameHi} ज्यामिति (e = ${bB.eccentricity.toFixed(2)}) का उपयोग करता है, जो यह साबित करता है कि गणितीय वक्र सीधे वास्तविक इंजीनियरिंग चुनौतियों का समाधान करते हैं।`}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              {lang === 'en'
                ? 'Conic sections remain modern structural engineering\'s most reliable mathematical foundation.'
                : 'कॉनिक सेक्शन आधुनिक संरचनात्मक इंजीनियरिंग का सबसे विश्वसनीय गणितीय आधार बने हुए हैं।'}
            </span>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors self-start sm:self-auto cursor-pointer"
            >
              {lang === 'en' ? 'Explore Other Conic Zones' : 'अन्य कॉनिक क्षेत्र देखें'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
