import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, User } from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-6 font-sans relative overflow-hidden">
      {/* Background purely aesthetic elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-primary opacity-[0.03] blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-500 opacity-[0.02] blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-brand-card rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden border border-brand-border relative z-10"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">MESS PORTAL</h1>
            <p className="text-slate-500 mt-3 text-[10px] font-black uppercase tracking-[0.25em]">Centralized Management System</p>
          </div>

          <div className="flex bg-brand-bg border border-brand-border p-1.5 rounded-2xl mb-10">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'student' ? 'bg-brand-primary text-black italic' : 'text-slate-600'
              }`}
            >
              <User size={16} />
              IDENT: RESIDENT
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'admin' ? 'bg-brand-primary text-black italic' : 'text-slate-600'
              }`}
            >
              <Lock size={16} />
              IDENT: ADMIN
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Digital Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all font-bold placeholder:text-slate-800"
                  placeholder="name@college.edu"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all font-bold placeholder:text-slate-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest bg-red-500/5 py-3 rounded-xl border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-black uppercase tracking-[0.25em] text-xs shadow-2xl transition-all flex items-center justify-center gap-3 italic hover:scale-[1.02] active:scale-[0.98] ${
                loading ? 'bg-slate-800 cursor-not-allowed text-slate-500 italic' : 
                'bg-brand-primary shadow-[0_0_40px_rgba(245,158,11,0.2)]'
              }`}
            >
              {loading ? <Loader2 className="animate-spin italic" size={20} /> : 'INITIALIZE SESSION //'}
            </button>
          </form>
        </div>
        
        <div className="p-8 bg-brand-bg/50 border-t border-brand-border text-center overflow-hidden relative">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-black relative z-10">
            SECURED ENCRYPTED TERMINAL V2.4
          </p>
          <div className="absolute inset-0 bg-brand-primary/[0.01] pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
