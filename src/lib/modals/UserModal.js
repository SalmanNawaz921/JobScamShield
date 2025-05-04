import { firestoreService } from "@/lib/utils/firebaseUtils";
import bcrypt from "bcryptjs";

/* ======================
   FIELD DEFINITIONS
====================== */
const UserFields = {
  COLLECTION: "users",
  FIELDS: {
    email: { type: "string", required: true, unique: true },
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true, private: true },
    accountStatus: {
      type: "string",
      default: "active",
      enum: ["active", "suspended", "banned"],
    },
    firstName: { type: "string", required: true },
    lastName: { type: "string", required: true },
    role: {
      type: "string",
      default: "user",
      enum: ["user", "admin", "superadmin"],
    },
    profilePicture: { type: "string", default: null },
    emailVerified: { type: "boolean", default: false },
    twoFactorEnabled: { type: "boolean", default: false },
    twoFactorSecret: { type: "string", private: true, default: null },
    resetPasswordToken: { type: "string", private: true, default: null },
    resetPasswordTokenExpiry: { type: "timestamp", default: null },
    createdAt: { type: "timestamp", default: () => new Date() },
  },
};

// Cache for unique field checks
const UNIQUE_FIELDS = Object.entries(UserFields.FIELDS)
  .filter(([_, config]) => config.unique)
  .map(([field]) => field);

/* ======================
   VALIDATION HELPERS
====================== */
const validateUser = (data) => {
  const errors = [];
  Object.entries(UserFields.FIELDS).forEach(([field, config]) => {
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
const UserModel = {
  // Create new user with all fields populated
  create: async (db, data, includePrivateFields = false) => {
    // Validate input data
    const validationErrors = validateUser(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    // Check unique fields
    await UserModel.checkUniqueFields(db, data);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Apply default values for all fields that aren't provided
    const userData = Object.entries(UserFields.FIELDS).reduce(
      (acc, [field, config]) => {
        // Skip password here - we'll handle it separately
        if (field === "password") return acc;

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

    // Add the hashed password
    userData.password = hashedPassword;

    const user = await firestoreService.add(
      UserFields.COLLECTION,
      userData,
      db
    );
    return includePrivateFields ? user : UserModel.sanitizeUser(user);
  },

  // Check if unique fields already exist
  checkUniqueFields: async (db, data) => {
    const errors = [];

    for (const field of UNIQUE_FIELDS) {
      if (data[field]) {
        const result = await firestoreService.query(
          UserFields.COLLECTION,
          [[field, "==", data[field]]],
          db
        );

        if (!result.empty) {
          errors.push(`${field} already exists`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  },

  // Get user by ID (without private fields)
  getById: async (db, userId) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    return UserModel.sanitizeUser(user);
  },

  // Get user by email (for authentication)
  getByEmail: async (db, email) => {
    const result = await firestoreService.query(
      UserFields.COLLECTION,
      [["email", "==", email]],
      db
    );

    if (result.empty) return null;

    const userData = result.docs[0];
    const user = {
      id: userData.id,
      ...userData,
    };

    return UserModel.sanitizeUser(user);
  },

  // Sanitize user object by removing private fields
  sanitizeUser: (user) => {
    if (!user) return null;

    const sanitized = { ...user };
    Object.entries(UserFields.FIELDS).forEach(([field, config]) => {
      if (config.private) {
        delete sanitized[field];
      }
    });
    return sanitized;
  },

  // Update specific fields
  update: async (db, userId, updates) => {
    // Don't allow updating unique fields through regular update
    const restrictedUpdates = ["email", "username"];
    const hasRestrictedUpdate = Object.keys(updates).some((field) =>
      restrictedUpdates.includes(field)
    );

    if (hasRestrictedUpdate) {
      throw new Error("Cannot update email or username through this method");
    }

    const allowedUpdates = Object.keys(UserFields.FIELDS).filter(
      (field) => !UserFields.FIELDS[field].private
    );

    const validUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      validUpdates,
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Update email (with unique check)
  updateEmail: async (db, userId, newEmail) => {
    await UserModel.checkUniqueFields(db, { email: newEmail });
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { email: newEmail },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Update username (with unique check)
  updateUsername: async (db, userId, newUsername) => {
    await UserModel.checkUniqueFields(db, { username: newUsername });
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { username: newUsername },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Update password (with hashing)
  updatePassword: async (db, userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { password: hashedPassword },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Enable 2FA
  enable2FA: async (db, userId, secret) => {
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  store2FASecret: async (db, userId, secret) => {
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        twoFactorSecret: secret.twoFactorSecret,
        twoFactorEnabled: secret.twoFactorEnabled,
      },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Verify password
  verifyPassword: async (db, userId, password) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    if (!user || !user.password) return false;
    return await bcrypt.compare(password, user.password);
  },

  // Delete user
  delete: async (db, userId) => {
    await firestoreService.delete(UserFields.COLLECTION, userId, db);
  },

  //get twoFactorSecret

  getTwoFactorSecret: async (db, userId) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    if (!user || !user.twoFactorSecret) return null;
    return user.twoFactorSecret;
  },

  // Set reset password token and expiry
  setResetPasswordToken: async (db, userId, token, expiry) => {
    const hashedToken = await bcrypt.hash(token, 10);

    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: expiry,
      },
      db
    );
    return UserModel.sanitizeUser(user);
  },

  // Verify reset password token

  verifyResetPasswordToken: async (db, userId, token) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    if (!user || !user.resetPasswordToken) return false;
    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    console.log("Token verification result 2:", isValid);
    if (!isValid) return false;

    // Check if token is expired
    const now = new Date();
    const expiryDate =
      user.resetPasswordTokenExpiry.toDate?.() || user.resetPasswordTokenExpiry;

    if (expiryDate < now) {
      return false;
    }
    return true;
  },

  // Clear reset password token and expiry

  clearResetPasswordToken: async (db, userId) => {
    const user = await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
      db
    );
    return UserModel.sanitizeUser(user);
  },
};

export default UserModel;
