import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const geminiApiKey = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key...\n');

if (!geminiApiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
}

console.log('✅ API Key found in .env file');
console.log(`📝 Key starts with: ${geminiApiKey.substring(0, 10)}...`);
console.log('\n🧪 Testing connection to Gemini API...\n');

async function testGeminiKey() {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);

        // Try with gemini-pro model
        console.log('Testing with model: gemini-pro');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = 'Say "Hello! The API key is working." in one sentence.';
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Gemini API is working!\n');
        console.log('📨 Response from Gemini:');
        console.log(`   "${text}"\n`);
        console.log('✨ Your Gemini API key is valid and working correctly!');

    } catch (error) {
        console.error('❌ FAILED! Error testing Gemini API:\n');
        console.error(`Error Type: ${error.constructor.name}`);
        console.error(`Error Message: ${error.message}\n`);

        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
            console.error('💡 Solution: Your API key appears to be invalid.');
            console.error('   1. Go to https://makersuite.google.com/app/apikey');
            console.error('   2. Create a new API key or verify your existing one');
            console.error('   3. Update GEMINI_API_KEY in your .env file\n');
        } else if (error.message?.includes('404') || error.message?.includes('not found')) {
            console.error('💡 Solution: The model name might be incorrect.');
            console.error('   Try using a different model name like "gemini-1.5-pro" or check available models.\n');
        } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            console.error('💡 Solution: API quota exceeded.');
            console.error('   You may have reached your free tier limit. Check your usage at:');
            console.error('   https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com\n');
        } else {
            console.error('💡 Check your internet connection and API key configuration.\n');
        }

        process.exit(1);
    }
}

testGeminiKey();
