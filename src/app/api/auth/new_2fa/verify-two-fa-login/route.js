// app/api/auth/verify-2fa-login/route.js

import { db } from "@/lib/config/firebaseConfig";
import UserModel from "@/lib/modals/UserModal";
import { generateToken } from "@/lib/utils/generateToken";
import { serialize } from "cookie";
import speakeasy from "speakeasy";

export async function POST(request) {
  // try {
  const { userId, code } = await request.json(); // Extract data from the request body

  if (!userId || !code) {
    return new Response(
      JSON.stringify({ message: "User ID and OTP code are required" }),
      { status: 400 }
    );
  }

  let user = await UserModel.getById(db, userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  const twoFactorSecret = await UserModel.getTwoFactorSecret(db, userId);
  console.log("Two Factor", twoFactorSecret);
  console.log("code", code);
  console.log("Speakeasy module:", speakeasy);

  if (!user.twoFactorEnabled || !twoFactorSecret) {
    return new Response(
      JSON.stringify({ message: "2FA not enabled for this user" }),
      { status: 400 }
    );
  }
  const verified = speakeasy.totp.verify({
    secret: twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 2, // Allows 2 time-steps tolerance
  });

  if (verified) {
    // Generate session token
    const token = generateToken(user);
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        verified: true,
        message: "2FA verification successful",
      }),
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  }

  return new Response(
    JSON.stringify({ verified: false, message: "Invalid code" }),
    { status: 401 }
  );
  // } catch (err) {
  //   console.error("Login 2FA verification error:", err);
  //   return new Response(JSON.stringify({ message: "Internal server error" }), {
  //     status: 500,
  //   });
  // }
}
