import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  MapPin,
  Clock,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { formatDate } from '../../lib/utils';

interface CustomerProfileSecurityProps {
  initialTab?: 'profile' | 'security';
}

export const CustomerProfileSecurity: React.FC<CustomerProfileSecurityProps> = ({
  initialTab = 'profile',
}) => {
  const { currentUser, updateProfile, setTransactionPin, state } = useBank();
  const [tab, setTab] = useState<'profile' | 'security'>(initialTab);

  // Profile Form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '100 Financial Plaza, New York, NY');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // PIN Form state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Password Form state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, phone, address });
    setProfileMsg('Customer profile successfully saved.');
    setTimeout(() => setProfileMsg(null), 3500);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMsg({ text: 'PIN must be exactly 4 numeric digits.', ok: false });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg({ text: 'New PIN and confirmation do not match.', ok: false });
      return;
    }

    const res = setTransactionPin(newPin, currentPin);
    if (res.success) {
      setPinMsg({ text: 'Transaction PIN changed successfully.', ok: true });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinMsg({ text: res.message, ok: false });
    }
    setTimeout(() => setPinMsg(null), 4000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMsg('Password must contain at least 6 characters.');
      return;
    }
    updateProfile({ password: newPass });
    setPassMsg('Account login password updated successfully.');
    setCurrPass('');
    setNewPass('');
    setTimeout(() => setPassMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Account Settings</h2>
          <p className="text-xs text-slate-500">
            Manage your personal identity records, transaction PIN, and access credentials.
          </p>
        </div>

        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              tab === 'profile' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setTab('security')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              tab === 'security' ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-600'
            }`}
          >
            Security &amp; PIN
          </button>
        </div>
      </div>

      {tab === 'profile' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="font-display text-lg font-bold text-slate-900">{currentUser.fullName}</div>
              <div className="text-xs font-mono text-emerald-700 font-bold">{currentUser.customerId}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Member since {formatDate(currentUser.createdAt)}
              </div>
            </div>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 p-3 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Registered Email</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser.email}
                  className="w-full mt-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-3 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Residential Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 p-3 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 gradient-primary text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Update Profile Details
            </button>
          </form>
        </div>
      ) : (
        /* Security Tab */
        <div className="space-y-6">
          {/* Change PIN Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <KeyRound className="w-5 h-5 text-emerald-700" />
              <span>Change 4-Digit Transaction PIN</span>
            </div>
            <p className="text-xs text-slate-500">
              Your 4-digit PIN is required to authorize all outgoing wire transfers and bill payments.
            </p>

            {pinMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  pinMsg.ok
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {pinMsg.text}
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-3 max-w-md">
              <div>
                <label className="text-xs font-bold text-slate-700">Current PIN (Default: 1234)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="••••"
                  className="w-full mt-1 p-2.5 text-center text-sm font-mono border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">New PIN (4 Digits)</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••"
                    className="w-full mt-1 p-2.5 text-center text-sm font-mono border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Confirm New PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••"
                    className="w-full mt-1 p-2.5 text-center text-sm font-mono border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 gradient-primary text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Save New PIN
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <Lock className="w-5 h-5 text-emerald-700" />
              <span>Update Login Password</span>
            </div>

            {passMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                {passMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md">
              <div>
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full mt-1 p-2.5 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
