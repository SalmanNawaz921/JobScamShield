// import { firestoreService } from "@/lib/utils/firebaseUtils";
// import bcrypt from "bcryptjs";

// /* ======================
//    FIELD DEFINITIONS
// ====================== */
// const UserFields = {
//   COLLECTION: "users",
//   FIELDS: {
//     email: { type: "string", required: true, unique: true },
//     username: { type: "string", required: true, unique: true },
//     password: { type: "string", required: true, private: true },
//     accountStatus: {
//       type: "string",
//       default: "active",
//       enum: ["active", "suspended", "banned"],
//     },
//     firstName: { type: "string", required: true },
//     lastName: { type: "string", required: true },
//     role: {
//       type: "string",
//       default: "user",
//       enum: ["user", "admin", "superadmin"],
//     },
//     profilePicture: { type: "string", default: null },
//     emailVerified: { type: "boolean", default: false },
//     twoFactorEnabled: { type: "boolean", default: false },
//     twoFactorSecret: { type: "string", private: true, default: null },
//     resetPasswordToken: { type: "string", private: true, default: null },
//     resetPasswordTokenExpiry: { type: "timestamp", default: null },
//     loginAttempts: { type: "number", default: 0 },
//     lockUntil: { type: "timestamp", default: null },
//     lastLogin: { type: "timestamp", default: null },
//     createdAt: { type: "timestamp", default: () => new Date() },
//   },
// };

// // Cache for unique field checks
// const UNIQUE_FIELDS = Object.entries(UserFields.FIELDS)
//   .filter(([_, config]) => config.unique)
//   .map(([field]) => field);

// /* ======================
//    VALIDATION HELPERS
// ====================== */
// const validateUser = (data) => {
//   const errors = [];
//   Object.entries(UserFields.FIELDS).forEach(([field, config]) => {
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
// const UserModel = {
//   // Create new user with all fields populated
//   create: async (db, data, includePrivateFields = false) => {
//     // Validate input data
//     const validationErrors = validateUser(data);
//     if (validationErrors.length > 0) {
//       throw new Error(validationErrors.join(", "));
//     }

//     // Check unique fields
//     await UserModel.checkUniqueFields(db, data);

//     // Hash password
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // Apply default values for all fields that aren't provided
//     const userData = Object.entries(UserFields.FIELDS).reduce(
//       (acc, [field, config]) => {
//         // Skip password here - we'll handle it separately
//         if (field === "password") return acc;

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

//     // Add the hashed password
//     userData.password = hashedPassword;

//     const user = await firestoreService.add(
//       UserFields.COLLECTION,
//       userData,
//       db
//     );
//     return includePrivateFields ? user : UserModel.sanitizeUser(user);
//   },

//   // Check if unique fields already exist
//   checkUniqueFields: async (db, data) => {
//     const errors = [];

//     for (const field of UNIQUE_FIELDS) {
//       if (data[field]) {
//         const result = await firestoreService.query(
//           UserFields.COLLECTION,
//           [[field, "==", data[field]]],
//           db
//         );

//         if (!result.empty) {
//           errors.push(`${field} already exists`);
//         }
//       }
//     }

//     if (errors.length > 0) {
//       throw new Error(errors.join(", "));
//     }
//   },

//   // Get user by ID (without private fields)
//   getById: async (db, userId) => {
//     const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
//     return UserModel.sanitizeUser(user);
//   },

//   // Get user by email (for authentication)
//   getByEmail: async (db, email) => {
//     const result = await firestoreService.query(
//       UserFields.COLLECTION,
//       [["email", "==", email]],
//       db
//     );

//     if (result.empty) return null;

//     const userData = result.docs[0];
//     const user = {
//       id: userData.id,
//       ...userData,
//     };

//     return UserModel.sanitizeUser(user);
//   },

//   // Sanitize user object by removing private fields
//   sanitizeUser: (user) => {
//     if (!user) return null;

