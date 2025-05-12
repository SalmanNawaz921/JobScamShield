import { db } from "@/lib/config/firebaseConfig";
import EmailVerificationModel from "@/lib/modals/EmailVerificationModal";
import { firestoreService } from "@/lib/utils/firebaseUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  // try {
  const verification = await EmailVerificationModel.verifyToken(db, token);

  if (!verification) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
  // Update user's email verification status
  await firestoreService.update(
    "users",
    verification.userId,
    { emailVerified: true },
    db
  );

  return res.status(200).json({ success: true });
  // } catch (error) {
  //   console.error("Email verification error:", error);
  //   return res.status(500).json({ error: "Internal server error" });
  // }
}
