import React, { useState } from 'react';
import { GreendotLogo } from '../ui/GreendotLogo';
import {
  LayoutDashboard,
  ReceiptText,
  ArrowLeftRight,
  Users,
  FileText,
  Smartphone,
  CreditCard,
  Banknote,
  Bell,
  User,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  LogOut,
  Globe,
  Menu,
  X,
  AlertTriangle,
  Lock,
  Snowflake,
  ChevronRight,
  Camera,
  FileCheck,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface DashboardLayoutProps {
  currentTab?: string;
  activeTab?: string;
  onTabChange: (tab: string) => void;
  onNavigateWebsite?: () => void;
  onNavigateHome?: () => void;
  onOpenDeployModal?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  activeTab,
  onTabChange,
  onNavigateWebsite,
  onNavigateHome,
  children,
}) => {
  const { currentUser, logout, unreadNotificationCount, state } = useBank();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const selectedTab = activeTab || currentTab || 'overview';
  const handleGoHome = onNavigateHome || onNavigateWebsite || (() => {});

  const isRestricted =
    currentUser?.status === 'frozen' || currentUser?.status === 'locked' || currentUser?.status === 'suspended';

  const navGroups = [
    {
      title: 'Main Banking',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'transfer', label: 'Transfer Money', icon: ArrowLeftRight, restricted: isRestricted },
        { id: 'deposit', label: 'Mobile Check Deposit', icon: Camera, restricted: isRestricted },
        { id: 'transactions', label: 'Transactions', icon: ReceiptText },
        { id: 'statements', label: 'e-Statements & Tax', icon: FileCheck },
        { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
      ],
    },
    {
      title: 'Payments & Cards',
      items: [
        { id: 'cards', label: 'Debit & Virtual Cards', icon: CreditCard, restricted: isRestricted },
        { id: 'bill-pay', label: 'Bill Payments', icon: FileText, restricted: isRestricted },
        { id: 'recharge', label: 'Mobile Recharge', icon: Smartphone, restricted: isRestricted },
        { id: 'loans', label: 'Loans & Credit', icon: Banknote },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security & PIN', icon: ShieldCheck },
        { id: 'support', label: 'Help & Concierge', icon: HelpCircle },
        ...(currentUser?.hasVisaCard === false
          ? [{ id: 'how-to-get-card', label: 'How to Get Card', icon: CreditCard }]
          : currentUser?.accountTier === 'tier_0'
          ? [{ id: 'how-to-upgrade', label: 'How to Upgrade', icon: ArrowUpRight }]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9f7] flex flex-col lg:flex-row">
      {/* ================= DESKTOP FIXED SIDEBAR ================= */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 gradient-hero text-white z-30 shadow-2xl border-r border-emerald-900/50 select-none">
        {/* Top Branding */}
        <div className="p-6 pb-4 border-b border-white/10">
          <GreendotLogo variant="light" size="sm" onClick={onNavigateWebsite} />
          <div className="text-[10px] uppercase font-bold tracking-[2.5px] text-emerald-300 mt-1">
            Online Banking Portal
          </div>
        </div>

        {/* User Info Card */}
        {currentUser && (
          <div className="p-4 mx-4 my-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3 backdrop-blur-md">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white font-bold text-base flex items-center justify-center shadow-md">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{currentUser.fullName}</div>
              <div className="text-[11px] font-mono text-emerald-300 truncate">{currentUser.customerId}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[9px] uppercase px-2 py-0.2 rounded-full font-bold ${
                    currentUser.status === 'active'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                      : currentUser.status === 'frozen'
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                      : 'bg-red-500/30 text-red-200 border border-red-400/40'
                  }`}
                >
                  {currentUser.status}
                </span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/10 text-white font-mono">
                  {currentUser.accountTier}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = selectedTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-emerald-900 font-bold shadow-lg shadow-black/10'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    } ${item.restricted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.restricted && (
                      <Lock className="w-3 h-3 text-amber-300" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Bar: Back to Website & Sign Out */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-1 text-xs">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Public Bank Website</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE HEADER TOPBAR ================= */}
      <header
        className="lg:hidden sticky top-0 z-30 bg-emerald-950 text-white px-4 flex items-center justify-between border-b border-emerald-900 shadow-md box-border"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          height: 'calc(env(safe-area-inset-top) + 4rem)',
        }}
      >
        <GreendotLogo variant="light" size="sm" onClick={() => onTabChange('overview')} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('notifications')}
            className="relative p-2 text-emerald-300 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-emerald-300 hover:text-white"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
          <div className="w-72 h-full gradient-hero text-white p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <GreendotLogo variant="light" size="sm" />
                <button onClick={() => setMobileNavOpen(false)} className="p-1 text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-emerald-300">{group.title}</div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                        selectedTab === item.id ? 'bg-white text-emerald-900 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[10px]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <button onClick={handleGoHome} className="w-full text-left py-2 text-slate-300">
                Public Website
              </button>
              <button onClick={logout} className="w-full text-left py-2 text-red-300 font-bold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* TOP STATUS BANNERS */}
        <div className="space-y-2 p-4 pb-0 max-w-7xl mx-auto w-full">
          {/* 1. Account Frozen Banner */}
          {currentUser?.status === 'frozen' && (
            <div className="bg-amber-500 text-slate-950 p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Snowflake className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs font-bold">
                  Account Temporarily Frozen — Outgoing transfers and card debits are restricted.
                </div>
              </div>
              <button
                onClick={() => onTabChange('support')}
                className="text-xs font-extrabold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Request Unfreeze
              </button>
            </div>
          )}

          {/* 2. Account Locked Banner */}
          {currentUser?.status === 'locked' && (
            <div className="bg-red-600 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs font-bold">
                  Security Lock Applied — Suspicious activity review in progress. Please contact concierge.
                </div>
              </div>
              <button
                onClick={() => onTabChange('support')}
                className="text-xs font-extrabold bg-white text-red-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Contact Concierge
              </button>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          <ErrorBoundary fallbackTitle="Dashboard Module Error" fallbackMessage="Could not load this dashboard section. You can switch to another tab or refresh safely.">
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* ================= FIXED NATIVE MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            selectedTab === 'overview' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${selectedTab === 'overview' ? 'scale-110 text-emerald-600' : ''}`} />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        <button
          onClick={() => onTabChange('transfer')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            selectedTab === 'transfer' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowLeftRight className={`w-5 h-5 ${selectedTab === 'transfer' ? 'scale-110 text-emerald-600' : ''}`} />
          <span className="text-[10px] mt-1">Transfer</span>
        </button>

        <button
          onClick={() => onTabChange('deposit')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            selectedTab === 'deposit' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-full ${selectedTab === 'deposit' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">Deposit</span>
        </button>

        <button
          onClick={() => onTabChange('cards')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            selectedTab === 'cards' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${selectedTab === 'cards' ? 'scale-110 text-emerald-600' : ''}`} />
          <span className="text-[10px] mt-1">Cards</span>
        </button>

        <button
          onClick={() => setMobileNavOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            mobileNavOpen ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>
    </div>
  );
};
