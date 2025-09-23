import http from 'http';

/**
 * Test Twilio with Real Phone Number
 * 
 * This script tests the Twilio integration with a real phone number.
 * Make sure to replace the TEST_PHONE with your actual phone number.
 */

const API_BASE = 'http://localhost:5000';
const TEST_PHONE = '+1234567890'; // ⚠️ REPLACE WITH YOUR REAL PHONE NUMBER

console.log('📞 Testing Twilio with Real Phone Number...\n');
console.log(`📱 Test Phone: ${TEST_PHONE}`);
console.log('⚠️  Make sure this is your real phone number!\n');

/**
 * Make HTTP request using Node.js built-in http module
 */
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test Send OTP with Real Phone
 */
async function testSendOTPReal() {
  console.log('1️⃣ Testing Send OTP with Real Phone...');
  console.log(`   Phone: ${TEST_PHONE}`);
  console.log('   ⏳ Sending OTP...');
  
  try {
    const result = await makeRequest('/api/twilio/send-otp', 'POST', { phone: TEST_PHONE });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response:`, result.data);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ OTP sent successfully!');
      console.log(`   Call SID: ${result.data.callSid}`);
      console.log('   📞 You should receive a voice call shortly...');
      return true;
    } else {
      console.log('❌ Send OTP failed:', result.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Send OTP error:', error.message);
    return false;
  }
}

/**
 * Test Verify OTP
 */
async function testVerifyOTP() {
  console.log('\n2️⃣ Testing Verify OTP...');
  console.log('   Enter the 4-digit code you received in the call:');
  
  // In a real scenario, you would enter the OTP here
  // For this test, we'll simulate with a placeholder
  const testOTP = '1234'; // Replace with actual OTP from call
  
  try {
    const result = await makeRequest('/api/twilio/verify-otp', 'POST', { 
      phone: TEST_PHONE, 
      otp: testOTP 
    });
    
    console.log(`   Status: ${result.status}`);
    console.log(`   Response:`, result.data);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ OTP verified successfully!');
      return true;
    } else {
      console.log('❌ OTP verification failed:', result.data.message);
      console.log('   This is expected if you used a placeholder OTP');
      return false;
    }
  } catch (error) {
    console.log('❌ Verify OTP error:', error.message);
    return false;
  }
}

/**
 * Test Stats
 */
async function testStats() {
  console.log('\n3️⃣ Testing Stats...');
  try {
    const result = await makeRequest('/api/twilio/stats');
    console.log(`   Status: ${result.status}`);
    console.log(`   Stats:`, result.data);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ Stats retrieved successfully!');
      return true;
    } else {
      console.log('❌ Stats failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Stats error:', error.message);
    return false;
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log('🚀 Starting Real Phone Test...\n');
  
  if (TEST_PHONE === '+1234567890') {
    console.log('⚠️  WARNING: You are using the default test phone number!');
    console.log('   Please edit test-real-phone.js and replace TEST_PHONE with your real phone number.');
    console.log('   Example: const TEST_PHONE = "+1234567890";\n');
  }
  
  const tests = [
    { name: 'Send OTP', fn: testSendOTPReal },
    { name: 'Verify OTP', fn: testVerifyOTP },
    { name: 'Stats', fn: testStats }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed >= 2) { // Stats and Send OTP should pass
    console.log('\n🎉 Twilio integration is working!');
    console.log('   📞 Check your phone for the voice call with the OTP code.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run the test
runTest().catch(console.error);
