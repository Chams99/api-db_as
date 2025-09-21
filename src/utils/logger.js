/**
 * Logger Utility
 *
 * Provides consistent logging functionality across the application.
 * Supports different log levels and structured logging.
 */

export class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };

  static currentLevel = process.env.LOG_LEVEL || 'INFO';

  /**
   * Log Message
   *
   * Core logging method with level checking and formatting.
   *
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  static log(level, message, meta = {}) {
    const levelValue = this.levels[level.toUpperCase()];
    const currentLevelValue = this.levels[this.currentLevel.toUpperCase()];

    if (levelValue > currentLevelValue) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    // Use appropriate console method based on level
    switch (level.toUpperCase()) {
      case 'ERROR':
        console.error(formattedMessage, meta);
        break;
      case 'WARN':
        console.warn(formattedMessage, meta);
        break;
      case 'DEBUG':
        console.debug(formattedMessage, meta);
        break;
      default:
        console.log(formattedMessage, meta);
    }
  }

  /**
   * Error Logging
   *
   * Logs error messages with stack traces and context.
   *
   * @param {string} message - Error message
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  static error(message, error = null, context = {}) {
    const meta = {
      ...context,
      ...(error && {
        error: error.message,
        stack: error.stack
      })
    };

    this.log('ERROR', message, meta);
  }

  /**
   * Warning Logging
   *
   * Logs warning messages for non-critical issues.
   *
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  static warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  /**
   * Info Logging
   *
   * Logs general information messages.
   *
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  static info(message, context = {}) {
    this.log('INFO', message, context);
  }

  /**
   * Debug Logging
   *
   * Logs detailed debug information.
   *
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  static debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }

  /**
   * Request Logging
   *
   * Logs HTTP request information.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static requestLogger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

      const context = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      };

      if (res.statusCode >= 400) {
        this.error(message, null, context);
      } else {
        this.info(message, context);
      }
    });

    next();
  }
}

export default Logger;
