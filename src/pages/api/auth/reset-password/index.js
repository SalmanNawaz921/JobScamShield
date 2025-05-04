import { db } from "@/lib/config/firebaseConfig";
import UserModel from "@/lib/modals/UserModal";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { token, email, newPassword } = req.body;
  console.log("Reset password request:", req.body);
  if (!token || !email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid input.",
    });
  }

  try {
    const user = await UserModel.getByEmail(db, email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = user.id;
    // Use the new verification method
    const isValidToken = await UserModel.verifyResetPasswordToken(
      db,
      userId,
      token
    );
    console.log("Token verification result:", isValidToken);
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Update password
    await UserModel.updatePassword(db, userId, newPassword);

    // Invalidate the token after successful reset
    await UserModel.clearResetPasswordToken(db, userId);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
}
