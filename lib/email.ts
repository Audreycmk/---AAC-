import nodemailer from 'nodemailer';

type SendVerificationEmailInput = {
  to: string;
  code: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendVerificationEmail({ to, code }: SendVerificationEmailInput) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('Email service not configured');
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@aac-app.local';

  await transporter.sendMail({
    from,
    to,
    subject: 'Your AAC Login Verification Code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your AAC Login Verification Code</h2>
        <p>Use the code below to finish logging in. It expires in 10 minutes.</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">
          ${code}
        </div>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
}
