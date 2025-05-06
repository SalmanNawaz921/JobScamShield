// import { firestoreService } from "@/lib/utils/firebaseUtils";

// /* ======================
//    FIELD DEFINITIONS
// ====================== */
// const MessageFields = {
//   COLLECTION: "messages",
//   FIELDS: {
//     chatId: { type: "string", required: true },
//     sender: { type: "string", required: true, enum: ["user", "bot"] },
//     content: { type: "string", required: false },
//     createdAt: { type: "timestamp", default: () => new Date() },
//   },
// };

// /* ======================
//    VALIDATION HELPERS
// ====================== */
// const validateMessage = (data) => {
//   const errors = [];

//   Object.entries(MessageFields.FIELDS).forEach(([field, config]) => {
//     if (config.required && !data[field]) {
//       errors.push(`${field} is required`);
//     }

//     if (config.enum && data[field] && !config.enum.includes(data[field])) {
//       errors.push(`${field} must be one of: ${config.enum.join(", ")}`);
//     }
//   });

//   return errors;
// };

// /* ======================
//    DATABASE OPERATIONS
// ====================== */
// const MessageModel = {
//   // Create new message
//   create: async (db, data) => {
//     const validationErrors = validateMessage(data);
//     if (validationErrors.length > 0) {
//       throw new Error(validationErrors.join(", "));
//     }

//     const messageData = Object.entries(MessageFields.FIELDS).reduce(
//       (acc, [field, config]) => {
//         acc[field] =
//           data[field] !== undefined
//             ? data[field]
//             : config.default !== undefined
//             ? typeof config.default === "function"
//               ? config.default()
//               : config.default
//             : null;
//         return acc;
//       },
//       {}
//     );

//     const message = await firestoreService.add(
//       MessageFields.COLLECTION,
//       messageData,
//       db
//     );

//     return message;
//   },

//   // Get all messages by chatId (ordered)
//   getByChatId: async (db, chatId, limit = 50, startAfter = null) => {
//     const queryConditions = [["chatId", "==", chatId]];
//     const orderBy = ["createdAt", "asc"];
//     const messages = await firestoreService.query(
//       MessageFields.COLLECTION,
//       queryConditions,
//       db,
//       orderBy,
//       limit,
//       startAfter
//     );
//     return messages.docs;
//   },

//   // Delete message
//   delete: async (db, messageId) => {
//     await firestoreService.delete(MessageFields.COLLECTION, messageId, db);
//     return true;
//   },

//   // Update message
//   update: async (db, messageId, data) => {
//     const validationErrors = validateMessage(data);
//     if (validationErrors.length > 0) {
//       throw new Error(validationErrors.join(", "));
//     }

//     const messageData = Object.entries(MessageFields.FIELDS).reduce(
//       (acc, [field, config]) => {
//         acc[field] =
//           data[field] !== undefined
//             ? data[field]
//             : config.default !== undefined
//             ? typeof config.default === "function"
//               ? config.default()
//               : config.default
//             : null;
//         return acc;
//       },
//       {}
//     );

//     const message = await firestoreService.update(
//       MessageFields.COLLECTION,
//       messageId,
//       messageData,
//       db
//     );
//     return message;
//   },
// };

// export default MessageModel;

import { firestoreService } from "@/lib/utils/firebaseUtils";
import SecurityValidator from "@/lib/utils/SecurityValidator";

const MessageFields = {
  COLLECTION: "messages",
  FIELDS: {
    chatId: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.validateFirebaseId(value)
    },
    sender: { 
      type: "string", 
      required: true, 
      enum: ["user", "bot"],
      validate: (value) => SecurityValidator.validateEnum(value, ["user", "bot"])
    },
    content: { 
      type: "string", 
      required: false,
      validate: (value) => !value || SecurityValidator.validateChatMessage(value)
    },
    createdAt: { 
      type: "timestamp", 
      default: () => new Date(),
      validate: SecurityValidator.validateTimestamp
    }
  }
};

const validateMessageData = (data) => {
  return SecurityValidator.validateObject(data, MessageFields.FIELDS);
};

const sanitizeMessageData = (data) => {
  const sanitized = {};
  
  // Only process fields defined in MessageFields
  Object.keys(MessageFields.FIELDS).forEach((field) => {
    if (data[field] !== undefined) {
      switch (MessageFields.FIELDS[field].type) {
        case 'string':
          sanitized[field] = SecurityValidator.sanitizeString(data[field]);
          break;
        case 'timestamp':
          sanitized[field] = data[field] instanceof Date ? data[field] : new Date(data[field]);
          break;
        default:
          sanitized[field] = data[field];
      }
    } else if (MessageFields.FIELDS[field].default !== undefined) {
      sanitized[field] = typeof MessageFields.FIELDS[field].default === 'function' 
        ? MessageFields.FIELDS[field].default() 
        : MessageFields.FIELDS[field].default;
    }
  });

  return sanitized;
};

const MessageModel = {
  create: async (db, data) => {
    const sanitizedData = sanitizeMessageData(data);
    console.log("Sanitized Data", sanitizedData);
    const validationErrors = validateMessageData(sanitizedData);
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    // Additional business logic validation
    if (!sanitizedData.content) {
      throw new Error("Message content cannot be empty");
    }

    const ref = await firestoreService.add(
      MessageFields.COLLECTION,
      sanitizedData,
      db
    );

    return { id: ref.id, ...sanitizedData };
  },

  getByChatId: async (db, chatId, limit = 50, startAfter = null) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    if (!SecurityValidator.validateFirebaseId(sanitizedChatId)) {
      throw new Error("Invalid chat ID format");
    }

    const queryConditions = [["chatId", "==", sanitizedChatId]];
    const orderBy = ["createdAt", "asc"];
    
    const messages = await firestoreService.query(
      MessageFields.COLLECTION,
      queryConditions,
      db,
      orderBy,
      limit,
      startAfter
    );

    return messages.docs.map(doc => ({
      id: doc.id,
      ...doc
    }));
  },

  delete: async (db, messageId) => {
    const sanitizedMessageId = SecurityValidator.sanitizeString(messageId);
    if (!SecurityValidator.validateFirebaseId(sanitizedMessageId)) {
      throw new Error("Invalid message ID format");
    }

    await firestoreService.delete(
      MessageFields.COLLECTION,
      sanitizedMessageId,
      db
    );

    return { id: sanitizedMessageId, deleted: true };
  },

  // Strict update only allowing content modification
  updateContent: async (db, messageId, newContent) => {
    const sanitizedMessageId = SecurityValidator.sanitizeString(messageId);
    if (!SecurityValidator.validateFirebaseId(sanitizedMessageId)) {
      throw new Error("Invalid message ID format");
    }

    const sanitizedContent = SecurityValidator.sanitizeString(newContent);
    if (!SecurityValidator.validateChatMessage(sanitizedContent)) {
      throw new Error("Invalid message content");
    }

    await firestoreService.update(
      MessageFields.COLLECTION,
      sanitizedMessageId,
      { content: sanitizedContent },
      db
    );

    const updatedMessage = await firestoreService.get(
      MessageFields.COLLECTION,
      sanitizedMessageId,
      db
    );

    return { id: sanitizedMessageId, ...updatedMessage };
  }
};

export default MessageModel;