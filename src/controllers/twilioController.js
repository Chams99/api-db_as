import { generateOTP, sendOTPViaCall, sendOTPViaSMS, storeOTP, verifyOTP, getOTPStats } from '../services/twilioService.js';
import { sendOTPViaVerify, verifyOTPCodeAPI } from '../services/twilioVerifyService.js';
import { validatePhoneNumber } from '../middleware/validation.js';

/**
 * Twilio Controller
 *
 * Handles all Twilio-related API endpoints including OTP generation,
 * voice call delivery, and OTP verification. Provides comprehensive
 * error handling and validation for all Twilio operations.
 */

/**
 * Send OTP via voice call
 * POST /api/twilio/send-otp
 * 
 * Generates a random OTP and sends it via voice call to the specified phone number.
 * The OTP is stored temporarily with a 5-minute expiration.
 * 
 * Request Body:
 * {
 *   "phone": "+1234567890" // International format required
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "OTP sent via voice call successfully",
 *   "callSid": "CA1234567890abcdef"
 * }
 */
export async function sendOTP(req, res) {
  try {
    const { phone } = req.body;

    // Validate phone number format
    if (!phone || !validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number in international format is required (e.g., +1234567890)'
      });
    }

    // Check if trying to send to the same number as Twilio number (might cause issues)
    // Normalize both numbers for comparison (remove spaces, ensure consistent formatting)
    const normalizedPhone = phone.replace(/\s/g, '');
    const normalizedTwilioNumber = process.env.TWILIO_PHONE_NUMBER?.replace(/\s/g, '');
    
    if (normalizedPhone === normalizedTwilioNumber) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send OTP to the same number used as Twilio sender. Please use a different phone number.',
        details: `You're trying to send to: ${phone}, but this is your Twilio sender number: ${process.env.TWILIO_PHONE_NUMBER}`
      });
    }

    // Generate OTP
    const otp = generateOTP(4);
    
    // Try SMS first (often has fewer restrictions), then fall back to voice call
    let result = await sendOTPViaSMS(phone, otp);
    let deliveryMethod = 'SMS';
    
    // If SMS fails due to geo-permissions, try voice call
    if (!result.success && result.error === 'Geo-permissions error') {
      console.log('SMS failed due to geo-permissions, trying voice call...');
      result = await sendOTPViaCall(phone, otp);
      deliveryMethod = 'voice call';
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    // Store OTP with 5-minute expiration
    storeOTP(phone, otp, 5);

    res.json({
      success: true,
      message: `OTP sent via ${deliveryMethod} successfully`,
      ...(result.callSid && { callSid: result.callSid }),
      ...(result.messageSid && { messageSid: result.messageSid })
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while sending OTP',
      ...(process.env.NODE_ENV === 'development' && { 
        code: error.code,
        details: error.message 
      })
    });
  }
}

/**
 * Verify OTP
 * POST /api/twilio/verify-otp
 * 
 * Verifies the provided OTP against the stored OTP for the given phone number.
 * The OTP is automatically removed after successful verification.
 * 
 * Request Body:
 * {
 *   "phone": "+1234567890",
 *   "otp": "1234"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "OTP verified successfully"
 * }
 */
export async function verifyOTPCode(req, res) {
  try {
    const { phone, otp } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number in international format is required'
      });
    }

    if (!/^\d{4}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 4-digit number'
      });
    }

    // Verify OTP
    const result = verifyOTP(phone, otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Get OTP statistics
 * GET /api/twilio/stats
 * 
 * Returns statistics about stored OTPs (for debugging and monitoring).
 * 
 * Response:
 * {
 *   "totalStored": 2,
 *   "storage": ["+1234567890", "+0987654321"]
 * }
 */
export async function getStats(req, res) {
  try {
    const stats = getOTPStats();
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get OTP stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving OTP statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Send OTP using Twilio Verify API
 * POST /api/twilio/send-otp-verify
 * 
 * Uses Twilio's Verify API for better OTP delivery and verification.
 * This is the recommended approach for production OTP systems.
 * 
 * Request Body:
 * {
 *   "phone": "+1234567890",
 *   "channel": "sms" // or "call"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "OTP sent via sms successfully",
 *   "verificationSid": "VE1234567890abcdef"
 * }
 */
export async function sendOTPVerify(req, res) {
  try {
    const { phone, channel = 'sms' } = req.body;

    // Validate phone number format
    if (!phone || !validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number in international format is required (e.g., +1234567890)'
      });
    }

    // Check if trying to send to the same number as Twilio number
    const normalizedPhone = phone.replace(/\s/g, '');
    const normalizedTwilioNumber = process.env.TWILIO_PHONE_NUMBER?.replace(/\s/g, '');
    
    if (normalizedPhone === normalizedTwilioNumber) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send OTP to the same number used as Twilio sender. Please use a different phone number.',
        details: `You're trying to send to: ${phone}, but this is your Twilio sender number: ${process.env.TWILIO_PHONE_NUMBER}`
      });
    }

    // Validate channel
    if (!['sms', 'call'].includes(channel)) {
      return res.status(400).json({
        success: false,
        message: 'Channel must be either "sms" or "call"'
      });
    }

    // Send OTP using Twilio Verify API
    const result = await sendOTPViaVerify(phone, channel);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: result.message,
      verificationSid: result.verificationSid
    });

  } catch (error) {
    console.error('Send OTP Verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Verify OTP using Twilio Verify API
 * POST /api/twilio/verify-otp-verify
 * 
 * Verifies the provided OTP using Twilio's Verify API.
 * 
 * Request Body:
 * {
 *   "phone": "+1234567890",
 *   "otp": "1234"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "OTP verified successfully"
 * }
 */
export async function verifyOTPCodeVerify(req, res) {
  try {
    const { phone, otp } = req.body;

    // Validate input
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid phone number in international format is required'
      });
    }

    if (!/^\d{4,8}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 4-8 digit number'
      });
    }

    // Verify OTP using Twilio Verify API
    const result = await verifyOTPCodeAPI(phone, otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
