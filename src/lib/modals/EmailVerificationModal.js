import crypto from "crypto";
import { firestoreService } from "@/lib/utils/firebaseUtils";

/* ======================
   FIELD DEFINITIONS
====================== */
const EmailVerificationFields = {
  COLLECTION: "emailVerifications",
  FIELDS: {
    userId: { type: "string", required: true },
    email: { type: "string", required: true },
    token: { type: "string", required: true },
    expiresAt: { type: "timestamp", required: true },
    used: { type: "boolean", default: false },
  },
};

/* ======================
   DATABASE OPERATIONS
====================== */
const EmailVerificationModel = {
  // Generate and store verification token
  createToken: async (db, userId, email) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await firestoreService.set(
      EmailVerificationFields.COLLECTION,
      token,
      { userId, email, expiresAt, used: false },
      db
    );

    return token;
  },

  // Validate token
  verifyToken: async (db, token) => {
    const doc = await firestoreService.get(
      EmailVerificationFields.COLLECTION,
      token,
      db
    );

    if (!doc.exists) return false;

    const data = doc.data();
    if (data.used || new Date(data.expiresAt) < new Date()) {
      return false;
    }

    await firestoreService.update(
      EmailVerificationFields.COLLECTION,
      token,
      { used: true },
      db
    );

    return data;
  },
};

export default EmailVerificationModel;
