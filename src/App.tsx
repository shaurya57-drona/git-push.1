/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConicType, Building } from './types';
import { BUILDINGS_DATA } from './data/buildings';
import { useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './components/HomePage';
import { ShapePage } from './components/ShapePage';
import { ComparePage } from './components/ComparePage';
import { CompareFloatingBar } from './components/CompareFloatingBar';
import { BuildingDetailModal } from './components/BuildingDetailModal';
import { QRCodeModal } from './components/QRCodeModal';
import { CameraConicOverlay } from './components/CameraConicOverlay';
import { preloadAllShapeScenes } from './utils/shape3DCache';
import { preloadArchitectureModels } from './utils/architectureGeometries';

export default function App() {
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Active modal state
  const [activeModalBuilding, setActiveModalBuilding] = useState<Building | null>(null);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  // AR Camera Conic Overlay state
  const [showARCamera, setShowARCamera] = useState<boolean>(false);
  const [arInitialConic, setArInitialConic] = useState<ConicType>('parabola');
  const [arInitialPreset, setArInitialPreset] = useState<string | undefined>(undefined);

  const handleOpenARCamera = (conic: ConicType = 'parabola', buildingName?: string) => {
    setArInitialConic(conic);
    setArInitialPreset(buildingName);
    setShowARCamera(true);
  };

  useEffect(() => {
    // Pre-loaded scenes: ALL four 3D scenes and architectural models load on startup
    preloadAllShapeScenes();
    preloadArchitectureModels();
  }, []);

  // Modal navigation (next/prev)
  const handleModalNext = () => {
    if (!activeModalBuilding) return;
    const idx = BUILDINGS_DATA.findIndex((b) => b.id === activeModalBuilding.id);
    const nextIdx = (idx + 1) % BUILDINGS_DATA.length;
    setActiveModalBuilding(BUILDINGS_DATA[nextIdx]);
  };

  const handleModalPrev = () => {
    if (!activeModalBuilding) return;
    const idx = BUILDINGS_DATA.findIndex((b) => b.id === activeModalBuilding.id);
    const prevIdx = (idx - 1 + BUILDINGS_DATA.length) % BUILDINGS_DATA.length;
    setActiveModalBuilding(BUILDINGS_DATA[prevIdx]);
  };

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onOpenBuildingDetail={(b) => setActiveModalBuilding(b)}
              onOpenQRModal={() => setShowQRModal(true)}
              onOpenCompare={() => navigate('/compare')}
              onOpenCamOverlay={() => handleOpenARCamera('parabola')}
            />
          }
        />
        <Route
          path="/compare"
          element={
            <ComparePage
              lang={lang}
              onNavigateHome={() => navigate('/')}
              onNavigateShape={(shape) => navigate(`/${shape}`)}
              onToggleLanguage={toggleLanguage}
            />
          }
        />
        <Route
          path="/circle"
          element={
            <ShapePage
              conicType="circle"
              buildings={BUILDINGS_DATA}
              lang={lang}
              onToggleLang={toggleLanguage}
              onBackToHome={() => navigate('/')}
              onOpenBuildingDetail={(b) => setActiveModalBuilding(b)}
              onOpenCompare={() => navigate('/compare')}
              onOpenARCamera={() => handleOpenARCamera('circle')}
            />
          }
        />
        <Route
          path="/parabola"
          element={
            <ShapePage
              conicType="parabola"
              buildings={BUILDINGS_DATA}
              lang={lang}
              onToggleLang={toggleLanguage}
              onBackToHome={() => navigate('/')}
              onOpenBuildingDetail={(b) => setActiveModalBuilding(b)}
              onOpenCompare={() => navigate('/compare')}
              onOpenARCamera={() => handleOpenARCamera('parabola')}
            />
          }
        />
        <Route
          path="/ellipse"
          element={
            <ShapePage
              conicType="ellipse"
              buildings={BUILDINGS_DATA}
              lang={lang}
              onToggleLang={toggleLanguage}
              onBackToHome={() => navigate('/')}
              onOpenBuildingDetail={(b) => setActiveModalBuilding(b)}
              onOpenCompare={() => navigate('/compare')}
              onOpenARCamera={() => handleOpenARCamera('ellipse')}
            />
          }
        />
        <Route
          path="/hyperbola"
          element={
            <ShapePage
              conicType="hyperbola"
              buildings={BUILDINGS_DATA}
              lang={lang}
              onToggleLang={toggleLanguage}
              onBackToHome={() => navigate('/')}
              onOpenBuildingDetail={(b) => setActiveModalBuilding(b)}
              onOpenCompare={() => navigate('/compare')}
              onOpenARCamera={() => handleOpenARCamera('hyperbola')}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Persistent Compare Floating Bar */}
      <CompareFloatingBar lang={lang} onOpenCompare={() => navigate('/compare')} />

      {/* Building Detail Modal */}
      {activeModalBuilding && (
        <BuildingDetailModal
          building={activeModalBuilding}
          lang={lang}
          onClose={() => setActiveModalBuilding(null)}
          onSelectNext={handleModalNext}
          onSelectPrev={handleModalPrev}
          onOpenARCamera={(conicType, buildingName) => handleOpenARCamera(conicType, buildingName)}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal lang={lang} onClose={() => setShowQRModal(false)} />
      )}

      {/* Camera Conic AR Overlay Modal */}
      {showARCamera && (
        <CameraConicOverlay
          lang={lang}
          initialConic={arInitialConic}
          initialPresetName={arInitialPreset}
          onClose={() => setShowARCamera(false)}
        />
      )}
    </AuthProvider>
  );
}
