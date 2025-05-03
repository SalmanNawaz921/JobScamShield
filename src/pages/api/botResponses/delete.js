import { db } from "@/lib/config/firebaseConfig";
import BotResponseModel from "@/lib/modals/BotResponseModal";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { messageId } = req.params;

    await BotResponseModel.delete(db, messageId);
    return res.status(200).json({
      message: "BotResponse deleted successfully",
    });
  } catch (error) {
    console.error("Error deleted botResponse:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
