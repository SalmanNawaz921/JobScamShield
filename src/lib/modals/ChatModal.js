// import { firestoreService } from "../utils/firebaseUtils";
// import PricingPlanModel from "./PricingPlanModal";
// import SubscriptionModel from "./SubscriptionModal";

// const ChatFields = {
//   COLLECTION: "chats",
//   FIELDS: {
//     userId: { type: "string", required: true },
//     title: { type: "string", default: "" },
//     startedAt: { type: "timestamp", default: () => new Date() },
//     endedAt: { type: "timestamp", default: null },
//     durationMinutes: { type: "number", default: 0 }, // system-calculated
//     isActive: { type: "boolean", default: true },
//     messages: { type: "array", default: [] },
//   },
// };

// const ChatModel = {
//   create: async (db, userId) => {
//     // Get current user's subscription & pricing plan
//     // const sub = await SubscriptionModel.getByUserId(db, userId);
//     // if (!sub) throw new Error("Subscription not found");

//     // const plan = await PricingPlanModel.getById(db, sub.planId);
//     // if (!plan) throw new Error("Pricing plan not found");

//     // Check existing active or total chat count
//     // const userChats = await firestoreService.query(
//     //   ChatFields.COLLECTION,
//     //   [["userId", "==", userId]],
//     //   db
//     // );

//     // const chats = userChats.docs;
//     // const activeChats = chats.filter((chat) => chat.isActive);
//     // const hasActive = activeChats.length > 0;
//     // const totalChats = chats.length;

//     // if (hasActive && plan.maxDurationMinutes !== Infinity) {
//     //   throw new Error(
//     //     "You already have an active chat. End it before starting a new one."
//     //   );
//     // }

//     // if (totalChats >= plan.maxChats) {
//     //   throw new Error(
//     //     "You have reached the maximum number of chats for your plan."
//     //   );
//     // }
//     const ref = await firestoreService.add(
//       ChatFields.COLLECTION,
//       {
//         userId,
//         startedAt: new Date(),
//         isActive: true,
//       },
//       db
//     );
//     const newChat = await firestoreService.get(
//       ChatFields.COLLECTION,
//       ref.id,
//       db
//     );
//     return newChat;
//   },

//   endChat: async (db, chatId) => {
//     const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
//     if (!chat) throw new Error("Chat not found");

//     const now = new Date();
//     const startedAt = new Date(chat.startedAt);
//     const durationMinutes = Math.round((now - startedAt) / 60000); // convert ms to minutes

//     return await firestoreService.update(
//       ChatFields.COLLECTION,
//       chatId,
//       {
//         endedAt: now,
//         durationMinutes,
//         isActive: false,
//       },
//       db
//     );
//   },

//   getActiveChat: async (db, userId) => {
//     const result = await firestoreService.query(
//       ChatFields.COLLECTION,
//       [
//         ["userId", "==", userId],
//         ["isActive", "==", true],
//       ],
//       db
//     );
//     return result.empty ? null : result.docs[0];
//   },

//   getById: async (db, chatId) => {
//     const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
//     return chat;
//   },

//   ediChat: async (db, chatId, data) => {
//     const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
//     if (!chat) throw new Error("Chat not found");

//     await firestoreService.update(ChatFields.COLLECTION, chatId, data, db);
//     const updatedChat = await firestoreService.get(
//       ChatFields.COLLECTION,
//       chatId,
//       db
//     );
//     return updatedChat;
//   },

//   getAllChats: async (db, userId) => {
//     const chats = await firestoreService.query(
//       ChatFields.COLLECTION,
//       [["userId", "==", userId]],
//       db
//     );

//     if (chats.empty) return [];
//     return chats.docs;
//   },

//   deleteChat: async (db, chatId) => {
//     const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
//     if (!chat) throw new Error("Chat not found");

//     return await firestoreService.delete(ChatFields.COLLECTION, chatId, db);
//   },
// };

