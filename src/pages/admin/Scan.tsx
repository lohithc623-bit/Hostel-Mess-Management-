import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCcw, CheckCircle2, XCircle, User, Layout, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminScan: React.FC = () => {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera Access Error:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const scan = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && scanning) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          handleScan(code.data);
        }
      }
      animationFrameId = requestAnimationFrame(scan);
    };

    if (scanning && cameraActive) {
      animationFrameId = requestAnimationFrame(scan);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [scanning, cameraActive, mealType]);

  const handleScan = async (qrToken: string) => {
    setScanning(false);
    setError('');
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.post('/scan/verify', { qrToken, mealType, date: today });
      setResult(res.data.student);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-300 p-8 flex flex-col font-sans">
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/admin/dashboard')} className="p-3 bg-brand-card border border-brand-border rounded-xl text-slate-500 hover:text-white transition-all shadow-xl">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2 bg-brand-card border border-brand-border p-1.5 rounded-2xl shadow-inner">
          {(['breakfast', 'lunch', 'dinner'] as const).map(type => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mealType === type ? 'bg-brand-primary text-black shadow-lg' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-full max-w-md aspect-square bg-brand-card rounded-[4rem] overflow-hidden shadow-2xl border border-brand-border">
          {scanning ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover opacity-80" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 border-[2px] border-brand-primary/50 rounded-[2.5rem] relative">
                  <div className="absolute inset-0 bg-brand-primary/5 animate-pulse rounded-[2.5rem]" />
                  <motion.div 
                    animate={{ top: ['5%', '95%', '5%'] }} 
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-full h-1 bg-brand-primary shadow-[0_0_20px_rgba(245,158,11,1)]" 
                  />
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand-primary rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand-primary rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand-primary rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand-primary rounded-br-xl" />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-card p-10">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-center space-y-8"
                  >
                    <div className="bg-green-500/10 text-green-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                      <CheckCircle2 size={56} />
                    </div>
                    <div>
                      <h4 className="text-4xl font-black text-white italic tracking-tighter uppercase">{result.name}</h4>
                      <p className="text-brand-primary font-mono text-sm font-black tracking-[0.2em] mt-2">{result.registerNumber}</p>
                    </div>
                    <div className="inline-block px-6 py-2 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {result.messType} Plan <span className="text-green-500 ml-2">Verified</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-center space-y-8"
                  >
                    <div className="bg-red-500/10 text-red-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                      <XCircle size={56} />
                    </div>
                    <div>
                      <p className="text-xl font-black text-red-400 uppercase tracking-tighter italic">Access Denied</p>
                      <p className="text-slate-500 font-medium text-sm mt-2 max-w-[200px] mx-auto">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {!scanning && (
          <button
            onClick={resetScanner}
            className="flex items-center gap-4 px-12 py-5 bg-brand-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(245,158,11,0.2)] italic"
          >
            <RefreshCcw size={20} />
            SCAN NEXT
          </button>
        )}

        {scanning && (
          <div className="text-center space-y-3">
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Align Passkey in Frame</p>
            <div className="flex items-center gap-3 text-brand-primary justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest italic">{mealType} Session active</span>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-800 text-[10px] font-black uppercase tracking-[0.5em] py-8">
        Terminal // Auth-System v2.4.0
      </footer>
    </div>
  );
};

export default AdminScan;
