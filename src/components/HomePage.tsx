import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConicType, Building } from '../types';
import { BUILDINGS_DATA } from '../data/buildings';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import { ConicScene3D } from './ConicScene3D';
import { AcousticRaySimulator } from './AcousticRaySimulator';
import { ConicEquationGrapher } from './ConicEquationGrapher';
import { BuildingCard } from './BuildingCard';
import { BuildingComparison } from './BuildingComparison';
import { MathQuiz } from './MathQuiz';
import { MiniCity3DMap } from './MiniCity3DMap';
import { CityScorecard } from './CityScorecard';
import { AuthBar } from './AuthBar';
import { JudgeFeedbackSection } from './JudgeFeedbackSection';
import {
  Compass,
  Globe,
  Search,
  QrCode,
  Sparkles,
  Scale,
  Cpu,
  CheckCircle2,
  Box,
  ArrowRight,
  Landmark,
  X,
  Camera,
  Grid3X3,
} from 'lucide-react';

interface HomePageProps {
  onOpenBuildingDetail: (building: Building) => void;
  onOpenQRModal: () => void;
  onOpenCompare: () => void;
  onOpenCamOverlay?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBuildingDetail,
  onOpenQRModal,
  onOpenCompare,
  onOpenCamOverlay,
}) => {
  const { lang, toggleLanguage } = useLanguage();
  const { showGrid, toggleGrid } = useBlueprintGrid();
  const navigate = useNavigate();

  // Filter & Search states
  const [selectedConicFilter, setSelectedConicFilter] = useState<ConicType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active navigation section
  const [activeSection, setActiveSection] = useState<
    'monuments' | '3dlab' | 'acoustics' | 'grapher' | 'compare' | 'quiz' | 'feedback'
  >('monuments');

  // Filter buildings
  const filteredBuildings = BUILDINGS_DATA.filter((b) => {
    const matchesConic = selectedConicFilter === 'all' || b.conicType === selectedConicFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesConic;

    const matchesQuery =
      b.nameEn.toLowerCase().includes(query) ||
      b.nameHi.toLowerCase().includes(query) ||
      b.city.toLowerCase().includes(query) ||
      b.country.toLowerCase().includes(query) ||
      b.architect.toLowerCase().includes(query) ||
      b.conicType.toLowerCase().includes(query);

    return matchesConic && matchesQuery;
  });

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#ffffff] selection:bg-[#B6FFED]/30 selection:text-white font-sans transition-colors ${showGrid ? 'has-blueprint-grid' : 'no-blueprint-grid'}`}>
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 text-white no-underline group">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700/80 p-0.5 flex items-center justify-center group-hover:border-[#B6FFED]/60 transition-colors">
              <Compass className="w-5 h-5 text-[#B6FFED]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight font-display text-white">
                {UI_TEXT[lang].siteTitle}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium hidden sm:block">
                {UI_TEXT[lang].siteSubtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-400">
            <button
              onClick={() => setActiveSection('monuments')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'monuments'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navMonuments}
            </button>
            <button
              onClick={() => setActiveSection('3dlab')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === '3dlab'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navCone3D}
            </button>
            <button
              onClick={() => setActiveSection('acoustics')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'acoustics'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navAcoustics}
            </button>
            <button
              onClick={() => setActiveSection('grapher')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'grapher'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navGrapher}
            </button>
            <Link
              to="/compare"
              className="px-3 py-1.5 rounded-lg transition-colors hover:text-white hover:bg-neutral-900 border border-transparent text-neutral-400 no-underline"
            >
              {UI_TEXT[lang].navCompare}
            </Link>
            <button
              onClick={() => setActiveSection('quiz')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'quiz'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navQuiz}
            </button>
            <button
              onClick={() => setActiveSection('feedback')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'feedback'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'hover:text-white hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {UI_TEXT[lang].navFeedback}
            </button>
          </nav>

          {/* Action Buttons: AuthBar, Grid Toggle, AR Camera, QR Code & Bilingual Toggle */}
          <div className="flex items-center gap-2">
            <AuthBar lang={lang} onOpenBuilding={(b) => onOpenBuildingDetail(b)} />

            {/* Blueprint Grid Overlay Toggle Button */}
            <button
              id="header-blueprint-grid-toggle"
              onClick={toggleGrid}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                showGrid
                  ? 'bg-neutral-900 border-[#B6FFED]/40 text-[#B6FFED] hover:border-[#B6FFED]/80 shadow-[0_0_12px_rgba(182,255,237,0.1)]'
                  : 'bg-neutral-900 border-neutral-700/80 text-neutral-400 hover:text-white hover:border-neutral-600'
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

            {/* AR Camera Conic Overlay Trigger */}
            <button
              id="header-camera-ar-button"
              onClick={onOpenCamOverlay}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[#B6FFED] border border-neutral-700/80 hover:border-[#B6FFED]/40 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={UI_TEXT[lang].cameraViewTitle}
            >
              <Camera className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span className="hidden sm:inline">{UI_TEXT[lang].navCameraAR}</span>
            </button>

            <button
              id="header-qr-button"
              onClick={onOpenQRModal}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={UI_TEXT[lang].navQR}
            >
              <QrCode className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span className="hidden sm:inline">{lang === 'en' ? 'QR Code' : 'क्यूआर'}</span>
            </button>

            {/* Bilingual Toggle EN / HI */}
            <button
              id="language-toggle-button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title={lang === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Section Tabs */}
        <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 gap-1.5 border-t border-neutral-800 bg-[#0a0a0a]/90 text-xs scrollbar-none">
          {/* Mobile Blueprint Grid Toggle */}
          <button
            onClick={toggleGrid}
            className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors border font-medium flex items-center gap-1 text-[11px] cursor-pointer ${
              showGrid
                ? 'bg-neutral-800 text-[#B6FFED] border-[#B6FFED]/40'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800'
            }`}
            title="Toggle Blueprint Grid"
          >
            <Grid3X3 className="w-3 h-3" />
            <span>{showGrid ? (lang === 'en' ? 'Grid On' : 'ग्रिड') : (lang === 'en' ? 'Grid Off' : 'ग्रिड बंद')}</span>
          </button>
          <button
            onClick={onOpenCamOverlay}
            className="px-3 py-1 rounded-lg shrink-0 transition-colors bg-neutral-800 text-[#B6FFED] border border-neutral-700 font-medium flex items-center gap-1"
          >
            <Camera className="w-3 h-3" />
            <span>{UI_TEXT[lang].navCameraAR}</span>
          </button>
          <button
            onClick={() => setActiveSection('monuments')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === 'monuments' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navMonuments}
          </button>
          <button
            onClick={() => setActiveSection('3dlab')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === '3dlab' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navCone3D}
          </button>
          <button
            onClick={() => setActiveSection('acoustics')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === 'acoustics' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navAcoustics}
          </button>
          <button
            onClick={() => setActiveSection('grapher')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === 'grapher' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navGrapher}
          </button>
          <Link
            to="/compare"
            className="px-3 py-1 rounded-lg shrink-0 transition-colors text-neutral-400 hover:text-white"
          >
            {UI_TEXT[lang].navCompare}
          </Link>
          <button
            onClick={() => setActiveSection('quiz')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === 'quiz' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navQuiz}
          </button>
          <button
            onClick={() => setActiveSection('feedback')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
              activeSection === 'feedback' ? 'bg-neutral-800 text-white font-medium border border-neutral-700' : 'text-neutral-400'
            }`}
          >
            {UI_TEXT[lang].navFeedback}
          </button>
        </div>
      </header>

      {/* Hero Mathematical Banner */}
      <section className={`relative overflow-hidden pt-8 pb-10 border-b border-neutral-800 bg-[#0a0a0a] transition-all duration-300 ${showGrid ? 'blueprint-grid' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 pt-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#B6FFED]/80 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6FFED]/80 inline-block" />
              <span>{UI_TEXT[lang].tagline}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-3.5 leading-tight">
              {lang === 'en' ? 'Conic City: Geometry in Architecture' : 'कॉनिक सिटी: वास्तुकला में ज्यामिति'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
              {lang === 'en'
                ? 'Conic curves shaping structural equilibrium and acoustics across 16 world monuments.'
                : '16 विश्व स्मारकों में संरचनात्मक संतुलन और ध्वनिकी का ज्यामितीय अध्ययन।'}
            </p>

            {/* Quick Hero Actions - Minimalist styling */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
              <a
                href="#conic-city-3d-map"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#B6FFED] hover:bg-[#9effe4] text-[#0a0a0a] transition-colors flex items-center gap-1.5 no-underline"
              >
                <span>{lang === 'en' ? 'Explore 3D City Map' : '3D नगर मैप देखें'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                id="hero-camera-ar-button"
                onClick={onOpenCamOverlay}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[#111615] hover:bg-[#17201e] text-[#B6FFED] transition-colors border border-[#B6FFED]/30 hover:border-[#B6FFED]/60 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#B6FFED]" />
                <span>{UI_TEXT[lang].navCameraAR}</span>
              </button>

              <Link
                to="/compare"
                className="px-4 py-2 rounded-lg text-xs font-medium bg-[#121212] hover:bg-[#1a1a1a] text-slate-300 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-700 flex items-center gap-1.5 no-underline"
              >
                <Scale className="w-3.5 h-3.5 text-[#B6FFED]" />
                <span>{lang === 'en' ? 'Compare Structures' : 'संरचना तुलना'}</span>
              </Link>

              {/* Blueprint Grid Overlay Toggle Button */}
              <button
                id="hero-grid-toggle-button"
                onClick={toggleGrid}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer ${
                  showGrid
                    ? 'bg-[#111615] text-[#B6FFED] border-[#B6FFED]/40 hover:border-[#B6FFED]/70 shadow-[0_0_10px_rgba(182,255,237,0.08)]'
                    : 'bg-[#121212] text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
                title={
                  showGrid
                    ? (lang === 'en' ? 'Turn off blueprint grid for a cleaner visual experience' : 'स्वच्छ अनुभव हेतु ब्लूप्रिंट ग्रिड बंद करें')
                    : (lang === 'en' ? 'Turn on blueprint grid background overlay' : 'ब्लूप्रिंट ग्रिड पृष्ठभूमि चालू करें')
                }
              >
                <Grid3X3 className={`w-3.5 h-3.5 transition-colors ${showGrid ? 'text-[#B6FFED]' : 'text-neutral-400'}`} />
                <span>
                  {showGrid ? UI_TEXT[lang].gridOn : UI_TEXT[lang].gridOff}
                </span>
              </button>
            </div>
          </div>

          {/* 4 Clear Shape Entry Cards (Circle, Parabola, Ellipse, Hyperbola) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['circle', 'parabola', 'ellipse', 'hyperbola'] as ConicType[]).map((type) => {
              const info = CONIC_INFO[type];
              const isSelected = selectedConicFilter === type;

              const shapeConcept = {
                circle: {
                  en: 'Uniform 360° hoop stress distribution & maximum envelope.',
                  hi: 'समान 360° हूप तनाव व अधिकतम क्षेत्रफल आवरण।',
                  border: 'hover:border-sky-500/50',
                  color: '#38bdf8',
                },
                parabola: {
                  en: 'Pure axial compression catenaries & zero bending moments.',
                  hi: 'शुद्ध अक्षीय संपीड़न व शून्य बेंडिंग मोमेंट मेहराब।',
                  border: 'hover:border-orange-500/50',
                  color: '#fb923c',
                },
                ellipse: {
                  en: 'Bifocal acoustic reflection & aerodynamic arena profiles.',
                  hi: 'दोहरी नाभि ध्वनि परावर्तन व पवन विक्षेपण एरेना।',
                  border: 'hover:border-emerald-500/50',
                  color: '#34d399',
                },
                hyperbola: {
                  en: 'Doubly-ruled straight-beam lattice & natural draft cooling.',
                  hi: 'सीधी बीम से निर्मित मीनारें व प्राकृतिक वायु संवहन।',
                  border: 'hover:border-purple-500/50',
                  color: '#c084fc',
                },
              }[type];

              return (
                <div
                  key={type}
                  id={`hero-card-${type}`}
                  className={`group relative rounded-xl p-5 transition-all duration-200 border flex flex-col justify-between bg-[#111316] hover:bg-[#14171b] ${
                    isSelected
                      ? 'border-[#B6FFED] ring-1 ring-[#B6FFED]/40'
                      : `border-neutral-800/80 ${shapeConcept.border}`
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base"
                        style={{
                          backgroundColor: `${shapeConcept.color}15`,
                          color: shapeConcept.color,
                        }}
                      >
                        {info.symbol}
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 font-medium border border-neutral-800">
                        {info.eccentricityDef}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-display uppercase tracking-wide mt-1">
                      {lang === 'en' ? info.nameEn : info.nameHi}
                    </h3>
                    <div className="text-[11px] font-mono text-neutral-400 mb-2">
                      {info.generalEquation}
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                      {lang === 'en' ? shapeConcept.en : shapeConcept.hi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedConicFilter(type);
                        setActiveSection('monuments');
                      }}
                      className="text-xs text-neutral-400 hover:text-white cursor-pointer transition-colors"
                    >
                      {info.count} {lang === 'en' ? 'Structures' : 'इमारतें'}
                    </button>

                    <Link
                      to={`/${type}`}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold text-white transition-opacity flex items-center gap-1 cursor-pointer no-underline opacity-90 hover:opacity-100"
                      style={{ backgroundColor: shapeConcept.color }}
                      title={`Open dedicated /${type} 3D page`}
                    >
                      <span>/{type}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Interactive Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* SECTION: MINI 3D MAP PREVIEW */}
        <section id="conic-city-3d-map" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
                <Box className="w-5 h-5 text-sky-400" />
                <span>{lang === 'en' ? 'Conic City 3D Map' : 'कॉनिक सिटी 3D मानचित्र'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                {lang === 'en'
                  ? 'Interactive 3D cluster. Drag to rotate; click any district to explore.'
                  : '3D मॉडल। घुमाने के लिए ड्रैग करें, विस्तृत देखने के लिए क्लिक करें।'}
              </p>
            </div>
          </div>

          <MiniCity3DMap lang={lang} onSelectShape={(shape) => navigate(`/${shape}`)} />
        </section>

        {/* SECTION: CITY SCORECARD PREVIEW */}
        <section>
          <CityScorecard mode="city" lang={lang} />
        </section>

        {/* VIEW 1: 16 Monuments Masterworks Grid */}
        {activeSection === 'monuments' && (
          <section id="monuments-section" className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111316] p-3 sm:p-4 rounded-xl border border-neutral-800/80">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  id="filter-all"
                  onClick={() => setSelectedConicFilter('all')}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 border cursor-pointer ${
                    selectedConicFilter === 'all'
                      ? 'bg-neutral-800 text-white border-neutral-700 font-semibold'
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {UI_TEXT[lang].filterAll}
                </button>
                {(['circle', 'parabola', 'ellipse', 'hyperbola'] as ConicType[]).map((type) => {
                  const info = CONIC_INFO[type];
                  return (
                    <button
                      key={type}
                      id={`filter-${type}`}
                      onClick={() => setSelectedConicFilter(type)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 border cursor-pointer ${
                        selectedConicFilter === type
                          ? `${info.badgeBg}`
                          : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      {info.symbol} {lang === 'en' ? info.nameEn : info.nameHi}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="search-buildings-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={UI_TEXT[lang].searchPlaceholder}
                  className="w-full bg-[#0b0d0f] border border-neutral-800 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#B6FFED]/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                    title={lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Active search results counter indicator */}
            {searchQuery.trim() && (
              <div className="flex items-center justify-between px-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#B6FFED] shadow-[0_0_8px_#B6FFED] animate-pulse" />
                  <span>
                    {lang === 'en' ? 'Highlighting matches for ' : 'परिणाम खोज '}
                    <strong className="text-[#0a0a0a] font-bold bg-[#B6FFED] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(182,255,237,0.3)]">
                      "{searchQuery.trim()}"
                    </strong>
                    <span className="text-slate-400 ml-1.5">
                      ({filteredBuildings.length} {lang === 'en' ? (filteredBuildings.length === 1 ? 'structure found' : 'structures found') : 'इमारतें मिलीं'})
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#B6FFED] hover:underline font-semibold"
                >
                  {lang === 'en' ? 'Clear search' : 'खोज हटाएं'}
                </button>
              </div>
            )}

            {/* Buildings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredBuildings.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  lang={lang}
                  searchQuery={searchQuery}
                  onOpenDetails={(b) => onOpenBuildingDetail(b)}
                  onOpenCompare={onOpenCompare}
                />
              ))}
            </div>

            {filteredBuildings.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <p className="text-slate-400 text-sm">
                  {lang === 'en' ? 'No architectural structures matched your search query.' : 'आपकी खोज से मेल खाती कोई इमारत नहीं मिली।'}
                </p>
              </div>
            )}
          </section>
        )}

        {/* VIEW 2: 3D Double Cone Slicer */}
        {activeSection === '3dlab' && (
          <section id="slicer-section" className="space-y-6">
            <ConicScene3D
              lang={lang}
              onSelectConic={(conic) => {
                setSelectedConicFilter(conic);
                setActiveSection('monuments');
              }}
            />
          </section>
        )}

        {/* VIEW 3: Acoustic & Optics Ray Simulator */}
        {activeSection === 'acoustics' && (
          <section id="acoustics-section" className="space-y-6">
            <AcousticRaySimulator lang={lang} />
          </section>
        )}

        {/* VIEW 4: Equation Engine & Discriminant */}
        {activeSection === 'grapher' && (
          <section id="grapher-section" className="space-y-6">
            <ConicEquationGrapher lang={lang} />
          </section>
        )}

        {/* VIEW 5: Architecture Comparison Matrix */}
        {activeSection === 'compare' && (
          <section id="compare-section" className="space-y-6">
            <BuildingComparison lang={lang} />
          </section>
        )}

        {/* VIEW 6: Judge Challenge Math Quiz */}
        {activeSection === 'quiz' && (
          <section id="quiz-section" className="space-y-8">
            <MathQuiz lang={lang} />
            <div className="pt-2">
              <JudgeFeedbackSection lang={lang} />
            </div>
          </section>
        )}

        {/* VIEW 7: Judge Evaluation & Feedback (Firestore) */}
        {activeSection === 'feedback' && (
          <section id="feedback-section" className="space-y-6">
            <JudgeFeedbackSection lang={lang} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-[#0a0a0a] py-6 mt-16 text-[#b0b0b0] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-white font-medium text-xs">
            <Compass className="w-4 h-4 text-[#B6FFED]" />
            <span className="font-bold tracking-tight">CONIC CITY</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-normal">
              {lang === 'en' ? 'Geometry in Architecture' : 'वास्तुकला में ज्यामिति'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white border border-neutral-800 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
