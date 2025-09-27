import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Express Server Setup
 *
 * This server provides a RESTful API for an AI-powered database chat interface.
 * It integrates with Supabase for database operations and Gemini AI for natural language processing.
 *
 * Features:
 * - Secure API endpoints with proper middleware
 * - Rate limiting to prevent abuse
 * - CORS support for web clients
 * - Comprehensive error handling
 * - Clean architecture with separated concerns
 */

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Security Middleware Configuration
 *
 * Helmet: Sets various HTTP security headers
 * CORS: Enables cross-origin requests from web clients
 * Rate Limiting: Prevents API abuse with request throttling
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for web clients
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',')
    : true, // Allow all origins in development
  credentials: true,
}));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the root directory
app.use(express.static(join(__dirname, '..')));

// Serve the main chat interface at the root path
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'chat-interface.html'));
});

/**
 * Health Check Endpoint
 *
 * Provides server status information for monitoring and debugging.
 * Returns server uptime, current time, and basic health status.
 */
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  };

  res.status(200).json(healthCheck);
});

/**
 * API Routes
 *
 * All API endpoints are mounted under /api for better organization.
 * This allows for easy API versioning and separation from static assets.
 */

// Import and mount API routes
import chatRoutes from './routes/chatRoutes.js';
import twilioRoutes from './routes/twilioRoutes.js';

app.use('/api/chat', chatRoutes);
app.use('/api/twilio', twilioRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested path ${req.originalUrl} does not exist on this server`,
    availableRoutes: {
      home: 'GET /',
      health: 'GET /health',
      chat: 'POST /api/chat',
      twilio: {
        sendOTP: 'POST /api/twilio/send-otp',
        verifyOTP: 'POST /api/twilio/verify-otp',
        stats: 'GET /api/twilio/stats'
      }
    }
  });
});

/**
 * Global Error Handler
 *
 * Centralized error handling for all uncaught exceptions and errors.
 * Provides consistent error responses and prevents server crashes.
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong',
    ...(isDevelopment && { stack: err.stack })
  });
});

/**
 * Server Initialization
 *
 * Starts the HTTP server and logs startup information.
 * Gracefully handles shutdown signals for clean server termination.
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`💬 Chat API available at: http://localhost:${PORT}/api/chat`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
