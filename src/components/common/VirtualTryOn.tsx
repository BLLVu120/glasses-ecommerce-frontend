import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera as CameraIcon,
  Video,
  VideoOff,
  Download,
  X,
  RotateCcw,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface VariantImage {
  id: string;
  variantName?: string;
  color?: string;
  imageUrl: string;
}

interface VirtualTryOnProps {
  open: boolean;
  onClose: () => void;
  variantImages: VariantImage[];
  productName?: string;
}

export default function VirtualTryOn({
  open,
  onClose,
  variantImages,
  productName,
}: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const runningRef = useRef(false);

  const lastDetectTimeRef = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedIdxRef = useRef(selectedIdx);
  useEffect(() => {
    selectedIdxRef.current = selectedIdx;
  }, [selectedIdx]);

  const smoothRef = useRef({ x: 0, y: 0, angle: 0, width: 0, yaw: 0, initialized: false });
  const glassesImagesRef = useRef<HTMLImageElement[]>([]);

  const proxyImageUrl = useCallback((url: string) => {
    const s3Host = 'https://optics-management-storage.s3.amazonaws.com';
    if (url.startsWith(s3Host)) {
      return url.replace(s3Host, '/s3-proxy');
    }
    return url;
  }, []);

  useEffect(() => {
    glassesImagesRef.current = variantImages.map((v) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = proxyImageUrl(v.imageUrl);
      return img;
    });
  }, [variantImages, proxyImageUrl]);

  const drawGlasses = useCallback((landmarks: { x: number; y: number; z: number }[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];

    const x1 = leftEye.x * canvas.width;
    const y1 = leftEye.y * canvas.height;
    const x2 = rightEye.x * canvas.width;
    const y2 = rightEye.y * canvas.height;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const eyeDistance = Math.sqrt(dx * dx + dy * dy);

    let width = eyeDistance * 2.2;
    const depthScale = 1 + nose.z * -0.6;
    width *= depthScale;

    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const yaw = leftEar.x - rightEar.x;

    const s = smoothRef.current;
    if (!s.initialized) {
      // First detection: jump directly to correct position (no lerp)
      s.x = centerX;
      s.y = centerY;
      s.angle = angle;
      s.width = width;
      s.yaw = yaw;
      s.initialized = true;
    } else {
      s.yaw = s.yaw * 0.8 + yaw * 0.2;
      s.x = s.x * 0.85 + centerX * 0.15;
      s.y = s.y * 0.85 + centerY * 0.15;
      s.angle = s.angle * 0.85 + angle * 0.15;
      s.width = s.width * 0.85 + width * 0.15;
    }

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);

    const glasses = glassesImagesRef.current[selectedIdxRef.current];
    if (glasses && glasses.complete && glasses.naturalWidth > 0) {
      const anchorX = s.width * 0.5;
      const anchorY = s.width * 0.21;
      ctx.drawImage(glasses, -anchorX, -anchorY, s.width, s.width * 0.42);
    }

    ctx.restore();
  }, []);

  const detectLoop = useCallback(
    function detectLoop() {
      const video = videoRef.current;
      const landmarker = faceLandmarkerRef.current;
      if (!video || !landmarker || !runningRef.current) return;

      const now = performance.now();
      if (now - lastDetectTimeRef.current > 33) {
        if (video.readyState >= 2) {
          const result = landmarker.detectForVideo(video, now);
          if (result.faceLandmarks?.length) {
            drawGlasses(result.faceLandmarks[0]);
          } else {
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.clearRect(0, 0, 640, 480);
          }
        }
        lastDetectTimeRef.current = now;
      }

      animFrameRef.current = requestAnimationFrame(detectLoop);
    },
    [drawGlasses],
  );

  const initFaceLandmarker = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      );

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/face_landmarker.task',
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      faceLandmarkerRef.current = landmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        if (video.srcObject !== stream) {
          video.srcObject = stream;
        }
        try {
          await video.play();
        } catch {
          console.warn('video play interrupted');
        }
      }

      runningRef.current = true;
      setIsCamOn(true);
      setIsLoading(false);
      animFrameRef.current = requestAnimationFrame(detectLoop);
    } catch (err) {
      console.error(err);
      setError('Failed to initialize camera.');
      setIsLoading(false);
    }
  }, [detectLoop]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const composite = document.createElement('canvas');
    composite.width = 640;
    composite.height = 480;
    const ctx = composite.getContext('2d');
    if (!ctx) return;

    // Flip horizontally to match the UI (scaleX(-1))
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -640, 0, 640, 480);
    ctx.restore();

    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0);
    }

    setCapturedImage(composite.toDataURL('image/png'));
    runningRef.current = false;
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleDownload = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `virtual-tryon-${Date.now()}.png`;
    link.click();
  }, [capturedImage]);

  const toggleCamera = useCallback(() => {
    if (isCamOn) {
      runningRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.clearRect(0, 0, 640, 480);
      setIsCamOn(false);
    } else {
      runningRef.current = true;
      animFrameRef.current = requestAnimationFrame(detectLoop);
      setIsCamOn(true);
    }
  }, [isCamOn, detectLoop]);

  useEffect(() => {
    if (open) initFaceLandmarker();

    return () => {
      runningRef.current = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      faceLandmarkerRef?.current?.close();
      faceLandmarkerRef.current = null;
    };
  }, [open, initFaceLandmarker]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-lg animate-in fade-in duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-base tracking-tight">
              Virtual Try-On
            </h2>
            {productName && <p className="text-white/60 text-xs">{productName}</p>}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/12 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex gap-6 items-start max-w-[1100px] w-full px-6">
        {/* Camera viewer */}
        <div className="flex-1 relative">
          {capturedImage ? (
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <img src={capturedImage} alt="Captured" className="w-full block" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm hover:bg-white/90 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    runningRef.current = true;
                    animFrameRef.current = requestAnimationFrame(detectLoop);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/50 text-white rounded-full font-bold text-sm hover:border-white hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-2xl relative bg-black">
              <video
                ref={videoRef}
                width={640}
                height={480}
                autoPlay
                playsInline
                muted
                className="block w-full"
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* 2D glasses overlay canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ transform: 'scaleX(-1)' }}
              />

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-3">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <p className="text-white text-sm font-semibold">
                    Initializing camera & face detection...
                  </p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3 px-6">
                  <p className="text-red-400 text-sm font-bold text-center">{error}</p>
                  <button
                    onClick={initFaceLandmarker}
                    className="px-4 py-2 border border-white/40 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !error && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                  <button
                    onClick={toggleCamera}
                    title={isCamOn ? 'Pause camera' : 'Resume camera'}
                    className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                  >
                    {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={handleCapture}
                    title="Capture photo"
                    className="w-14 h-14 rounded-full bg-white hover:bg-white/90 flex items-center justify-center text-gray-900 shadow-lg transition-colors"
                  >
                    <CameraIcon className="w-6 h-6" />
                  </button>

                  <div className="w-11" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel: Variant selector */}
        {variantImages.length > 0 && (
          <div className="w-[220px] shrink-0 bg-white/8 backdrop-blur-xl rounded-2xl p-5 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
            <p className="text-white font-black text-xs uppercase tracking-widest mb-4">
              Select Glasses
            </p>
            <div className="flex flex-col gap-3">
              {variantImages.map((v, idx) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedIdx(idx);
                    setCapturedImage(null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    idx === selectedIdx
                      ? 'border-2 border-white bg-white/12'
                      : 'border border-white/15 bg-transparent hover:bg-white/8 hover:border-white/40'
                  }`}
                >
                  <img
                    src={v.imageUrl}
                    alt={v.variantName || 'Glasses'}
                    className="w-full h-[70px] object-contain rounded"
                  />
                  {(v.variantName || v.color) && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {v.color && (
                        <span
                          className="w-3 h-3 rounded-full border border-white/30 shrink-0 inline-block"
                          style={{ backgroundColor: v.color }}
                        />
                      )}
                      <span className="text-white/80 text-[11px] font-bold">
                        {v.variantName || v.color}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
