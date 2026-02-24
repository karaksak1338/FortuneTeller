import { GoogleGenerativeAI } from "@google/generative-ai";
import { fallbackManager } from './fallbackManager';
import { TRANSLATIONS } from './translations';

// Initialize Gemini AI
const RAW_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
// Failsafe: Ensure the key isn't a placeholder string or missing
const API_KEY = (RAW_API_KEY && !RAW_API_KEY.includes('VITE_GEMINI_API_KEY')) ? RAW_API_KEY : null;

if (!API_KEY) {
    console.error("❌ Gemini API Key is missing or invalid!", {
        rawExists: !!RAW_API_KEY,
        isPlaceholder: RAW_API_KEY?.includes('VITE_GEMINI_API_KEY'),
        keyLength: RAW_API_KEY?.length
    });
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const getPersona = (lang, personaType) => {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return t.personas[personaType] || t.personas.wise;
};

export const getDailyFortune = (lang = 'en', persona = 'wise') => {
    const baseFortune = fallbackManager.getFallback(lang, 'daily');
    const p = getPersona(lang, persona);
    return `${p.prefix}${baseFortune}${p.suffix}`;
};

export const generateAIFortune = async ({ type, input, image, lang = 'en', persona = 'wise', userData = {} }) => {
    const p = getPersona(lang, persona);

    // Layer 1: Attempt Gemini AI via direct Fetch (v1 stable)
    console.log(`Starting AI Generation (Fetch) - Type: ${type}, Lang: ${lang}, Persona: ${persona}, HasImage: ${!!image}`);

    if (API_KEY) {
        try {
            let prompt = `
                You are a specialized mystical fortune teller persona called "${p.name}".
                System Instructions:
                - Tone: ${persona}
                - Language: ${lang}
                - Context: User is birth date is ${userData.birthDay}/${userData.birthMonth}. Their name is ${userData.name || TRANSLATIONS[lang]?.common.defaultName || 'Seeker'}.
                - Reading Type: ${type}
                
                Requirements:
                - Be mystical and engaging.
                - Never give medical, legal, or financial advice.
                - Keep it under 3 sentences.
                - Start with "${p.prefix}" and end with "${p.suffix}" if it feels natural, or weave their essence into the response.
            `;

            if (type === 'coffee' && image) {
                prompt += `\n- Task: Analyze the coffee grounds/plate in the attached image. Describe unique shapes or symbols you see and interpret them for the user's future.`;
            } else if (type === 'question' && input) {
                prompt += `\n- Additional Input (Question): ${input}`;
            }

            console.log("AI Prompt:", prompt);

            const contents = [{
                parts: [{ text: prompt }]
            }];

            if (image) {
                const base64Data = image.split(',')[1];
                const mimeType = image.split(',')[0].split(':')[1].split(';')[0];
                contents[0].parts.push({
                    inlineData: {
                        mimeType,
                        data: base64Data
                    }
                });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: contents[0].parts.map(p => {
                                if (p.inlineData) {
                                    return {
                                        inline_data: {
                                            mime_type: p.inlineData.mimeType,
                                            data: p.inlineData.data
                                        }
                                    };
                                }
                                return p;
                            })
                        }]
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Gemini API Error details:", errorData);
                throw new Error(`Gemini API Error: ${response.status} - ${errorData?.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log("AI Response Received:", text);

            if (text && text.trim().length > 0) {
                return text;
            } else {
                console.warn("AI returned empty text.");
            }
        } catch (error) {
            console.error("AI Generation Error (Fetch):", error.message);
        }
    }

    // Layer 2 & 3: Fallback Pool & Mystical Ambiguity
    if (Math.random() > 0.8) {
        return fallbackManager.getAmbiguity(lang);
    }

    const fallbackFortune = fallbackManager.getFallback(lang, type);
    return `${p.prefix}${fallbackFortune}${p.suffix}`;
};
