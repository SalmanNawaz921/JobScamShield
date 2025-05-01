const SubscriptionFields = {
    COLLECTION: "subscriptions",
    FIELDS: {
      userId: { type: "string", required: true, unique: true },
      planId: { type: "string", required: true }, // linked to PricingPlan
      subscribedAt: { type: "timestamp", default: () => new Date() },
    },
  };
  
  const SubscriptionModel = {
    createOrUpdate: async (db, userId, planId) => {
      const existing = await firestoreService.query(
        SubscriptionFields.COLLECTION,
        [["userId", "==", userId]],
        db
      );
  
      if (!existing.empty) {
        const subId = existing.docs[0].id;
        return await firestoreService.update(
          SubscriptionFields.COLLECTION,
          subId,
          { planId },
          db
        );
      }
  
      return await firestoreService.add(SubscriptionFields.COLLECTION, { userId, planId }, db);
    },
  
    getByUserId: async (db, userId) => {
      const result = await firestoreService.query(
        SubscriptionFields.COLLECTION,
        [["userId", "==", userId]],
        db
      );
      return result.empty ? null : result.docs[0];
    },
  };
  
  export { SubscriptionFields };
  export default SubscriptionModel;
  