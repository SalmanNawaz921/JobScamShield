// pages/api/verify-2fa.js (Page Router)
import { db } from "@/lib/config/firebaseConfig";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import UserModel from "@/lib/modals/UserModal";
import speakeasy from "speakeasy";

const verify2FAHandler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

    try {
  const { secret, code } = req.body;
  if (!secret || !code) {
    return res.status(400).json({
      message: "Both secret and code are required",
    });
  }

  // Case 1: Login-time verification (no session)
  if (!req.user) {
    //   const decryptedSecret = await decrypt(secret);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
      window: 2 // Allows 2 time-steps tolerance
    });

    return res.json({ verified });
  }

  // Case 2: First-time 2FA setup (authenticated user)
  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: code,
    window: 2,
  });
  if (verified) {
    await UserModel.store2FASecret(db,req.user.id, {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    });
    return res.json({
      verified: true,
      message: "2FA successfully enabled",
    });
  }

  return res.json({
    verified: false,
    message: "Invalid verification code",
  });

    } catch (error) {
      console.error('2FA verification error:', error);
      return res.status(500).json({
        message: 'Internal server error during verification'
      });
    }
};

export default authMiddleware(verify2FAHandler);
