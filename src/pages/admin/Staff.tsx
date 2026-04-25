import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Trash2, Shield, X, Mail, User } from 'lucide-react';

const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff');
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/register-staff', formData);
      setShowModal(false);
      setFormData({ name: '', email: '' });
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register staff');
    }
  };

  const removeStaff = async (id: string) => {
    if (confirm('Remove this staff member?')) {
      await api.delete(`/admin/staff/${id}`);
      fetchStaff();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Staff...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 bg-brand-bg min-h-screen pb-24 text-slate-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">STAFF MANAGEMENT</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">Add or remove administrative personnel</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-primary text-black px-8 py-4 rounded-2xl font-black italic flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] uppercase tracking-widest text-xs"
        >
          <UserPlus size={20} />
          ADD STAFF MEMBER
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {staff.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={member._id}
            className="bg-brand-card p-8 rounded-[2.5rem] border border-brand-border shadow-2xl flex items-center justify-between group hover:border-brand-primary/20 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-bg border border-brand-border text-brand-primary rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-inner">
                {member.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-200 uppercase tracking-tight leading-none italic">{member.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-2">{member.email}</p>
                <div className="flex items-center gap-2 mt-3 p-1.5 px-3 bg-brand-primary/10 rounded-lg text-[9px] font-black uppercase text-brand-primary tracking-widest w-fit border border-brand-primary/20">
                  <Shield size={10} /> System Administrator
                </div>
              </div>
            </div>
            
            <button
              onClick={() => removeStaff(member._id)}
              className="p-4 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/30"
            >
              <Trash2 size={24} />
            </button>
          </motion.div>
        ))}
        {staff.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-brand-border rounded-[3rem]">
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No registered staff directory found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-xl">
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-brand-card w-full max-w-md rounded-[3rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative border border-brand-border"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 bg-brand-bg border border-brand-border rounded-full text-slate-500 hover:text-white transition-all shadow-xl"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-brand-primary mb-10 italic uppercase tracking-tighter">NEW STAFF MEMBER</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 font-bold transition-all placeholder:text-slate-700"
                      placeholder="Enter legal name"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Enterprise Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 bg-brand-bg border border-brand-border rounded-2xl text-white outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/50 font-bold transition-all placeholder:text-slate-700"
                      placeholder="admin@college.edu"
                    />
                  </div>
                </div>

                <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                  <p className="text-[10px] font-black text-brand-primary leading-relaxed uppercase tracking-[0.2em] text-center">
                    TEMPORARY PASSCODE: <span className="text-white italic">hostel2026</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-brand-primary text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] italic"
                >
                  Confirm Registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStaff;
