exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
        };
    }

    const API_KEY = process.env.VITE_OPENAI_API_KEY; // Securely stored in Netlify
    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Missing OpenAI API Key" }),
        };
    }

    try {
        const { input } = JSON.parse(event.body);

        const response = await fetch("https://api.openai.com/v1/moderations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ input }),
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error processing moderation request" }),
        };
    }
};
