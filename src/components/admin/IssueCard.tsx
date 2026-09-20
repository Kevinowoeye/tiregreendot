import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { CustomerProfile } from '../../types';
import confetti from 'canvas-confetti';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface IssueCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCustomer?: CustomerProfile | null;
  onSuccess?: (message: string) => void;
}

export const IssueCardModalInner: React.FC<IssueCardModalProps> = ({
  isOpen,
  onClose,
  targetCustomer,
  onSuccess,
}) => {
  const { state, issueGoldVisaCard } = useBank();

  // If no target customer passed, pick the first customer profile as default
  const defaultCust = targetCustomer || state.profiles.find((p) => p.role === 'customer') || null;

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(defaultCust);
  const [formData, setFormData] = useState({
    cardNumber: '4532 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000),
    cardHolder: defaultCust?.fullName?.toUpperCase() || 'VALUED CUSTOMER',
    expiryMonth: '12',
    expiryYear: '29',
    cvv: String(Math.floor(100 + Math.random() * 900)),
    dailyLimit: 25000,
    status: 'active' as 'active' | 'frozen',
    pin: '4829',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGenerateRandomNumber = () => {
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const r3 = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({
      ...prev,
      cardNumber: `4532 ${r1} ${r2} ${r3}`,
      cvv: String(Math.floor(100 + Math.random() * 900)),
    }));
  };

  const handleCustomerChange = (customerId: string) => {
    const cust = state.profiles.find((p) => p.customerId === customerId || p.userId === customerId);
    if (cust) {
      setSelectedCustomer(cust);
      setFormData((prev) => ({
        ...prev,
        cardHolder: cust.fullName.toUpperCase(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const activeCust = selectedCustomer || defaultCust;
      if (!activeCust) {
        setErrorMsg('Please select a valid customer profile to issue this card.');
        setIsSubmitting(false);
        return;
      }

      const res = issueGoldVisaCard(activeCust.userId, {
        cardNumber: formData.cardNumber.trim(),
        cardHolder: formData.cardHolder.trim(),
        expiryMonth: parseInt(String(formData.expiryMonth), 10) || 12,
        expiryYear: parseInt(String(formData.expiryYear), 10) || 29,
        cvv: formData.cvv.trim(),
        dailyLimit: Number(formData.dailyLimit) || 25000,
        status: formData.status,
      });

      if (res.success) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        if (onSuccess) {
          onSuccess(res.message || `Gold Visa Card successfully issued to ${activeCust.fullName}!`);
        }
        onClose();
      } else {
        setErrorMsg(res.message || 'Failed to issue card. Please try again.');
      }
    } catch (err: any) {
      console.error('Issue Card Error:', err);
      setErrorMsg(err.message || 'Unexpected error occurred while issuing card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe month padding
  const safeMonth = String(formData.expiryMonth || '12').padStart(2, '0');
  const safeYear = String(formData.expiryYear || '29');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#162032] border border-amber-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">Issue Gold Visa Debit Card</h3>
              <p className="text-[11px] text-slate-400">
                Authorized administrator provisioning of customized Visa debit cards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-700 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Card Preview */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-tr from-[#996515] via-[#FFDF73] to-[#B38728] text-slate-950 shadow-xl border border-yellow-200/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-inner">
                GD
              </div>
              <div>
                <span className="font-display font-black text-xs tracking-wider block leading-none">GREENDOT</span>
                <span className="text-[9px] font-bold tracking-widest text-slate-800 uppercase">PREMIER GOLD</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  formData.status === 'active' ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
                }`}
              >
                {formData.status}
              </span>
              <span className="font-black italic text-lg tracking-tighter text-slate-900">VISA</span>
            </div>
          </div>

          <div className="my-4 flex items-center gap-3 relative z-10">
            <div className="w-9 h-7 rounded bg-amber-200/90 border border-amber-900/30 flex items-center justify-center shadow-xs">
              <div className="w-6 h-4 border border-amber-900/20 rounded-xs" />
            </div>
            <div className="text-[10px] text-slate-800 font-mono font-bold">DEBIT / 4532</div>
          </div>

          <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-950 drop-shadow-xs relative z-10">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="mt-3 flex items-end justify-between text-xs relative z-10">
            <div>
              <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Cardholder Name</div>
              <div className="font-bold tracking-wide uppercase">{formData.cardHolder || 'CARDHOLDER'}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Expires / CVV</div>
              <div className="font-mono font-bold">
                {safeMonth}/{safeYear} &bull; {formData.cvv || '•••'}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Customer selector if not pre-locked */}
          {!targetCustomer && (
            <div>
              <label className="font-bold text-slate-300 block mb-1">Target Customer Profile</label>
              <select
                value={selectedCustomer?.customerId || ''}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-mono"
              >
                {state.profiles
                  .filter((p) => p.role === 'customer')
                  .map((p) => (
                    <option key={p.customerId} value={p.customerId}>
                      {p.fullName} (#{p.customerId}) - {p.email}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-300">16-Digit Card Number</label>
              <button
                type="button"
                onClick={handleGenerateRandomNumber}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
              >
                🎲 Generate Random
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Cardholder Name Embossed</label>
            <input
              type="text"
              required
              value={formData.cardHolder}
              onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white uppercase outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Expiry Month</label>
              <select
                value={String(formData.expiryMonth)}
                onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-mono"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Expiry Year</label>
              <select
                value={String(formData.expiryYear)}
                onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-mono"
              >
                {['26', '27', '28', '29', '30', '31', '32'].map((y) => (
                  <option key={y} value={y}>
                    20{y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Security CVV</label>
              <input
                type="text"
                required
                maxLength={3}
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-amber-500 text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Daily Limit ($)</label>
              <input
                type="number"
                required
                min={500}
                max={100000}
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Card Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-500 font-bold"
              >
                <option value="active">Active (Usable)</option>
                <option value="frozen">Frozen (Temporarily Blocked)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {isSubmitting ? 'Issuing Card...' : 'Issue & Activate Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const IssueCardModal: React.FC<IssueCardModalProps> = (props) => (
  <ErrorBoundary fallbackTitle="Issue Card Error" fallbackMessage="Could not load the Card Issuance module.">
    <IssueCardModalInner {...props} />
  </ErrorBoundary>
);
