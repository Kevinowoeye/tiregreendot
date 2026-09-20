import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Snowflake,
  Flame,
  Sliders,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { GoldVisaCardVisual } from './GoldVisaCardVisual';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const CustomerCards: React.FC<{ onTabChange?: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { currentUser, toggleCardFreeze } = useBank();
  const [dailyLimit, setDailyLimit] = useState(2500);
  const [intlEnabled, setIntlEnabled] = useState(true);
  const [atmEnabled, setAtmEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  if (!currentUser) return null;
  const card = currentUser.debitCard;
  const hasCard = Boolean(currentUser.hasVisaCard && card);

  const handleSavePreferences = () => {
    setSavedFeedback('Card limits and security preferences updated successfully.');
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  if (!hasCard) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Cardholder Services</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Debit &amp; Virtual Cards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time card controls, contactless NFC wallets, and international payment authorization.
            </p>
          </div>
        </div>

        {/* Explicit Unissued Empty State */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl shadow-slate-100/80 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
            <CreditCard className="w-10 h-10 text-slate-400" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>No Active Card / Unissued</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              No Active Card / Unissued
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              You do not have an active Visa Debit Card yet. Contact support or wait for admin authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Account Status</div>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active ({currentUser.accountTier?.toUpperCase() || 'TIER 1'})</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Card Status</div>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Unprovisioned / Inactive</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Authorization</div>
              <div className="text-xs font-bold text-slate-700">
                <span>Requires Admin Issuance</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onTabChange?.('support')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Contact Support
            </button>
            <button
              onClick={() => onTabChange?.('how-to-get-card')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              How to Request Card &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Cardholder Security &amp; Limits</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Debit &amp; Virtual Cards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Control your physical Gold Visa card, configure tokenized NFC wallets, and adjust limits in real-time.
          </p>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Card visual & Quick Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/80 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Primary Card Visual</h3>
                <p className="text-[11px] text-slate-400">EMV Contactless Visa Signature</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                Gold Metal
              </span>
            </div>

            <GoldVisaCardVisual
              card={card}
              onToggleFreeze={card ? () => toggleCardFreeze(card.id) : undefined}
            />

            {card && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Card Status:</span>
                  <span
                    className={`font-black uppercase text-[11px] px-2 py-0.5 rounded-full ${
                      card.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contactless NFC:</span>
                  <span className="font-semibold text-emerald-400">Enabled (Apple Pay / Google Pay)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Network:</span>
                  <span className="font-semibold text-white">Visa Signature 3D Secure</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 6 cols: Card Controls & Limits */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900">Card Controls &amp; Security</span>
                <p className="text-[11px] text-slate-400 font-normal">Real-time fraud prevention toggles</p>
              </div>
            </div>
          </div>

          {/* Daily Limit Slider */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800">
              <span className="text-slate-700">Daily Merchant Spending Limit</span>
              <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                {formatCurrency(dailyLimit)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>$500</span>
              <span>$7,500</span>
              <span>$15,000</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <div className="text-xs font-bold text-slate-900">Online &amp; E-Commerce Transactions</div>
                <div className="text-[11px] text-slate-500">Permit web checkout and recurring subscriptions</div>
              </div>
              <button
                type="button"
                onClick={() => setOnlineEnabled(!onlineEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  onlineEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    onlineEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <div className="text-xs font-bold text-slate-900">International Transactions</div>
                <div className="text-[11px] text-slate-500">Allow foreign currency charges (0% FX markup)</div>
              </div>
              <button
                type="button"
                onClick={() => setIntlEnabled(!intlEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  intlEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    intlEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <div className="text-xs font-bold text-slate-900">ATM Cash Withdrawals</div>
                <div className="text-[11px] text-slate-500">Enable fee-free domestic cash dispensations</div>
              </div>
              <button
                type="button"
                onClick={() => setAtmEnabled(!atmEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  atmEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    atmEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Travel Notice Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Travel Notice Management</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active Protection
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Notify Greendot Fraud Prevention before traveling abroad to ensure your cards are not interrupted.
            </p>
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5 shadow-md">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <span>✈️</span>
                  <span className="text-white">United Kingdom &amp; France</span>
                </span>
                <span className="text-emerald-400 text-[10px] font-mono font-black">VERIFIED ACTIVE</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Dates: Sep 24, 2026 – Oct 08, 2026 &bull; Cards: Visa Debit (...4820)
              </div>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-bold text-xs rounded-2xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.99]"
          >
            Save Card Settings &amp; Limits
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== BENEFICIARIES PAGE ========================
export const CustomerBeneficiaries: React.FC<{ onTabChange?: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { beneficiaries, addBeneficiary, removeBeneficiary } = useBank();
  const [form, setForm] = useState({
    accountName: '',
    accountNumber: '',
    bankName: 'JPMorgan Chase',
    routingNumber: '021000021',
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBeneficiary({
      accountName: form.accountName,
      accountNumber: form.accountNumber,
      bankName: form.bankName,
      routingNumber: form.routingNumber,
    });
    setFeedback(`Payee ${form.accountName} added successfully.`);
    setForm({
      accountName: '',
      accountNumber: '',
      bankName: 'JPMorgan Chase',
      routingNumber: '021000021',
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Payees &amp; Beneficiaries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your verified recipients for 1-click domestic wire settlement and recurring payouts.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 cols: Add Payee Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/80 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-900">Add New Beneficiary</span>
              <p className="text-[11px] text-slate-400 font-normal">Fedwire &amp; ACH Routing Profile</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700">Beneficiary Legal Name</label>
              <input
                type="text"
                required
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                placeholder="e.g. Acme Corp or Jane Smith"
                className="w-full mt-1.5 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Depository Bank Name</label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                placeholder="e.g. JPMorgan Chase"
                className="w-full mt-1.5 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Account Number</label>
              <input
                type="text"
                required
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="0482019482"
                className="w-full mt-1.5 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Routing Number (9 Digits)</label>
              <input
                type="text"
                required
                value={form.routingNumber}
                onChange={(e) => setForm({ ...form, routingNumber: e.target.value })}
                placeholder="021000021"
                className="w-full mt-1.5 p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.99]"
            >
              Save Beneficiary
            </button>
          </form>
        </div>

        {/* Right 7 cols: Beneficiaries List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-100/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-slate-900">
              Saved Payees ({beneficiaries.length})
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              ACH Verified
            </span>
          </div>

          {beneficiaries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No beneficiaries saved yet.
            </div>
          ) : (
            <div className="space-y-3">
              {beneficiaries.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 flex items-center justify-between hover:border-emerald-300 hover:bg-white transition-all shadow-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{b.accountName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.bankName} &bull; ••••{b.accountNumber.slice(-4)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTabChange?.('transfer')}
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200/60 shadow-xs"
                    >
                      Send Wire
                    </button>
                    <button
                      onClick={() => removeBeneficiary(b.id)}
                      className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 text-xs rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
