const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ucyglwcuuabobeeomfde';

const sql = `
-- Greendot Bank Production Database Schema for Supabase

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE,
  role TEXT DEFAULT 'customer',
  "fullName" TEXT,
  email TEXT,
  password TEXT,
  phone TEXT,
  "avatarUrl" TEXT,
  "customerId" TEXT,
  status TEXT DEFAULT 'active',
  "forcePasswordChange" BOOLEAN DEFAULT false,
  "twoFactorEnabled" BOOLEAN DEFAULT false,
  "kycStatus" TEXT DEFAULT 'pending',
  "activationCode" TEXT,
  "activatedAt" TEXT,
  "hasVisaCard" BOOLEAN DEFAULT true,
  "cardMinLoad" NUMERIC DEFAULT 200,
  "transactionPinHash" TEXT,
  "accountTier" TEXT DEFAULT 'tier_1',
  "upgradeMinLoad" NUMERIC DEFAULT 1000,
  address TEXT,
  city TEXT,
  country TEXT,
  balance NUMERIC DEFAULT 0,
  "totalBalance" NUMERIC DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "accountNumber" TEXT,
  "accountType" TEXT DEFAULT 'checking',
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;

-- 3. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  "accountId" TEXT,
  "userId" TEXT,
  type TEXT,
  amount NUMERIC DEFAULT 0,
  fee NUMERIC DEFAULT 0,
  description TEXT,
  reference TEXT,
  "senderName" TEXT,
  "balanceAfter" NUMERIC,
  status TEXT DEFAULT 'completed',
  date TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- 4. Transfers
CREATE TABLE IF NOT EXISTS public.transfers (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "fromAccountId" TEXT,
  "toAccountNumber" TEXT,
  "toAccountName" TEXT,
  "bankName" TEXT,
  amount NUMERIC DEFAULT 0,
  description TEXT,
  reference TEXT,
  status TEXT DEFAULT 'pending',
  "scheduledFor" TEXT,
  "isRecurring" BOOLEAN DEFAULT false,
  "recurringFrequency" TEXT,
  "approvedBy" TEXT,
  "approvedAt" TEXT,
  "rejectionReason" TEXT,
  "receiptNumber" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "completedAt" TEXT
);
ALTER TABLE public.transfers DISABLE ROW LEVEL SECURITY;

-- 5. Beneficiaries
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  name TEXT,
  "accountName" TEXT,
  "accountNumber" TEXT,
  "bankName" TEXT,
  nickname TEXT,
  "routingNumber" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.beneficiaries DISABLE ROW LEVEL SECURITY;

-- 6. Debit Cards
CREATE TABLE IF NOT EXISTS public.debit_cards (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "accountId" TEXT,
  "cardNumber" TEXT,
  "cardHolder" TEXT,
  "expiryMonth" INT,
  "expiryYear" INT,
  cvv TEXT,
  "cardType" TEXT DEFAULT 'visa',
  status TEXT DEFAULT 'active',
  "pinSet" BOOLEAN DEFAULT true,
  "dailyLimit" NUMERIC DEFAULT 5000,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.debit_cards DISABLE ROW LEVEL SECURITY;

-- 7. Loans
CREATE TABLE IF NOT EXISTS public.loans (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "loanType" TEXT,
  amount NUMERIC DEFAULT 0,
  "interestRate" NUMERIC DEFAULT 5.5,
  "termMonths" INT DEFAULT 12,
  "monthlyPayment" NUMERIC DEFAULT 0,
  "remainingBalance" NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  purpose TEXT,
  "approvedBy" TEXT,
  "approvedAt" TEXT,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.loans DISABLE ROW LEVEL SECURITY;

-- 8. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  type TEXT DEFAULT 'info',
  title TEXT,
  message TEXT,
  "isRead" BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  date TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 9. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "userName" TEXT,
  "userEmail" TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',
  replies JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  "adminId" TEXT,
  "adminName" TEXT,
  action TEXT,
  "targetType" TEXT,
  "targetId" TEXT,
  "targetName" TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  reason TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- 11. App Settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  bank_name TEXT DEFAULT 'Greendot Bank',
  support_email TEXT,
  support_phone TEXT,
  telegram_handle TEXT,
  zangi_handle TEXT,
  signal_handle TEXT,
  site_url TEXT,
  min_visa_card_load NUMERIC DEFAULT 200,
  gold_card_banner_enabled BOOLEAN DEFAULT true,
  transfer_approval_required BOOLEAN DEFAULT true,
  require_2fa BOOLEAN DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  lockdown_mode BOOLEAN DEFAULT false,
  email_notifications_enabled BOOLEAN DEFAULT true,
  email_provider TEXT DEFAULT 'gmail',
  theme_color TEXT DEFAULT '#052e16',
  settings_json JSONB
);
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;

-- 12. Bill Payments
CREATE TABLE IF NOT EXISTS public.bill_payments (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "accountId" TEXT,
  "billerName" TEXT,
  "billerCategory" TEXT,
  "accountReference" TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'completed',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bill_payments DISABLE ROW LEVEL SECURITY;

-- 13. Mobile Recharges
CREATE TABLE IF NOT EXISTS public.mobile_recharges (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  "accountId" TEXT,
  "phoneNumber" TEXT,
  carrier TEXT,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'completed',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.mobile_recharges DISABLE ROW LEVEL SECURITY;

-- 14. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  category TEXT DEFAULT 'general',
  content TEXT,
  "targetAudience" TEXT DEFAULT 'all',
  "sentBy" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;

-- 15. Email Logs
CREATE TABLE IF NOT EXISTS public.email_logs (
  id TEXT PRIMARY KEY,
  recipient TEXT,
  subject TEXT,
  "emailType" TEXT,
  "htmlContent" TEXT,
  status TEXT DEFAULT 'sent',
  "sentAt" TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.email_logs DISABLE ROW LEVEL SECURITY;
`;

async function run() {
  const url = 'https://api.supabase.com/v1/projects/' + PROJECT_REF + '/database/query';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const resText = await resp.text();
  console.log('Migration Status:', resp.status);
  console.log('Response:', resText);
}

run().catch(console.error);
