
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingChunk, StrategyTask, IntentRoute, DraftPreparationResult, ChatMessage, FilePart, LatLng, JobDetails, ResumeAnalysisItem, ResumeAnalysisResult, JobApplication, JobSearchSuggestion, HiringCandidate } from '../types';

// --- INITIALIZATION ---
// We use the Direct SDK for AI calls to prevent proxy timeouts on long tasks.

// SAFETY CHECK: Prevent app crash if API key is missing (common white-screen cause)
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("CRITICAL ERROR: API_KEY is missing. The app will not function correctly. Please check Cloudflare variables or vite.config.ts.");
}

// Initialize with real key or dummy key to prevent immediate crash on load
const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_API_KEY_CHECK_LOGS' });

// --- HELPER FUNCTIONS ---

/**
 * Safely parses JSON from AI response, handling Markdown code blocks.
 */
function safeJsonParse<T>(text: string, context: string): T {
    try {
        if (!text) return {} as T;
        // Remove markdown code blocks if present
        const cleanedText = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error(`JSON Parse Error in ${context}:`, text);
        throw new Error(`AI returned invalid data format for ${context}.`);
    }
}

/**
 * Proxy caller specifically for Web Scraping (requires backend to bypass CORS).
 */
async function callScrapeProxy(url: string): Promise<string> {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'scrape', url }),
        });

        if (!response.ok) {
            // If proxy fails (likely 500 or 403 for LinkedIn), throw specific error
            if (url.includes('linkedin.com')) {
                throw new Error("LinkedIn Scraping Blocked");
            }
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Scraping failed: ${response.status}`);
        }

        const data = await response.json();
        return data.html || '';
    } catch (error) {
        console.error("Scrape Proxy Error:", error);
        throw error;
    }
}

// --- CORE AI FUNCTIONS ---

export async function* generateReportStream(prompt: string, useThinkingMode: boolean): AsyncGenerator<string, void, undefined> {
    const model = useThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const config: any = {};
    
    if (useThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    try {
        const response = await ai.models.generateContentStream({
            model: model,
            contents: [{ parts: [{ text: prompt }] }],
            config: config
        });

        for await (const chunk of response) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Generate Report Error:", error);
        throw new Error("Failed to generate report. Please check your connection.");
    }
}

export async function generateSearchQuery(documentText: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{ parts: [{ text: `Generate a short search query (under 10 words) for: ${documentText.substring(0, 500)}...` }] }]
        });
        return response.text?.trim().replace(/["']/g, "") || "";
    } catch (e) {
        return "";
    }
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

async function performSearch(prompt: string, useThinkingMode: boolean, location?: LatLng | null): Promise<SearchResult> {
    const model = useThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const tools: any[] = [{ googleSearch: {} }];
    
    // Add Maps grounding if location is provided (and supported by the model/SDK version)
    // Ideally we pass location in toolConfig, but for simplicity/compatibility we append context
    let finalPrompt = prompt;
    if (location) {
        finalPrompt += ` (Context: Latitude ${location.latitude}, Longitude ${location.longitude})`;
    }

    const config: any = { tools };
    if (useThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: [{ parts: [{ text: finalPrompt }] }],
            config
        });

        const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = rawSources.map((chunk: any) => {
            if (chunk.web?.uri) return { web: { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri }};
            return null;
        }).filter(Boolean);

        return { text: response.text || "", sources };
    } catch (error) {
        console.error("Search Error:", error);
        throw new Error("Search failed. Please try again.");
    }
}

export async function findLawyers(prompt: string, location?: LatLng | null) { return performSearch(prompt, false, location); }
export async function findNotaries(prompt: string, location?: LatLng | null) { return performSearch(prompt, false, location); }
export async function summarizeNews(prompt: string, useThinkingMode: boolean) { return performSearch(prompt, useThinkingMode); }
export async function analyzeWebPage(prompt: string, useThinkingMode: boolean) { return performSearch(prompt, useThinkingMode); }

// --- STRUCTURED DATA GENERATION ---

export async function generateStrategy(goal: string, promptTemplate: string, useThinkingMode: boolean): Promise<StrategyTask[]> {
    const prompt = promptTemplate.replace('{goal}', goal);
    const model = useThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    
    const config: any = {
        responseMimeType: "application/json",
        responseSchema: {
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
                required: ['taskName', 'description', 'effortPercentage', 'deliverableType', 'suggestedPrompt']
            }
        }
    };

    if (useThinkingMode) config.thinkingConfig = { thinkingBudget: 32768 };

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config
    });

    return safeJsonParse(response.text || "[]", 'strategy');
}

export async function getSuggestions(query: string, contextPrompt: string): Promise<string[]> {
    const prompt = `${contextPrompt}: "${query}"`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } }
                }
            }
        });
        const parsed = safeJsonParse<{suggestions: string[]}>(response.text || "{}", 'suggestions');
        return parsed.suggestions || [];
    } catch { return []; }
}

export async function prepareDraftFromTask(task: StrategyTask, template: string, options: string): Promise<DraftPreparationResult> {
    const prompt = template.replace('{taskName}', task.taskName)
                           .replace('{description}', task.description)
                           .replace('{suggestedPrompt}', task.suggestedPrompt)
                           .replace('{docTypeOptions}', options);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: { docType: { type: Type.STRING }, topic: { type: Type.STRING }, description: { type: Type.STRING } },
                required: ['docType', 'topic', 'description']
            }
        }
    });
    return safeJsonParse(response.text || "{}", 'draft prep');
}

export async function routeUserIntent(goal: string, template: string): Promise<IntentRoute[]> {
    const prompt = template.replace('{goal}', goal);
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        module: { type: Type.STRING },
                        confidencePercentage: { type: Type.NUMBER },
                        reasoning: { type: Type.STRING }
                    },
                    required: ['module', 'confidencePercentage', 'reasoning']
                }
            }
        }
    });
    return safeJsonParse(response.text || "[]", 'intent routing');
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

export async function generateChatResponse(history: ChatMessage[]): Promise<ChatResponse> {
    const contents = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents,
        config: {
            systemInstruction: "You are Kar-Yab AI, a helpful career and legal assistant. Respond in JSON.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    reply: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['reply', 'suggestions']
            }
        }
    });
    return safeJsonParse(response.text || "{}", 'chat response');
}

// --- MEDIA & ANALYSIS ---

export async function analyzeContract(
    content: { file?: FilePart, text?: string }, 
    query: string, 
    template: string, 
    useThinkingMode: boolean
): Promise<string> {
    const model = useThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const config: any = {};
    if (useThinkingMode) config.thinkingConfig = { thinkingBudget: 32768 };

    const parts: any[] = [{ text: template.replace('{userQuery}', query || 'General analysis') }];
    
    if (content.file) {
        parts.push({ inlineData: { mimeType: content.file.mimeType, data: content.file.data } });
    }
    if (content.text) {
        parts[0].text += `\n\n${content.text}`;
    }

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts }],
        config
    });
    return response.text || "";
}

export async function analyzeImage(
    content: { file: FilePart }, 
    query: string, 
    template: string, 
    useThinkingMode: boolean
): Promise<string> {
    const model = useThinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const config: any = {};
    if (useThinkingMode) config.thinkingConfig = { thinkingBudget: 32768 };

    const response = await ai.models.generateContent({
        model,
        contents: [{ 
            parts: [
                { text: template.replace('{userQuery}', query) },
                { inlineData: { mimeType: content.file.mimeType, data: content.file.data } }
            ] 
        }],
        config
    });
    return response.text || "";
}

export async function extractTextFromDocument(file: FilePart): Promise<string> {
    const prompt = `Extract all visible text from this document. Use markdown for structure (tables, headings). If it's a resume, read strictly column-by-column.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ 
            parts: [
                { text: prompt },
                { inlineData: { mimeType: file.mimeType, data: file.data } }
            ] 
        }]
    });
    return response.text || "";
}

