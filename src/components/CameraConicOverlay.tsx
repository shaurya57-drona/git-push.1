import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ConicType, Language } from '../types';
import { UI_TEXT } from '../data/translations';
import {
  Camera,
  X,
  RefreshCw,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  Upload,
  Image as ImageIcon,
  Zap,
  Info,
} from 'lucide-react';

interface CameraConicOverlayProps {
  lang: Language;
  onClose: () => void;
  initialConic?: ConicType;
  initialBuildingName?: string;
}

interface ArchitecturalPreset {
  id: string;
  nameEn: string;
  nameHi: string;
  conicType: ConicType;
  eccentricity: number;
  scale: number;
  rotation: number;
  aspectRatio: number;
  invert: boolean;
  mesh3D: boolean;
  descriptionEn: string;
  descriptionHi: string;
}

const PRESETS: ArchitecturalPreset[] = [
  {
    id: 'gateway-arch',
    nameEn: 'Gateway Arch',
    nameHi: 'गेटवे आर्च',
    conicType: 'parabola',
    eccentricity: 1.0,
    scale: 1.2,
    rotation: 0,
    aspectRatio: 1.15,
    invert: true,
    mesh3D: false,
    descriptionEn: 'Inverted parabolic catenary arch (192m span)',
    descriptionHi: 'उल्टा परवलयाकार मेहराब (192 मी विस्तार)',
  },
  {
    id: 'pantheon-dome',
    nameEn: 'Pantheon Dome',
    nameHi: 'पैंथियन गुंबद',
    conicType: 'circle',
    eccentricity: 0.0,
    scale: 1.0,
    rotation: 0,
    aspectRatio: 1.0,
    invert: false,
    mesh3D: true,
    descriptionEn: 'Hemispherical rotunda & oculus (43.3m diameter)',
    descriptionHi: 'गोलाकार गुंबद व नेत्र छिद्र (43.3 मी व्यास)',
  },
  {
    id: 'colosseum',
    nameEn: 'Colosseum Arena',
    nameHi: 'कोलोसियम अखाड़ा',
    conicType: 'ellipse',
    eccentricity: 0.60,
    scale: 1.1,
    rotation: 15,
    aspectRatio: 1.25,
    invert: false,
    mesh3D: false,
    descriptionEn: 'Elliptical amphitheatre (188m × 156m)',
    descriptionHi: 'दीर्घवृत्ताकार अखाड़ा (188 मी × 156 मी)',
  },
  {
    id: 'canton-tower',
    nameEn: 'Canton Tower',
    nameHi: 'कैंटन टॉवर',
    conicType: 'hyperbola',
    eccentricity: 1.45,
    scale: 1.15,
    rotation: 0,
    aspectRatio: 0.85,
    invert: false,
    mesh3D: true,
    descriptionEn: 'Doubly-ruled hyperboloid of revolution',
    descriptionHi: 'अतिपरवलयाकार द्विशंकु सतह टॉवर',
  },
  {
    id: 'whispering-gallery',
    nameEn: 'Whispering Gallery',
    nameHi: 'व्हिस्परिंग गैलरी',
    conicType: 'ellipse',
    eccentricity: 0.75,
    scale: 1.0,
    rotation: 0,
    aspectRatio: 1.5,
    invert: false,
    mesh3D: true,
    descriptionEn: 'Focal reflection acoustic dome',
    descriptionHi: 'दो नाभियों वाला ध्वनिक परावर्तन गुंबद',
  },
];

