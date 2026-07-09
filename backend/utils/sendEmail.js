import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOtpEmail = async ({ to, code, purpose }) => {
  const subjectByPurpose = {
    signup: "Verify your email — Placement Platform",
    login: "Your login verification code",
    password_reset: "Reset your password",
  };

  const email = new Brevo.SendSmtpEmail();

  email.sender = {
    name: "Placement Platform",
    email: "abhinayvarma11.6@gmail.com",
  };

  email.to = [
    {
      email: to,
    },
  ];

  email.subject =
    subjectByPurpose[purpose] || "Your verification code";

  email.htmlContent = `
    <h2>Placement Platform</h2>
    <p>Your OTP is:</p>
    <h1>${code}</h1>
    <p>This code expires in ${
      process.env.OTP_EXPIRY_MINUTES || 10
    } minutes.</p>
  `;

  await apiInstance.sendTransacEmail(email);
};