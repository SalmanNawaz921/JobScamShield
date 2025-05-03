// models/BotResponseModel.js
import { firestoreService } from "@/lib/utils/firebaseUtils";

const BotResponseFields = {
  COLLECTION: "botResponses",
  FIELDS: {
    chatId: { type: "string", required: true },
    sender: { type: "string", required: true, enum: ["bot"] },
    content: { type: "string", required: true },
    responseData: { type: "array", required: true },
    responseTo: { type: "string", required: true }, // messageId of the user message
    createdAt: { type: "timestamp", default: () => new Date() },
  },
};

const validateBotResponse = (data) => {
  const errors = [];

  Object.entries(BotResponseFields.FIELDS).forEach(([field, config]) => {
    if (config.required && !data[field]) {
      errors.push(`${field} is required`);
    }

    if (config.enum && data[field] && !config.enum.includes(data[field])) {
      errors.push(`${field} must be one of: ${config.enum.join(", ")}`);
    }
  });

  return errors;
};

const BotResponseModel = {
  create: async (db, data) => {
    const validationErrors = validateBotResponse(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    const responseData = Object.entries(BotResponseFields.FIELDS).reduce(
      (acc, [field, config]) => {
        acc[field] =
          data[field] !== undefined
            ? data[field]
            : typeof config.default === "function"
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
    const queryConditions = [["chatId", "==", chatId]];
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
