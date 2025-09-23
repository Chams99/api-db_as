// Using built-in fetch (Node.js 18+)
// No import needed for fetch in modern Node.js

/**
 * Twilio API Test Script
 * 
 * This script tests all Twilio endpoints to ensure they're working correctly.
 * Run this after starting your server to verify the integration.
 */

const API_BASE = 'http://localhost:5000';
const TEST_PHONE = '+1234567890'; // Replace with your test phone number

console.log('🧪 Testing Twilio Integration...\n');

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check...');
  try {
    console.log(`   Fetching: ${API_BASE}/health`);
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      timeout: 5000
    });
    
    console.log(`   Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`❌ Health check failed with status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    console.log(`   Response data:`, data);
    
    if (data.status === 'healthy') {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed - status not healthy');
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('   Error details:', error);
    return false;
  }
}

/**
 * Test 2: Send OTP
 */
async function testSendOTP() {
  console.log('\n2️⃣ Testing Send OTP...');
  try {
    const response = await fetch(`${API_BASE}/api/twilio/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: TEST_PHONE })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Send OTP successful');
      console.log(`   Call SID: ${data.callSid}`);
      console.log(`   Message: ${data.message}`);
      return true;
    } else {
      console.log('❌ Send OTP failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Send OTP failed:', error.message);
    return false;
  }
}

/**
 * Test 3: Invalid Phone Number
 */
async function testInvalidPhone() {
  console.log('\n3️⃣ Testing Invalid Phone Number...');
  try {
    const response = await fetch(`${API_BASE}/api/twilio/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: 'invalid-phone' })
    });

    const data = await response.json();
    
    if (!data.success && data.message.includes('international format')) {
      console.log('✅ Invalid phone validation working');
      return true;
    } else {
      console.log('❌ Invalid phone validation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid phone test failed:', error.message);
    return false;
  }
}

/**
 * Test 4: Verify OTP (with wrong OTP)
 */
async function testVerifyWrongOTP() {
  console.log('\n4️⃣ Testing Verify Wrong OTP...');
  try {
    const response = await fetch(`${API_BASE}/api/twilio/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: TEST_PHONE, otp: '9999' })
    });

    const data = await response.json();
    
    if (!data.success && data.message.includes('Invalid')) {
      console.log('✅ Wrong OTP validation working');
      return true;
    } else {
      console.log('❌ Wrong OTP validation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Wrong OTP test failed:', error.message);
    return false;
  }
}

/**
 * Test 5: Get Stats
 */
async function testGetStats() {
  console.log('\n5️⃣ Testing Get Stats...');
  try {
    const response = await fetch(`${API_BASE}/api/twilio/stats`);
    const data = await response.json();
    
    if (data.success && data.stats) {
      console.log('✅ Get stats successful');
      console.log(`   Total stored: ${data.stats.totalStored}`);
      console.log(`   Storage: ${data.stats.storage.join(', ')}`);
      return true;
    } else {
      console.log('❌ Get stats failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Get stats failed:', error.message);
    return false;
  }
}

/**
 * Test 6: Missing Phone Number
 */
async function testMissingPhone() {
  console.log('\n6️⃣ Testing Missing Phone Number...');
  try {
    const response = await fetch(`${API_BASE}/api/twilio/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    if (!data.success && data.message.includes('required')) {
      console.log('✅ Missing phone validation working');
      return true;
    } else {
      console.log('❌ Missing phone validation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Missing phone test failed:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting Twilio API Tests...\n');
  console.log(`📞 Test phone number: ${TEST_PHONE}`);
  console.log(`🌐 API Base URL: ${API_BASE}\n`);

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Send OTP', fn: testSendOTP },
    { name: 'Invalid Phone', fn: testInvalidPhone },
    { name: 'Verify Wrong OTP', fn: testVerifyWrongOTP },
    { name: 'Get Stats', fn: testGetStats },
    { name: 'Missing Phone', fn: testMissingPhone }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await test.fn();
    if (result) passed++;
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Twilio integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }

  console.log('\n📝 Manual Testing Steps:');
  console.log('1. Open twilio-example.html in your browser');
  console.log('2. Enter a real phone number (with +country code)');
  console.log('3. Click "Send OTP" and wait for the voice call');
  console.log('4. Enter the 4-digit code you heard');
  console.log('5. Click "Verify OTP" to complete verification');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests };
