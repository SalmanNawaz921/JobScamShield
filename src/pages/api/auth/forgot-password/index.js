import { db } from "@/lib/config/firebaseConfig";
import UserModel from "@/lib/modals/UserModal";
import { sendEmail } from "@/lib/utils/email";
import { emailTemplateBody } from "@/lib/utils/verifyMail";
import { randomBytes } from "crypto";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await UserModel.getByEmail(db, email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const subject = "Reset Password Request";
    const message = "Click the link below to reset your password:";
    // Generate reset token and expiry (1 hour from now)
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    const url = `http://localhost:3000/account/reset-password?token=${resetToken}&email=${email}`;

    // Store token using your UserModel
    await UserModel.setResetPasswordToken(
      db,
      user.id,
      resetToken,
      resetTokenExpiry
    );
    const emailBody = await emailTemplateBody({
      name: email,
      message: message + " " + url,
      link: url,
    });
    await sendEmail({
      to: email,
      subject: subject,
      template: emailBody,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
