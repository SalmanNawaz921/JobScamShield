import { db } from "@/lib/config/firebaseConfig";
import User from "@/lib/modals/UserModal";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, firstName, lastName, username } = req.body;
    const userId = User.create(db, {
      email,
      password,
      firstName,
      lastName,
      username,
    });
    if (!userId) {
      return res.status(400).json({ error: "User creation failed" });
    }
    return res.status(200).json({ userId });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
