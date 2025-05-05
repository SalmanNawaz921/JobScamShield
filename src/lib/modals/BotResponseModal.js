// // models/BotResponseModel.js
// import { firestoreService } from "@/lib/utils/firebaseUtils";

// const BotResponseFields = {
//   COLLECTION: "botResponses",
//   FIELDS: {
//     chatId: { type: "string", required: true },
//     sender: { type: "string", required: true, enum: ["bot"] },
//     content: { type: "string", required: true },
//     responseData: { type: "array", required: true },
//     responseTo: { type: "string", required: true }, // messageId of the user message
//     createdAt: { type: "timestamp", default: () => new Date() },
//   },
// };

// const validateBotResponse = (data) => {
//   const errors = [];

//   Object.entries(BotResponseFields.FIELDS).forEach(([field, config]) => {
//     if (config.required && !data[field]) {
//       errors.push(`${field} is required`);
//     }

//     if (config.enum && data[field] && !config.enum.includes(data[field])) {
//       errors.push(`${field} must be one of: ${config.enum.join(", ")}`);
//     }
//   });

//   return errors;
// };

// const BotResponseModel = {
//   create: async (db, data) => {
//     const validationErrors = validateBotResponse(data);
//     if (validationErrors.length > 0) {
//       throw new Error(validationErrors.join(", "));
//     }

//     const responseData = Object.entries(BotResponseFields.FIELDS).reduce(
//       (acc, [field, config]) => {
//         acc[field] =
//           data[field] !== undefined
//             ? data[field]
//             : typeof config.default === "function"
//             ? config.default()
//             : config.default;
//         return acc;
//       },
//       {}
//     );

//     return await firestoreService.add(
//       BotResponseFields.COLLECTION,
//       responseData,
//       db
//     );
//   },

//   getByChatId: async (db, chatId) => {
//     const queryConditions = [["chatId", "==", chatId]];
//     const orderBy = ["createdAt", "asc"];

//     const responses = await firestoreService.query(
//       BotResponseFields.COLLECTION,
//       queryConditions,
//       db,
//       orderBy
//     );

//     return responses.docs;
//   },
// };

// export default BotResponseModel;


// models/BotResponseModel.js
import { firestoreService } from "@/lib/utils/firebaseUtils";
import SecurityValidator from "@/lib/utils/SecurityValidator";

const BotResponseFields = {
  COLLECTION: "botResponses",
  FIELDS: {
    chatId: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.sanitizeString(value, { maxLength: 256 }).length > 0
    },
    sender: { 
      type: "string", 
      required: true, 
      enum: ["bot"],
      validate: (value) => SecurityValidator.validateEnum(value, ["bot"])
    },
    content: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.sanitizeString(value, { maxLength: 5000 }).length > 0
    },
    responseData: { 
      type: "array", 
      required: true,
      validate: (value) => SecurityValidator.validateArray(value, (item) => {
        return typeof item === 'object' && item !== null;
      })
    },
    responseTo: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.sanitizeString(value, { maxLength: 256 }).length > 0
    },
    createdAt: { 
      type: "timestamp", 
      default: () => new Date(),
      validate: SecurityValidator.validateTimestamp
    },
  },
};

const validateBotResponse = (data) => {
  return SecurityValidator.validateObject(data, BotResponseFields.FIELDS);
};

const sanitizeBotResponseData = (data) => {
  const sanitizedData = {};
  
  Object.entries(BotResponseFields.FIELDS).forEach(([field, config]) => {
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
      case 'array':
        case 'object':
          sanitizedData[field] = data[field]; // Deep sanitization would go here
          break;
      default:
        sanitizedData[field] = data[field];
    }
  });

  return sanitizedData;
};

const BotResponseModel = {
  create: async (db, data) => {
    const sanitizedData = sanitizeBotResponseData(data);
    const validationErrors = validateBotResponse(sanitizedData);
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const responseData = Object.entries(BotResponseFields.FIELDS).reduce(
      (acc, [field, config]) => {
        acc[field] = sanitizedData[field] !== undefined
          ? sanitizedData[field]
          : typeof config.default === 'function'
            ? config.default()
            : config.default;
        return acc;
      },
      {}
    );

    return await firestoreService.add(
      BotResponseFields.COLLECTION,
      responseData,
      db
    );
  },

  getByChatId: async (db, chatId) => {
    const sanitizedChatId = SecurityValidator.sanitizeString(chatId);
    const queryConditions = [["chatId", "==", sanitizedChatId]];
    const orderBy = ["createdAt", "asc"];

    const responses = await firestoreService.query(
      BotResponseFields.COLLECTION,
      queryConditions,
      db,
      orderBy
    );

    return responses.docs;
  },
};

export default BotResponseModel;