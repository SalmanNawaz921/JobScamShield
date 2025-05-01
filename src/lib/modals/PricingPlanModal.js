const PricingPlanFields = {
    COLLECTION: "pricingPlans",
    FIELDS: {
      name: { type: "string", required: true, unique: true },
      description: { type: "string", default: "" },
      maxChats: { type: "number", default: 5 },
      maxDurationMinutes: { type: "number", default: 60 }, // 1hr = 60 minutes
      price: { type: "number", default: 0 }, // Free = 0, Standard = X, Premium = Y
    },
  };
  
  const PricingPlanModel = {
    create: async (db, data) => {
      // Validation
      if (!data.name) throw new Error("Plan name is required");
      const existing = await firestoreService.query(
        PricingPlanFields.COLLECTION,
        [["name", "==", data.name]],
        db
      );
      if (!existing.empty) throw new Error("Plan name already exists");
  
      const plan = await firestoreService.add(PricingPlanFields.COLLECTION, data, db);
      return plan;
    },
  
    getById: async (db, planId) => {
      return await firestoreService.get(PricingPlanFields.COLLECTION, planId, db);
    },
  
    getAll: async (db) => {
      return await firestoreService.getAll(PricingPlanFields.COLLECTION, db);
    },
  };
  
  export { PricingPlanFields };
  export default PricingPlanModel;
  