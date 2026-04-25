import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { AlertCircle, Search, User } from 'lucide-react';

const AdminFines: React.FC = () => {
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/fines').then(res => {
      setFines(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = fines.filter(f => 
    f.studentId?.name.toLowerCase().includes(search.toLowerCase()) || 
    f.studentId?.registerNumber.includes(search)
  );

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Fines...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-brand-bg min-h-screen pb-24 text-slate-300">
      <div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">FINE SYSTEM AUDIT</h1>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Monitoring penalties for missed meal registrations</p>
      </div>

      <div className="relative max-w-md group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by student name or reg no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-brand-card border border-brand-border rounded-[1.5rem] text-white shadow-2xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all placeholder:text-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((fine, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={fine._id}
            className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white italic leading-none">₹{fine.amount}</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-red-500 mt-2">DUE PENALTY</p>
              </div>
            </div>

            <div className="mt-10 space-y-4 relative z-10">
              <div>
                <h4 className="text-lg font-black text-slate-200 uppercase tracking-tight">{fine.studentId?.name}</h4>
                <p className="text-xs font-mono text-brand-primary font-bold tracking-widest">{fine.studentId?.registerNumber}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                <span className="px-3 py-1 bg-brand-bg text-slate-400 border border-brand-border rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {fine.mealType}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">On {fine.date}</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 text-brand-primary opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
              <User size={160} />
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-brand-border rounded-[3rem]">
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No pending violations identified</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFines;
