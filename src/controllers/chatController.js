import { generateResponse, parseQueryIntent } from '../services/geminiService.js';
import DatabaseService from '../services/databaseService.js';
import { testConnection } from '../config/supabaseClient.js';

/**
 * Chat Controller
 *
 * Handles HTTP requests for the chat functionality.
 * This controller acts as the main interface between the Express routes
 * and the business logic services.
 */

export class ChatController {
  /**
   * Handle Chat Message
   *
   * Processes incoming chat messages and generates appropriate responses.
   * This is the main endpoint for the chat functionality.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async handleMessage(req, res, next) {
    try {
      const { message, conversationHistory = [] } = req.body;

      // Validate input
      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Message is required and must be a string'
        });
      }

      if (message.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'Message cannot be empty'
        });
      }

      // Check database connection
      const isConnected = await testConnection();
      if (!isConnected) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Database connection is currently unavailable'
        });
      }

      console.log('💬 Processing message:', message);

      // Parse user intent from the message
      const queryIntent = parseQueryIntent(message);
      console.log('🎯 Parsed intent:', queryIntent);

      // Try to execute relevant database queries based on intent
      let databaseResults = null;
      let sqlQuery = null;

      // Check for general database queries first
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('how many') || lowerMessage.includes('count') || lowerMessage.includes('total')) {
        // Handle count queries
        if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
          // Get category statistics
          databaseResults = await DatabaseService.getAllCategoryStats();
          sqlQuery = 'SELECT category, COUNT(*) as count FROM items GROUP BY category';
        } else {
          // Get total count
          databaseResults = await DatabaseService.getItemsCount();
          sqlQuery = 'SELECT COUNT(*) as total FROM items';
        }
      } else if (lowerMessage.includes('show me all categories') || lowerMessage.includes('what categories') || lowerMessage.includes('list categories')) {
        // Handle category listing
        databaseResults = await DatabaseService.getAllCategoryStats();
        sqlQuery = 'SELECT category, COUNT(*) as count FROM items GROUP BY category';
      } else if (lowerMessage.includes('show me') && (lowerMessage.includes('under') || lowerMessage.includes('below'))) {
        // Handle price range queries
        const priceMatch = message.match(/\$?(\d+(?:\.\d{2})?)/);
        if (priceMatch) {
          const maxPrice = parseFloat(priceMatch[1]);
          databaseResults = await DatabaseService.getItemsByPriceRange(0, maxPrice, { limit: 20 });
          sqlQuery = `SELECT * FROM items WHERE price <= ${maxPrice} LIMIT 20`;
        }
      } else if (lowerMessage.includes('highly rated') || lowerMessage.includes('best rated') || lowerMessage.includes('top rated')) {
        // Handle rating queries
        databaseResults = await DatabaseService.getItemsByRating(4.0, { limit: 20 });
        sqlQuery = 'SELECT * FROM items WHERE rating >= 4.0 LIMIT 20';
      } else if (queryIntent.category) {
        // Handle category-based queries
        databaseResults = await DatabaseService.getItemsByCategory(
          queryIntent.category,
          { limit: queryIntent.limit }
        );
        sqlQuery = `SELECT * FROM items WHERE category = '${queryIntent.category}' LIMIT ${queryIntent.limit}`;
      } else if (queryIntent.priceMin !== null || queryIntent.priceMax !== null) {
        // Handle price-based queries
        const minPrice = queryIntent.priceMin || 0;
        const maxPrice = queryIntent.priceMax || 999999;

        databaseResults = await DatabaseService.getItemsByPriceRange(
          minPrice,
          maxPrice,
          { limit: queryIntent.limit }
        );
        sqlQuery = `SELECT * FROM items WHERE price BETWEEN ${minPrice} AND ${maxPrice} LIMIT ${queryIntent.limit}`;
      } else if (queryIntent.ratingMin !== null) {
        // Handle rating-based queries
        databaseResults = await DatabaseService.getItemsByRating(
          queryIntent.ratingMin,
          { limit: queryIntent.limit }
        );
        sqlQuery = `SELECT * FROM items WHERE rating >= ${queryIntent.ratingMin} LIMIT ${queryIntent.limit}`;
      }

      // Generate AI response with database context
      const aiResponse = await generateResponse(message, conversationHistory, databaseResults);

      // Prepare response
      const response = {
        response: aiResponse,
        queryUsed: sqlQuery,
        results: databaseResults ? {
          success: databaseResults.success,
          count: databaseResults.count,
          data: databaseResults.data,
          formattedMessage: DatabaseService.formatResults(
            databaseResults,
            lowerMessage.includes('how many') || lowerMessage.includes('count') || lowerMessage.includes('total') ? 'count' :
            queryIntent.category ? 'category' :
            queryIntent.priceMin !== null ? 'price_range' :
            queryIntent.ratingMin !== null ? 'rating' : 'query'
          )
        } : null,
        intent: queryIntent,
        timestamp: new Date().toISOString()
      };

      console.log('✅ Response generated successfully');
      res.json(response);

    } catch (error) {
      console.error('❌ Chat controller error:', error);
      next(error);
    }
  }

  /**
   * Get Available Categories
   *
   * Returns a list of all product categories available in the database.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCategories(req, res, next) {
    try {
      console.log('📂 Fetching available categories');

      const result = await DatabaseService.getAllCategories();

      if (!result.success) {
        throw new Error('Failed to fetch categories');
      }

      const categories = result.data.map(item => item.category).filter(Boolean);

      res.json({
        categories: categories,
        count: categories.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Get categories error:', error);
      next(error);
    }
  }

  /**
   * Get System Statistics
   *
   * Provides system and database statistics for monitoring.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getStats(req, res, next) {
    try {
      console.log('📊 Fetching system statistics');

      // Get total items count
      const totalCount = await DatabaseService.getItemsCount();
      const activeCount = await DatabaseService.getItemsCount({ isActive: true });

      // Get category statistics
      const categoriesResult = await DatabaseService.getAllCategories();

      // Get database connection status
      const dbConnectionStatus = await testConnection();

      const stats = {
        database: {
          totalItems: totalCount.success ? totalCount.data[0]?.total || 0 : 0,
          activeItems: activeCount.success ? activeCount.data[0]?.total || 0 : 0,
          categories: categoriesResult.success ? categoriesResult.data.map(c => c.category).filter(Boolean) : [],
          connectionStatus: dbConnectionStatus ? 'healthy' : 'unhealthy'
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || 'development'
        },
        timestamp: new Date().toISOString()
      };

      res.json(stats);

    } catch (error) {
      console.error('❌ Get stats error:', error);
      next(error);
    }
  }
}

// Export individual methods for use in routes
export const chatController = {
  handleMessage: ChatController.handleMessage.bind(ChatController),
  getCategories: ChatController.getCategories.bind(ChatController),
  getStats: ChatController.getStats.bind(ChatController)
};

export default ChatController;
