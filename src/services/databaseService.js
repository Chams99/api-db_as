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
 */

export class DatabaseService {
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
        if (upperQuery.includes('COUNT(*)') && !upperQuery.includes('GROUP BY')) {
          // Handle simple COUNT queries (without GROUP BY)
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
        } else if (upperQuery.includes('GROUP BY') && upperQuery.includes('CATEGORY')) {
          // Handle category grouping queries
          const { data, error } = await supabase
            .from('items')
            .select('category')
            .not('category', 'is', null);
          
          if (error) throw error;
          
          // Group by category and count
          const categoryCounts = {};
          data.forEach(item => {
            const category = item.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          
          // Convert to array format
          const groupedData = Object.entries(categoryCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
          
          result = {
            data: groupedData,
            count: groupedData.length
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
   * Get All Category Statistics
   *
   * Returns statistics for all categories in the database.
   *
   * @returns {Promise<Object>} Category statistics
   */
  static async getAllCategoryStats() {
    const query = `
      SELECT
        category,
        COUNT(*) as count
      FROM items
      GROUP BY category
      ORDER BY count DESC
    `;

    return this.executeQuery(query);
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
