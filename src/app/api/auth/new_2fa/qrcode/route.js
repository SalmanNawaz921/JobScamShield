// app/api/auth/2fa/setup/route.js

import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

export async function GET(request) {
  try {
    // Generate the 2FA secret
    const secret = speakeasy.generateSecret({
      name: "Job Scam Shield",
      issuer: "Job Scam Shield",
    });

    if (!secret.otpauth_url) {
      return new Response(
        JSON.stringify({ message: "Failed to generate OTP URL" }),
        { status: 500 }
      );
    }

    // Generate QR code data URL
    const qrDataURL = await QRCode.toDataURL(secret.otpauth_url);

    // Return the secret and QR code as the response
    return new Response(
      JSON.stringify({
        qrCode: qrDataURL,
        secret: secret.base32,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating 2FA setup:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