//     const sanitized = { ...user };
//     Object.entries(UserFields.FIELDS).forEach(([field, config]) => {
//       if (config.private) {
//         delete sanitized[field];
//       }
//     });
//     return sanitized;
//   },

//   // Update specific fields
//   update: async (db, userId, updates) => {
//     // Don't allow updating unique fields through regular update
//     const restrictedUpdates = ["email", "username"];
//     const hasRestrictedUpdate = Object.keys(updates).some((field) =>
//       restrictedUpdates.includes(field)
//     );

//     if (hasRestrictedUpdate) {
//       throw new Error("Cannot update email or username through this method");
//     }

//     const allowedUpdates = Object.keys(UserFields.FIELDS).filter(
//       (field) => !UserFields.FIELDS[field].private
//     );

//     const validUpdates = Object.keys(updates)
//       .filter((key) => allowedUpdates.includes(key))
//       .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       validUpdates,
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Update email (with unique check)
//   updateEmail: async (db, userId, newEmail) => {
//     await UserModel.checkUniqueFields(db, { email: newEmail });
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       { email: newEmail },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Update username (with unique check)
//   updateUsername: async (db, userId, newUsername) => {
//     await UserModel.checkUniqueFields(db, { username: newUsername });
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       { username: newUsername },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Update password (with hashing)
//   updatePassword: async (db, userId, newPassword) => {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       { password: hashedPassword },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Enable 2FA
//   enable2FA: async (db, userId, secret) => {
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       {
//         twoFactorEnabled: true,
//         twoFactorSecret: secret,
//       },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   store2FASecret: async (db, userId, secret) => {
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       {
//         twoFactorSecret: secret.twoFactorSecret,
//         twoFactorEnabled: secret.twoFactorEnabled,
//       },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Verify password
//   verifyPassword: async (db, userId, password) => {
//     const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
//     if (!user || !user.password) return false;
//     return await bcrypt.compare(password, user.password);
//   },

//   // Delete user
//   delete: async (db, userId) => {
//     await firestoreService.delete(UserFields.COLLECTION, userId, db);
//   },

//   //get twoFactorSecret

//   getTwoFactorSecret: async (db, userId) => {
//     const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
//     if (!user || !user.twoFactorSecret) return null;
//     return user.twoFactorSecret;
//   },

//   // Set reset password token and expiry
//   setResetPasswordToken: async (db, userId, token, expiry) => {
//     const hashedToken = await bcrypt.hash(token, 10);

//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       {
//         resetPasswordToken: hashedToken,
//         resetPasswordTokenExpiry: expiry,
//       },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Verify reset password token

//   verifyResetPasswordToken: async (db, userId, token) => {
//     const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
//     if (!user || !user.resetPasswordToken) return false;
//     const isValid = await bcrypt.compare(token, user.resetPasswordToken);
//     if (!isValid) return false;
//     // Check if token is expired
//     const now = new Date();
//     const expiryDate =
//       user.resetPasswordTokenExpiry.toDate?.() || user.resetPasswordTokenExpiry;

//     if (expiryDate < now) {
//       return false;
//     }
//     return true;
//   },

//   // Clear reset password token and expiry

//   clearResetPasswordToken: async (db, userId) => {
//     const user = await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       {
//         resetPasswordToken: null,
//         resetPasswordTokenExpiry: null,
//       },
//       db
//     );
//     return UserModel.sanitizeUser(user);
//   },

//   // Get all users (with optional filtering and pagination)
//   getAll: async (db, filters = {}, pagination = {}) => {
//     const { limit = 10, offset = 0 } = pagination;
//     const users = await firestoreService.query(
//       UserFields.COLLECTION,
//       null,
//       db,
//       limit,
//       offset
//     );
//     return users.docs.map((doc) => UserModel.sanitizeUser(doc));
//   },

//   // Check if account is currently locked
//   isLocked: (user) => {
//     if (!user.lockUntil) return false;
//     const lockUntilDate =
//       typeof user.lockUntil.toDate === "function"
//         ? user.lockUntil.toDate()
//         : new Date(user.lockUntil);
//     return lockUntilDate > new Date();
//   },

//   // Increment login attempts and possibly lock
//   incrementLoginAttempts: async (db, userId, user) => {
//     const attempts = (user.loginAttempts || 0) + 1;
//     const updates = { loginAttempts: attempts };

//     if (attempts >= 3) {
//       const lockTime = new Date(Date.now() + 15 * 60 * 1000); // 30 mins lock
//       updates.lockUntil = lockTime;
//     }

//     await firestoreService.update(UserFields.COLLECTION, userId, updates, db);
//   },

//   // Reset login attempts
//   resetLoginAttempts: async (db, userId) => {
//     await firestoreService.update(
//       UserFields.COLLECTION,
//       userId,
//       { loginAttempts: 0, lockUntil: null },
//       db
//     );
//   },
// };

// export default UserModel;

import { firestoreService } from "@/lib/utils/firebaseUtils";
import SecurityValidator from "@/lib/utils/SecurityValidator";
import bcrypt from "bcryptjs";

const UserFields = {
  COLLECTION: "users",
  FIELDS: {
    email: {
      type: "string",
      required: true,
      unique: true,
      validate: SecurityValidator.validateEmail,
    },
    username: {
      type: "string",
      required: true,
      unique: true,
      validate: (val) => /^[a-zA-Z0-9_]{3,30}$/.test(val),
    },
    password: {
      type: "string",
      required: true,
      private: true,
      validate: (val) => val.length >= 8,
    },
    accountStatus: {
      type: "string",
      default: "active",
      enum: ["active", "suspended", "banned"],
      validate: (val) => ["active", "suspended", "banned"].includes(val),
    },
    firstName: {
      type: "string",
      required: true,
      validate: (val) =>
        SecurityValidator.sanitizeString(val, { maxLength: 50 }) === val,
    },
    lastName: {
      type: "string",
      required: true,
      validate: (val) =>
        SecurityValidator.sanitizeString(val, { maxLength: 50 }) === val,
    },
    role: {
      type: "string",
      default: "user",
      enum: ["user", "admin", "superadmin"],
      validate: (val) => ["user", "admin", "superadmin"].includes(val),
    },
    profilePicture: {
      type: "string",
      default: null,
      validate: (val) => !val || SecurityValidator.validateURL(val),
    },
    emailVerified: {
      type: "boolean",
      default: false,
      validate: (val) => typeof val === "boolean",
    },
    twoFactorEnabled: {
      type: "boolean",
      default: false,
      validate: (val) => typeof val === "boolean",
    },
    twoFactorSecret: {
      type: "string",
      private: true,
      default: null,
      validate: (val) => !val || val.length === 32,
    },
    resetPasswordToken: {
      type: "string",
      private: true,
      default: null,
      validate: (val) => !val || val.length > 32,
    },
    resetPasswordTokenExpiry: {
      type: "timestamp",
      default: null,
      validate: (val) => !val || SecurityValidator.validateTimestamp(val),
    },
    loginAttempts: {
      type: "number",
      default: 0,
      validate: (val) => Number.isInteger(val) && val >= 0,
    },
    lockUntil: {
      type: "timestamp",
      default: null,
      validate: (val) => !val || SecurityValidator.validateTimestamp(val),
    },
    lastLogin: {
      type: "timestamp",
      default: null,
      validate: (val) => !val || SecurityValidator.validateTimestamp(val),
    },
    createdAt: {
      type: "timestamp",
      default: () => new Date(),
      validate: SecurityValidator.validateTimestamp,
    },
  },
};

// const validateUserData = (data) => {
//   return SecurityValidator.validateObject(data, UserFields.FIELDS);
// };

const sanitizeUserData = (data) => {
  const sanitized = {};

  Object.keys(UserFields.FIELDS).forEach((field) => {
    if (data[field] !== undefined) {
      switch (UserFields.FIELDS[field].type) {
        case "string":
          sanitized[field] = SecurityValidator.sanitizeString(data[field]);
          break;
        case "number":
          sanitized[field] = Number(data[field]) || 0;
          break;
        case "boolean":
          sanitized[field] = Boolean(data[field]);
          break;
        default:
          sanitized[field] = data[field];
      }
    } else if (UserFields.FIELDS[field].default !== undefined) {
      sanitized[field] =
        typeof UserFields.FIELDS[field].default === "function"
          ? UserFields.FIELDS[field].default()
          : UserFields.FIELDS[field].default;
    }
  });

  return sanitized;
};

const UserModel = {
  /**
   * Create a new user with secure defaults
   */
  create: async (db, data) => {
    const sanitizedData = sanitizeUserData(data);
    // const validationErrors = validateUserData(sanitizedData);

    // if (validationErrors.length > 0) {
    //   throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    // }

    // Check unique fields
    await UserModel.checkUniqueFields(db, {
      email: sanitizedData.email,
      username: sanitizedData.username,
    });

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 12);
    sanitizedData.password = hashedPassword;

    const userRef = await firestoreService.add(
      UserFields.COLLECTION,
      sanitizedData,
      db
    );

    return UserModel.sanitizeUser({
      id: userRef.id,
      ...sanitizedData,
    });
  },

  /**
   * Check if unique fields already exist
   */
  checkUniqueFields: async (db, data) => {
    const errors = [];

    if (data.email) {
      const emailExists = await firestoreService.query(
        UserFields.COLLECTION,
        [["email", "==", data.email]],
        db
      );
      if (!emailExists.empty) errors.push("Email already exists");
    }

    if (data.username) {
      const usernameExists = await firestoreService.query(
        UserFields.COLLECTION,
        [["username", "==", data.username]],
        db
      );
      if (!usernameExists.empty) errors.push("Username already exists");
    }

    if (errors.length > 0) throw new Error(errors.join(", "));
  },

  /**
   * Get user by ID without private fields
   */
  getById: async (db, userId) => {
    const sanitizedId = SecurityValidator.sanitizeString(userId);
    if (!SecurityValidator.validateFirebaseId(sanitizedId)) {
      throw new Error("Invalid user ID format");
    }

    const user = await firestoreService.get(
      UserFields.COLLECTION,
      sanitizedId,
      db
    );

    return UserModel.sanitizeUser(user);
  },

  /**
   * Get user by email (for authentication)
   */
  getByEmail: async (db, email) => {
    const sanitizedEmail =
      SecurityValidator.sanitizeString(email).toLowerCase();
    if (!SecurityValidator.validateEmail(sanitizedEmail)) {
      throw new Error("Invalid email format");
    }

    const result = await firestoreService.query(
      UserFields.COLLECTION,
      [["email", "==", sanitizedEmail]],
      db
    );

    if (result.empty) return null;
    const userData = result.docs[0];

    return {
      id: userData.id,
      ...UserModel.sanitizeUser(userData),
    };
  },

  /**
   * Remove private fields from user object
   */
  sanitizeUser: (user) => {
    if (!user) return null;

    const sanitized = { ...user };
    Object.keys(UserFields.FIELDS).forEach((field) => {
      if (UserFields.FIELDS[field].private) {
        delete sanitized[field];
      }
    });
    return sanitized;
  },

  /**
   * Update user profile fields (excluding protected fields)
   */
  updateProfile: async (db, userId, updates) => {
    const protectedFields = ["email", "username", "password", "role"];
    const hasProtectedField = Object.keys(updates).some((f) =>
      protectedFields.includes(f)
    );

    if (hasProtectedField) {
      throw new Error("Cannot update protected fields through this method");
    }

    const sanitizedUpdates = sanitizeUserData(updates);
    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      sanitizedUpdates,
      db
    );

    return UserModel.getById(db, userId);
  },

  /**
   * Update email with validation and uniqueness check
   */
  updateEmail: async (db, userId, newEmail) => {
    const sanitizedEmail =
      SecurityValidator.sanitizeString(newEmail).toLowerCase();
    if (!SecurityValidator.validateEmail(sanitizedEmail)) {
      throw new Error("Invalid email format");
    }

    await UserModel.checkUniqueFields(db, { email: sanitizedEmail });

    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { email: sanitizedEmail, emailVerified: false },
      db
    );

    return UserModel.getById(db, userId);
  },

  /**
   * Update username with validation and uniqueness check
   */
  updateUsername: async (db, userId, newUsername) => {
    const sanitizedUsername = SecurityValidator.sanitizeString(newUsername);
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(sanitizedUsername)) {
      throw new Error(
        "Username must be 3-30 characters (letters, numbers, underscores)"
      );
    }

    await UserModel.checkUniqueFields(db, { username: sanitizedUsername });

    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { username: sanitizedUsername },
      db
    );

    return UserModel.getById(db, userId);
  },

  /**
   * Update password with secure hashing
   */
  updatePassword: async (db, userId, newPassword) => {
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
      db
    );

    return true;
  },

  /**
   * Verify user password
   */
  verifyPassword: async (db, userId, password) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);

    if (!user || !user.password) return false;
    return await bcrypt.compare(password, user.password);
  },

  /**
   * Enable 2FA for user
   */
  enable2FA: async (db, userId, secret) => {
    if (!secret) {
      throw new Error("Invalid 2FA secret");
    }

    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
      db
    );

    return true;
  },

  /**
   * Get 2FA secret (for verification)
   */
  getTwoFactorSecret: async (db, userId) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);

    return user?.twoFactorSecret || null;
  },

  /**
   * Set password reset token
   */
  setResetPasswordToken: async (db, userId, token, expiry) => {
    const hashedToken = await bcrypt.hash(token, 10);

    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: expiry,
      },
      db
    );

    return true;
  },

  /**
   * Verify password reset token
   */
  verifyResetPasswordToken: async (db, userId, token) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);

    if (!user?.resetPasswordToken) return false;

    const isValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValid) return false;

    const now = new Date();
    const expiry =
      user.resetPasswordTokenExpiry?.toDate?.() ||
      user.resetPasswordTokenExpiry;

    return expiry > now;
  },

  /**
   * Clear password reset token
   */
  clearResetPasswordToken: async (db, userId) => {
    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
      db
    );

    return true;
  },

  /**
   * Check if account is locked
   */
  isLocked: (user) => {
    if (!user?.lockUntil) return false;
    const lockUntil = user.lockUntil?.toDate?.() || user.lockUntil;
    return lockUntil > new Date();
  },

  /**
   * Increment failed login attempts
   */
  incrementLoginAttempts: async (db, userId) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);

    const attempts = (user?.loginAttempts || 0) + 1;
    const updates = { loginAttempts: attempts };

    if (attempts >= 5) {
      updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minute lock
    }

    await firestoreService.update(UserFields.COLLECTION, userId, updates, db);

    return attempts;
  },

  /**
   * Reset login attempts after successful login
   */
  resetLoginAttempts: async (db, userId) => {
    await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
      },
      db
    );

    return true;
  },

  //   // Get all users (with optional filtering and pagination)
  getAll: async (db, filters = {}, pagination = {}) => {
    const { limit = 10, offset = 0 } = pagination;
    const users = await firestoreService.query(
      UserFields.COLLECTION,
      null,
      db,
      limit,
      offset
    );
    return users.docs.map((doc) => UserModel.sanitizeUser(doc));
  },

  //   // Delete user
  delete: async (db, userId) => {
    await firestoreService.delete(UserFields.COLLECTION, userId, db);
  },
};

export default UserModel;
