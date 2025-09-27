import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Gemini AI Service
 *
 * This service provides integration with Google's Gemini AI for natural language processing.
 * It handles chat interactions and query interpretation for database operations.
 *
 * Key features:
 * - Context-aware responses based on database schema
 * - Query interpretation and SQL generation
 * - Error handling and retry logic
 * - Rate limiting awareness
 */

const geminiApiKey = process.env.GEMINI_API_KEY;

// Validate API key
if (!geminiApiKey) {
  throw new Error(
    'Missing Gemini API key. Please ensure GEMINI_API_KEY is set in your .env file.'
  );
}

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * System Prompt for Database Queries
 *
 * This comprehensive prompt instructs the AI on:
 * - Available database structure and capabilities
 * - How to interpret user queries
 * - SQL query generation guidelines
 * - Response formatting requirements
 */
const SYSTEM_PROMPT = `You are an AI assistant that helps users query a product database.

DATABASE SCHEMA:
- Table: items
- Columns: id, name, description, price, category, email, phone, created_date, is_active, quantity, rating

IMPORTANT: You will receive database results with your queries. Use these results to provide direct answers to users.

RESPONSE RULES:
- ALWAYS use the database results provided to answer questions directly
- For count questions: Use the exact numbers from the database results
- For category questions: List the categories and their counts from the results
- For item searches: Show the items found with their details
- Be conversational and helpful
- If no results are provided, ask the user to rephrase their question
- Never mention SQL queries or suggest that you need to execute queries

EXAMPLES:
- If user asks "How many items?" and database shows "100 total items" → Answer: "There are 100 items in the database."
- If user asks "What categories?" and database shows category breakdown → List all categories with their counts
- If user asks "Show me electronics" and database shows items → Show the electronics items found
- If database shows "No items found" → Answer: "No items match your criteria."

IMPORTANT: 
- Always use the exact numbers and data from the database results
- If database results show specific items, list them with their details
- If database results show "No items found", say there are no matching items
- Be conversational and helpful, but always base your answer on the provided data

Remember: Always use the actual database results provided to you.`;

/**
 * Generate AI Response
 *
 * Processes user messages and generates appropriate responses.
 * This function handles the conversation flow and query generation.
 *
 * @param {string} userMessage - The user's input message
 * @param {Array} conversationHistory - Previous messages for context
 * @param {Object} databaseResults - Database query results (optional)
 * @returns {Promise<string>} AI-generated response
 */
export const generateResponse = async (userMessage, conversationHistory = [], databaseResults = null) => {
  try {
    // Initialize model with system prompt
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent, factual responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    });

    // Prepare conversation context
    const history = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to help users query the product database safely and effectively.' }]
      }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      // Convert conversation history to the correct format
      const formattedHistory = conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      history.push(...formattedHistory);
    }

    // Add database results to the context if available
    let messageWithContext = userMessage;
    if (databaseResults && databaseResults.success && databaseResults.data) {
      // Format the database results in a more readable way
      let resultsText = '';
      
      if (databaseResults.data.length === 1 && databaseResults.data[0].total) {
        // Total count query
        resultsText = `Database Query Result: There are ${databaseResults.data[0].total} total items in the database.`;
      } else if (databaseResults.data.length > 1 && databaseResults.data[0].category && databaseResults.data[0].count !== undefined) {
        // Category breakdown (has both category and count fields)
        resultsText = `Database Query Result: Category breakdown:\n`;
        databaseResults.data.forEach(item => {
          resultsText += `- ${item.category}: ${item.count} items\n`;
        });
      } else if (databaseResults.data.length > 0) {
        // Regular item results
        resultsText = `Database Query Result: Found ${databaseResults.data.length} items matching your criteria:\n`;
        databaseResults.data.slice(0, 5).forEach((item, index) => {
          resultsText += `${index + 1}. ${item.name} - $${item.price} (${item.category}, Rating: ${item.rating})\n`;
        });
        if (databaseResults.data.length > 5) {
          resultsText += `... and ${databaseResults.data.length - 5} more items.\n`;
        }
      } else {
        // No results found
        resultsText = `Database Query Result: No items found matching your criteria.`;
      }
      
      messageWithContext = `${userMessage}\n\n${resultsText}`;
    }


    // Generate response
    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(messageWithContext);
    const response = result.response;

    return response.text();

  } catch (error) {
    console.error('Gemini AI service error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });

    // Provide fallback response for common errors
    if (error.message?.includes('API_KEY') || error.message?.includes('Invalid API key')) {
      throw new Error('Gemini API key is invalid or expired');
    }

    if (error.message?.includes('quota') || error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }

    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error(`Gemini model not found: ${error.message}`);
    }

    if (error.message?.includes('403') || error.message?.includes('PERMISSION_DENIED')) {
      throw new Error('Gemini API access denied. Check your API key permissions.');
    }

    // Log the actual error for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2));
    throw new Error(`AI service error: ${error.message}`);
  }
};

