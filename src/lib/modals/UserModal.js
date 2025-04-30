import { firestoreService } from "@/lib/utils/firebaseUtils";
import bcrypt from 'bcryptjs';

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
    profilePicture: { type: "string", default: null },
    emailVerified: { type: "boolean", default: false },
    twoFactorEnabled: { type: "boolean", default: false },
    twoFactorSecret: { type: "string", private: true, default: null },
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
      errors.push(`${field} must be one of: ${config.enum.join(', ')}`);
    }
  });
  return errors;
};

/* ======================
   DATABASE OPERATIONS
====================== */
const UserModel = {
  // Create new user with all fields populated
  create: async (db, data) => {
    // Validate input data
    const validationErrors = validateUser(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    // Check unique fields
    await this.checkUniqueFields(db, data);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Apply default values for all fields that aren't provided
    const userData = Object.entries(UserFields.FIELDS).reduce((acc, [field, config]) => {
      // Skip password here - we'll handle it separately
      if (field === 'password') return acc;

      acc[field] = data[field] !== undefined ? data[field] : 
                  (config.default !== undefined ? 
                    (typeof config.default === 'function' ? config.default() : config.default) : 
                    null);
      return acc;
    }, {});

    // Add the hashed password
    userData.password = hashedPassword;

    return await firestoreService.add(UserFields.COLLECTION, userData, db);
  },

  // Check if unique fields already exist
  checkUniqueFields: async (db, data) => {
    const errors = [];
    
    for (const field of UNIQUE_FIELDS) {
      if (data[field]) {
        const querySnapshot = await db.collection(UserFields.COLLECTION)
          .where(field, '==', data[field])
          .limit(1)
          .get();
        
        if (!querySnapshot.empty) {
          errors.push(`${field} already exists`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  },

  // Get user by ID (without private fields)
  getById: async (db, userId) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    return this.sanitizeUser(user);
  },

  // Get user by email (for authentication)
  getByEmail: async (db, email) => {
    const querySnapshot = await db.collection(UserFields.COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (querySnapshot.empty) return null;
    
    const user = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
    
    return user; // Return with password for auth verification
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
    const restrictedUpdates = ['email', 'username'];
    const hasRestrictedUpdate = Object.keys(updates).some(field => 
      restrictedUpdates.includes(field)
    );
    
    if (hasRestrictedUpdate) {
      throw new Error('Cannot update email or username through this method');
    }

    const allowedUpdates = Object.keys(UserFields.FIELDS).filter(
      (field) => !UserFields.FIELDS[field].private
    );

    const validUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    return await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      validUpdates,
      db
    );
  },

  // Update email (with unique check)
  updateEmail: async (db, userId, newEmail) => {
    await this.checkUniqueFields(db, { email: newEmail });
    return await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { email: newEmail },
      db
    );
  },

  // Update username (with unique check)
  updateUsername: async (db, userId, newUsername) => {
    await this.checkUniqueFields(db, { username: newUsername });
    return await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { username: newUsername },
      db
    );
  },

  // Update password (with hashing)
  updatePassword: async (db, userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      { password: hashedPassword },
      db
    );
  },

  // Enable 2FA
  enable2FA: async (db, userId, secret) => {
    return await firestoreService.update(
      UserFields.COLLECTION,
      userId,
      {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
      db
    );
  },

  // Verify password
  verifyPassword: async (db, userId, password) => {
    const user = await firestoreService.get(UserFields.COLLECTION, userId, db);
    if (!user || !user.password) return false;
    return await bcrypt.compare(password, user.password);
  },
};

export default UserModel;