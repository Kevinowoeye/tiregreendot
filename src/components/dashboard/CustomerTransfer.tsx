import React, { useState } from 'react';
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building2,
  Users,
  Clock,
  Sparkles,
  CreditCard,
  ArrowRight,
  X,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { SUPPORTED_BANKS } from '../../lib/banks';
import { formatCurrency, formatDate } from '../../lib/utils';
import { PinDialog } from './PinDialog';
import confetti from 'canvas-confetti';

interface CustomerTransferProps {
  onTabChange?: (tab: string) => void;
}

export const CustomerTransfer: React.FC<CustomerTransferProps> = ({ onTabChange }) => {
  const {
    currentUser,
    customerTransactions,
    beneficiaries,
    submitTransfer,
  } = useBank();

  const [recipientType, setRecipientType] = useState<'beneficiary' | 'manual'>('beneficiary');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(
    beneficiaries[0]?.id || ''
  );
  const [targetBank, setTargetBank] = useState<string>(SUPPORTED_BANKS[0]?.name || 'Chase Bank');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [amount, setAmount] = useState<number>(250);
  const [description, setDescription] = useState<string>('Personal funds transfer');

  const [pinDialogOpen, setPinDialogOpen] = useState(false);
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

  // Handle Quick Amount buttons
  const quickAmounts = [50, 100, 250, 500, 1000];

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

    if (amount <= 0) {
      setFeedback({ text: 'Please enter a valid transfer amount greater than $0.', ok: false });
      return;
    }

    if (amount > currentUser.balance) {
      setFeedback({ text: 'Insufficient available liquidity balance for this transfer.', ok: false });
      return;
    }

    // Determine recipient details
    let finalRecipient = recipientName;
    let finalBank = targetBank;
    let finalAcc = accountNumber;

    if (recipientType === 'beneficiary') {
      const b = beneficiaries.find((item) => item.id === selectedBeneficiaryId);
      if (b) {
        finalRecipient = b.accountName;
        finalBank = b.bankName;
        finalAcc = b.accountNumber;
      }
    }

    if (!finalRecipient || !finalAcc) {
      setFeedback({ text: 'Please provide valid recipient account credentials.', ok: false });
      return;
    }

    // Open PIN dialog
    setPinDialogOpen(true);
  };

  const handlePinSubmit = (pin: string) => {
    setPinDialogOpen(false);

    let finalRecipient = recipientName;
    let finalBank = targetBank;
    let finalAcc = accountNumber;

    if (recipientType === 'beneficiary') {
      const b = beneficiaries.find((item) => item.id === selectedBeneficiaryId);
      if (b) {
        finalRecipient = b.accountName;
        finalBank = b.bankName;
        finalAcc = b.accountNumber;
      }
    }

    const res = submitTransfer({
      recipientName: finalRecipient,
      recipientBank: finalBank,
      recipientAccount: finalAcc,
      amount: Number(amount),
      description: description || 'Bank Transfer',
      pin,
    });

    if (res.success) {
      setFeedback({ text: res.message, ok: true });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      // Clear form
      setAmount(100);
    } else {
      setFeedback({ text: res.message, ok: false });
    }
  };

  const recentTransfers = customerTransactions
    .filter((tx) => tx.type === 'transfer')
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Wire &amp; Domestic Transfer</h2>
          <p className="text-xs text-slate-500">
            Execute real-time funds settlement to any domestic financial institution.
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
              <span className="font-bold">Transaction Restricted:</span> Your account is currently {currentUser.status}. Outgoing wire transfers are restricted.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Transfer Form (ALWAYS FULLY VISIBLE) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Recipient Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRecipientType('beneficiary')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                recipientType === 'beneficiary'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Saved Beneficiary ({beneficiaries.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setRecipientType('manual')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                recipientType === 'manual'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>New Recipient Bank</span>
            </button>
          </div>

          <form onSubmit={handleInitiate} className="space-y-4">
            {recipientType === 'beneficiary' ? (
              <div>
                <label className="text-xs font-bold text-slate-700">Select Saved Beneficiary</label>
                {beneficiaries.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 mt-1">
                    No beneficiaries saved yet. Switch to "New Recipient Bank" above to enter routing info.
                  </div>
                ) : (
                  <select
                    value={selectedBeneficiaryId}
                    onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                    className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-medium bg-white"
                  >
                    {beneficiaries.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.accountName} &bull; {b.bankName} (••••{b.accountNumber.slice(-4)})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Destination Bank</label>
                  <select
                    value={targetBank}
                    onChange={(e) => setTargetBank(e.target.value)}
                    className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-medium bg-white"
                  >
                    {SUPPORTED_BANKS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. James Chen"
                      className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Account / IBAN Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 0482910394"
                      className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Amount with quick chips */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Transfer Amount ($ USD)</label>
                <span className="text-[11px] text-slate-400">Zero ACH wire fees</span>
              </div>
              <div className="relative mt-1">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  max={currentUser.balance}
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 p-3 text-lg font-bold border border-slate-200 rounded-xl focus:border-emerald-600 outline-none text-slate-900"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    +${q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Payment Memo / Purpose</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Invoice #204 or Monthly rent"
                className="w-full mt-1 p-3 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 gradient-primary text-white font-display font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Send Transfer</span>
            </button>
          </form>
        </div>

        {/* Right 5 cols: Security Notice & Recent Transfers History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm">Recent Wire Transfers</h3>

            {recentTransfers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No recent outgoing transfers.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTransfers.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{tx.description}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(tx.date)} &bull; {tx.reference}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 font-mono">-{formatCurrency(tx.amount)}</div>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
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
                ))}
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Transfer Protection Protocol</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Domestic transfers over $500 are automatically cross-checked with the Federal Reserve routing registry. Your 4-digit PIN ensures complete account custody.
            </p>
          </div>
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
        isOpen={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onSubmit={handlePinSubmit}
        amount={amount}
        title="Authorize Outgoing Transfer"
        description="Enter your 4-digit Transaction PIN to dispatch these funds to the recipient bank."
      />
    </div>
  );
};
