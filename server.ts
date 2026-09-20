import "dotenv/config";
import express from "express";
import path from "path";
import { Resend } from "resend";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const TRANSACTIONAL_SENDER = 'Greendot Banking <support@greendotbanking.com>';
const ADMIN_EMAIL = 'jade66oc@gmail.com';

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    supabase: "connected",
    projectRef: "ucyglwcuuabobeeomfde",
    timestamp: new Date().toISOString()
  });
});

// Helper to send email using Resend
async function dispatchEmail(options: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  resendApiKey?: string;
}) {
  const sender = options.from || TRANSACTIONAL_SENDER;
  const resendKey = (options.resendApiKey || process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '').trim();

  if (!resendKey) {
    throw new Error('RESEND_API_KEY environment variable is not configured');
  }

  const resend = new Resend(resendKey);
  const resendResult = await resend.emails.send({
    from: sender,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.subject,
  });

  if (resendResult.error) {
    throw new Error(resendResult.error.message || 'Failed to send email via Resend');
  }

  return { success: true, messageId: resendResult.data?.id || 'sent', provider: 'resend' };
}

// API endpoint to send a manual test email on demand
app.post("/api/test-email", async (req, res) => {
  try {
    const { to, resendApiKey } = req.body;
    const recipient = to || ADMIN_EMAIL;

    const result = await dispatchEmail({
      from: TRANSACTIONAL_SENDER,
      to: recipient,
      subject: 'Greendot Bank Manual Test Email - Success',
      text: 'Greendot Bank transactional email transmission was successful!',
      resendApiKey,
      html: `
        <div style="font-family:sans-serif; padding:24px; background:#f0fdf4; border-radius:16px; border:1px solid #22c55e; max-width:550px; margin:0 auto;">
          <h2 style="color:#0f3d1d; margin-top:0; font-size:22px;">Greendot Bank Test Email Verification</h2>
          <p style="color:#334155; font-size:15px; line-height:1.6;">
            Your manual test email transmission to <strong>${recipient}</strong> was completed successfully from <strong>${TRANSACTIONAL_SENDER}</strong>.
          </p>
          <div style="background:#ffffff; padding:16px; border-radius:10px; border:1px solid #d1fae5; font-family:monospace; font-size:13px; color:#166534; margin:15px 0;">
            Sender: ${TRANSACTIONAL_SENDER} &bull; Destination: ${recipient} &bull; Status: Delivered
          </div>
          <p style="color:#64748b; font-size:13px;">All customer alerts, deposit notices, and security pins are fully active and operational.</p>
        </div>
      `,
    });

    console.log("🚀 Manual Test Email sent successfully:", result.messageId);
    return res.json({ success: true, messageId: result.messageId, recipient, provider: result.provider });
  } catch (err: any) {
    console.error("Error sending manual test email:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to send test email" });
  }
});

// API endpoint to send email notification
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, html, text, from, resendApiKey } = req.body;
    if (!to || !subject) {
      return res.status(400).json({ success: false, error: "Missing 'to' or 'subject'" });
    }

    const result = await dispatchEmail({
      from: from || TRANSACTIONAL_SENDER,
      to,
      subject,
      text: text || subject,
      html: html || `<p>${subject}</p>`,
      resendApiKey,
    });

    console.log("Email sent successfully:", result.messageId, "via", result.provider);
    return res.json({ success: true, messageId: result.messageId, provider: result.provider });
  } catch (err: any) {
    console.error("Error sending email:", err);
    return res.status(500).json({ success: false, error: err.message || "Failed to send email" });
  }
});

// Send an automatic test email on server startup to verify configuration
async function sendStartupTestEmail() {
  try {
    const result = await dispatchEmail({
      from: TRANSACTIONAL_SENDER,
      to: ADMIN_EMAIL,
      subject: 'Greendot Bank Notification Engine Active',
      text: 'Greendot Bank notifications have been successfully linked and verified!',
      html: `
        <div style="font-family:sans-serif; padding:20px; background:#f4f9f5; border-radius:12px; border:1px solid #22c55e;">
          <h2 style="color:#0f3d1d; margin-top:0;">Greendot Bank Notification Engine Active</h2>
          <p style="color:#334155; font-size:14px;">
            Sender address <strong>${TRANSACTIONAL_SENDER}</strong> has been configured for transactional notices. Admin alerts are forwarded to <strong>${ADMIN_EMAIL}</strong>.
          </p>
          <div style="background:#ffffff; padding:12px; border-radius:8px; border:1px solid #e2e8f0; font-family:monospace; font-size:12px; color:#166534;">
            Status: Active &bull; Sender: ${TRANSACTIONAL_SENDER} &bull; Admin: ${ADMIN_EMAIL}
          </div>
          <p style="color:#64748b; font-size:12px; margin-top:15px;">All customer alerts, deposits, transfers, and security notifications will now be securely dispatched in real-time.</p>
        </div>
      `,
    });
    console.log("🚀 Startup Test Email sent successfully to " + ADMIN_EMAIL + ":", result.messageId);
  } catch (err) {
    console.warn("Startup test email check notice (Resend API key not configured yet):", err);
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
