// lib/utils/securityValidator.js
class SecurityValidator {
  /**
   * Sanitizes a string input to prevent XSS and injection attacks
   * @param {string} input - The string to sanitize
   * @param {object} options - Optional configuration
   * @param {number} options.maxLength - Maximum allowed length
   * @returns {string} Sanitized string
   */
  static sanitizeString(input, options = {}) {
    if (typeof input !== "string") return input;

    // Remove script tags and HTML elements
    let sanitized = input
      .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "");

    // Escape special characters
    sanitized = sanitized.replace(/[\\"']/g, "\\$&").replace(/\0/g, "");

    // Trim and limit length
    sanitized = sanitized.trim();
    if (options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  /**
   * Validates if a value is one of the allowed enum values
   * @param {*} value - The value to validate
   * @param {Array} allowedValues - Array of allowed values
   * @returns {boolean} True if valid
   */
  static validateEnum(value, allowedValues) {
    return allowedValues.includes(value);
  }

  /**
   * Validates an array and its items
   * @param {Array} array - The array to validate
   * @param {Function} itemValidator - Function to validate each item
   * @returns {boolean} True if valid
   */
  static validateArray(array, itemValidator) {
    if (!Array.isArray(array)) return false;
    return array.every((item) => itemValidator(item));
  }

  /**
   * Validates a timestamp (Date object or ISO string)
   * @param {*} timestamp - The timestamp to validate
   * @returns {boolean} True if valid
   */
  static validateTimestamp(timestamp) {
    return (
      timestamp instanceof Date ||
      (typeof timestamp === "string" && !isNaN(Date.parse(timestamp)))
    );
  }

  /**
   * Validates an email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates a password (basic strength check)
   * @param {string} password - Password to validate
   * @param {object} options - Validation options
   * @param {number} options.minLength - Minimum length (default: 8)
   * @returns {boolean} True if valid
   */
  static validatePassword(password, options = {}) {
    const minLength = options.minLength || 8;
    if (typeof password !== "string" || password.length < minLength)
      return false;

    // Optional complexity checks
    if (options.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (options.requireLowercase && !/[a-z]/.test(password)) return false;
    if (options.requireNumber && !/\d/.test(password)) return false;
    if (options.requireSpecialChar && !/[@$!%*?&]/.test(password)) return false;

    return true;
  }

  /**
   * Validates a number against min/max bounds
   * @param {number} num - Number to validate
   * @param {object} options - Validation options
   * @param {number} options.min - Minimum value
   * @param {number} options.max - Maximum value
   * @returns {boolean} True if valid
   */
  static validateNumber(num, options = {}) {
    if (typeof num !== "number" || isNaN(num)) return false;
    if (options.min !== undefined && num < options.min) return false;
    if (options.max !== undefined && num > options.max) return false;
    return true;
  }

  /**
   * Validates an object against a schema
   * @param {object} obj - Object to validate
   * @param {object} schema - Validation schema
   * @returns {Array} Array of error messages (empty if valid)
   */
  static validateObject(obj, schema) {
    if (typeof obj !== "object" || obj === null)
      return ["Input must be an object"];

    const errors = [];

    Object.entries(schema).forEach(([field, config]) => {
      // Check required fields
      if (config.required && !obj.hasOwnProperty(field)) {
        errors.push(`${field} is required`);
        return;
      }

      // Skip validation if field is not required and not provided
      if (!config.required && !obj.hasOwnProperty(field)) {
        return;
      }

      // Type checking
      const value = obj[field];
      if (config.type === "array" && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        return;
      }
      if (
        config.type !== "array" &&
        typeof value !== config.type &&
        !(config.type === "timestamp" && this.validateTimestamp(value))
      ) {
        errors.push(`${field} must be of type ${config.type}`);
        return;
      }

      // Enum validation if provided
      if (config.enum && !this.validateEnum(value, config.enum)) {
        errors.push(`${field} must be one of: ${config.enum.join(", ")}`);
      }
    });
    return errors;
  }
  static validateFirebaseId(id) {
    if (typeof id !== "string") return false;
    // Firebase IDs must be non-empty and can't contain forward slashes
    return id.length > 0 && !id.includes("/") && !id.includes(".");
  }

  /**
   * Validates chat message content
   * @param {string} content - Message content
   * @returns {boolean} True if valid
   */
  static validateChatMessage(content) {
    if (typeof content !== "string") return false;
    const sanitized = this.sanitizeString(content, { maxLength: 2000 });
    return sanitized.length > 0 && sanitized === content;
  }
}

export default SecurityValidator;
