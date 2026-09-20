import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Zap,
  CreditCard,
  ArrowRight,
  Lock,
  X,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { PinDialog } from './PinDialog';
import confetti from 'canvas-confetti';

export const CustomerRecharge: React.FC<{ onTabChange?: (tab: string) => void }> = ({ onTabChange }) => {
  const { currentUser, mobileRecharge, customerTransactions } = useBank();
  const [operator, setOperator] = useState('Verizon Wireless');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 381-9024');
  const [amount, setAmount] = useState(25);
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

  const operators = ['Verizon Wireless', 'AT&T Mobility', 'T-Mobile USA', 'Mint Mobile', 'Cricket'];
  const amounts = [15, 25, 50, 75, 100];

  const isRestrictedStatus =
    currentUser.status === 'frozen' || currentUser.status === 'locked' || currentUser.status === 'suspended';

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

    if (amount > currentUser.balance) {
      setFeedback({ text: 'Insufficient available liquidity funds.', ok: false });
      return;
    }

    setPinOpen(true);
  };

  const handlePinConfirm = (pin: string) => {
    setPinOpen(false);
    const res = mobileRecharge({
      operator,
      phoneNumber,
      amount,
      pin,
    });
    if (res.success) {
      setFeedback({ text: res.message, ok: true });
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } else {
      setFeedback({ text: res.message, ok: false });
    }
  };

  const rechargeHistory = customerTransactions.filter((t) => t.type === 'recharge');

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Mobile Top-Up &amp; Recharge</h2>
          <p className="text-xs text-slate-500">
            Instantly add prepaid wireless credit to any US or international cellular carrier.
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
              <span className="font-bold">Transaction Restricted:</span> Your account is currently {currentUser.status}. Outgoing recharge services are restricted.
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
        {/* Left 7 cols: Recharge Form (ALWAYS FULLY VISIBLE) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleInitiate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Wireless Carrier</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                {operators.map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperator(op)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      operator === op
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Select Top-Up Credit Amount</label>
              <div className="grid grid-cols-5 gap-2 mt-1.5">
                {amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`py-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                      amount === a
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 gradient-primary text-white font-display font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Recharge ${amount} Now</span>
            </button>
          </form>
        </div>

        {/* Right 5 cols: Recharge History */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900">Recharge History</h3>
          {rechargeHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">No recharges executed yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rechargeHistory.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{r.description}</div>
                    <div className="text-[11px] text-slate-400">{formatDate(r.date)}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-red-600">
                    -{formatCurrency(r.amount)}
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
        title="Confirm Mobile Recharge"
        description={`Authorizing prepaid recharge to ${phoneNumber} (${operator}).`}
      />
    </div>
  );
};
