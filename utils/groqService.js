const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateProposal(tender) {
    const prompt = `You are an expert proposal writer for IT, Healthcare, Construction, and Defense contracts.
    
Write a professional, compelling executive summary and technical proposal draft for the following tender:
Title: ${tender.title}
Organization: ${tender.org}
Category: ${tender.catLabel}
Requirements: ${tender.reqs.join(', ')}
Description: ${tender.desc}

Structure the proposal with these sections:
1. Executive Summary
2. Understanding of Requirements
3. Proposed Approach
4. Conclusion

Use professional markdown formatting. Make it concise but impactful.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert bid and proposal manager."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant", // Fast and capable model
            temperature: 0.7,
            max_tokens: 1500
        });

        return chatCompletion.choices[0]?.message?.content || "Failed to generate proposal content.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to communicate with AI service.");
    }
}

async function predictWinProbability(tender) {
    const prompt = `You are an AI that predicts the win probability of a government tender for an IT consulting company.
    
Based on the following tender details, output a single JSON object with a "score" (integer between 0 and 100) and a "rationale" (short string). Do not output any markdown or explanation, just the raw JSON.

Tender Title: ${tender.title}
Tender Description: ${tender.desc}
Tender Value: ${tender.value}
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON-only API." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            max_tokens: 150
        });

        const raw = chatCompletion.choices[0]?.message?.content || "{}";
        let data = { score: 75, rationale: "Default score" };
        try {
            data = JSON.parse(raw);
        } catch(e) {
            // fallback if groq outputs extra text
            const match = raw.match(/\{[\s\S]*\}/);
            if(match) data = JSON.parse(match[0]);
        }
        return data;
    } catch (error) {
        console.error("Groq Probability Error:", error);
        return { score: 70, rationale: "Error calculating probability." };
    }
}

async function analyzeTenderDocument(text) {
    const prompt = `You are an AI that analyzes tender/RFP documents for a consulting company.
    
Read the following extracted PDF text from a tender document. Output a single JSON object containing:
- "winProbability": integer between 0 and 100 based on standard IT/Consulting criteria (e.g. strict financial limits might lower score, flexible tech stack might raise it).
- "requirements": an array of strings detailing 3-5 key technical or compliance requirements found in the text.
- "summary": a short paragraph summarizing the purpose of the tender.
- "redFlags": an array of strings detailing 1-2 major risks or strict exclusions.

Document Text (truncated):
${text.substring(0, 15000)} // Pass first 15k chars to stay within Groq limits
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON-only API." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            max_tokens: 500
        });

        const raw = chatCompletion.choices[0]?.message?.content || "{}";
        let data = { 
            winProbability: 75, 
            summary: "Unable to parse summary.", 
            requirements: ["Error reading requirements"], 
            redFlags: [] 
        };
        try {
            data = JSON.parse(raw);
        } catch(e) {
            const match = raw.match(/\{[\s\S]*\}/);
            if(match) data = JSON.parse(match[0]);
        }
        return data;
    } catch (error) {
        console.error("Groq Analysis Error:", error);
        throw new Error("Failed to analyze document with AI.");
    }
}

async function extractTendersFromWebsite(text) {
    const prompt = `You are an AI that extracts tender opportunities from website text.
    
Read the following scraped text from a webpage. Identify any tender announcements, RFPs, RFIs, or government contracts mentioned.
Output a single JSON array of objects. Each object should have:
- "title": Title of the tender
- "description": A short summary (1-2 sentences)
- "deadline": The deadline date if found (or "Not specified")

If no tenders are found, output an empty JSON array: []

Website Text (truncated):
${text.substring(0, 15000)}
`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON-only API." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            max_tokens: 1000
        });

        const raw = chatCompletion.choices[0]?.message?.content || "[]";
        let data = [];
        try {
            data = JSON.parse(raw);
        } catch(e) {
            const match = raw.match(/\[[\s\S]*\]/);
            if(match) data = JSON.parse(match[0]);
        }
        return data;
    } catch (error) {
        console.error("Groq Extraction Error:", error);
        return [];
    }
}

module.exports = { generateProposal, predictWinProbability, analyzeTenderDocument, extractTendersFromWebsite };
