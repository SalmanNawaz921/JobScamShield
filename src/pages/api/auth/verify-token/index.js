import { verifyToken } from "@/lib/auth/services/tokenService";
import { db } from "@/lib/config/firebaseConfig";
import UserModel from "@/lib/modals/UserModal";
import jwt from "jsonwebtoken";
export default async function handler(req, res) {
  const { token } = req.cookies;
  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  try {
    // Verify the Firebase ID token using the admin SDK
    const decodedToken = await verifyToken(token, req);
    const { id: userId } = decodedToken;
    const user = await UserModel.getById(db, userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ valid: true, userData: user });
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ valid: false, message: "Unauthorized" });
  }
}
