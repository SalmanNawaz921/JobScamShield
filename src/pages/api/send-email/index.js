import { db } from "@/lib/config/firebaseConfig";
import EmailVerificationModel from "@/lib/modals/EmailVerificationModal";
import UserModel from "@/lib/modals/UserModal";
import { sendEmail } from "@/lib/utils/email";
import { emailTemplateBody } from "@/lib/utils/verifyMail";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, subject, message, link, name, userId } = req.body;

  if (!email || !subject || !message || !link || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const token = await EmailVerificationModel.createToken(db, userId, email);
    if (!token) {
      await UserModel.delete(db, userId);
      return res.status(400).json({ error: "Failed to create user" });
    }
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const emailBody = await emailTemplateBody({
      name: name,
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
