import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { Download, QrCode } from 'lucide-react';

const StudentQR: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/profile').then(res => {
      setProfile(res.data);
      setLoading(false);
    });
  }, []);

  const downloadQR = () => {
    const svg = document.getElementById('student-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'hostel-qr.png';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-brand-bg space-y-12 pb-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-brand-card p-12 rounded-[4rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center space-y-10 border border-brand-border relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary opacity-20" />
        
        <div className="bg-brand-bg border border-brand-border p-5 rounded-3xl text-brand-primary shadow-inner">
          <QrCode size={48} />
        </div>
        
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative">
          <div className="absolute inset-0 border-8 border-white rounded-[2.5rem]" />
          <QRCodeSVG 
            id="student-qr"
            value={profile?.student?.qrToken || ''} 
            size={240}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="text-center group">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{profile?.student?.name}</h2>
          <p className="text-brand-primary font-mono text-xs font-black tracking-[0.3em] mt-3 uppercase">{profile?.student?.registerNumber}</p>
        </div>

        <button
          onClick={downloadQR}
          className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.03] active:scale-[0.97] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] italic"
        >
          <Download size={20} />
          DOWNLOAD PASSKEY
        </button>
      </motion.div>

      <div className="text-center space-y-3 max-w-xs">
        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Security Protocol</p>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          Present this cryptographic token at the verification terminal to authenticate your session attendance.
        </p>
      </div>
    </div>
  );
};

export default StudentQR;