// --- RESUME & JOB ASSISTANT ---

export async function analyzeResume(resumeText: string, criteria: any[], language: 'en' | 'fa' = 'en'): Promise<ResumeAnalysisResult> {
    const outputLang = language === 'fa' ? 'Persian (Farsi)' : 'English';
    const prompt = `Analyze this resume based on the criteria.
Resume Text: ${resumeText.substring(0, 20000)}
Criteria: ${JSON.stringify(criteria)}

IMPORTANT:
1. Evaluate 'status' as 'present', 'implicit', or 'missing'.
2. Provide 'evidence', 'summaryAndRecommendations', and 'predictedJobTitle' strictly in ${outputLang}.
3. Ensure the output is valid JSON.

Output strictly JSON.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Flash is best for large context + speed
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    overallScore: { type: Type.NUMBER },
                    predictedJobTitle: { type: Type.STRING },
                    summaryAndRecommendations: { type: Type.STRING },
                    analysis: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.NUMBER },
                                category: { type: Type.STRING },
                                requirement: { type: Type.STRING },
                                status: { type: Type.STRING, enum: ['present', 'implicit', 'missing'] },
                                evidence: { type: Type.STRING },
                            },
                            required: ['id', 'category', 'requirement', 'status', 'evidence'],
                        },
                    },
                },
                required: ['overallScore', 'predictedJobTitle', 'summaryAndRecommendations', 'analysis'],
            },
            maxOutputTokens: 8192 // Critical for large JSON
        },
    });
    return safeJsonParse(response.text || "{}", 'resume analysis');
}

export async function continueResumeChat(history: ChatMessage[], itemsToClarify: ResumeAnalysisItem[]): Promise<{ reply: string; updatedItem: ResumeAnalysisItem | null }> {
    const systemInstruction = "You are an AI interviewer helping complete a resume.";
    const contents = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    
    // Add context to the last message
    const lastMsg = contents[contents.length - 1];
    lastMsg.parts[0].text += `\n\n[Context: Missing items to ask about: ${JSON.stringify(itemsToClarify.slice(0, 3))}]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    reply: { type: Type.STRING },
                    updatedItem: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                            id: { type: Type.NUMBER },
                            category: { type: Type.STRING },
                            requirement: { type: Type.STRING },
                            status: { type: Type.STRING },
                            evidence: { type: Type.STRING },
                        },
                        required: ['id', 'category', 'requirement', 'status', 'evidence'],
                    },
                },
                required: ['reply'],
            }
        }
    });
    return safeJsonParse(response.text || "{}", 'resume chat');
}

