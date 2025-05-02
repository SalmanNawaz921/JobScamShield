import { db } from "@/lib/config/firebaseConfig";
import MessageModel from "@/lib/modals/MessageModal";
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { messageId } = req.params;

    await MessageModel.delete(db, messageId);
    return res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleted message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
