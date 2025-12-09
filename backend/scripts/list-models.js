
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.error('Missing Gemini API key. Please ensure GEMINI_API_KEY is set in your .env file.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Note: older versions of the SDK might not have listModels or it might be on the client directly
        // If this fails, we'll try to infer from common names

        // For google-generative-ai SDK, referencing the model is usually done via getGenerativeModel
        // but listing might require a different call or might not be exposed easily in the high-level helper.
        // However, usually there is a way.
        // Let's try to access the model list if possible. 
        // If the SDK doesn't support listing easily, this might fail, but worth a shot.
        // Actually, looking at docs, typically:
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        // There isn't always a "listModels" on the instance.

        // Attempting to standard fetch if SDK list method is obscure:
        // API endpoint: https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log('No models found or error response:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
