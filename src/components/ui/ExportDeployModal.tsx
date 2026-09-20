import React, { useState } from 'react';
import { Download, Upload, Server, Shield, Check, Copy, FileCode, RefreshCw, X, Sparkles } from 'lucide-react';
import { useBank } from '../../context/BankContext';

interface ExportDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDeployModal: React.FC<ExportDeployModalProps> = ({ isOpen, onClose }) => {
  const { exportBackupJson, importBackupJson, resetDemoData } = useBank();
  const [copied, setCopied] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'deploy' | 'sql'>('export');

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greendot-bank-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importBackupJson(content);
      if (ok) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const vercelDeploySteps = `# Deploying Greendot Bank Anywhere

### Option 1: Vercel / Netlify (Zero Configuration)
1. Export project or clone git repository
2. Run locally or link to Vercel/Netlify:
   - Build Command: npm run build
   - Output Directory: dist
   - Node Version: 18+ or 20+
3. Click Deploy! The application is fully client-contained with complete local persistence and interactive banking features.

### Option 2: Docker / Cloud Run
docker build -t greendot-bank .
docker run -p 3000:3000 greendot-bank

### Option 3: Standard Node / Static Web Server
npm install
npm run build
npx serve dist -p 3000
`;

  const supabaseSql = `-- Greendot Bank Production Supabase Schema
-- Run this in your Supabase SQL Editor if connecting a live PostgreSQL database:

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  customer_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_activation' CHECK (status IN ('active', 'frozen', 'suspended', 'closed', 'locked', 'pending_activation')),
  force_password_change BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  activation_code TEXT,
  activated_at TIMESTAMPTZ,
  has_visa_card BOOLEAN DEFAULT FALSE,
  card_min_load NUMERIC DEFAULT 200,
  transaction_pin_hash TEXT,
  account_tier TEXT DEFAULT 'tier_0' CHECK (account_tier IN ('tier_0', 'tier_1', 'tier_2', 'tier_3')),
  upgrade_min_load NUMERIC DEFAULT 800,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings', 'investment')),
  balance NUMERIC NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  reference TEXT NOT NULL UNIQUE,
  sender_name TEXT,
  balance_after NUMERIC,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  from_account_id UUID REFERENCES accounts(id),
  to_account_number TEXT NOT NULL,
  to_account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  receipt_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Download, Export & Easy Deployment</h2>
              <p className="text-xs text-slate-500">Deploy anywhere or export full database state</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-medium bg-white">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Backup &amp; Restore
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'deploy'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deployment Guide
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Supabase SQL Schema
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'export' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 leading-relaxed">
                  <strong>Zero lock-in architecture:</strong> Greendot Bank runs fully self-contained. You can download the complete database state (customers, balances, PINs, card logs, email records, settings) as a single JSON file and restore it instantly on any device or server.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-all space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">Download State Backup</h3>
                  <p className="text-xs text-slate-500">
                    Saves all accounts, transactions, debit cards, audit logs, and settings to a portable JSON file.
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download backup.json
                  </button>
                </div>

                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white transition-all space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">Restore From Backup</h3>
                  <p className="text-xs text-slate-500">
                    Upload a previously exported JSON backup to load your customers and data.
                  </p>
                  <label className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Choose JSON File</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg text-center animate-fade-in">
                  {importStatus}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-700">Restore Factory State</div>
                  <div className="text-[11px] text-slate-400">Restore primary system accounts and defaults</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset banking system to factory state?')) {
                      resetDemoData();
                      setImportStatus('System database re-initialized.');
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Quick Deploy Instructions</span>
                <button
                  onClick={() => copyToClipboard(vercelDeploySteps, 'deploy')}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {copied === 'deploy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'deploy' ? 'Copied!' : 'Copy Instructions'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {vercelDeploySteps}
              </pre>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">PostgreSQL / Supabase Migration SQL</span>
                <button
                  onClick={() => copyToClipboard(supabaseSql, 'sql')}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {copied === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'sql' ? 'Copied!' : 'Copy SQL Schema'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
                {supabaseSql}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
