import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, Download, Terminal, Clock, User, CheckCircle2 } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { AuditLog } from '../../types';
import { formatDate } from '../../lib/utils';
import confetti from 'canvas-confetti';

export const AdminAuditLogs: React.FC = () => {
  const { state } = useBank();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const logs = state.auditLogs || [];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    if (actionFilter === 'all') return matchesSearch;
    return matchesSearch && log.action.toLowerCase().includes(actionFilter.toLowerCase());
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `greendot_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-emerald-400" />
            <span>Immutable Admin Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically logged record of all administrative operations, fund adjustments, and security overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#162032] p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search admin name, target customer, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none w-full md:w-auto"
          >
            <option value="all">All Audit Actions</option>
            <option value="fund">Fund / Credit</option>
            <option value="deduct">Deduct / Debit</option>
            <option value="freeze">Freeze / Lock</option>
            <option value="kyc">KYC Verification</option>
            <option value="transfer">Transfer Approval</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Log ID / Timestamp</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Details Summary</th>
                <th className="py-3 px-4 text-center">Payload JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No audit log entries found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-400">{log.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{formatDate(log.createdAt)}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>{log.adminName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg font-mono text-[11px] text-amber-300 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{log.targetName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.targetId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {log.reason || JSON.stringify(log.details)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] text-white rounded-3xl max-w-xl w-full p-6 border border-slate-700 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-emerald-400">Audit Log Payload Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">ID: {selectedLog.id} &bull; {formatDate(selectedLog.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Actor Administrator</span>
                  <span className="font-bold text-white">{selectedLog.adminName}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 block uppercase font-bold text-[10px]">Action Type</span>
                  <span className="font-mono font-bold text-amber-400">{selectedLog.action}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-64">
                <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
