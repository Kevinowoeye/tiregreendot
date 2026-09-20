import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText, User, Mail, Search, Eye, Filter } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { CustomerProfile } from '../../types';
import { formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const AdminKYC: React.FC = () => {
  const { state, verifyKyc } = useBank();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rejection Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Document image blurry or address mismatch.');

  // Document Inspection Modal
  const [inspectCustomer, setInspectCustomer] = useState<CustomerProfile | null>(null);

  const profiles = state.profiles.filter((p) => p.role === 'customer');
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && (p.kycStatus || 'pending') === filterStatus;
  });

  const handleApprove = (userId: string, name: string) => {
    verifyKyc(userId, 'verified');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleOpenReject = (userId: string) => {
    setRejectingUserId(userId);
    setRejectionReason('Government ID image unreadable / utility bill older than 90 days.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectingUserId) return;
    verifyKyc(rejectingUserId, 'rejected');
    setRejectModalOpen(false);
    setRejectingUserId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>KYC Verification Queue</span>
          </h2>
          <p className="text-xs text-slate-400">
            Review submitted government ID photos, proof of address, and utility bills for regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search customer name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none w-64"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
          >
            <option value="all">All KYC Status</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* KYC Documents Queue Table */}
      <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer ID / Name</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4">Account Tier</th>
                <th className="py-3 px-4">Submitted Docs</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4 text-center">Inspect Files</th>
                <th className="py-3 px-4 text-center">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No customer profiles found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => {
                  const status = p.kycStatus || 'pending';
                  return (
                    <tr key={p.userId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div>{p.fullName}</div>
                        <div className="text-[10px] font-mono text-emerald-400 font-normal">
                          {p.customerId}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{p.email}</td>
                      <td className="py-3.5 px-4 uppercase font-mono text-amber-400 font-bold">
                        {p.accountTier}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5 text-xs">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Government ID &amp; Utility Bill</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Submitted {formatDate(p.createdAt)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                            status === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : status === 'rejected'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                          {status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {status === 'pending' && <AlertTriangle className="w-3 h-3" />}
                          <span>{status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setInspectCustomer(p)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Docs</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(p.userId, p.fullName)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenReject(p.userId)}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Document Modal */}
      {inspectCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] text-white rounded-3xl max-w-xl w-full p-6 border border-slate-700 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg">KYC Document Dossier</h3>
                <p className="text-xs text-slate-400">
                  {inspectCustomer.fullName} &bull; {inspectCustomer.customerId}
                </p>
              </div>
              <button
                onClick={() => setInspectCustomer(null)}
                className="text-slate-400 hover:text-white p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase">Government Photo ID</div>
                <div className="h-40 bg-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-slate-700">
                  <User className="w-12 h-12 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold text-white">US Passport / Drivers License</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1">Status: Authenticated &bull; Clear</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase">Proof of Residence (Utility Bill)</div>
                <div className="h-40 bg-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-slate-700">
                  <FileText className="w-12 h-12 text-blue-400 mb-2" />
                  <span className="text-xs font-bold text-white">Electric &amp; Water Statement</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">{inspectCustomer.address || '100 Financial Plaza, NY'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  handleApprove(inspectCustomer.userId, inspectCustomer.fullName);
                  setInspectCustomer(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Approve KYC &amp; Verify
              </button>
              <button
                onClick={() => setInspectCustomer(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Feedback Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] text-white rounded-3xl max-w-md w-full p-6 border border-slate-700 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-red-400">Provide Rejection Feedback</h3>
            <p className="text-xs text-slate-400">
              This feedback will be sent directly to the customer via secure email and notification explaining why their KYC submission was rejected.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none"
              placeholder="Enter specific reasons for rejection..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow"
              >
                Confirm Rejection &amp; Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
