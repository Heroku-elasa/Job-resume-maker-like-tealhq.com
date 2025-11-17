// This is a Cloudflare Pages Function that acts as a serverless backend.
// It will be deployed automatically when placed in the /functions directory.

interface Env {
  GEMINI_API_KEY: string;
}

async function handleGeminiProxy(apiKey: string, body: any) {
    const { model } = body;

    if (model && model.startsWith('imagen')) {
        const { prompt, config } = body;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateImages`;
        const requestBody = { prompt, ...config };

        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify(requestBody),
        });

        const responseText = await geminiResponse.text();
        if (!geminiResponse.ok) {
            return new Response(responseText, { status: geminiResponse.status, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(responseText, { headers: { 'Content-Type': 'application/json' } });

    } else {
        const { stream, contents, config } = body;
        const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${method}`;
        
        const requestBody: any = {
            contents: Array.isArray(contents) ? contents : [{ parts: [{ text: contents }] }]
        };

        if (config) {
            if (config.tools) requestBody.tools = config.tools;
            
            const generationConfig: any = {};
            if (config.temperature) generationConfig.temperature = config.temperature;
            if (config.topK) generationConfig.topK = config.topK;
            if (config.topP) generationConfig.topP = config.topP;
            if (config.maxOutputTokens) generationConfig.maxOutputTokens = config.maxOutputTokens;
            if (config.responseMimeType) generationConfig.responseMimeType = config.responseMimeType;
            if (config.responseSchema) generationConfig.responseSchema = config.responseSchema;
            if (Object.keys(generationConfig).length > 0) requestBody.generationConfig = generationConfig;
            if (config.systemInstruction) requestBody.systemInstruction = { parts: [{ text: config.systemInstruction }] };
            if (config.thinkingConfig) requestBody.thinkingConfig = config.thinkingConfig;
        }

        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify(requestBody),
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            return new Response(errorBody, { status: geminiResponse.status, headers: { 'Content-Type': 'application/json' } });
        }
        
        if (!stream) {
            const responseJson = await geminiResponse.json();
            const text = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const enhancedResponse = { ...responseJson, text };
            return new Response(JSON.stringify(enhancedResponse), { headers: { 'Content-Type': 'application/json' } });
        }

        const responseHeaders = new Headers(geminiResponse.headers);
        responseHeaders.set('Cache-Control', 'no-cache');
        return new Response(geminiResponse.body, { status: geminiResponse.status, headers: responseHeaders });
    }
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
    try {
        const body = await context.request.json() as any;
        const { action } = body;

        switch (action) {
            case 'scrape':
                const { url } = body;
                if (!url) return new Response(JSON.stringify({ error: { message: "URL is required for scraping." } }), { status: 400 });
                
                const scrapeResponse = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                });
                if (!scrapeResponse.ok) {
                    return new Response(JSON.stringify({ error: { message: `Failed to fetch URL with status ${scrapeResponse.status}` } }), { status: scrapeResponse.status });
                }
                const html = await scrapeResponse.text();
                return new Response(JSON.stringify({ html }), { headers: { 'Content-Type': 'application/json' } });

            case 'sendWhatsApp':
            case 'sendEmail':
                // In a real application, this would integrate with Twilio/SMTP services.
                // For this project, we simulate a successful action.
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                return new Response(JSON.stringify({ success: true, message: `Action '${action}' simulated successfully.` }), { headers: { 'Content-Type': 'application/json' } });

            default:
                // Default to Gemini API proxy if no specific action is provided
                return handleGeminiProxy(context.env.GEMINI_API_KEY, body);
        }

    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        return new Response(JSON.stringify({ error: { message: `Proxy Error: ${error.message}` } }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};