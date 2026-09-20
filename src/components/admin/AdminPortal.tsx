import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Banknote,
  ReceiptText,
  Mail,
  Settings,
  ShieldCheck,
  Search,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Snowflake,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Eye,
  KeyRound,
  Sparkles,
  RefreshCw,
  LogOut,
  Globe,
  Sliders,
  ChevronRight,
  Filter,
  HelpCircle,
  Megaphone,
  BarChart3,
  ShieldAlert,
  Database,
  Bot,
  Send,
  MessageSquare,
  Clock,
  User,
  Check,
} from 'lucide-react';
import { useBank } from '../../context/BankContext';
import { CustomerProfile, Transaction, Loan, AppSettings, EmailLog, AccountTier, AccountStatus } from '../../types';
import { formatCurrency, formatDate, safeParseResponse } from '../../lib/utils';
import { GreendotLogo } from '../ui/GreendotLogo';
import { AdminKYC } from './AdminKYC';
import { AdminEmailCenter } from './AdminEmailCenter';
import { AdminAnnouncements } from './AdminAnnouncements';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminAuditLogs } from './AdminAuditLogs';
import { EmailLogsView } from './EmailLogs';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import confetti from 'canvas-confetti';

interface AdminPortalProps {
  onNavigateWebsite?: () => void;
  onNavigateCustomer?: (customerId: string) => void;
  onNavigateHome?: () => void;
  initialTab?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateWebsite,
  onNavigateCustomer,
}) => {
  const {
    state,
    logout,
    updateCustomerStatus,
    updateCustomerTier,
    updateCustomerCardStatus,
    adjustCustomerBalance,
    updateCustomer,
    fundCustomer,
    deductCustomer,
    approveLoan,
    rejectLoan,
    approveTransfer,
    rejectTransfer,
    updateAppSettings,
    createCustomer,
    activateAccount,
    supportTickets,
    replySupportTicket,
    resolveSupportTicket,
    issueDebitCard,
    toggleCardFreeze,
    deleteCustomer,
    reopenAccount,
    approveCheckDeposit,
    rejectCheckDeposit,
    approveBillPayment,
    rejectBillPayment,
  } = useBank();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'customers' | 'cards' | 'transactions' | 'loans' | 'emails' | 'settings' | 'new-customer' | 'support' | 'kyc' | 'email-center' | 'announcements' | 'analytics' | 'audit-logs'
  >('overview');

  const [selectedAdminTicket, setSelectedAdminTicket] = useState<any | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [supportFilterTab, setSupportFilterTab] = useState<'all' | 'pending_human' | 'resolved'>('all');
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [adminMarkResolved, setAdminMarkResolved] = useState(false);
  const [adminTriggerEmail, setAdminTriggerEmail] = useState(true);
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);

  // Transfer Rejection Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTxId, setRejectTxId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Compliance review required / Insufficient verification');

  // Customer Mutation Dialogs State (Edit, Fund, Deduct, Freeze, Lock, Suspend, Close, Reopen, Delete)
  const [actionModal, setActionModal] = useState<
    | null
    | 'edit'
    | 'fund'
    | 'deduct'
    | 'freeze'
    | 'unfreeze'
    | 'lock'
    | 'unlock'
    | 'suspend'
    | 'reactivate'
    | 'close'
    | 'reopen'
    | 'delete'
  >(null);
  const [targetCustomer, setTargetCustomer] = useState<CustomerProfile | null>(null);
  const [mutationFeedback, setMutationFeedback] = useState<string | null>(null);

  // Form states for customer action dialogs
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    accountTier: 'tier_1' as AccountTier,
    hasVisaCard: true,
  });

  const [fundForm, setFundForm] = useState({
    amount: 2500,
    accountId: '',
    senderName: 'Federal Reserve Bank / NY Wire',
    description: 'Administrative Capital Credit',
  });

  const [deductForm, setDeductForm] = useState({
    amount: 500,
    accountId: '',
    senderName: 'Greendot Underwriting Desk',
    description: 'Administrative Ledger Debit / Fee Recall',
  });

  const [actionReason, setActionReason] = useState('');
  const [reopenForm, setReopenForm] = useState({
    accountType: 'checking' as 'checking' | 'savings' | 'investment',
    initialDeposit: 1000,
  });
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Customer Messaging state
  const [adminCustomerMsg, setAdminCustomerMsg] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Search & Filters
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState<number>(1000);
  const [balanceAdjustType, setBalanceAdjustType] = useState<'credit' | 'debit'>('credit');

  // Preview Email Modal
  const [previewEmail, setPreviewEmail] = useState<EmailLog | null>(null);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  const handleSendTestEmail = async () => {
    setTestEmailSending(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'jade66oc@gmail.com' }),
      });
      const data = await safeParseResponse(res);
      if (data.success) {
        setTestEmailResult(`✓ Test email successfully sent to ${data.recipient || 'jade66oc@gmail.com'}! Message ID: ${data.messageId || 'N/A'}`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } else {
        setTestEmailResult(`✗ Failed to send test email: ${data.error || 'Server returned error'}`);
      }
    } catch (err: any) {
      setTestEmailResult(`✗ Error: ${err.message || 'Network error'}`);
    } finally {
      setTestEmailSending(false);
    }
  };

  // New customer creation form ($0 deposit allowed)
  const [newCustForm, setNewCustForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountType: 'checking' as 'checking' | 'savings' | 'investment',
    initialDeposit: 0,
    accountTier: 'tier_1' as 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3',
    hasVisaCard: true,
  });
  const [newCustSuccess, setNewCustSuccess] = useState<string | null>(null);

  // App settings state
  const [settingsForm, setSettingsForm] = useState<AppSettings>({
    ...state.appSettings,
    site_url: state.appSettings.site_url || 'https://greendotbanking.com',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Issue & Customize Gold Visa Card state
  const [issueCardModalOpen, setIssueCardModalOpen] = useState(false);
  const [issueCardTargetCustomer, setIssueCardTargetCustomer] = useState<CustomerProfile | null>(null);
  const [issueCardForm, setIssueCardForm] = useState({
    cardNumber: '4532 8901 2345 8821',
    cardHolder: '',
    expiryMonth: '12',
    expiryYear: '29',
    cvv: '821',
    initialBalance: 2500,
    status: 'active' as 'active' | 'frozen',
  });

  // Check Deposit Underwriting state
  const [checkPreviewTx, setCheckPreviewTx] = useState<Transaction | null>(null);
  const [checkRejectModalOpen, setCheckRejectModalOpen] = useState(false);
  const [checkRejectTxId, setCheckRejectTxId] = useState<string | null>(null);
  const [checkRejectReason, setCheckRejectReason] = useState('Endorsement signature verification failed / Image illegible');
  const [txCategoryFilter, setTxCategoryFilter] = useState<'all' | 'checks' | 'wires' | 'bills'>('all');

  // Overview calculations
  const totalBankDeposits = state.profiles.reduce((acc, p) => acc + p.balance, 0);
  const totalCustomers = state.profiles.length;
  const pendingLoans = state.loans.filter((l) => l.status === 'pending');
  const pendingCheckDeposits = state.transactions.filter(
    (t) =>
      (t.category === 'mobile_deposit' || t.description?.toLowerCase().includes('check')) &&
      (t.checkStatus === 'pending' ||
        t.checkStatus === 'pending_approval' ||
        t.status === 'pending' ||
        t.status === 'pending_approval')
  );
  const pendingOutgoingTransfers = state.transactions.filter(
    (t) =>
      (t.status === 'pending' || t.status === 'pending_approval') &&
      t.category !== 'mobile_deposit' &&
      !t.description?.toLowerCase().includes('check')
  );
  const pendingTransfers = state.transactions.filter((t) => t.status === 'pending');
  const pendingBillPayments = (state.billPayments || []).filter(
    (b) => b.status === 'pending_admin_approval' || b.status === 'pending'
  );
  const activeLoans = state.loans.filter((l) => l.status === 'active');

  const [billRejectModalOpen, setBillRejectModalOpen] = useState(false);
  const [billRejectId, setBillRejectId] = useState<string | null>(null);
  const [billRejectReason, setBillRejectReason] = useState('Account reference verification failed');

  const openIssueCardModal = (c: CustomerProfile) => {
    setIssueCardTargetCustomer(c);
    const existingCard = (state.debitCards || []).find((dc) => dc.userId === c.userId);
    const customerFullName = (c?.fullName || (c as any)?.name || c?.email || 'VALUED CUSTOMER').toUpperCase();
    if (existingCard) {
      setIssueCardForm({
        cardNumber: existingCard.cardNumber,
        cardHolder: existingCard.cardHolder || customerFullName,
        expiryMonth: String(existingCard.expiryMonth || '12'),
        expiryYear: String(existingCard.expiryYear || '29'),
        cvv: existingCard.cvv || '821',
        initialBalance: existingCard.initialBalance || 2500,
        status: (existingCard.status === 'frozen' ? 'frozen' : 'active') as 'active' | 'frozen',
      });
    } else {
      const randFour = Math.floor(1000 + Math.random() * 9000);
      const randMid1 = Math.floor(1000 + Math.random() * 9000);
      const randMid2 = Math.floor(1000 + Math.random() * 9000);
      setIssueCardForm({
        cardNumber: `4532 ${randMid1} ${randMid2} ${randFour}`,
        cardHolder: customerFullName,
        expiryMonth: '12',
        expiryYear: '29',
        cvv: String(Math.floor(100 + Math.random() * 900)),
        initialBalance: 2500,
        status: 'active',
      });
    }
    setIssueCardModalOpen(true);
  };

  const handleIssueCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueCardTargetCustomer) return;
    const targetName = (issueCardTargetCustomer?.fullName || (issueCardTargetCustomer as any)?.name || 'Valued Customer');
    issueDebitCard(issueCardTargetCustomer.userId, undefined, {
      cardNumber: issueCardForm.cardNumber,
      cardHolder: issueCardForm.cardHolder.trim() || targetName.toUpperCase(),
      expiryMonth: parseInt(issueCardForm.expiryMonth, 10) || 12,
      expiryYear: parseInt(issueCardForm.expiryYear, 10) || 29,
      cvv: issueCardForm.cvv,
      status: issueCardForm.status,
      initialBalance: Number(issueCardForm.initialBalance) || 0,
    });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    setMutationFeedback(`✓ Gold Visa Card successfully issued and customized for ${targetName}!`);
    setTimeout(() => setMutationFeedback(null), 5000);
    setIssueCardModalOpen(false);

    if (selectedCustomer && selectedCustomer.userId === issueCardTargetCustomer.userId) {
      setSelectedCustomer({ ...selectedCustomer, hasVisaCard: true });
    }
  };

  const handleApproveCheck = (txId: string) => {
    approveCheckDeposit(txId);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    setMutationFeedback('✓ Check approved: First $225.00 available immediately; remaining balance scheduled to clear in 2 hours.');
    setTimeout(() => setMutationFeedback(null), 6000);
  };

  const handleRejectCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkRejectTxId) return;
    rejectCheckDeposit(checkRejectTxId, checkRejectReason);
    setCheckRejectModalOpen(false);
    setMutationFeedback(`✓ Check deposit rejected (${checkRejectReason}). Customer notified via email.`);
    setTimeout(() => setMutationFeedback(null), 5000);
  };

  const filteredCustomers = (state.profiles || []).filter(
    (p) =>
      (p?.fullName || (p as any)?.name || p?.email || '').toLowerCase().includes((customerSearch || '').toLowerCase()) ||
      (p?.email || '').toLowerCase().includes((customerSearch || '').toLowerCase()) ||
      (p?.customerId || '').toLowerCase().includes((customerSearch || '').toLowerCase())
  );

  const handleAdjustBalance = (customerId: string) => {
    const finalAmount =
      balanceAdjustType === 'credit' ? Math.abs(balanceAdjustAmount) : -Math.abs(balanceAdjustAmount);
    adjustCustomerBalance(customerId, finalAmount, `Admin Manual Ledger ${balanceAdjustType.toUpperCase()}`);
    // Refresh selected customer from state
    const updated = state.profiles.find((p) => p.customerId === customerId);
    if (updated) setSelectedCustomer(updated);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleCopyAutoLoginLink = (customer: CustomerProfile) => {
    const url = `${window.location.origin}/#autologin=${encodeURIComponent(customer.id || customer.customerId || '')}`;
    navigator.clipboard.writeText(url);
    const displayName = customer?.fullName || (customer as any)?.name || 'Customer';
    setMutationFeedback(`✓ Auto-login link for ${displayName} copied to clipboard!`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleSendAutoLoginEmail = async (customer: CustomerProfile) => {
    const url = `${window.location.origin}/#autologin=${encodeURIComponent(customer.id || customer.customerId || '')}`;
    const custName = customer?.fullName || (customer as any)?.name || customer?.email || 'Valued Customer';
    const emailHtml = `
      <div style="font-family:sans-serif; padding:24px; background:#f4f9f5; border-radius:16px; border:1px solid #22c55e; max-width:600px; margin:0 auto;">
        <h2 style="color:#0f3d1d; margin-top:0;">Your Secure Auto-Login Access Link</h2>
        <p style="color:#334155; font-size:15px; line-height:1.6;">
          Hello <strong>${custName}</strong>,<br/><br/>
          You have requested or been issued a secure one-click auto-login link for your Greendot Bank account. Click the button below to sign in instantly without entering a password:
        </p>
        <div style="text-align:center; margin:30px 0;">
          <a href="${url}" style="background:#10b981; color:#ffffff; padding:14px 28px; border-radius:12px; font-weight:bold; text-decoration:none; display:inline-block; font-size:15px;">
            Access My Banking Dashboard &rarr;
          </a>
        </div>
        <p style="color:#64748b; font-size:12px; word-break:break-all;">
          Or copy and paste this link in your browser:<br/><a href="${url}" style="color:#059669;">${url}</a>
        </p>
      </div>
    `;

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          subject: 'Greendot Bank — Your Secure Auto-Login Link',
          html: emailHtml,
        }),
      });
      const data = await safeParseResponse(res);
      if (data.success) {
        setMutationFeedback(`✓ Secure auto-login link emailed successfully to ${customer.email || 'customer'}!`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } else {
        setMutationFeedback(`✗ Failed to send email: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setMutationFeedback(`✗ Network error sending email: ${err.message}`);
    }
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  // Openers for customer mutation dialogs
  const openEditModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setEditForm({
      fullName: c?.fullName || (c as any)?.name || '',
      email: c?.email || '',
      phone: c?.phone || '',
      address: c?.address || '',
      accountTier: c?.accountTier || 'tier_1',
      hasVisaCard: c?.hasVisaCard ?? false,
    });
    setActionModal('edit');
  };

  const openFundModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    const custAccounts = state.accounts.filter((a) => a.userId === c.userId);
    setFundForm({
      amount: 2500,
      accountId: custAccounts[0]?.id || '',
      senderName: 'Federal Reserve Bank / Wire Ops',
      description: 'Capital Deposit / Treasury Wire',
    });
    setActionModal('fund');
  };

  const openDeductModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    const custAccounts = state.accounts.filter((a) => a.userId === c.userId);
    setDeductForm({
      amount: 500,
      accountId: custAccounts[0]?.id || '',
      senderName: 'Greendot Underwriting Desk',
      description: 'Administrative Recovery / Fee Offset',
    });
    setActionModal('deduct');
  };

  const openFreezeModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Suspicious transaction pattern flagged by AML rules');
    setActionModal('freeze');
  };

  const openUnfreezeModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Identity and documentation verified by compliance');
    setActionModal('unfreeze');
  };

  const openLockModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Account security lockdown initiated by administrator');
    setActionModal('lock');
  };

  const openUnlockModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Security verification completed successfully');
    setActionModal('unlock');
  };

  const openSuspendModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Regulatory compliance hold under review');
    setActionModal('suspend');
  };

  const openReactivateModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Cleared by senior compliance officer');
    setActionModal('reactivate');
  };

  const openCloseModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setActionReason('Customer relationship closed by bank administrator');
    setActionModal('close');
  };

  const openReopenModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setReopenForm({
      accountType: 'checking',
      initialDeposit: 1000,
    });
    setActionModal('reopen');
  };

  const openDeleteModal = (c: CustomerProfile) => {
    setTargetCustomer(c);
    setDeleteConfirmText('');
    setActionModal('delete');
  };

  // Submit handlers for customer mutation dialogs
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer) return;
    updateCustomer(targetCustomer.userId, editForm);
    const updated = { ...targetCustomer, ...editForm };
    if (selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(updated);
    }
    setActionModal(null);
    setMutationFeedback(`Customer ${targetCustomer.fullName} updated successfully.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer) return;
    fundCustomer(
      targetCustomer.userId,
      fundForm.accountId,
      Number(fundForm.amount),
      fundForm.senderName,
      fundForm.description
    );
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    const updated = state.profiles.find((p) => p.userId === targetCustomer.userId);
    if (updated && selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(updated);
    }
    setActionModal(null);
    setMutationFeedback(`Account funded with $${Number(fundForm.amount).toLocaleString()}.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleDeductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer) return;
    deductCustomer(
      targetCustomer.userId,
      deductForm.accountId,
      Number(deductForm.amount),
      deductForm.senderName,
      deductForm.description
    );
    const updated = state.profiles.find((p) => p.userId === targetCustomer.userId);
    if (updated && selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(updated);
    }
    setActionModal(null);
    setMutationFeedback(`Account deducted with $${Number(deductForm.amount).toLocaleString()}.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleStatusChangeSubmit = (newStatus: AccountStatus) => {
    if (!targetCustomer) return;
    updateCustomerStatus(targetCustomer.userId, newStatus, actionReason);
    const updated = { ...targetCustomer, status: newStatus };
    if (selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(updated);
    }
    setActionModal(null);
    setMutationFeedback(`Account status updated to ${newStatus.toUpperCase()}.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer) return;
    reopenAccount(targetCustomer.userId, reopenForm.accountType, Number(reopenForm.initialDeposit));
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    const updated = state.profiles.find((p) => p.userId === targetCustomer.userId);
    if (updated && selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(updated);
    }
    setActionModal(null);
    setMutationFeedback(`Account reopened with ${reopenForm.accountType} account.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE' && deleteConfirmText.trim() !== targetCustomer.customerId) {
      setMutationFeedback('Please type DELETE or the Customer ID to confirm permanent deletion.');
      return;
    }
    deleteCustomer(targetCustomer.userId);
    if (selectedCustomer?.customerId === targetCustomer.customerId) {
      setSelectedCustomer(null);
    }
    setActionModal(null);
    setMutationFeedback(`Customer profile #${targetCustomer.customerId} has been permanently deleted.`);
    setTimeout(() => setMutationFeedback(null), 4000);
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createCustomer(newCustForm);
    if (res.success) {
      setNewCustSuccess(
        `Customer profile created: ${res.customer.fullName} (#${res.customer.customerId}). Account is immediately ACTIVE with starting balance $${Number(newCustForm.initialDeposit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}. Branded credentials and magic sign-in link dispatched to ${res.customer.email}.`
      );
      setNewCustForm({
        fullName: '',
        email: '',
        phone: '',
        accountType: 'checking',
        initialDeposit: 0,
        accountTier: 'tier_1',
        hasVisaCard: true,
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setMutationFeedback(res.message || 'Failed to create customer profile.');
      setTimeout(() => setMutationFeedback(null), 4000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col lg:flex-row">
      {/* ================= ADMIN SIDEBAR ================= */}
      <aside
        className="w-full lg:w-72 bg-[#090d16] border-r border-slate-800 p-6 flex flex-col justify-between select-none box-border"
        style={{
          paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        }}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <GreendotLogo variant="light" size="sm" onClick={onNavigateWebsite} />
              <div className="text-[10px] font-bold font-mono tracking-widest text-emerald-400 mt-1 uppercase">
                Bank Operations Portal
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              KO
            </div>
            <div>
              <div className="font-bold text-white">Kevin Owoeye</div>
              <div className="text-[11px] text-emerald-400">Chief Operations Admin</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 text-xs font-medium">
            {[
              { id: 'overview', label: 'Dashboard & Metrics', icon: TrendingUp },
              { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
              { id: 'audit-logs', label: `Audit Trail (${state.auditLogs?.length || 0})`, icon: ShieldAlert },
              { id: 'customers', label: `Customers (${state.profiles.length})`, icon: Users },
              { id: 'cards', label: `Debit Cards (${state.debitCards.length})`, icon: CreditCard },
              { id: 'new-customer', label: 'Provision New Customer', icon: Plus },
              {
                id: 'transactions',
                label: 'Ledger & Deposits',
                icon: ReceiptText,
                badge: pendingOutgoingTransfers.length + pendingCheckDeposits.length,
              },
              { id: 'loans', label: 'Loan Underwriting', icon: Banknote, badge: pendingLoans.length },
              {
                id: 'support',
                label: 'AI & Live Support Desk',
                icon: HelpCircle,
                badge:
                  supportTickets.filter((t) => t.status === 'pending_human' || t.needsHumanReply).length ||
                  supportTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
              },
              {
                id: 'kyc',
                label: `KYC Queue (${state.profiles.filter((p) => p.role === 'customer' && (p.kycStatus || 'pending') === 'pending').length})`,
                icon: ShieldCheck,
                badge: state.profiles.filter((p) => p.role === 'customer' && (p.kycStatus || 'pending') === 'pending').length,
              },
              { id: 'email-center', label: 'Email Center & Composer', icon: Mail },
              { id: 'announcements', label: `Announcements (${state.announcements?.length || 0})`, icon: Megaphone },
              { id: 'emails', label: `Email Logs (${state.emailLogs.length})`, icon: ReceiptText },
              { id: 'settings', label: 'App Settings & Banners', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSelectedCustomer(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onNavigateWebsite}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Public Website</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Treasury &amp; System Health
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time bank liquidity, active depositors, and pending compliance queues.
              </p>
            </div>

            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/20 shadow-xl shadow-black/20 space-y-2 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[11px] text-emerald-400 uppercase font-black tracking-wider">
                  Total Customer Liquidity
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
                  {formatCurrency(totalBankDeposits)}
                </div>
                <div className="text-[11px] text-slate-400">Across {totalCustomers} consumer ledgers</div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl shadow-black/20 space-y-2 backdrop-blur-md">
                <div className="text-[11px] text-slate-400 uppercase font-black tracking-wider">
                  Registered Customers
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-white">
                  {totalCustomers}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  {state.profiles.filter((p) => p.status === 'active').length} Active &bull;{' '}
                  {state.profiles.filter((p) => p.status === 'pending_activation').length} Pending
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl shadow-black/20 space-y-2 backdrop-blur-md">
                <div className="text-[11px] text-amber-400 uppercase font-black tracking-wider">
                  Pending Transfers
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-amber-300">
                  {pendingTransfers.length}
                </div>
                <div className="text-[11px] text-slate-400">Awaiting underwriting approval</div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/20 shadow-xl shadow-black/20 space-y-2 backdrop-blur-md">
                <div className="text-[11px] text-blue-400 uppercase font-black tracking-wider">
                  Loan Portfolio
                </div>
                <div className="font-display text-2xl sm:text-3xl font-black text-blue-300">
                  {activeLoans.length} Active
                </div>
                <div className="text-[11px] text-amber-400 font-semibold">{pendingLoans.length} pending review</div>
              </div>
            </div>

            {/* Quick action grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Transfers Queue */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl shadow-black/20 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <h3 className="font-display font-bold text-base text-white">
                    Transfers Needing Approval ({pendingTransfers.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View Ledger &rarr;
                  </button>
                </div>

                {pendingTransfers.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    All outgoing wires are cleared.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingTransfers.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="font-bold text-white">{tx.description}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {formatDate(tx.date)} &bull; {tx.reference}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono text-xs">{formatCurrency(tx.amount)}</span>
                          <button
                            onClick={() => approveTransfer(tx.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs active:scale-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectTxId(tx.id);
                              setRejectReason('Compliance review / Treasury verification required');
                              setRejectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Loan Underwriting */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl shadow-black/20 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <h3 className="font-display font-bold text-base text-white">
                    Loan Applications Queue ({pendingLoans.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('loans')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    All Loans &rarr;
                  </button>
                </div>

                {pendingLoans.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No loan applications waiting for review.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingLoans.slice(0, 4).map((l) => (
                      <div
                        key={l.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {l.loanType} &bull; {formatCurrency(l.amount)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Term: {l.termMonths} mo &bull; Cust: {l.customerId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveLoan(l.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs active:scale-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLoan(l.id, 'Underwriter policy criteria not met')}
                            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Mobile Check Deposits Underwriting Queue */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-900/50 shadow-xl shadow-black/20 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-display font-bold text-base text-white">
                      Mobile Check Deposits Underwriting Queue ({pendingCheckDeposits.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setTxCategoryFilter('checks');
                      setActiveTab('transactions');
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    View All Checks &rarr;
                  </button>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Expedited Check Clearing Policy:</strong> Approving credits funds directly to customer&apos;s available balance (processing estimate: ~30 mins).
                    </span>
                  </div>
                </div>

                {pendingCheckDeposits.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No check deposits waiting for review. All cleared.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingCheckDeposits.slice(0, 6).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{tx.description}</span>
                            {tx.checkNumber && (
                              <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                                Check #{tx.checkNumber}
                              </span>
                            )}
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                              Underwriting Pending
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                            <span>Cust: {tx.customerId}</span>
                            <span>&bull;</span>
                            <span>{formatDate(tx.date)}</span>
                            <span>&bull;</span>
                            <span>Ref: {tx.reference}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                            <span className="text-emerald-400 font-bold">
                              Deposit: {formatCurrency(tx.amount)}
                            </span>
                            <span>&bull;</span>
                            <span className="text-amber-300">
                              Est. Clearance: {tx.estimatedProcessingTime || '~30 mins'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-white font-mono text-sm mr-1">
                            {formatCurrency(tx.amount)}
                          </span>
                          {(tx.frontImage || tx.backImage) && (
                            <button
                              onClick={() => setCheckPreviewTx(tx)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1 active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Check</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleApproveCheck(tx.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Deposit</span>
                          </button>
                          <button
                            onClick={() => {
                              setCheckRejectTxId(tx.id);
                              setCheckRejectReason('Endorsement signature mismatch / Check image illegible');
                              setCheckRejectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Bill Payments Underwriting Queue */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-900/50 shadow-xl shadow-black/20 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="font-display font-bold text-base text-white">
                      Pending Bill Payments Queue ({pendingBillPayments.length})
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Admin Approval Required:</strong> Approving bill payments will deduct the payment amount from the customer&apos;s available account balance.
                    </span>
                  </div>
                </div>

                {pendingBillPayments.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    No bill payments waiting for review. All cleared.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingBillPayments.map((bill) => (
                      <div
                        key={bill.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{bill.billerName}</span>
                            <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                              Ref: {bill.accountReference}
                            </span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                              Pending Approval
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                            <span>User: {bill.userId}</span>
                            <span>&bull;</span>
                            <span>{formatDate(bill.createdAt)}</span>
                            <span>&bull;</span>
                            <span>Category: {bill.billerCategory}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                            <span className="text-emerald-400 font-bold">
                              Amount: {formatCurrency(bill.amount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-white font-mono text-sm mr-1">
                            {formatCurrency(bill.amount)}
                          </span>
                          <button
                            onClick={() => approveBillPayment(bill.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Payment</span>
                          </button>
                          <button
                            onClick={() => {
                              setBillRejectId(bill.id);
                              setBillRejectReason('Account reference validation failed');
                              setBillRejectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMERS MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Customer Records Management</h2>
                <p className="text-xs text-slate-400">
                  Inspect ledgers, adjust balance, override tiers, and issue or freeze cards.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('new-customer')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Provision Customer</span>
              </button>
            </div>

            {/* Search input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search customers by name, email, or ID..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
              />
            </div>

            {/* Customers Table */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Customer Name / ID</th>
                      <th className="py-4 px-5">Email</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5">Tier</th>
                      <th className="py-4 px-5">Gold Card</th>
                      <th className="py-4 px-5 text-right">Balance</th>
                      <th className="py-4 px-5 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCustomers.map((c) => (
                      <tr key={c.customerId || c.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-white">
                          <div className="font-semibold text-slate-100">{c.fullName || (c as any)?.name || 'Valued Customer'}</div>
                          <div className="text-[10px] font-mono text-emerald-400 font-normal">
                            {c.customerId || 'N/A'}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-slate-300 font-mono text-[11px]">{c.email || 'N/A'}</td>

                        <td className="py-4 px-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider ${
                              c.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : c.status === 'pending_activation'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : c.status === 'frozen'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-red-500/20 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {c.status || 'active'}
                          </span>
                        </td>

                        <td className="py-4 px-5 font-mono uppercase text-slate-300 text-xs font-semibold">
                          {c.accountTier || 'tier_1'}
                        </td>

                        <td className="py-4 px-5">
                          {c.debitCard ? (
                            <span className="text-amber-300 font-black text-[11px] flex items-center gap-1.5 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20 w-max">
                              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                              <span>{c.debitCard.status || 'active'}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Unprovisioned</span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right font-mono font-black text-white text-sm">
                          {formatCurrency(c?.balance ?? 0)}
                        </td>

                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedCustomer(c)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => openFundModal(c)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                              title="Credit customer account"
                            >
                              + Fund
                            </button>
                            <button
                              onClick={() => openEditModal(c)}
                              className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                              title="Edit customer details"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Selected Customer Full Management Panel */}
            {selectedCustomer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#162032] rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-700 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-700">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">
                        Customer #{selectedCustomer.customerId || 'N/A'}
                      </h3>
                      <div className="text-xs text-emerald-400">
                        {selectedCustomer.fullName || (selectedCustomer as any)?.name || 'Valued Customer'} &bull; {selectedCustomer.email || 'N/A'}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-slate-400 hover:text-white p-1 text-base font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Customer Snapshot */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Current Balance</div>
                      <div className="font-mono text-lg font-bold text-emerald-400">
                        {formatCurrency(selectedCustomer.balance)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Status</div>
                      <div className="font-bold text-xs uppercase text-white mt-1">
                        {selectedCustomer.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Account Tier</div>
                      <div className="font-mono text-xs text-amber-400 font-bold uppercase mt-1">
                        {selectedCustomer.accountTier}
                      </div>
                    </div>
                  </div>

                  {/* Administrative Operations Command Suite */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Administrative Command Center (12 Core Operations)
                      </h4>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Audit Log Enforced
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => openEditModal(selectedCustomer)}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-slate-700"
                      >
                        <span className="text-blue-400">✏️ Edit Profile</span>
                        <span className="text-[10px] text-slate-400 font-normal">KYC, Tier, Visa</span>
                      </button>

                      <button
                        onClick={() => openFundModal(selectedCustomer)}
                        className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-emerald-700/50"
                      >
                        <span className="text-emerald-400">💵 Fund Account</span>
                        <span className="text-[10px] text-emerald-200/60 font-normal">+ Inflow Credit</span>
                      </button>

                      <button
                        onClick={() => openDeductModal(selectedCustomer)}
                        className="p-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-red-700/50"
                      >
                        <span className="text-red-400">💸 Deduct Funds</span>
                        <span className="text-[10px] text-red-200/60 font-normal">- Ledger Debit</span>
                      </button>

                      <button
                        onClick={() => handleCopyAutoLoginLink(selectedCustomer)}
                        className="p-2.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-emerald-600/50"
                      >
                        <span className="text-emerald-400">🔗 Copy Auto-Login</span>
                        <span className="text-[10px] text-emerald-300/70 font-normal">One-Click Magic Link</span>
                      </button>

                      <button
                        onClick={() => handleSendAutoLoginEmail(selectedCustomer)}
                        className="p-2.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-cyan-600/50"
                      >
                        <span className="text-cyan-400">✉️ Email Auto-Login</span>
                        <span className="text-[10px] text-cyan-300/70 font-normal">Dispatch Magic Link</span>
                      </button>

                      {selectedCustomer.status === 'frozen' ? (
                        <button
                          onClick={() => openUnfreezeModal(selectedCustomer)}
                          className="p-2.5 bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-cyan-700/60"
                        >
                          <span className="text-cyan-400">🔓 Unfreeze</span>
                          <span className="text-[10px] text-cyan-200/60 font-normal">Restore Transfers</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openFreezeModal(selectedCustomer)}
                          className="p-2.5 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-blue-700/50"
                        >
                          <span className="text-blue-400">❄️ Freeze</span>
                          <span className="text-[10px] text-blue-200/60 font-normal">Halt Outflows</span>
                        </button>
                      )}

                      {selectedCustomer.status === 'locked' ? (
                        <button
                          onClick={() => openUnlockModal(selectedCustomer)}
                          className="p-2.5 bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-amber-700/60"
                        >
                          <span className="text-amber-400">🔑 Unlock</span>
                          <span className="text-[10px] text-amber-200/60 font-normal">Clear Sec Lock</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openLockModal(selectedCustomer)}
                          className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-amber-700/50"
                        >
                          <span className="text-amber-400">🔒 Lock Account</span>
                          <span className="text-[10px] text-amber-200/60 font-normal">Security Hold</span>
                        </button>
                      )}

                      {selectedCustomer.status === 'suspended' ? (
                        <button
                          onClick={() => openReactivateModal(selectedCustomer)}
                          className="p-2.5 bg-purple-950/50 hover:bg-purple-900/70 text-purple-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-purple-700/60"
                        >
                          <span className="text-purple-400">▶️ Reactivate</span>
                          <span className="text-[10px] text-purple-200/60 font-normal">Clear Compliance</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openSuspendModal(selectedCustomer)}
                          className="p-2.5 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-purple-700/50"
                        >
                          <span className="text-purple-400">⏸️ Suspend</span>
                          <span className="text-[10px] text-purple-200/60 font-normal">Compliance Review</span>
                        </button>
                      )}

                      {selectedCustomer.status === 'closed' ? (
                        <button
                          onClick={() => openReopenModal(selectedCustomer)}
                          className="p-2.5 bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-emerald-700/60"
                        >
                          <span className="text-emerald-400">🔄 Reopen Account</span>
                          <span className="text-[10px] text-emerald-200/60 font-normal">Restore Customer</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => openCloseModal(selectedCustomer)}
                          className="p-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-rose-700/50"
                        >
                          <span className="text-rose-400">❌ Close Account</span>
                          <span className="text-[10px] text-rose-200/60 font-normal">End Relationship</span>
                        </button>
                      )}

                      <button
                        onClick={() => openDeleteModal(selectedCustomer)}
                        className="p-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-1 border border-red-600/70"
                      >
                        <span className="text-red-300">🗑️ Delete Record</span>
                        <span className="text-[10px] text-red-300/70 font-normal">Hard Purge</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Balance Adjustment Control */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Quick Balance Adjustment (Ledger Inflow/Outflow)
                    </h4>
                    <div className="flex gap-2">
                      <select
                        value={balanceAdjustType}
                        onChange={(e) => setBalanceAdjustType(e.target.value as any)}
                        className="p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl font-bold text-white outline-none"
                      >
                        <option value="credit">+ Credit (Deposit)</option>
                        <option value="debit">- Debit (Withdrawal)</option>
                      </select>
                      <input
                        type="number"
                        min="1"
                        step="50"
                        value={balanceAdjustAmount}
                        onChange={(e) => setBalanceAdjustAmount(Number(e.target.value))}
                        className="flex-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
                      />
                      <button
                        onClick={() => handleAdjustBalance(selectedCustomer.customerId)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Execute
                      </button>
                    </div>
                  </div>

                  {/* Status & Tier Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">Override Status</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['active', 'frozen', 'locked', 'suspended'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              updateCustomerStatus(selectedCustomer.customerId, st);
                              setSelectedCustomer({ ...selectedCustomer, status: st });
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all ${
                              selectedCustomer.status === st
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">Account Tier</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(['tier_0', 'tier_1', 'tier_2', 'tier_3'] as const).map((tr) => (
                          <button
                            key={tr}
                            onClick={() => {
                              updateCustomerTier(selectedCustomer.customerId, tr);
                              setSelectedCustomer({ ...selectedCustomer, accountTier: tr });
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all ${
                              selectedCustomer.accountTier === tr
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {tr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">Greendot Gold Visa Card</label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            const newStatus = !selectedCustomer.hasVisaCard;
                            updateCustomerCardStatus(selectedCustomer.customerId, newStatus);
                            setSelectedCustomer({ ...selectedCustomer, hasVisaCard: newStatus });
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all flex items-center gap-1.5 ${
                            selectedCustomer.hasVisaCard
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{selectedCustomer.hasVisaCard ? '✓ Card Settled & Linked' : '⏳ Card Not Linked'}</span>
                        </button>
                        <button
                          onClick={() => openIssueCardModal(selectedCustomer)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-lg shadow transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{selectedCustomer.hasVisaCard ? 'Customize / Reissue Card' : 'Issue Gold Visa Card'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activation info if pending */}
                  {selectedCustomer.status === 'pending_activation' && selectedCustomer.activationCode && (
                    <div className="p-3 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-amber-300">Pending Activation Code:</div>
                      <div className="font-mono text-base font-black text-white">
                        {selectedCustomer.activationCode}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Enter this code on the public Activate Account page or provide to client.
                      </div>
                    </div>
                  )}

                  {/* Send Admin Message / Notification */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Send Direct Message / Notification
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type notification message to customer..."
                        value={adminCustomerMsg}
                        onChange={(e) => setAdminCustomerMsg(e.target.value)}
                        className="flex-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!adminCustomerMsg.trim()) return;
                          setMsgSentSuccess(true);
                          setTimeout(() => setMsgSentSuccess(false), 3000);
                          setAdminCustomerMsg('');
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                      >
                        Send
                      </button>
                    </div>
                    {msgSentSuccess && (
                      <div className="text-[11px] text-emerald-400 font-bold">✓ Message dispatched to customer inbox.</div>
                    )}
                  </div>

                  {/* Account Lifecycle (Close / Reopen) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">Account Lifecycle Management</div>
                      <div className="text-[11px] text-slate-400">Permanently close or reopen customer relationship</div>
                    </div>
                    <div className="flex gap-2">
                      {selectedCustomer.status !== 'closed' ? (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to close this account?')) {
                              deleteCustomer(selectedCustomer.userId);
                              setSelectedCustomer(null);
                            }
                          }}
                          className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
                        >
                          Close Account
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            reopenAccount(selectedCustomer.userId, 'checking', 1000);
                            setSelectedCustomer(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                        >
                          Reopen Account
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Shortcut to switch into this customer account */}
                  <div className="pt-2 border-t border-slate-700 flex justify-between">
                    <button
                      onClick={() => onNavigateCustomer(selectedCustomer.customerId)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Launch Customer View</span>
                    </button>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NEW CUSTOMER PROVISIONING */}
        {activeTab === 'new-customer' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Provision New Customer Account</h2>
              <p className="text-xs text-slate-400">
                Register a new client ledger with immediate active status, configure starting tier, and dispatch magic login credentials.
              </p>
            </div>

            {newCustSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold rounded-2xl space-y-1">
                <div className="font-bold">✓ Account Successfully Provisioned!</div>
                <div>{newCustSuccess}</div>
              </div>
            )}

            <form onSubmit={handleCreateCustomerSubmit} className="bg-[#162032] rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Legal Full Name</label>
                <input
                  type="text"
                  required
                  value={newCustForm.fullName}
                  onChange={(e) => setNewCustForm({ ...newCustForm, fullName: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full mt-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                    placeholder="marcus.vance@example.com"
                    className="w-full mt-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                    placeholder="+1 (555) 391-4902"
                    className="w-full mt-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">Initial Deposit ($ USD)</label>
                    <span className="text-[10px] text-emerald-400 font-bold">$0 Minimum Allowed</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newCustForm.initialDeposit}
                    onChange={(e) => setNewCustForm({ ...newCustForm, initialDeposit: e.target.value === '' ? 0 : Number(e.target.value) })}
                    placeholder="0.00"
                    className="w-full mt-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Account can be initialized with $0.00 opening ledger balance.</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Initial Account Tier</label>
                  <select
                    value={newCustForm.accountTier}
                    onChange={(e) => setNewCustForm({ ...newCustForm, accountTier: e.target.value as any })}
                    className="w-full mt-1 p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
                  >
                    <option value="tier_0">Tier 0 - Basic ($0)</option>
                    <option value="tier_1">Tier 1 - Standard Verified ($800)</option>
                    <option value="tier_2">Tier 2 - Gold Privileged ($10,000)</option>
                    <option value="tier_3">Tier 3 - Private Wealth ($100,000)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Provision Account &amp; Dispatch Credentials
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TRANSACTIONS & LEDGER */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Bank-Wide Transaction Audit</h2>
                <p className="text-xs text-slate-400">
                  Audit domestic wires, mobile check deposits, bill payments, and merchant debits.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                {[
                  { id: 'all', label: `All (${state.transactions.length})` },
                  {
                    id: 'checks',
                    label: `Check Deposits (${
                      state.transactions.filter(
                        (t) => t.category === 'mobile_deposit' || t.description?.toLowerCase().includes('check')
                      ).length
                    })`,
                  },
                  {
                    id: 'wires',
                    label: `Outgoing Wires (${
                      state.transactions.filter(
                        (t) => t.category === 'transfer' || t.description?.toLowerCase().includes('wire')
                      ).length
                    })`,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTxCategoryFilter(f.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      txCategoryFilter === f.id
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">TX ID / Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Description &amp; Items</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status &amp; Holds</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {state.transactions
                      .filter((tx) => {
                        if (txCategoryFilter === 'checks') {
                          return tx.category === 'mobile_deposit' || tx.description?.toLowerCase().includes('check');
                        }
                        if (txCategoryFilter === 'wires') {
                          return tx.category === 'transfer' || tx.description?.toLowerCase().includes('wire');
                        }
                        return true;
                      })
                      .map((tx) => {
                        const isCheck =
                          tx.category === 'mobile_deposit' || tx.description?.toLowerCase().includes('check');
                        const isPendingCheck =
                          isCheck &&
                          (tx.checkStatus === 'pending' || (tx.status === 'pending' && tx.category === 'mobile_deposit'));

                        return (
                          <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                              {tx.id}
                              <div className="text-[10px] text-slate-500">{tx.reference}</div>
                            </td>
                            <td className="py-3.5 px-4 text-white font-medium">{tx.customerId}</td>
                            <td className="py-3.5 px-4 text-slate-300">
                              <div className="font-semibold text-white">{tx.description}</div>
                              {isCheck && tx.checkNumber && (
                                <div className="text-[11px] text-amber-300/90 font-mono">
                                  Check #{tx.checkNumber}
                                </div>
                              )}
                              {(tx.frontImage || tx.backImage) && (
                                <button
                                  onClick={() => setCheckPreviewTx(tx)}
                                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect Check Images</span>
                                </button>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{formatDate(tx.date)}</td>
                            <td className="py-3.5 px-4">
                              {isCheck ? (
                                <div className="space-y-1">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                      tx.checkStatus === 'approved_split'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : tx.checkStatus === 'cleared_full' || tx.status === 'completed'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : tx.status === 'rejected' || tx.checkStatus === 'rejected'
                                        ? 'bg-red-500/20 text-red-300'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    {tx.checkStatus === 'approved_split'
                                      ? 'Approved (Split 2hr)'
                                      : tx.checkStatus === 'cleared_full' || tx.status === 'completed'
                                      ? 'Cleared Full'
                                      : tx.status === 'rejected' || tx.checkStatus === 'rejected'
                                      ? 'Rejected'
                                      : 'Underwriting Pending'}
                                  </span>
                                  {tx.checkStatus === 'approved_split' && (
                                    <div className="text-[10px] text-slate-400">
                                      $225.00 immediate, remainder clears in 2h
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                    tx.status === 'completed'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : tx.status === 'pending'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-red-500/20 text-red-300'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                              {formatCurrency(tx.amount)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {isPendingCheck ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleApproveCheck(tx.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow transition-all active:scale-95"
                                  >
                                    Approve Check
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCheckRejectTxId(tx.id);
                                      setCheckRejectReason('Endorsement signature mismatch / Check image illegible');
                                      setCheckRejectModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-[10px] transition-all active:scale-95"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : tx.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => approveTransfer(tx.id)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                                  >
                                    Clear Wire
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectTxId(tx.id);
                                      setRejectModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded text-[10px]"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono">Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOANS UNDERWRITING */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Loan Portfolio &amp; Underwriting</h2>
              <p className="text-xs text-slate-400">
                Review loan applications, approve credit disbursement, and monitor repayment terms.
              </p>
            </div>

            <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Loan ID / Customer</th>
                      <th className="py-3 px-4">Type &amp; Purpose</th>
                      <th className="py-3 px-4">Term</th>
                      <th className="py-3 px-4">Rate</th>
                      <th className="py-3 px-4">Monthly Due</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Principal</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {state.loans.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div>{l.id}</div>
                          <div className="text-[10px] font-mono text-emerald-400 font-normal">
                            {l.customerId}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="font-bold">{l.loanType}</div>
                          <div className="text-[10px] text-slate-500">{l.purpose}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">{l.termMonths} mo</td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono">{l.interestRate}%</td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono font-bold">
                          {formatCurrency(l.monthlyPayment)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                              l.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : l.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                          {formatCurrency(l.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {l.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => approveLoan(l.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectLoan(l.id, 'Declined by Administrator')}
                                className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded text-[10px]"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500">Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CARDS: DEBIT CARDS PORTFOLIO */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Debit Card Portfolio &amp; Issuance</h2>
                <p className="text-xs text-slate-400">
                  Manage Gold Visa cards across all customers, issue custom cards, freeze, or unfreeze.
                </p>
              </div>
              {state.profiles.filter((p) => p.role === 'customer').length > 0 && (
                <button
                  onClick={() => {
                    const firstCust = state.profiles.find((p) => p.role === 'customer')!;
                    openIssueCardModal(firstCust);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Issue Custom Gold Visa Card</span>
                </button>
              )}
            </div>

            <div className="bg-[#162032] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Card ID / Holder</th>
                      <th className="py-3 px-4">Card Number</th>
                      <th className="py-3 px-4">Expiry / CVV</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Customer ID</th>
                      <th className="py-3 px-4 text-center">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {state.debitCards.map((c) => {
                      const cardOwner = state.profiles.find((p) => p.userId === c.userId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div>{c.id}</div>
                            <div className="text-[10px] text-amber-400 font-normal">{c.cardHolder}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{c.cardNumber}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {c.expiryMonth}/{c.expiryYear} &bull; CVV: {c.cvv}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                c.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {cardOwner ? `${cardOwner.fullName || (cardOwner as any)?.name || 'Customer'} (${c.userId})` : c.userId}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {cardOwner && (
                                <button
                                  onClick={() => openIssueCardModal(cardOwner)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition-colors flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                              <button
                                onClick={() => toggleCardFreeze(c.id)}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                  c.status === 'active'
                                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {c.status === 'active' ? 'Freeze' : 'Unfreeze'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* KYC VERIFICATION QUEUE TAB */}
        {activeTab === 'kyc' && (
          <ErrorBoundary fallbackTitle="KYC Verification Queue Error">
            <AdminKYC />
          </ErrorBoundary>
        )}

        {/* EMAIL CENTER & COMPOSER TAB */}
        {activeTab === 'email-center' && (
          <ErrorBoundary fallbackTitle="Email Center Error">
            <AdminEmailCenter />
          </ErrorBoundary>
        )}

        {/* ANNOUNCEMENTS ENGINE TAB */}
        {activeTab === 'announcements' && (
          <ErrorBoundary fallbackTitle="Announcements Engine Error">
            <AdminAnnouncements />
          </ErrorBoundary>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <ErrorBoundary fallbackTitle="Analytics Dashboard Error">
            <AdminAnalytics />
          </ErrorBoundary>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'audit-logs' && (
          <ErrorBoundary fallbackTitle="Audit Logs Error">
            <AdminAuditLogs />
          </ErrorBoundary>
        )}

        {/* TAB 6: EMAIL LOGS VIEWER & HTML PREVIEW */}
        {activeTab === 'emails' && (
          <ErrorBoundary fallbackTitle="Email Transmissions Error" fallbackMessage="Could not display the email transmissions list.">
            <EmailLogsView />
          </ErrorBoundary>
        )}

        {/* TAB 8: AI & LIVE SUPPORT DESK */}
        {activeTab === 'support' && (
          <div className="space-y-6 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/60 mb-2">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Real-Time AI &amp; Human Support Operations</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">AI &amp; Live Support Desk</h2>
                <p className="text-xs text-slate-400">
                  Inspect customer AI chat logs, prioritize escalations requiring human replies within 2 hours, and dispatch direct responses.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-3">
                <div className="bg-[#162032] border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Pending Human Reply</div>
                  <div className="text-lg font-bold text-amber-400 font-mono flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    {supportTickets.filter((t) => t.status === 'pending_human' || t.needsHumanReply).length}
                  </div>
                </div>
                <div className="bg-[#162032] border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Inquiries</div>
                  <div className="text-lg font-bold text-white font-mono">{supportTickets.length}</div>
                </div>
              </div>
            </div>

            {/* Support Desk Controls: Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#162032] p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSupportFilterTab('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    supportFilterTab === 'all'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>All Inquiries ({supportTickets.length})</span>
                </button>

                <button
                  onClick={() => setSupportFilterTab('pending_human')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    supportFilterTab === 'pending_human'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Pending Human Reply (
                    {supportTickets.filter((t) => t.status === 'pending_human' || t.needsHumanReply).length}
                    )
                  </span>
                </button>

                <button
                  onClick={() => setSupportFilterTab('resolved')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    supportFilterTab === 'resolved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Resolved ({supportTickets.filter((t) => t.status === 'resolved').length})
                  </span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer, ID, or text..."
                  value={supportSearchQuery}
                  onChange={(e) => setSupportSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Feedback Alert */}
            {supportFeedback && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{supportFeedback}</span>
              </div>
            )}

            {/* Two-Panel Layout: Conversation List (Left) & Transcript / Response (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Conversation Queue */}
              <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {(() => {
                  const filtered = supportTickets
                    .filter((t) => {
                      if (supportFilterTab === 'pending_human') {
                        return t.status === 'pending_human' || t.needsHumanReply;
                      }
                      if (supportFilterTab === 'resolved') {
                        return t.status === 'resolved';
                      }
                      return true;
                    })
                    .filter((t) => {
                      if (!supportSearchQuery || !supportSearchQuery.trim()) return true;
                      const q = (supportSearchQuery || '').toLowerCase();
                      return (
                        (t.userName || '').toLowerCase().includes(q) ||
                        (t.userEmail || '').toLowerCase().includes(q) ||
                        (t.customerId || '').toLowerCase().includes(q) ||
                        (t.id || '').toLowerCase().includes(q) ||
                        (t.subject || '').toLowerCase().includes(q) ||
                        (t.message || '').toLowerCase().includes(q)
                      );
                    });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-[#162032] rounded-3xl p-10 text-center border border-slate-800 text-slate-400 space-y-2">
                        <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                        <div className="font-bold text-xs text-white">No Inquiries Found</div>
                        <div className="text-[11px] text-slate-500">
                          {supportFilterTab === 'pending_human'
                            ? 'No conversations currently waiting for human intervention.'
                            : 'No tickets match the active search criteria.'}
                        </div>
                      </div>
                    );
                  }

                  return filtered.map((t) => {
                    const isSelected = selectedAdminTicket?.id === t.id;
                    const isPendingHuman = t.status === 'pending_human' || t.needsHumanReply;
                    const isResolved = t.status === 'resolved';
                    const customerProfile = state.profiles.find((p) => p.id === t.userId || p.customerId === t.customerId);
                    const hasVisa = !!customerProfile?.hasVisaCard;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedAdminTicket(t)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-[#1b273d] border-emerald-500 shadow-md shadow-emerald-950/40'
                            : 'bg-[#162032] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Top info line */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                              {t.id}
                            </span>
                            {t.channel === 'ai_chat' ? (
                              <span className="text-[10px] font-bold text-purple-300 bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded">
                                AI Chat
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                Ticket
                              </span>
                            )}
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isPendingHuman
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : isResolved
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-blue-950 text-blue-300 border border-blue-800'
                            }`}
                          >
                            {isPendingHuman && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                            {isPendingHuman ? 'Pending Human' : isResolved ? 'Resolved' : 'In Progress'}
                          </span>
                        </div>

                        {/* Customer line */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-bold text-white truncate">
                            {t.userName} <span className="text-[10px] text-slate-400 font-mono">({t.customerId || 'ID'})</span>
                          </div>
                          {hasVisa ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                              Gold Visa
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                              No Card
                            </span>
                          )}
                        </div>

                        {/* Subject / Snippet */}
                        <div className="text-xs text-slate-300 font-medium truncate">{t.subject}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2">{t.message}</div>

                        {/* Timestamp & replies info */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                          <span>{formatDate(t.createdAt)}</span>
                          <span className="font-bold text-emerald-400">
                            {t.replies?.length || 0} messages &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                })()}
              </div>

              {/* Right 7 Cols: Transcript View & Admin Response Box */}
              <div className="lg:col-span-7 bg-[#162032] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                {selectedAdminTicket ? (
                  <div className="flex flex-col h-[750px]">
                    {/* Transcript Header */}
                    <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#131b2b] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                            {selectedAdminTicket.id}
                          </span>
                          <h3 className="font-display font-bold text-sm text-white">
                            {selectedAdminTicket.userName}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">
                            {selectedAdminTicket.customerId || 'CUST-ID'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          <span>{selectedAdminTicket.userEmail}</span>
                          <span>&bull;</span>
                          <span className="font-bold text-slate-300 truncate">
                            {selectedAdminTicket.subject}
                          </span>
                        </div>
                      </div>

                      {/* Quick Status / Resolve Button */}
                      <div className="flex items-center gap-2">
                        {selectedAdminTicket.status !== 'resolved' ? (
                          <button
                            type="button"
                            onClick={() => {
                              resolveSupportTicket(selectedAdminTicket.id, undefined, adminTriggerEmail);
                              const updated = supportTickets.find((t) => t.id === selectedAdminTicket.id);
                              if (updated) setSelectedAdminTicket({ ...updated, status: 'resolved' });
                              setSupportFeedback('✓ Ticket marked as resolved.');
                              setTimeout(() => setSupportFeedback(null), 4000);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Transcript Scroll Area */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
                      {/* Initial Ticket/Chat Prompt */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs shadow-sm">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {selectedAdminTicket.userName} (Customer Initial Inquiry)
                          </span>
                          <span className="text-slate-500">{formatDate(selectedAdminTicket.createdAt)}</span>
                        </div>
                        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {selectedAdminTicket.message}
                        </p>
                      </div>

                      {/* Replies stream */}
                      {selectedAdminTicket.replies?.map((rep: any, idx: number) => {
                        const isAI = rep.sender === 'ai';
                        const isSupport = rep.sender === 'support';
                        const isUser = rep.sender === 'user';

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border text-xs space-y-1.5 shadow-sm ${
                              isSupport
                                ? 'bg-blue-950/40 border-blue-800 ml-6'
                                : isAI
                                ? 'bg-emerald-950/30 border-emerald-800/80 ml-6'
                                : 'bg-slate-900 border-slate-800 mr-6'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span
                                className={`font-bold flex items-center gap-1.5 ${
                                  isSupport
                                    ? 'text-blue-300'
                                    : isAI
                                    ? 'text-emerald-300'
                                    : 'text-slate-300'
                                }`}
                              >
                                {isSupport && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                                {isAI && <Bot className="w-3.5 h-3.5 text-emerald-400" />}
                                {isUser && <User className="w-3.5 h-3.5 text-slate-400" />}
                                {rep.senderName}
                                {isSupport && ' (Human Specialist)'}
                                {isAI && ' (Automated)'}
                              </span>
                              <span className="text-slate-500">{formatDate(rep.timestamp)}</span>
                            </div>
                            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {rep.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Canned Responses Pills */}
                    <div className="px-4 py-2 bg-[#131b2b] border-t border-slate-800 flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex-shrink-0">
                        Canned:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminReplyText(
                            'Please email a clear photo of your Gold Visa Card along with your Customer ID to customer care support at support@greendotbanking.com. Include the amount you wish to load on the card so our team can activate it and guide you on the next steps.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all flex-shrink-0"
                      >
                        Request Card Photo &amp; Load Amount
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminReplyText(
                            'Yes! Once your Gold Visa Card is received and linked to your profile, you will unlock full access to all banking features, including instant external wire transfers, bill payments, and mobile top-ups.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all flex-shrink-0"
                      >
                        Confirm Feature Access
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminReplyText(
                            'Account upgrade information is restricted: You must have an active Gold Visa Card linked to your profile before your account can be considered or explained for an upgrade.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all flex-shrink-0"
                      >
                        Card Link Required for Upgrade
                      </button>
                    </div>

                    {/* Admin Response Box Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!adminReplyText.trim()) return;

                        replySupportTicket(selectedAdminTicket.id, adminReplyText, {
                          sender: 'support',
                          senderName: 'Chief Operations Administrator',
                          markResolved: adminMarkResolved,
                          triggerEmail: adminTriggerEmail,
                        });

                        if (adminMarkResolved) {
                          resolveSupportTicket(selectedAdminTicket.id, undefined, adminTriggerEmail);
                        }

                        setAdminReplyText('');
                        setSupportFeedback(
                          `✓ Reply sent directly to ${selectedAdminTicket.userName}'s chat window.${
                            adminTriggerEmail
                              ? ' Automated email update dispatched from support@greendotbanking.com.'
                              : ''
                          }`
                        );
                        setTimeout(() => setSupportFeedback(null), 5000);

                        const updated = supportTickets.find((t) => t.id === selectedAdminTicket.id);
                        if (updated) setSelectedAdminTicket(updated);
                      }}
                      className="p-4 bg-[#131b2b] border-t border-slate-800 space-y-3"
                    >
                      <textarea
                        required
                        rows={3}
                        placeholder="Type response to deliver directly into customer's live chat feed..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all resize-none"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 text-slate-300">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={adminMarkResolved}
                              onChange={(e) => setAdminMarkResolved(e.target.checked)}
                              className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                            />
                            <span>Mark as Resolved</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={adminTriggerEmail}
                              onChange={(e) => setAdminTriggerEmail(e.target.checked)}
                              className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                            />
                            <span className="text-emerald-400">Trigger email notification</span>
                          </label>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAdminTicket(null)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
                          >
                            Close View
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Reply to Chat</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 space-y-3">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
                    <div className="font-bold text-sm text-white">No Conversation Selected</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Select an inquiry or active live chat session from the queue on the left to review the timestamped transcript and dispatch official responses.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: APP SETTINGS & BANNER TOGGLES */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Global Bank Configuration</h2>
              <p className="text-xs text-slate-400">
                Adjust support contact numbers, toggle marketing banners, and control system availability.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-xl">
                ✓ Bank settings and banner configuration updated.
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#162032] rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
              <div className="pb-4 border-b border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-white">
                    Primary Banking Domain &amp; Site URL
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    Active Magic-Link Origin
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">
                    Base URL / Domain (Used for email magic links, redirects &amp; buttons)
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.site_url || 'https://greendotbanking.com'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, site_url: e.target.value })}
                    placeholder="https://greendotbanking.com"
                    className="w-full mt-1 p-2.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-emerald-300 outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default: <code className="text-emerald-400 font-mono">https://greendotbanking.com</code>. All automated welcome emails, magic login tokens, and notifications will route to this URL.
                  </p>
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-white pt-4 pb-2 border-b border-slate-700">
                Official Bank Details &amp; Routing Config
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Bank Name</label>
                  <input
                    type="text"
                    value={settingsForm.bank_name || 'Greendot Bank'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Bank Street Address</label>
                  <input
                    type="text"
                    value={settingsForm.bank_address || '100 Financial Plaza, New York, NY 10005'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bank_address: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Routing Number (ABA)</label>
                  <input
                    type="text"
                    value={settingsForm.routing_number || '122000496'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, routing_number: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={settingsForm.swift_code || 'GRENDUS33XXX'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, swift_code: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Support Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.support_phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, support_phone: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.support_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, support_email: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Telegram Support Handle</label>
                  <input
                    type="text"
                    value={settingsForm.telegram_handle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, telegram_handle: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Default Currency Symbol</label>
                  <input
                    type="text"
                    value={settingsForm.default_currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, default_currency: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-white pt-4 pb-2 border-b border-slate-700">
                Customer Dashboard Banners &amp; Promos
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Enable Gold Visa Promotion Banner</div>
                    <div className="text-[11px] text-slate-400">
                      Displays the gold reward badge on customer overview screens
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.gold_card_banner_enabled}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, gold_card_banner_enabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-500 rounded"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Gold Card Banner Text</label>
                  <input
                    type="text"
                    value={settingsForm.gold_card_banner_text}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gold_card_banner_text: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs rounded-xl shadow transition-all"
              >
                Save Bank Settings
              </button>
            </form>

            {/* Supabase Cloud Database & Infrastructure Status */}
            <div className="bg-[#162032] rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">Supabase Cloud Database &amp; Auth</h3>
                    <p className="text-[11px] text-slate-400">Production PostgreSQL &amp; Real-time synchronization engine</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active &amp; Connected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project Reference</div>
                  <div className="font-mono text-emerald-400 font-medium select-all">ucyglwcuuabobeeomfde</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supabase REST Endpoint</div>
                  <div className="font-mono text-slate-300 truncate select-all">https://ucyglwcuuabobeeomfde.supabase.co</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Schema Tables (15)</div>
                  <div className="text-slate-300 font-medium">profiles, accounts, debit_cards, transactions, audit_logs...</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sync Mechanism</div>
                  <div className="text-slate-300 font-medium">Auto-Hydration + Real-time REST Persistence</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Transfer Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">Reject Transfer &amp; Notify Customer</h3>
            <p className="text-xs text-slate-400">
              Provide a clear written reason for rejection. This will be logged in audit trails and sent to the client.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (rejectTxId) {
                    rejectTransfer(rejectTxId, rejectReason);
                  }
                  setRejectModalOpen(false);
                  setRejectTxId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 12 ADMINISTRATIVE OPERATION DIALOGS ================= */}

      {/* 1. EDIT PROFILE DIALOG */}
      {actionModal === 'edit' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <div>
                <h3 className="font-display font-bold text-white text-base">Edit Customer Profile</h3>
                <p className="text-xs text-slate-400">Customer #{targetCustomer.customerId || 'N/A'} &bull; {targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}</p>
              </div>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300">Legal Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Residential / Business Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Account Tier</label>
                  <select
                    value={editForm.accountTier}
                    onChange={(e) => setEditForm({ ...editForm, accountTier: e.target.value as AccountTier })}
                    className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
                  >
                    <option value="tier_0">Tier 0 (Unverified / Gated)</option>
                    <option value="tier_1">Tier 1 (Verified / $5k limit)</option>
                    <option value="tier_2">Tier 2 (Enhanced / $50k limit)</option>
                    <option value="tier_3">Tier 3 (Institutional / Unlimited)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="hasVisaCardCheck"
                    checked={editForm.hasVisaCard}
                    onChange={(e) => setEditForm({ ...editForm, hasVisaCard: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <label htmlFor="hasVisaCardCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                    Has Active Visa Card
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FUND CUSTOMER ACCOUNT DIALOG (+ CREDIT) */}
      {actionModal === 'fund' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-emerald-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <div>
                <h3 className="font-display font-bold text-white text-base">Fund Account (Administrative Credit)</h3>
                <p className="text-xs text-emerald-400">Target: {targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'} (#{targetCustomer.customerId || 'N/A'})</p>
              </div>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleFundSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300">Credit Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={fundForm.amount}
                  onChange={(e) => setFundForm({ ...fundForm, amount: Number(e.target.value) })}
                  className="w-full mt-1 p-3 text-lg font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Originating Entity / Wire Sender</label>
                <input
                  type="text"
                  required
                  value={fundForm.senderName}
                  onChange={(e) => setFundForm({ ...fundForm, senderName: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Transaction Memo / Description</label>
                <input
                  type="text"
                  required
                  value={fundForm.description}
                  onChange={(e) => setFundForm({ ...fundForm, description: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 space-y-0.5">
                <div className="font-bold">Immediate Ledger Posting:</div>
                <div>Funds will be credited immediately to the customer's checking balance and logged in Immutable Audit Records.</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Execute + Credit Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DEDUCT CUSTOMER ACCOUNT DIALOG (- DEBIT) */}
      {actionModal === 'deduct' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-red-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <div>
                <h3 className="font-display font-bold text-white text-base">Deduct Funds (Administrative Debit)</h3>
                <p className="text-xs text-red-400">Target: {targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'} (#{targetCustomer.customerId || 'N/A'})</p>
              </div>
              <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleDeductSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300">Debit Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={deductForm.amount}
                  onChange={(e) => setDeductForm({ ...deductForm, amount: Number(e.target.value) })}
                  className="w-full mt-1 p-3 text-lg font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-red-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Beneficiary / Debit Originator</label>
                <input
                  type="text"
                  required
                  value={deductForm.senderName}
                  onChange={(e) => setDeductForm({ ...deductForm, senderName: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Debit Reason / Regulatory Memo</label>
                <input
                  type="text"
                  required
                  value={deductForm.description}
                  onChange={(e) => setDeductForm({ ...deductForm, description: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-[11px] text-red-300 space-y-0.5">
                <div className="font-bold">Ledger Reduction Warning:</div>
                <div>This operation debits customer balance immediately. An immutable audit record will log this administrative deduction.</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Execute - Debit Outflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4 & 5. FREEZE / UNFREEZE DIALOG */}
      {(actionModal === 'freeze' || actionModal === 'unfreeze') && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">
              {actionModal === 'freeze' ? 'Freeze Customer Account' : 'Unfreeze Customer Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {actionModal === 'freeze'
                ? `Freezing #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) immediately disables outgoing transfers, bill payments, and card debits.`
                : `Unfreezing #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) restores all standard banking operations and card authorizations.`}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300">Reason / Regulatory Compliance Note</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={2}
                className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChangeSubmit(actionModal === 'freeze' ? 'frozen' : 'active')}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-lg transition-all ${
                  actionModal === 'freeze' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {actionModal === 'freeze' ? 'Confirm Freeze' : 'Confirm Unfreeze'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 & 7. LOCK / UNLOCK DIALOG */}
      {(actionModal === 'lock' || actionModal === 'unlock') && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-amber-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">
              {actionModal === 'lock' ? 'Security Lock Account' : 'Unlock Account Security'}
            </h3>
            <p className="text-xs text-slate-400">
              {actionModal === 'lock'
                ? `Locking #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) terminates current sessions and prevents authentication and money operations.`
                : `Unlocking #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) restores account access for the customer.`}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300">Reason / Incident Report Reference</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={2}
                className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChangeSubmit(actionModal === 'lock' ? 'locked' : 'active')}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-lg transition-all ${
                  actionModal === 'lock' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {actionModal === 'lock' ? 'Confirm Security Lock' : 'Confirm Account Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8 & 9. SUSPEND / REACTIVATE DIALOG */}
      {(actionModal === 'suspend' || actionModal === 'reactivate') && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-purple-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">
              {actionModal === 'suspend' ? 'Suspend Account (Compliance Review)' : 'Reactivate Suspended Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {actionModal === 'suspend'
                ? `Suspending #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) flags the customer for regulatory review and suspends all banking activity.`
                : `Reactivating #${targetCustomer.customerId || 'N/A'} (${targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) restores account standing to active after clearance.`}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300">Compliance Documentation Memo</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={2}
                className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChangeSubmit(actionModal === 'suspend' ? 'suspended' : 'active')}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-lg transition-all ${
                  actionModal === 'suspend' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {actionModal === 'suspend' ? 'Confirm Suspension' : 'Confirm Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. CLOSE ACCOUNT DIALOG */}
      {actionModal === 'close' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-rose-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">Close Customer Relationship</h3>
            <p className="text-xs text-slate-400">
              Closing customer #{targetCustomer.customerId || 'N/A'} marks accounts closed and terminates debit cards. Customer can be reopened later if requested.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300">Reason for Account Closure</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={2}
                className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChangeSubmit('closed')}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Confirm Account Closure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. REOPEN ACCOUNT DIALOG */}
      {actionModal === 'reopen' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#162032] border border-emerald-700/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">Reopen Customer Account</h3>
            <p className="text-xs text-slate-400">
              Restores customer #{targetCustomer.customerId || 'N/A'} ({targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}) with an active checking/savings account and initial capital balance.
            </p>

            <form onSubmit={handleReopenSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300">New Account Type</label>
                <select
                  value={reopenForm.accountType}
                  onChange={(e) => setReopenForm({ ...reopenForm, accountType: e.target.value as any })}
                  className="w-full mt-1 p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
                >
                  <option value="checking">High-Yield Checking</option>
                  <option value="savings">Premier Savings (4.25% APY)</option>
                  <option value="investment">Wealth Investment Portfolio</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Initial Opening Balance ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={reopenForm.initialDeposit}
                  onChange={(e) => setReopenForm({ ...reopenForm, initialDeposit: Number(e.target.value) })}
                  className="w-full mt-1 p-2.5 text-xs font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Reopen Account &amp; Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. DELETE CUSTOMER DIALOG (PERMANENT PURGE) */}
      {actionModal === 'delete' && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1215] border border-red-600 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-500">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-display font-bold text-white text-base">Permanent Customer Deletion</h3>
            </div>
            
            <p className="text-xs text-red-200/90 leading-relaxed">
              You are about to permanently delete customer <strong className="text-white">{targetCustomer.fullName || (targetCustomer as any)?.name || 'Valued Customer'}</strong> (#{targetCustomer.customerId || 'N/A'}). All associated bank accounts, debit cards, transactions, and user sessions will be purged.
            </p>

            <div className="p-3 bg-red-950/60 border border-red-700/60 rounded-xl space-y-1 text-xs">
              <span className="text-red-300 font-bold">Confirmation Required:</span>
              <p className="text-[11px] text-slate-300">
                To confirm permanent deletion, type <strong className="text-white font-mono">DELETE</strong> or customer ID <strong className="text-white font-mono">{targetCustomer.customerId || 'DELETE'}</strong> below:
              </p>
              <input
                type="text"
                placeholder="Type DELETE to confirm..."
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full mt-2 p-2.5 text-xs bg-black/60 border border-red-700 rounded-xl text-white font-mono outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. ISSUE & CUSTOMIZE GOLD VISA CARD MODAL */}
      {issueCardModalOpen && issueCardTargetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#162032] border border-amber-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Issue Gold Visa Debit Card</h3>
                  <p className="text-[11px] text-slate-400">
                    Customer: <strong className="text-amber-300">{issueCardTargetCustomer.fullName || (issueCardTargetCustomer as any)?.name || 'Valued Customer'}</strong> (#{issueCardTargetCustomer.customerId || 'N/A'})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIssueCardModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Live Gold Visa Card Preview */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-tr from-[#996515] via-[#FFDF73] to-[#B38728] text-slate-950 shadow-xl border border-yellow-200/50">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-inner">
                    GD
                  </div>
                  <div>
                    <span className="font-display font-black text-xs tracking-wider block leading-none">GREENDOT</span>
                    <span className="text-[9px] font-bold tracking-widest text-slate-800 uppercase">PREMIER GOLD</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${issueCardForm.status === 'active' ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'}`}>
                    {issueCardForm.status}
                  </span>
                  <span className="font-black italic text-lg tracking-tighter text-slate-900">VISA</span>
                </div>
              </div>

              {/* Chip & Contactless */}
              <div className="my-4 flex items-center gap-3 relative z-10">
                <div className="w-9 h-7 rounded bg-amber-200/90 border border-amber-900/30 flex items-center justify-center shadow-xs">
                  <div className="w-6 h-4 border border-amber-900/20 rounded-xs" />
                </div>
                <div className="text-[10px] text-slate-800 font-mono font-bold">DEBIT / 4532</div>
              </div>

              {/* 16 Digit Card Number */}
              <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-950 drop-shadow-xs relative z-10">
                {issueCardForm.cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Cardholder & Expiry */}
              <div className="mt-3 flex items-end justify-between text-xs relative z-10">
                <div>
                  <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Cardholder Name</div>
                  <div className="font-bold tracking-wide uppercase">{issueCardForm.cardHolder || issueCardTargetCustomer.fullName || (issueCardTargetCustomer as any)?.name || 'CUSTOMER'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">Expires / CVV</div>
                  <div className="font-mono font-bold">
                    {String(issueCardForm.expiryMonth || '12').padStart(2, '0')}/{String(issueCardForm.expiryYear || '29')} &bull; {issueCardForm.cvv || '•••'}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Inputs Form */}
            <form onSubmit={handleIssueCardSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-300">16-Digit Card Number</label>
                  <button
                    type="button"
                    onClick={() => {
                      const r1 = Math.floor(1000 + Math.random() * 9000);
                      const r2 = Math.floor(1000 + Math.random() * 9000);
                      const r3 = Math.floor(1000 + Math.random() * 9000);
                      setIssueCardForm({ ...issueCardForm, cardNumber: `4532 ${r1} ${r2} ${r3}` });
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
                  >
                    🎲 Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={issueCardForm.cardNumber}
                  onChange={(e) => setIssueCardForm({ ...issueCardForm, cardNumber: e.target.value })}
                  placeholder="4532 8901 2345 8821"
                  className="w-full mt-1 p-2.5 font-mono text-sm font-bold bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300">Cardholder Name (Embossed)</label>
                <input
                  type="text"
                  required
                  value={issueCardForm.cardHolder}
                  onChange={(e) => setIssueCardForm({ ...issueCardForm, cardHolder: e.target.value.toUpperCase() })}
                  placeholder={(issueCardTargetCustomer.fullName || (issueCardTargetCustomer as any)?.name || 'CUSTOMER').toUpperCase()}
                  className="w-full mt-1 p-2.5 font-bold uppercase bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300">Expiry Month</label>
                  <select
                    value={issueCardForm.expiryMonth}
                    onChange={(e) => setIssueCardForm({ ...issueCardForm, expiryMonth: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold outline-none"
                  >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300">Expiry Year</label>
                  <select
                    value={issueCardForm.expiryYear}
                    onChange={(e) => setIssueCardForm({ ...issueCardForm, expiryYear: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold outline-none"
                  >
                    {['26', '27', '28', '29', '30', '31', '32', '33', '34', '35'].map((y) => (
                      <option key={y} value={y}>20{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-300">CVV</label>
                    <button
                      type="button"
                      onClick={() => setIssueCardForm({ ...issueCardForm, cvv: String(Math.floor(100 + Math.random() * 900)) })}
                      className="text-[10px] text-amber-400 hover:text-amber-300"
                    >
                      🎲
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={issueCardForm.cvv}
                    onChange={(e) => setIssueCardForm({ ...issueCardForm, cvv: e.target.value })}
                    placeholder="821"
                    className="w-full mt-1 p-2.5 font-mono text-center font-bold bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300">Initial Spending Limit / Balance ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={issueCardForm.initialBalance}
                    onChange={(e) => setIssueCardForm({ ...issueCardForm, initialBalance: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300">Card Status</label>
                  <select
                    value={issueCardForm.status}
                    onChange={(e) => setIssueCardForm({ ...issueCardForm, status: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold outline-none"
                  >
                    <option value="active">Active &amp; Ready for Transactions</option>
                    <option value="frozen">Frozen (Security Lock)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Issuing this card automatically sets <strong>hasVisaCard = true</strong> for {issueCardTargetCustomer.fullName || (issueCardTargetCustomer as any)?.name || 'this customer'}, unlocking account tier upgrade paths and live banking features.
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIssueCardModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Issue &amp; Link Gold Visa Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 14. CHECK IMAGE INSPECTION PREVIEW MODAL */}
      {checkPreviewTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#162032] border border-emerald-900/60 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ReceiptText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Mobile Check Underwriting Review</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>TX ID: {checkPreviewTx.id}</span>
                    <span>&bull;</span>
                    <span>Customer: {checkPreviewTx.customerId}</span>
                    {checkPreviewTx.checkNumber && (
                      <>
                        <span>&bull;</span>
                        <span className="font-mono text-amber-300 font-bold">Check #{checkPreviewTx.checkNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCheckPreviewTx(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Check Details Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Check Amount</div>
                <div className="font-mono font-bold text-base text-white">{formatCurrency(checkPreviewTx.amount)}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Status</div>
                <div className="font-mono font-bold text-base text-amber-300 capitalize">{checkPreviewTx.status.replace('_', ' ')}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Estimated Clearance</div>
                <div className="font-mono font-bold text-base text-emerald-400">{checkPreviewTx.estimatedProcessingTime || '~30 mins'}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Deposit Date</div>
                <div className="font-mono font-bold text-slate-200">{formatDate(checkPreviewTx.date)}</div>
              </div>
            </div>

            {/* Check Scan Images (Front and Back) */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Front Check Scan</span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">MICR &amp; Routing Verified</span>
                </div>
                {checkPreviewTx.frontImage ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black/40 flex items-center justify-center p-2 max-h-60">
                    <img
                      src={checkPreviewTx.frontImage}
                      alt="Front of Check"
                      className="max-h-56 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 text-center text-slate-400 text-xs">
                    No front image attached with this test record.
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Back Check Scan &amp; Endorsement</span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">&ldquo;For Mobile Deposit Only at Greendot Bank&rdquo;</span>
                </div>
                {checkPreviewTx.backImage ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black/40 flex items-center justify-center p-2 max-h-60">
                    <img
                      src={checkPreviewTx.backImage}
                      alt="Back of Check"
                      className="max-h-56 object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 text-center text-slate-400 text-xs">
                    No back endorsement image attached with this test record.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-700">
              <div className="text-[11px] text-slate-400">
                Approving this check credits {formatCurrency(checkPreviewTx.amount)} directly to the customer&apos;s available account balance.
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCheckPreviewTx(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
                {(checkPreviewTx.checkStatus === 'pending' || checkPreviewTx.checkStatus === 'pending_approval' || checkPreviewTx.status === 'pending' || checkPreviewTx.status === 'pending_approval') && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const id = checkPreviewTx.id;
                        setCheckPreviewTx(null);
                        setCheckRejectTxId(id);
                        setCheckRejectModalOpen(true);
                      }}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Reject Check
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleApproveCheck(checkPreviewTx.id);
                        setCheckPreviewTx(null);
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve &amp; Credit Balance</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. CHECK REJECTION MODAL */}
      {checkRejectModalOpen && checkRejectTxId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1215] border border-red-600 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display font-bold text-white text-base">Reject Check Deposit</h3>
            </div>

            <p className="text-xs text-red-200/90 leading-relaxed">
              You are about to reject check deposit <strong className="text-white font-mono">#{checkRejectTxId}</strong>. The customer will receive an immediate automated email notification detailing the regulatory reason.
            </p>

            <form onSubmit={handleRejectCheckSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300">Rejection Reason</label>
                <select
                  value={checkRejectReason}
                  onChange={(e) => setCheckRejectReason(e.target.value)}
                  className="w-full mt-1 p-2.5 text-xs bg-black/60 border border-red-700 rounded-xl text-white outline-none"
                >
                  <option value="Endorsement signature verification failed / Image illegible">
                    Endorsement signature missing / Image illegible
                  </option>
                  <option value="Check payee name does not match legal customer profile name">
                    Payee name mismatch with account legal name
                  </option>
                  <option value="Check amount exceeds mobile daily deposit underwriting limits">
                    Exceeds mobile deposit underwriting limits
                  </option>
                  <option value="Duplicate check deposit detected across Federal Reserve ledger">
                    Duplicate check deposit detected
                  </option>
                  <option value="Federal compliance verification review failed">
                    Federal compliance verification review failed
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Custom Auditor Notes</label>
                <textarea
                  value={checkRejectReason}
                  onChange={(e) => setCheckRejectReason(e.target.value)}
                  rows={2}
                  className="w-full mt-1 p-2.5 text-xs bg-black/60 border border-red-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckRejectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  Confirm Check Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Payment Rejection Modal */}
      {billRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 text-slate-100 shadow-2xl relative">
            <h3 className="font-display text-lg font-bold text-white">Reject Bill Payment</h3>
            <p className="text-xs text-slate-400">
              Provide a reason for rejecting this bill payment. The customer will be notified.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Rejection Reason</label>
              <textarea
                value={billRejectReason}
                onChange={(e) => setBillRejectReason(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBillRejectModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (billRejectId) {
                    rejectBillPayment(billRejectId, billRejectReason);
                    setBillRejectModalOpen(false);
                    setBillRejectId(null);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
