// pages/api/admin/security-logs.js
import { db } from "@/lib/config/firebaseConfig";
import { authMiddleware } from "@/lib/auth/middleware/authMiddleware";
import SecurityLogModel from "@/lib/modals/SecurityLogModal";

export default authMiddleware(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { limit = 100, userId } = req.query;
    const logs = userId
      ? await SecurityLogModel.getByUserId(db, userId, parseInt(limit))
      : await SecurityLogModel.getRecentEvents(db, parseInt(limit));

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs" });
  }
});
