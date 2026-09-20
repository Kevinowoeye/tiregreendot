import {
  Profile,
  Account,
  Transaction,
  Transfer,
  Beneficiary,
  DebitCard,
  Loan,
  Notification,
  AuditLog,
  BillPayment,
  MobileRecharge,
  AppSettings,
  SupportTicket,
  Announcement,
  EmailLog,
} from '../types';
import {
  generateAccountNumber,
  generateCustomerId,
  generateActivationCode,
  generateReceiptNumber,
  generateReference,
} from './utils';
import { renderBrandedEmailHtml } from './emailTemplates';

const STORAGE_KEY = 'greendot_bank_state_v1';

export interface BankState {
  profiles: Profile[];
  accounts: Account[];
  transactions: Transaction[];
  transfers: Transfer[];
  beneficiaries: Beneficiary[];
  debitCards: DebitCard[];
  loans: Loan[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  billPayments: BillPayment[];
  mobileRecharges: MobileRecharge[];
  appSettings: AppSettings;
  supportTickets: SupportTicket[];
  announcements: Announcement[];
  emailLogs: EmailLog[];
  currentUserId: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  bank_name: 'Greendot Bank',
  support_email: 'greendot.bank.supportmail@gmail.com',
  support_phone: '1-800-GREENDOT',
  bank_address: '100 Financial Plaza, New York, NY 10005',
  routing_number: '122000496',
  swift_code: 'GRENDUS33XXX',
  telegram_handle: '@greendotbanksupport',
  zangi_handle: '10-9876-5432',
  signal_handle: '+1 (800) 473-3636',
  site_url: 'https://greendotbanking.com',
  min_visa_card_load: 200,
  gold_card_banner_enabled: true,
  transfer_approval_required: true,
  require_2fa: true,
  maintenance_mode: false,
  lockdown_mode: false,
  email_notifications_enabled: true,
  email_provider: 'gmail',
  theme_color: 'Emerald Green',
};

export const INITIAL_STATE: BankState = {
  appSettings: DEFAULT_SETTINGS,
  currentUserId: 'cust-1', // Default to active customer Sarah Mitchell
  profiles: [
    {
      id: 'admin-1',
      userId: 'admin-1',
      role: 'admin',
      fullName: 'Kevin Owoeye',
      email: 'kevinowoeye@gmail.com',
      password: 'Personal@01',
      phone: '+1 (800) 473-3636',
      avatarUrl: '',
      customerId: 'ADMIN-0001',
      status: 'active',
      forcePasswordChange: false,
      twoFactorEnabled: true,
      kycStatus: 'verified',
      hasVisaCard: false,
      cardMinLoad: 200,
      transactionPinHash: '1234',
      accountTier: 'tier_3',
      upgradeMinLoad: 800,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'cust-1',
      userId: 'cust-1',
      role: 'customer',
      fullName: 'Sarah Mitchell',
      email: 'sarah.mitchell@greendot.com',
      phone: '+1 (555) 234-5678',
      avatarUrl: '',
      customerId: 'CUST-849201',
      status: 'active',
      forcePasswordChange: false,
      twoFactorEnabled: true,
      kycStatus: 'verified',
      hasVisaCard: true,
      cardMinLoad: 200,
      transactionPinHash: '1234', // Default PIN
      accountTier: 'tier_1',
      upgradeMinLoad: 800,
      address: '742 Evergreen Terrace',
      city: 'New York, NY 10001',
      country: 'United States',
      createdAt: '2025-03-15T10:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'cust-2',
      userId: 'cust-2',
      role: 'customer',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 876-5432',
      customerId: 'CUST-910244',
      status: 'active',
      forcePasswordChange: false,
      twoFactorEnabled: false,
      kycStatus: 'pending',
      password: 'Pass1234!',
      hasVisaCard: false,
      cardMinLoad: 200,
      accountTier: 'tier_0',
      upgradeMinLoad: 800,
      createdAt: '2026-09-16T14:30:00Z',
      updatedAt: '2026-09-16T14:30:00Z',
    },
    {
      id: 'cust-3',
      userId: 'cust-3',
      role: 'customer',
      fullName: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+1 (555) 998-1122',
      customerId: 'CUST-331092',
      status: 'frozen',
      forcePasswordChange: false,
      twoFactorEnabled: true,
      kycStatus: 'verified',
      hasVisaCard: false,
      cardMinLoad: 200,
      transactionPinHash: '9999',
      accountTier: 'tier_1',
      upgradeMinLoad: 800,
      createdAt: '2025-05-20T09:15:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'cust-4',
      userId: 'cust-4',
      role: 'customer',
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+1 (555) 441-7788',
      customerId: 'CUST-662914',
      status: 'locked',
      forcePasswordChange: false,
      twoFactorEnabled: true,
      kycStatus: 'pending',
      hasVisaCard: false,
      cardMinLoad: 200,
      accountTier: 'tier_0',
      upgradeMinLoad: 800,
      createdAt: '2025-08-11T12:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
  ],
  accounts: [
    {
      id: 'acc-1',
      userId: 'cust-1',
      accountNumber: '9482019482',
      accountType: 'checking',
      balance: 12450.0,
      currency: 'USD',
      status: 'active',
      createdAt: '2025-03-15T10:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'acc-2',
      userId: 'cust-1',
      accountNumber: '9482019483',
      accountType: 'savings',
      balance: 28300.75,
      currency: 'USD',
      status: 'active',
      createdAt: '2025-03-15T10:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'acc-3',
      userId: 'cust-1',
      accountNumber: '9482019484',
      accountType: 'investment',
      balance: 7500.0,
      currency: 'USD',
      status: 'active',
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'acc-4',
      userId: 'cust-2',
      accountNumber: '9102441029',
      accountType: 'checking',
      balance: 2500.0,
      currency: 'USD',
      status: 'active',
      createdAt: '2026-09-16T14:30:00Z',
      updatedAt: '2026-09-16T14:30:00Z',
    },
    {
      id: 'acc-5',
      userId: 'cust-3',
      accountNumber: '3310928811',
      accountType: 'checking',
      balance: 8410.5,
      currency: 'USD',
      status: 'frozen',
      createdAt: '2025-05-20T09:15:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
    {
      id: 'acc-6',
      userId: 'cust-4',
      accountNumber: '6629145501',
      accountType: 'checking',
      balance: 1200.0,
      currency: 'USD',
      status: 'locked',
      createdAt: '2025-08-11T12:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
  ],
  transactions: [
    {
      id: 'txn-1',
      accountId: 'acc-1',
      userId: 'cust-1',
      type: 'deposit',
      amount: 4500.0,
      description: 'Bi-weekly Direct Deposit Payroll',
      reference: 'TXN-982101',
      senderName: 'Apex Cloud Technologies Inc.',
      balanceAfter: 12450.0,
      status: 'completed',
      createdAt: '2026-09-15T09:00:00Z',
    },
    {
      id: 'txn-2',
      accountId: 'acc-1',
      userId: 'cust-1',
      type: 'transfer_out',
      amount: 650.0,
      description: 'Monthly Fiber Internet & Cloud Hosting',
      reference: 'TXN-982102',
      senderName: 'Horizon Fiber Corp',
      balanceAfter: 7950.0,
      status: 'completed',
      createdAt: '2026-09-14T14:20:00Z',
    },
    {
      id: 'txn-3',
      accountId: 'acc-1',
      userId: 'cust-1',
      type: 'payment',
      amount: 124.5,
      description: 'Organic Market Groceries & Supplies',
      reference: 'TXN-982103',
      senderName: 'Green Market Manhattan',
      balanceAfter: 8600.0,
      status: 'completed',
      createdAt: '2026-09-13T18:45:00Z',
    },
    {
      id: 'txn-4',
      accountId: 'acc-2',
      userId: 'cust-1',
      type: 'interest',
      amount: 118.25,
      description: 'High-Yield Monthly APY Yield Payment (4.85% APY)',
      reference: 'TXN-982104',
      senderName: 'Greendot Bank Treasury',
      balanceAfter: 28300.75,
      status: 'completed',
      createdAt: '2026-09-01T00:05:00Z',
    },
    {
      id: 'txn-5',
      accountId: 'acc-1',
      userId: 'cust-1',
      type: 'recharge',
      amount: 50.0,
      description: 'Mobile Top-Up (T-Mobile USA)',
      reference: 'TXN-982105',
      senderName: 'T-Mobile Telecommunications',
      balanceAfter: 8724.5,
      status: 'completed',
      createdAt: '2026-09-10T11:10:00Z',
    },
    {
      id: 'txn-6',
      accountId: 'acc-3',
      userId: 'cust-1',
      type: 'deposit',
      amount: 1000.0,
      description: 'Quarterly ESG Clean Energy Index Allocation',
      reference: 'TXN-982106',
      senderName: 'Greendot Wealth Portfolios',
      balanceAfter: 7500.0,
      status: 'completed',
      createdAt: '2026-09-05T16:00:00Z',
    },
  ],
  transfers: [
    {
      id: 'trf-1',
      userId: 'cust-1',
      fromAccountId: 'acc-1',
      toAccountNumber: '4482910392',
      toAccountName: 'James Chen (Contractor)',
      bankName: 'JPMorgan Chase Bank',
      amount: 1200.0,
      description: 'Software Engineering Services sprint payment',
      reference: 'TRF-849102',
      status: 'pending',
      isRecurring: false,
      receiptNumber: 'RCP-89K201',
      createdAt: '2026-09-16T16:45:00Z',
    },
    {
      id: 'trf-2',
      userId: 'cust-1',
      fromAccountId: 'acc-1',
      toAccountNumber: '7829104821',
      toAccountName: 'Maria Rodriguez',
      bankName: 'Bank of America',
      amount: 450.0,
      description: 'Studio branding consultation',
      reference: 'TRF-849099',
      status: 'approved',
      isRecurring: false,
      approvedBy: 'ADMIN-0001',
      approvedAt: '2026-09-15T11:30:00Z',
      receiptNumber: 'RCP-77B104',
      createdAt: '2026-09-15T10:15:00Z',
      completedAt: '2026-09-15T11:30:00Z',
    },
  ],
  beneficiaries: [
    {
      id: 'ben-1',
      userId: 'cust-1',
      name: 'James Chen',
      accountNumber: '4482910392',
      bankName: 'JPMorgan Chase Bank',
      nickname: 'Chen Lead Dev',
      createdAt: '2025-06-10T11:00:00Z',
    },
    {
      id: 'ben-2',
      userId: 'cust-1',
      name: 'Maria Rodriguez',
      accountNumber: '7829104821',
      bankName: 'Bank of America',
      nickname: 'Maria Designer',
      createdAt: '2025-07-22T14:30:00Z',
    },
    {
      id: 'ben-3',
      userId: 'cust-1',
      name: 'Oliver Mitchell',
      accountNumber: '9482019488',
      bankName: 'Greendot Bank (Internal Transfer)',
      nickname: 'Family Emergency Fund',
      createdAt: '2025-04-12T09:00:00Z',
    },
  ],
  debitCards: [
    {
      id: 'card-1',
      userId: 'cust-1',
      accountId: 'acc-1',
      cardNumber: '4532 8841 9023 7182',
      cardHolder: 'SARAH MITCHELL',
      expiryMonth: 8,
      expiryYear: 2029,
      cvv: '849',
      cardType: 'visa',
      status: 'active',
      pinSet: true,
      dailyLimit: 3000,
      createdAt: '2025-03-20T12:00:00Z',
    },
  ],
  loans: [
    {
      id: 'loan-1',
      userId: 'cust-1',
      loanType: 'home',
      amount: 350000,
      interestRate: 5.25,
      termMonths: 360,
      monthlyPayment: 1932.96,
      remainingBalance: 328400.0,
      status: 'active',
      purpose: 'Primary Residence Residential Mortgage in Brooklyn Heights',
      approvedBy: 'ADMIN-0001',
      approvedAt: '2025-04-01T10:00:00Z',
      createdAt: '2025-03-25T14:00:00Z',
      updatedAt: '2026-09-17T00:00:00Z',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'cust-1',
      type: 'security',
      title: 'Biometric 2FA Enabled',
      message: 'Hardware biometric token was linked to your online profile.',
      isRead: false,
      createdAt: '2026-09-16T18:00:00Z',
    },
    {
      id: 'notif-2',
      userId: 'cust-1',
      type: 'info',
      title: 'Transfer Under Verification',
      message: 'Transfer of $1,200.00 to James Chen is being processed by Greendot Treasury.',
      isRead: false,
      createdAt: '2026-09-16T16:45:00Z',
    },
    {
      id: 'notif-3',
      userId: 'cust-1',
      type: 'success',
      title: 'High-Yield Interest Credited',
      message: 'Your monthly interest dividend of $118.25 was credited to your Savings account.',
      isRead: true,
      createdAt: '2026-09-01T00:05:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'audit-1',
      adminId: 'admin-1',
      adminName: 'Chief Operations Administrator',
      action: 'CUSTOMER_CREATED',
      targetType: 'Profile',
      targetId: 'cust-2',
      targetName: 'Marcus Vance',
      details: { accountTier: 'tier_0', initialDeposit: 2500, activationCodeGenerated: true },
      createdAt: '2026-09-16T14:30:00Z',
    },
    {
      id: 'audit-2',
      adminId: 'admin-1',
      adminName: 'Chief Operations Administrator',
      action: 'TRANSFER_APPROVED',
      targetType: 'Transfer',
      targetId: 'trf-2',
      targetName: 'Maria Rodriguez ($450.00)',
      details: { amount: 450, reference: 'TRF-849099' },
      createdAt: '2026-09-15T11:30:00Z',
    },
  ],
  billPayments: [
    {
      id: 'bill-1',
      userId: 'cust-1',
      accountId: 'acc-1',
      billerName: 'ConEdison Power & Light',
      billerCategory: 'Utilities',
      accountReference: 'CONED-99210',
      amount: 185.4,
      status: 'completed',
      createdAt: '2026-09-08T10:00:00Z',
    },
  ],
  mobileRecharges: [
    {
      id: 'rech-1',
      userId: 'cust-1',
      accountId: 'acc-1',
      phoneNumber: '+1 (555) 234-5678',
      carrier: 'T-Mobile USA',
      amount: 50.0,
      status: 'completed',
      createdAt: '2026-09-10T11:10:00Z',
    },
  ],
  supportTickets: [
    {
      id: 'tkt-1',
      userId: 'cust-1',
      userName: 'Sarah Mitchell',
      userEmail: 'sarah.mitchell@greendot.com',
      subject: 'Inquiry regarding wire limits for overseas travel',
      message: 'Hello, I will be traveling to London next month. Can I raise my daily debit card limit to $5,000?',
      status: 'in_progress',
      replies: [
        {
          sender: 'support',
          senderName: 'Agent Tyler (Greendot Concierge)',
          text: 'Hello Sarah! We can certainly authorize a temporary travel note on your Gold Visa debit card. Simply confirm your travel departure dates.',
          timestamp: '2026-09-16T15:20:00Z',
        },
      ],
      createdAt: '2026-09-16T12:00:00Z',
    },
  ],
  announcements: [
    {
      id: 'anc-1',
      title: 'Greendot Elevates High-Yield APY to 4.85%',
      category: 'general',
      content: 'We are delighted to announce an immediate APY enhancement for all Tier 1 through Tier 3 Savings Accounts, backed by FDIC multi-bank network protection.',
      targetAudience: 'all',
      sentBy: 'Treasury Department',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'anc-2',
      title: 'Mandatory 2FA Upgrade for Wire Transfers',
      category: 'security_alert',
      content: 'In alignment with modern federal banking security protocols, all external transfers over $500 now enforce instantaneous hardware token or biometric verification.',
      targetAudience: 'all',
      sentBy: 'Chief Security Officer',
      createdAt: '2026-09-10T09:00:00Z',
    },
  ],
  emailLogs: [
    {
      id: 'eml-1',
      recipient: 'marcus.vance@example.com',
      subject: 'Activate Your Greendot Online Banking Account',
      emailType: 'activation',
      htmlContent: renderBrandedEmailHtml({
        recipientName: 'Marcus Vance',
        recipientEmail: 'marcus.vance@example.com',
        type: 'activation',
        subject: 'Activate Your Greendot Online Banking Account',
        activationCode: 'GRD-8821-4912-3011',
      }),
      status: 'sent',
      sentAt: '2026-09-16T14:30:00Z',
    },
    {
      id: 'eml-2',
      recipient: 'sarah.mitchell@greendot.com',
      subject: 'Debit Alert — Transfer of $1,200.00 Sent for Review',
      emailType: 'debit_alert',
      htmlContent: renderBrandedEmailHtml({
        recipientName: 'Sarah Mitchell',
        recipientEmail: 'sarah.mitchell@greendot.com',
        type: 'debit_alert',
        subject: 'Debit Alert — Transfer of $1,200.00 Sent for Review',
        amount: 1200,
        balanceAfter: 11250,
        reference: 'TRF-849102',
        senderName: 'James Chen (Contractor)',
      }),
      status: 'sent',
      sentAt: '2026-09-16T16:45:00Z',
    },
  ],
};

// Storage helper functions
export function loadState(): BankState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      // Ensure admin profile has the configured admin credentials
      const parsedProfiles: Profile[] = (parsed.profiles || INITIAL_STATE.profiles).map((p: Profile) => {
        if (p.role === 'admin' || p.userId === 'admin-1' || p.email === 'admin@greendot.com') {
          return {
            ...p,
            fullName: 'Kevin Owoeye',
            email: 'kevinowoeye@gmail.com',
            password: 'Personal@01',
          };
        }
        return p;
      });

      // Migrate any legacy pending_activation to active
      const activeProfiles = parsedProfiles.map((p) => {
        if (p.status === 'pending_activation') {
          return { ...p, status: 'active' as const, password: p.password || 'Pass1234!' };
        }
        return p;
      });

      const activeAccounts = ((parsed.accounts || INITIAL_STATE.accounts) as Account[]).map((a) => {
        if (a.status === 'pending_activation') {
          return { ...a, status: 'active' as const };
        }
        return a;
      });

      const loadedSettings = { ...DEFAULT_SETTINGS, ...(parsed.appSettings || {}) };
      if (!loadedSettings.site_url || loadedSettings.site_url === 'https://greendot.bank' || loadedSettings.site_url.includes('greendot-banking.ai.studio')) {
        loadedSettings.site_url = 'https://greendotbanking.com';
      }

      // Merge in any missing defaults if schema updated
      return {
        ...INITIAL_STATE,
        ...parsed,
        profiles: activeProfiles,
        accounts: activeAccounts,
        appSettings: loadedSettings,
      };
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  return INITIAL_STATE;
}

export function saveState(state: BankState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetState(): BankState {
  localStorage.removeItem(STORAGE_KEY);
  saveState(INITIAL_STATE);
  return INITIAL_STATE;
}
