import OpenAI from "openai";

const openai = new OpenAI({
    //apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    apiKey: process.env.VITE_OPENAI_API_KEY,
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
    // Relevant for both inputs and outputs
    const completion = await openai.moderations.create({
        input: text
    });
    const {flagged, categories} = completion.results[0];
    // console.log("flagged", flagged);
    // console.log("categories", categories);
    
    if (flagged) {
        return categories
    }
}
    
function renderWarning(obj) {
    const keys = Object.keys(obj);
    const filtered = keys.filter((key) => obj[key]);
    document.body.innerText = `Your text been flagged for the following reasons: ${filtered.join(", ")}.`
}

