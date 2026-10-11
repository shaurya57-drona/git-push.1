import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ConicType, Language } from '../types';
import { CONIC_INFO, UI_TEXT } from '../data/translations';
import { RotateCw, RefreshCw, Eye, Sparkles, Layers, Sliders } from 'lucide-react';

interface ConicScene3DProps {
  lang: Language;
  onSelectConic?: (type: ConicType) => void;
}

export const ConicScene3D: React.FC<ConicScene3DProps> = ({ lang, onSelectConic }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cuttingAngleDeg, setCuttingAngleDeg] = useState<number>(25); // beta
  const [planeDistance, setPlaneDistance] = useState<number>(0.8); // d offset
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showConeNormals, setShowConeNormals] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planeMeshRef = useRef<THREE.Mesh | null>(null);
  const curveLineRef = useRef<THREE.Line | null>(null);
  const curveLine2Ref = useRef<THREE.Line | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const coneSemiAngleDeg = 45; // alpha = 45 deg

  // Determine conic section type
  let currentConic: ConicType = 'ellipse';
  let eccentricity = 0;

  if (cuttingAngleDeg === 0) {
    currentConic = 'circle';
    eccentricity = 0;
  } else if (cuttingAngleDeg < coneSemiAngleDeg) {
    currentConic = 'ellipse';
    // e = sin(beta) / sin(alpha), alpha = 45 => sin(45) = sqrt(2)/2
    const sinBeta = Math.sin((cuttingAngleDeg * Math.PI) / 180);
    const sinAlpha = Math.sin((coneSemiAngleDeg * Math.PI) / 180);
    eccentricity = Math.min(0.999, sinBeta / sinAlpha);
  } else if (Math.abs(cuttingAngleDeg - coneSemiAngleDeg) < 1.0) {
    currentConic = 'parabola';
    eccentricity = 1.0;
  } else {
    currentConic = 'hyperbola';
    const sinBeta = Math.sin((cuttingAngleDeg * Math.PI) / 180);
    const sinAlpha = Math.sin((coneSemiAngleDeg * Math.PI) / 180);
    eccentricity = sinBeta / sinAlpha;
  }

  const conicInfo = CONIC_INFO[currentConic];

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // Main Group to allow rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    groupRef.current = mainGroup;

    // Double Cone
    const coneHeight = 3.2;
    const coneRadius = coneHeight * Math.tan((coneSemiAngleDeg * Math.PI) / 180); // tan(45) = 1 => 3.2

    // Upper Cone
    const upperGeom = new THREE.ConeGeometry(coneRadius, coneHeight, 48, 16, true);
    upperGeom.translate(0, coneHeight / 2, 0);
    const coneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.45,
      roughness: 0.3,
      metalness: 0.1,
      transmission: 0.3,
      side: THREE.DoubleSide,
      wireframe: showWireframe,
    });
    const upperCone = new THREE.Mesh(upperGeom, coneMaterial);
    mainGroup.add(upperCone);

    // Lower Cone (inverted)
    const lowerGeom = new THREE.ConeGeometry(coneRadius, coneHeight, 48, 16, true);
    lowerGeom.rotateX(Math.PI);
    lowerGeom.translate(0, -coneHeight / 2, 0);
    const lowerCone = new THREE.Mesh(lowerGeom, coneMaterial);
    mainGroup.add(lowerCone);

    // Central Axis Line
    const axisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -coneHeight * 1.2, 0),
      new THREE.Vector3(0, coneHeight * 1.2, 0),
    ]);
    const axisMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 0.15,
      gapSize: 0.08,
      linewidth: 1,
    });
    const axisLine = new THREE.Line(axisGeom, axisMat);
    axisLine.computeLineDistances();
    mainGroup.add(axisLine);

    // Apex Dot
    const apexGeom = new THREE.SphereGeometry(0.06, 16, 16);
    const apexMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const apex = new THREE.Mesh(apexGeom, apexMat);
    mainGroup.add(apex);

    // Cutting Plane
    const planeGeom = new THREE.PlaneGeometry(3.6, 4.4);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.3,
    });
    const planeMesh = new THREE.Mesh(planeGeom, planeMat);
    mainGroup.add(planeMesh);
    planeMeshRef.current = planeMesh;

    // Glowing Intersection Curves
    const curveMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
    });
    const curveGeom = new THREE.BufferGeometry();
    const curveLine = new THREE.Line(curveGeom, curveMat);
    mainGroup.add(curveLine);
    curveLineRef.current = curveLine;

    const curveMat2 = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 3,
    });
    const curveGeom2 = new THREE.BufferGeometry();
    const curveLine2 = new THREE.Line(curveGeom2, curveMat2);
    mainGroup.add(curveLine2);
    curveLine2Ref.current = curveLine2;

    // Mouse Interaction for Orbiting
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      groupRef.current.rotation.y += deltaX * 0.008;
      groupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for Android 14+ / Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !groupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      groupRef.current.rotation.y += deltaX * 0.01;
      groupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (autoRotate && groupRef.current && !isDraggingRef.current) {
        groupRef.current.rotation.y += 0.004;
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Update plane orientation and calculate conic intersection curve
  useEffect(() => {
    if (!planeMeshRef.current || !curveLineRef.current || !curveLine2Ref.current) return;

    const betaRad = (cuttingAngleDeg * Math.PI) / 180;
    const alphaRad = (coneSemiAngleDeg * Math.PI) / 180;
    const k = Math.tan(alphaRad); // k = 1 for 45 deg

    // Position and rotate plane
    // Normal vector of plane: n = (0, cos(beta), sin(beta))
    // Plane equation: y * cos(beta) + z * sin(beta) = planeDistance
    const plane = planeMeshRef.current;
    plane.rotation.set(0, 0, 0);
    plane.position.set(0, 0, 0);

    // Rotate plane around X axis by (PI/2 - beta)
    plane.rotation.x = Math.PI / 2 - betaRad;
    plane.position.set(0, planeDistance * Math.cos(betaRad), planeDistance * Math.sin(betaRad));

    // Update Plane color based on conic section
    const mat = plane.material as THREE.MeshStandardMaterial;
    if (currentConic === 'circle') {
      mat.color.setHex(0x0284c7); // sky
    } else if (currentConic === 'ellipse') {
      mat.color.setHex(0x9333ea); // purple
    } else if (currentConic === 'parabola') {
      mat.color.setHex(0x059669); // emerald
    } else {
      mat.color.setHex(0xd97706); // amber
    }

    // Mathematically calculate intersection of cone (x² + z² = k² y²) and plane
    // Plane: y = (planeDistance - z * sin(beta)) / cos(beta)  [for beta != 90]
    const cosB = Math.cos(betaRad);
    const sinB = Math.sin(betaRad);

    const pointsUpper: THREE.Vector3[] = [];
    const pointsLower: THREE.Vector3[] = [];
    const numSamples = 140;

    if (Math.abs(cosB) > 0.001) {
      if (currentConic === 'circle') {
        // Horizontal slice at y = planeDistance
        const yVal = planeDistance;
        const radius = Math.abs(yVal * k);
        for (let i = 0; i <= numSamples; i++) {
          const theta = (i / numSamples) * Math.PI * 2;
          const x = radius * Math.cos(theta);
          const z = radius * Math.sin(theta);
          pointsUpper.push(new THREE.Vector3(x, yVal, z));
        }
      } else if (currentConic === 'ellipse') {
        // Closed ellipse on upper cone (or lower if d < 0)
        // Parameterize in plane coordinates (u, v)
        // Center of ellipse along tilted axis:
        const z0 = (-planeDistance * sinB) / (cosB * cosB - sinB * sinB);
        const y0 = (planeDistance - z0 * sinB) / cosB;
        const semiA = Math.abs(planeDistance * sinB) / Math.abs(cosB * cosB - sinB * sinB);
        const semiB = (planeDistance * Math.sqrt(Math.abs(cosB * cosB - sinB * sinB))) / (cosB * cosB - sinB * sinB);

        // Sample along parameter t:
        for (let i = 0; i <= numSamples; i++) {
          const t = (i / numSamples) * Math.PI * 2;
          const u = Math.cos(t);
          const v = Math.sin(t);
          // Find root of cone equation: x² + z² = y² where (x,y,z) is on plane
          // Let's use direct sampling of angle in plane:
          // x = r * cos(theta), solve quadratic for r
          const theta = (i / numSamples) * Math.PI * 2;
          const ct = Math.cos(theta);
          const st = Math.sin(theta);
          // z = r * st * cos(beta), y = planeDistance * cos(beta) - r * st * sin(beta)...
          // Alternatively, using the known conic parametric form on the plane:
          // Point on plane = P0 + u * X_axis + v * Y_axis_in_plane
          // Let's compute directly:
          const xVal = (Math.abs(semiB) || 0.6) * Math.sin(theta);
          const zLocal = (Math.abs(semiA) || 0.8) * Math.cos(theta);
          const point3D = new THREE.Vector3(
            xVal,
            y0 + zLocal * sinB,
            z0 + zLocal * cosB
          );
          pointsUpper.push(point3D);
        }
      } else if (currentConic === 'parabola') {
        // Parabola: cos(beta) = sin(beta) = sqrt(2)/2
        // Open curve extending down
        for (let i = -numSamples / 2; i <= numSamples / 2; i++) {
          const xVal = (i / (numSamples / 2)) * 1.6;
          // For parabola y = c1 * x² + c2
          const yVal = 0.5 * xVal * xVal + planeDistance * 0.7;
          if (yVal >= -2.8 && yVal <= 2.8) {
            const zVal = (planeDistance - yVal * cosB) / sinB;
            pointsUpper.push(new THREE.Vector3(xVal, yVal, zVal));
          }
        }
      } else {
        // Hyperbola: two open branches (cuts both upper and lower cones)
        // Upper branch:
        for (let i = -numSamples / 2; i <= numSamples / 2; i++) {
          const t = (i / (numSamples / 2)) * 1.8;
          const yVal = 0.8 * Math.cosh(t) + planeDistance * 0.4;
          const xVal = 0.7 * Math.sinh(t);
          if (yVal <= 2.9) {
            const zVal = (planeDistance - yVal * cosB) / sinB;
            pointsUpper.push(new THREE.Vector3(xVal, yVal, zVal));
          }
        }
        // Lower branch:
        for (let i = -numSamples / 2; i <= numSamples / 2; i++) {
          const t = (i / (numSamples / 2)) * 1.8;
          const yVal = -0.8 * Math.cosh(t) + planeDistance * 0.4;
          const xVal = 0.7 * Math.sinh(t);
          if (yVal >= -2.9) {
            const zVal = (planeDistance - yVal * cosB) / sinB;
            pointsLower.push(new THREE.Vector3(xVal, yVal, zVal));
          }
        }
      }
    }

    if (pointsUpper.length > 0) {
      curveLineRef.current.geometry.dispose();
      curveLineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(pointsUpper);
      const lineMat = curveLineRef.current.material as THREE.LineBasicMaterial;
      lineMat.color.setHex(currentConic === 'circle' ? 0x38bdf8 : currentConic === 'ellipse' ? 0xc084fc : currentConic === 'parabola' ? 0x34d399 : 0xfbbf24);
      curveLineRef.current.visible = true;
    } else {
      curveLineRef.current.visible = false;
    }

    if (pointsLower.length > 0 && currentConic === 'hyperbola') {
      curveLine2Ref.current.geometry.dispose();
      curveLine2Ref.current.geometry = new THREE.BufferGeometry().setFromPoints(pointsLower);
      const lineMat2 = curveLine2Ref.current.material as THREE.LineBasicMaterial;
      lineMat2.color.setHex(0xfbbf24);
      curveLine2Ref.current.visible = true;
    } else {
      curveLine2Ref.current.visible = false;
    }
  }, [cuttingAngleDeg, planeDistance, currentConic]);

  const resetView = () => {
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
  };

  const presetAngles = [
    { label: lang === 'en' ? 'Circle (β=0°)' : 'वृत्त (β=0°)', angle: 0, conic: 'circle' as ConicType },
    { label: lang === 'en' ? 'Ellipse (β=25°)' : 'दीर्घवृत्त (β=25°)', angle: 25, conic: 'ellipse' as ConicType },
    { label: lang === 'en' ? 'Parabola (β=45°)' : 'परवलय (β=45°)', angle: 45, conic: 'parabola' as ConicType },
    { label: lang === 'en' ? 'Hyperbola (β=65°)' : 'अतिपरवलय (β=65°)', angle: 65, conic: 'hyperbola' as ConicType },
  ];

  return (
    <div id="conic-3d-lab" className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-neutral-800 text-[#B6FFED]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {UI_TEXT[lang].coneCuttingLab}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            {UI_TEXT[lang].coneLabSubtitle}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          {presetAngles.map((preset) => (
            <button
              key={preset.conic}
              id={`preset-${preset.conic}`}
              onClick={() => {
                setCuttingAngleDeg(preset.angle);
                if (onSelectConic) onSelectConic(preset.conic);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border cursor-pointer ${
                currentConic === preset.conic
                  ? 'bg-neutral-800 text-white border-neutral-700 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Area & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Viewport */}
        <div className="lg:col-span-8 relative rounded-lg overflow-hidden bg-[#07090c] border border-neutral-800 shadow-inner">
          <div
            ref={containerRef}
            className="w-full h-[380px] sm:h-[440px] md:h-[480px] cursor-grab active:cursor-grabbing touch-none select-none"
          />

          {/* Interactive HUD overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <div className="px-2.5 py-1 rounded-md bg-[#111316]/90 backdrop-blur-md border border-neutral-800 text-xs font-mono text-neutral-300">
              <span className="text-neutral-500 font-sans mr-1">{lang === 'en' ? 'Section:' : 'परिच्छेद:'}</span>
              <span className={`font-bold ${conicInfo.color}`}>{conicInfo.symbol} {lang === 'en' ? conicInfo.nameEn : conicInfo.nameHi}</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#111316]/90 backdrop-blur-md border border-neutral-800 text-xs font-mono text-neutral-300">
              <span className="text-neutral-500 font-sans mr-1">{lang === 'en' ? 'Eccentricity:' : 'उत्केंद्रता:'}</span>
              <span className="text-amber-300 font-medium">e = {eccentricity.toFixed(3)}</span>
            </div>
          </div>

          {/* Viewport Controls Bar */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#111316]/90 backdrop-blur-md p-1.5 rounded-lg border border-neutral-800">
            <button
              id="toggle-autorotate"
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                autoRotate ? 'bg-[#B6FFED]/15 text-[#B6FFED]' : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="reset-camera"
              onClick={resetView}
              title="Reset View Orientation"
              className="p-1.5 rounded-md text-xs bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              id="toggle-wireframe"
              onClick={() => setShowWireframe(!showWireframe)}
              title="Toggle Wireframe"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                showWireframe ? 'bg-purple-500/20 text-purple-300' : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Subtle instruction indicator */}
          <div className="absolute bottom-3 left-3 text-[11px] text-slate-500 font-mono pointer-events-none hidden sm:block">
            {lang === 'en' ? 'Drag to rotate 360°' : '360° घुमाने के लिए ड्रैग करें'}
          </div>
        </div>

        {/* Sliders & Mathematical Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Controls Box */}
          <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-neutral-200 font-medium text-sm">
              <Sliders className="w-4 h-4 text-[#B6FFED]" />
              <span>{lang === 'en' ? 'Slicing Controls' : 'कर्तन नियंत्रण'}</span>
            </div>

            {/* Slider 1: Cutting Plane Angle (beta) */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">{UI_TEXT[lang].cuttingAngle}</span>
                <span className="font-mono text-[#B6FFED] font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  β = {cuttingAngleDeg}°
                </span>
              </div>
              <input
                id="slider-cutting-angle"
                type="range"
                min="0"
                max="85"
                step="1"
                value={cuttingAngleDeg}
                onChange={(e) => setCuttingAngleDeg(Number(e.target.value))}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#B6FFED]"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>0° (Circle)</span>
                <span>45° (Parabola)</span>
                <span>85° (Hyperbola)</span>
              </div>
            </div>

            {/* Slider 2: Plane Distance (d) */}
            <div className="mb-2">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-300 font-medium">{UI_TEXT[lang].planeHeight}</span>
                <span className="font-mono text-neutral-300 font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  d = {planeDistance.toFixed(2)}
                </span>
              </div>
              <input
                id="slider-plane-distance"
                type="range"
                min="0.2"
                max="2.0"
                step="0.05"
                value={planeDistance}
                onChange={(e) => setPlaneDistance(Number(e.target.value))}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#B6FFED]"
              />
            </div>
          </div>

          {/* Mathematical Status Card */}
          <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                {UI_TEXT[lang].conicSection}
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium border ${conicInfo.badgeBg}`}>
                {conicInfo.symbol} {lang === 'en' ? conicInfo.nameEn : conicInfo.nameHi}
              </span>
            </div>

            {/* Canonical Formula */}
            <div className="bg-[#111316] p-2.5 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-300">
              <div className="text-[10px] uppercase text-neutral-500 mb-0.5">{lang === 'en' ? 'Equation in Plane' : 'समतल में समीकरण'}</div>
              <div className={`font-bold text-sm ${conicInfo.color}`}>{conicInfo.generalEquation}</div>
            </div>

            {/* Eccentricity Formula */}
            <div className="text-xs text-slate-300 space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'en' ? 'Eccentricity Formula:' : 'उत्केंद्रता सूत्र:'}</span>
                <span className="font-mono text-amber-300 font-medium">e = sin(β) / sin(α)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{lang === 'en' ? 'Cone Semi-Angle (α):' : 'शंकु अर्ध-कोण (α):'}</span>
                <span className="font-mono text-slate-200">45° (sin 45° ≈ 0.707)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 mt-1 font-semibold">
                <span className="text-slate-300">{lang === 'en' ? 'Calculated e:' : 'परिकलित e:'}</span>
                <span className="font-mono text-amber-400 text-sm">{eccentricity.toFixed(3)}</span>
              </div>
            </div>

            {/* Plane angle rule */}
            <div className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
              <span className="text-slate-300 font-medium block mb-1">
                {lang === 'en' ? 'Geometric Rule:' : 'ज्यामितीय नियम:'}
              </span>
              {lang === 'en' ? conicInfo.planeAngleDescEn : conicInfo.planeAngleDescHi}
            </div>

            {/* Quick Link to filter buildings */}
            {onSelectConic && (
              <button
                id={`explore-${currentConic}-buildings`}
                onClick={() => onSelectConic(currentConic)}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en'
                    ? `Explore 4 Real ${conicInfo.nameEn} Masterpieces`
                    : `4 वास्तविक ${conicInfo.nameHi} स्मारकों को देखें`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
