import React, { useState, useEffect, useRef } from 'react';
import { ConicType, Language, Building } from '../types';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import { Shape3DCanvas, Shape3DCanvasHandle } from './Shape3DCanvas';
import { InformationPanel } from './InformationPanel';
import { BuildingCard } from './BuildingCard';
import { CityScorecard } from './CityScorecard';
import {
  Compass,
  Sparkles,
  Layers,
  Volume2,
  Cpu,
  ArrowRight,
  Globe,
  Sigma,
  CheckCircle2,
  Building2,
  BookOpen,
  History,
  Camera,
  Grid3X3,
} from 'lucide-react';

interface ShapePageProps {
  conicType: ConicType;
  buildings: Building[];
  lang: Language;
  onToggleLang: () => void;
  onBackToHome: () => void;
  onOpenBuildingDetail: (building: Building) => void;
  onOpenCompare?: () => void;
  onOpenARCamera?: () => void;
}

export const ShapePage: React.FC<ShapePageProps> = ({
  conicType,
  buildings,
  lang,
  onToggleLang,
  onBackToHome,
  onOpenBuildingDetail,
  onOpenCompare,
  onOpenARCamera,
}) => {
  const { showGrid, toggleGrid } = useBlueprintGrid();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    buildings[0]?.id || null
  );

  const info = CONIC_INFO[conicType];
  const shapeBuildings = buildings.filter((b) => b.conicType === conicType);
  const activeBuilding =
    shapeBuildings.find((b) => b.id === selectedBuildingId) || shapeBuildings[0];

  const shapeTitleUpper = conicType.toUpperCase();

  // ResizeObserver for the Three.js canvas container to dynamically update renderer size and camera aspect ratio,
  // preventing layout shifts on mobile orientation changes
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasHandleRef = useRef<Shape3DCanvasHandle>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      if (width <= 0 || height <= 0) return;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (canvasHandleRef.current) {
          canvasHandleRef.current.updateSize(width, height);
          const { camera, renderer } = canvasHandleRef.current;
          if (camera && renderer) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
          }
        }
      });
    });

    resizeObserver.observe(container);

    const handleOrientationChange = () => {
      // Dynamic update on mobile orientation changes
      setTimeout(() => {
        if (container && canvasHandleRef.current) {
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width > 0 && height > 0) {
            canvasHandleRef.current.updateSize(width, height);
            const { camera, renderer } = canvasHandleRef.current;
            if (camera && renderer) {
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
              renderer.setSize(width, height, false);
            }
          }
        }
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const handleSelectBuilding = (building: Building) => {
    setSelectedBuildingId(building.id);
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#ffffff] pb-20 font-sans selection:bg-[#3b82f6]/30 selection:text-white transition-colors ${showGrid ? 'has-blueprint-grid' : 'no-blueprint-grid'}`}>
      {/* ============================================================ */}
      {/* HEADER SECTION (Requirement: Back to Home unstyled gray text left, */}
      {/* Page title uppercase centered) */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Unstyled gray text back button */}
          <div className="flex items-center justify-start">
            <button
              onClick={onBackToHome}
              className="text-neutral-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>

          {/* Center: Shape Name uppercase centered */}
          <div className="flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-white uppercase text-center font-display">
              {shapeTitleUpper}
            </h1>
          </div>

          {/* Right: Grid Toggle, AR Camera and Bilingual toggle */}
          <div className="flex items-center justify-end gap-2">
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

            {onOpenARCamera && (
              <button
                id={`shape-${conicType}-ar-btn`}
                onClick={onOpenARCamera}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-neutral-700/80 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-[#B6FFED] transition-colors flex items-center gap-1.5 cursor-pointer"
                title={UI_TEXT[lang].cameraViewTitle}
              >
                <Camera className="w-3.5 h-3.5 text-[#B6FFED]" />
                <span className="hidden sm:inline">{UI_TEXT[lang].navCameraAR}</span>
              </button>
            )}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* ============================================================ */}
        {/* 3D VISUALIZATION SECTION */}
        {/* Canvas height 500px desktop / 350px mobile, full width, */}
        {/* border-radius 12px, dark gray gradient background */}
        {/* ============================================================ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-display">
                {lang === 'en'
                  ? `3D Mathematical Surface`
                  : `3D गणितीय ज्यामिति`}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {shapeBuildings.length} {lang === 'en' ? 'Structures' : 'इमारतें'}
            </span>
          </div>

          {/* Three.js Canvas Container with dynamic ResizeObserver to prevent layout shifts on mobile orientation changes */}
          <div
            ref={canvasContainerRef}
            id={`three-canvas-container-${conicType}`}
            className="w-full relative rounded-[12px] overflow-hidden"
          >
            <Shape3DCanvas
              ref={canvasHandleRef}
              conicType={conicType}
              buildings={shapeBuildings}
              selectedBuildingId={selectedBuildingId}
              onSelectBuilding={handleSelectBuilding}
              lang={lang}
            />
          </div>

          {/* Interactive Marker Nodes Quick Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {shapeBuildings.map((building) => {
              const isSelected = building.id === selectedBuildingId;
              return (
                <button
                  key={building.id}
                  onClick={() => handleSelectBuilding(building)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 border-[#B6FFED] ring-1 ring-[#B6FFED]/30'
                      : 'bg-[#111316] border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[10px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
                      style={{
                        color: building.accentColor,
                      }}
                    >
                      {building.city}
                    </span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#B6FFED]" />}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {lang === 'en' ? building.nameEn : building.nameHi}
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
                    {building.realWorldEquation}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* INFORMATION PANEL (Exact Specification) */}
        {/* ============================================================ */}
        <section className="pt-2">
          <InformationPanel conicType={conicType} lang={lang} />
        </section>

        {/* ============================================================ */}
        {/* MATHEMATICAL FOUNDATION CARD */}
        {/* ============================================================ */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${info.accentColor}25`,
                    color: info.accentColor,
                  }}
                >
                  {info.eccentricityFormula}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {lang === 'en' ? 'Plane angle' : 'तल कोण'}: {info.angleBeta}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {lang === 'en' ? info.nameEn : info.nameHi}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {lang === 'en' ? info.definitionEn : info.definitionHi}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                    <Sigma className="w-4 h-4 text-sky-400" />
                    <span>{lang === 'en' ? 'Standard Canonical Equation' : 'मानक समीकरण'}</span>
                  </div>
                  <code className="text-sm font-mono text-sky-300 font-bold block">
                    {info.standardForm}
                  </code>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'en' ? 'Eccentricity Parameter (e)' : 'उत्केंद्रता (e)'}</span>
                  </div>
                  <code className="text-sm font-mono text-emerald-300 font-bold block">
                    {info.eccentricityRange}
                  </code>
                </div>
              </div>
            </div>

            {/* Architectural Rationale & Physics Box */}
            <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>{lang === 'en' ? 'Architectural Advantage' : 'वास्तुशिल्पीय लाभ'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lang === 'en' ? info.architecturalSignificanceEn : info.architecturalSignificanceHi}
              </p>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'en' ? 'Structural & Acoustic Note' : 'ध्वनिक व संरचनात्मक गुण'}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'en'
                    ? activeBuilding.acousticOrStructuralPropertyEn
                    : activeBuilding.acousticOrStructuralPropertyHi}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SHAPE SCORECARD (Small Scorecard Spec Requirement) */}
        {/* ============================================================ */}
        <section className="pt-2">
          <CityScorecard mode="shape" conicType={conicType} lang={lang} />
        </section>

        {/* ============================================================ */}
        {/* 4 BUILDINGS GRID */}
        {/* ============================================================ */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                {lang === 'en'
                  ? `Real-World ${shapeTitleUpper} Architecture`
                  : `वास्तविक दुनिया के ${shapeTitleUpper} वास्तुशिल्प`}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {lang === 'en'
                  ? `Detailed mathematical equations, structural advantages, compare actions, and 3D models for all 4 researched monuments.`
                  : `सभी 4 स्मारकों के विस्तृत समीकरण, संरचनात्मक लाभ, तुलना और 3D मॉडल।`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shapeBuildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                lang={lang}
                onOpenDetails={(b) => {
                  handleSelectBuilding(b);
                  onOpenBuildingDetail(b);
                }}
                onOpenCompare={onOpenCompare}
              />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* REAL ARCHITECTURE INSPIRATION SECTION */}
        {/* ============================================================ */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <History className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                {lang === 'en' ? 'Real Architecture Inspiration' : 'वास्तविक वास्तुकला प्रेरणा'}
              </h3>
              <span className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Historical lineage & contemporary engineering breakthroughs'
                  : 'ऐतिहासिक विकास व समकालीन इंजीनियरिंग उपलब्धियां'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{lang === 'en' ? 'Historical Evolution' : 'ऐतिहासिक विकास'}</span>
              </h4>
              <p className="text-slate-400">
                {conicType === 'circle' &&
                  (lang === 'en'
                    ? 'From the Roman Pantheon (125 AD) to medieval domed cathedrals, circular geometry was civilization’s first mathematical mastery over gravity. Builders harnessed radial symmetry to create cavernous unreinforced spaces that have endured for millennia.'
                    : 'रोमन पैंथियन (125 ईस्वी) से लेकर मध्ययुगीन गुंबददार कैथेड्रल तक, वृत्ताकार ज्यामिति गुरुत्वाकर्षण पर मानव जाति की पहली गणितीय जीत थी।')}
                {conicType === 'parabola' &&
                  (lang === 'en'
                    ? 'First rigorously modeled by Galileo and later synthesized by Robert Hooke and Antoni Gaudí, parabolic catenaries convert vertical dead weight into purely axial compression, eliminating bending moments in monumental bridge and vault construction.'
                    : 'गैलीलियो और एंटोनी गौडी द्वारा विकसित, परवलयाकार वक्र ऊर्ध्वाधर भार को विशुद्ध रूप से अक्षीय संपीड़न में बदलते हैं, जिससे पुलों में मुड़ने का तनाव समाप्त हो जाता है।')}
                {conicType === 'ellipse' &&
                  (lang === 'en'
                    ? 'Beginning with the Roman Flavian Amphitheater in 80 AD and perfected in baroque cathedrals like St. Paul’s, elliptical planning unlocked dual focal sightlines and natural whispering chamber acoustics long before electronic amplification.'
                    : '80 ईस्वी के रोमन कोलोसियम से लेकर सेंट पॉल कैथेड्रल तक, दीर्घवृत्ताकार योजना ने इलेक्ट्रॉनिक लाउडस्पीकर से सदियों पहले दोहरे फोकस वाले दृश्य और व्हिस्परिंग गैलरी ध्वनिकी प्रदान की।')}
                {conicType === 'hyperbola' &&
                  (lang === 'en'
                    ? 'Pioneered by Russian engineer Vladimir Shukhov in 1896, hyperboloids revolutionized vertical engineering. Because hyperboloids of one sheet are doubly ruled surfaces, curved structures could be fabricated using perfectly straight beams.'
                    : '1896 में रूसी इंजीनियर व्लादिमीर शुखोव द्वारा शुरू की गई, अतिपरवलयिक मीनारों ने ऊर्ध्वाधर निर्माण में क्रांति ला दी क्योंकि इन्हें पूरी तरह से सीधी बीम से बनाया जा सकता है।')}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'en' ? 'Modern Structural Impact' : 'आधुनिक संरचनात्मक प्रभाव'}</span>
              </h4>
              <p className="text-slate-400">
                {conicType === 'circle' &&
                  (lang === 'en'
                    ? 'Contemporary mega-projects like Apple Park (Cupertino) and the Lotus Temple (New Delhi) apply high-precision CNC glass and post-tensioned radial concrete to achieve continuous airflow, 100% renewable energy capture, and earthquake resilience.'
                    : 'एप्पल पार्क और लोटस टेम्पल जैसे आधुनिक मेगा-प्रोजेक्ट भूकंप रोधी संरचना और प्राकृतिक वायु प्रवाह प्राप्त करने के लिए वृत्ताकार ज्यामिति का उपयोग करते हैं।')}
                {conicType === 'parabola' &&
                  (lang === 'en'
                    ? 'Modern suspension bridges like the Golden Gate and mega-arches like the Gateway Arch depend on parabolic cables and catenary ribs to cross colossal spans with minimal steel tonnage and zero central riverbed piers.'
                    : 'गोल्डन गेट जैसे सस्पेंशन ब्रिज और गेटवे आर्च न्यूनतम स्टील के साथ विशाल विस्तार को पार करने के लिए परवलयाकार केबलों पर निर्भर हैं।')}
                {conicType === 'ellipse' &&
                  (lang === 'en'
                    ? 'Modern Olympic venues like Stadium Australia and legislative arenas adopt elliptical envelopes to deflect turbulent crosswinds, maximize spectator capacity near midfield, and optimize cantilevered canopy overhangs.'
                    : 'आधुनिक ओलंपिक स्टेडियम तेज हवाओं को विक्षेपित करने और दर्शकों के बैठने की क्षमता को अधिकतम करने के लिए दीर्घवृत्ताकार आवरण अपनाते हैं।')}
                {conicType === 'hyperbola' &&
                  (lang === 'en'
                    ? 'Supertall icons like Guangzhou’s 600m Canton Tower and Kobe Port Tower use hyperbolic lattices to shed typhoon vortexes while industrial cooling towers exploit the narrow throat to accelerate natural thermal draft.'
                    : 'गुआंगझू का 600 मीटर कैंटन टॉवर और औद्योगिक कूलिंग टॉवर तूफानी हवाओं को काटने और प्राकृतिक वायु संवहन को गति देने के लिए इस आकार का उपयोग करते हैं।')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
