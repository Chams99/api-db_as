import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Supabase Client Configuration
 *
 * This module creates and exports a configured Supabase client instance.
 * The client is used throughout the application for database operations.
 *
 * Security considerations:
 * - Uses anon key for client-side operations (safe for exposure)
 * - Connection pooling and retry logic handled by Supabase client
 * - Proper error handling for connection issues
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase environment variables. ' +
    'Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.'
  );
}

/**
 * Supabase Client Instance
 *
 * Configuration options:
 * - auth: Authentication settings for RLS policies
 * - global: Global configuration for headers and fetch options
 * - db: Database-specific configuration
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // We're not using session persistence for this API
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-api-ai-database-access'
    }
  },
  db: {
    schema: 'public' // Default schema for our test data
  }
});

/**
 * Test Database Connection
 *
 * Verifies that the Supabase connection is working properly.
 * This function can be called during server startup to ensure
 * database connectivity before accepting requests.
 *
 * @returns {Promise<boolean>} True if connection is successful
 */
export const testConnection = async () => {
  try {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('items')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
};

/**
 * Database Schema Information
 *
 * This object provides metadata about the database structure.
 * It's used by the AI service to understand what queries are possible.
 */
export const DATABASE_SCHEMA = {
  table: 'items',
  columns: {
    id: 'INT PRIMARY KEY AUTO_INCREMENT',
    name: 'VARCHAR(100) NOT NULL',
    description: 'TEXT',
    price: 'DECIMAL(10, 2)',
    category: 'VARCHAR(50)',
    email: 'VARCHAR(100)',
    phone: 'VARCHAR(20)',
    created_date: 'DATE',
    is_active: 'BOOLEAN',
    quantity: 'INT',
    rating: 'DECIMAL(3, 2)'
  },
  description: 'Product inventory table with pricing, categorization, and contact information'
};

export default supabase;
