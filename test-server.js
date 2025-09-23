import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Test Server for Twilio HTML Interface
 * 
 * This server serves the twilio-example.html file so you can test
 * the Twilio integration in a browser without CORS issues.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files
app.use(express.static(__dirname));

// Serve the Twilio example page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'twilio-example.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Test server running',
    twilioExample: `http://localhost:${PORT}/twilio-example.html`
  });
});

app.listen(PORT, () => {
  console.log('🧪 Test Server Running!');
  console.log(`📱 Twilio Example: http://localhost:${PORT}/twilio-example.html`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n💡 Make sure your main server is running on port 5000`);
  console.log(`   Start it with: npm start`);
});
