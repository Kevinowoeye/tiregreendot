import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { GreendotLogo } from '../ui/GreendotLogo';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface AdminLoginProps {
  onSuccess?: () => void;
  onBackToPublic?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginProps> = ({ onSuccess, onBackToPublic }) => {
  const { login, loginAsAdmin } = useBank();
  const [email, setEmail] = useState('kevinowoeye@gmail.com');
  const [password, setPassword] = useState('Personal@01');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = login(email.trim(), password);
      if (res.success && res.user?.role === 'admin') {
        if (onSuccess) onSuccess();
      } else if (res.success && res.user?.role !== 'admin') {
        setErrorMsg('Access denied: Provided account does not have administrator clearance.');
      } else {
        setErrorMsg(res.message || 'Administrator authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      setErrorMsg(err.message || 'System authentication error encountered. Try direct admin bypass.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantBypass = () => {
    try {
      loginAsAdmin();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Bypass error:', err);
      setErrorMsg('Bypass failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#131b2c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <GreendotLogo variant="light" size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank Administrator Gateway</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
            Administrative Sign In
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Authorized personnel only. Access to treasury, customer records, and platform governance.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-700/60 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Administrator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@greendot.com"
              className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 pr-10 bg-slate-900/90 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Bypass */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleInstantBypass}
            className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>1-Click Verified Admin Bypass (Kevin Owoeye)</span>
          </button>
        </div>

        {/* Return to Public Website */}
        {onBackToPublic && (
          <div className="text-center pt-2">
            <button
              onClick={onBackToPublic}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Banking Portal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminLogin: React.FC<AdminLoginProps> = (props) => (
  <ErrorBoundary fallbackTitle="Admin Login Error" fallbackMessage="The administrator authentication interface encountered a runtime error.">
    <AdminLoginForm {...props} />
  </ErrorBoundary>
);
