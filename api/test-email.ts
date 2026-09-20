import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { to } = req.body || {};
    const recipient = to || 'jade66oc@gmail.com';

    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
    const SMTP_USER = process.env.SMTP_USER || "greendot.bank.supportmail@gmail.com";
    const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
    const sender = `"Greendot Bank Support" <${SMTP_USER}>`;

    if (!SMTP_PASS) {
      return res.status(400).json({
        success: false,
        error: "SMTP_PASS environment variable (Gmail App Password) is not configured yet. Please add SMTP_PASS to your Vercel Project Settings to enable live email delivery.",
        provider: "gmail-smtp",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: 'Greendot Bank Manual Test Email - Gmail SMTP Success',
      text: 'Greendot Bank transactional email transmission via Gmail SMTP was successful!',
      html: `
        <div style="font-family:sans-serif; padding:24px; background:#f0fdf4; border-radius:16px; border:1px solid #22c55e; max-width:550px; margin:0 auto;">
          <h2 style="color:#0f3d1d; margin-top:0; font-size:22px;">Greendot Bank Test Email Verification</h2>
          <p style="color:#334155; font-size:15px; line-height:1.6;">
            Your manual test email transmission to <strong>${recipient}</strong> was completed successfully from <strong>${sender}</strong> via Gmail SMTP.
          </p>
          <div style="background:#ffffff; padding:16px; border-radius:10px; border:1px solid #d1fae5; font-family:monospace; font-size:13px; color:#166534; margin:15px 0;">
            Sender: ${sender} &bull; Destination: ${recipient} &bull; Host: ${SMTP_HOST}:${SMTP_PORT} &bull; Status: Delivered
          </div>
          <p style="color:#64748b; font-size:13px;">All customer alerts, deposit notices, and security pins are fully active and operational via Gmail SMTP.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      recipient,
      provider: 'gmail-smtp',
    });
  } catch (err: any) {
    console.error('[Vercel Serverless] Manual test email error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch test email via Gmail SMTP',
      provider: 'gmail-smtp',
    });
  }
}