export async function generateImprovedResume(
    originalResume: string,
    analysis: ResumeAnalysisResult,
    chatHistory: ChatMessage[],
    language: 'en' | 'fa'
): Promise<string> {
    const outputLang = language === 'fa' ? 'Persian (Farsi)' : 'English';
    const prompt = `You are an expert Professional Resume Writer.
    
    Your task is to rewrite the user's resume into a HIGHLY PROFESSIONAL, polished, and complete version.
    
    Inputs:
    1. **Original Resume**: ${originalResume.substring(0, 15000)}
    2. **Analysis Gaps**: ${analysis.summaryAndRecommendations}
    3. **Interview Context**: ${JSON.stringify(chatHistory)} (The user may have provided missing details here).
    
    Instructions:
    - Rewrite the resume in **${outputLang}**.
    - Use professional Markdown formatting (Headers, Bullet points, Bold text).
    - Incorporate any new information found in the Interview Context to fill the gaps.
    - Structure it logically: Contact Info (placeholder if missing), Summary, Skills, Experience, Education, Projects.
    - Improve the wording to be action-oriented and impactful.
    
    Output ONLY the Markdown text of the new resume.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }]
    });
    return response.text || "";
}

// --- HIRING ASSISTANT ---

export async function analyzeCandidateMatch(resumeText: string, jobDescription: string): Promise<HiringCandidate> {
    const prompt = `Act as an expert HR Recruiter. Compare the candidate's resume to the job description.
    
    Job Description:
    ${jobDescription.substring(0, 10000)}
    
    Candidate Resume:
    ${resumeText.substring(0, 15000)}
    
    Output a JSON object with:
    - name: Candidate name (extract from resume)
    - matchScore: Number 0-100 indicating fit
    - status: "shortlisted" (>=80), "maybe" (50-79), or "rejected" (<50)
    - summary: 2-3 sentence summary of why they fit or don't fit.
    - keySkills: Array of matching skills found.
    - missingSkills: Array of critical missing skills.
    - interviewQuestions: Array of 3 specific technical/behavioral questions to ask this candidate based on their resume gaps or strengths.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER },
                    status: { type: Type.STRING, enum: ['shortlisted', 'maybe', 'rejected'] },
                    summary: { type: Type.STRING },
                    keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'matchScore', 'status', 'summary', 'keySkills', 'missingSkills', 'interviewQuestions']
            }
        }
    });
    
    const result = safeJsonParse<Partial<HiringCandidate>>(response.text || "{}", 'candidate analysis');
    return {
        id: "", // Will be assigned by caller
        fileName: "", // Will be assigned by caller
        resumeText: "", // Will be assigned by caller
        name: result.name || "Unknown Candidate",
        matchScore: result.matchScore || 0,
        status: (result.status as any) || 'pending',
        summary: result.summary || "No summary available.",
        keySkills: result.keySkills || [],
        missingSkills: result.missingSkills || [],
        interviewQuestions: result.interviewQuestions || []
    };
}

