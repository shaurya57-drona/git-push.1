import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Building, Language } from '../types';
import { RotateCw, RefreshCw, Layers, Compass, ZoomIn, ZoomOut, Grid3X3 } from 'lucide-react';
import { useArchitectureModel, getCachedArchitectureModel } from '../utils/architectureGeometries';
import { useBlueprintGrid } from '../context/BlueprintGridContext';

interface BuildingModel3DProps {
  building: Building;
  lang: Language;
}

type AnglePreset = 'iso' | 'front' | 'side' | 'top';

export const BuildingModel3D: React.FC<BuildingModel3DProps> = ({ building, lang }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { showGrid, toggleGrid } = useBlueprintGrid();
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false); // Start paused or allow user toggle
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [angleReadout, setAngleReadout] = useState<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const [activePreset, setActivePreset] = useState<AnglePreset | null>('iso');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Interaction refs
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoRotateRef = useRef<boolean>(false);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);

  // Use the useMemo-based architecture cache from architectureGeometries.ts
  const cachedModelGroup = useArchitectureModel(building.modelType, wireframe);

  // Synchronize state with ref
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    const dom = renderer.domElement;
    dom.style.display = 'block';
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.touchAction = 'none';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(dom);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(6, 10, 6);
    sun.castShadow = true;
    scene.add(sun);

    const blueRim = new THREE.DirectionalLight(0x38bdf8, 0.65);
    blueRim.position.set(-6, -4, -6);
    scene.add(blueRim);

    const violetAccent = new THREE.DirectionalLight(0xa855f7, 0.4);
    violetAccent.position.set(0, -6, 5);
    scene.add(violetAccent);

    // Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Set initial isometric orientation
    modelGroup.rotation.set(0.2, 0.6, 0);

    // Attach memoized model instance
    if (cachedModelGroup) {
      modelGroup.add(cachedModelGroup.clone(true));
    }

    // Circular ground grid
    const gridHelper = new THREE.GridHelper(8, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -1.2;
    gridHelper.visible = showGrid;
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    // ==========================================
    // MOUSE DRAG & POINTER ROTATION HANDLERS
    // ==========================================
    const onPointerDown = (e: PointerEvent) => {
      // Primary button (left click) or touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      try {
        dom.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for browsers that don't support capture on this target
      }

      isDraggingRef.current = true;
      setIsInteracting(true);
      targetRotationRef.current = null;
      setActivePreset(null);

      // Pause auto-rotation when user takes control to inspect
      autoRotateRef.current = false;
      setAutoRotate(false);

      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;

      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;

      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      // Apply rotation:
      // Horizontal drag (dx) controls yaw (rotation.y)
      // Vertical drag (dy) controls pitch (rotation.x)
      const rotSpeed = 0.007;
      modelGroupRef.current.rotation.y += dx * rotSpeed;

      // Clamp vertical pitch to [-75°, +75°] so model remains upright and inspectable
      const maxPitch = (Math.PI / 180) * 75;
      const newPitch = modelGroupRef.current.rotation.x + dy * rotSpeed;
      modelGroupRef.current.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, newPitch));

      // Record velocity for inertia damping
      velocityRef.current = {
        x: dx * rotSpeed,
        y: dy * rotSpeed,
      };

      // Update angle readout (in degrees)
      const yawDeg = Math.round(((modelGroupRef.current.rotation.y * 180) / Math.PI) % 360);
      const pitchDeg = Math.round((modelGroupRef.current.rotation.x * 180) / Math.PI);
      setAngleReadout({
        yaw: (yawDeg + 360) % 360,
        pitch: pitchDeg,
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsInteracting(false);

      try {
        if (dom.hasPointerCapture(e.pointerId)) {
          dom.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe ignore
      }
    };

    const onPointerCancel = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
    };

    // Mouse wheel zoom to inspect fine conic curves
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      const zoomFactor = e.deltaY * 0.005;
      const newDistance = cameraRef.current.position.length() + zoomFactor;
      const clampedDist = Math.max(2.5, Math.min(10.0, newDistance));

      cameraRef.current.position.setLength(clampedDist);
    };

    // Touch pinch-to-zoom
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDistanceRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchDistanceRef.current !== null && cameraRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = pinchDistanceRef.current - dist;
        pinchDistanceRef.current = dist;

        const newDistance = cameraRef.current.position.length() + delta * 0.02;
        const clampedDist = Math.max(2.5, Math.min(10.0, newDistance));
        cameraRef.current.position.setLength(clampedDist);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchDistanceRef.current = null;
      }
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerCancel);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd);

    // Resize Observer
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    // ==========================================
    // RENDER & INERTIA ANIMATION LOOP
    // ==========================================
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (modelGroupRef.current) {
        // Target orientation interpolation (smooth snap to presets)
        if (targetRotationRef.current) {
          const t = 0.12;
          modelGroupRef.current.rotation.x += (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * t;
          modelGroupRef.current.rotation.y += (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * t;

          if (
            Math.abs(targetRotationRef.current.x - modelGroupRef.current.rotation.x) < 0.001 &&
            Math.abs(targetRotationRef.current.y - modelGroupRef.current.rotation.y) < 0.001
          ) {
            modelGroupRef.current.rotation.x = targetRotationRef.current.x;
            modelGroupRef.current.rotation.y = targetRotationRef.current.y;
            targetRotationRef.current = null;
          }
        }
        // Auto-rotation if enabled and user isn't dragging
        else if (autoRotateRef.current && !isDraggingRef.current) {
          modelGroupRef.current.rotation.y += 0.006;
        }
        // Inertia damping after release
        else if (!isDraggingRef.current) {
          const damping = 0.92;
          if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
            modelGroupRef.current.rotation.y += velocityRef.current.x;

            const maxPitch = (Math.PI / 180) * 75;
            const newPitch = modelGroupRef.current.rotation.x + velocityRef.current.y;
            modelGroupRef.current.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, newPitch));

            velocityRef.current.x *= damping;
            velocityRef.current.y *= damping;
          }
        }

        // Live angle readout update
        const yawDeg = Math.round(((modelGroupRef.current.rotation.y * 180) / Math.PI) % 360);
        const pitchDeg = Math.round((modelGroupRef.current.rotation.x * 180) / Math.PI);
        setAngleReadout({
          yaw: (yawDeg + 360) % 360,
          pitch: pitchDeg,
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerCancel);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [building.id]);

  // Sync wireframe / cached model updates without rebuilding scene
  useEffect(() => {
    if (!modelGroupRef.current || !cachedModelGroup) return;
    while (modelGroupRef.current.children.length > 0) {
      modelGroupRef.current.remove(modelGroupRef.current.children[0]);
    }
    modelGroupRef.current.add(cachedModelGroup.clone(true));
  }, [cachedModelGroup]);

  // Preset inspection angles
  const applyPreset = useCallback((preset: AnglePreset) => {
    setActivePreset(preset);
    autoRotateRef.current = false;
    setAutoRotate(false);
    velocityRef.current = { x: 0, y: 0 };

    switch (preset) {
      case 'front':
        // Pure front elevation: inspects vertical parabola catenary or hyperbola throat curve
        targetRotationRef.current = { x: 0, y: 0 };
        break;
      case 'side':
        // Side profile view: inspects thickness and lateral curve profile
        targetRotationRef.current = { x: 0, y: Math.PI / 2 };
        break;
      case 'top':
        // Plan view from above: inspects ground plan ellipse or circle footprint
        targetRotationRef.current = { x: (Math.PI / 180) * 72, y: 0 };
        break;
      case 'iso':
      default:
        // Axonometric isometric 3D view
        targetRotationRef.current = { x: 0.25, y: 0.65 };
        break;
    }
  }, []);

  const resetCamera = () => {
    applyPreset('iso');
    if (cameraRef.current) {
      cameraRef.current.position.set(4.5, 3.2, 5.2);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const currentDist = cameraRef.current.position.length();
    const targetDist = direction === 'in' ? currentDist * 0.8 : currentDist * 1.25;
    const clampedDist = Math.max(2.5, Math.min(10.0, targetDist));
    cameraRef.current.position.setLength(clampedDist);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
      {/* 3D Canvas Mount with drag cursor feedback */}
      <div
        ref={mountRef}
        className={`w-full h-[320px] sm:h-[380px] touch-none select-none ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Floating HUD - Equations & Eccentricity */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-300">
          {building.standardEquation}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-amber-300">
            e = {building.eccentricity.toFixed(3)}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-800 text-sky-300/90">
            ∠ {angleReadout.yaw}° / {angleReadout.pitch}°
          </span>
        </div>
      </div>

      {/* Mouse Drag Instruction Overlay */}
      <div className="absolute top-3 right-3 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/75 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-slate-400">
        <Compass className="w-3 h-3 text-[#B6FFED]" />
        <span>{lang === 'en' ? 'Drag: Rotate • Scroll: Zoom' : 'ड्रैग: घुमाएं • स्क्रॉल: ज़ूम'}</span>
      </div>

      {/* Architectural Angle Presets */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/70 text-[11px] font-medium">
        <span className="text-[10px] uppercase font-mono px-1.5 text-slate-400 hidden sm:inline">
          {lang === 'en' ? 'View:' : 'दृश्य:'}
        </span>
        <button
          onClick={() => applyPreset('iso')}
          className={`px-2 py-0.5 rounded transition-colors ${
            activePreset === 'iso'
              ? 'bg-[#B6FFED] text-black font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={lang === 'en' ? 'Isometric 3D perspective' : 'त्रिविमीय दृश्य'}
        >
          {lang === 'en' ? '3D Iso' : '3D'}
        </button>
        <button
          onClick={() => applyPreset('front')}
          className={`px-2 py-0.5 rounded transition-colors ${
            activePreset === 'front'
              ? 'bg-[#B6FFED] text-black font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={lang === 'en' ? 'Front elevation (conic curve profile)' : 'सामने का दृश्य'}
        >
          {lang === 'en' ? 'Front' : 'सामने'}
        </button>
        <button
          onClick={() => applyPreset('side')}
          className={`px-2 py-0.5 rounded transition-colors ${
            activePreset === 'side'
              ? 'bg-[#B6FFED] text-black font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={lang === 'en' ? 'Side elevation cross-section' : 'पार्श्व दृश्य'}
        >
          {lang === 'en' ? 'Side' : 'पार्श्व'}
        </button>
        <button
          onClick={() => applyPreset('top')}
          className={`px-2 py-0.5 rounded transition-colors ${
            activePreset === 'top'
              ? 'bg-[#B6FFED] text-black font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={lang === 'en' ? 'Top plan footprint' : 'ऊपर का दृश्य (प्लान)'}
        >
          {lang === 'en' ? 'Plan' : 'प्लान'}
        </button>
      </div>

      {/* Control Buttons (Rotate, Zoom, Reset, Wireframe) */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/70">
        <button
          onClick={() => handleZoom('in')}
          title={lang === 'en' ? 'Zoom In' : 'ज़ूम इन'}
          className="p-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          title={lang === 'en' ? 'Zoom Out' : 'ज़ूम आउट'}
          className="p-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? (lang === 'en' ? 'Pause Rotation' : 'रोकें') : (lang === 'en' ? 'Auto Rotate' : 'स्वचालित घुमाव')}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            autoRotate ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={resetCamera}
          title={lang === 'en' ? 'Reset Orientation' : 'रीसेट'}
          className="p-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          title={lang === 'en' ? 'Toggle Conic Wireframe' : 'वायरफ्रेम टॉगल'}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            wireframe ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleGrid}
          title={showGrid ? (lang === 'en' ? 'Hide Blueprint Grid' : 'ग्रिड छुपाएं') : (lang === 'en' ? 'Show Blueprint Grid' : 'ग्रिड दिखाएं')}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            showGrid ? 'bg-[#B6FFED]/20 text-[#B6FFED]' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Backward-compatible helper that retrieves the cached architecture model
 */
export function constructModel(modelType: string, group: THREE.Group, wireframe: boolean) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
  const cached = getCachedArchitectureModel(modelType, wireframe);
  group.add(cached);
}
