import { Type } from "@google/genai";
// FIX: Added JobDetails to imports for new functions.
import { GroundingChunk, StrategyTask, IntentRoute, DraftPreparationResult, ChatMessage, FilePart, LatLng, JobDetails } from '../types';

// Centralized, robust error handler for API call errors
function throwEnhancedError(error: unknown, defaultMessage: string): never {
    console.error("API Error:", error);

    let messageToParse: string;
    
    // Attempt to extract a meaningful message from various error types
    if (error instanceof Error) {
        messageToParse = error.message;
    } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
        messageToParse = errorObj.error?.message || errorObj.message || JSON.stringify(error);
    } else {
        messageToParse = String(error);
    }
    
    const lowerCaseMessage = messageToParse.toLowerCase();

    if (lowerCaseMessage.includes('api key not valid')) {
        throw new Error('Invalid API Key. Please check your Cloudflare environment variables.');
    }
    if (lowerCaseMessage.includes('permission_denied')) {
        throw new Error('Permission Denied. Please ensure the Generative Language API is enabled for your project. (Permission Denied)');
    }
    if (lowerCaseMessage.includes('resource_exhausted') || lowerCaseMessage.includes('429')) {
        if (lowerCaseMessage.includes('quota')) {
            throw new Error('You have exceeded your API usage quota. Please check your Google AI Studio account for details. (Quota Exceeded)');
        } else {
            throw new Error('The AI model is currently busy. Please try again in a few moments. (Rate Limit Exceeded)');
        }
    }
    if (lowerCaseMessage.includes('400') || lowerCaseMessage.includes('invalid argument')) {
        throw new Error('There was a problem with the request. Please check the prompt. (Bad Request)');
    }
    if (lowerCaseMessage.includes('500') || lowerCaseMessage.includes('internal error')) {
        throw new Error('The AI service encountered an internal error. Please try again later. (Server Error)');
    }

    throw new Error(messageToParse || defaultMessage);
}

// Generic helper function to call our backend proxy
async function callApi(body: object) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: { message: `API request failed with status ${response.status}` } }));
        throwEnhancedError(errorBody, 'An unknown API error occurred.');
    }
    return response;
}

