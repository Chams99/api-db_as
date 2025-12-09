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

const SQL_GENERATION_PROMPT = `You are a SQL query generator. Convert natural language questions into safe PostgreSQL queries.

CRITICAL RULES:
1. ONLY generate SELECT queries
2. NEVER use DELETE, INSERT, UPDATE, DROP, ALTER, CREATE, TRUNCATE, or EXEC
3. Always use proper PostgreSQL syntax
4. Use LIMIT to prevent large result sets (max 100 rows)
5. Return ONLY valid SQL, no explanations

{{DATABASE_SCHEMA}}

from db select tables

Now generate SQL for the user's question. Return ONLY the SQL query, nothing else.`;

// Simple in-memory cache for query results
const queryCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Generate SQL Query from Natural Language
 *
 * Uses AI to convert user questions into safe SQL queries.
 *
 * @param {string} userQuestion - Natural language question
 * @param {Object} schema - Database schema information
 * @returns {Promise<string>} Generated SQL query
 */
export const generateSQLQuery = async (userQuestion, schema = null) => {
  // Check cache first
  const cacheKey = `${userQuestion}_${JSON.stringify(schema ? schema.map(s => s.table) : 'default')}`;
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('⚡ Serving from cache:', userQuestion);
    return cached.query;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
      generationConfig: {
        temperature: 0.1, // Very low temperature for consistent SQL generation
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 500,
      },
    });

    // Build prompt with schema
    let prompt = SQL_GENERATION_PROMPT;
    let schemaSection = '';

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];

      schemaSection = 'DATABASE SCHEMA:\n\n';

      schemas.forEach(s => {
        if (s && s.columns) {
          schemaSection += `Table: ${s.table}\nColumns:\n` +
            Object.entries(s.columns).map(([col, type]) => `- ${col} (${type})`).join('\n');

          // Add sample data if available
          if (s.sampleData && s.sampleData.length > 0) {
            schemaSection += `\nSample data:\n`;
            s.sampleData.slice(0, 2).forEach((row, i) => {
              schemaSection += `${i + 1}. ${JSON.stringify(row)}\n`;
            });
          }
          schemaSection += '\n\n';
        }
      });
    } else {
      // Fallback default schema
      schemaSection = `DATABASE SCHEMA:
Table: items
Columns:
- id (integer, primary key)
- name (varchar, product name)
- description (text)
- price (decimal, product price)
- category (varchar, product category)
- email (varchar, contact email)
- phone (varchar, contact phone)
- created_date (date, when item was added)
- is_active (boolean, whether item is active)
- quantity (integer, stock quantity)
- rating (decimal, product rating 0-5)`;
    }

    // Replace the placeholder with the actual schema
    prompt = prompt.replace('{{DATABASE_SCHEMA}}', schemaSection);

    // Pass user's "search for tables" intent if present
    if (userQuestion.toLowerCase().includes('tables') || userQuestion.toLowerCase().includes('schema')) {
      prompt += `\nHint: The user is asking about the database structure. You can query information_schema or just explain based on the provided schema.`;
    }

    prompt += `\n\nUser question: "${userQuestion}"\n\nSQL query:`;

    // Implement retry logic for rate limiting
    let result = null;
    let retries = 5;
    let delay = 5000;

    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        if (err.message && err.message.includes('429')) {
          console.log(`⏳ Rate limited. Retrying in ${delay}ms... Full error:`, err.message);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
          retries--;
        } else {
          console.error('Gemini API Error details:', JSON.stringify(err, null, 2));
          throw err;
        }
      }
    }

    if (!result) {
      throw new Error('Failed to generate content after retries');
    }

    const response = result.response;
    let sqlQuery = response.text().trim();

    // Clean up the response
    sqlQuery = sqlQuery.replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();

    // Remove any trailing semicolon and re-add it
    sqlQuery = sqlQuery.replace(/;+$/, '') + ';';

    console.log('🤖 AI Generated SQL:', sqlQuery);

    // Cache the result
    queryCache.set(cacheKey, {
      query: sqlQuery,
      timestamp: Date.now()
    });

    return sqlQuery;

  } catch (error) {
    console.error('❌ SQL generation error:', error);
    throw new Error('Failed to generate SQL query from question');
  }
};

/**
 * System Prompt for Database Queries
 *
 * This comprehensive prompt instructs the AI on:
 * - Available database structure and capabilities
 * - How to interpret user queries
 * - SQL query generation guidelines
 * - Response formatting requirements
 */
const SYSTEM_PROMPT = `You are an AI assistant that helps users understand database query results.

Your role is to:
1. Interpret database query results
2. Provide clear, natural language answers
3. Explain data in a user-friendly way

IMPORTANT:
- You will receive the user's question AND the database results
- DO NOT suggest running SQL queries - they have already been executed
- Focus on explaining the results clearly and helpfully
- If results are empty, explain that no matching data was found

Be conversational, helpful, and concise.`;

/**
 * Generate AI Response
 *
 * Processes user messages and generates appropriate responses.
 * This function handles the conversation flow and query generation.
 *
 * @param {string} userMessage - The user's input message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} AI-generated response
 */
export const generateResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Initialize model with system prompt
    const model = genAI.getGenerativeModel({
      model: 'models/gemini-2.5-flash',
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

    // Generate response
    const chat = model.startChat({
      history: history
    });

    // Implement retry logic for rate limiting
    let result = null;
    let retries = 5;
    let delay = 5000;

    while (retries > 0) {
      try {
        result = await chat.sendMessage(userMessage);
        break;
      } catch (err) {
        if (err.message && err.message.includes('429')) {
          console.log(`⏳ Rate limited. Retrying in ${delay}ms... Full error:`, err.message);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
          retries--;
        } else {
          console.error('Gemini API Error details:', JSON.stringify(err, null, 2));
          throw err;
        }
      }
    }

    if (!result) {
      throw new Error('Failed to generate response after retries');
    }

    const response = result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini AI service error:', error);

    // Provide fallback response for common errors
    if (error.message?.includes('API_KEY')) {
      throw new Error('Gemini API key is invalid or expired');
    }

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    }

    throw new Error('AI service temporarily unavailable. Please try again.');
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

    // Block dangerous keywords using word boundaries
    const dangerousKeywords = ['DELETE', 'INSERT', 'UPDATE', 'DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];

    // Create regex pattern: /\b(DELETE|INSERT|...)\b/i
    const dangerousPattern = new RegExp(`\\b(${dangerousKeywords.join('|')})\\b`, 'i');

    if (dangerousPattern.test(cleanSql)) {
      console.log('Query rejected due to dangerous keyword match:', cleanSql);
      return false;
    }

    // Additional safety checks
    if (/\bINTO\b/i.test(cleanSql) || /\bVALUES\b/i.test(cleanSql)) {
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
  generateSQLQuery,
  parseQueryIntent,
  isSafeQuery
};
