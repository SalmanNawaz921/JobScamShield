import { db } from "@/lib/config/firebaseConfig";
import BotResponseModel from "@/lib/modals/BotResponseModal";
export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { messageId, data } = req.body;

    const message = await BotResponseModel.update(db, messageId, {
      ...data,
    });
    return res.status(200).json({
      message: "BotResponse updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating BotResponse:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
