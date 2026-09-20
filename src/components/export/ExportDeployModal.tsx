import React, { useState } from 'react';
import {
  Download,
  Upload,
  Cloud,
  Server,
  Copy,
  Check,
  FileCode,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import confetti from 'canvas-confetti';

interface ExportDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDeployModal: React.FC<ExportDeployModalProps> = ({ isOpen, onClose }) => {
  const { state, exportFullStateJson, importFullStateJson } = useBank();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deploy' | 'export' | 'docker'>('deploy');

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportFullStateJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greendot-bank-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importFullStateJson(importText.trim());
    if (ok) {
      setImportStatus('Backup state imported successfully! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setImportStatus('Failed to parse state JSON. Please check formatting.');
    }
  };

  const dockerfileSnippet = `# Multi-stage Dockerfile for Greendot Bank
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;

  const dockerComposeSnippet = `version: '3.8'
services:
  greendot-bank:
    build: .
    ports:
      - "3000:80"
    restart: always
    environment:
      - NODE_ENV=production`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display text-lg font-bold">Deploy &amp; Export Site Files</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Download your website, backup customer ledgers, and deploy to any hosting provider.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'deploy'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Deploy to Cloud (Vercel / Netlify)</span>
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'docker'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Docker &amp; VPS</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup &amp; Migration</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs flex-1">
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              {/* Vercel card */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-mono font-bold">
                      ▲
                    </span>
                    <span>Option 1: Deploy to Vercel in 60 Seconds</span>
                  </div>
                  <button
                    onClick={() => handleCopy('vercel', 'npx vercel --prod')}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {copiedId === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'vercel' ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Export to GitHub or your local machine, then run the terminal command inside the project root:
                </p>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl flex justify-between items-center text-xs">
                  <span>npx vercel --prod</span>
                </div>
              </div>

              {/* Netlify card */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs font-bold">
                      N
                    </span>
                    <span>Option 2: Deploy to Netlify</span>
                  </div>
                  <button
                    onClick={() => handleCopy('netlify', 'npm run build && npx netlify-cli deploy --prod --dir=dist')}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {copiedId === 'netlify' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'netlify' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-xs">
                  npm run build &amp;&amp; npx netlify-cli deploy --prod --dir=dist
                </div>
              </div>

              {/* Render / Cloudflare pages */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-2 bg-slate-50">
                <div className="font-bold text-slate-900 text-sm">
                  Option 3: GitHub / Cloudflare Pages / Static Host
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Use the <strong>"Export to GitHub"</strong> or <strong>"Download ZIP"</strong> option from the top-right AI Studio settings menu. All project configuration (Vite, React 19, Tailwind CSS) is standalone and production-ready with zero vendor lock-in.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <p className="text-slate-600">
                You can containerize and run the banking site on any Linux VPS, AWS EC2, DigitalOcean droplet, or Kubernetes cluster:
              </p>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">Dockerfile</span>
                  <button
                    onClick={() => handleCopy('dockerfile', dockerfileSnippet)}
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1"
                  >
                    {copiedId === 'dockerfile' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Dockerfile</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {dockerfileSnippet}
                </pre>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">docker-compose.yml</span>
                  <button
                    onClick={() => handleCopy('compose', dockerComposeSnippet)}
                    className="text-xs text-emerald-700 font-bold flex items-center gap-1"
                  >
                    {copiedId === 'compose' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Compose</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {dockerComposeSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Download state backup */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Download Bank Database Snapshot (JSON)</span>
                </div>
                <p className="text-slate-600">
                  Includes all customer ledgers, transactions, active debit cards, loan portfolios, support tickets, and email audit logs in an encrypted portable format.
                </p>
                <button
                  onClick={handleDownloadBackup}
                  className="px-5 py-2.5 gradient-primary text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup File</span>
                </button>
              </div>

              {/* Import State */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-700" />
                  <span>Restore / Migrate State from JSON</span>
                </div>
                <textarea
                  rows={3}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste your JSON backup payload here to restore..."
                  className="w-full p-2.5 text-xs font-mono border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-600"
                />
                {importStatus && (
                  <div className="text-xs font-bold text-emerald-700">{importStatus}</div>
                )}
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
                >
                  Import &amp; Restore Database
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
