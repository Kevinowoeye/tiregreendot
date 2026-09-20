export type UserRole = 'customer' | 'admin';

export type AccountStatus = 'active' | 'frozen' | 'suspended' | 'closed' | 'locked' | 'pending_activation';

export type AccountTier = 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3';

export type KycStatus = 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  userId: string;
  role: UserRole;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  avatarUrl?: string;
  customerId: string; // e.g., "CUST-849201"
  status: AccountStatus;
  forcePasswordChange: boolean;
  twoFactorEnabled: boolean;
  kycStatus: KycStatus;
  activationCode?: string;
  activatedAt?: string;
  hasVisaCard: boolean;
  cardMinLoad: number;
  transactionPinHash?: string; // 4-digit PIN stored securely
  accountTier: AccountTier;
  upgradeMinLoad: number;
  address?: string;
  city?: string;
  country?: string;
  savingsBalance?: number;
  balance?: number;
  totalBalance?: number;
  debitCard?: DebitCard | null;
  primaryAccount?: Account | null;
  createdAt: string;
  updatedAt: string;
}

export type CustomerProfile = Profile;

export type AccountType = 'checking' | 'savings' | 'investment';

export interface Account {
  id: string;
  userId: string;
  accountNumber: string; // 10-digit
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'fee'
  | 'interest'
  | 'payment'
  | 'recharge'
  | 'bill_pay'
  | 'transfer'
  | 'credit'
  | 'debit';

export type TransactionStatus = 'pending' | 'pending_approval' | 'completed' | 'failed' | 'reversed' | 'rejected' | 'approved';

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  fee?: number;
  description: string;
  reference: string;
  senderName?: string;
  balanceAfter?: number;
  status: TransactionStatus;
  date?: string;
  createdAt: string;
  category?: string;
  note?: string;
  customerId?: string;
  checkNumber?: string;
  frontImage?: string;
  backImage?: string;
  checkStatus?: 'pending' | 'pending_approval' | 'partially_cleared' | 'cleared' | 'rejected' | 'approved_split' | 'cleared_full';
  immediateAmount?: number;
  remainingAmount?: number;
  clearsAt?: string;
  estimatedProcessingTime?: string;
  accountType?: 'checking' | 'savings';
}

export type TransferStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';

export interface Transfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountNumber: string;
  toAccountName: string;
  bankName: string;
  amount: number;
  description: string;
  reference: string;
  status: TransferStatus;
  scheduledFor?: string;
  isRecurring: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  receiptNumber: string;
  createdAt: string;
  completedAt?: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  accountName?: string;
  accountNumber: string;
  bankName: string;
  nickname?: string;
  routingNumber?: string;
  createdAt: string;
}

export interface DebitCard {
  id: string;
  userId: string;
  accountId: string;
  cardNumber: string; // 16-digit formatted
  cardHolder: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardType: 'visa' | 'mastercard';
  status: 'active' | 'frozen' | 'expired' | 'blocked';
  pinSet: boolean;
  dailyLimit: number;
  initialBalance?: number;
  createdAt: string;
}

export type LoanType = 'home' | 'auto' | 'student' | 'personal';

export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'paid_off' | 'defaulted' | 'completed';

export interface Loan {
  id: string;
  userId: string;
  customerId?: string;
  loanType: LoanType;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  status: LoanStatus;
  purpose: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  nextDueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'security' | 'transaction';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  read?: boolean;
  date?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId?: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: Record<string, any>;
  reason?: string;
  createdAt: string;
}

export interface BillPayment {
  id: string;
  userId: string;
  accountId: string;
  billerName: string;
  billerCategory: string;
  accountReference: string;
  amount: number;
  status: 'pending_admin_approval' | 'pending' | 'completed' | 'failed' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface MobileRecharge {
  id: string;
  userId: string;
  accountId: string;
  phoneNumber: string;
  carrier: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AppSettings {
  bank_name: string;
  support_email: string;
  support_phone: string;
  bank_address: string;
  routing_number: string;
  swift_code: string;
  telegram_handle: string;
  zangi_handle: string;
  signal_handle: string;
  site_url: string;
  min_visa_card_load: number;
  gold_card_banner_enabled: boolean;
  transfer_approval_required: boolean;
  require_2fa: boolean;
  maintenance_mode: boolean;
  lockdown_mode: boolean;
  email_notifications_enabled: boolean;
  email_provider: 'resend' | 'gmail' | 'icloud';
  theme_color: string;
  default_currency?: string;
  gold_card_banner_text?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'pending_human';
  replies: {
    sender: 'user' | 'support' | 'ai';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt?: string;
  channel?: 'ticket' | 'ai_chat';
  needsHumanReply?: boolean;
  customerId?: string;
  accountNumber?: string;
  resolvedAt?: string;
  emailNotificationSent?: boolean;
}

export interface CallSession {
  id: string;
  userId: string;
  userName: string;
  callType: 'audio' | 'video';
  status: 'incoming' | 'active' | 'ended';
  durationSeconds: number;
  startedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'general' | 'security_alert' | 'maintenance' | 'policy_update';
  content: string;
  targetAudience: 'all' | 'tier_1' | 'active_only';
  sentBy: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  emailType: string;
  htmlContent: string;
  status: 'sent' | 'failed' | 'delivered';
  sentAt: string;
  html?: string;
  toEmail?: string;
  template?: string;
}
