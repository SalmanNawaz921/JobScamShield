import { db } from "@/lib/config/firebaseConfig";
import MessageModel from "@/lib/modals/MessageModal";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { chatId } = req.query;
    const messages = await MessageModel.getByChatId(db, chatId);
    return res.status(200).json({
      message: "Message fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
