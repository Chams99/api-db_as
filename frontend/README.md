# Frontend - AI Database Chat Interfaces

Web interfaces for interacting with the AI Database Chat API.

## 🎨 Available Interfaces

### `chat-interface.html`
Main chat interface with beautiful UI for natural language database queries.

**Features:**
- Modern gradient design
- Real-time typing indicators
- Quick action buttons
- Connection status monitoring
- Auto-scrolling messages

### `example-usage.html`
Basic API usage examples and demonstrations.

### `twilio-example.html`
SMS integration demo using Twilio.

### `twilio-verify-example.html`
Phone verification demo using Twilio Verify.

## 🚀 How to Use

1. **Start the backend server first**
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Open any HTML file in your browser**
   - Simply double-click the HTML file, or
   - Right-click → Open with → Your browser

3. **Start chatting!**
   - The interface connects to `http://localhost:5000`
   - Try queries like:
     - "Show me all electronics under $100"
     - "What categories do you have?"
     - "Find highly rated items"

## 🔧 Configuration

All interfaces are configured to connect to:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

If your backend runs on a different port, update this value in the HTML files.

## 📱 Mobile Responsive

All interfaces are mobile-friendly and responsive.

## 🎯 Main Interface

For the best experience, use **`chat-interface.html`** - it has the most polished UI and features.
