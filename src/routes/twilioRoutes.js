import express from 'express';
import { sendOTP, verifyOTPCode, getStats, sendOTPVerify, verifyOTPCodeVerify as verifyOTPCodeVerifyAPI } from '../controllers/twilioController.js';

/**
 * Twilio Routes
 *
 * Defines all API endpoints related to Twilio functionality.
 * These routes handle OTP generation, voice call delivery, and verification.
 */

const router = express.Router();

/**
 * POST /api/twilio/send-otp
 *
 * Sends an OTP via voice call to the specified phone number.
 * The OTP is generated randomly and stored with a 5-minute expiration.
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
router.post('/send-otp', sendOTP);

/**
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
router.post('/verify-otp', verifyOTPCode);

/**
 * GET /api/twilio/stats
 *
 * Returns statistics about stored OTPs (for debugging and monitoring).
 * Useful for system administration and troubleshooting.
 *
 * Response:
 * {
 *   "success": true,
 *   "stats": {
 *     "totalStored": 2,
 *     "storage": ["+1234567890", "+0987654321"]
 *   }
 * }
 */
router.get('/stats', getStats);

/**
 * POST /api/twilio/send-otp-verify
 *
 * Sends an OTP using Twilio's Verify API (recommended for production).
 * Provides better deliverability, fraud protection, and rate limiting.
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
router.post('/send-otp-verify', sendOTPVerify);

/**
 * POST /api/twilio/verify-otp-verify
 *
 * Verifies an OTP using Twilio's Verify API.
 * Provides better security and fraud protection.
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
router.post('/verify-otp-verify', verifyOTPCodeVerifyAPI);

export default router;
