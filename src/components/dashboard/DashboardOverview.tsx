import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  FileText,
  Users,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Receipt,
  Download,
  ArrowRight,
  Megaphone,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { GoldVisaCardVisual } from './GoldVisaCardVisual';
import { Transaction } from '../../types';

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
  onSelectTransaction?: (tx: Transaction) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onTabChange,
  onSelectTransaction,
}) => {
  const {
    currentUser,
    customerTransactions,
    unreadNotificationCount,
    toggleCardFreeze,
    state,
  } = useBank();
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<string>('all');

  if (!currentUser) return null;

  const firstName = currentUser.fullName.split(' ')[0];
  const userCard = currentUser.hasVisaCard ? currentUser.debitCard : null;
  const settings = state.appSettings;

  // Calculate Inflow & Outflow for current customer
  const totalInflow = customerTransactions
    .filter((tx) => tx.type === 'deposit' || tx.type === 'interest' || tx.type === 'transfer_in')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalOutflow = customerTransactions
    .filter((tx) => tx.type === 'transfer' || tx.type === 'bill_pay' || tx.type === 'recharge' || tx.type === 'fee')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const recentTransactions = customerTransactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Banner Priority Logic */}
      {currentUser.accountTier === 'tier_0' && currentUser.hasVisaCard ? (
        <div className="p-5 bg-amber-500/15 border-2 border-amber-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center flex-shrink-0 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-slate-900 text-sm">Account Tier 0 — Upgrade Required</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Upgrade your account to Tier 1 to enable transfers and payments.
              </p>
            </div>
          </div>
          <button
            onClick={() => onTabChange('how-to-upgrade')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* 1. GREEN GRADIENT HERO SECTION */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1db954 0%, #178a3e 50%, #0f5127 100%)',
        }}
      >
        {/* Ambient background rings */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-lime-300/10 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top Row: Greeting & Bell */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Good day, {firstName} 👋
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentUser.fullName}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={hideBalance ? 'Show balance' : 'Hide balance'}
              >
                {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onTabChange('notifications')}
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-lime-400 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Centered Total Account Balance */}
          <div className="text-center py-2 space-y-1">
            <div className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">
              Total Available Liquidity
            </div>
            <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
              {hideBalance ? '••••••••' : formatCurrency(currentUser.balance)}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[11px] font-mono bg-black/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-white/20">
                Tier: {currentUser.accountTier.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-[11px] font-mono bg-emerald-900/50 text-white px-2 py-0.5 rounded-full border border-white/20">
                ID: {currentUser.customerId}
              </span>
            </div>
          </div>

          {/* 4 Quick Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => onTabChange('transfer')}
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all text-center flex flex-col items-center gap-2 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">Transfer</span>
            </button>

            <button
              onClick={() => onTabChange('recharge')}
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all text-center flex flex-col items-center gap-2 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">Recharge</span>
            </button>

            <button
              onClick={() => onTabChange('bill-pay')}
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all text-center flex flex-col items-center gap-2 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">Pay Bill</span>
            </button>

            <button
              onClick={() => onTabChange('beneficiaries')}
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-all text-center flex flex-col items-center gap-2 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">Payee List</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. OVERLAPPING WHITE CARD: Inflow / Outflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income / Inflow Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Inflows (Deposits)</div>
              <div className="text-xl font-extrabold text-slate-900 font-display">
                {hideBalance ? '••••' : formatCurrency(totalInflow)}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
            + Income
          </span>
        </div>

        {/* Expense / Outflow Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Outflows (Transfers/Bills)</div>
              <div className="text-xl font-extrabold text-slate-900 font-display">
                {hideBalance ? '••••' : formatCurrency(totalOutflow)}
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-lg">
            - Spending
          </span>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN SECTION: Recent Transactions (Left) + Debit Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Transactions List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">Recent Ledger Activity</h3>
              <p className="text-xs text-slate-500">Live verified transactions on this account</p>
            </div>
            <button
              onClick={() => onTabChange('transactions')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => {
                const isDebit =
                  tx.type === 'transfer' || tx.type === 'bill_pay' || tx.type === 'recharge' || tx.type === 'fee';

                return (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction?.(tx)}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isDebit ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                          {tx.description}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(tx.date)}</span>
                          <span>&bull;</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-bold font-mono ${
                          isDebit ? 'text-slate-900' : 'text-emerald-700'
                        }`}
                      >
                        {isDebit ? '-' : '+'}
                        {formatCurrency(tx.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.id}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 5 cols: Active Debit Card Preview & Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-base">Linked Visa Debit</h3>
              <button
                onClick={() => onTabChange('cards')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Manage &rarr;
              </button>
            </div>

            <GoldVisaCardVisual
              card={userCard}
              onToggleFreeze={userCard ? () => toggleCardFreeze(userCard.id) : undefined}
            />
          </div>

          {/* Quick Security Status Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Security Shield Active</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              Your session is protected with 256-bit AES encryption. PIN verification is required for transfers exceeding $500.
            </div>
            <button
              onClick={() => onTabChange('security')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline block"
            >
              Review Security &amp; PIN Settings &rarr;
            </button>
          </div>

          {/* Bank Announcements & Bulletins */}
          {state.announcements && state.announcements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-emerald-600" />
                  <span>Bank Bulletins &amp; Notices</span>
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {state.announcements.length} New
                </span>
              </div>

              <div className="space-y-3">
                {state.announcements.slice(0, 3).map((anc) => {
                  const isSecurity = anc.category === 'security_alert';
                  const isMaintenance = anc.category === 'maintenance';
                  const isPolicy = anc.category === 'policy_update';

                  return (
                    <div
                      key={anc.id}
                      className={`p-3.5 rounded-2xl border space-y-1.5 ${
                        isSecurity
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : isMaintenance
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          {isSecurity && <ShieldAlert className="w-3 h-3 text-red-600" />}
                          {isMaintenance && <Wrench className="w-3 h-3 text-amber-600" />}
                          {isPolicy && <FileText className="w-3 h-3 text-blue-600" />}
                          {!isSecurity && !isMaintenance && !isPolicy && <Bell className="w-3 h-3 text-emerald-600" />}
                          <span>{anc.category.replace('_', ' ')}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{formatDate(anc.createdAt)}</span>
                      </div>
                      <div className="font-bold text-xs">{anc.title}</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{anc.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
