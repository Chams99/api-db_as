import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Twilio Service
 *
 * Handles all Twilio-related functionality including OTP generation,
 * voice call delivery, and OTP verification. Provides a clean interface
 * for the Twilio API integration.
 */

// Initialize Twilio client with validation
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Validate Twilio credentials
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error('❌ Twilio configuration missing!');
  console.error('Required environment variables:');
  console.error('- TWILIO_ACCOUNT_SID');
  console.error('- TWILIO_AUTH_TOKEN');
  console.error('- TWILIO_PHONE_NUMBER');
  console.error('Please check your .env file and ensure all Twilio credentials are set.');
} else {
  console.log('✅ Twilio configuration loaded:');
  console.log(`   Account SID: ${TWILIO_ACCOUNT_SID.substring(0, 8)}...`);
  console.log(`   Phone Number: ${TWILIO_PHONE_NUMBER}`);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// In-memory OTP storage (replace with database in production)
const otpStore = new Map();

/**
 * Generate a random OTP
 * @param {number} length - Length of the OTP (default: 4)
 * @returns {string} Generated OTP
 */
export function generateOTP(length = 4) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

/**
 * Send OTP via SMS
 * @param {string} phoneNumber - Phone number in international format (e.g., +1234567890)
 * @param {string} otp - OTP to be sent
 * @returns {Promise<Object>} Result of the operation
 */
export async function sendOTPViaSMS(phoneNumber, otp) {
  try {
    // Check if Twilio is properly configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return {
        success: false,
        error: 'Twilio not configured',
        message: 'Twilio credentials are missing. Please check your .env file.'
      };
    }

    console.log(`📱 Attempting to send SMS to: ${phoneNumber} from: ${TWILIO_PHONE_NUMBER}`);

    // Use Messaging Service if available (better for sender names)
    let messageOptions = {
      to: phoneNumber,
      body: `Your verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.`
    };

    // Use Messaging Service if configured (allows custom sender names)
    if (TWILIO_MESSAGING_SERVICE_SID) {
      messageOptions.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
      console.log(`📱 Using Messaging Service: ${TWILIO_MESSAGING_SERVICE_SID}`);
    } else {
      messageOptions.from = TWILIO_PHONE_NUMBER;
      console.log(`📱 Using phone number: ${TWILIO_PHONE_NUMBER}`);
    }

    const message = await client.messages.create(messageOptions);

    return {
      success: true,
      messageSid: message.sid,
      message: 'OTP sent via SMS successfully'
    };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21215) {
      return {
        success: false,
        error: 'Geo-permissions error',
        message: 'International messaging not enabled for this phone number. Please enable international permissions in your Twilio console: https://www.twilio.com/console/voice/calls/geo-permissions/low-risk'
      };
    }
    
    if (error.code === 21266) {
      return {
        success: false,
        error: 'Same number error',
        message: 'Cannot send OTP to the same number used as Twilio sender. Please use a different phone number.'
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send OTP via SMS'
    };
  }
}

/**
 * Send OTP via voice call
 * @param {string} phoneNumber - Phone number in international format (e.g., +1234567890)
 * @param {string} otp - OTP to be sent
 * @returns {Promise<Object>} Result of the operation
 */
export async function sendOTPViaCall(phoneNumber, otp) {
  try {
    // Check if Twilio is properly configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return {
        success: false,
        error: 'Twilio not configured',
        message: 'Twilio credentials are missing. Please check your .env file.'
      };
    }

    console.log(`📞 Attempting to make voice call to: ${phoneNumber} from: ${TWILIO_PHONE_NUMBER}`);

    // Format OTP for voice delivery (e.g., "1234" becomes "1, 2, 3, 4")
    const formattedOTP = otp.split('').join(', ');

    const call = await client.calls.create({
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
      twiml: `<Response><Say voice="alice">Hello! Your verification code is ${formattedOTP}. This code expires in 5 minutes. Goodbye!</Say></Response>`
    });

    return {
      success: true,
      callSid: call.sid,
      message: 'OTP sent via voice call successfully'
    };
  } catch (error) {
    console.error('Twilio call error:', error);
    
    // Handle specific Twilio errors
    if (error.code === 21215) {
      return {
        success: false,
        error: 'Geo-permissions error',
        message: 'International calling not enabled for this phone number. Please enable international permissions in your Twilio console: https://www.twilio.com/console/voice/calls/geo-permissions/low-risk'
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to send OTP via voice call'
    };
  }
}

/**
 * Store OTP with expiration
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to store
 * @param {number} expirationMinutes - Expiration time in minutes (default: 5)
 */
export function storeOTP(phoneNumber, otp, expirationMinutes = 5) {
  const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
  otpStore.set(phoneNumber, {
    otp,
    expiresAt: expirationTime
  });
}

/**
 * Verify OTP
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to verify
 * @returns {Object} Verification result
 */
export function verifyOTP(phoneNumber, otp) {
  const storedData = otpStore.get(phoneNumber);

  if (!storedData) {
    return {
      success: false,
      message: 'No OTP found for this phone number'
    };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phoneNumber);
    return {
      success: false,
      message: 'OTP has expired'
    };
  }

  if (storedData.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP'
    };
  }

  // OTP is valid, remove it from storage
  otpStore.delete(phoneNumber);
  return {
    success: true,
    message: 'OTP verified successfully'
  };
}

/**
 * Clean up expired OTPs from storage
 */
export function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [phoneNumber, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
}

/**
 * Get OTP storage statistics
 * @returns {Object} Storage statistics
 */
export function getOTPStats() {
  return {
    totalStored: otpStore.size,
    storage: Array.from(otpStore.keys())
  };
}

// Clean up expired OTPs every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
