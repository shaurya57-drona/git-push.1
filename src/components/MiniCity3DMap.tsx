import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ConicType, Language } from '../types';
import { Compass, RotateCw, Sparkles, ArrowUpRight } from 'lucide-react';
import { useBlueprintGrid } from '../context/BlueprintGridContext';

interface MiniCity3DMapProps {
  lang: Language;
  onSelectShape: (shape: ConicType) => void;
}

export const MiniCity3DMap: React.FC<MiniCity3DMapProps> = ({ lang, onSelectShape }) => {
  const { showGrid } = useBlueprintGrid();
  const containerRef = useRef<HTMLDivElement>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const [hoveredZone, setHoveredZone] = useState<ConicType | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth;
    const height = container.clientHeight || 360;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.035);

    // 2. Camera setup (isometric perspective)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(16, 15, 16);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = false; // keep fast & lag-free
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-10, 10, -10);
    scene.add(dirLight2);

    // 5. City Base / Grid Ground
    const gridHelper = new THREE.GridHelper(24, 24, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -0.01;
    gridHelper.visible = showGrid;
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    // Circular base pad with subtle radial glow
    const basePlateGeom = new THREE.CylinderGeometry(11.5, 11.5, 0.15, 48);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.8,
      metalness: 0.2,
    });
    const basePlate = new THREE.Mesh(basePlateGeom, basePlateMat);
    basePlate.position.y = -0.1;
    scene.add(basePlate);

    // Group for all rotating city elements
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Connective arterial transit rings
    const ringGeom = new THREE.RingGeometry(8.5, 8.65, 64);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.DoubleSide });
    cityGroup.add(new THREE.Mesh(ringGeom, ringMat));

    // Interactive clickable meshes mapped to conic shapes
    const interactiveMeshes: { mesh: THREE.Object3D; type: ConicType }[] = [];

    // ==========================================
    // ZONE 1: CIRCLE (North-West) - Blue (#38bdf8)
    // Pantheon-style cylindrical rotunda with dome
    // ==========================================
    const circleZone = new THREE.Group();
    circleZone.position.set(-4.5, 0, -4.5);

    const rotundaCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 1.8, 32),
      new THREE.MeshPhongMaterial({ color: 0x0284c7, emissive: 0x0369a1, emissiveIntensity: 0.35 })
    );
    rotundaCylinder.position.y = 0.9;
    circleZone.add(rotundaCylinder);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhongMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
    );
    dome.position.y = 1.8;
    circleZone.add(dome);

    // Glowing circle beacon
    const circleGlowRing = new THREE.Mesh(
      new THREE.RingGeometry(2.5, 2.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    circleGlowRing.rotateX(-Math.PI / 2);
    circleGlowRing.position.y = 0.05;
    circleZone.add(circleGlowRing);

    cityGroup.add(circleZone);
    interactiveMeshes.push({ mesh: circleZone, type: 'circle' });

    // ==========================================
    // ZONE 2: PARABOLA (North-East) - Orange (#fb923c)
    // Gateway-style sweeping parabolic catenary arch
    // ==========================================
    const parabolaZone = new THREE.Group();
    parabolaZone.position.set(4.5, 0, -4.5);

    const archCurvePoints: THREE.Vector3[] = [];
    for (let i = -16; i <= 16; i++) {
      const x = i * 0.14;
      const y = 3.6 - 0.7 * (x * x);
      if (y >= 0) {
        archCurvePoints.push(new THREE.Vector3(x, y, 0));
      }
    }
    const archCurve = new THREE.CatmullRomCurve3(archCurvePoints);
    const archGeom = new THREE.TubeGeometry(archCurve, 32, 0.22, 12, false);
    const archMat = new THREE.MeshPhongMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.4,
    });
    const archMesh = new THREE.Mesh(archGeom, archMat);
    parabolaZone.add(archMesh);

    // Reflector dish below arch
    const dishPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      dishPoints.push(new THREE.Vector2(t * 1.6, (t * t) * 0.6));
    }
    const dishGeom = new THREE.LatheGeometry(dishPoints, 16);
    const dishMesh = new THREE.Mesh(
      dishGeom,
      new THREE.MeshPhongMaterial({ color: 0xfb923c, emissive: 0xea580c, emissiveIntensity: 0.3 })
    );
    dishMesh.position.set(0, 0.2, 0);
    parabolaZone.add(dishMesh);

    const parabolaGlow = new THREE.Mesh(
      new THREE.RingGeometry(2.5, 2.7, 32),
      new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide })
    );
    parabolaGlow.rotateX(-Math.PI / 2);
    parabolaGlow.position.y = 0.05;
    parabolaZone.add(parabolaGlow);

    cityGroup.add(parabolaZone);
    interactiveMeshes.push({ mesh: parabolaZone, type: 'parabola' });

    // ==========================================
    // ZONE 3: ELLIPSE (South-West) - Green (#34d399)
    // Tiered Elliptical Colosseum / Arena
    // ==========================================
    const ellipseZone = new THREE.Group();
    ellipseZone.position.set(-4.5, 0, 4.5);

    const arenaGeom = new THREE.CylinderGeometry(2.6, 2.9, 1.3, 32);
    arenaGeom.scale(1.3, 1, 0.85); // stretch into ellipse
    const arenaMesh = new THREE.Mesh(
      arenaGeom,
      new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.35 })
    );
    arenaMesh.position.y = 0.65;
    ellipseZone.add(arenaMesh);

    // Inner elliptical tier
    const innerArena = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.9, 1.5, 24),
      new THREE.MeshPhongMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.4 })
    );
    innerArena.scale.set(1.3, 1, 0.85);
    innerArena.position.y = 0.8;
    ellipseZone.add(innerArena);

    const ellipseGlow = new THREE.Mesh(
      new THREE.RingGeometry(2.7, 2.9, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    ellipseGlow.scale.set(1.3, 1, 0.85);
    ellipseGlow.rotateX(-Math.PI / 2);
    ellipseGlow.position.y = 0.05;
    ellipseZone.add(ellipseGlow);

    cityGroup.add(ellipseZone);
    interactiveMeshes.push({ mesh: ellipseZone, type: 'ellipse' });

    // ==========================================
    // ZONE 4: HYPERBOLA (South-East) - Purple (#c084fc)
    // Hyperboloid of one sheet / cooling tower & spire
    // ==========================================
    const hyperbolaZone = new THREE.Group();
    hyperbolaZone.position.set(4.5, 0, 4.5);

    // Create hyperboloid tower via ruled lathe or parametric points
    const hypPoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const u = (i / 20) * 2 - 1; // -1 to 1
      const radius = 1.1 * Math.sqrt(1 + u * u * 1.5);
      hypPoints.push(new THREE.Vector2(radius, (u + 1) * 1.7));
    }
    const hypGeom = new THREE.LatheGeometry(hypPoints, 24);
    const hypMesh = new THREE.Mesh(
      hypGeom,
      new THREE.MeshPhongMaterial({
        color: 0x9333ea,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    hyperbolaZone.add(hypMesh);

    // Central communication needle
    const spireMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 4.5, 8),
      new THREE.MeshPhongMaterial({ color: 0xc084fc, emissive: 0xa855f7, emissiveIntensity: 0.5 })
    );
    spireMesh.position.y = 2.2;
    hyperbolaZone.add(spireMesh);

    const hypGlow = new THREE.Mesh(
      new THREE.RingGeometry(2.5, 2.7, 32),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide })
    );
    hypGlow.rotateX(-Math.PI / 2);
    hypGlow.position.y = 0.05;
    hyperbolaZone.add(hypGlow);

    cityGroup.add(hyperbolaZone);
    interactiveMeshes.push({ mesh: hyperbolaZone, type: 'hyperbola' });

    // 6. Raycasting for hover & click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedZone = (e: MouseEvent | TouchEvent): ConicType | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      for (const item of interactiveMeshes) {
        const intersects = raycaster.intersectObjects(item.mesh.children, true);
        if (intersects.length > 0) {
          return item.type;
        }
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const zone = getIntersectedZone(e);
      setHoveredZone(zone);
      if (zone) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const zone = getIntersectedZone(e);
      if (zone) {
        onSelectShape(zone);
      }
    };

    // Drag-to-rotate handling
    let isDragging = false;
    let prevX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handleDragMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;
      cityGroup.rotation.y += deltaX * 0.008;
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('mousemove', handleDragMove);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('click', handleClick);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 360;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle auto-rotation unless dragging
      if (isRotating && !isDragging) {
        cityGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('mousemove', handleDragMove);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('click', handleClick);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [isRotating, onSelectShape]);

  const zoneTitles: Record<ConicType, { titleEn: string; titleHi: string; color: string; descEn: string; descHi: string }> = {
    circle: {
      titleEn: 'Circle Zone (e = 0)',
      titleHi: 'वृत्त क्षेत्र (e = 0)',
      color: '#38bdf8',
      descEn: 'Radial symmetry & hoop stress domes (Pantheon, Colosseum)',
      descHi: 'त्रिज्यीय समरूपता व हूप तनाव गुंबद (रोमन पैंथियन)',
    },
    parabola: {
      titleEn: 'Parabola Zone (e = 1)',
      titleHi: 'परवलय क्षेत्र (e = 1)',
      color: '#fb923c',
      descEn: 'Pure axial compression arches & focal reflectors (Gateway Arch)',
      descHi: 'शुद्ध संपीड़न मेहराब व सौर परावर्तक (गेटवे आर्च)',
    },
    ellipse: {
      titleEn: 'Ellipse Zone (0 < e < 1)',
      titleHi: 'दीर्घवृत्त क्षेत्र (0 < e < 1)',
      color: '#34d399',
      descEn: 'Dual-focal whispering galleries & aerodynamic arenas (St. Paul’s)',
      descHi: 'दोहरी नाभि व्हिस्परिंग गैलरी व पवन विक्षेपण एरेना',
    },
    hyperbola: {
      titleEn: 'Hyperbola Zone (e > 1)',
      titleHi: 'अतिपरवलय क्षेत्र (e > 1)',
      color: '#c084fc',
      descEn: 'Doubly ruled structural towers & natural draft chimneys (Canton Tower)',
      descHi: 'सीधी बीम से निर्मित दोहरी-घुमावदार मीनारें व कूलिंग टॉवर',
    },
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/70 shadow-2xl">
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        id="conic-city-3d-map"
        className="w-full h-[320px] sm:h-[400px] md:h-[460px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Controls & Status Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md pointer-events-auto shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-200 tracking-wide font-display">
            {lang === 'en' ? 'CONIC CITY 3D ISOMETRIC PREVIEW' : 'कॉनिक सिटी 3D आइसोमेट्रिक दृश्य'}
          </span>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors pointer-events-auto backdrop-blur-md shadow-lg"
          title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
        </button>
      </div>

      {/* Interactive Hover District Banner / Click CTA */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
            style={{
              backgroundColor: hoveredZone ? zoneTitles[hoveredZone].color : '#94a3b8',
            }}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>
                {hoveredZone
                  ? lang === 'en'
                    ? zoneTitles[hoveredZone].titleEn
                    : zoneTitles[hoveredZone].titleHi
                  : lang === 'en'
                  ? 'Conic City Master Map (Hover or Click any district)'
                  : 'कॉनिक सिटी मास्टर मैप (किसी भी क्षेत्र पर क्लिक करें)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {hoveredZone
                ? lang === 'en'
                  ? zoneTitles[hoveredZone].descEn
                  : zoneTitles[hoveredZone].descHi
                : lang === 'en'
                ? 'Drag to rotate isometric perspective • Click a zone to enter its dedicated 3D page'
                : 'दृश्य को घुमाने के लिए ड्रैग करें • उस क्षेत्र में प्रवेश करने के लिए क्लिक करें'}
            </div>
          </div>
        </div>

        {hoveredZone && (
          <button
            onClick={() => onSelectShape(hoveredZone)}
            className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-md transition-all hover:scale-105"
            style={{
              backgroundColor: zoneTitles[hoveredZone].color,
            }}
          >
            <span>{lang === 'en' ? 'Explore Zone' : 'क्षेत्र देखें'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
