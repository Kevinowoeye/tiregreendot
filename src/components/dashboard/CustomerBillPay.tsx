import React, { useState } from 'react';
import {
  FileText,
  Zap,
  Droplets,
  Wifi,
  Smartphone,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
  X,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { PinDialog } from './PinDialog';
import confetti from 'canvas-confetti';

export const CustomerBillPay: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const { currentUser, payBill, customerTransactions } = useBank();
  const [billerName, setBillerName] = useState('ConEdison Power');
  const [billerCategory, setBillerCategory] = useState('Utilities / Electricity');
  const [accountNumber, setAccountNumber] = useState('CE-9812-4910');
  const [amount, setAmount] = useState(142.5);
  const [pinOpen, setPinOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [restrictionModal, setRestrictionModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    buttonText: string;
    targetTab: string;
  } | null>(null);

  if (!currentUser) return null;

  const isRestrictedStatus =
    currentUser.status === 'frozen' || currentUser.status === 'locked' || currentUser.status === 'suspended';

  const categories = [
    { name: 'ConEdison Power', cat: 'Electricity & Gas', icon: Zap },
    { name: 'NYC Municipal Water', cat: 'Water & Sewer', icon: Droplets },
    { name: 'Verizon Fios Fiber', cat: 'High Speed Internet', icon: Wifi },
    { name: 'T-Mobile USA', cat: 'Mobile Wireless', icon: Smartphone },
    { name: 'State Farm Insurance', cat: 'Property & Auto Insurance', icon: Shield },
  ];

  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // 1. Check Visa Card requirement
    if (currentUser.hasVisaCard === false) {
      const msg = 'Transaction Blocked: You need a linked Visa Card to send money. Please get your card first.';
      setFeedback({ text: msg, ok: false });
      setRestrictionModal({
        open: true,
        title: 'Visa Card Required',
        message: msg,
        buttonText: 'Get Your Gold Visa Card',
        targetTab: 'how-to-get-card',
      });
      return;
    }

    // 2. Check Account Tier requirement
    if (currentUser.accountTier === 'tier_0') {
      const msg = 'Transaction Blocked: Please upgrade your account to Tier 1 to enable transfers and bill payments.';
      setFeedback({ text: msg, ok: false });
      setRestrictionModal({
        open: true,
        title: 'Tier 1 Upgrade Required',
        message: msg,
        buttonText: 'Upgrade to Tier 1',
        targetTab: 'how-to-upgrade',
      });
      return;
    }

    // 3. Check Restricted Status (frozen, locked, suspended)
    if (isRestrictedStatus) {
      const msg = 'Transaction Restricted: Your account is currently restricted. Please contact support.';
      setFeedback({ text: msg, ok: false });
      setRestrictionModal({
        open: true,
        title: 'Account Restricted',
        message: msg,
        buttonText: 'Contact Support',
        targetTab: 'support',
      });
      return;
    }

    if (amount <= 0 || amount > currentUser.balance) {
      setFeedback({ text: 'Invalid amount or insufficient funds.', ok: false });
      return;
    }

    setPinOpen(true);
  };

  const handlePinConfirm = (pin: string) => {
    setPinOpen(false);
    const res = payBill({
      billerName,
      billerCategory,
      accountNumber,
      amount: Number(amount),
      pin,
    });
    if (res.success) {
      setFeedback({ text: res.message, ok: true });
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } else {
      setFeedback({ text: res.message, ok: false });
    }
  };

  const billHistory = customerTransactions.filter((t) => t.type === 'bill_pay');

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Online Bill Payments</h2>
          <p className="text-xs text-slate-500">
            Automate and dispatch verified payments directly to national utility and service providers.
          </p>
        </div>
        <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
          Available: <strong className="font-bold">{formatCurrency(currentUser.balance)}</strong>
        </div>
      </div>

      {/* Subtle Form Top Warning Banner */}
      {currentUser.hasVisaCard === false ? (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Visa Card Required:</span> Visa Card Required to complete transfers. Please request your Gold Visa Card to activate money-out features.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange?.('how-to-get-card')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex-shrink-0 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Get Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : currentUser.accountTier === 'tier_0' ? (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Tier Upgrade Required:</span> Please upgrade your account to Tier 1 to enable transfers and bill payments.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange?.('how-to-upgrade')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex-shrink-0 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Upgrade Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : isRestrictedStatus ? (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-red-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-200 text-red-800 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Transaction Restricted:</span> Your account is currently {currentUser.status}. Outgoing bill payments are restricted.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTabChange?.('support')}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex-shrink-0 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            feedback.ok
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Pay Bill Form (ALWAYS FULLY VISIBLE) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-700">Select Common Biller</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = billerName === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setBillerName(c.name);
                      setBillerCategory(c.cat);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.cat}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleInitiate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Account / Statement Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="CE-9812-4910"
                className="w-full mt-1 p-3 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Payment Amount ($ USD)</label>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  max={currentUser.balance}
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 p-3 text-base font-bold border border-slate-200 rounded-xl focus:border-emerald-600 outline-none text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 gradient-primary text-white font-display font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Bill Payment</span>
            </button>
          </form>
        </div>

        {/* Right 5 cols: History */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">Recent Bill Payments</h3>
          {billHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">No bills paid yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {billHistory.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{b.description}</div>
                    <div className="text-[11px] text-slate-400">{formatDate(b.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-red-600">-{formatCurrency(b.amount)}</div>
                    <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gated Restriction Popup Modal */}
      {restrictionModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-scale-in relative">
            <button
              onClick={() => setRestrictionModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                {restrictionModal.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {restrictionModal.message}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = restrictionModal.targetTab;
                  setRestrictionModal(null);
                  onTabChange?.(target);
                }}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-display font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{restrictionModal.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRestrictionModal(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Digit PIN Modal */}
      <PinDialog
        isOpen={pinOpen}
        onClose={() => setPinOpen(false)}
        onSubmit={handlePinConfirm}
        amount={amount}
        title="Confirm Bill Payment"
        description={`Authorizing payment of ${formatCurrency(amount)} to ${billerName}.`}
      />
    </div>
  );
};
