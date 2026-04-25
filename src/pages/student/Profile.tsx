import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { User, ShieldCheck, Mail, LogOut, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [passwords, setPasswords] = useState({ old: '', new: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/student/profile').then(res => {
      setProfile(res.data.student);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/student/change-password', {
        oldPassword: passwords.old,
        newPassword: passwords.new
      });
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ old: '', new: '' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-24 bg-brand-bg min-h-screen text-slate-300">
      <div className="bg-brand-card rounded-[3rem] p-10 border border-brand-border shadow-2xl space-y-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-[0.02] rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="w-28 h-28 bg-brand-bg border-4 border-brand-border text-brand-primary rounded-full flex items-center justify-center shadow-2xl italic group-hover:scale-105 transition-transform">
            <User size={56} />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{profile?.name}</h2>
            <p className="text-brand-primary font-mono text-sm font-black tracking-[0.3em] mt-3">{profile?.registerNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="flex items-center gap-4 p-5 bg-brand-bg/50 border border-brand-border rounded-2xl shadow-inner">
            <Mail className="text-slate-500" size={24} />
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-600">Digital Identity</p>
              <p className="text-slate-300 font-bold text-sm truncate">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 bg-brand-bg/50 border border-brand-border rounded-2xl shadow-inner">
            <ShieldCheck className="text-slate-500" size={24} />
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-600">Allocated Mess</p>
              <p className="text-brand-primary font-black text-sm uppercase italic tracking-widest">{profile?.messType}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-5 bg-brand-bg border border-brand-border text-red-500 rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-red-500/10 hover:border-red-500/30 transition-all relative z-10"
        >
          <LogOut size={20} />
          TERMINATE SESSION
        </button>
      </div>

      <div className="bg-brand-card rounded-[3rem] p-10 border border-brand-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary opacity-20" />
        
        <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3 italic uppercase tracking-tighter">
          <KeyRound size={24} className="text-brand-primary" />
          ENCRYPTION KEYS
        </h3>
        
        <form onSubmit={changePassword} className="space-y-8">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.old}
              onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
              className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Secure Key</label>
            <input
              type="password"
              required
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all font-bold placeholder:text-slate-800 shadow-inner"
              placeholder="MIN 8 CHARACTERS"
            />
          </div>

          {msg.text && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[10px] font-black text-center uppercase tracking-widest p-3 rounded-xl border ${
                msg.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}
            >
              {msg.text}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-brand-primary text-black rounded-2xl font-black italic uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          >
            ROTATE CREDENTIALS
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
