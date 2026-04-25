import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { Filter, FileDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminMealLog: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    mealType: '' 
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters);
      const res = await api.get(`/admin/meal-log?${query.toString()}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const exportCSV = () => {
    const headers = ['Student Name', 'Reg No', 'Meal', 'Status', 'Scanned Time'];
    const rows = logs.map(l => [
      l.studentId?.name || 'Unknown',
      l.studentId?.registerNumber || 'N/A',
      l.mealType,
      l.status,
      l.scannedAt ? new Date(l.scannedAt).toLocaleString() : '-'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `meal_log_${filters.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-brand-bg min-h-screen pb-24 text-slate-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">MEAL ATTENDANCE LOG</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Daily record of meal registrations and scans</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-brand-primary text-black px-8 py-4 rounded-2xl font-black italic flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] uppercase tracking-widest text-xs"
        >
          <FileDown size={20} />
          EXPORT DATA
        </button>
      </div>

      <div className="bg-brand-card p-10 rounded-[3rem] border border-brand-border shadow-2xl flex flex-wrap gap-8 items-end">
        <div className="space-y-2.5 flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Archive Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all color-scheme-dark"
          />
        </div>
        <div className="space-y-2.5 flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Session Type</label>
          <select
            value={filters.mealType}
            onChange={(e) => setFilters({ ...filters, mealType: e.target.value })}
            className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white font-bold italic outline-none appearance-none cursor-pointer"
          >
            <option value="" className="bg-brand-card">All Sessions</option>
            <option value="breakfast" className="bg-brand-card">Breakfast</option>
            <option value="lunch" className="bg-brand-card">Lunch</option>
            <option value="dinner" className="bg-brand-card">Dinner</option>
          </select>
        </div>
        <button onClick={fetchLogs} className="p-4 bg-brand-bg border border-brand-border text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-black transition-all shadow-inner">
          <Filter size={24} />
        </button>
      </div>

      <div className="bg-brand-card rounded-[2.5rem] shadow-2xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="p-32 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing database logs</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-bg/50 border-b border-brand-border">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resident</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Session</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registration</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {logs.map((log, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: idx * 0.02 }}
                    key={log._id} 
                    className="hover:bg-brand-primary/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{log.studentId?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500 font-mono italic">{log.studentId?.registerNumber}</p>
                    </td>
                    <td className="px-8 py-6 capitalize font-black text-brand-primary italic text-xs tracking-widest">{log.mealType}</td>
                    <td className="px-8 py-6 text-slate-500 text-xs font-mono">
                      {new Date(log.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-6">
                      {log.status === 'attended' ? (
                        <div className="flex items-center gap-2 text-green-500 font-black text-[10px] bg-green-500/5 px-4 py-1.5 rounded-lg border border-green-500/10 uppercase tracking-widest w-fit">
                          <CheckCircle2 size={12} /> SCANNED
                        </div>
                      ) : log.status === 'fined' ? (
                        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] bg-red-500/5 px-4 py-1.5 rounded-lg border border-red-500/10 uppercase tracking-widest w-fit">
                          <AlertCircle size={12} /> FINED
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] bg-brand-primary/5 px-4 py-1.5 rounded-lg border border-brand-primary/10 uppercase tracking-widest w-fit">
                          <Clock size={12} /> PENDING
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-xs font-mono text-slate-600">
                      {log.scannedAt ? new Date(log.scannedAt).toLocaleTimeString() : '--:--:--'}
                    </td>
                  </motion.tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">No transaction records found for this period</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMealLog;
