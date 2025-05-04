// pages/api/auth/verify-2fa-login.js

import { generateToken } from "@/lib/auth/services/tokenService";
import { db } from "@/lib/config/firebaseConfig";
import UserModel from "@/lib/modals/UserModal";
import { serialize } from "cookie";
import speakeasy from "speakeasy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res
        .status(400)
        .json({ message: "User ID and OTP code are required" });
    }

    let user = await UserModel.getById(db, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const twoFactorSecret = await UserModel.getTwoFactorSecret(db, userId);
    if (!user.twoFactorEnabled || !twoFactorSecret) {
      return res.status(400).json({ message: "2FA not enabled for this user" });
    }

    const verified = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 2,
    });

    if (verified) {
      // Return session token or success message
      // Generate a QR code for 2FA setup
      const token = await generateToken(user, req);
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      res.setHeader("Set-Cookie", cookie);

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        verified: true,
        message: "2FA verification successful",
      });
    }

    return res.status(401).json({ verified: false, message: "Invalid code" });
  } catch (err) {
    console.error("Login 2FA verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
