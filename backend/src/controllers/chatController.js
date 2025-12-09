import { generateResponse, generateSQLQuery } from '../services/geminiService.js';
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

      // STEP 1: Get database schema dynamically
      // Fetch schemas for ALL discovered tables
      const schemas = await DatabaseService.getAllTablesSchema();
      console.log(`📋 Found ${schemas.length} tables:`, schemas.map(s => s.table).join(', '));

      // STEP 2: Use AI to generate SQL query from natural language with schema context
      const sqlQuery = await generateSQLQuery(message, schemas);
      console.log('📝 Generated SQL:', sqlQuery);

      // STEP 2: Execute the AI-generated SQL query
      const databaseResults = await DatabaseService.executeDynamicQuery(sqlQuery);
      console.log('📊 Query results:', {
        success: databaseResults.success,
        count: databaseResults.count,
        hasData: databaseResults.data && databaseResults.data.length > 0
      });

      // STEP 3: Prepare context for AI to interpret results
      let contextMessage = `User question: "${message}"\n\nSQL Query executed:\n${sqlQuery}\n\nQuery Results:\n`;

      if (!databaseResults.success) {
        contextMessage += `Error: ${databaseResults.error}\n\nPlease explain that there was an error executing the query and suggest the user rephrase their question.`;
      } else if (databaseResults.data && databaseResults.data.length > 0) {
        // Check if it's a count/aggregate query
        if (databaseResults.data[0].total !== undefined) {
          contextMessage += `Total count: ${databaseResults.data[0].total}\n`;
        } else if (databaseResults.data[0].avg_price !== undefined) {
          // Aggregate results
          contextMessage += `Aggregate results (${databaseResults.count} rows):\n`;
          const sampleSize = Math.min(10, databaseResults.data.length);
          for (let i = 0; i < sampleSize; i++) {
            const row = databaseResults.data[i];
            contextMessage += `- ${JSON.stringify(row)}\n`;
          }
        } else {
          // Regular query results
          contextMessage += `Found ${databaseResults.count} items:\n`;
          const sampleSize = Math.min(5, databaseResults.data.length);
          for (let i = 0; i < sampleSize; i++) {
            const item = databaseResults.data[i];
            contextMessage += `- ${item.name || 'Item'} (${item.category || 'N/A'}) - $${item.price || 'N/A'}, Rating: ${item.rating || 'N/A'}\n`;
          }
          if (databaseResults.count > sampleSize) {
            contextMessage += `... and ${databaseResults.count - sampleSize} more items.\n`;
          }
        }
      } else {
        contextMessage += `No items found matching the criteria.\n`;
      }

      contextMessage += `\nPlease provide a natural, helpful answer based on these results. Be conversational and concise.`;

      // STEP 4: Generate AI response with database context
      const aiResponse = await generateResponse(contextMessage, conversationHistory);

      // Prepare final response
      const response = {
        response: aiResponse,
        queryUsed: sqlQuery,
        results: databaseResults.success ? {
          success: true,
          count: databaseResults.count,
          data: databaseResults.data,
          formattedMessage: databaseResults.count > 0
            ? `Found ${databaseResults.count} result(s)`
            : 'No results found'
        } : {
          success: false,
          error: databaseResults.error
        },
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
