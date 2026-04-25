import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Search, Edit2, Trash2, X, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', registerNumber: '', email: '', messType: 'veg' });
  const [showQR, setShowQR] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentStudent) {
        await api.put(`/admin/students/${currentStudent._id}`, formData);
      } else {
        await api.post('/admin/register-student', formData);
      }
      setShowModal(false);
      fetchStudents();
      setFormData({ name: '', registerNumber: '', email: '', messType: 'veg' });
      setCurrentStudent(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const deleteStudent = async (id: string) => {
    if (confirm('Deactivate this student?')) {
      await api.delete(`/admin/students/${id}`);
      fetchStudents();
    }
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.registerNumber.includes(search)
  ).sort((a, b) => a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Students...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 bg-brand-bg min-h-screen pb-24 text-slate-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">STUDENT DIRECTORY</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Manage and monitor all hostel residents</p>
        </div>
        <button
          onClick={() => { setCurrentStudent(null); setFormData({ name: '', registerNumber: '', email: '', messType: 'veg' }); setShowModal(true); }}
          className="bg-brand-primary text-black px-8 py-4 rounded-2xl font-black italic flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)]"
        >
          <UserPlus size={20} />
          REGISTER RESIDENT
        </button>
      </div>

      <div className="relative max-w-md group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by name or register number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-brand-card border border-brand-border rounded-[1.5rem] text-white shadow-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 transition-all placeholder:text-slate-600"
        />
      </div>

      <div className="bg-brand-card rounded-[2.5rem] shadow-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resident</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Reg No</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mess Plan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {filtered.map(student => (
                <tr key={student._id} className="hover:bg-brand-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{student.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-sm text-brand-primary/80">{student.registerNumber}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${student.messType === 'veg' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
                      {student.messType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {student.isActive ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/5 text-[10px] font-bold text-green-500 uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-500/5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                       <button onClick={() => setShowQR(student.qrToken)} className="p-2.5 bg-brand-bg border border-brand-border text-slate-400 rounded-xl hover:text-brand-primary hover:border-brand-primary/50 transition-all">
                        <QrCode size={18} />
                      </button>
                      <button onClick={() => { setCurrentStudent(student); setFormData({ name: student.name, registerNumber: student.registerNumber, email: student.email, messType: student.messType }); setShowModal(true); }} className="p-2.5 bg-brand-bg border border-brand-border text-slate-400 rounded-xl hover:text-white hover:border-slate-500 transition-all">
                        <Edit2 size={18} />
                      </button>
                      {student.isActive && (
                        <button onClick={() => deleteStudent(student._id)} className="p-2.5 bg-brand-bg border border-brand-border text-slate-500 rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-brand-card w-full max-w-md rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden border border-brand-border"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 bg-brand-bg border border-brand-border rounded-full text-slate-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-brand-primary mb-8 italic uppercase tracking-tighter">
                {currentStudent ? 'Update Resident' : 'New Resident'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-700"
                    placeholder="Enter student name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Register Number</label>
                  <input
                    type="text"
                    required
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                    className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-700 font-mono"
                    placeholder="e.g. 2024CS001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none transition-all placeholder:text-slate-700"
                    placeholder="student@college.edu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mess Plan</label>
                  <select
                    value={formData.messType}
                    onChange={(e) => setFormData({ ...formData, messType: e.target.value })}
                    className="w-full px-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 outline-none appearance-none font-bold italic"
                  >
                    <option value="veg" className="bg-brand-card">Vegetarian Plan</option>
                    <option value="nonveg" className="bg-brand-card">Non-Vegetarian Plan</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-brand-primary text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] mt-4 italic"
                >
                  {currentStudent ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showQR && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/90 backdrop-blur-2xl" onClick={() => setShowQR(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col items-center gap-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 bg-white rounded-3xl">
                <QRCodeSVG value={showQR} size={256} level="H" includeMargin={false} />
              </div>
              <div className="text-center">
                <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-1">Passkey Token</p>
                <p className="font-mono text-sm text-slate-900 font-bold">{showQR}</p>
              </div>
              <button 
                onClick={() => setShowQR(null)}
                className="px-12 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
              >
                DISMISS
              </button>
            </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStudents;
