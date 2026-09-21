import React, { useState, useEffect } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { isSupabaseConfigured, supabaseDb } from './lib/supabase';
import { Profile } from './types';
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './components/public/HomePage';
import {
  AboutPage,
  LoansPage,
  InvestmentsPage,
  CareersPage,
  FaqPage,
  ContactPage,
  OpenAccountPage,
  ActivateAccountPage,
} from './components/public/OtherPublicPages';
import { MaintenancePage, LockdownPage, AdminAccessBypass } from './components/public/SpecialSystemPages';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CustomerTransfer } from './components/dashboard/CustomerTransfer';
import { CustomerTransactions } from './components/dashboard/CustomerTransactions';
import { CustomerCards, CustomerBeneficiaries } from './components/dashboard/CustomerCards';
import { CustomerBillPay } from './components/dashboard/CustomerBillPay';
import { CustomerRecharge } from './components/dashboard/CustomerRecharge';
import { CustomerLoans } from './components/dashboard/CustomerLoans';
import { CustomerSupportCenter } from './components/dashboard/CustomerSupportCenter';
import { CustomerProfileSecurity } from './components/dashboard/CustomerProfileSecurity';
import { CustomerCheckDeposit } from './components/dashboard/CustomerCheckDeposit';
import { CustomerStatements } from './components/dashboard/CustomerStatements';
import { PwaInstallPrompt } from './components/ui/PwaInstallPrompt';
import {
  HowToGetCardView,
  HowToUpgradeView,
  NotificationsView,
} from './components/dashboard/SpecialStatusViews';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLogin } from './components/admin/AdminLogin';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ExportDeployModal } from './components/export/ExportDeployModal';
import { ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const BankAppInner: React.FC = () => {
  const { currentUser, currentRole, switchCustomer, loginAsAdmin, state, logout, isLoadingAuth } = useBank();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Read initial route from URL path, search query, or hash to prevent blank screens on direct navigation
  const getInitialPage = (): string => {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase().replace('#', '');
      
      if (path.includes('/admin-login') || path.includes('/admin/login') || hash.includes('admin-login')) {
        return 'admin-login';
      }
      if (path.includes('/admin-access') || hash.includes('admin-access')) {
        return 'admin-access';
      }
      if (path.includes('/admin') || hash.includes('admin')) {
        return 'admin';
      }
      if (path.includes('/login') || hash.includes('login') || search.includes('token=') || search.includes('email=') || search.includes('autologin=')) {
        return 'login';
      }
      if (path.includes('/open-account') || hash.includes('open-account')) {
        return 'open-account';
      }
      if (path.includes('/activate') || hash.includes('activate')) {
        return 'activate';
      }
      if (path.includes('/dashboard') || hash.includes('dashboard')) {
        return 'dashboard';
      }
    } catch {
      // ignore
    }
    return 'home';
  };

  const [page, setPage] = useState<string>(getInitialPage);
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Sync with browser hash/popstate changes
  useEffect(() => {
    const handleRouteChange = () => {
      const p = getInitialPage();
      if (p !== 'home' || window.location.hash || window.location.search) {
        setPage(p);
      }
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Auto-login link handler supporting ?token=..., ?email=..., ?autologin=... with session clearing & Supabase query
  useEffect(() => {
    const handleAutoLogin = async () => {
      try {
        let search = window.location.search || '';
        let hash = window.location.hash || '';
        if (!search && hash.includes('?')) {
          search = hash.substring(hash.indexOf('?'));
        }
        if (!search && !hash) return;

        const params = new URLSearchParams(search);
        const tokenParam = params.get('token') || (hash.includes('token=') ? hash.split('token=')[1]?.split('&')[0] : null);
        const emailParam = params.get('email') || (hash.includes('email=') ? hash.split('email=')[1]?.split('&')[0] : null);
        const autologinParam = params.get('autologin') || (hash.includes('autologin=') ? hash.split('autologin=')[1]?.split('&')[0] : null);

        if (!tokenParam && !emailParam && !autologinParam) return;

        const cleanEmail = emailParam ? decodeURIComponent(emailParam).trim().toLowerCase() : '';
        const cleanToken = tokenParam ? decodeURIComponent(tokenParam).trim() : (autologinParam ? decodeURIComponent(autologinParam).trim() : '');

        // 1. Clear existing cached session data BEFORE loading the new user so old session data never leaks
        try {
          localStorage.removeItem('greendot_bank_state_v1');
          sessionStorage.clear();
        } catch (e) {
          console.warn('Session clear note:', e);
        }

        // 2. Query Supabase explicitly for the user profile matching the email/token in the link
        let dbProfiles: Profile[] = [];
        if (isSupabaseConfigured) {
          try {
            dbProfiles = await supabaseDb.getTable<Profile>('profiles');
          } catch (err) {
            console.warn('Supabase query during auto-login failed:', err);
          }
        }

        const candidateProfiles = dbProfiles.length > 0 ? dbProfiles : state.profiles;
        let found: Profile | null = null;

        if (cleanEmail && cleanToken) {
          found = candidateProfiles.find((p) => {
            const matchesEmail = (p?.email || '').toLowerCase() === cleanEmail;
            if (!matchesEmail) return false;
            const matchesToken =
              (p.loginToken && p.loginToken === cleanToken) ||
              (p?.customerId || '').toLowerCase() === cleanToken.toLowerCase() ||
              p.userId === cleanToken ||
              (p as any)?.id === cleanToken ||
              (cleanToken.startsWith('gdt_') && cleanToken.includes((p?.customerId || '').toLowerCase().replace(/[^a-z0-9]/g, '')));
            return matchesToken;
          }) || null;

          if (!found) {
            found = candidateProfiles.find((p) => (p?.email || '').toLowerCase() === cleanEmail) || null;
          }
        } else if (cleanEmail) {
          found = candidateProfiles.find((p) => (p?.email || '').toLowerCase() === cleanEmail) || null;
        } else if (cleanToken) {
          found = candidateProfiles.find(
            (p) =>
              (p.loginToken && p.loginToken === cleanToken) ||
              (p?.customerId || '').toLowerCase() === cleanToken.toLowerCase() ||
              p.userId === cleanToken ||
              (p as any)?.id === cleanToken ||
              (cleanToken.startsWith('gdt_') && cleanToken.includes((p?.customerId || '').toLowerCase().replace(/[^a-z0-9]/g, '')))
          ) || null;
        }

        // 3. Immediately set that specific user object into active state before redirecting to dashboard
        if (found) {
          switchCustomer(found.userId);
          setPage('dashboard');
          window.location.hash = '#dashboard';

          // Clean query parameters so token is not lingering in address bar
          try {
            window.history.replaceState({}, document.title, window.location.pathname + '#dashboard');
          } catch (e) {}

          const customerName = found.fullName || (found as any)?.name || 'Valued Customer';
          setToastMessage(`Welcome back, ${customerName}!`);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } else {
          console.warn('Auto-login: invalid token or email parameter, redirecting to login');
          setPage('login');
        }
      } catch (err) {
        console.warn('Auto-login error:', err);
        setPage('login');
      }
    };

    handleAutoLogin();
  }, [state.profiles]);

  // Automatically route to dashboard if customer logs in, or admin if admin, and protect dashboard
  useEffect(() => {
    if (currentRole === 'admin' && page !== 'admin') {
      setPage('admin');
    } else if (currentUser && (page === 'login' || page === 'activate')) {
      setPage('dashboard');
    } else if (page === 'dashboard' && !currentUser && !isLoadingAuth) {
      setPage('login');
    }
  }, [currentRole, currentUser, page, isLoadingAuth]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, dashboardTab]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-medium tracking-wide text-slate-300">Initializing Greendot Secure Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* ================= INSTANT NOTIFICATION TOAST ================= */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[99999] max-w-md bg-emerald-950/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-500/60 flex items-center gap-3.5 transition-all">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex-1 text-sm font-bold text-white tracking-tight">
            {toastMessage}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white text-xs font-black p-1 hover:bg-emerald-800/50 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>
      )}
      {/* ================= ADMIN ACCESS BYPASS PAGE ================= */}
      {page === 'admin-access' && (
        <AdminAccessBypass onSuccessfulLogin={() => setPage('admin')} />
      )}

      {/* ================= LOCKDOWN MODE INTERCEPTOR ================= */}
      {page !== 'admin-access' && state?.appSettings?.lockdown_mode && currentRole !== 'admin' && (
        <LockdownPage onBypass={() => setPage('admin-access')} />
      )}

      {/* ================= MAINTENANCE MODE INTERCEPTOR ================= */}
      {page !== 'admin-access' && !state?.appSettings?.lockdown_mode && state?.appSettings?.maintenance_mode && currentRole !== 'admin' && (
        <MaintenancePage onBypass={() => setPage('admin-access')} />
      )}

      {/* ================= PUBLIC FLOW ================= */}
      {page !== 'admin-access' && (!state?.appSettings?.lockdown_mode && !state?.appSettings?.maintenance_mode || currentRole === 'admin') && page !== 'dashboard' && page !== 'admin' && (
        <>
          <PublicNavbar
            currentPage={page}
            onNavigate={(p) => setPage(p)}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
          />

          <main className="flex-1">
            {page === 'home' && (
              <HomePage
                onNavigate={(p) => setPage(p)}
                onOpenDeployModal={() => setIsDeployModalOpen(true)}
              />
            )}
            {page === 'about' && <AboutPage onNavigate={(p) => setPage(p)} />}
            {page === 'loans' && <LoansPage onNavigate={(p) => setPage(p)} />}
            {page === 'investments' && <InvestmentsPage onNavigate={(p) => setPage(p)} />}
            {page === 'careers' && <CareersPage onNavigate={(p) => setPage(p)} />}
            {page === 'faq' && <FaqPage onNavigate={(p) => setPage(p)} />}
            {page === 'contact' && <ContactPage />}
            {page === 'open-account' && (
              <OpenAccountPage
                onNavigate={(p) => setPage(p)}
                onSuccess={() => setPage('login')}
                onNavigateLogin={() => setPage('login')}
              />
            )}
            {page === 'activate' && (
              <ActivateAccountPage
                onNavigate={(p) => setPage(p)}
                onSuccess={() => setPage('login')}
                onNavigateLogin={() => setPage('login')}
              />
            )}
            {page === 'login' && (
              <LoginPage
                onSuccess={(role) => {
                  if (role === 'admin') setPage('admin');
                  else setPage('dashboard');
                }}
                onNavigateHome={() => setPage('home')}
                onNavigateRegister={() => setPage('open-account')}
                onNavigateActivate={() => setPage('activate')}
              />
            )}
          </main>

          <PublicFooter
            onNavigate={(p) => setPage(p)}
            onOpenDeployModal={() => setIsDeployModalOpen(true)}
          />
        </>
      )}

      {/* ================= CUSTOMER DASHBOARD FLOW ================= */}
      {page !== 'admin-access' && (!state?.appSettings?.lockdown_mode && !state?.appSettings?.maintenance_mode || currentRole === 'admin') && page === 'dashboard' && currentUser && (
        <DashboardLayout
          activeTab={dashboardTab}
          onTabChange={(t) => setDashboardTab(t)}
          onNavigateHome={() => setPage('home')}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
        >
          {dashboardTab === 'overview' && (
            <DashboardOverview onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'transfer' && (
            <CustomerTransfer onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'deposit' && (
            <CustomerCheckDeposit onSuccessNavigate={() => setDashboardTab('transactions')} />
          )}
          {dashboardTab === 'transactions' && <CustomerTransactions />}
          {dashboardTab === 'statements' && <CustomerStatements />}
          {dashboardTab === 'cards' && (
            <CustomerCards onTabChange={(t) => setDashboardTab(t as any)} />
          )}
          {dashboardTab === 'beneficiaries' && (
            <CustomerBeneficiaries onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'bill-pay' && (
            <CustomerBillPay onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'recharge' && (
            <CustomerRecharge onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'loans' && <CustomerLoans />}
          {dashboardTab === 'support' && <CustomerSupportCenter />}
          {dashboardTab === 'profile' && <CustomerProfileSecurity initialTab="profile" />}
          {dashboardTab === 'security' && <CustomerProfileSecurity initialTab="security" />}
          {dashboardTab === 'how-to-get-card' && (
            <HowToGetCardView onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'how-to-upgrade' && (
            <HowToUpgradeView onTabChange={(t) => setDashboardTab(t)} />
          )}
          {dashboardTab === 'notifications' && <NotificationsView />}
        </DashboardLayout>
      )}

      {/* Fallback if user navigates to dashboard but is not logged in */}
      {page !== 'admin-access' && (!state?.appSettings?.lockdown_mode && !state?.appSettings?.maintenance_mode || currentRole === 'admin') && page === 'dashboard' && !currentUser && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-sm">
            <Lock className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900">Sign-in Required</h3>
            <p className="text-xs text-slate-500">
              Please sign into your verified Greendot customer account to access online banking.
            </p>
            <button
              onClick={() => setPage('login')}
              className="w-full py-3 gradient-primary text-white font-bold text-xs rounded-xl shadow"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}

      {/* ================= ADMIN LOGIN FLOW ================= */}
      {page === 'admin-login' && (
        <AdminLogin
          onSuccess={() => setPage('admin')}
          onBackToPublic={() => setPage('home')}
        />
      )}

      {/* ================= ADMIN PORTAL FLOW ================= */}
      {page !== 'admin-access' && page !== 'admin-login' && page === 'admin' && (
        currentRole === 'admin' ? (
          <ErrorBoundary fallbackTitle="Admin Portal Error" fallbackMessage="An issue occurred in the admin portal. Your administrative session is preserved.">
            <AdminPortal
              onNavigateWebsite={() => setPage('home')}
              onNavigateCustomer={(customerId) => {
                switchCustomer(customerId);
                setPage('dashboard');
                setDashboardTab('overview');
              }}
            />
          </ErrorBoundary>
        ) : (
          <AdminLogin
            onSuccess={() => setPage('admin')}
            onBackToPublic={() => setPage('home')}
          />
        )
      )}

      {/* ================= PWA INSTALL PROMPT & APP BANNER ================= */}
      <PwaInstallPrompt />

      {/* ================= EXPORT & DEPLOY MODAL ================= */}
      <ExportDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <BankAppInner />
    </BankProvider>
  );
}
