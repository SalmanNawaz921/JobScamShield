import { db } from "@/lib/config/firebaseConfig";
import MessageModel from "@/lib/modals/MessageModal";
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { messageId, chatId, sender, content, createdAt } = req.body;

    const message = await MessageModel.update(db, messageId, {
      chatId,
      sender,
      content,
      createdAt,
    });
    return res.status(200).json({
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
