import nodemailer from "nodemailer";

let transporter = null;


const getTransporter = () => {
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS Exists:", !!process.env.SMTP_PASS);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP credentials missing");
    return null;
  }

  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};


// Sends the OTP by email. Falls back to logging in the console
// when no SMTP credentials are configured, so local dev never blocks on email setup.
export const sendOtpEmail = async ({ to, code, purpose }) => {
  const subjectByPurpose = {
    signup: "Verify your email — Placement Platform",
    login: "Your login verification code",
    password_reset: "Reset your password",
  };

  const t = getTransporter();

  if (!t) {
    console.log(`\n[dev-email] To: ${to}`);
    console.log(`[dev-email] Subject: ${subjectByPurpose[purpose]}`);
    console.log(`[dev-email] OTP CODE: ${code}\n`);
    return { simulated: true };
  }

  
try {
  await t.verify();
console.log("✅ SMTP verified");

const info = await t.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: subjectByPurpose[purpose] || "Your verification code",
    html: `
      <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color:#0B0F1A;">Placement Platform</h2>
        <p>Your one-time verification code is:</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color:#FFB447;">${code}</p>
        <p style="color:#6b7280; font-size: 14px;">
          This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
          If you didn't request this, you can ignore this email.
        </p>
      </div>
    `,
  });

  console.log("✅ Email sent successfully:", info);

  return { simulated: false };

} catch (err) {
  console.error("❌ Email sending failed:", err);
  throw err;
}

};
