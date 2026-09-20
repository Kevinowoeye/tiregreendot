import type { IncomingMessage, ServerResponse } from "http";
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
    const { to, subject, html, text, from } = req.body || {};
    if (!to || !subject) {
      return res.status(400).json({ success: false, error: "Missing 'to' or 'subject'" });
    }

    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
    const SMTP_USER = process.env.SMTP_USER || "greendot.bank.supportmail@gmail.com";
    const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
    const sender = from || `"Greendot Bank Support" <${SMTP_USER}>`;

    if (!SMTP_PASS) {
      console.warn('[Vercel Serverless] SMTP_PASS not set; operating in simulation mode.');
      return res.status(200).json({
        success: true,
        simulated: true,
        messageId: `smtp-simulated-${Date.now()}`,
        provider: 'gmail-smtp',
        note: 'SMTP_PASS not set in Vercel environment variables. Email logged in simulation mode.',
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
      to,
      subject,
      html: html || `<p>${subject}</p>`,
      text: text || subject,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      provider: 'gmail-smtp',
      recipient: to,
    });
  } catch (err: any) {
    console.error('[Vercel Serverless] Failed to send email via Gmail SMTP:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch email via Gmail SMTP',
      provider: 'gmail-smtp',
    });
  }
}