/**
 * Parse User Query to SQL
 *
 * Analyzes user messages and extracts potential SQL query parameters.
 * This function helps bridge natural language to database queries.
 *
 * @param {string} message - User's natural language query
 * @returns {Object} Parsed query parameters
 */
export const parseQueryIntent = (message) => {
  const query = {
    category: null,
    priceMin: null,
    priceMax: null,
    ratingMin: null,
    isActive: null,
    sortBy: null,
    limit: 20
  };

  const lowerMessage = message.toLowerCase();

  // Category detection
  const categories = ['electronics', 'books', 'clothing', 'toys', 'sports', 'home & garden', 'food & beverage', 'office supplies', 'health & beauty'];
  const detectedCategory = categories.find(cat => lowerMessage.includes(cat.toLowerCase()));
  if (detectedCategory) {
    query.category = detectedCategory;
  }

  // Price range detection
  const priceMatches = message.match(/\$?(\d+(?:\.\d{2})?)/g);
  if (priceMatches && priceMatches.length >= 2) {
    const prices = priceMatches.map(p => parseFloat(p.replace('$', ''))).sort((a, b) => a - b);
    query.priceMin = prices[0];
    query.priceMax = prices[prices.length - 1];
  } else if (priceMatches && priceMatches.length === 1) {
    const price = parseFloat(priceMatches[0].replace('$', ''));
    if (lowerMessage.includes('under') || lowerMessage.includes('less than') || lowerMessage.includes('below')) {
      query.priceMax = price;
    } else if (lowerMessage.includes('over') || lowerMessage.includes('more than') || lowerMessage.includes('above')) {
      query.priceMin = price;
    }
  }

  // Rating detection
  const ratingMatch = message.match(/(\d+(?:\.\d)?)\s*stars?/);
  if (ratingMatch) {
    query.ratingMin = parseFloat(ratingMatch[1]);
  }

  // Active/inactive detection
  if (lowerMessage.includes('active') || lowerMessage.includes('available')) {
    query.isActive = true;
  } else if (lowerMessage.includes('inactive') || lowerMessage.includes('unavailable')) {
    query.isActive = false;
  }

  // Sort detection
  if (lowerMessage.includes('cheapest') || lowerMessage.includes('lowest price')) {
    query.sortBy = 'price ASC';
  } else if (lowerMessage.includes('expensive') || lowerMessage.includes('highest price')) {
    query.sortBy = 'price DESC';
  } else if (lowerMessage.includes('highest rated') || lowerMessage.includes('best rated')) {
    query.sortBy = 'rating DESC';
  } else if (lowerMessage.includes('newest') || lowerMessage.includes('recent')) {
    query.sortBy = 'created_date DESC';
  } else if (lowerMessage.includes('oldest')) {
    query.sortBy = 'created_date ASC';
  }

  return query;
};

/**
 * Validate SQL Query Safety
 *
 * Ensures generated SQL queries only contain safe SELECT operations.
 * This is a critical security function to prevent SQL injection.
 *
 * @param {string} sql - SQL query to validate
 * @returns {boolean} True if query is safe
 */
export const isSafeQuery = (sql) => {
  try {
    const cleanSql = sql.replace(/\s+/g, ' ').trim();
    const upperSql = cleanSql.toUpperCase();

    // Only allow SELECT queries
    if (!upperSql.startsWith('SELECT')) {
      return false;
    }

    // Block dangerous keywords
    const dangerousKeywords = ['DELETE', 'INSERT', 'UPDATE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
    if (dangerousKeywords.some(keyword => upperSql.includes(keyword))) {
      return false;
    }

    // Ensure we're only querying the items table
    if (!upperSql.includes('FROM ITEMS') && !upperSql.includes('JOIN ITEMS')) {
      return false;
    }

    // Additional safety checks
    if (upperSql.includes('INTO') || upperSql.includes('VALUES')) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating SQL query:', error);
    return false;
  }
};

export default {
  generateResponse,
  parseQueryIntent,
  isSafeQuery
};
