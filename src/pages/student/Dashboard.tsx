import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { motion } from 'motion/react';
import { Utensils, AlertTriangle, CheckCircle2, XCircle, Info, Calendar } from 'lucide-react';

interface MealStatus {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'registered' | 'attended' | 'fined' | 'not-registered';
  deadline: string;
}

const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchDashboardData = async () => {
    try {
      const [profileRes, todayRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/meals/today')
      ]);
      setProfile(profileRes.data);
      setTodayMeals(todayRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const registerMeal = async (mealType: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.post('/meals/register', { mealType, date: today });
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const getMealStatus = (type: 'breakfast' | 'lunch' | 'dinner'): MealStatus => {
    const reg = todayMeals.find(m => m.mealType === type);
    let deadline = '';
    if (type === 'breakfast') deadline = '9 PM (Prev Day)';
    if (type === 'lunch') deadline = '9 AM Today';
    if (type === 'dinner') deadline = '4 PM Today';

    return {
      mealType: type,
      status: reg ? reg.status : 'not-registered',
      deadline
    };
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const totalFines = profile?.fines?.reduce((sum: number, f: any) => sum + f.amount, 0) || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 pb-24 bg-brand-bg min-h-screen text-slate-300">
      {/* Bio Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-card border border-brand-border rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
      >
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">{user.name}</h2>
            <p className="text-brand-primary font-mono text-sm font-black tracking-[0.2em] mt-2">{profile?.student?.registerNumber}</p>
            <div className="flex gap-4 mt-6">
              <span className="px-5 py-1.5 bg-brand-bg border border-brand-border rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                {profile?.student?.messType} Resident
              </span>
            </div>
          </div>
          <div className="bg-brand-bg/50 border border-brand-border p-4 rounded-2xl text-brand-primary shadow-inner">
            <Calendar size={32} />
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 text-brand-primary opacity-[0.03] group-hover:opacity-10 transition-all pointer-events-none">
          <Utensils size={240} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-brand-card p-8 rounded-[2rem] border border-brand-border shadow-xl flex items-center gap-6">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 shadow-inner">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accumulated Fines</p>
            <p className="text-3xl font-black text-white italic">₹{totalFines}</p>
          </div>
        </div>
        <div className="bg-brand-card p-8 rounded-[2rem] border border-brand-border shadow-xl flex items-center gap-6">
          <div className="bg-brand-primary/10 text-brand-primary p-4 rounded-2xl border border-brand-primary/20 shadow-inner">
            <Info size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Requests</p>
            <p className="text-3xl font-black text-white italic">{todayMeals.length} Sessions</p>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
          <Utensils size={24} className="text-brand-primary" />
          SESSION STATUS // TODAY
        </h3>
        
        <div className="space-y-4">
          {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
            const status = getMealStatus(type);
            return (
              <motion.div 
                key={type}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-brand-card p-7 rounded-[2rem] border border-brand-border shadow-xl flex items-center justify-between group transition-all hover:border-brand-primary/30"
              >
                <div>
                  <h4 className="font-black text-xl uppercase italic text-slate-200 group-hover:text-white transition-colors">{type}</h4>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">
                    DEADLINE: {status.deadline}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {status.status === 'not-registered' ? (
                    <button
                      onClick={() => registerMeal(type)}
                      className="px-8 py-3 bg-brand-primary text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 transition-all italic underline-offset-4"
                    >
                      REQUEST PASS
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {status.status === 'attended' ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={16} /> VERIFIED
                        </div>
                      ) : status.status === 'fined' ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                          <XCircle size={16} /> PENALIZED
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> REGISTERED
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
