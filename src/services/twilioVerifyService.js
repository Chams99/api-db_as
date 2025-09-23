import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Twilio Verify Service
 *
 * Uses Twilio's Verify API for OTP verification.
 * This is the recommended approach for OTP verification as it handles
 * rate limiting, fraud protection, and better deliverability.
 */

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// Validate Twilio credentials
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !VERIFY_SERVICE_SID) {
  console.error('❌ Twilio Verify configuration missing!');
  console.error('Required environment variables:');
  console.error('- TWILIO_ACCOUNT_SID');
  console.error('- TWILIO_AUTH_TOKEN');
  console.error('- TWILIO_VERIFY_SERVICE_SID');
  console.error('Please check your .env file and ensure all Twilio credentials are set.');
} else {
  console.log('✅ Twilio Verify configuration loaded:');
  console.log(`   Account SID: ${process.env.TWILIO_ACCOUNT_SID.substring(0, 8)}...`);
  console.log(`   Verify Service SID: ${VERIFY_SERVICE_SID}`);
}

/**
 * Send OTP using Twilio Verify API
 * @param {string} phoneNumber - Phone number in international format
 * @param {string} channel - 'sms' or 'call'
 * @returns {Promise<Object>} Result of the operation
 */
export async function sendOTPViaVerify(phoneNumber, channel = 'sms') {
  try {
    if (!VERIFY_SERVICE_SID) {
      return {
        success: false,
        error: 'Verify Service not configured',
        message: 'TWILIO_VERIFY_SERVICE_SID is missing from environment variables'
      };
    }

    console.log(`📱 Sending OTP via ${channel} to: ${phoneNumber}`);

    const verification = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: phoneNumber,
        channel: channel
      });

    return {
      success: true,
      verificationSid: verification.sid,
      message: `OTP sent via ${channel} successfully`
    };

  } catch (error) {
    console.error('Twilio Verify error:', error);
    
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
      message: `Failed to send OTP via ${channel}`
    };
  }
}

/**
 * Verify OTP using Twilio Verify API
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP to verify
 * @returns {Promise<Object>} Verification result
 */
export async function verifyOTPCodeAPI(phoneNumber, otp) {
  try {
    if (!VERIFY_SERVICE_SID) {
      return {
        success: false,
        error: 'Verify Service not configured',
        message: 'TWILIO_VERIFY_SERVICE_SID is missing from environment variables'
      };
    }

    console.log(`🔍 Verifying OTP for: ${phoneNumber}`);

    const verificationCheck = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: otp
      });

    if (verificationCheck.status === 'approved') {
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

  } catch (error) {
    console.error('Twilio Verify check error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to verify OTP'
    };
  }
}
