import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, ShieldAlert, Wrench, FileText, Bell, Send, CheckCircle2 } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { Announcement } from '../../types';
import { formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const AdminAnnouncements: React.FC = () => {
  const { state, sendAnnouncement } = useBank();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'general' | 'security_alert' | 'maintenance' | 'policy_update'>('general');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'tier_1' | 'active_only'>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const announcements = state.announcements || [];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    sendAnnouncement(title, category, content, targetAudience);
    setTitle('');
    setContent('');
    setModalOpen(false);
    setSuccessMsg('Announcement successfully broadcasted to customer portal and email logs!');
    setTimeout(() => setSuccessMsg(null), 4000);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'security_alert':
        return { bg: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Security Advisory', icon: ShieldAlert };
      case 'maintenance':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Maintenance', icon: Wrench };
      case 'policy_update':
        return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Policy Update', icon: FileText };
      default:
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'General', icon: Bell };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-emerald-400" />
            <span>Announcements &amp; Bulletins Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Publish system-wide announcements, security advisories, and maintenance schedules directly to customer dashboards.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement Broadcast</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.length === 0 ? (
          <div className="col-span-2 bg-[#162032] rounded-3xl p-12 text-center border border-slate-800 text-slate-400 space-y-2">
            <Megaphone className="w-12 h-12 text-emerald-500 mx-auto opacity-50" />
            <div className="font-bold text-sm text-white">No Active Announcements</div>
            <div className="text-xs text-slate-500">Create a broadcast to notify customers instantly.</div>
          </div>
        ) : (
          announcements.map((anc) => {
            const badge = getCategoryBadge(anc.category);
            const IconComponent = badge.icon;
            return (
              <div
                key={anc.id}
                className="bg-[#162032] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1.5 ${badge.bg}`}>
                      <IconComponent className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{formatDate(anc.createdAt)}</span>
                  </div>

                  <h3 className="font-display font-bold text-white text-base">{anc.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{anc.content}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div>Audience: <strong className="text-white uppercase font-mono">{anc.targetAudience}</strong></div>
                  <div>Sent by: <strong className="text-emerald-400">{anc.sentBy}</strong></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] text-white rounded-3xl max-w-lg w-full p-6 border border-slate-700 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg">Broadcast New Announcement</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Announcement Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled System Maintenance & Security Upgrade"
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
                  >
                    <option value="general">General Information</option>
                    <option value="security_alert">Security Advisory</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="policy_update">Policy Update</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
                  >
                    <option value="all">All Customers</option>
                    <option value="tier_1">Tier 1 &amp; Above</option>
                    <option value="active_only">Active Accounts Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Content / Message</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed announcement message..."
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish &amp; Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
