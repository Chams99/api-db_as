import http from 'http';

/**
 * Simple Twilio Test using Node.js built-in http module
 */

const API_BASE = 'http://localhost:5000';

console.log('🧪 Simple Twilio Test...\n');

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
 * Test Health Check
 */
async function testHealth() {
  console.log('1️⃣ Testing Health Check...');
  try {
    const result = await makeRequest('/health');
    console.log(`   Status: ${result.status}`);
    console.log(`   Data:`, result.data);
    
    if (result.status === 200 && result.data.status === 'healthy') {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

/**
 * Test Send OTP
 */
async function testSendOTP() {
  console.log('\n2️⃣ Testing Send OTP...');
  try {
    const result = await makeRequest('/api/twilio/send-otp', 'POST', { phone: '+1234567890' });
    console.log(`   Status: ${result.status}`);
    console.log(`   Data:`, result.data);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ Send OTP successful');
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
 * Test Invalid Phone
 */
async function testInvalidPhone() {
  console.log('\n3️⃣ Testing Invalid Phone...');
  try {
    const result = await makeRequest('/api/twilio/send-otp', 'POST', { phone: 'invalid' });
    console.log(`   Status: ${result.status}`);
    console.log(`   Data:`, result.data);
    
    if (result.status === 400 && result.data.message.includes('international format')) {
      console.log('✅ Invalid phone validation working');
      return true;
    } else {
      console.log('❌ Invalid phone validation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid phone error:', error.message);
    return false;
  }
}

/**
 * Test Stats
 */
async function testStats() {
  console.log('\n4️⃣ Testing Stats...');
  try {
    const result = await makeRequest('/api/twilio/stats');
    console.log(`   Status: ${result.status}`);
    console.log(`   Data:`, result.data);
    
    if (result.status === 200 && result.data.success) {
      console.log('✅ Stats successful');
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
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Simple Twilio Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Send OTP', fn: testSendOTP },
    { name: 'Invalid Phone', fn: testInvalidPhone },
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

  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed.');
  }
}

// Run tests
runTests().catch(console.error);
