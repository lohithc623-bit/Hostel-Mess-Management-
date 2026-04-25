import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const StudentMeals: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/meals/my-registrations').then(res => {
      setHistory(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-24 bg-brand-bg min-h-screen text-slate-300">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">MEAL PASS REGISTRY</h2>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">LIFECYCLE AUDIT OF YOUR SESSION VERIFICATIONS</p>
      </div>
      
      <div className="bg-brand-card rounded-[2.5rem] shadow-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">CALENDAR DATE</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">SESSION</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">VERIFICATION STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {history.map((reg, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={reg._id} 
                  className="hover:bg-brand-primary/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6 text-slate-300 font-mono text-xs">{reg.date}</td>
                  <td className="px-8 py-6 text-brand-primary capitalize font-black italic tracking-widest text-xs uppercase">{reg.mealType}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      {reg.status === 'attended' ? (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={12} /> AUTHENTICATED
                        </div>
                      ) : reg.status === 'fined' ? (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <XCircle size={12} /> VIOLATION
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <Clock size={12} /> AUTHORIZED
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-24 text-center">
                    <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">No transaction history found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentMeals;
