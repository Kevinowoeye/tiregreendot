import React, { useState } from 'react';
import { Wrench, ShieldAlert, Lock, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { GreendotLogo } from '../ui/GreendotLogo';

export const MaintenancePage: React.FC<{ onBypass: () => void }> = ({ onBypass }) => {
  const { state } = useBank();
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-[#162032] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold">We'll Be Right Back</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {state.appSettings.bank_name || 'Greendot Bank'} is currently undergoing scheduled system maintenance to enhance infrastructure security and performance. All customer funds remain secure.
          </p>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] text-slate-400 font-mono">
          Estimated Completion: 45 minutes &bull; Status: In Progress
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <a
            href="/admin-access"
            className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Admin Bypass Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export const LockdownPage: React.FC<{ onBypass: () => void }> = ({ onBypass }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-[#162032] border border-red-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-red-400">System Security Lockdown</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Emergency security protocol is active. Greendot Bank servers have temporarily restricted public transactional access pending threat neutralization.
          </p>
        </div>

        <div className="p-4 bg-slate-900 rounded-2xl border border-red-500/20 text-[11px] text-red-300 font-mono">
          Security Incident Code: SEC-LOCK-992 &bull; Authorized personnel only.
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <a
            href="/admin-access"
            className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Admin Emergency Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            Re-Verify Clearance
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminAccessBypass: React.FC<{ onSuccessfulLogin: () => void }> = ({ onSuccessfulLogin }) => {
  const { login } = useBank();
  const [email, setEmail] = useState('kevinowoeye@gmail.com');
  const [password, setPassword] = useState('Personal@01');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success && res.user?.role === 'admin') {
      onSuccessfulLogin();
      window.location.href = '/admin';
    } else {
      setErrorMsg(res.message || 'Administrator authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#162032] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <GreendotLogo />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Emergency Bypass</h1>
          <p className="text-xs text-slate-400">
            Log in with administrator credentials to override maintenance mode or security lockdown.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Administrator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400">Admin Password / Secret Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Authenticate &amp; Bypass Systems</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-slate-400 hover:text-white underline">
            Return to Public Home
          </a>
        </div>
      </div>
    </div>
  );
};
