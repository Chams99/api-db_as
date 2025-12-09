
async function testChat() {
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Show me all categories',
                conversationHistory: []
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Results Count:', data.results ? data.results.count : 0);
        console.log('Results:', JSON.stringify(data.results ? data.results.data : [], null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testChat();
