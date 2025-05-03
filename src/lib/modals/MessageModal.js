import { firestoreService } from "@/lib/utils/firebaseUtils";

/* ======================
   FIELD DEFINITIONS
====================== */
const MessageFields = {
  COLLECTION: "messages",
  FIELDS: {
    chatId: { type: "string", required: true },
    sender: { type: "string", required: true, enum: ["user", "bot"] },
    content: { type: "string", required: false },
    responseData: { type: "array", required: false },
    createdAt: { type: "timestamp", default: () => new Date() },
  },
};

/* ======================
   VALIDATION HELPERS
====================== */
const validateMessage = (data) => {
  const errors = [];

  Object.entries(MessageFields.FIELDS).forEach(([field, config]) => {
    if (config.required && !data[field]) {
      errors.push(`${field} is required`);
    }

    if (config.enum && data[field] && !config.enum.includes(data[field])) {
      errors.push(`${field} must be one of: ${config.enum.join(", ")}`);
    }
  });

  return errors;
};

/* ======================
   DATABASE OPERATIONS
====================== */
const MessageModel = {
  // Create new message
  create: async (db, data) => {
    const validationErrors = validateMessage(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    const messageData = Object.entries(MessageFields.FIELDS).reduce(
      (acc, [field, config]) => {
        acc[field] =
          data[field] !== undefined
            ? data[field]
            : config.default !== undefined
            ? typeof config.default === "function"
              ? config.default()
              : config.default
            : null;
        return acc;
      },
      {}
    );

    const message = await firestoreService.add(
      MessageFields.COLLECTION,
      messageData,
      db
    );

    return message;
  },

  // Get all messages by chatId (ordered)
  getByChatId: async (db, chatId, limit = 50, startAfter = null) => {
    const queryConditions = [["chatId", "==", chatId]];
    const orderBy = ["createdAt", "asc"];
    const messages = await firestoreService.query(
      MessageFields.COLLECTION,
      queryConditions,
      db,
      orderBy,
      limit,
      startAfter
    );
    return messages.docs;
  },

  // Delete message
  delete: async (db, messageId) => {
    await firestoreService.delete(MessageFields.COLLECTION, messageId, db);
    return true;
  },

  // Update message
  update: async (db, messageId, data) => {
    const validationErrors = validateMessage(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    const messageData = Object.entries(MessageFields.FIELDS).reduce(
      (acc, [field, config]) => {
        acc[field] =
          data[field] !== undefined
            ? data[field]
            : config.default !== undefined
            ? typeof config.default === "function"
              ? config.default()
              : config.default
            : null;
        return acc;
      },
      {}
    );

    const message = await firestoreService.update(
      MessageFields.COLLECTION,
      messageId,
      messageData,
      db
    );
    return message;
  },
};

export default MessageModel;
