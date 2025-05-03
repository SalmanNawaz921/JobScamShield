import { db } from "@/lib/config/firebaseConfig";
import BotResponseModel from "@/lib/modals/BotResponseModal";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { chatId } = req.query;
    const messages = await BotResponseModel.getByChatId(db, chatId);
    return res.status(200).json({
      message: "BotResponse fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching BotResponse:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
