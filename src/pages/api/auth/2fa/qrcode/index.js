import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = speakeasy.generateSecret({
    name: "Job Scam Detector App 2FA",
    issuer: "Job Scam Security",
  });

  if (!secret.otpauth_url) {
    return res.status(500).json({ message: "Failed to generate OTP URL" });
  }

  const qrDataURL = await QRCode.toDataURL(secret.otpauth_url);

  return res.status(200).json({
    qrCode: qrDataURL,
    secret: secret.base32,
  });
}
