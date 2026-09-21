import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { UserCheck, ShieldCheck, UserPlus, Download, AlertTriangle, ChevronDown } from 'lucide-react';
import { ExportDeployModal } from './ExportDeployModal';

interface QuickRoleSwitcherProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ currentView, onNavigate }) => {
  const { state, currentUser, switchUser, updateSettings } = useBank();
  const [showExport, setShowExport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const customers = state.profiles.filter((p) => p.role === 'customer');
  const admin = state.profiles.find((p) => p.role === 'admin');

  return (
    <>
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-40 relative">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Bank Operations Console:
          </span>

          {/* Active persona indicator */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-white px-2.5 py-1 rounded border border-slate-700 text-xs font-medium transition-colors"
            >
              <span>
                {currentUser?.role === 'admin'
                  ? '🛡️ Admin Portal'
                  : currentUser
                  ? `👤 ${currentUser.fullName} (${currentUser.status})`
                  : '🌐 Guest / Public'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select User Persona
                </div>
                {admin && (
                  <button
                    onClick={() => {
                      switchUser(admin.userId);
                      onNavigate('admin');
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 ${
                      currentUser?.userId === admin.userId ? 'text-emerald-400 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Administrator
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                      ADMIN
                    </span>
                  </button>
                )}
                <div className="border-t border-slate-700 my-1"></div>
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Customer Accounts
                </div>
                {customers.map((c) => (
                  <button
                    key={c.userId}
                    onClick={() => {
                      switchUser(c.userId);
                      if (c.status === 'pending_activation') {
                        onNavigate('activate-account');
                      } else {
                        onNavigate('dashboard');
                      }
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 ${
                      currentUser?.userId === c.userId ? 'text-emerald-400 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {c.fullName}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        c.status === 'active'
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : c.status === 'pending_activation'
                          ? 'bg-amber-900/60 text-amber-300'
                          : 'bg-red-900/60 text-red-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick jump navigation shortcuts */}
          <div className="hidden md:flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <button
              onClick={() => onNavigate('home')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentView === 'home' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Public Website
            </button>
            <button
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  const cust = customers[0];
                  if (cust) switchUser(cust.userId);
                }
                onNavigate('dashboard');
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentView === 'dashboard' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Customer Banking
            </button>
            <button
              onClick={() => {
                if (admin) switchUser(admin.userId);
                onNavigate('admin');
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentView === 'admin' ? 'bg-emerald-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Right side: Deploy / Export & Mode toggles */}
        <div className="flex items-center gap-2">
          {state.appSettings.maintenance_mode && (
            <span className="bg-amber-900/80 text-amber-300 border border-amber-700 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Maintenance ON
            </span>
          )}
          {state.appSettings.lockdown_mode && (
            <span className="bg-red-900/80 text-red-300 border border-red-700 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Lockdown ON
            </span>
          )}
          <button
            onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3 h-3" />
            Download &amp; Deploy
          </button>
        </div>
      </div>

      <ExportDeployModal isOpen={showExport} onClose={() => setShowExport(false)} />
    </>
  );
};
