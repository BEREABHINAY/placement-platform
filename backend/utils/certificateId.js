import crypto from "crypto";

// Generates a human-shareable, unique-enough certificate code, e.g. "LDC-2026-9F3A2B"
export const generateCertificateId = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `LDC-${year}-${random}`;
};
