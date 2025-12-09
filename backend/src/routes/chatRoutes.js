import express from 'express';
import chatController from '../controllers/chatController.js';

/**
 * Chat Routes
 *
 * Defines all API endpoints related to the chat functionality.
 * These routes handle user messages and provide AI-powered responses
 * with database query capabilities.
 */

const router = express.Router();

/**
 * POST /api/chat
 *
 * Main chat endpoint for processing user messages.
 * Accepts natural language queries and returns AI-generated responses
 * with relevant database information.
 *
 * Request Body:
 * {
 *   "message": "Show me all electronics items under $100",
 *   "conversationHistory": [] // Optional: previous messages for context
 * }
 *
 * Response:
 * {
 *   "response": "AI generated response with database results",
 *   "queryUsed": "SQL query that was executed",
 *   "results": "Formatted database results"
 * }
 */
router.post('/', chatController.handleMessage);

/**
 * GET /api/chat/categories
 *
 * Returns all available product categories in the database.
 * Useful for providing users with valid category options.
 *
 * Response:
 * {
 *   "categories": ["Electronics", "Books", "Clothing", ...]
 * }
 */
router.get('/categories', chatController.getCategories);

/**
 * GET /api/chat/stats
 *
 * Provides database statistics and system information.
 * Useful for debugging and monitoring.
 *
 * Response:
 * {
 *   "totalItems": 1000,
 *   "categories": ["Electronics", "Books", ...],
 *   "systemStatus": "healthy"
 * }
 */
router.get('/stats', chatController.getStats);

export default router;