// --- SCRAPING (VIA PROXY & MOCK) ---

export async function scrapeJobDetails(url: string): Promise<JobDetails> {
    const html = await callScrapeProxy(url);
    if (!html) throw new Error("Scraped content is empty");

    const prompt = `Extract job details from HTML: title, company, description, skills. JSON output.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }, { text: html.substring(0, 20000) }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    description: { type: Type.STRING },
                    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'company', 'description', 'skills'],
            }
        }
    });
    return safeJsonParse(response.text || "{}", 'job scrape');
}

const MOCK_PROFILE_DEV = `
# Ali Rezaei
Software Engineer | React | Node.js

## Summary
Experienced Full Stack Developer with 5 years of experience building scalable web applications. Passionate about AI and clean code.

## Experience
**Senior Developer @ TechCorp**
*2021 - Present*
- Led migration to React 18.
- Improved performance by 40%.

**Junior Developer @ StartupInc**
*2019 - 2021*
- Built REST APIs using Express.
- Managed PostgreSQL database.

## Education
**B.S. Computer Science**
*University of Tehran, 2015-2019*

## Skills
- JavaScript, TypeScript, React, Next.js
- Node.js, Python, SQL
- Git, Docker, AWS
`;

const MOCK_PROFILE_PM = `
# Sara Mohammadi
Product Manager | Fintech | Agile

## Summary
Strategic Product Manager with 7 years of experience launching successful mobile apps. 

## Experience
**Product Manager @ FinTech Pay**
*2020 - Present*
- Launched mobile wallet app reaching 1M users.
- Increased user retention by 25% through data-driven features.

**Associate PM @ ShopOnline**
*2017 - 2020*
- Managed backlog for e-commerce platform.
- Conducted A/B testing to optimize checkout flow.

## Education
**MBA**
*Sharif University of Technology, 2015-2017*

## Skills
- Product Strategy, Roadmapping
- Agile/Scrum, JIRA
- User Research, Data Analysis
`;

export async function syncLinkedInProfile(url: string): Promise<string> {
    // 1. Check for specific Demo URLs to return high-quality mocks
    if (url.includes('demo-software-engineer')) return MOCK_PROFILE_DEV;
    if (url.includes('demo-product-manager')) return MOCK_PROFILE_PM;

    // 2. Try Proxy (likely to fail for real LinkedIn due to anti-bot)
    try {
        const html = await callScrapeProxy(url);
        if (!html) throw new Error("Profile content is empty");

        const prompt = `Extract CV data from LinkedIn HTML. Format as Markdown CV.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }, { text: html.substring(0, 25000) }] }]
        });
        
        let text = response.text || "";
        // Clean up markdown code blocks if present
        text = text.replace(/```markdown/gi, '').replace(/```/g, '').trim();
        return text;

    } catch (e: any) {
        // 3. Fail gracefully with educational content about scraping restrictions
        console.warn("LinkedIn Scraping failed. Returning educational error.");
        
        throw new Error(
            `LinkedIn Scraping Failed (Restricted).\n\n` +
            `Direct scraping of LinkedIn profiles is blocked by their Terms of Service. ` +
            `For a production app, you would need a backend service using libraries like 'linkedin-scraper' or 'Proxycurl'.\n\n` +
            `**Safe Alternative for this Demo:**\n` +
            `1. Use the 'Demo Profile' buttons above.\n` +
            `2. Or Save your profile as PDF and upload it.`
        );
    }
}

