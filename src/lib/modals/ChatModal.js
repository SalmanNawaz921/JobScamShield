import { firestoreService } from "../utils/firebaseUtils";
import PricingPlanModel from "./PricingPlanModal";
import SubscriptionModel from "./SubscriptionModal";

const ChatFields = {
  COLLECTION: "chats",
  FIELDS: {
    userId: { type: "string", required: true },
    title: { type: "string", default: "" },
    startedAt: { type: "timestamp", default: () => new Date() },
    endedAt: { type: "timestamp", default: null },
    durationMinutes: { type: "number", default: 0 }, // system-calculated
    isActive: { type: "boolean", default: true },
    messages: { type: "array", default: [] },
  },
};

const ChatModel = {
  create: async (db, userId) => {
    // Get current user's subscription & pricing plan
    // const sub = await SubscriptionModel.getByUserId(db, userId);
    // if (!sub) throw new Error("Subscription not found");

    // const plan = await PricingPlanModel.getById(db, sub.planId);
    // if (!plan) throw new Error("Pricing plan not found");

    // Check existing active or total chat count
    // const userChats = await firestoreService.query(
    //   ChatFields.COLLECTION,
    //   [["userId", "==", userId]],
    //   db
    // );

    // const chats = userChats.docs;
    // const activeChats = chats.filter((chat) => chat.isActive);
    // const hasActive = activeChats.length > 0;
    // const totalChats = chats.length;

    // if (hasActive && plan.maxDurationMinutes !== Infinity) {
    //   throw new Error(
    //     "You already have an active chat. End it before starting a new one."
    //   );
    // }

    // if (totalChats >= plan.maxChats) {
    //   throw new Error(
    //     "You have reached the maximum number of chats for your plan."
    //   );
    // }
    const ref = await firestoreService.add(
      ChatFields.COLLECTION,
      {
        userId,
        startedAt: new Date(),
        isActive: true,
      },
      db
    );
    const newChat = await firestoreService.get(
      ChatFields.COLLECTION,
      ref.id,
      db
    );
    return newChat;
  },

  endChat: async (db, chatId) => {
    const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
    if (!chat) throw new Error("Chat not found");

    const now = new Date();
    const startedAt = new Date(chat.startedAt);
    const durationMinutes = Math.round((now - startedAt) / 60000); // convert ms to minutes

    return await firestoreService.update(
      ChatFields.COLLECTION,
      chatId,
      {
        endedAt: now,
        durationMinutes,
        isActive: false,
      },
      db
    );
  },

  getActiveChat: async (db, userId) => {
    const result = await firestoreService.query(
      ChatFields.COLLECTION,
      [
        ["userId", "==", userId],
        ["isActive", "==", true],
      ],
      db
    );
    return result.empty ? null : result.docs[0];
  },

  getById: async (db, chatId) => {
    const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
    return chat;
  },

  ediChat: async (db, chatId, data) => {
    const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
    if (!chat) throw new Error("Chat not found");

    await firestoreService.update(ChatFields.COLLECTION, chatId, data, db);
    const updatedChat = await firestoreService.get(
      ChatFields.COLLECTION,
      chatId,
      db
    );
    return updatedChat;
  },

  getAllChats: async (db, userId) => {
    const chats = await firestoreService.query(
      ChatFields.COLLECTION,
      [["userId", "==", userId]],
      db
    );

    if (chats.empty) return [];
    return chats.docs;
  },

  deleteChat: async (db, chatId) => {
    const chat = await firestoreService.get(ChatFields.COLLECTION, chatId, db);
    if (!chat) throw new Error("Chat not found");

    return await firestoreService.delete(ChatFields.COLLECTION, chatId, db);
  },
};

export { ChatFields };
export default ChatModel;
