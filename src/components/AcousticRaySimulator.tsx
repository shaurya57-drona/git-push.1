import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../data/translations';
import { useBlueprintGrid } from '../context/BlueprintGridContext';
import { Volume2, Play, Trash2, Info, Sparkles, Compass } from 'lucide-react';

interface AcousticRaySimulatorProps {
  lang: Language;
}

export const AcousticRaySimulator: React.FC<AcousticRaySimulatorProps> = ({ lang }) => {
  const { showGrid } = useBlueprintGrid();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMode, setActiveMode] = useState<'ellipse' | 'parabola'>('ellipse');
  const [rayCount, setRayCount] = useState<number>(18);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);

  // Audio Context for synthetic acoustic whispering ping
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Animation and parameter state refs to prevent 60fps re-renders
  const progressRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const activeModeRef = useRef<'ellipse' | 'parabola'>(activeMode);
  const rayCountRef = useRef<number>(rayCount);
  const audioFeedbackRef = useRef<boolean>(audioFeedback);
  const langRef = useRef<Language>(lang);
  const showGridRef = useRef<boolean>(showGrid);

  useEffect(() => {
    showGridRef.current = showGrid;
  }, [showGrid]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    rayCountRef.current = rayCount;
  }, [rayCount]);

  useEffect(() => {
    audioFeedbackRef.current = audioFeedback;
  }, [audioFeedback]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const playPing = (freq = 880) => {
    if (!audioFeedbackRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio might be blocked by browser autoplay policy
    }
  };

  // High-performance unified animation and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let logicalWidth = 700;
    const logicalHeight = 440;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      if (!canvas.parentElement) return;
      const parentWidth = canvas.parentElement.clientWidth || 700;
      logicalWidth = parentWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
    };

    updateCanvasSize();

    // Resize observer only triggers when DOM dimensions change, NOT on every frame!
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      if (isPlayingRef.current) {
        progressRef.current += 0.008;
        if (progressRef.current >= 1.0) {
          progressRef.current = 0;
          playPing(activeModeRef.current === 'ellipse' ? 980 : 740);
        }
      }

      const pulseProgress = progressRef.current;
      const currentMode = activeModeRef.current;
      const currentRays = rayCountRef.current;
      const currentLang = langRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear background
      ctx.fillStyle = '#070a14';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Coordinate grid lines
      if (showGridRef.current) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        const gridStep = 40;
        for (let x = 0; x <= logicalWidth; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, logicalHeight);
          ctx.stroke();
        }
        for (let y = 0; y <= logicalHeight; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(logicalWidth, y);
          ctx.stroke();
        }
      }

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;

      if (currentMode === 'ellipse') {
        // ===================================
        // ELLIPSE (WHISPERING GALLERY)
        // ===================================
        const a = Math.min(logicalWidth * 0.42, 280);
        const b = 170;
        const c = Math.sqrt(Math.max(0, a * a - b * b));
        const f1X = centerX - c;
        const f1Y = centerY;
        const f2X = centerX + c;
        const f2Y = centerY;

        // Draw Ellipse Boundary
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Draw Major and Minor Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX - a - 20, centerY);
        ctx.lineTo(centerX + a + 20, centerY);
        ctx.moveTo(centerX, centerY - b - 20);
        ctx.lineTo(centerX, centerY + b + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Foci
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(f1X, f1Y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(f2X, f2Y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Foci Labels
        ctx.font = '12px Fira Code, monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Focus F₁ (Source)`, f1X - 50, f1Y + 22);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Focus F₂ (Listener)`, f2X - 55, f2Y + 22);

        // Acoustic Rays from F1 to Perimeter to F2
        for (let i = 0; i < currentRays; i++) {
          const theta = (i / currentRays) * Math.PI * 2;
          const px = centerX + a * Math.cos(theta);
          const py = centerY + b * Math.sin(theta);

          const dist1 = Math.hypot(px - f1X, py - f1Y);
          const dist2 = Math.hypot(f2X - px, f2Y - py);
          const totalDist = dist1 + dist2;

          ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(f1X, f1Y);
          ctx.lineTo(px, py);
          ctx.lineTo(f2X, f2Y);
          ctx.stroke();

          // Animated sound pulse packet
          const curDist = pulseProgress * totalDist;
          let packetX = f1X;
          let packetY = f1Y;

          if (curDist <= dist1) {
            const ratio = curDist / dist1;
            packetX = f1X + (px - f1X) * ratio;
            packetY = f1Y + (py - f1Y) * ratio;
          } else {
            const ratio = (curDist - dist1) / dist2;
            packetX = px + (f2X - px) * ratio;
            packetY = py + (f2Y - py) * ratio;
          }

          ctx.fillStyle = curDist > dist1 ? '#f59e0b' : '#38bdf8';
          ctx.shadowColor = curDist > dist1 ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(packetX, packetY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Mathematical Annotation
        ctx.fillStyle = '#f8fafc';
        ctx.font = '13px Fira Code, monospace';
        ctx.fillText(`Semi-major a = ${(a / 10).toFixed(1)}m | Semi-minor b = ${(b / 10).toFixed(1)}m`, 20, 30);
        ctx.fillStyle = '#c084fc';
        ctx.fillText(`Acoustic Property: PF₁ + PF₂ = 2a = ${((2 * a) / 10).toFixed(1)}m (Constant sum!)`, 20, 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Plus Jakarta Sans, sans-serif';
        ctx.fillText(
          currentLang === 'en'
            ? "St. Paul's Cathedral: all sound rays leave F₁ and arrive simultaneously in-phase at F₂"
            : 'सेंट पॉल्स कैथेड्रल: F₁ से निकलने वाली सभी ध्वनि तरंगें समान समय में F₂ पर एक साथ पहुंचती हैं',
          20,
          70
        );
      } else {
        // ===================================
        // PARABOLA (PARALLEL RAY CONCENTRATOR)
        // ===================================
        const p = 85;
        const apexX = logicalWidth * 0.28;
        const apexY = centerY;
        const focusX = apexX + p;
        const focusY = apexY;

        ctx.save();
        ctx.beginPath();
        const yMin = apexY - 180;
        const yMax = apexY + 180;
        for (let y = yMin; y <= yMax; y += 2) {
          const x = apexX + ((y - apexY) * (y - apexY)) / (4 * p);
          if (y === yMin) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Directrix Line: x = apexX - p
        const directrixX = apexX - p;
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(directrixX, 30);
        ctx.lineTo(directrixX, logicalHeight - 30);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Fira Code, monospace';
        ctx.fillText(`Directrix line x = -p`, directrixX - 70, 45);

        // Draw Focus Point
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(focusX, focusY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(`Focus F(p, 0)`, focusX - 40, focusY + 24);

        // Parallel Rays
        const yStep = 320 / currentRays;
        const startX = logicalWidth - 40;

        for (let i = 0; i <= currentRays; i++) {
          const rayY = apexY - 160 + i * yStep;
          const hitX = apexX + ((rayY - apexY) * (rayY - apexY)) / (4 * p);

          if (hitX > startX) continue;

          const dist1 = startX - hitX;
          const dist2 = Math.hypot(focusX - hitX, focusY - rayY);
          const totalDist = dist1 + dist2;

          ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(startX, rayY);
          ctx.lineTo(hitX, rayY);
          ctx.lineTo(focusX, focusY);
          ctx.stroke();

          // Animated sound pulse packet
          const curDist = pulseProgress * totalDist;
          let packetX = startX;
          let packetY = rayY;

          if (curDist <= dist1) {
            packetX = startX - curDist;
            packetY = rayY;
          } else {
            const ratio = (curDist - dist1) / dist2;
            packetX = hitX + (focusX - hitX) * ratio;
            packetY = rayY + (focusY - rayY) * ratio;
          }

          ctx.fillStyle = curDist > dist1 ? '#f59e0b' : '#34d399';
          ctx.shadowColor = curDist > dist1 ? '#f59e0b' : '#34d399';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(packetX, packetY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Mathematical Annotations
        ctx.fillStyle = '#f8fafc';
        ctx.font = '13px Fira Code, monospace';
        ctx.fillText(`Equation: y² = 4px  |  Focal Length p = ${(p / 10).toFixed(1)}m`, 20, 30);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`Property: Parallel rays reflect precisely through single Focus F`, 20, 50);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Plus Jakarta Sans, sans-serif';
        ctx.fillText(
          currentLang === 'en'
            ? 'Solar furnaces, radar antennas, and parabolic acoustic whisper dishes'
            : 'सौर भट्टियां, राडार एंटेना और परवलयिक ध्वनि परावर्तक इसी सिद्धांत पर कार्य करते हैं',
          20,
          70
        );
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div id="acoustic-lab" className="w-full bg-[#111316] border border-neutral-800/80 rounded-xl p-4 md:p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-neutral-800 text-[#B6FFED]">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
              {UI_TEXT[lang].acousticLabTitle}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1 max-w-2xl">
            {UI_TEXT[lang].acousticLabSubtitle}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5">
          <button
            id="mode-ellipse"
            onClick={() => {
              setActiveMode('ellipse');
              playPing(880);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border cursor-pointer ${
              activeMode === 'ellipse'
                ? 'bg-neutral-800 text-white border-neutral-700 font-semibold'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            {lang === 'en' ? '⬭ Ellipse (Whispering Gallery)' : '⬭ दीर्घवृत्त (व्हिस्परिंग गैलरी)'}
          </button>
          <button
            id="mode-parabola"
            onClick={() => {
              setActiveMode('parabola');
              playPing(660);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border cursor-pointer ${
              activeMode === 'parabola'
                ? 'bg-neutral-800 text-white border-neutral-700 font-semibold'
                : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            {lang === 'en' ? '∪ Parabola (Focal Concentrator)' : '∪ परवलय (नाभि केंद्रक)'}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-neutral-800 shadow-inner bg-[#07090c]">
        <canvas ref={canvasRef} className="w-full h-[400px] sm:h-[440px] block select-none" />

        {/* Floating controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#111316]/95 backdrop-blur-md p-1.5 rounded-lg border border-neutral-800">
          <button
            id="toggle-play-rays"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-md text-xs bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#B6FFED]' : 'text-neutral-400'}`} />
          </button>
          <button
            id="toggle-audio-feedback"
            onClick={() => {
              setAudioFeedback(!audioFeedback);
              if (!audioFeedback) playPing(880);
            }}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              audioFeedback ? 'bg-[#B6FFED]/15 text-[#B6FFED]' : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle Acoustic Synthesizer Audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 px-2 text-xs text-neutral-400 font-mono">
            <span>{lang === 'en' ? 'Rays:' : 'किरणें:'}</span>
            <input
              type="range"
              min="8"
              max="32"
              step="2"
              value={rayCount}
              onChange={(e) => setRayCount(Number(e.target.value))}
              className="w-16 h-1 bg-neutral-700 rounded appearance-none cursor-pointer accent-[#B6FFED]"
            />
            <span className="text-neutral-200 font-bold">{rayCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Educational Explanation Bar */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
            <Info className="w-4 h-4" />
            <span>{lang === 'en' ? 'Focal Reflection Property' : 'परावर्तन गुण'}</span>
          </div>
          {activeMode === 'ellipse' ? (
            <p>
              {lang === 'en'
                ? 'Waves from focus F₁ reflect directly to focus F₂ without dispersal.'
                : 'नाभि F₁ से निकलने वाली तरंगें सीधे नाभि F₂ पर केंद्रित होती हैं।'}
            </p>
          ) : (
            <p>
              {lang === 'en'
                ? 'Parallel incoming rays reflect to converge at the single focus F.'
                : 'समानांतर किरणें परावर्तित होकर सीधे नाभि F पर केंद्रित होती हैं।'}
            </p>
          )}
        </div>

        <div className="bg-[#0b0d0f] border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'en' ? 'Architectural Application' : 'वास्तुशिल्प अनुप्रयोग'}</span>
          </div>
          {activeMode === 'ellipse' ? (
            <p>
              {lang === 'en'
                ? "Applied in St. Paul's Cathedral Whispering Gallery and Statuary Hall."
                : 'सेंट पॉल्स कैथेड्रल व्हिस्परिंग गैलरी और स्टेट्युअरी हॉल में प्रयुक्त।'}
            </p>
          ) : (
            <p>
              {lang === 'en'
                ? 'Applied in the Gateway Arch and parabolic reflectors for zero-moment load paths.'
                : 'गेटवे आर्च और परावर्तकों में अक्षीय भार वितरण हेतु प्रयुक्त।'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
