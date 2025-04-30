import { queryFirestore } from "@/lib/utils/firebaseUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { docs, empty } = await queryFirestore('persons', [
    ['userId', '==', decodedToken.userId]
  ], db);
  
  if (empty) {
    return res.status(404).json({ error: "Person not found" });
  }
  const userDoc = docs[0];

  return res.status(200).json({
    qrCode: qrDataURL,
    secret: secret.base32,
  });
}
