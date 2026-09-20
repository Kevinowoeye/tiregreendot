import React from 'react';
import {
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Bell,
  Check,
  Award,
  Lock,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatDate } from '../../lib/utils';
import { GoldVisaCardVisual } from './GoldVisaCardVisual';

// ======================== HOW TO GET CARD ========================
export const HowToGetCardView: React.FC<{ onTabChange?: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { currentUser, state } = useBank();
  const minLoad = currentUser?.cardMinLoad || (currentUser as any)?.card_min_load || 200;
  const settings = state.appSettings;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Green Gradient Header */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1db954 0%, #178a3e 50%, #0f5127 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 bg-white/20 text-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Greendot Visa Concierge
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            How to Get &amp; Link Your Gold Visa Card
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Follow our secure 5-step retail acquisition and verification guide to unlock instant wire transfers, bill pay, and mobile recharges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Card Visual */}
        <div className="md:col-span-5 space-y-4">
          <GoldVisaCardVisual card={currentUser?.debitCard} showControls={false} />
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-amber-900">Current Card Status:</div>
            <div className="text-amber-800">
              {currentUser?.hasVisaCard !== false ? (
                <span className="text-emerald-700 font-bold">✓ Active &amp; Linked</span>
              ) : (
                <span className="text-amber-700 font-bold">⏳ Pending Verification / Not Linked</span>
              )}
            </div>
            <div className="text-[11px] text-amber-600 pt-1">
              Required Minimum Load: <span className="font-mono font-bold">${minLoad}.00</span>
            </div>
          </div>
        </div>

        {/* Right 5-Step Guide */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            5-Step Retail &amp; Verification Guide
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Find Authorized Retail Partner</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Visit any participating partner store (Walgreens, CVS, Walmart, or 7-Eleven) near you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Purchase &amp; Initial Load (${minLoad}.00)</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Acquire the Greendot Visa card pack and load the mandatory starting minimum of ${minLoad}.00 at the register. Keep your itemized receipt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Take Clear Photo</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Snap a clear photo of the back of your card showing the barcode/card number alongside your register receipt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Send to Support Concierge</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submit your photo and Customer ID ({currentUser?.customerId}) to our support desk via Email, Telegram, or phone verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Admin Verification &amp; Instant Activation</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Once verified by our underwriting desk (typically within 10-15 minutes), your card is linked and all transfer features are unlocked.
                </p>
              </div>
            </div>
          </div>

          {/* Support Contact Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-700">Need Immediate Assistance? Contact Support:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={`mailto:${settings.support_email}`}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>✉️ Email Support</span>
              </a>
              <a
                href={`https://t.me/${settings.telegram_handle}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>💬 Telegram Desk</span>
              </a>
              <a
                href={`tel:${settings.support_phone}`}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📞 Call Hotline</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================== HOW TO UPGRADE ========================
export const HowToUpgradeView: React.FC<{ onTabChange?: (tab: string) => void }> = ({
  onTabChange,
}) => {
  const { currentUser, upgradeAccountToTier1 } = useBank();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ text: string; ok: boolean } | null>(null);

  const upgradeMin = currentUser?.upgradeMinLoad || 800;
  const isTier0 = currentUser?.accountTier === 'tier_0';

  if (currentUser?.hasVisaCard === false) {
    return (
      <div className="space-y-8 max-w-4xl animate-fade-in">
        {/* Amber Gradient Prerequisite Header */}
        <div
          className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <span className="px-3 py-1 bg-white/20 text-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Prerequisite Required
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Link Your Greendot Gold Visa Card First
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Tier 1 upgrade and higher limits are available only after your Greendot Gold Visa Card has been acquired and settled.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-slate-900">Visa Card Not Yet Settled</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Tier 1 restrictions and verification procedures will activate automatically once your Greendot Gold Visa Card is verified and linked to your profile.
            </p>
          </div>
          <button
            onClick={() => onTabChange?.('how-to-get-card')}
            className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-display font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-2"
          >
            <span>Get &amp; Link Your Visa Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleUpgradeConfirm = () => {
    setFeedback(null);
    const res = upgradeAccountToTier1();
    if (res.success) {
      setFeedback({ text: res.message, ok: true });
      setTimeout(() => {
        setModalOpen(false);
        onTabChange?.('overview');
      }, 1500);
    } else {
      setFeedback({ text: res.message, ok: false });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Green Gradient Header */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1db954 0%, #178a3e 50%, #0f5127 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 bg-white/20 text-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Tier Upgrade Concierge
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Upgrade to Account Tier 1
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Unlock full wire transfers, bill pay, mobile recharges, and up to $10,000 daily transaction limits by completing our 5-step verification process.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold ${
            feedback.ok
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-red-100 text-red-900 border border-red-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Status Card */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
            <div className="font-display font-extrabold text-xl text-slate-900 uppercase">
              {currentUser?.accountTier?.replace('_', ' ') || 'Tier 0'}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Required Min. Load:</span>
              <span className="font-bold font-mono text-emerald-700">${upgradeMin}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Your Balance:</span>
              <span className="font-bold font-mono text-slate-900">${currentUser?.balance?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          {isTier0 ? (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-3.5 gradient-primary text-white font-display font-bold text-xs rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Upgrade to Tier 1 Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold">
              ✓ Tier 1 Active &amp; Verified
            </div>
          )}
        </div>

        {/* Right 5-Step Guide */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            5-Step Tier 1 Upgrade Verification Guide
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Load Minimum Balance (${upgradeMin}.00)</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Maintain at least ${upgradeMin}.00 in your Greendot account balance to qualify for Tier 1 underwriting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Utility Bill / Proof of Address</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Provide a recent utility bill, bank statement, or lease agreement matching your registered address.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">SSN / Government ID Verification</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Confirm your Social Security Number (SSN) or Tax ID for federal regulatory KYC compliance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Email &amp; Phone Verification</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ensure your contact email ({currentUser?.email}) and phone number are verified via OTP code.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Underwriter Approval &amp; Activation</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submit your upgrade request for instant underwriter review. Full transfer and payment privileges unlock immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Upgrade to Tier 1</h3>
                  <p className="text-xs text-slate-500">Instant Underwriting &amp; Activation</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Tier 1 Privileges Included:</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>$10,000 Daily Wire Transfer Limit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant Bill Pay &amp; Mobile Recharges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>4.85% APY High-Yield Savings Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Gold Visa Debit Card Privileges</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
              <div className="font-bold text-amber-900">Balance Check:</div>
              <div className="text-amber-800">
                Required: ${upgradeMin}.00 | Your Balance: ${currentUser?.balance?.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="w-1/2 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgradeConfirm}
                className="w-1/2 py-3 rounded-xl gradient-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================== NOTIFICATIONS VIEW ========================
export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useBank();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">System Notifications</h2>
          <p className="text-xs text-slate-500">
            Real-time ledger alerts, security verification notices, and account updates.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No notifications on record.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                n.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/40 hover:bg-emerald-50/60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.type === 'transaction'
                      ? 'bg-emerald-100 text-emerald-700'
                      : n.type === 'security'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-slate-400 pt-0.5">{formatDate(n.date)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