export async function generateTailoredResume(jobDetails: JobDetails, cv: string): Promise<string> {
    const prompt = `Tailor this CV for the job.\nJob: ${JSON.stringify(jobDetails)}\nCV: ${cv}`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }]
    });
    return response.text || "";
}

export async function generateCoverLetter(jobDetails: JobDetails, cv: string): Promise<string> {
    const prompt = `Write a cover letter for this job using the CV.\nJob: ${JSON.stringify(jobDetails)}\nCV: ${cv}`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }]
    });
    return response.text || "";
}

export async function chatWithJobCoach(history: ChatMessage[], application: JobApplication): Promise<string> {
    const systemInstruction = `You are an AI Career Coach. 
    Job: ${application.jobTitle} at ${application.company}.
    Context: ${application.jobDescription.substring(0, 1000)}...
    Resume Draft: ${application.tailoredResume.substring(0, 1000)}...`;

    const contents = history.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents,
        config: { systemInstruction }
    });
    return response.text || "";
}

export async function suggestJobSearches(resumeText: string): Promise<JobSearchSuggestion[]> {
    const prompt = `Analyze this resume and suggest 3 specific job search strategies/queries to find relevant open positions.
    Resume: ${resumeText.substring(0, 5000)}...
    
    Output JSON array of objects:
    {
        "jobTitle": "Specific Job Title",
        "keywords": ["keyword1", "keyword2"],
        "reasoning": "Why this fits"
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        jobTitle: { type: Type.STRING },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        reasoning: { type: Type.STRING }
                    },
                    required: ['jobTitle', 'keywords', 'reasoning']
                }
            }
        }
    });
    return safeJsonParse(response.text || "[]", 'job search suggestions');
}

// --- UTILS & PLACEHOLDERS ---

export async function generateImage(prompt: string, aspectRatio: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, aspectRatio: aspectRatio, outputMimeType: 'image/jpeg' },
        });
        return response.generatedImages?.[0]?.image?.imageBytes || "";
    } catch (e) {
        console.error("Image Gen Error:", e);
        return "";
    }
}

export async function generateText(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }]
    });
    return response.text || "";
}

export async function generateJsonArray(prompt: string): Promise<string[]> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    });
    return safeJsonParse(response.text || "[]", 'json array');
}

export async function checkApiHealth(): Promise<boolean> {
    try {
        await generateText("ping");
        return true;
    } catch { return false; }
}

// Placeholder functions for actions that would require a real backend integration
export async function sendWhatsAppApproval(applicationId: string, phoneNumber: string): Promise<void> { await new Promise(r => setTimeout(r, 1000)); }
export async function applyByEmail(applicationId: string, email: string): Promise<void> { await new Promise(r => setTimeout(r, 1000)); }
