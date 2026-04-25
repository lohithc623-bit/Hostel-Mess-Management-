import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { AlertCircle, Receipt } from 'lucide-react';

const StudentFines: React.FC = () => {
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/profile').then(res => {
      setFines(res.data.fines);
      setLoading(false);
    });
  }, []);

  const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-24 bg-brand-bg min-h-screen text-slate-300">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">PENALTY LEDGER</h2>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">ACCOUNTABILITY LOG FOR SESSION VIOLATIONS</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AGGREGATE DUES</p>
          <p className="text-4xl font-black text-red-500 italic">₹{totalAmount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fines.map((fine, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={fine._id}
            className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl flex items-center gap-6 group hover:border-red-500/30 transition-all"
          >
            <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 shadow-inner group-hover:scale-110 transition-transform">
              <AlertCircle size={28} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-black text-slate-200 uppercase tracking-tight italic">
                    MISSED {fine.mealType} SESSION
                  </h4>
                  <p className="text-xs text-brand-primary font-mono font-bold mt-1 uppercase tracking-widest">{fine.date}</p>
                </div>
                <p className="text-2xl font-black text-white group-hover:text-red-500 transition-colors italic">₹{fine.amount}</p>
              </div>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium italic opacity-80 border-t border-brand-border/50 pt-4">
                "{fine.reason}"
              </p>
            </div>
          </motion.div>
        ))}
        {fines.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-card p-20 rounded-[3rem] border border-brand-border flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-brand-primary/[0.02]" />
            <div className="bg-brand-bg border border-brand-border text-green-500 p-6 rounded-3xl shadow-inner relative z-10">
              <Receipt size={48} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">CLEAR RECORD</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">NO ACTIVE SESSION VIOLATIONS DETECTED</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentFines;
