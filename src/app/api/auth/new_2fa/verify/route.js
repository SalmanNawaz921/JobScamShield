// app/api/verify-2fa/route.js

import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { db } from "@/lib/config/firebaseConfig";
import speakeasy from "speakeasy";
import UserModel from "@/lib/modals/UserModal";

export async function POST(request) {
  return authMiddleware(async (request) => {
    try {
      const { secret, code } = await request.json(); // Extracting data from the request

      if (!secret || !code) {
        return new Response(
          JSON.stringify({ message: "Both secret and code are required" }),
          { status: 400 }
        );
      }

      // Case 1: Login-time verification (no session)
      if (!request.user) {
        const verified = speakeasy.totp.verify({
          secret: secret,
          encoding: "base32",
          token: code,
          window: 2, // Allows 2 time-steps tolerance
        });

        return new Response(JSON.stringify({ verified }), { status: 200 });
      }

      // Case 2: First-time 2FA setup (authenticated user)
      const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: code,
        window: 2,
      });

      if (verified) {
        // Store the 2FA secret for the authenticated user
        await UserModel.store2FASecret(db, request.user.id, {
          twoFactorEnabled: true,
          twoFactorSecret: secret,
        });

        return new Response(
          JSON.stringify({
            verified: true,
            message: "2FA successfully enabled",
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          verified: false,
          message: "Invalid verification code",
        }),
        { status: 401 }
      );
    } catch (error) {
      console.error('2FA verification error:', error);
      return new Response(
        JSON.stringify({
          message: 'Internal server error during verification',
        }),
        { status: 500 }
      );
    }
  })(request); // Using authMiddleware to wrap the handler
}
