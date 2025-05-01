import UserModel from "@/lib/modals/UserModal";
import { db } from "@/lib/config/firebaseConfig";
import ChatModel from "@/lib/modals/ChatModal";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { userId, chatId, data } = req.body;
    if (!userId || !chatId || !data) {
      return res
        .status(400)
        .json({ message: "User ID and Chat ID and Data are required" });
    }
    const user = await UserModel.getById(db, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const chat = await ChatModel.ediChat(db, chatId, data);
    return res.status(200).json({
      chat: {
        id: chat.id,
        userId: chat.userId,
        startedAt: chat.startedAt,
      },
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
