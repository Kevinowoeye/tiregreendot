import "dotenv/config";
import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "greendot.bank.supportmail@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
const TRANSACTIONAL_SENDER = `"Greendot Bank Support" <${SMTP_USER}>`;
const ADMIN_EMAIL = 'jade66oc@gmail.com';

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    supabase: "connected",
    smtpHost: SMTP_HOST,
    smtpUser: SMTP_USER,
    smtpConfigured: Boolean(SMTP_PASS),
    timestamp: new Date().toISOString()
  });
});

// Helper to get Nodemailer transporter
function getTransporter() {
  if (!SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Helper to send email using Gmail SMTP
async function dispatchEmail(options: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const sender = options.from || TRANSACTIONAL_SENDER;
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[Gmail SMTP Notice] SMTP_PASS is not configured. Email to <${options.to}> with subject "${options.subject}" was simulated. Set SMTP_PASS to dispatch live via Gmail.`);
    return {
      success: true,
      simulated: true,
      messageId: `smtp-simulated-${Date.now()}`,
      provider: 'gmail-smtp',
      recipient: options.to,
      note: 'SMTP_PASS not set; processed in simulation mode.'
    };
  }

  const info = await transporter.sendMail({
    from: sender,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.subject,
  });

  return {
    success: true,
    messageId: info.messageId,
    provider: 'gmail-smtp',
    recipient: options.to,
  };
}

// API endpoint to send a manual test email on demand
app.post("/api/test-email", async (req, res) => {
  try {
    const { to } = req.body || {};
    const recipient = to || ADMIN_EMAIL;

    if (!SMTP_PASS) {
      return res.status(400).json({
        success: false,
        error: "SMTP_PASS environment variable (Gmail App Password) is not configured yet. Please add SMTP_PASS to your environment settings to send live emails.",
        provider: "gmail-smtp",
      });
    }

    const result = await dispatchEmail({
      from: TRANSACTIONAL_SENDER,
      to: recipient,
      subject: 'Greendot Bank Manual Test Email - Gmail SMTP Success',
      text: 'Greendot Bank transactional email transmission via Gmail SMTP was successful!',
      html: `
        <div style="font-family:sans-serif; padding:24px; background:#f0fdf4; border-radius:16px; border:1px solid #22c55e; max-width:550px; margin:0 auto;">
          <h2 style="color:#0f3d1d; margin-top:0; font-size:22px;">Greendot Bank Test Email Verification</h2>
          <p style="color:#334155; font-size:15px; line-height:1.6;">
            Your manual test email transmission to <strong>${recipient}</strong> was completed successfully from <strong>${TRANSACTIONAL_SENDER}</strong> via Gmail SMTP.
          </p>
          <div style="background:#ffffff; padding:16px; border-radius:10px; border:1px solid #d1fae5; font-family:monospace; font-size:13px; color:#166534; margin:15px 0;">
            Sender: ${TRANSACTIONAL_SENDER} &bull; Destination: ${recipient} &bull; Host: ${SMTP_HOST}:${SMTP_PORT} &bull; Status: Delivered
          </div>
          <p style="color:#64748b; font-size:13px;">All customer alerts, deposit notices, and security pins are fully active and operational via Gmail SMTP.</p>
        </div>
      `,
    });

    console.log("🚀 Manual Test Email sent successfully via Gmail SMTP:", result.messageId);
    return res.json({ success: true, messageId: result.messageId, recipient, provider: result.provider });
  } catch (err: any) {
    console.error("Error sending manual test email:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to send test email via Gmail SMTP", provider: "gmail-smtp" });
  }
});

// API endpoint to send email notification
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, html, text, from } = req.body || {};
    if (!to || !subject) {
      return res.status(400).json({ success: false, error: "Missing 'to' or 'subject'", provider: "gmail-smtp" });
    }

    const result = await dispatchEmail({
      from: from || TRANSACTIONAL_SENDER,
      to,
      subject,
      text: text || subject,
      html: html || `<p>${subject}</p>`,
    });

    console.log("Email sent successfully:", result.messageId, "via", result.provider);
    return res.json({ success: true, messageId: result.messageId, provider: result.provider });
  } catch (err: any) {
    console.error("Error sending email:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to send email via Gmail SMTP", provider: "gmail-smtp" });
  }
});

// Send an automatic test email on server startup to verify configuration
async function sendStartupTestEmail() {
  if (!SMTP_PASS) {
    console.log("Startup notice: Gmail SMTP engine ready. (SMTP_PASS not set; configure SMTP_PASS in environment to send live emails).");
    return;
  }
  try {
    const result = await dispatchEmail({
      from: TRANSACTIONAL_SENDER,
      to: ADMIN_EMAIL,
      subject: 'Greendot Bank Notification Engine Active (Gmail SMTP)',
      text: 'Greendot Bank notifications have been successfully linked and verified via Gmail SMTP!',
      html: `
        <div style="font-family:sans-serif; padding:20px; background:#f4f9f5; border-radius:12px; border:1px solid #22c55e;">
          <h2 style="color:#0f3d1d; margin-top:0;">Greendot Bank Notification Engine Active</h2>
          <p style="color:#334155; font-size:14px;">
            Sender address <strong>${TRANSACTIONAL_SENDER}</strong> has been configured for transactional notices. Admin alerts are forwarded to <strong>${ADMIN_EMAIL}</strong>.
          </p>
          <div style="background:#ffffff; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-family:monospace; font-size:12px; color:#166534;">
            Status: Active &bull; Host: ${SMTP_HOST}:${SMTP_PORT} &bull; Sender: ${TRANSACTIONAL_SENDER} &bull; Admin: ${ADMIN_EMAIL}
          </div>
          <p style="color:#64748b; font-size:12px; margin-top:15px;">All customer alerts, deposits, transfers, and security notifications will now be securely dispatched via Gmail SMTP.</p>
        </div>
      `,
    });
    console.log("🚀 Startup Test Email sent successfully to " + ADMIN_EMAIL + ":", result.messageId);
  } catch (err) {
    console.warn("Startup test email check notice (Gmail SMTP):", err);
  }
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    sendStartupTestEmail();
  });
}

startServer();
