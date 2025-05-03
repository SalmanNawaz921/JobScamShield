import UserModel from "@/lib/modals/UserModal";
import { db } from "@/lib/config/firebaseConfig";
import ChatModel from "@/lib/modals/ChatModal";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({ message: " Chat ID is required" });
    }
    const chat = await ChatModel.deleteChat(db, chatId);
    return res.status(200).json({
      chat,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
