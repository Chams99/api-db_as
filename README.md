# AI Database Chat Interface

A modern Node.js API that provides an AI-powered chat interface for querying a product database. Built with Express.js, Supabase, and Google's Gemini AI.

## 🚀 Features

- **Natural Language Processing**: Query your database using everyday language
- **Secure Database Access**: Safe SQL query generation and execution
- **RESTful API**: Clean, well-documented endpoints
- **Real-time Responses**: Fast, contextual AI responses
- **Rate Limiting**: Built-in protection against abuse
- **Comprehensive Logging**: Detailed request and error logging
- **Health Monitoring**: Built-in health checks and system statistics

## 📁 Project Structure

```
api_ai_database_access/
├── backend/         # Node.js server and API
│   ├── src/         # Source code
│   ├── package.json
│   └── .env
├── frontend/        # Web interfaces
│   ├── chat-interface.html
│   └── other HTML files
└── README.md
```

## 🏗️ Backend Architecture

```
backend/src/
├── config/          # Database and service configurations
├── controllers/     # Request handlers and business logic
├── middleware/      # Custom middleware functions
├── routes/          # API route definitions
├── services/        # Core business logic services
├── utils/           # Utility functions and helpers
└── server.js        # Main application entry point
```

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Supabase account and project
- Google AI API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd api-ai-database-access
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Database Setup**
   - Create a `itemssssss` table in your Supabase database
   - Use the provided SQL schema from `backend/test_database.sql`
   - Ensure Row Level Security (RLS) is properly configured

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

The server will start on `http://localhost:5000`

### Open the Frontend

1. Navigate to the `frontend/` directory
2. Open `chat-interface.html` in your web browser
3. Start chatting with your database!

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Returns server health status and system information.

### Chat Interface
```http
POST /api/chat
```
Process natural language queries about your database.

**Request Body:**
```json
{
  "message": "Show me all electronics under $100",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "AI generated response with database results",
  "queryUsed": "SELECT * FROM items WHERE category = 'electronics' AND price < 100",
  "results": {
    "success": true,
    "count": 15,
    "data": [...],
    "formattedMessage": "Found 15 items in the electronics category under $100"
  },
  "timestamp": "2025-01-21T10:30:00.000Z"
}
```

### Available Categories
```http
GET /api/chat/categories
```
Returns all available product categories.

### System Statistics
```http
GET /api/chat/stats
```
Provides database and system statistics.

## 🔒 Security Features

- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **SQL Injection Protection**: Safe query generation and validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security Headers**: Automatic security header injection
- **Environment Variable Validation**: Required credentials validation

## 🤖 AI Integration

### Supported Query Types

The AI can handle various types of database queries:

- **Category Filtering**: "Show me all toys"
- **Price Range Queries**: "Find items under $50"
- **Rating Queries**: "Show highly rated electronics"
- **Statistical Queries**: "How many items are in the clothing category?"
- **Search Queries**: "Find items with 'wireless' in the name"

### Query Safety

- Only SELECT queries are allowed
- Queries are validated before execution
- Dangerous SQL operations are blocked
- Database schema is enforced

## 📊 Database Schema

The application works with a `items` table containing:

```sql
CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_date DATE,
    is_active BOOLEAN,
    quantity INT,
    rating DECIMAL(3, 2)
);
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and external API calls
- **Routes**: Define API endpoints
- **Middleware**: Process requests before reaching controllers
- **Config**: Database and service configurations
- **Utils**: Helper functions and utilities

## 📈 Monitoring

The application provides built-in monitoring:

- Request logging with timing information
- Error tracking and reporting
- Health check endpoints
- System resource monitoring
- Database connection status

## 🚨 Error Handling

Comprehensive error handling includes:

- Input validation errors
- Database connection errors
- AI service errors
- Rate limiting errors
- Generic server errors

All errors return appropriate HTTP status codes and user-friendly messages.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (defaults to 5000) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |

### Logging Levels

Set `LOG_LEVEL` to control logging verbosity:
- `ERROR`: Only error messages
- `WARN`: Errors and warnings
- `INFO`: General information (default)
- `DEBUG`: Detailed debug information

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the documentation
- Review the API examples
- Monitor the logs for debugging information
