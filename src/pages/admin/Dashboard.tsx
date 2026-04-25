import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { Users, ClipboardList, AlertCircle, ScanLine, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({ students: 0, regs: 0, finesToday: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, logs, fines] = await Promise.all([
          api.get('/admin/students'),
          api.get(`/admin/meal-log?date=${new Date().toISOString().split('T')[0]}`),
          api.get('/admin/fines')
        ]);
        
        setStats({
          students: students.data.length,
          regs: logs.data.length,
          finesToday: fines.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-brand-bg min-h-screen pb-24 text-slate-300">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Admin Portal</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Hello, <span className="text-brand-primary italic font-black">{user.name}</span></p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => navigate('/admin/scan')}
             className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-black rounded-2xl font-black italic shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
           >
             <ScanLine size={18} />
             Open Scanner
           </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div whileHover={{ y: -8 }} className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="w-14 h-14 bg-brand-bg border border-brand-border text-brand-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Residents</p>
            <p className="text-4xl font-black text-white italic">{stats.students}</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Users size={120} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -8 }} className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="w-14 h-14 bg-brand-bg border border-brand-border text-brand-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <ClipboardList size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Today's Regs</p>
            <p className="text-4xl font-black text-white italic">{stats.regs}</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ClipboardList size={120} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -8 }} className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl space-y-6 relative overflow-hidden group">
          <div className="w-14 h-14 bg-brand-bg border border-brand-border text-red-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Fines</p>
            <p className="text-4xl font-black text-white italic">{stats.finesToday}</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <AlertCircle size={120} />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-card p-10 rounded-[3rem] border border-brand-border shadow-2xl relative overflow-hidden group transition-all hover:border-brand-primary/20">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Resident Management</h3>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed uppercase tracking-wider">Register new students, update profiles, and manage mess types with precision.</p>
            <button 
              onClick={() => navigate('/admin/students')}
              className="flex items-center gap-3 bg-brand-bg border border-brand-border px-6 py-3 rounded-xl text-brand-primary font-black text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all"
            >
              DIRECTORY ACCESS <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 text-brand-primary opacity-[0.03] group-hover:opacity-10 transition-all">
            <PlusCircle size={200} />
          </div>
        </div>

        <div className="bg-brand-card p-10 rounded-[3rem] border border-brand-border shadow-2xl relative overflow-hidden group transition-all hover:border-brand-primary/20">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Audits & Reports</h3>
            <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed uppercase tracking-wider">Analyze meal patterns and enforce accountability through automated compliance logs.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/admin/logs')}
                className="bg-brand-bg border border-brand-border px-6 py-3 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
              >
                MEAL LOGS
              </button>
              <button 
                onClick={() => navigate('/admin/fines')}
                className="bg-brand-bg border border-brand-border px-6 py-3 rounded-xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
              >
                FINE REPORTS
              </button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-brand-primary opacity-[0.03] group-hover:opacity-10 transition-all">
            <ClipboardList size={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