// export { ChatFields };
// export default ChatModel;

import { firestoreService } from "../utils/firebaseUtils";
import SecurityValidator from "../utils/SecurityValidator";
import PricingPlanModel from "./PricingPlanModal";
import SubscriptionModel from "./SubscriptionModal";

const ChatFields = {
  COLLECTION: "chats",
  FIELDS: {
    userId: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.validateFirebaseId(value)
    },
    title: { 
      type: "string", 
      default: "",
      validate: (value) => SecurityValidator.sanitizeString(value, { maxLength: 100 }) === value
    },
    startedAt: { 
      type: "timestamp", 
      default: () => new Date(),
      validate: SecurityValidator.validateTimestamp
    },
    endedAt: { 
      type: "timestamp", 
      default: null,
      validate: (value) => !value || SecurityValidator.validateTimestamp(value)
    },
    durationMinutes: { 
      type: "number", 
      default: 0,
      validate: (value) => Number.isInteger(value) && value >= 0
    },
    isActive: { 
      type: "boolean", 
      default: true,
      validate: (value) => typeof value === 'boolean'
    },
    messages: { 
      type: "array", 
      default: [],
      validate: (value) => SecurityValidator.validateArray(value, (message) => {
        // Basic message validation - expand as needed
        return typeof message === 'object' && 
               message !== null && 
               typeof message.content === 'string' &&
               typeof message.sender === 'string';
      })
    },
  }
};

const validateChatData = (data) => {
  return SecurityValidator.validateObject(data, ChatFields.FIELDS);
};

const sanitizeChatData = (data) => {
  const sanitizedData = {};
  
  Object.entries(ChatFields.FIELDS).forEach(([field, config]) => {
    if (!data.hasOwnProperty(field)) {
      if (typeof config.default === 'function') {
        sanitizedData[field] = config.default();
      } else if (config.default !== undefined) {
        sanitizedData[field] = config.default;
      }
      return;
    }

    // Apply type-specific sanitization
    switch (config.type) {
      case 'string':
        sanitizedData[field] = SecurityValidator.sanitizeString(data[field]);
        break;
      case 'number':
        sanitizedData[field] = Number(data[field]) || 0;
        break;
      case 'array':
        // Deep sanitize array items if they're objects with strings
        sanitizedData[field] = Array.isArray(data[field]) 
          ? data[field].map(item => {
              if (typeof item === 'object' && item !== null) {
                const sanitizedItem = {};
                for (const [key, val] of Object.entries(item)) {
                  sanitizedItem[key] = typeof val === 'string' 
                    ? SecurityValidator.sanitizeString(val) 
                    : val;
                }
                return sanitizedItem;
              }
              return typeof item === 'string' 
                ? SecurityValidator.sanitizeString(item) 
                : item;
            })
          : [];
        break;
      default:
        sanitizedData[field] = data[field];
    }
  });

  return sanitizedData;
};

