import OpenAI from "openai";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const sendMessage = async (messages) => {
    try {
        const response = await fetch(`${BACKEND_URL}/chatgpt`, { // ✅ Now calls the chatgpt function
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Return the AI response
    } catch (error) {
        console.error("Error fetching response from Netlify function:", error);
        return "Error retrieving response.";
    }
};

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,//localdwv
    // apiKey: process.env.VITE_OPENAI_API_KEY,//netlify
    dangerouslyAllowBrowser: true
});

export async function getResponseFromAI(userText, language) {
    const messages = [
        {
            role: 'system',
            content: 'Act as a language translator. Given data and language, translate the text from English to the selected language. If the English provided is not clear or misspelled, ask the user to clarify or correct the English.'
        },
        {
            role: 'user',
            content: `${userText}, ${language}`
        }
    ];
    
    return await sendMessage(messages);
};

export async function aiModerationCheck(text) {
    try {
        const response = await fetch(`${BACKEND_URL}/moderation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: text }),
        });

        if (!response.ok) {
            throw new Error(`Moderation API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const { flagged, categories } = data.results[0];

        return flagged ? categories : null;
    } catch (error) {
        console.error("Error during moderation check:", error);
        return null;
    }
}

