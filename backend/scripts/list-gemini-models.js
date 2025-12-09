import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: './.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
}

console.log('🔍 Fetching available Gemini models...\n');

async function listModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error('❌ API Error:', data.error.message);
            return;
        }

        if (!data.models || data.models.length === 0) {
            console.log('⚠️  No models found');
            return;
        }

        let output = '✅ Available Models:\n\n';

        data.models.forEach((model, index) => {
            output += `${index + 1}. ${model.name}\n`;
            if (model.displayName) {
                output += `   Display Name: ${model.displayName}\n`;
            }
            if (model.description) {
                output += `   Description: ${model.description}\n`;
            }
            if (model.supportedGenerationMethods) {
                output += `   Supported Methods: ${model.supportedGenerationMethods.join(', ')}\n`;
            }
            output += '\n';
        });

        // Find models that support generateContent
        const contentModels = data.models.filter(m =>
            m.supportedGenerationMethods?.includes('generateContent')
        );

        if (contentModels.length > 0) {
            output += '\n📝 Models supporting generateContent (for chat):\n';
            contentModels.forEach(m => {
                output += `   - ${m.name}\n`;
            });

            // Recommend the best model
            const recommended = contentModels.find(m =>
                m.name.includes('gemini-2.0-flash') ||
                m.name.includes('gemini-1.5-flash') ||
                m.name.includes('gemini-1.5-pro')
            ) || contentModels[0];

            output += `\n💡 Recommended model for your app: ${recommended.name}\n`;
        }

        // Save to file
        fs.writeFileSync('./docs/gemini-models.txt', output);
        console.log(output);
        console.log('\n📄 Full output saved to: gemini-models.txt');

    } catch (error) {
        console.error('❌ Error fetching models:', error.message);
    }
}

listModels();
