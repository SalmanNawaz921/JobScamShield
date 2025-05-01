import { db } from "@/lib/config/firebaseConfig";
import User from "@/lib/modals/UserModal";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, firstName, lastName, username } = req.body;
    const userExists = await User.getByEmail(db, email);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await User.create(db, {
      email,
      password,
      firstName,
      lastName,
      username,
    });
    if (!user) {
      return res.status(400).json({ error: "User creation failed" });
    }
    return res.status(200).json({ userId:user.id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