export async function* generateReportStream(prompt: string): AsyncGenerator<string, void, undefined> {
  const response = await callApi({
      stream: true,
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
  });

  if (!response.body) {
      throw new Error('Streaming response has no body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = '';
  while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last, potentially incomplete line

      for (const line of lines) {
          if (line.startsWith('data: ')) {
              try {
                  const json = JSON.parse(line.substring(6));
                  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  if (text) {
                      yield text;
                  }
              } catch (e) {
                  console.error('Failed to parse stream chunk:', line);
              }
          }
      }
  }
}

export async function generateSearchQuery(documentText: string): Promise<string> {
    const prompt = `Based on the following legal document, generate a short, effective search query (under 10 words) to find a suitable professional in Iran. The query should specify the legal specialty and location if mentioned. Do not add any introduction or explanation, just the query text.
  
  Document:
  ---
  ${documentText}
  ---
  
  Search Query:`;

  try {
    const response = await callApi({
        stream: false,
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            temperature: 0.2,
        },
    });
    const geminiResponse = await response.json();
    return geminiResponse.text.trim().replace(/["']/g, ""); // Remove quotes from the output
  } catch (error) {
    throwEnhancedError(error, 'Failed to generate search query.');
  }
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

async function performSearch(prompt: string, useThinkingMode: boolean, location?: LatLng | null): Promise<SearchResult> {
    const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    
    const tools: any[] = [{googleSearch: {}}];
    if (location) {
        tools.push({googleMaps: {}});
    }

    const config: any = { tools };
    if (useThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await callApi({
      stream: false,
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config,
    });
    
    const geminiResponse = await response.json();

    const text = geminiResponse.text; // The proxy adds this for convenience
    const rawSources = geminiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingChunk[] = rawSources
      .map((chunk: any): GroundingChunk | null => {
        if (chunk.web && chunk.web.uri) {
            return { web: { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri }};
        }
        if (chunk.maps && chunk.maps.uri) {
            return { maps: { uri: chunk.maps.uri, title: chunk.maps.title || chunk.maps.uri }};
        }
        return null;
      })
      .filter((s): s is GroundingChunk => s !== null);

    return { text, sources };
}


export async function findLawyers(prompt: string, location?: LatLng | null): Promise<SearchResult> {
  return performSearch(prompt, false, location);
}

export async function findNotaries(prompt: string, location?: LatLng | null): Promise<SearchResult> {
    return performSearch(prompt, false, location);
}

export async function summarizeNews(prompt: string, useThinkingMode: boolean): Promise<SearchResult> {
    return performSearch(prompt, useThinkingMode);
}

export async function analyzeWebPage(prompt: string, useThinkingMode: boolean): Promise<SearchResult> {
    return performSearch(prompt, useThinkingMode);
}

export async function generateStrategy(goal: string, promptTemplate: string, useThinkingMode: boolean): Promise<StrategyTask[]> {
  const prompt = promptTemplate.replace('{goal}', goal);
  const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        taskName: { type: Type.STRING },
        description: { type: Type.STRING },
        effortPercentage: { type: Type.NUMBER },
        deliverableType: { type: Type.STRING },
        suggestedPrompt: { type: Type.STRING },
      },
      required: ['taskName', 'description', 'effortPercentage', 'deliverableType', 'suggestedPrompt'],
    },
  };
  
  const config: any = {
    responseMimeType: "application/json",
    responseSchema: responseSchema,
  };

  if (useThinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response = await callApi({
    stream: false,
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
    config: config,
  });

  const geminiResponse = await response.json();
  const jsonText = geminiResponse.text.trim();
  const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
  return JSON.parse(cleanJson);
}

export async function getSuggestions(query: string, contextPrompt: string): Promise<string[]> {
  const prompt = `${contextPrompt}: "${query}"`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      }
    },
    required: ['suggestions']
  };
  
  try {
    const response = await callApi({
      stream: false,
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        maxOutputTokens: 150,
        temperature: 0.5,
      },
    });

    const geminiResponse = await response.json();
    const jsonText = geminiResponse.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    const result = JSON.parse(cleanJson);
    
    if (result.suggestions && Array.isArray(result.suggestions)) {
        return result.suggestions.slice(0, 5);
    }
    return [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

export async function prepareDraftFromTask(task: StrategyTask, promptTemplate: string, docTypeOptions: string): Promise<DraftPreparationResult> {
  const prompt = promptTemplate
    .replace('{taskName}', task.taskName)
    .replace('{description}', task.description)
    .replace('{suggestedPrompt}', task.suggestedPrompt)
    .replace('{docTypeOptions}', docTypeOptions);

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      docType: { type: Type.STRING },
      topic: { type: Type.STRING },
      description: { type: Type.STRING },
    },
    required: ['docType', 'topic', 'description'],
  };

  const response = await callApi({
    stream: false,
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  const geminiResponse = await response.json();
  const jsonText = geminiResponse.text.trim();
  const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
  return JSON.parse(cleanJson);
}

export async function routeUserIntent(goal: string, promptTemplate: string): Promise<IntentRoute[]> {
  const prompt = promptTemplate.replace('{goal}', goal);

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        module: { 
          type: Type.STRING,
          enum: ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'notary_finder', 'web_analyzer', 'contract_analyzer', 'evidence_analyzer', 'image_generator', 'corporate_services', 'insurance_services', 'job_assistant']
        },
        confidencePercentage: { type: Type.NUMBER },
        reasoning: { type: Type.STRING },
      },
      required: ['module', 'confidencePercentage', 'reasoning'],
    },
  };
  
  const response = await callApi({
    stream: false,
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });
  
  const geminiResponse = await response.json();
  const jsonText = geminiResponse.text.trim();
  const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
  const parsedResult = JSON.parse(cleanJson);

  if (Array.isArray(parsedResult)) {
      return parsedResult.filter((item: any) => 
          typeof item === 'object' && item !== null &&
          ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'notary_finder', 'web_analyzer', 'contract_analyzer', 'evidence_analyzer', 'image_generator', 'corporate_services', 'insurance_services', 'job_assistant'].includes(item.module)
      ) as IntentRoute[];
  }
  
  throw new Error("Received invalid data structure from AI.");
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

