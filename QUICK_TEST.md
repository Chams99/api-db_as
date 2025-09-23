# 🚀 Quick Test Guide for Twilio Integration

## Step 1: Start Your Main Server

```bash
# Start the main API server
npm start
```

You should see:
```
🚀 Server running on port 5000
📊 Health check available at: http://0.0.0.0:5000/health
💬 Chat API available at: http://0.0.0.0:5000/api/chat
📞 Twilio API available at: http://0.0.0.0:5000/api/twilio
```

## Step 2: Test the API (Choose One Method)

### Method A: Automated Tests
```bash
# Run automated API tests
npm run test:twilio
```

**Expected Output:**
```
🧪 Simple Twilio Test...
✅ Health check passed
✅ Invalid phone validation working  
✅ Stats successful
⚠️  Send OTP: Expected failure (test phone not valid for Twilio)
```

### Method B: HTML Interface
```bash
# In a new terminal, start the test server
npm run test:html
```

Then open: http://localhost:3001/twilio-example.html

### Method C: Manual cURL Tests
```bash
# Test health
curl http://localhost:5000/health

# Send OTP (replace with your phone number)
curl -X POST http://localhost:5000/api/twilio/send-otp \
  -H "Content-Type: application/json \
  -d '{"phone": "+1234567890"}'

# Verify OTP (replace with actual OTP from call)
curl -X POST http://localhost:5000/api/twilio/verify-otp \
  -H "Content-Type: application/json \
  -d '{"phone": "+1234567890", "otp": "1234"}'
```

## Step 3: What to Expect

### ✅ Success Indicators:
- Server starts without errors
- Health check returns `{"status": "healthy"}`
- Send OTP returns `{"success": true, "callSid": "CA..."}`
- You receive a voice call with 4-digit code
- Verify OTP returns `{"success": true}`

### ❌ Common Issues:
- **"Twilio configuration missing"** → Check your `.env` file
- **"Failed to send OTP"** → Check Twilio credentials and balance
- **"No OTP found"** → OTP expired or already used
- **CORS errors** → Use the HTML test server (port 3001)

## Step 4: Real Phone Testing

1. Use your own phone number in international format: `+1234567890`
2. Click "Send OTP" and wait for the voice call
3. Listen for the 4-digit code
4. Enter the code and click "Verify OTP"

## 🎯 Quick Checklist

- [ ] Server running on port 5000
- [ ] Health check works
- [ ] Send OTP with valid phone number
- [ ] Receive voice call with code
- [ ] Verify OTP successfully
- [ ] Invalid phone number rejected
- [ ] Wrong OTP rejected

## 📞 Need Help?

Check the full [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed troubleshooting and advanced testing scenarios.

---

**Ready to test? Run `npm start` and then `npm run test:twilio`! 🎉**
