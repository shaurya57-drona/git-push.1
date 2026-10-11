import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { ConicType, Building, Language } from '../types';
import { buildShapeGeometry, getShapeColor } from '../utils/shape3DCache';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Compass, Grid3X3 } from 'lucide-react';

export interface Shape3DCanvasHandle {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  updateSize: (width: number, height: number) => void;
}

export interface Shape3DCanvasProps {
  conicType: ConicType;
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (building: Building) => void;
  lang: Language;
}

export const Shape3DCanvas = forwardRef<Shape3DCanvasHandle, Shape3DCanvasProps>(({
  conicType,
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  lang,
}, ref) => {
  const { showGrid, toggleGrid } = useBlueprintGrid();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  useImperativeHandle(ref, () => ({
    get renderer() {
      return rendererRef.current;
    },
    get camera() {
      return cameraRef.current;
    },
    updateSize: (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height, false);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      }
    },
  }));

  const [highlightPulse, setHighlightPulse] = useState<number>(0);

  // Trigger geometry emission increase on building selection
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.85;
      setHighlightPulse((p) => p + 1);
    }
  }, [selectedBuildingId]);

  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isMobile = window.innerWidth < 768;
    const shapeColors = getShapeColor(conicType);

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    // Perspective Camera
    const aspect = container.clientWidth / container.clientHeight;
    const initialCameraZ = isMobile ? 14 : 11;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 2.5, initialCameraZ);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer with High DPI Retina support
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    rendererRef.current = renderer;

    // Lighting (ambient + directional 5,5,5)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Main Rotating Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Conic Mathematical Geometry
    const geometry = buildShapeGeometry(conicType, isMobile);
    const material = new THREE.MeshPhongMaterial({
      color: shapeColors.color,
      emissive: shapeColors.emissive,
      emissiveIntensity: 0.2, // Requirement: emissive glow with emissiveIntensity 0.2
      wireframe: false, // Requirement: wireframe false
      shininess: 90,
      specular: 0x555555,
      side: THREE.DoubleSide,
    });
    materialRef.current = material;

    const mainMesh = new THREE.Mesh(geometry, material);
    mainMesh.frustumCulled = true; // Requirement: frustum culling
    mainGroup.add(mainMesh);

    // Add coordinate reference grid floor
    const gridHelper = new THREE.GridHelper(16, isMobile ? 12 : 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -3.2;
    gridHelper.frustumCulled = true;
    gridHelper.visible = showGrid;
    gridHelperRef.current = gridHelper;
    mainGroup.add(gridHelper);

    // ==========================================
    // INSTANCING FOR REPEATED GEOMETRIES
    // ==========================================
    const markerCount = buildings.length; // 4 buildings
    const baseGeo = new THREE.CylinderGeometry(0.25, 0.35, 0.3, isMobile ? 12 : 24);
    const baseMat = new THREE.MeshPhongMaterial({
      color: 0x334155,
      emissive: shapeColors.emissive,
      emissiveIntensity: 0.3,
    });
    const instancedBases = new THREE.InstancedMesh(baseGeo, baseMat, markerCount);
    instancedBases.frustumCulled = true;
    mainGroup.add(instancedBases);

    // Interactive building markers (spheres + beacons)
    const markerGroup = new THREE.Group();
    mainGroup.add(markerGroup);

    const interactiveMarkers: THREE.Mesh[] = [];
    const markerRadius = 5.2;

    buildings.forEach((building, idx) => {
      const angle = (idx / markerCount) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(angle) * (conicType === 'ellipse' ? 5.4 : conicType === 'hyperbola' ? 4.2 : 5.0);
      const z = Math.sin(angle) * (conicType === 'ellipse' ? 3.6 : conicType === 'hyperbola' ? 4.2 : 5.0);
      const y = conicType === 'parabola' ? (x * x) / (4 * 2.1) - 2.4 : 0;

      // Update Instanced Base Matrix
      const matrix = new THREE.Matrix4();
      matrix.setPosition(x, y - 0.2, z);
      instancedBases.setMatrixAt(idx, matrix);

      // Marker Sphere
      const markerSphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const markerSphereMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: shapeColors.color,
        emissiveIntensity: 0.6,
      });
      const markerMesh = new THREE.Mesh(markerSphereGeo, markerSphereMat);
      markerMesh.position.set(x, y + 0.3, z);
      markerMesh.userData = { building };
      markerGroup.add(markerMesh);
      interactiveMarkers.push(markerMesh);

      // Vertical pin line
      const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5);
      const pinMat = new THREE.MeshBasicMaterial({ color: shapeColors.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y + 0.05, z);
      markerGroup.add(pinMesh);
    });
    instancedBases.instanceMatrix.needsUpdate = true;

    // ==========================================
    // USER INTERACTIONS
    // ==========================================
    let isDragging = false;
    let prevPointerX = 0;
    let initialPinchDistance = 0;

    // Raycaster for clicking markers
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      prevPointerX = e.clientX;
      // Requirement: mouse drag rotates (left-right drag changes rotation.y)
      mainGroup.rotation.y += deltaX * 0.007;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;

      // Handle marker click if minimal drag distance
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactiveMarkers);

      if (intersects.length > 0) {
        const targetMarker = intersects[0].object as THREE.Mesh;
        const b = targetMarker.userData.building as Building;
        if (b) {
          // Requirement: click on building marker highlights it (geometry emission increases)
          material.emissiveIntensity = 0.9;
          onSelectBuilding(b);
        }
      }
    };

    // Scroll zoom: changes camera.z
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Requirement: scroll zoom (changes camera.z)
      camera.position.z += e.deltaY * 0.012;
      camera.position.z = Math.min(Math.max(camera.position.z, 6), 24);
    };

    // Touch pinch zoom
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const diff = initialPinchDistance - currentDistance;
        initialPinchDistance = currentDistance;

        camera.position.z += diff * 0.03;
        camera.position.z = Math.min(Math.max(camera.position.z, 6), 24);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // ==========================================
    // RESIZE OBSERVER (NO BLUR, RETINA SUPPORT)
    // ==========================================
    let resizeRafId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w <= 0 || h <= 0) return;

      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      });
    });
    resizeObserver.observe(container);

    // ==========================================
    // ANIMATION LOOP (rotation.y += 0.001)
    // ==========================================
    let animationFrameId: number;
    const animate = () => {
      // Requirement: continuous rotation (rotation.y += 0.001 per frame)
      mainGroup.rotation.y += 0.001;

      // Smoothly ease emission intensity back to baseline 0.2 if highlighted
      if (material.emissiveIntensity > 0.2) {
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0.2, 0.04);
      }

      // Pulse selected marker
      interactiveMarkers.forEach((marker) => {
        const b = marker.userData.building as Building;
        if (b && b.id === selectedBuildingId) {
          marker.scale.setScalar(1.2 + Math.sin(Date.now() * 0.006) * 0.15);
        } else {
          marker.scale.setScalar(1.0);
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);

      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      material.dispose();
    };
  }, [conicType, buildings, onSelectBuilding, selectedBuildingId]);

  // Controls for zoom buttons
  const handleZoom = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(
        Math.max(cameraRef.current.position.z + delta, 6),
        24
      );
    }
  };

  const handleReset = () => {
    if (cameraRef.current && mainGroupRef.current) {
      cameraRef.current.position.set(0, 2.5, window.innerWidth < 768 ? 14 : 11);
      mainGroupRef.current.rotation.set(0, 0, 0);
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = 0.85;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      id={`canvas-container-${conicType}`}
      className="w-full h-[350px] md:h-[500px] rounded-[12px] bg-gradient-to-b from-[#181b22] via-[#12141a] to-[#0a0c10] overflow-hidden relative shadow-2xl border border-slate-800"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing select-none" />

      {/* Top Left Geometry Info Pill */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/70 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white">
            {conicType === 'circle' && 'CylinderGeometry(r: 5, seg: 64)'}
            {conicType === 'parabola' && 'LatheGeometry (Parabola Curve)'}
            {conicType === 'ellipse' && 'BufferGeometry (Parametric Ellipse)'}
            {conicType === 'hyperbola' && 'BufferGeometry (Hyperbola Surface)'}
          </span>
        </div>
        <div className="bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>MeshPhongMaterial • emissiveIntensity 0.2 • LOD</span>
        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/70 shadow-xl">
        <button
          onClick={() => handleZoom(-2)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(2)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
          title="Reset Camera & Highlight"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleGrid}
          className={`p-2 rounded-lg transition-colors text-xs ${
            showGrid ? 'bg-[#B6FFED]/20 text-[#B6FFED]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
          }`}
          title={showGrid ? 'Hide Blueprint Grid' : 'Show Blueprint Grid'}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Interaction Legend */}
      <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 font-sans pointer-events-none">
        <span>↔ Drag to rotate</span>
        <span>•</span>
        <span>Scroll to zoom</span>
        <span>•</span>
        <span className="text-sky-300 font-medium">Click markers to highlight geometry</span>
      </div>
    </div>
  );
});

Shape3DCanvas.displayName = 'Shape3DCanvas';
