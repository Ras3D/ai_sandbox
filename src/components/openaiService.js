import OpenAI from "openai";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const sendMessage = async (messages) => {
    const response = await fetch(`${BACKEND_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    return data;
};

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    // apiKey: process.env.VITE_OPENAI_API_KEY,
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
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages,
            temperature: 1,
            presence_penalty: 0,
            frequency_penalty: 0,
            max_tokens: 256
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Error retrieving response.";
    }
}

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

    
function renderWarning(obj) {
    const keys = Object.keys(obj);
    const filtered = keys.filter((key) => obj[key]);
    document.body.innerText = `Your text been flagged for the following reasons: ${filtered.join(", ")}.`
}

