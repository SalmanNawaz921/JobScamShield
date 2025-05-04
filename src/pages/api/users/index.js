// pages/api/admin/security-logs.js
import { db } from "@/lib/config/firebaseConfig";
import { authMiddleware } from "@/lib/auth/middleware/authMiddleware";
import UserModel from "@/lib/modals/UserModal";

export default authMiddleware(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { userId } = req.query;
  if (req.user.role !== "admin" && !userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

//   try {
    if (!userId) {
      const users = await UserModel.getAll(db);
      return res.status(200).json(users);
    }

    const user = await UserModel.getById(db, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
});
