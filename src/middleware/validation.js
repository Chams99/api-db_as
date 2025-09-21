/**
 * Validation Middleware
 *
 * Provides request validation functions for the API endpoints.
 * Ensures incoming data meets expected formats and constraints.
 */

/**
 * Validate Chat Message
 *
 * Validates the structure and content of chat messages.
 * Ensures messages are properly formatted before processing.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateChatMessage = (req, res, next) => {
  const { message, conversationHistory } = req.body;

  const errors = [];

  // Validate message
  if (!message) {
    errors.push('Message is required');
  } else if (typeof message !== 'string') {
    errors.push('Message must be a string');
  } else if (message.trim().length === 0) {
    errors.push('Message cannot be empty');
  } else if (message.length > 2000) {
    errors.push('Message cannot exceed 2000 characters');
  }

  // Validate conversation history (optional)
  if (conversationHistory !== undefined) {
    if (!Array.isArray(conversationHistory)) {
      errors.push('Conversation history must be an array');
    } else if (conversationHistory.length > 50) {
      errors.push('Conversation history cannot exceed 50 messages');
    } else {
      // Validate each message in history
      conversationHistory.forEach((msg, index) => {
        if (!msg.role || !msg.content) {
          errors.push(`Message ${index + 1} in conversation history must have 'role' and 'content' fields`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid request data',
      details: errors
    });
  }

  next();
};

/**
 * Sanitize Input
 *
 * Basic input sanitization to prevent common issues.
 * Removes potentially harmful characters and normalizes input.
 *
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 2000); // Limit length
};

/**
 * Rate Limit Headers
 *
 * Adds rate limiting information to response headers.
 * Helps clients understand current rate limiting status.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const addRateLimitHeaders = (req, res, next) => {
  // This would typically integrate with your rate limiting middleware
  // For now, we'll add basic headers
  res.set({
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': '99',
    'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString()
  });

  next();
};

export default {
  validateChatMessage,
  sanitizeInput,
  addRateLimitHeaders
};
