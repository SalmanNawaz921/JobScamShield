// import crypto from "crypto";
// import { firestoreService } from "@/lib/utils/firebaseUtils";

// /* ======================
//    FIELD DEFINITIONS
// ====================== */
// const EmailVerificationFields = {
//   COLLECTION: "emailVerifications",
//   FIELDS: {
//     userId: { type: "string", required: true },
//     email: { type: "string", required: true },
//     token: { type: "string", required: true },
//     expiresAt: { type: "timestamp", required: true },
//     used: { type: "boolean", default: false },
//   },
// };

// /* ======================
//    DATABASE OPERATIONS
// ====================== */
// const EmailVerificationModel = {
//   // Generate and store verification token
//   createToken: async (db, userId, email) => {
//     const token = crypto.randomBytes(32).toString("hex");
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     await firestoreService.set(
//       EmailVerificationFields.COLLECTION,
//       token,
//       { userId, email, expiresAt, used: false },
//       db
//     );

//     return token;
//   },

//   // Validate token
//   verifyToken: async (db, token) => {
//     const doc = await firestoreService.get(
//       EmailVerificationFields.COLLECTION,
//       token,
//       db
//     );
//     if (!doc) return false;

//     const data = doc
//     if (data.used || new Date(data.expiresAt) < new Date()) {
//       return false;
//     }

//     await firestoreService.update(
//       EmailVerificationFields.COLLECTION,
//       token,
//       { used: true },
//       db
//     );

//     return data;
//   },
// };

// export default EmailVerificationModel;

import crypto from "crypto";
import { firestoreService } from "@/lib/utils/firebaseUtils";
import SecurityValidator from "@/lib/utils/SecurityValidator";

/* ======================
   FIELD DEFINITIONS
====================== */
const EmailVerificationFields = {
  COLLECTION: "emailVerifications",
  FIELDS: {
    userId: { 
      type: "string", 
      required: true,
      validate: (value) => SecurityValidator.validateFirebaseId(value)
    },
    email: { 
      type: "string", 
      required: true,
      validate: SecurityValidator.validateEmail
    },
    token: { 
      type: "string", 
      required: true,
      validate: (value) => /^[a-f0-9]{64}$/.test(value) // Validate 32-byte hex token
    },
    expiresAt: { 
      type: "timestamp", 
      required: true,
      validate: SecurityValidator.validateTimestamp
    },
    used: { 
      type: "boolean", 
      default: false,
      validate: (value) => typeof value === 'boolean'
    },
  },
};

/* ======================
   SECURITY UTILITIES
====================== */
const TokenSecurity = {
  generateToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  validateTokenFormat: (token) => {
    return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
  },

  getExpirationDate: (hours = 24) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  }
};

/* ======================
   DATABASE OPERATIONS
====================== */
const EmailVerificationModel = {
  // Generate and store verification token with security checks
  createToken: async (db, userId, email) => {
    // Validate inputs
    const sanitizedUserId = SecurityValidator.sanitizeString(userId);
    const sanitizedEmail = SecurityValidator.sanitizeString(email);
    
    if (!SecurityValidator.validateFirebaseId(sanitizedUserId)) {
      throw new Error('Invalid user ID format');
    }
    
    if (!SecurityValidator.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Generate secure token
    const token = TokenSecurity.generateToken();
    const expiresAt = TokenSecurity.getExpirationDate();

    // Prepare document data
    const verificationData = {
      userId: sanitizedUserId,
      email: sanitizedEmail,
      token,
      expiresAt,
      used: false
    };

    // Validate before saving
    const validationErrors = SecurityValidator.validateObject(
      verificationData, 
      EmailVerificationFields.FIELDS
    );
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Store in Firestore with token as ID
    await firestoreService.set(
      EmailVerificationFields.COLLECTION,
      token,
      verificationData,
      db
    );

    return token;
  },

  // Validate token with comprehensive checks
  verifyToken: async (db, token) => {
    // Validate token format first
    if (!TokenSecurity.validateTokenFormat(token)) {
      throw new Error('Invalid token format');
    }

    // Get token document
    const doc = await firestoreService.get(
      EmailVerificationFields.COLLECTION,
      token,
      db
    );
    
    if (!doc) {
      throw new Error('Verification token not found');
    }

    // Validate document structure
    const validationErrors = SecurityValidator.validateObject(
      doc,
      EmailVerificationFields.FIELDS
    );
    
    if (validationErrors.length > 0) {
      await firestoreService.delete(
        EmailVerificationFields.COLLECTION,
        token,
        db
      );
      throw new Error('Invalid verification data');
    }

    // Check if token was already used
    if (doc.used) {
      throw new Error('Token has already been used');
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(doc.expiresAt);
    
    if (expiresAt < now) {
      await firestoreService.delete(
        EmailVerificationFields.COLLECTION,
        token,
        db
      );
      throw new Error('Token has expired');
    }

    // Mark token as used
    await firestoreService.update(
      EmailVerificationFields.COLLECTION,
      token,
      { used: true },
      db
    );

    // Return sanitized data
    return {
      userId: doc.userId,
      email: doc.email
    };
  },

  // Additional security method: Cleanup expired tokens
  cleanupExpiredTokens: async (db) => {
    const now = new Date();
    const expiredTokens = await firestoreService.query(
      EmailVerificationFields.COLLECTION,
      [
        ['used', '==', false],
        ['expiresAt', '<', now]
      ],
      db
    );

    const deletePromises = expiredTokens.docs.map(doc => 
      firestoreService.delete(
        EmailVerificationFields.COLLECTION,
        doc.id,
        db
      )
    );

    await Promise.all(deletePromises);
    return { deletedCount: expiredTokens.docs.length };
  }
};

export default EmailVerificationModel;