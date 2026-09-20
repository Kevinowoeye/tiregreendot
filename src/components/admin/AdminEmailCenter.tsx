import React, { useState } from 'react';
import { Mail, Send, Eye, CheckCircle2, AlertCircle, Filter, Search, RefreshCw, FileText } from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { EmailLog } from '../../types';
import { formatDate } from '../../lib/utils';
import { renderBrandedEmailHtml } from '../../lib/emailTemplates';
import confetti from 'canvas-confetti';

export const AdminEmailCenter: React.FC = () => {
  const { state } = useBank();
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'composer'>('logs');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer State
  const [recipientEmail, setRecipientEmail] = useState('all'); // 'all' or specific email
  const [emailTemplate, setEmailTemplate] = useState<'activation' | 'welcome' | 'announcement' | 'debit_alert' | 'credit_alert' | 'generic'>('announcement');
  const [emailSubject, setEmailSubject] = useState('Important Security & Account Update from Greendot Bank');
  const [emailContent, setEmailContent] = useState('Please review your account security settings and ensure 2FA is enabled.');
  const [customAmount, setCustomAmount] = useState<number>(250);
  const [sendingStatus, setSendingStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Preview Modal
  const [previewLog, setPreviewLog] = useState<EmailLog | null>(null);

  // Quick Test Email State
  const [testEmailRecipient, setTestEmailRecipient] = useState('yoipioi@gmail.com');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendQuickTestEmail = async () => {
    if (!testEmailRecipient) return;
    setTestEmailSending(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmailRecipient }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailResult({
          success: true,
          message: `✓ Test email successfully delivered via ${data.provider || 'Resend'} to ${data.recipient}! (ID: ${data.messageId})`,
        });
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
      } else {
        setTestEmailResult({
          success: false,
          message: `Error: ${data.error || 'Failed to dispatch test email'}`,
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: `Network error: ${err.message || 'Transmission failed'}`,
      });
    } finally {
      setTestEmailSending(false);
    }
  };

  const emailLogs = state.emailLogs || [];

  const filteredLogs = emailLogs.filter((log) => {
    try {
      const recipient = (log.recipient || (log as any).toEmail || '').toLowerCase();
      const subject = (log.subject || '').toLowerCase();
      const type = (log.emailType || (log as any).template || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || recipient.includes(q) || subject.includes(q);
      if (filterType === 'all') return matchesSearch;
      return matchesSearch && type === filterType.toLowerCase();
    } catch {
      return false;
    }
  });

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendingStatus(null);

    try {
      const targets = recipientEmail === 'all'
        ? state.profiles.filter((p) => p.role === 'customer')
        : state.profiles.filter((p) => p.email.toLowerCase() === recipientEmail.toLowerCase());

      if (targets.length === 0) {
        setSendingStatus('Error: No matching customer recipient found.');
        setIsSending(false);
        return;
      }

      for (const target of targets) {
        const html = renderBrandedEmailHtml({
          recipientName: target.fullName,
          recipientEmail: target.email,
          type: emailTemplate,
          subject: emailSubject,
          amount: customAmount,
          balanceAfter: target.balance || 5000,
          content: emailContent,
          siteUrl: state.appSettings.site_url,
        });

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: target.email,
            subject: emailSubject,
            html,
          }),
        });
      }

      setSendingStatus(`Successfully dispatched branded email to ${targets.length} recipient(s) via SMTP!`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setSendingStatus(`Failed to send email: ${err.message || 'SMTP transmission error'}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-7 h-7 text-emerald-400" />
            <span>Email Center &amp; Transmission Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitor real-time SMTP delivery logs or compose targeted branded emails to clients.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'logs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transmission Logs ({emailLogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('composer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'composer' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Compose &amp; Broadcast
          </button>
        </div>
      </div>

      {/* Resend Integration Status & Quick Live Test */}
      <div className="bg-[#162032] border border-emerald-800/60 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm text-white">Resend API Key Connected</span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-md font-semibold">
              re_NUGE...84Ei
            </span>
            <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded-md font-semibold">
              greendotbanking.com (Verified)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Sender: Greendot Banking &lt;support@greendotbanking.com&gt;
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <div className="flex-1 relative">
            <input
              id="resend-test-email-input"
              type="email"
              value={testEmailRecipient}
              onChange={(e) => setTestEmailRecipient(e.target.value)}
              placeholder="Enter destination email (e.g. yoipioi@gmail.com)"
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
            />
          </div>
          <button
            id="resend-send-test-email-btn"
            type="button"
            onClick={handleSendQuickTestEmail}
            disabled={testEmailSending || !testEmailRecipient}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-2 flex-shrink-0"
          >
            {testEmailSending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sending Test Email...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email via Resend</span>
              </>
            )}
          </button>
        </div>

        {testEmailResult && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold border ${
              testEmailResult.success
                ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                : 'bg-red-950/60 border-red-600/50 text-red-300'
            }`}
          >
            {testEmailResult.message}
          </div>
        )}
      </div>

      {activeSubTab === 'logs' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-[#162032] p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search recipient email or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white outline-none"
              >
                <option value="all">All Email Types</option>
                <option value="activation">Activation</option>
                <option value="welcome">Welcome</option>
                <option value="announcement">Announcement</option>
                <option value="debit_alert">Debit Alert</option>
                <option value="credit_alert">Credit Alert</option>
              </select>
            </div>
          </div>

          <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Email ID</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Template Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Sent Timestamp</th>
                    <th className="py-3 px-4 text-center">Preview HTML</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No email transmission logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{log.id}</td>
                        <td className="py-3.5 px-4 text-white font-mono">{log.recipient}</td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">{log.subject}</td>
                        <td className="py-3.5 px-4 uppercase text-[10px] text-slate-400 font-mono">
                          {log.emailType}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold inline-flex items-center gap-1 ${
                              log.status === 'sent'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{log.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{formatDate(log.sentAt)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setPreviewLog(log)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Email Composer */
        <div className="bg-[#162032] rounded-3xl border border-slate-800 p-8 shadow-xl max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Compose Branded Email Broadcast</h3>
            <p className="text-xs text-slate-400">
              Deliver secure transactional or announcement emails styled with Greendot Bank emerald headers and footer.
            </p>
          </div>

          {sendingStatus && (
            <div className={`p-4 rounded-2xl text-xs font-medium border ${sendingStatus.startsWith('Successfully') ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border-red-500/30 text-red-300'}`}>
              {sendingStatus}
            </div>
          )}

          <form onSubmit={handleSendCustomEmail} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Recipient Target</label>
                <select
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
                >
                  <option value="all">Broadcast to All Active Customers ({state.profiles.filter((p) => p.role === 'customer').length})</option>
                  {state.profiles.filter((p) => p.role === 'customer').map((c) => (
                    <option key={c.userId} value={c.email}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Email Template Type</label>
                <select
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value as any)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold uppercase"
                >
                  <option value="announcement">Announcement / Bulletin</option>
                  <option value="welcome">Account Welcome</option>
                  <option value="activation">Activation Code Notice</option>
                  <option value="credit_alert">Credit / Deposit Alert</option>
                  <option value="debit_alert">Debit / Transfer Notice</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Email Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-bold"
                required
              />
            </div>

            {(emailTemplate === 'credit_alert' || emailTemplate === 'debit_alert') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Transaction Amount ($)</label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none font-mono font-bold"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">Email Body Content / Message</label>
              <textarea
                rows={5}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Transmitting via SMTP...' : 'Send Branded Email'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HTML Preview Modal */}
      {previewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-400">To: {previewLog.recipient}</div>
                <div className="font-bold text-sm">{previewLog.subject}</div>
              </div>
              <button
                onClick={() => setPreviewLog(null)}
                className="text-slate-400 hover:text-white font-bold p-1 text-base"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
              <div
                className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden"
                dangerouslySetInnerHTML={{ __html: previewLog.htmlContent }}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setPreviewLog(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
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
