// Sends the OTP by email via Brevo's HTTPS API (not SMTP).
// Render's free tier blocks outbound SMTP ports (25/465/587), so we use
// Brevo's transactional email API over HTTPS (port 443) instead.
// Falls back to logging in the console when no API key is configured,
// so local dev never blocks on email setup.

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const subjectByPurpose = {
  signup: "Verify your email — Placement Platform",
  login: "Your login verification code",
  password_reset: "Reset your password",
};

// Parses EMAIL_FROM="placement prep<abhinayvarma11.6@gmail.com>" into { name, email }
const parseFrom = () => {
  const raw = process.env.EMAIL_FROM || "";
  const match = raw.match(/^(.*)<(.+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "Placement Platform", email: raw.trim() };
};

export const sendOtpEmail = async ({ to, code, purpose }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.log(`\n[dev-email] To: ${to}`);
    console.log(`[dev-email] Subject: ${subjectByPurpose[purpose]}`);
    console.log(`[dev-email] OTP CODE: ${code}\n`);
    return { simulated: true };
  }

  const html = `
    <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color:#0B0F1A;">Placement Platform</h2>
      <p>Your one-time verification code is:</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color:#FFB447;">${code}</p>
      <p style="color:#6b7280; font-size: 14px;">
        This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
        If you didn't request this, you can ignore this email.
      </p>
    </div>
  `;

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: parseFrom(),
        to: [{ email: to }],
        subject: subjectByPurpose[purpose] || "Your verification code",
        htmlContent: html,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("❌ Brevo API error:", res.status, data);
      throw new Error(data.message || `Brevo API responded with ${res.status}`);
    }

    console.log("✅ Email sent successfully:", data.messageId || data);
    return { simulated: false };
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
};
