# 🧪 Twilio Integration Testing Guide

This guide will help you test the Twilio OTP functionality that has been integrated into your AI agent project.

## 📋 Prerequisites

Before testing, ensure you have:

1. **Twilio Account Setup:**
   - Active Twilio account
   - Phone number purchased from Twilio
   - Account SID and Auth Token

2. **Environment Variables:**
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Server Running:**
   ```bash
   npm start
   # or
   node src/server.js
   ```

## 🚀 Testing Methods

### Method 1: Automated API Tests

Run the automated test script to verify all endpoints:

```bash
# Install node-fetch if not already installed
npm install node-fetch

# Run the test script
node test-twilio.js
```

**Expected Output:**
```
🧪 Testing Twilio Integration...

1️⃣ Testing Health Check...
✅ Health check passed

2️⃣ Testing Send OTP...
✅ Send OTP successful
   Call SID: CA1234567890abcdef
   Message: OTP sent via voice call successfully

3️⃣ Testing Invalid Phone Number...
✅ Invalid phone validation working

4️⃣ Testing Verify Wrong OTP...
✅ Wrong OTP validation working

5️⃣ Testing Get Stats...
✅ Get stats successful
   Total stored: 1
   Storage: +1234567890

6️⃣ Testing Missing Phone Number...
✅ Missing phone validation working

📊 Test Results:
✅ Passed: 6/6
❌ Failed: 0/6

🎉 All tests passed! Twilio integration is working correctly.
```

### Method 2: Manual Testing with HTML Interface

1. **Open the test page:**
   ```bash
   # Open in browser
   open twilio-example.html
   # or
   start twilio-example.html
   ```

2. **Test the interface:**
   - Enter a real phone number (e.g., `+1234567890`)
   - Click "Send OTP"
   - Wait for the voice call
   - Enter the 4-digit code you heard
   - Click "Verify OTP"

### Method 3: cURL Commands

Test individual endpoints using cURL:

#### Send OTP:
```bash
curl -X POST http://localhost:5000/api/twilio/send-otp \
  -H "Content-Type: application/json \
  -d '{"phone": "+1234567890"}'
```

#### Verify OTP:
```bash
curl -X POST http://localhost:5000/api/twilio/verify-otp \
  -H "Content-Type: application/json \
  -d '{"phone": "+1234567890", "otp": "1234"}'
```

#### Get Stats:
```bash
curl http://localhost:5000/api/twilio/stats
```

### Method 4: Postman/Insomnia

Import these requests into your API testing tool:

**Send OTP Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/twilio/send-otp`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "phone": "+1234567890"
  }
  ```

**Verify OTP Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/twilio/verify-otp`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "phone": "+1234567890",
    "otp": "1234"
  }
  ```

## 🔍 What to Test

### ✅ Positive Test Cases

1. **Valid Phone Number:**
   - Use international format: `+1234567890`
   - Should receive voice call with OTP

2. **Correct OTP Verification:**
   - Enter the exact 4-digit code from the call
   - Should return success message

3. **API Endpoints:**
   - All endpoints should return proper JSON responses
   - Health check should show server status

### ❌ Negative Test Cases

1. **Invalid Phone Numbers:**
   - `1234567890` (missing +)
   - `+123` (too short)
   - `invalid-phone` (non-numeric)
   - Empty phone number

2. **Invalid OTP:**
   - Wrong 4-digit code
   - Expired OTP (wait 5+ minutes)
   - Non-numeric OTP

3. **Missing Parameters:**
   - Send OTP without phone
   - Verify OTP without phone or OTP

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Twilio configuration missing" Error
```
❌ Twilio configuration missing! Please check your .env file:
   TWILIO_ACCOUNT_SID (should start with AC)
   TWILIO_AUTH_TOKEN
   TWILIO_PHONE_NUMBER (should start with +1)
```

**Solution:** Check your `.env` file has all required variables.

#### 2. "Failed to send OTP via voice call" Error
```
❌ Failed to send OTP via voice call
```

**Possible causes:**
- Invalid Twilio credentials
- Phone number not verified in Twilio
- Insufficient Twilio account balance
- Invalid phone number format

**Solutions:**
- Verify Twilio credentials in console
- Check Twilio account balance
- Ensure phone number is in international format
- Verify your Twilio phone number is active

#### 3. "No OTP found for this phone number" Error
```
❌ No OTP found for this phone number
```

**Possible causes:**
- OTP expired (5-minute limit)
- OTP already used
- Phone number mismatch

**Solutions:**
- Send a new OTP
- Use the same phone number for verification
- Check if OTP was already verified

#### 4. Server Not Starting
```
Error: Cannot find module 'twilio'
```

**Solution:**
```bash
npm install twilio
```

#### 5. CORS Issues in Browser
```
Access to fetch at 'http://localhost:5000' from origin 'file://' has been blocked by CORS policy
```

**Solution:** Serve the HTML file through a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then access: http://localhost:8000/twilio-example.html
```

## 📊 Expected API Responses

### Successful Send OTP:
```json
{
  "success": true,
  "message": "OTP sent via voice call successfully",
  "callSid": "CA1234567890abcdef"
}
```

### Successful Verify OTP:
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Error Responses:
```json
{
  "success": false,
  "message": "Valid phone number in international format is required (e.g., +1234567890)"
}
```

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] Health check returns healthy status
- [ ] Send OTP with valid phone number works
- [ ] Send OTP with invalid phone number fails
- [ ] Verify OTP with correct code succeeds
- [ ] Verify OTP with wrong code fails
- [ ] OTP expires after 5 minutes
- [ ] Stats endpoint returns current storage info
- [ ] HTML interface works in browser
- [ ] Voice call is received with clear OTP

## 📞 Real Phone Testing

For production testing, use a real phone number:

1. **Your own phone:** Best for testing
2. **Test phone numbers:** Use Twilio's test credentials for development
3. **International numbers:** Test with different country codes

## 🔒 Security Notes

- OTPs expire after 5 minutes
- OTPs are single-use (deleted after verification)
- Phone numbers are validated for international format
- Rate limiting applies to all endpoints
- OTPs are stored in memory (not persistent)

## 📈 Monitoring

Check server logs for:
- Twilio API calls
- OTP generation and storage
- Verification attempts
- Error messages and stack traces

Monitor Twilio console for:
- Call logs and status
- Account usage and billing
- Phone number status
- API errors and limits

---

**Happy Testing! 🎉**

If you encounter any issues, check the server logs and Twilio console for detailed error information.
