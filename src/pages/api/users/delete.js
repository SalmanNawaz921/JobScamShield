// pages/api/admin/security-logs.js
import { db } from "@/lib/config/firebaseConfig";
import { authMiddleware } from "@/lib/auth/middleware/authMiddleware";
import UserModel from "@/lib/modals/UserModal";

export default authMiddleware(async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    await UserModel.delete(db, userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});