const WIREFRAME_COLORS = [
  { name: 'Neon Cyan', hex: '#B6FFED' },
  { name: 'Electric Sky', hex: '#38BDF8' },
  { name: 'Golden Amber', hex: '#F59E0B' },
  { name: 'Laser Lime', hex: '#22C55E' },
  { name: 'Neon Magenta', hex: '#F43F5E' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

export const CameraConicOverlay: React.FC<CameraConicOverlayProps> = ({
  lang,
  onClose,
  initialConic = 'parabola',
  initialBuildingName,
}) => {
  // Video and Canvas refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Camera & Stream State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [useSampleBackground, setUseSampleBackground] = useState<boolean>(false);
  const [sampleSceneIndex, setSampleSceneIndex] = useState<number>(0);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  // Conic Wireframe Mathematical Parameters
  const [conicType, setConicType] = useState<ConicType>(initialConic);
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0); // degrees
  const [aspectRatio, setAspectRatio] = useState<number>(1.2); // semi-major / semi-minor
  const [invert, setInvert] = useState<boolean>(initialConic === 'parabola');
  const [wireframeColor, setWireframeColor] = useState<string>('#B6FFED');
  const [lineWidth, setLineWidth] = useState<number>(2.5);
  const [opacity, setOpacity] = useState<number>(0.9);
  const [showFoci, setShowFoci] = useState<boolean>(true);
  const [showDirectrix, setShowDirectrix] = useState<boolean>(true);
  const [showMesh3D, setShowMesh3D] = useState<boolean>(false);
  const [showTelemetry, setShowTelemetry] = useState<boolean>(true);
  const [showControlPanel, setShowControlPanel] = useState<boolean>(true);

  // Dragging interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const centerStartRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Captured snapshot state
  const [capturedSnapshotUrl, setCapturedSnapshotUrl] = useState<string | null>(null);

  // Sample architectural vector backgrounds
  const SAMPLE_SCENES = [
    {
      name: lang === 'en' ? 'St. Louis Gateway Arch (Parabola)' : 'सेंट लुइस गेटवे आर्च (परवलय)',
      bgGradient: 'from-[#0d1b2a] via-[#1b263b] to-[#415a77]',
      archType: 'parabola',
    },
    {
      name: lang === 'en' ? 'Pantheon Rotunda Dome (Circle)' : 'पैंथियन गुंबद (वृत्त)',
      bgGradient: 'from-[#1a1c23] via-[#2d3748] to-[#1a202c]',
      archType: 'circle',
    },
    {
      name: lang === 'en' ? 'Rome Colosseum Oval (Ellipse)' : 'रोम कोलोसियम (दीर्घवृत्त)',
      bgGradient: 'from-[#1f1610] via-[#33241b] to-[#4a3425]',
      archType: 'ellipse',
    },
    {
      name: lang === 'en' ? 'Canton Cooling Tower (Hyperbola)' : 'कैंटन टॉवर (अतिपरवलय)',
      bgGradient: 'from-[#0b132b] via-[#1c2541] to-[#3a506b]',
      archType: 'hyperbola',
    },
  ];

  // Initialize camera stream
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this device/browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
      setUseSampleBackground(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => {
          console.warn('Video autoPlay prevented:', err);
        });
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setIsCameraActive(false);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        String(err).includes('Permission');
      setCameraError(
        isDenied
          ? lang === 'en'
            ? 'Camera permission denied. Switch to Architectural Sample Mode or upload a photo.'
            : 'कैमरा अनुमति अस्वीकृत है। नमूना वास्तुकला मोड चुनें या अपनी तस्वीर अपलोड करें।'
          : lang === 'en'
          ? 'Unable to access camera. Please check your camera settings or use Sample Mode.'
          : 'कैमरा शुरू नहीं हो सका। कृपया सेटिंग जांचें या नमूना वास्तुकला मोड का उपयोग करें।'
      );
      setUseSampleBackground(true);
    }
  }, [lang, stream]);

  // Start camera on mount
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch between front and back camera
  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Switch to preset configuration
  const applyPreset = (preset: ArchitecturalPreset) => {
    setConicType(preset.conicType);
    setScale(preset.scale);
    setRotation(preset.rotation);
    setAspectRatio(preset.aspectRatio);
    setInvert(preset.invert);
    setShowMesh3D(preset.mesh3D);
    setCenter({ x: 0.5, y: 0.5 });
  };

  // Handle custom user photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomPhotoUrl(url);
    setUseSampleBackground(true);
    setIsCameraActive(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Draw wireframe on canvas
  const drawWireframe = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = center.x * width;
    const cy = center.y * height;
    const baseRadius = Math.min(width, height) * 0.25 * scale;
    const rad = (rotation * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rad);

    ctx.strokeStyle = wireframeColor;
    ctx.fillStyle = wireframeColor;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw central alignment crosshair
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Mathematical drawing per conic type
    switch (conicType) {
      case 'circle': {
        // Main Circle
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Diameter lines
        ctx.beginPath();
        ctx.setLineDash([3, 5]);
        ctx.moveTo(-baseRadius, 0);
        ctx.lineTo(baseRadius, 0);
        ctx.moveTo(0, -baseRadius);
        ctx.lineTo(0, baseRadius);
        ctx.stroke();
        ctx.setLineDash([]);

        // 3D Spherical Wireframe Ribs
        if (showMesh3D) {
          const latRings = [0.4, 0.7, 0.9];
          latRings.forEach((ratio) => {
            const r = baseRadius * ratio;
            const h = Math.sqrt(Math.max(0, baseRadius * baseRadius - r * r));
            ctx.beginPath();
            ctx.ellipse(0, h * 0.5, r, r * 0.35, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, -h * 0.5, r, r * 0.35, 0, 0, Math.PI * 2);
            ctx.stroke();
          });
          // Longitude ellipses
          ctx.beginPath();
          ctx.ellipse(0, 0, baseRadius * 0.45, baseRadius, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      }

      case 'ellipse': {
        const a = baseRadius * Math.max(1, aspectRatio);
        const b = baseRadius / Math.max(1, aspectRatio);
        const c = Math.sqrt(Math.max(0, a * a - b * b));

        // Main Ellipse
        ctx.beginPath();
        ctx.ellipse(0, 0, a, b, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Major and Minor Axis Lines
        ctx.beginPath();
        ctx.setLineDash([3, 5]);
        ctx.moveTo(-a, 0);
        ctx.lineTo(a, 0);
        ctx.moveTo(0, -b);
        ctx.lineTo(0, b);
        ctx.stroke();
        ctx.setLineDash([]);

        // Foci F1 and F2
        if (showFoci) {
          [-c, c].forEach((fPos, idx) => {
            ctx.beginPath();
            ctx.arc(fPos, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '11px monospace';
            ctx.fillText(idx === 0 ? 'F₁' : 'F₂', fPos - 8, -10);
          });
        }

        // 3D Ellipsoid Wireframe Rings
        if (showMesh3D) {
          for (let step = 0.3; step <= 0.8; step += 0.25) {
            ctx.beginPath();
            ctx.ellipse(0, b * step, a * Math.sqrt(1 - step * step), b * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, -b * step, a * Math.sqrt(1 - step * step), b * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        break;
      }

      case 'parabola': {
        const p = (baseRadius * 0.5) / Math.max(0.5, aspectRatio);
        const yDir = invert ? -1 : 1;
        const xLimit = baseRadius * 1.6;

        ctx.beginPath();
        let first = true;
        for (let x = -xLimit; x <= xLimit; x += 4) {
          const y = (x * x) / (4 * p) * yDir;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Vertex
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Focus and Directrix
        if (showFoci) {
          const fy = p * yDir;
          ctx.beginPath();
          ctx.arc(0, fy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '11px monospace';
          ctx.fillText('F', 8, fy + 4);

          // Ray from Focus to a sample point on parabola demonstrating reflective property
          const testX = baseRadius * 0.8;
          const testY = (testX * testX) / (4 * p) * yDir;
          ctx.beginPath();
          ctx.setLineDash([2, 4]);
          ctx.moveTo(0, fy);
          ctx.lineTo(testX, testY);
          ctx.lineTo(testX, testY + 120 * yDir);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (showDirectrix) {
          const dy = -p * yDir;
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(-xLimit, dy);
          ctx.lineTo(xLimit, dy);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.font = '10px monospace';
          ctx.fillText(lang === 'en' ? 'Directrix' : 'नियता', -xLimit + 10, dy - 6);
        }

        // 3D Paraboloid Wireframe Rings
        if (showMesh3D) {
          const ringHeights = [0.3, 0.7, 1.2];
          ringHeights.forEach((hFactor) => {
            const h = baseRadius * hFactor * yDir;
            const r = Math.sqrt(4 * p * Math.abs(h));
            ctx.beginPath();
            ctx.ellipse(0, h, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
          });
        }
        break;
      }

      case 'hyperbola': {
        const a = baseRadius * 0.8;
        const b = baseRadius * 0.6 * aspectRatio;
        const c = Math.sqrt(a * a + b * b);
        const yMax = baseRadius * 1.5;

        // Draw Left and Right Branches
        [-1, 1].forEach((branchSign) => {
          ctx.beginPath();
          let first = true;
          for (let y = -yMax; y <= yMax; y += 4) {
            const x = branchSign * a * Math.sqrt(1 + (y * y) / (b * b));
            if (first) {
              ctx.moveTo(x, y);
              first = false;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        });

        // Asymptotes lines y = ±(b/a)*x
        if (showDirectrix) {
          ctx.beginPath();
          ctx.setLineDash([3, 5]);
          const slope = b / a;
          const xReach = baseRadius * 1.8;
          ctx.moveTo(-xReach, -xReach * slope);
          ctx.lineTo(xReach, xReach * slope);
          ctx.moveTo(-xReach, xReach * slope);
          ctx.lineTo(xReach, -xReach * slope);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Foci
        if (showFoci) {
          [-c, c].forEach((fPos, idx) => {
            ctx.beginPath();
            ctx.arc(fPos, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '11px monospace';
            ctx.fillText(idx === 0 ? 'F₁' : 'F₂', fPos - 8, -10);
          });
        }

        // 3D Hyperboloid of One Sheet Wireframe (with straight-line ruled surface generators!)
        if (showMesh3D) {
          const heights = [-yMax * 0.8, -yMax * 0.4, 0, yMax * 0.4, yMax * 0.8];
          heights.forEach((h) => {
            const r = a * Math.sqrt(1 + (h * h) / (b * b));
            ctx.beginPath();
            ctx.ellipse(0, h, r, r * 0.3, 0, 0, Math.PI * 2);
            ctx.stroke();
          });

          // Draw straight rulings that create the curved surface (Ruled surface geometry)
          ctx.beginPath();
          ctx.setLineDash([2, 4]);
          for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI) / 4;
            const topR = a * Math.sqrt(1 + (yMax * yMax) / (b * b));
            const x1 = Math.cos(ang) * topR;
            const z1 = Math.sin(ang) * topR * 0.3;
            const x2 = Math.cos(ang + 0.8) * topR;
            const z2 = Math.sin(ang + 0.8) * topR * 0.3;
            ctx.moveTo(x1, -yMax + z1);
            ctx.lineTo(x2, yMax + z2);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }
        break;
      }
    }

    ctx.restore();
  }, [
    center,
    scale,
    rotation,
    aspectRatio,
    invert,
    conicType,
    wireframeColor,
    lineWidth,
    opacity,
    showFoci,
    showDirectrix,
    showMesh3D,
    lang,
  ]);

  // Synchronize canvas size and redraw loop with high-DPI support
  const drawWireframeRef = useRef(drawWireframe);
  useEffect(() => {
    drawWireframeRef.current = drawWireframe;
  }, [drawWireframe]);

  useEffect(() => {
    let animId: number;
    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(container.clientWidth * dpr);
        const h = Math.floor(container.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        drawWireframeRef.current();
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Touch and Mouse Drag to Reposition Center (h, k)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    centerStartRef.current = { ...center };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStartRef.current.x) / rect.width;
    const dy = (e.clientY - dragStartRef.current.y) / rect.height;
    setCenter({
      x: Math.min(0.95, Math.max(0.05, centerStartRef.current.x + dx)),
      y: Math.min(0.95, Math.max(0.05, centerStartRef.current.y + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom / scale
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((prev) => Math.min(3.0, Math.max(0.2, prev + delta)));
  };

  // Capture current view + wireframe into a snapshot
  const handleCaptureSnapshot = () => {
    const wireCanvas = canvasRef.current;
    if (!wireCanvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = wireCanvas.width;
    exportCanvas.height = wireCanvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const finishExport = () => {
      // Draw wireframe on top
      ctx.drawImage(wireCanvas, 0, 0);

      // Draw architectural math telemetry watermark banner
      ctx.fillStyle = 'rgba(10, 10, 10, 0.88)';
      ctx.fillRect(0, exportCanvas.height - 64, exportCanvas.width, 64);
      ctx.fillStyle = '#B6FFED';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('CONIC CITY • AR ARCHITECTURAL WIREFRAME', 24, exportCanvas.height - 38);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      const formulaText =
        conicType === 'circle'
          ? 'x² + y² = r²  (e = 0)'
          : conicType === 'ellipse'
          ? 'x²/a² + y²/b² = 1  (0 < e < 1)'
          : conicType === 'parabola'
          ? 'y = ax²  (e = 1)'
          : 'x²/a² - y²/b² = 1  (e > 1)';
      ctx.fillText(`${conicType.toUpperCase()} | ${formulaText}`, 24, exportCanvas.height - 18);

      const dataUrl = exportCanvas.toDataURL('image/png');
      setCapturedSnapshotUrl(dataUrl);
    };

    // Draw background (either video frame or sample photo)
    if (isCameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, exportCanvas.width, exportCanvas.height);
      finishExport();
    } else if (customPhotoUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height);
        finishExport();
      };
      img.onerror = () => {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        finishExport();
      };
      img.src = customPhotoUrl;
    } else {
      // Draw procedural sample background
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      finishExport();
    }
  };

  // Mathematical telemetry metrics
  const eccentricityDisplay =
    conicType === 'circle'
      ? '0.00'
      : conicType === 'parabola'
      ? '1.00'
      : conicType === 'ellipse'
      ? Math.sqrt(1 - 1 / (aspectRatio * aspectRatio)).toFixed(2)
      : Math.sqrt(1 + aspectRatio * aspectRatio).toFixed(2);

  const formulaEquation =
    conicType === 'circle'
      ? 'x² + y² = r²'
      : conicType === 'ellipse'
      ? 'x²/a² + y²/b² = 1'
      : conicType === 'parabola'
      ? invert
        ? '-y = ax²'
        : 'y = ax²'
      : 'x²/a² - y²/b² = 1';

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col select-none overflow-hidden font-sans">
      {/* Top Navigation & Status Bar */}
      <div className="h-16 px-4 sm:px-6 bg-[#0e1112]/90 border-b border-[#333333] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B6FFED]/15 border border-[#B6FFED]/40 flex items-center justify-center text-[#B6FFED] shadow-[0_0_12px_rgba(182,255,237,0.2)]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-white font-display">
                {UI_TEXT[lang].cameraViewTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B6FFED]/10 border border-[#B6FFED]/30 text-[#B6FFED] uppercase">
                {conicType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {lang === 'en'
                ? 'Drag wireframe onto real objects or use architectural presets'
                : 'वास्तविक वस्तुओं पर वायरफ्रेम खींचें या वास्तुशिल्प प्रीसेट चुनें'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Switch Camera / Facing Mode */}
          {isCameraActive && (
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title={UI_TEXT[lang].switchCamera}
            >
              <FlipHorizontal className="w-4 h-4 text-[#B6FFED]" />
            </button>
          )}

          {/* Toggle Control Panel */}
          <button
            onClick={() => setShowControlPanel(!showControlPanel)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showControlPanel
                ? 'bg-[#B6FFED]/15 border-[#B6FFED]/50 text-[#B6FFED]'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Adjustments' : 'समायोजन'}
            </span>
          </button>

          {/* Close Overlay */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 border border-slate-700/60 transition-colors"
            title={UI_TEXT[lang].close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport (Video Stream + Interactive Canvas + Telemetry HUD) */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {/* Main Canvas & Video Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className="relative w-full h-full cursor-move touch-none flex items-center justify-center"
        >
          {/* Real Camera Feed */}
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Fallback Sample Background or Uploaded Photo */}
          {!isCameraActive && (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none bg-slate-950">
              {customPhotoUrl ? (
                <img
                  src={customPhotoUrl}
                  alt="Custom uploaded architectural photo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${SAMPLE_SCENES[sampleSceneIndex].bgGradient} flex flex-col items-center justify-center p-6 text-center`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#B6FFED]">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {SAMPLE_SCENES[sampleSceneIndex].name}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    {lang === 'en'
                      ? 'Interactive simulation canvas. Drag to align the mathematical wireframe, zoom using the slider or pinch gestures.'
                      : 'इंटरएक्टिव सिमुलेशन कैनवास। वायरफ्रेम संरेखित करने के लिए खींचें और स्लाइडर से आकार बदलें।'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Real-Time Interactive Mathematical Wireframe Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10 pointer-events-auto"
          />

          {/* In-Frame Live Mathematical Telemetry Badge (Corner HUD) */}
          {showTelemetry && (
            <div className="absolute top-4 left-4 z-20 pointer-events-none bg-[#0a0f12]/85 border border-[#B6FFED]/40 rounded-2xl p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.6)] text-xs font-mono max-w-xs sm:max-w-sm">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between gap-4 mb-1">
                <span>{lang === 'en' ? 'Live Telemetry' : 'लाइव टेलीमेट्री'}</span>
                <span className="text-[#B6FFED] font-bold">60 FPS</span>
              </div>
              <div className="text-white font-bold text-sm mb-1">{formulaEquation}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400">e: </span>
                  <span className="text-[#B6FFED] font-bold">{eccentricityDisplay}</span>
                </div>
                <div>
                  <span className="text-slate-400">Scale: </span>
                  <span className="text-white">{scale.toFixed(2)}×</span>
                </div>
                <div>
                  <span className="text-slate-400">Rot: </span>
                  <span className="text-white">{rotation}°</span>
                </div>
                <div>
                  <span className="text-slate-400">Center: </span>
                  <span className="text-white">
                    {(center.x * 100).toFixed(0)}%, {(center.y * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Conic Switcher Floating Pills (Bottom Center) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0a0a0a]/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
            {(['circle', 'ellipse', 'parabola', 'hyperbola'] as ConicType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setConicType(type);
                  if (type === 'circle') setAspectRatio(1.0);
                  if (type === 'parabola') setInvert(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 ${
                  conicType === type
                    ? 'bg-[#B6FFED] text-[#0a0a0a] shadow-[0_0_12px_rgba(182,255,237,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}

            {/* Shutter / Capture Button */}
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button
              onClick={handleCaptureSnapshot}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-transform active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{UI_TEXT[lang].captureSnapshot}</span>
            </button>
          </div>

          {/* Camera Permission Warning Banner if inactive */}
          {cameraError && (
            <div className="absolute top-4 right-4 z-20 max-w-sm p-3 rounded-2xl bg-[#161214]/90 border border-amber-500/40 text-xs text-amber-200 backdrop-blur-md flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">
                  {UI_TEXT[lang].cameraPermissionDenied}
                </p>
                <p className="text-[11px] text-slate-300 mb-2">{cameraError}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSampleSceneIndex((prev) => (prev + 1) % SAMPLE_SCENES.length);
                      setCustomPhotoUrl(null);
                      setUseSampleBackground(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold"
                  >
                    {UI_TEXT[lang].useSampleScene}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{UI_TEXT[lang].uploadOwnPhoto}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input for Custom Architectural Photo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Floating / Collapsible Adjustments Control Drawer */}
        {showControlPanel && (
          <div className="absolute right-4 bottom-24 top-20 w-72 sm:w-80 bg-[#0d1214]/95 border border-[#B6FFED]/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl z-30 flex flex-col gap-3 text-xs overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Sliders className="w-4 h-4 text-[#B6FFED]" />
                <span>{lang === 'en' ? 'Wireframe Controls' : 'वायरफ्रेम नियंत्रण'}</span>
              </div>
              <button
                onClick={() => {
                  setCenter({ x: 0.5, y: 0.5 });
                  setScale(1.0);
                  setRotation(0);
                  setAspectRatio(1.2);
                }}
                className="text-[10px] font-mono text-[#B6FFED] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{UI_TEXT[lang].resetOverlay}</span>
              </button>
            </div>

            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{UI_TEXT[lang].scale}</span>
                <span className="font-mono text-[#B6FFED]">{scale.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#B6FFED] bg-slate-800 rounded-lg h-1.5"
              />
            </div>

            {/* Rotation Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{UI_TEXT[lang].rotation}</span>
                <span className="font-mono text-[#B6FFED]">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-[#B6FFED] bg-slate-800 rounded-lg h-1.5"
              />
            </div>

            {/* Aspect Ratio / Eccentricity Adjustment */}
            {conicType !== 'circle' && (
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>
                    {conicType === 'ellipse'
                      ? lang === 'en'
                        ? 'Axis Ratio (a/b)'
                        : 'अक्ष अनुपात'
                      : lang === 'en'
                      ? 'Curvature Factor'
                      : 'वक्रता कारक'}
                  </span>
                  <span className="font-mono text-[#B6FFED]">{aspectRatio.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.05"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#B6FFED] bg-slate-800 rounded-lg h-1.5"
                />
              </div>
            )}

            {/* Parabola Invert (Arch vs Dish) */}
            {conicType === 'parabola' && (
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300">
                  {lang === 'en' ? 'Arch Opening' : 'मेहराब मुख'}
                </span>
                <button
                  onClick={() => setInvert(!invert)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold ${
                    invert
                      ? 'bg-[#B6FFED]/20 border-[#B6FFED] text-[#B6FFED]'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {invert
                    ? lang === 'en'
                      ? 'Downwards (Arch)'
                      : 'नीचे (मेहराब)'
                    : lang === 'en'
                    ? 'Upwards (Dish)'
                    : 'ऊपर (डिश)'}
                </button>
              </div>
            )}

            {/* Wireframe Color Selection */}
            <div>
              <span className="text-slate-300 block mb-1.5">{UI_TEXT[lang].wireframeColor}</span>
              <div className="flex items-center gap-2">
                {WIREFRAME_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setWireframeColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      wireframeColor === c.hex
                        ? 'scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Toggle Auxiliary Guides (Foci, 3D Mesh, Directrix) */}
            <div className="border-t border-slate-700/60 pt-2 flex flex-col gap-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Mathematical Guides' : 'गणितीय मार्गदर्शक'}
              </div>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                <span>{lang === 'en' ? 'Focal Points (F₁, F₂)' : 'नाभि बिंदु (Foci)'}</span>
                <input
                  type="checkbox"
                  checked={showFoci}
                  onChange={(e) => setShowFoci(e.target.checked)}
                  className="rounded accent-[#B6FFED]"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                <span>
                  {conicType === 'hyperbola'
                    ? lang === 'en'
                      ? 'Asymptote Lines'
                      : 'अनंतस्पर्शी रेखाएं'
                    : lang === 'en'
                    ? 'Directrix Line'
                    : 'नियता रेखा'}
                </span>
                <input
                  type="checkbox"
                  checked={showDirectrix}
                  onChange={(e) => setShowDirectrix(e.target.checked)}
                  className="rounded accent-[#B6FFED]"
                />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-white">
                <span>{lang === 'en' ? '3D Revolution Mesh Rings' : '3D रिंग वायरफ्रेम'}</span>
                <input
                  type="checkbox"
                  checked={showMesh3D}
                  onChange={(e) => setShowMesh3D(e.target.checked)}
                  className="rounded accent-[#B6FFED]"
                />
              </label>
            </div>

            {/* Architectural Presets */}
            <div className="border-t border-slate-700/60 pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {UI_TEXT[lang].presetStructures}
              </div>
              <div className="flex flex-col gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-[#B6FFED]/40 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#B6FFED]">
                        {lang === 'en' ? p.nameEn : p.nameHi}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {lang === 'en' ? p.descriptionEn : p.descriptionHi}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase text-[#B6FFED] bg-[#B6FFED]/10 px-1.5 py-0.5 rounded border border-[#B6FFED]/30">
                      {p.conicType}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Captured Snapshot Modal */}
      {capturedSnapshotUrl && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#0e1214] border border-[#B6FFED]/50 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B6FFED]" />
                <h3 className="text-base font-bold text-white font-display">
                  {lang === 'en' ? 'AR Conic Photo Captured' : 'एआर शंकु तस्वीर कैप्चर'}
                </h3>
              </div>
              <button
                onClick={() => setCapturedSnapshotUrl(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[60vh]">
              <img
                src={capturedSnapshotUrl}
                alt="AR Captured alignment"
                className="w-full h-auto max-h-[58vh] object-contain"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCapturedSnapshotUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {UI_TEXT[lang].takeAnother}
              </button>
              <a
                href={capturedSnapshotUrl}
                download={`Conic-City-AR-${conicType}-${Date.now()}.png`}
                className="px-5 py-2 rounded-xl bg-[#B6FFED] hover:bg-[#9effe4] text-[#0a0a0a] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(182,255,237,0.3)] no-underline"
              >
                <Download className="w-4 h-4" />
                <span>{UI_TEXT[lang].downloadPhoto}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