const ChatModel = {
  /**
   * Create a new chat with security validation
   */
  create: async (db, userId) => {
    const sanitizedUserId = SecurityValidator.sanitizeString(userId);
    if (!SecurityValidator.validateFirebaseId(sanitizedUserId)) {
      throw new Error("Invalid user ID format");
    }

    // Uncomment and use when subscription logic is ready
    /*
    const sub = await SubscriptionModel.getByUserId(db, sanitizedUserId);
    if (!sub) throw new Error("Subscription not found");

    const plan = await PricingPlanModel.getById(db, sub.planId);
    if (!plan) throw new Error("Pricing plan not found");

    const userChats = await firestoreService.query(
      ChatFields.COLLECTION,
      [["userId", "==", sanitizedUserId]],
      db
    );

    const chats = userChats.docs;
    const activeChats = chats.filter((chat) => chat.isActive);
    const hasActive = activeChats.length > 0;
    const totalChats = chats.length;

    if (hasActive && plan.maxDurationMinutes !== Infinity) {
      throw new Error(
        "You already have an active chat. End it before starting a new one."
      );
    }

    if (totalChats >= plan.maxChats) {
      throw new Error(
        "You have reached the maximum number of chats for your plan."
      );
    }
    */

    const chatData = {
      userId: sanitizedUserId,
      startedAt: new Date(),
      isActive: true,
    };

    const validationErrors = validateChatData(chatData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const ref = await firestoreService.add(
      ChatFields.COLLECTION,
      chatData,
      db
    );
    
    const newChat = await firestoreService.get(
      ChatFields.COLLECTION,
      ref.id,
      db
    );
    
    return newChat;
  },

  /**
   * End an active chat and calculate duration
   */
  endChat: async (db, chatId) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    if (!SecurityValidator.validateFirebaseId(sanitizedChatId)) {
      throw new Error("Invalid chat ID format");
    }

    const chat = await firestoreService.get(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );
    
    if (!chat) throw new Error("Chat not found");

    const now = new Date();
    const startedAt = new Date(chat.startedAt);
    const durationMinutes = Math.round((now - startedAt) / 60000);

    const updateData = {
      endedAt: now,
      durationMinutes,
      isActive: false,
    };

    await firestoreService.update(
      ChatFields.COLLECTION,
      sanitizedChatId,
      updateData,
      db
    );

    return {
      id: sanitizedChatId,
      ...updateData
    };
  },

  /**
   * Get active chat for a user
   */
  getActiveChat: async (db, userId) => {
    const sanitizedUserId = SecurityValidator.sanitizeString(userId);
    if (!SecurityValidator.validateFirebaseId(sanitizedUserId)) {
      throw new Error("Invalid user ID format");
    }

    const result = await firestoreService.query(
      ChatFields.COLLECTION,
      [
        ["userId", "==", sanitizedUserId],
        ["isActive", "==", true],
      ],
      db
    );
    
    return result.empty ? null : result.docs[0];
  },

  /**
   * Get chat by ID
   */
  getById: async (db, chatId) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    if (!SecurityValidator.validateFirebaseId(sanitizedChatId)) {
      throw new Error("Invalid chat ID format");
    }

    const chat = await firestoreService.get(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );
    
    return chat;
  },

  /**
   * Update chat data with validation
   */
  updateChat: async (db, chatId, data) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    if (!SecurityValidator.validateFirebaseId(sanitizedChatId)) {
      throw new Error("Invalid chat ID format");
    }

    const chat = await firestoreService.get(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );
    
    if (!chat) throw new Error("Chat not found");

    const sanitizedData = sanitizeChatData(data);
    const validationErrors = validateChatData({
      ...chat,
      ...sanitizedData
    });
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    await firestoreService.update(
      ChatFields.COLLECTION,
      sanitizedChatId,
      sanitizedData,
      db
    );
    
    const updatedChat = await firestoreService.get(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );
    
    return updatedChat;
  },

  /**
   * Get all chats for a user
   */
  getAllChats: async (db, userId) => {
    const sanitizedUserId = SecurityValidator.sanitizeString(userId);
    if (!SecurityValidator.validateFirebaseId(sanitizedUserId)) {
      throw new Error("Invalid user ID format");
    }

    const chats = await firestoreService.query(
      ChatFields.COLLECTION,
      [["userId", "==", sanitizedUserId]],
      db
    );

    return chats.empty ? [] : chats.docs;
  },

  /**
   * Delete a chat
   */
  deleteChat: async (db, chatId) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    if (!SecurityValidator.validateFirebaseId(sanitizedChatId)) {
      throw new Error("Invalid chat ID format");
    }

    const chat = await firestoreService.get(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );
    
    if (!chat) throw new Error("Chat not found");

    await firestoreService.delete(
      ChatFields.COLLECTION,
      sanitizedChatId,
      db
    );

    return { id: sanitizedChatId, deleted: true };
  }
};

export { ChatFields };
export default ChatModel;