export async function generateChatResponse(history: ChatMessage[]): Promise<ChatResponse> {
    const systemInstruction = `You are 'Dadgar AI', a friendly and professional AI legal assistant for a notary public office in Iran. Your goal is to help users navigate legal topics and understand the services offered.
- Keep your responses concise, clear, and easy to understand for a non-lawyer.
- When asked about a service, briefly explain it and suggest which tool in the app (like 'AI Drafter' or 'Lawyer Finder') could help.
- After every response, you MUST provide three relevant, short, follow-up questions or actions the user might want to take next.
- Your entire output must be a single JSON object matching the requested schema. Do not add any text before or after the JSON.`;

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            reply: { type: Type.STRING },
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            },
        },
        required: ['reply', 'suggestions'],
    };

    const response = await callApi({
        stream: false,
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const geminiResponse = await response.json();
    const jsonText = geminiResponse.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    const parsedResult = JSON.parse(cleanJson);
    
    if (typeof parsedResult.reply === 'string' && Array.isArray(parsedResult.suggestions)) {
        return parsedResult;
    }

    throw new Error("Received invalid data structure from AI for chat.");
}

export async function analyzeContract(
    content: { file?: FilePart; text?: string },
    userQuery: string,
    promptTemplate: string,
    useThinkingMode: boolean
): Promise<string> {
    const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

    const userQuestion = userQuery || 'سوال خاصی پرسیده نشده است.';
    let basePrompt = promptTemplate.replace('{userQuery}', userQuestion);

    const parts: any[] = [];
    if (content.file) {
        parts.push({ text: basePrompt });
        parts.push({ inlineData: { mimeType: content.file.mimeType, data: content.file.data } });
    } else if (content.text) {
        basePrompt += `\n\n${content.text}`;
        parts.push({ text: basePrompt });
    } else {
        throw new Error("No content provided to analyze.");
    }
    
    const contents = { parts };
    
    try {
        const response = await callApi({
            stream: false,
            model,
            contents: [contents],
            config,
        });
        const geminiResponse = await response.json();
        return geminiResponse.text;
    } catch (error) {
        throwEnhancedError(error, 'Failed to analyze contract.');
    }
}

export async function analyzeImage(
    content: { file: FilePart },
    userQuery: string,
    promptTemplate: string,
    useThinkingMode: boolean
): Promise<string> {
    const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const config = useThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

    const userQuestion = userQuery || 'Please analyze this image.';
    const prompt = promptTemplate.replace('{userQuery}', userQuestion);
    
    const parts: any[] = [
        { text: prompt },
        { inlineData: { mimeType: content.file.mimeType, data: content.file.data } }
    ];
    
    const contents = { parts };
    
    try {
        const response = await callApi({
            stream: false,
            model,
            contents: [contents],
            config,
        });
        const geminiResponse = await response.json();
        return geminiResponse.text;
    } catch (error) {
        throwEnhancedError(error, 'Failed to analyze image.');
    }
}

export async function scrapeJobDetails(url: string): Promise<JobDetails> {
  const scrapeResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'scrape', url: url }),
  });

  if (!scrapeResponse.ok) {
      const errorBody = await scrapeResponse.json().catch(() => ({ message: "Scraping failed with no details."}));
      throwEnhancedError(errorBody, 'Failed to scrape job URL.');
  }
  const { html } = await scrapeResponse.json();

  if (!html) {
      throw new Error('Scraped page is empty.');
  }

  const prompt = `Analyze the following HTML from a job posting. Extract the job title, company name, a detailed job description (combine responsibilities, qualifications, etc.), and a list of key skills mentioned.
  HTML:
  ---
  ${html.substring(0, 15000)}
  ---
  Provide the output in a JSON object.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      company: { type: Type.STRING },
      description: { type: Type.STRING },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['title', 'company', 'description', 'skills'],
  };

  try {
    const response = await callApi({
      stream: false,
      model: 'gemini-2.5-pro',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const geminiResponse = await response.json();
    const jsonText = geminiResponse.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
      throwEnhancedError(error, 'Failed to parse job details from page.');
  }
}

export async function syncLinkedInProfile(url: string): Promise<string> {
    const scrapeResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scrape', url }),
    });

    if (!scrapeResponse.ok) {
        throw new Error('Failed to scrape LinkedIn profile.');
    }
    const { html } = await scrapeResponse.json();
    if (!html) {
        throw new Error('Scraped LinkedIn page is empty.');
    }

    const prompt = `
    Analyze the provided HTML of a LinkedIn profile page and extract the user's professional information. 
    Format the output as a clean, well-structured CV in Markdown format. 
    Include the following sections if available:
    - Name (as a main heading)
    - Contact Information (if found, like email or website)
    - Summary / About (as a paragraph)
    - Experience (list each job with title, company, dates, and description/bullet points)
    - Education (list each institution with degree and dates)
    - Skills (as a comma-separated list or bullet points)
    
    Prioritize clarity and professional formatting. Omit any sections that are not found in the HTML.
    
    HTML to parse:
    ---
    ${html.substring(0, 25000)} 
    ---
    
    Formatted CV:
    `;
    
    return generateText(prompt);
}

export async function generateTailoredResume(jobDetails: JobDetails, cv: string): Promise<string> {
    const prompt = `Given the following job details and a user's CV, tailor the CV to better match the job description. Focus on highlighting relevant skills and experiences. Maintain a professional tone and format. Output only the tailored resume text in Markdown format.
    
    Job Title: ${jobDetails.title}
    Company: ${jobDetails.company}
    Job Description: ${jobDetails.description}
    Key Skills Required: ${jobDetails.skills.join(', ')}

    ---
    User's Current CV:
    ---
    ${cv}
    ---
    
    Tailored Resume:`;
    
    return generateText(prompt);
}

export async function generateCoverLetter(jobDetails: JobDetails, cv: string): Promise<string> {
    const prompt = `Based on the following job details and user's CV, write a compelling and professional cover letter. The letter should express strong interest in the role, highlight the most relevant skills and experiences from the CV, and be tailored specifically to the company and job description. Output only the cover letter text in Markdown format.

    Job Title: ${jobDetails.title}
    Company: ${jobDetails.company}
    Job Description: ${jobDetails.description}
    Key Skills Required: ${jobDetails.skills.join(', ')}

    ---
    User's CV to reference:
    ---
    ${cv}
    ---
    
    Cover Letter:`;
    
    return generateText(prompt);
}

export async function sendWhatsAppApproval(applicationId: string, phoneNumber: string): Promise<void> {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'sendWhatsApp',
            applicationId,
            phoneNumber
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to send WhatsApp approval.');
    }
}

export async function applyByEmail(applicationId: string, email: string): Promise<void> {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'sendEmail',
            applicationId,
            email,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to apply by email.');
    }
}


export async function extractTextFromImage(file: FilePart): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = 'Extract all visible text from this document image. Present the text exactly as it appears, preserving formatting and paragraphs as best as possible. Do not add any commentary or explanation.';

    const parts: any[] = [
        { text: prompt },
        { inlineData: { mimeType: file.mimeType, data: file.data } }
    ];

    const contents = { parts };

    try {
        const response = await callApi({
            stream: false,
            model,
            contents: [contents],
        });
        const geminiResponse = await response.json();
        return geminiResponse.text;
    } catch (error) {
        throwEnhancedError(error, 'Failed to extract text from image.');
    }
}


export async function generateImage(prompt: string, aspectRatio: string): Promise<string> {
    try {
        const response = await callApi({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio,
                outputMimeType: 'image/jpeg',
            },
        });
        const geminiResponse = await response.json();
        const base64Image = geminiResponse?.generatedImages?.[0]?.image?.imageBytes;
        if (!base64Image) {
            const errorReason = geminiResponse?.error?.message || "No image data found in API response.";
            throw new Error(errorReason);
        }
        return base64Image;
    } catch (error) {
        throwEnhancedError(error, 'Failed to generate image.');
    }
}

export async function generateText(prompt: string): Promise<string> {
    try {
        const response = await callApi({
            stream: false,
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        const geminiResponse = await response.json();
        return geminiResponse.text.trim();
    } catch (error) {
        throwEnhancedError(error, 'Failed to generate text response.');
    }
}

export async function generateJsonArray(prompt: string): Promise<string[]> {
    try {
        const responseSchema = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        };

        const response = await callApi({
            stream: false,
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const geminiResponse = await response.json();
        const jsonText = geminiResponse.text.trim();
        const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
        const result = JSON.parse(cleanJson);
        
        if (Array.isArray(result)) {
            return result.filter((item): item is string => typeof item === 'string');
        }
        throw new Error("AI did not return a valid JSON array of strings.");
    } catch (error) {
        throwEnhancedError(error, 'Failed to generate JSON array.');
    }
}