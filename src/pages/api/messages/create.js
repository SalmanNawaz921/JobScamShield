import { db } from "@/lib/config/firebaseConfig";
import MessageModel from "@/lib/modals/MessageModal";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { chatId, sender, content, responseData, createdAt } = req.body;

    const message = await MessageModel.create(db, {
      chatId,
      sender,
      content,
      createdAt,
      responseData,
    });
    return res.status(200).json({
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
