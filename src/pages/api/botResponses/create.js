import { db } from "@/lib/config/firebaseConfig";
import BotResponseModel from "@/lib/modals/BotResponseModal";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { chatId, sender, content, responseData, createdAt,responseTo } = req.body;

    const botResponse = await BotResponseModel.create(db, {
      chatId,
      sender,
      content,
      createdAt,
      responseTo,
      responseData,
    });
    return res.status(200).json({
      message: "BotResponse created successfully",
      data: botResponse,
    });
  } catch (error) {
    console.error("Error creating bot response:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
