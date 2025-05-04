import { firestoreService } from "@/lib/utils/firebaseUtils";

const SecurityLogFields = {
  COLLECTION: "security_logs",
  FIELDS: {
    userId: { type: "string", required: false },
    eventType: { type: "string", required: true },
    ipAddress: { type: "string", required: false },
    userAgent: { type: "string", required: false },
    metadata: { type: "object", required: false },
    createdAt: { type: "timestamp", default: () => new Date() },
  },
};

const SecurityLogModel = {
  create: async (db, data) => {
    const logData = {
      ...data,
      createdAt: new Date(),
    };
    logData.ipAddress = logData.ipAddress || null;
    return await firestoreService.add(
      SecurityLogFields.COLLECTION,
      logData,
      db
    );
  },

  getByUserId: async (db, userId, limit = 100) => {
    const result = await firestoreService.query(
      SecurityLogFields.COLLECTION,
      [["userId", "==", userId]],
      db,
      { limit, orderBy: ["createdAt", "desc"] }
    );
    return result.docs;
  },

  getRecentEvents: async (db, limit = 100) => {
    const result = await firestoreService.query(
      SecurityLogFields.COLLECTION,
      [],
      db,
      { limit, orderBy: ["createdAt", "desc"] }
    );
    return result.docs;
  },
};

export default SecurityLogModel;
