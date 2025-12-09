# Backend - AI Database Chat API

Node.js backend server providing AI-powered database chat functionality.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Ensure `.env` file has required credentials:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY`

3. **Run the server**
   ```bash
   npm run dev    # Development mode
   npm start      # Production mode
   ```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Chat with AI
- `GET /api/chat/categories` - Get categories
- `GET /api/chat/stats` - System stats

## 🧪 Testing

```bash
npm run test        # Run test server
npm run test:twilio # Test Twilio integration
```

## 📁 Structure

```
backend/
├── src/
│   ├── config/      # Database configuration
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Validation & security
│   ├── routes/      # API routes
│   ├── services/    # Business logic (AI, DB)
│   └── utils/       # Helper functions
├── package.json
└── .env
```

## 🔒 Security

- Rate limiting: 100 requests/15 min
- SQL injection protection
- Input validation
- CORS & Helmet security headers

For full documentation, see the root README.md
