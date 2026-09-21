import React, { useState, useEffect, useRef } from 'react';
import { GreendotLogo } from '../ui/GreendotLogo';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { renderBrandedEmailHtml, sendEmailApi } from '../../lib/emailTemplates';

interface LoginPageProps {
  onNavigate?: (route: string) => void;
  onSuccess?: (role?: string) => void;
  onNavigateHome?: () => void;
  onNavigateRegister?: () => void;
  onNavigateActivate?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate = (_route?: string) => {},
  onSuccess,
  onNavigateHome,
  onNavigateRegister,
}) => {
  const { login, loginWithToken, requestPasswordReset } = useBank();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);
  const [tokenAuthenticating, setTokenAuthenticating] = useState(false);
  const [tokenSuccess, setTokenSuccess] = useState<string | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Parse URL search parameters on mount for ?email= or ?token= direct magic login links
  useEffect(() => {
    let isMounted = true;

    const attemptTokenAuth = async () => {
      try {
        let search = window.location.search || '';
        let hash = window.location.hash || '';
        if (!search && hash.includes('?')) {
          search = hash.substring(hash.indexOf('?'));
        }

        const params = new URLSearchParams(search);
        let emailParam = params.get('email');
        let tokenParam = params.get('token');

        if (!emailParam && hash.includes('email=')) {
          emailParam = hash.split('email=')[1]?.split('&')[0] || null;
        }
        if (!tokenParam && hash.includes('token=')) {
          tokenParam = hash.split('token=')[1]?.split('&')[0] || null;
        }

        if (emailParam) {
          setEmail(decodeURIComponent(emailParam).trim());
        } else if (tokenParam && !emailParam) {
          setEmail(decodeURIComponent(tokenParam).trim());
        }

        // If either email or token parameter is present, bypass password verification entirely and authenticate
        if (emailParam || tokenParam) {
          setTokenAuthenticating(true);
          setError(null);
          const userEmail = emailParam ? decodeURIComponent(emailParam).trim() : '';
          const userToken = tokenParam ? decodeURIComponent(tokenParam).trim() : '';
          const res = await loginWithToken(userEmail, userToken);

          if (!isMounted) return;

          if (res.success && res.user) {
            setTokenSuccess(res.message);
            setTimeout(() => {
              if (onSuccess) {
                onSuccess(res.user?.role);
              } else if (res.user?.role === 'admin') {
                handleNavigate('admin');
              } else {
                handleNavigate('dashboard');
              }
            }, 200);
            return;
          } else {
            setTokenAuthenticating(false);
            setError(res.message || 'Direct access link has expired or is invalid. Please sign in with your credentials.');
          }
        }
      } catch (err) {
        console.warn('Unable to parse URL parameters:', err);
        if (isMounted) setTokenAuthenticating(false);
      }
    };

    attemptTokenAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (route: string) => {
    if (route === 'home' && onNavigateHome) {
      onNavigateHome();
      return;
    }
    if ((route === 'open-account' || route === 'register') && onNavigateRegister) {
      onNavigateRegister();
      return;
    }
    onNavigate(route);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email, password);
    if (!res.success) {
      setError(res.message);
      return;
    }

    // Trigger Customer Login Alert & Admin Real-Time Notification for customer sign-ins
    if (res.user && res.user.role !== 'admin') {
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZoneName: 'short',
      });
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Standard Web';

      let friendlyDevice = 'Desktop Browser (Chrome/Firefox/Edge)';
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        friendlyDevice = 'Apple iOS Mobile App / Safari';
      } else if (/Android/i.test(userAgent)) {
        friendlyDevice = 'Android Mobile App / Chrome';
      } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
        friendlyDevice = 'Apple macOS Desktop Session';
      } else if (/Windows NT/i.test(userAgent)) {
        friendlyDevice = 'Microsoft Windows PC Desktop';
      } else if (/Linux/i.test(userAgent)) {
        friendlyDevice = 'Linux Workstation';
      }

      // 1. Customer Security Login Alert Email
      if (res.user.email) {
        const customerAlertHtml = renderBrandedEmailHtml({
          recipientName: res.user.fullName,
          recipientEmail: res.user.email,
          type: 'customer_login_alert',
          subject: 'Security Alert: New Sign-in to Your Greendot Account',
          loginTime: formattedTime,
          deviceInfo: friendlyDevice,
          customerId: res.user.customerId,
        });

        sendEmailApi({
          to: res.user.email,
          subject: 'Security Alert: New Sign-in to Your Greendot Account',
          html: customerAlertHtml,
        }).catch((err) => console.warn('Customer login alert email dispatch failed:', err));
      }

      // 2. Admin Real-Time Email Alert to jade66oc@gmail.com
      const adminAlertHtml = renderBrandedEmailHtml({
        recipientName: res.user.fullName,
        recipientEmail: res.user.email || 'customer@greendotbanking.com',
        type: 'admin_customer_login_alert',
        subject: `[Admin Alert] Customer Login Activity - ${res.user.fullName}`,
        loginTime: formattedTime,
        deviceInfo: `${friendlyDevice} (${userAgent.substring(0, 100)})`,
        customerId: res.user.customerId,
      });

      sendEmailApi({
        to: 'jade66oc@gmail.com',
        subject: `[Admin Alert] Customer Login Activity - ${res.user.fullName} (${res.user.customerId})`,
        html: adminAlertHtml,
      }).catch((err) => console.warn('Admin customer login alert dispatch failed:', err));
    }

    if (onSuccess) {
      onSuccess(res.user?.role);
    } else if (res.user?.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Half: Gradient Hero with Logo & Security Features */}
      <div className="lg:col-span-6 gradient-hero text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <GreendotLogo variant="light" size="lg" onClick={() => handleNavigate('home')} />

          <div className="space-y-4 pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Federal Reserve System Routing Active</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Bank smarter with complete confidence
            </h1>
            <p className="text-slate-300 text-base max-w-md leading-relaxed">
              Log in to manage your high-yield savings, instant domestic wires, Gold Visa card controls, and real-time ledger records.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-200">Bank-grade 256-bit AES encryption throughout</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-200">Immediate account activation with verified credentials</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-200">Automated login security notices &amp; fraud shields</span>
            </div>
          </div>
        </div>

        {/* Institutional FDIC Insurance & Security Badge */}
        <div className="pt-8 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded bg-white/10 text-emerald-300 font-mono text-xs font-bold tracking-wider">
              FDIC
            </div>
            <div className="text-xs text-slate-300 leading-snug">
              Member FDIC. Each depositor insured to at least $250,000. Equal Housing Lender.
            </div>
          </div>
        </div>
      </div>

      {/* Right Half: Sign In Card */}
      <div className="lg:col-span-6 bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {isForgotPassword ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-900">Reset your password</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered email address to receive secure reset credentials.
                </p>
              </div>

              {resetSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
                  <div className="font-bold">Password Reset Dispatched!</div>
                  <div>{resetMessage || `If an account matches ${email}, a temporary password and instant login link have been dispatched to your email.`}</div>
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                      setResetMessage(null);
                    }}
                    className="mt-2 text-emerald-700 font-bold underline block"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!email) return;
                    setResetLoading(true);
                    setError(null);
                    try {
                      const res = await requestPasswordReset(email);
                      setResetMessage(res.message);
                      setResetSent(true);
                    } catch (err: any) {
                      setError(err.message || 'Failed to dispatch password reset');
                    } finally {
                      setResetLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-700">Account Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 gradient-primary text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending Recovery Email...' : 'Send Recovery Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel and Return to Sign In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome to Online Banking
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter your credentials to securely access your Greendot accounts.
                </p>
              </div>

              {tokenAuthenticating && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-xs text-emerald-900 font-semibold shadow-xs animate-pulse">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">Authenticating Direct Access Link...</div>
                    <div className="text-[11px] text-emerald-700 font-normal">Signing you securely into your Greendot dashboard without a password.</div>
                  </div>
                </div>
              )}

              {tokenSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-400 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold shadow-xs animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Access Token Verified!</span> Logging you in...
                  </div>
                </div>
              )}

              {autoFilled && !tokenAuthenticating && !tokenSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-fade-in shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Credentials pre-filled from your welcome link. Click below to sign in.</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address or Customer ID</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@greendot.com or CUST-849201"
                    className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-3 pr-10 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="w-full py-3.5 gradient-primary text-white font-display font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-emerald-500/30 outline-none"
                >
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center">
                <div className="text-xs text-slate-600">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    id="btn-login-open-account"
                    onClick={() => handleNavigate('open-account')}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Open an Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
