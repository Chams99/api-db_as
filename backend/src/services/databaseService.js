import supabase, { DATABASE_SCHEMA } from '../config/supabaseClient.js';
import { isSafeQuery } from './geminiService.js';

/**
 * Database Service Layer
 *
 * This service handles all database operations for the AI chat interface.
 * It provides a clean abstraction layer between the application logic
 * and the Supabase database client.
 *
 * Key features:
 * - Safe query execution with validation
 * - Error handling and transformation
 * - Query building helpers
 * - Response formatting
 * - Dynamic schema introspection
 */

export class DatabaseService {
  /**
   * Get All Tables Schema
   *
   * Retrieves schema information for ALL discovered tables.
   *
   * @returns {Promise<Array>} Array of table schema objects
   */
  static async getAllTablesSchema() {
    try {
      // 1. Get list of all tables
      const { tables } = await this.getTableSchema(null);

      if (!tables || tables.length === 0) {
        return [];
      }

      // 2. Fetch schema for each table
      const schemas = [];
      for (const table of tables) {
        const schema = await this.getTableSchema(table);
        if (schema) {
          schemas.push(schema);
        }
      }

      return schemas;
    } catch (error) {
      console.error('Error getting all tables schema:', error);
      return [];
    }
  }

  /**
   * Get Database Schema
   *
   * Dynamically retrieves the database schema from Supabase.
   * This allows the AI to work with any database structure.
   *
   * @param {string} tableName - Optional table name to get schema for
   * @returns {Promise<Object>} Database schema information
   */
  static async getTableSchema(tableName = null) {
    try {
      // Get all tables if no specific table requested
      if (!tableName) {
        // Query PostgreSQL information_schema to get all tables
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_type', 'BASE TABLE');

        if (error) {
          // Fallback: try to get tables by querying known table
          console.log('Using fallback method to detect tables');
          return {
            tables: ['items'], // Default fallback
            primaryTable: 'items'
          };
        }

        const tables = data?.map(t => t.table_name) || ['items'];
        return {
          tables: tables,
          primaryTable: tables[0] || 'items'
        };
      }

      // Get columns for specific table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error getting table schema:', error);
        return null;
      }

      // Extract column information from the first row
      const columns = {};
      if (data && data.length > 0) {
        const sampleRow = data[0];
        Object.keys(sampleRow).forEach(key => {
          const value = sampleRow[key];
          let type = 'text';

          if (typeof value === 'number') {
            type = Number.isInteger(value) ? 'integer' : 'decimal';
          } else if (typeof value === 'boolean') {
            type = 'boolean';
          } else if (value instanceof Date) {
            type = 'date';
          }

          columns[key] = type;
        });
      }

      // Get sample data for AI context
      const { data: sampleData } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      return {
        table: tableName,
        columns: columns,
        sampleData: sampleData || [],
        columnCount: Object.keys(columns).length
      };

    } catch (error) {
      console.error('Error in getTableSchema:', error);
      return null;
    }
  }

  /**
   * Get Schema Description for AI
   *
   * Formats schema information in a way that's easy for AI to understand.
   *
   * @param {string} tableName - Table name
   * @returns {Promise<string>} Formatted schema description
   */
  static async getSchemaDescription(tableName = 'items') {
    const schema = await this.getTableSchema(tableName);

    if (!schema) {
      return `Table: ${tableName}\nColumns: Unable to retrieve schema`;
    }

    let description = `Table: ${schema.table}\nColumns:\n`;

    Object.entries(schema.columns).forEach(([col, type]) => {
      description += `- ${col} (${type})\n`;
    });

    if (schema.sampleData && schema.sampleData.length > 0) {
      description += `\nSample data (${schema.sampleData.length} rows):\n`;
      schema.sampleData.forEach((row, i) => {
        description += `${i + 1}. ${JSON.stringify(row)}\n`;
      });
    }

    return description;
  }
  /**
   * Execute Query
   *
   * Main method for executing database queries.
   * Uses Supabase's built-in query methods for better security and reliability.
   *
   * @param {string} query - SQL query string (for logging purposes)
   * @param {Array} params - Query parameters for prepared statements
   * @returns {Promise<Object>} Query results and metadata
   */
  static async executeQuery(query, params = []) {
    try {
      // Validate query safety
      if (!isSafeQuery(query)) {
        throw new Error('Query contains unsafe operations');
      }

      console.log('🔍 Executing query:', query);
      console.log('📋 Parameters:', params);

      // Parse the query to determine what type of operation to perform
      const cleanQuery = query.replace(/\s+/g, ' ').trim();
      const upperQuery = cleanQuery.toUpperCase();

      let result;

      if (upperQuery.includes('SELECT') && upperQuery.includes('FROM ITEMS')) {
        // Handle SELECT queries on items table
        if (upperQuery.includes('COUNT(*)')) {
          // Handle COUNT queries
          let countQuery = supabase.from('items').select('*', { count: 'exact', head: true });

          // Apply WHERE conditions based on the query
          if (upperQuery.includes('WHERE')) {
            const whereClause = cleanQuery.substring(cleanQuery.toUpperCase().indexOf('WHERE') + 5);
            if (whereClause.includes('CATEGORY =')) {
              const categoryIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (categoryIndex !== -1) {
                countQuery = countQuery.eq('category', params[categoryIndex]);
              }
            }
            if (whereClause.includes('IS_ACTIVE =')) {
              const activeIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (activeIndex !== -1) {
                countQuery = countQuery.eq('is_active', params[activeIndex]);
              }
            }
          }

          const { data, error, count } = await countQuery;
          if (error) throw error;

          result = {
            data: [{ total: count }],
            count: 1
          };
        } else {
          // Handle regular SELECT queries
          let selectQuery = supabase.from('items').select('*');

          // Apply WHERE conditions
          if (upperQuery.includes('WHERE')) {
            if (upperQuery.includes('CATEGORY =')) {
              const categoryIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (categoryIndex !== -1) {
                selectQuery = selectQuery.eq('category', params[categoryIndex]);
              }
            }
            if (upperQuery.includes('PRICE >=')) {
              const priceIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (priceIndex !== -1) {
                selectQuery = selectQuery.gte('price', params[priceIndex]);
              }
            }
            if (upperQuery.includes('PRICE <=')) {
              const priceIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (priceIndex !== -1) {
                selectQuery = selectQuery.lte('price', params[priceIndex]);
              }
            }
            if (upperQuery.includes('RATING >=')) {
              const ratingIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (ratingIndex !== -1) {
                selectQuery = selectQuery.gte('rating', params[ratingIndex]);
              }
            }
            if (upperQuery.includes('NAME ILIKE')) {
              const nameIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
              if (nameIndex !== -1) {
                selectQuery = selectQuery.ilike('name', params[nameIndex]);
              }
            }
            if (upperQuery.includes('IS_ACTIVE = TRUE')) {
              selectQuery = selectQuery.eq('is_active', true);
            }
          }

          // Apply ORDER BY
          if (upperQuery.includes('ORDER BY')) {
            if (upperQuery.includes('PRICE ASC')) {
              selectQuery = selectQuery.order('price', { ascending: true });
            } else if (upperQuery.includes('PRICE DESC')) {
              selectQuery = selectQuery.order('price', { ascending: false });
            } else if (upperQuery.includes('RATING DESC')) {
              selectQuery = selectQuery.order('rating', { ascending: false });
            } else if (upperQuery.includes('CREATED_DATE DESC')) {
              selectQuery = selectQuery.order('created_date', { ascending: false });
            } else if (upperQuery.includes('CREATED_DATE ASC')) {
              selectQuery = selectQuery.order('created_date', { ascending: true });
            } else if (upperQuery.includes('NAME ASC')) {
              selectQuery = selectQuery.order('name', { ascending: true });
            }
          }

          // Apply LIMIT
          if (upperQuery.includes('LIMIT')) {
            const limitIndex = params.findIndex((_, i) => cleanQuery.includes(`$${i + 1}`));
            if (limitIndex !== -1) {
              selectQuery = selectQuery.limit(params[limitIndex]);
            }
          }

          const { data, error } = await selectQuery;
          if (error) throw error;

          result = {
            data: data || [],
            count: data?.length || 0
          };
        }
      } else if (upperQuery.includes('SELECT DISTINCT CATEGORY')) {
        // Handle category queries
        const { data, error } = await supabase
          .from('items')
          .select('category')
          .not('category', 'is', null);

        if (error) throw error;

        const uniqueCategories = [...new Set(data.map(item => item.category))].sort();
        result = {
          data: uniqueCategories.map(category => ({ category })),
          count: uniqueCategories.length
        };
      } else {
        throw new Error('Unsupported query type');
      }

      return {
        success: true,
        data: result.data,
        count: result.count,
        query: query,
        params: params
      };

    } catch (error) {
      console.error('❌ Database service error:', error);
      return {
        success: false,
        error: error.message,
        query: query,
        params: params
      };
    }
  }

  /**
   * Execute Dynamic SQL Query
   *
   * Executes AI-generated SQL queries with enhanced safety checks.
   * Uses Supabase's RPC feature for direct SQL execution.
   *
   * @param {string} sqlQuery - AI-generated SQL query
   * @returns {Promise<Object>} Query results and metadata
   */
  static async executeDynamicQuery(sqlQuery) {
    try {
      console.log('🔍 Executing dynamic query:', sqlQuery);

      // Validate query safety
      if (!isSafeQuery(sqlQuery)) {
        throw new Error('Query contains unsafe operations');
      }

      // Additional safety checks
      const upperQuery = sqlQuery.toUpperCase().trim();

      // Must be a SELECT query
      if (!upperQuery.startsWith('SELECT')) {
        throw new Error('Only SELECT queries are allowed');
      }

      // Execute using Supabase's rpc method for raw SQL
      // Note: This requires a PostgreSQL function to be created in Supabase
      // For now, we'll parse and execute using Supabase's query builder

      const result = await this.parseAndExecuteSQL(sqlQuery);

      return {
        success: true,
        data: result.data || [],
        count: result.data?.length || (result.count !== undefined ? result.count : 0),
        query: sqlQuery
      };

    } catch (error) {
      console.error('❌ Dynamic query execution error:', error);
      return {
        success: false,
        error: error.message,
        query: sqlQuery
      };
    }
  }

  /**
   * Parse and Execute SQL
   *
   * Converts SQL string to Supabase query builder calls.
   * This is a simplified parser for common SELECT queries.
   *
   * @param {string} sql - SQL query string
   * @returns {Promise<Object>} Query results
   */
  static async parseAndExecuteSQL(sql) {
    const cleanSQL = sql.replace(/;+$/, '').trim();
    const upperSQL = cleanSQL.toUpperCase();

    // Extract table name
    const fromMatch = cleanSQL.match(/FROM\s+(\w+)/i);
    if (!fromMatch) {
      // Handle simple SELECTs without FROM (e.g., SELECT 1)
      if (upperSQL === 'SELECT 1') {
        return { data: [{ result: 1 }], count: 1 };
      }
      throw new Error('Could not parse table name from query');
    }
    const tableName = fromMatch[1];

    // Start building query
    let query = supabase.from(tableName);

    // Handle COUNT queries
    if (upperSQL.includes('COUNT(*)')) {
      query = query.select('*', { count: 'exact', head: false });

      // Apply WHERE clause if present
      query = this.applyWhereClause(query, cleanSQL);

      // Apply GROUP BY if present
      if (upperSQL.includes('GROUP BY')) {
        // For GROUP BY queries, we need to select the actual columns
        const selectMatch = cleanSQL.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
        if (selectMatch) {
          const columns = selectMatch[1].trim();
          query = supabase.from(tableName).select(columns);
          query = this.applyWhereClause(query, cleanSQL);
          query = this.applyGroupBy(query, cleanSQL);
        }
      }

      const { data, error, count } = await query;
      if (error) throw error;

      if (upperSQL.includes('GROUP BY')) {
        return { data, count: data?.length || 0 };
      }

      return { data: [{ total: count }], count: 1 };
    }

    // Handle regular SELECT queries
    const selectMatch = cleanSQL.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
    let selectColumns = '*';
    let isDistinct = false;

    if (selectMatch) {
      selectColumns = selectMatch[1].trim();

      // Handle DISTINCT
      if (selectColumns.toUpperCase().startsWith('DISTINCT ')) {
        isDistinct = true;
        selectColumns = selectColumns.substring(9).trim(); // Remove "DISTINCT "
      }

      // Convert SQL column list to Supabase format
      if (selectColumns !== '*' && !selectColumns.includes('(')) {
        selectColumns = selectColumns.split(',').map(c => c.trim()).join(',');
      }
    }

    query = supabase.from(tableName).select(selectColumns);

    // Apply WHERE clause
    query = this.applyWhereClause(query, cleanSQL);

    // Apply ORDER BY
    query = this.applyOrderBy(query, cleanSQL);

    // Apply LIMIT
    query = this.applyLimit(query, cleanSQL);

    const { data, error } = await query;
    if (error) throw error;

    // Post-process for DISTINCT if needed (since Supabase select() doesn't do DISTINCT directly easily)
    let finalData = data || [];
    if (isDistinct && finalData.length > 0) {
      // Simple deduplication for retrieved columns
      // Note: This works because we only fetch limited rows usually
      const uniqueSet = new Set();
      finalData = finalData.filter(item => {
        const val = JSON.stringify(item);
        if (uniqueSet.has(val)) return false;
        uniqueSet.add(val);
        return true;
      });
    }

    return { data: finalData, count: finalData.length };
  }

  /**
   * Apply WHERE clause to Supabase query
   */
  static applyWhereClause(query, sql) {
    const whereMatch = sql.match(/WHERE\s+([\s\S]*?)(?:ORDER BY|GROUP BY|LIMIT|$)/i);
    if (!whereMatch) return query;

    const whereClause = whereMatch[1].trim();

    // Parse simple conditions
    // Handle = conditions
    const eqMatches = [...whereClause.matchAll(/(\w+)\s*=\s*'([^']+)'/gi)];
    for (const match of eqMatches) {
      query = query.eq(match[1], match[2]);
    }

    // Handle numeric = conditions
    const numEqMatches = [...whereClause.matchAll(/(\w+)\s*=\s*(\d+(?:\.\d+)?)/gi)];
    for (const match of numEqMatches) {
      query = query.eq(match[1], parseFloat(match[2]));
    }

    // Handle < conditions
    const ltMatches = [...whereClause.matchAll(/(\w+)\s*<\s*(\d+(?:\.\d+)?)/gi)];
    for (const match of ltMatches) {
      query = query.lt(match[1], parseFloat(match[2]));
    }

    // Handle > conditions
    const gtMatches = [...whereClause.matchAll(/(\w+)\s*>\s*(\d+(?:\.\d+)?)/gi)];
    for (const match of gtMatches) {
      query = query.gt(match[1], parseFloat(match[2]));
    }

    // Handle >= conditions
    const gteMatches = [...whereClause.matchAll(/(\w+)\s*>=\s*(\d+(?:\.\d+)?)/gi)];
    for (const match of gteMatches) {
      query = query.gte(match[1], parseFloat(match[2]));
    }

    // Handle <= conditions
    const lteMatches = [...whereClause.matchAll(/(\w+)\s*<=\s*(\d+(?:\.\d+)?)/gi)];
    for (const match of lteMatches) {
      query = query.lte(match[1], parseFloat(match[2]));
    }

    // Handle BETWEEN conditions
    const betweenMatch = whereClause.match(/(\w+)\s+BETWEEN\s+(\d+(?:\.\d+)?)\s+AND\s+(\d+(?:\.\d+)?)/i);
    if (betweenMatch) {
      query = query.gte(betweenMatch[1], parseFloat(betweenMatch[2]));
      query = query.lte(betweenMatch[1], parseFloat(betweenMatch[3]));
    }

    // Handle ILIKE conditions
    const ilikeMatches = [...whereClause.matchAll(/(\w+)\s+ILIKE\s*'([^']+)'/gi)];
    for (const match of ilikeMatches) {
      query = query.ilike(match[1], match[2]);
    }

    return query;
  }

  /**
   * Apply ORDER BY clause to Supabase query
   */
  static applyOrderBy(query, sql) {
    const orderMatch = sql.match(/ORDER BY\s+([\s\S]*?)(?:LIMIT|$)/i);
    if (!orderMatch) return query;

    const orderClause = orderMatch[1].trim();
    const parts = orderClause.split(',')[0].trim().split(/\s+/);
    const column = parts[0];
    const direction = parts[1]?.toUpperCase() === 'DESC' ? false : true;

    return query.order(column, { ascending: direction });
  }

  /**
   * Apply GROUP BY clause (simplified)
   */
  static applyGroupBy(query, sql) {
    // Supabase doesn't directly support GROUP BY in the query builder
    // This would need to be handled differently or use RPC
    return query;
  }

  /**
   * Apply LIMIT clause to Supabase query
   */
  static applyLimit(query, sql) {
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (!limitMatch) return query;

    return query.limit(parseInt(limitMatch[1]));
  }

  /**
   * Get Items by Category
   *
   * Retrieves items filtered by category with optional sorting and limiting.
   *
   * @param {string} category - Product category to filter by
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Query results
   */
  static async getItemsByCategory(category, options = {}) {
    const {
      limit = 20,
      sortBy = 'name',
      sortOrder = 'ASC',
      includeInactive = false
    } = options;

    let query = `
      SELECT id, name, description, price, category, rating, quantity, is_active, created_date
      FROM items
      WHERE category = $1
    `;

    const params = [category];

    if (!includeInactive) {
      query += ` AND is_active = true`;
    }

    if (sortBy && sortOrder) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }

    query += ` LIMIT $${params.length + 1}`;
    params.push(limit);

    return this.executeQuery(query, params);
  }

  /**
   * Get Items by Price Range
   *
   * Retrieves items within a specified price range.
   *
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Query results
   */
  static async getItemsByPriceRange(minPrice, maxPrice, options = {}) {
    const { limit = 20, includeInactive = false } = options;

    let query = `
      SELECT id, name, description, price, category, rating, quantity, is_active
      FROM items
      WHERE price >= $1 AND price <= $2
    `;

    const params = [minPrice, maxPrice];

    if (!includeInactive) {
      query += ` AND is_active = true`;
    }

    query += ` ORDER BY price ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    return this.executeQuery(query, params);
  }

  /**
   * Get Items by Rating
   *
   * Retrieves items with a minimum rating threshold.
   *
   * @param {number} minRating - Minimum rating threshold
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Query results
   */
  static async getItemsByRating(minRating, options = {}) {
    const { limit = 20, includeInactive = false } = options;

    let query = `
      SELECT id, name, description, price, category, rating, quantity, is_active
      FROM items
      WHERE rating >= $1
    `;

    const params = [minRating];

    if (!includeInactive) {
      query += ` AND is_active = true`;
    }

    query += ` ORDER BY rating DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    return this.executeQuery(query, params);
  }

  /**
   * Get Category Statistics
   *
   * Provides aggregate statistics for items in a category.
   *
   * @param {string} category - Product category
   * @returns {Promise<Object>} Category statistics
   */
  static async getCategoryStats(category) {
    const query = `
      SELECT
        COUNT(*) as total_items,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_items,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(rating) as average_rating
      FROM items
      WHERE category = $1
    `;

    const params = [category];
    return this.executeQuery(query, params);
  }

  /**
   * Search Items by Name
   *
   * Performs a text search on item names.
   *
   * @param {string} searchTerm - Search term
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Search results
   */
  static async searchItemsByName(searchTerm, options = {}) {
    const { limit = 20, includeInactive = false } = options;

    let query = `
      SELECT id, name, description, price, category, rating, quantity, is_active
      FROM items
      WHERE name ILIKE $1
    `;

    const params = [`%${searchTerm}%`];

    if (!includeInactive) {
      query += ` AND is_active = true`;
    }

    query += ` ORDER BY name ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    return this.executeQuery(query, params);
  }

  /**
   * Get All Categories
   *
   * Retrieves a list of all available product categories.
   *
   * @returns {Promise<Object>} Available categories
   */
  static async getAllCategories() {
    const query = `
      SELECT DISTINCT category
      FROM items
      WHERE category IS NOT NULL
      ORDER BY category
    `;

    return this.executeQuery(query);
  }

  /**
   * Get Items Count
   *
   * Returns the total count of items matching specified criteria.
   *
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Item count
   */
  static async getItemsCount(filters = {}) {
    const { category, isActive } = filters;

    let query = `SELECT COUNT(*) as total FROM items WHERE 1=1`;
    const params = [];

    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }

    if (isActive !== undefined) {
      query += ` AND is_active = $${params.length + 1}`;
      params.push(isActive);
    }

    return this.executeQuery(query, params);
  }

  /**
   * Format Query Results
   *
   * Transforms raw database results into user-friendly format.
   *
   * @param {Object} result - Raw query result
   * @param {string} operation - Type of operation performed
   * @returns {string} Formatted result description
   */
  static formatResults(result, operation = 'query') {
    if (!result.success) {
      return `❌ Query failed: ${result.error}`;
    }

    const { data, count } = result;

    switch (operation) {
      case 'category':
        return `Found ${count} items in this category.`;

      case 'price_range':
        return `Found ${count} items in this price range.`;

      case 'rating':
        return `Found ${count} items with this minimum rating.`;

      case 'search':
        return `Search returned ${count} matching items.`;

      case 'stats':
        if (data && data[0]) {
          const stats = data[0];
          return `Category statistics: ${stats.total_items} total items, ${stats.active_items} active, average price $${stats.average_price?.toFixed(2) || 'N/A'}, average rating ${stats.average_rating?.toFixed(1) || 'N/A'} stars.`;
        }
        return 'No statistics available for this category.';

      case 'count':
        return `Total items: ${count}`;

      default:
        return `Query returned ${count} results.`;
    }
  }
}

export default DatabaseService;
