import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, QrCode, ClipboardList, AlertCircle, User, LogOut, ScanLine, Users, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isStudent = user.role === 'student';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-card/80 backdrop-blur-xl border-t border-brand-border z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] md:shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="hidden md:flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black bg-brand-primary shadow-[0_0_20px_rgba(245,158,11,0.3)] italic">
                <Home size={22} />
             </div>
             <span className="font-black italic tracking-tighter text-white border-r border-brand-border pr-6 mr-2 uppercase text-lg">MESS // OS</span>
          </div>

          <div className="flex flex-1 justify-around md:justify-start md:gap-10 overflow-x-auto no-scrollbar py-2">
            {isStudent ? (
              <>
                <NavLink to="/student/dashboard" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <Home size={22} /> <span className="hidden md:inline">Console</span>
                </NavLink>
                <NavLink to="/student/qr" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <QrCode size={22} /> <span className="hidden md:inline">Passkey</span>
                </NavLink>
                <NavLink to="/student/meals" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <ClipboardList size={22} /> <span className="hidden md:inline">Registry</span>
                </NavLink>
                <NavLink to="/student/fines" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <AlertCircle size={22} /> <span className="hidden md:inline">Ledger</span>
                </NavLink>
                <NavLink to="/student/profile" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <User size={22} /> <span className="hidden md:inline">Identity</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <Home size={22} /> <span className="hidden md:inline">Command</span>
                </NavLink>
                <NavLink to="/admin/scan" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <ScanLine size={22} /> <span className="hidden md:inline">Scanner</span>
                </NavLink>
                <NavLink to="/admin/students" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <Users size={22} /> <span className="hidden md:inline">Directory</span>
                </NavLink>
                <NavLink to="/admin/logs" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <ClipboardList size={22} /> <span className="hidden md:inline">Audit</span>
                </NavLink>
                <NavLink to="/admin/fines" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                  <AlertCircle size={22} /> <span className="hidden md:inline">Penalties</span>
                </NavLink>
                {user.role === 'superadmin' && (
                  <NavLink to="/admin/staff" className={({ isActive }) => `flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${isActive ? 'text-brand-primary italic' : 'text-slate-500'}`}>
                    <Shield size={22} /> <span className="hidden md:inline">Staff</span>
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
             <button onClick={handleLogout} className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl transition-all group">
               <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
