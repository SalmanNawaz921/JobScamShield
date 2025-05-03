import UserModel from "@/lib/modals/UserModal";
import { db } from "@/lib/config/firebaseConfig";
import { generateToken } from "@/lib/utils/generateToken";
import { serialize } from "cookie";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await UserModel.getByEmail(db, email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isPasswordValid = await UserModel.verifyPassword(db, user.id, password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (user.twoFactorEnabled) {
    // ✅ Set a short-lived twofa_pending cookie
    const twofaCookie = serialize("twofa_pending", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5, // 5 minutes
      path: "/",
    });
    res.setHeader("Set-Cookie", twofaCookie);

    return res.status(200).json({
      requires2FA: true,
      user: { id: user.id },
      message: "2FA verification required",
    });
  }

  // Generate a QR code for 2FA setup
  const token = generateToken(user);
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
    },
    message: "Login successful",
  });
}
