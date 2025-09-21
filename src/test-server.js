/**
 * Server Test Script
 *
 * Simple test script to verify server functionality.
 * Tests basic imports and configurations without starting the full server.
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Starting server tests...\n');

// Test 1: Environment Variables
console.log('📋 Testing environment variables...');
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'GEMINI_API_KEY'];
let envTestsPassed = 0;

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Configured`);
    envTestsPassed++;
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log(`Environment tests: ${envTestsPassed}/${requiredEnvVars.length} passed\n`);

// Test 2: Module Imports
console.log('📦 Testing module imports...');
const modules = [
  { name: 'express', path: 'express' },
  { name: '@supabase/supabase-js', path: '@supabase/supabase-js' },
  { name: '@google/generative-ai', path: '@google/generative-ai' },
  { name: 'cors', path: 'cors' },
  { name: 'helmet', path: 'helmet' },
  { name: 'express-rate-limit', path: 'express-rate-limit' }
];

let moduleTestsPassed = 0;

modules.forEach(async ({ name, path }) => {
  try {
    await import(path);
    console.log(`✅ ${name}: Import successful`);
    moduleTestsPassed++;
  } catch (error) {
    console.log(`❌ ${name}: Import failed - ${error.message}`);
  }
});

console.log(`Module tests: ${moduleTestsPassed}/${modules.length} passed\n`);

// Test 3: Configuration Files
console.log('⚙️ Testing configuration files...');
try {
  const supabaseConfig = await import('./config/supabaseClient.js');
  console.log('✅ Supabase client: Configuration loaded');
} catch (error) {
  console.log(`❌ Supabase client: Configuration failed - ${error.message}`);
}

try {
  const geminiService = await import('./services/geminiService.js');
  console.log('✅ Gemini service: Configuration loaded');
} catch (error) {
  console.log(`❌ Gemini service: Configuration failed - ${error.message}`);
}

try {
  const databaseService = await import('./services/databaseService.js');
  console.log('✅ Database service: Configuration loaded');
} catch (error) {
  console.log(`❌ Database service: Configuration failed - ${error.message}`);
}

console.log('\n✅ Server test completed!');
console.log('🚀 Run "npm start" to start the server');
console.log('💻 Run "npm run dev" for development mode');
