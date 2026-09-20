import React, { useState } from 'react';
import { Mail, Eye, RefreshCw, Search, CheckCircle2, AlertCircle, Send, Filter, X } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { EmailLog } from '../../types';
import { formatDate, safeParseResponse } from '../../lib/utils';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const EmailLogsView: React.FC = () => {
  const { state } = useBank();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [previewEmail, setPreviewEmail] = useState<EmailLog | null>(null);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  const logs = state.emailLogs || [];

  const handleSendTestEmail = async () => {
    setTestEmailSending(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'jade66oc@gmail.com' }),
      });
      const data = await safeParseResponse<{ success?: boolean; recipient?: string; messageId?: string; error?: string }>(res);
      if (data?.success) {
        setTestEmailResult(`✓ Manual test email delivered successfully to ${data.recipient || 'jade66oc@gmail.com'} via Gmail SMTP! Message ID: ${data.messageId || 'DELIVERED'}`);
      } else {
        setTestEmailResult(`⚠️ Email delivery failed: ${data?.error || 'Server error'}`);
      }
    } catch (err: any) {
      setTestEmailResult(`⚠️ Connection error: ${err.message || 'Could not reach /api/test-email'}`);
    } finally {
      setTestEmailSending(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    try {
      const recipient = (log?.recipient || (log as any)?.toEmail || '').toLowerCase();
      const subject = (log?.subject || '').toLowerCase();
      const emailType = (log?.emailType || (log as any)?.template || '').toLowerCase();
      const query = (searchQuery || '').toLowerCase().trim();

      const matchesQuery = !query || recipient.includes(query) || subject.includes(query) || emailType.includes(query);
      const matchesType = typeFilter === 'all' || emailType === (typeFilter || '').toLowerCase();

      return matchesQuery && matchesType;
    } catch (e) {
      console.warn('Error filtering email log:', e, log);
      return false;
    }
  });

  const getRecipient = (log: EmailLog) => log?.recipient || (log as any)?.toEmail || 'greendot.bank.supportmail@gmail.com';
  const getTemplate = (log: EmailLog) => log?.emailType || (log as any)?.template || 'system';
  const getHtml = (log: EmailLog) => log?.html || (log as any)?.htmlContent || `<div style="padding:20px;font-family:sans-serif;"><h3>${log?.subject || 'Notification'}</h3><p>Sent to: ${getRecipient(log)}</p></div>`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-400" />
            <span>Email Transmission Audit Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time delivery verification for all transactional notices, wire alerts, and security credentials.
          </p>
        </div>

        <button
          onClick={handleSendTestEmail}
          disabled={testEmailSending}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{testEmailSending ? 'Dispatching via Gmail SMTP...' : 'Send Live Test Email via Gmail SMTP'}</span>
        </button>
      </div>

      {/* Test Email Result Banner */}
      {testEmailResult && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-2 animate-fade-in ${
            testEmailResult.startsWith('✓')
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
          }`}
        >
          {testEmailResult.startsWith('✓') ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          )}
          <span>{testEmailResult}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#162032] p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search email by recipient, subject, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none"
          >
            <option value="all">All Email Types</option>
            <option value="activation">Activation Links</option>
            <option value="welcome">Welcome Credentials</option>
            <option value="debit_alert">Debit Alerts</option>
            <option value="credit_alert">Credit Alerts</option>
            <option value="announcement">Announcements</option>
            <option value="support_reply">Support Replies</option>
            <option value="system">System Notices</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Template / Type</th>
                <th className="py-3 px-4">Dispatched</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Inspect Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-xs text-white">No email logs found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {searchQuery ? 'Try clearing your search query.' : 'Outbound emails will automatically appear here once dispatched.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const recipient = getRecipient(log);
                  const template = getTemplate(log);
                  let formattedDate = 'Recent';
                  try {
                    formattedDate = formatDate(log.sentAt);
                  } catch (e) {
                    formattedDate = log.sentAt || 'Recently';
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{log.id}</td>
                      <td className="py-3.5 px-4 text-white font-medium">{recipient}</td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{log.subject}</td>
                      <td className="py-3.5 px-4 uppercase text-[10px] text-slate-400 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {template}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">{formattedDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setPreviewEmail(log)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview HTML</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email HTML Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400">To: {getRecipient(previewEmail)}</div>
                <div className="font-bold text-sm">{previewEmail.subject}</div>
              </div>
              <button
                onClick={() => setPreviewEmail(null)}
                className="text-slate-400 hover:text-white font-bold p-1 text-base rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
              <div
                className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden p-2"
                dangerouslySetInnerHTML={{ __html: getHtml(previewEmail) }}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EmailLogs: React.FC = () => (
  <ErrorBoundary fallbackTitle="Email Logs Error" fallbackMessage="Could not display email audit logs. Your data is safe.">
    <EmailLogsView />
  </ErrorBoundary>
);
