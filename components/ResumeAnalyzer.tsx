
// ... existing imports ...
// (imports remain the same, just showing the change in the render method)
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { marked } from 'marked';
import { produce } from 'immer';
import { ResumeAnalysisItem, ChatMessage, useLanguage, ResumeAnalysisStatus, FilePart, ResumeAnalysisResult, JobSearchSuggestion } from '../types';
import { extractTextFromDocument, generateImprovedResume, syncLinkedInProfile, suggestJobSearches } from '../services/geminiService';
import { RESUME_ANALYSIS_CRITERIA } from '../constants';
import DocumentDisplay from './ReportDisplay';

const MAX_FILE_SIZE_MB = 10;

const DEMO_RESUME_DEV = `
Ali Rezayi
Software Engineer
Tehran, Iran | +98 912 345 6789 | ali.rezayi@example.com

SUMMARY
Dedicated Software Engineer with 5+ years of experience designing and developing scalable web applications. Proficient in JavaScript, React, Node.js, and Python. Strong problem-solving skills and a passion for clean, maintainable code.

EXPERIENCE
Senior Frontend Developer | TechCorp, Tehran
2021 – Present
- Led a team of 5 developers in migrating a legacy monolith to a micro-frontend architecture using React and Webpack.
- Improved application load time by 40% through code splitting and lazy loading.
- Mentored junior developers and conducted code reviews to ensure best practices.

Web Developer | WebSolutions Inc., Isfahan
2018 – 2021
- Developed responsive websites for diverse clients using HTML5, CSS3, and JavaScript.
- Collaborated with designers to implement pixel-perfect UIs.
- Integrated RESTful APIs and optimized database queries for better performance.

EDUCATION
Bachelor of Science in Computer Engineering
Sharif University of Technology, Tehran
2014 – 2018

SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, HTML, CSS
- Frameworks: React, Next.js, Node.js, Express
- Tools: Git, Docker, Webpack, Jira
- Soft Skills: Team Leadership, Problem Solving, Communication
`;

const DEMO_RESUME_MANAGER = `
Sara Mohammadi
Product Manager
Tehran, Iran | +98 912 987 6543 | sara.mohammadi@example.com

SUMMARY
Results-oriented Product Manager with 7 years of experience in the fintech and e-commerce sectors. Proven track record of launching successful products, driving user growth, and leading cross-functional teams. Adept at agile methodologies and data-driven decision-making.

EXPERIENCE
Product Manager | FinTech Pay, Tehran
2020 – Present
- Defined product roadmap and strategy for a new mobile payment wallet, achieving 1M+ downloads in the first year.
- Conducted market research and user interviews to identify pain points and opportunities.
- Collaborated with engineering, design, and marketing teams to ensure timely product delivery.

Associate Product Manager | ShopOnline, Shiraz
2017 – 2020
- Managed the product backlog and prioritized features based on business value and customer feedback.
- Analyzed key performance indicators (KPIs) to monitor product health and identify areas for improvement.
- Facilitated sprint planning, daily stand-ups, and retrospectives.

EDUCATION
Master of Business Administration (MBA)
University of Tehran
2015 – 2017

Bachelor of Science in Industrial Engineering
Amirkabir University of Technology
2011 – 2015

SKILLS
- Product Management: Roadmapping, User Stories, A/B Testing, Agile/Scrum
- Tools: Jira, Trello, Google Analytics, Figma
- Soft Skills: Strategic Thinking, Stakeholder Management, Leadership
`;

interface ResumeAnalyzerProps {
    resumeText: string;
    analysisResult: ResumeAnalysisResult | null;
    chatHistory: ChatMessage[];
    onAnalyze: (resumeText: string) => void;
    onChat: (userMessage: string) => void;
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const fileToBase64 = (file: File): Promise<string> => 
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.substring(result.indexOf(',') + 1)); 
    };
    reader.onerror = error => reject(error);
  });

const fileToText = (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
             const reader = new FileReader();
             reader.onload = async (e) => {
                 const arrayBuffer = e.target?.result;
                 if (arrayBuffer) {
                     try {
                         const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
                         resolve(result.value);
                     } catch (err) {
                         reject(err);
                     }
                 } else {
                     reject(new Error("Failed to read DOCX file."));
                 }
             };
             reader.onerror = (error) => reject(error);
             reader.readAsArrayBuffer(file);
        } else if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
            try {
                const base64Data = await fileToBase64(file);
                const filePart: FilePart = { mimeType: file.type, data: base64Data };
                const text = await extractTextFromDocument(filePart);
                resolve(text);
            } catch (err) {
                reject(err);
            }
        } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        } else {
            reject(new Error("UNSUPPORTED_FILE_TYPE"));
        }
    });
};

const AnalysisSummary: React.FC<{ result: ResumeAnalysisResult }> = ({ result }) => {
    const { t } = useLanguage();
    const score = result?.overallScore || 0;
    const circumference = 2 * Math.PI * 15.9155;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = () => {
        if (score < 50) return 'stroke-red-500';
        if (score < 75) return 'stroke-yellow-400';
        return 'stroke-green-500';
    };
    
    const [summaryHtml, setSummaryHtml] = useState('');
    useEffect(() => {
        let isMounted = true;
        const parse = async () => {
            if (result?.summaryAndRecommendations) {
                const html = await marked.parse(result.summaryAndRecommendations);
                if (isMounted) setSummaryHtml(html);
            }
        };
        parse();
        return () => { isMounted = false; };
    }, [result?.summaryAndRecommendations]);

    if (!result) return null;

    return (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
                    <p className="text-sm font-medium text-gray-600">{t('resumeAnalyzer.overallScore')}</p>
                    <div className="relative w-32 h-32 mt-2">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" strokeWidth="2.5"></path>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-out ${getScoreColor()}`}
                                strokeWidth="2.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                transform="rotate(-90 18 18)"
                            ></path>
                        </svg>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-teal-dark">{score}</span>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">{t('resumeAnalyzer.predictedRole')}</p>
                    <h4 className="text-2xl font-bold text-teal-blue mt-1">{result.predictedJobTitle}</h4>
                    <div className="mt-4 prose prose-sm max-w-none text-gray-700 text-left" dangerouslySetInnerHTML={{ __html: summaryHtml }}/>
                </div>
            </div>
        </div>
    );
};

const ProgressBar: React.FC<{ 
    isParsing: boolean, 
    isLoading: boolean, 
    analysisResult: any, 
    error: any, 
    hasResumeText: boolean, 
    t: (key: string) => string 
}> = ({ isParsing, isLoading, analysisResult, error, hasResumeText, t }) => {
    const stages = [
        { key: 'upload', label: t('resumeAnalyzer.progressBar.upload') },
        { key: 'parse', label: t('resumeAnalyzer.progressBar.parse') },
        { key: 'analyze', label: t('resumeAnalyzer.progressBar.analyze') },
        { key: 'complete', label: t('resumeAnalyzer.progressBar.complete') },
    ];

    let currentStageIndex = 0;
    if (analysisResult) {
        currentStageIndex = 3;
    } else if (isLoading) {
        currentStageIndex = 2;
    } else if (hasResumeText) {
        // Text is ready, waiting for analysis
        currentStageIndex = 1; // Parse is technically "done", so we are at the start of Analyze
    } else if (isParsing) {
        currentStageIndex = 1;
    } else {
        currentStageIndex = 0;
    }

    // Adjust for visualization: If waiting for analysis (hasText), we want Parse to be colored as done
    const effectiveIndex = hasResumeText && !isLoading && !analysisResult ? 1.5 : currentStageIndex;

    return (
        <div className="w-full px-4 sm:px-0 mb-8">
            <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
                 <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-teal-500 rounded-full -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (Math.floor(effectiveIndex) / (stages.length - 1)) * 100 + (effectiveIndex % 1 === 0.5 ? 12 : 0))}%` }}
                ></div>
                
                {stages.map((stage, index) => {
                    const isCompleted = index < effectiveIndex;
                    const isCurrent = index === Math.floor(effectiveIndex) || (index === Math.ceil(effectiveIndex) && effectiveIndex % 1 === 0.5);
                    const isPending = index > effectiveIndex;
                    const isActualLoading = isLoading && index === 2;
                    
                    return (
                        <div key={stage.key} className="flex flex-col items-center">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10
                                ${isCompleted ? 'bg-teal-500 border-teal-500 text-white scale-110' : ''}
                                ${isCurrent && !isCompleted ? 'bg-white border-teal-500 text-teal-500 scale-125 ring-4 ring-teal-100' : ''}
                                ${isPending ? 'bg-white border-gray-300 text-gray-400' : ''}
                                ${error && isCurrent ? 'border-red-500 text-red-500 ring-red-100' : ''}
                            `}>
                                {isCompleted ? (
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : isActualLoading || (isParsing && index === 1) ? (
                                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <span className={`
                                mt-2 text-xs font-medium transition-colors duration-300
                                ${isCurrent || isCompleted ? 'text-teal-800' : 'text-gray-400'}
                                ${error && isCurrent ? 'text-red-600' : ''}
                            `}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AIThoughts: React.FC<{ isLoading: boolean, language: 'en' | 'fa' }> = ({ isLoading, language }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(true);
    const [simulatedCriteria, setSimulatedCriteria] = useState(
        RESUME_ANALYSIS_CRITERIA.map(c => ({ ...c, status: 'pending' }))
    );
    const [currentIndex, setCurrentIndex] = useState(-1);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading) {
            setIsOpen(true);
            const initialCriteria = RESUME_ANALYSIS_CRITERIA.map(c => ({ ...c, status: 'pending' }));
            setSimulatedCriteria(initialCriteria);
            setCurrentIndex(0);

            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    if (prevIndex >= RESUME_ANALYSIS_CRITERIA.length - 1) {
                        clearInterval(interval);
                        return prevIndex;
                    }
                    return prevIndex + 1;
                });
            }, 150);

            return () => clearInterval(interval);
        }
    }, [isLoading]);
    
    useEffect(() => {
        if (currentIndex >= 0 && currentIndex < RESUME_ANALYSIS_CRITERIA.length) {
            setSimulatedCriteria(prev => produce(prev, draft => {
                draft[currentIndex].status = 'done';
            }));
            
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentIndex]);
    
    if (!isLoading) return null;

    return (
         <div className="bg-white rounded-lg border border-teal-100 shadow-sm p-4 mb-6 transition-all duration-300">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left mb-2">
                <h4 className="font-semibold text-teal-dark flex items-center text-sm">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                    </span>
                    {t('resumeAnalyzer.aiThoughts.title')}
                </h4>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="mt-2 relative max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <ul className="space-y-2 text-xs sm:text-sm">
                        {simulatedCriteria.map((item, index) => (
                            <li key={item.id} className={`flex items-center gap-2 transition-all duration-300 ${item.status === 'done' ? 'text-gray-500' : 'text-teal-700 font-medium'}`}>
                                {item.status === 'done' ? (
                                     <svg className="h-4 w-4 text-green-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg className="animate-spin h-4 w-4 text-teal-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                )}
                                <span className="truncate">{language === 'fa' ? item.requirement.fa : item.requirement.en}</span>
                            </li>
                        ))}
                         <div ref={bottomRef} />
                    </ul>
                    {currentIndex >= RESUME_ANALYSIS_CRITERIA.length - 1 && (
                         <div className="sticky bottom-0 bg-white/95 pt-2 pb-1 text-center border-t border-gray-100 mt-2">
                             <span className="text-xs font-semibold text-teal-600 animate-pulse">{t('resumeAnalyzer.aiThoughts.finalizing')}</span>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
};


const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
    resumeText: initialResumeText,
    analysisResult,
    chatHistory,
    onAnalyze,
    onChat,
    isLoading,
    error,
    isQuotaExhausted
}) => {
    // ... existing logic ...
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'linkedin'>('upload');
    const [resumeText, setResumeText] = useState(initialResumeText);
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const [isChatSending, setIsChatSending] = useState(false);
    
    const [isImproving, setIsImproving] = useState(false);
    const [improvedResume, setImprovedResume] = useState<string | null>(null);

    const [linkedInUrl, setLinkedInUrl] = useState('');
    const [isSyncingLinkedIn, setIsSyncingLinkedIn] = useState(false);
    const [linkedInError, setLinkedInError] = useState<string | null>(null);

    const [jobSuggestions, setJobSuggestions] = useState<JobSearchSuggestion[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    
    useEffect(() => {
        setResumeText(initialResumeText);
    }, [initialResumeText]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isChatSending]);

    useEffect(() => {
        setIsChatSending(false);
    }, [chatHistory]);


    const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
        setFileError(null);
        setResumeText('');
        setFile(null);

        if (rejectedFiles.length > 0) {
            setFileError(t('jobAssistant.error.unsupportedFile'));
            return;
        }

        if (acceptedFiles.length > 0) {
            const droppedFile = acceptedFiles[0];

            if (droppedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setFileError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
                return;
            }

            setFile(droppedFile);
            setIsParsing(true);
            try {
                const text = await fileToText(droppedFile);
                if (!text || !text.trim()) {
                    throw new Error("Could not extract any text from the file. The document might be empty or image-based.");
                }
                setResumeText(text);
            } catch (err) {
                const e = err as Error;
                 if (e.message === 'UNSUPPORTED_FILE_TYPE') {
                    setFileError(t('jobAssistant.error.unsupportedFile'));
                } else {
                    setFileError(e.message);
                }
                setFile(null);
            } finally {
                setIsParsing(false);
            }
        }
    }, [t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxFiles: 1,
    });
    
    const handleAnalyzeClick = () => {
        if (!resumeText.trim()) {
            alert('Please upload or paste a resume.');
            return;
        }
        onAnalyze(resumeText);
    };

    const handleLinkedInImport = async () => {
        if (!linkedInUrl.trim()) {
            setLinkedInError("Please enter a valid LinkedIn URL");
            return;
        }
        setIsSyncingLinkedIn(true);
        setLinkedInError(null);
        try {
            const text = await syncLinkedInProfile(linkedInUrl);
            setResumeText(text);
            setActiveTab('text');
        } catch (err: any) {
            setLinkedInError(err.message || "Failed to import LinkedIn profile");
        } finally {
            setIsSyncingLinkedIn(false);
        }
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim()) {
            setIsChatSending(true);
            onChat(chatInput);
            setChatInput('');
        }
    };
    
    const handleVoiceInput = () => {
        if (isListening) {
            speechRecognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = t('langCode') === 'fa' ? 'fa-IR' : 'en-US';
        recognition.interimResults = true;
        speechRecognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setChatInput(transcript);
            if (event.results[event.results.length - 1].isFinal) {
                setIsChatSending(true);
                onChat(transcript);
                setChatInput('');
            }
        };
        recognition.start();
    };

    const handleImproveResume = async () => {
        if (!resumeText || !analysisResult) return;
        
        setIsImproving(true);
        try {
            const newResume = await generateImprovedResume(resumeText, analysisResult, chatHistory, language);
            setImprovedResume(newResume);
        } catch (error) {
            console.error("Failed to improve resume:", error);
            alert("Could not generate the resume. Please try again.");
        } finally {
            setIsImproving(false);
        }
    };

    const handleFindJobs = async () => {
        if (!resumeText) return;
        setIsLoadingJobs(true);
        try {
            const suggestions = await suggestJobSearches(resumeText);
            setJobSuggestions(suggestions);
            setTimeout(() => {
                document.getElementById('job-suggestions')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            console.error(err);
            alert("Failed to find jobs");
        } finally {
            setIsLoadingJobs(false);
        }
    };

    const getStatusContent = (status: ResumeAnalysisStatus) => {
        switch (status) {
            case 'present': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✔ {t('resumeAnalyzer.table.present')}</span>;
            case 'implicit': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⭕ {t('resumeAnalyzer.table.implicit')}</span>;
            case 'missing': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">❌ {t('resumeAnalyzer.table.missing')}</span>;
            default: return null;
        }
    };
    
    const groupedResults = useMemo(() => {
        if (!analysisResult || !Array.isArray(analysisResult.analysis)) {
            return {} as Record<string, ResumeAnalysisItem[]>;
        }

        return analysisResult.analysis.reduce((acc: Record<string, ResumeAnalysisItem[]>, item) => {
            const key = item.category;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, ResumeAnalysisItem[]>);
    }, [analysisResult]);

    return (
        <section className="py-12 sm:py-16">
             <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold text-teal-dark">{t('resumeAnalyzer.title')}</h1>
                <p className="mt-4 text-lg text-gray-600">{t('resumeAnalyzer.subtitle')}</p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6 lg:sticky top-28">
                     <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4">
                                <button onClick={() => setActiveTab('upload')} className={`${activeTab === 'upload' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500'} py-2 px-1 border-b-2 text-sm transition-colors`}>{t('resumeAnalyzer.uploadTab')}</button>
                                <button onClick={() => setActiveTab('text')} className={`${activeTab === 'text' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500'} py-2 px-1 border-b-2 text-sm transition-colors`}>{t('resumeAnalyzer.textTab')}</button>
                                <button onClick={() => setActiveTab('linkedin')} className={`${activeTab === 'linkedin' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500'} py-2 px-1 border-b-2 text-sm transition-colors`}>{t('resumeAnalyzer.linkedin.tab')}</button>
                            </nav>
                        </div>
                        
                        {activeTab === 'upload' && (
                            <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-md cursor-pointer text-center transition-colors ${isDragActive ? 'border-teal-blue bg-teal-blue/10' : 'border-gray-300 hover:border-teal-blue/50'}`}>
                                <input {...getInputProps()} />
                                {isParsing ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="animate-spin h-8 w-8 text-teal-blue mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <p className="text-gray-500 text-sm">{t('jobAssistant.cv.parsing')}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">{file ? file.name : (resumeText ? 'Document Loaded' : t('resumeAnalyzer.dropzone'))}</p>
                                )}
                                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                            </div>
                        )}

                        {activeTab === 'text' && (
                            <textarea rows={8} value={resumeText} onChange={e => setResumeText(e.target.value)} className="w-full bg-gray-50 border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark focus:ring-teal-blue focus:border-teal-blue" placeholder={t('resumeAnalyzer.placeholder')} />
                        )}

                        {activeTab === 'linkedin' && (
                            <div className="space-y-3">
                                <label htmlFor="linkedin-url-analyzer" className="block text-sm font-medium text-gray-700">{t('jobAssistant.cv.linkedinLabel')}</label>
                                <input 
                                    type="url" 
                                    id="linkedin-url-analyzer" 
                                    value={linkedInUrl} 
                                    onChange={e => setLinkedInUrl(e.target.value)} 
                                    className="w-full border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" 
                                    placeholder={t('jobAssistant.cv.linkedinPlaceholder')} 
                                />
                                <button 
                                    onClick={handleLinkedInImport} 
                                    disabled={isSyncingLinkedIn} 
                                    className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
                                >
                                    {isSyncingLinkedIn ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            {t('jobAssistant.cv.syncingButton')}
                                        </>
                                    ) : t('resumeAnalyzer.linkedin.importButton')}
                                </button>
                                {linkedInError && (
                                    <div className="text-red-600 p-3 bg-red-50 rounded-md text-xs border border-red-200">
                                        <div className="font-bold mb-1">Error:</div>
                                        <div className="whitespace-pre-wrap">{linkedInError}</div>
                                        {linkedInError.includes('LinkedIn') && (
                                            <div className="mt-2 pt-2 border-t border-red-200 text-gray-600">
                                                <p>Direct scraping is restricted. For development, try:</p>
                                                <ul className="list-disc pl-4 mt-1">
                                                    <li>Demo buttons below</li>
                                                    <li>Uploading a PDF of your profile</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2 mt-1">
                            <button onClick={() => {setResumeText(DEMO_RESUME_DEV); setActiveTab('text');}} className="text-xs text-teal-600 hover:underline bg-teal-50 px-2 py-1 rounded border border-teal-100">Demo: Software Engineer</button>
                            <button onClick={() => {setResumeText(DEMO_RESUME_MANAGER); setActiveTab('text');}} className="text-xs text-teal-600 hover:underline bg-teal-50 px-2 py-1 rounded border border-teal-100">Demo: Product Manager</button>
                        </div>
                         <button 
                            onClick={handleAnalyzeClick} 
                            disabled={isParsing || isLoading || isQuotaExhausted || (!resumeText.trim() && !file)} 
                            className="w-full py-3 px-4 rounded-md text-white font-semibold bg-teal-blue hover:bg-teal-light-blue disabled:bg-gray-400 transition-all transform active:scale-95"
                         >
                            {isParsing ? t('jobAssistant.cv.parsing') : (isLoading && !analysisResult ? t('resumeAnalyzer.analyzingButton') : t('resumeAnalyzer.analyzeButton'))}
                        </button>
                     </div>
                     {analysisResult && (
                         <div className="bg-white rounded-lg shadow-lg flex flex-col h-[60vh] overflow-hidden border border-gray-200">
                            <div className="p-4 border-b border-gray-200 bg-teal-green text-white flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                <h3 className="font-bold">AI Interviewer</h3>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
                                {chatHistory.map((msg, i) => <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-teal-blue text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}><p className="whitespace-pre-wrap">{msg.text}</p></div></div>)}
                                {isChatSending && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none flex items-center gap-1 shadow-sm"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div></div></div>}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 relative">
                                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={isListening ? t('resumeAnalyzer.chat.listening') : t('resumeAnalyzer.chat.placeholder')} className="flex-grow border-gray-300 rounded-full py-2 px-4 text-sm focus:ring-teal-blue focus:border-teal-blue bg-gray-50" disabled={isChatSending} />
                                <button type="button" onClick={handleVoiceInput} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} disabled={isChatSending}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path fillRule="evenodd" d="M5.5 8.5A.5.5 0 016 8h1v2a.5.5 0 01-1 0V8zM14 8a.5.5 0 00-1 0v2a.5.5 0 001 0V8z" clipRule="evenodd" /><path d="M9 13a1 1 0 102 0v-1a1 1 0 10-2 0v1z" /><path fillRule="evenodd" d="M11 11.333V13a3 3 0 01-3 3H8a3 3 0 01-3-3v-1.667A5.002 5.002 0 013 7V4a4 4 0 118 0v3a5.002 5.002 0 01-1 2.333zM9 1a3 3 0 00-3 3v3a3.989 3.989 0 00-1 2.333V13a4 4 0 004 4h4a4 4 0 004-4v-1.667A3.989 3.989 0 0015 7V4a3 3 0 00-3-3H9z" clipRule="evenodd" /></svg></button>
                                <button type="submit" disabled={isChatSending || !chatInput.trim()} className="p-2 bg-teal-blue text-white rounded-full hover:bg-teal-light-blue disabled:opacity-50 transition-colors">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.172 15V4.828a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428a1 1 0 00.707-1.952V4.828a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428a1 1 0 00.707-1.952V4.828z" /></svg>
                                </button>
                            </form>
                         </div>
                     )}
                     {analysisResult && (
                        <div className="mt-4 flex gap-3">
                            <button 
                                onClick={handleImproveResume}
                                disabled={isImproving || isQuotaExhausted}
                                className="flex-1 py-3 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-brand-gold to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center text-xs sm:text-sm"
                            >
                                {isImproving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        {t('resumeAnalyzer.improvingButton')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        {t('resumeAnalyzer.improveButton')}
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={handleFindJobs}
                                disabled={isLoadingJobs || isQuotaExhausted}
                                className="flex-1 py-3 px-4 rounded-md text-white font-semibold bg-teal-600 hover:bg-teal-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center text-xs sm:text-sm"
                            >
                                {isLoadingJobs ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        {t('resumeAnalyzer.findingJobs')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        {t('resumeAnalyzer.findJobsButton')}
                                    </>
                                )}
                            </button>
                        </div>
                     )}
                </div>

                {/* Result Display Column */}
                <div className="lg:col-span-3 space-y-6">
                    <ProgressBar isParsing={isParsing} isLoading={isLoading} analysisResult={analysisResult} error={error} hasResumeText={!!resumeText.trim()} t={t} />
                    
                    {isLoading && <AIThoughts isLoading={isLoading} language={language} />}
                    
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                    
                    {analysisResult && (
                        <div className="animate-fade-in">
                             <AnalysisSummary result={analysisResult} />
                             
                             {jobSuggestions.length > 0 && (
                                <div id="job-suggestions" className="mb-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-teal-dark mb-4">{t('resumeAnalyzer.jobsTitle')}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {jobSuggestions.map((suggestion, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                <h5 className="font-bold text-teal-blue">{suggestion.jobTitle}</h5>
                                                <p className="text-xs text-gray-500 mt-1">{suggestion.reasoning}</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {suggestion.keywords.map(k => (
                                                        <span key={k} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">{k}</span>
                                                    ))}
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <a 
                                                    href={`https://jobvision.ir/jobs?keyword=${encodeURIComponent(suggestion.jobTitle)}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-xs bg-[#2e3192] text-white px-3 py-1.5 rounded hover:opacity-90 flex-1 text-center flex items-center justify-center gap-1"
                                                    >
                                                        JobVision
                                                    </a>
                                                    <a 
                                                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(suggestion.keywords.join(' '))}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-xs bg-[#0077b5] text-white px-3 py-1.5 rounded hover:opacity-90 flex-1 text-center flex items-center justify-center gap-1"
                                                    >
                                                        LinkedIn
                                                    </a>
                                                    <a 
                                                    href={`https://jobinja.ir/jobs?filters%5Bkeywords%5D%5B0%5D=${encodeURIComponent(suggestion.jobTitle)}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-xs bg-[#00bfa5] text-white px-3 py-1.5 rounded hover:opacity-90 flex-1 text-center flex items-center justify-center gap-1"
                                                    >
                                                        Jobinja
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-teal-dark">{t('resumeAnalyzer.table.title')}</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 w-1/3">{t('resumeAnalyzer.table.requirement')}</th>
                                                <th className="px-4 py-3 w-1/6 text-center">{t('resumeAnalyzer.table.status')}</th>
                                                <th className="px-4 py-3">{t('resumeAnalyzer.table.evidence')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(Object.entries(groupedResults) as [string, ResumeAnalysisItem[]][]).map(([category, items]) => (
                                                <React.Fragment key={category}>
                                                    <tr className="bg-teal-50/50">
                                                        <td colSpan={3} className="px-4 py-2 font-bold text-teal-800">{category}</td>
                                                    </tr>
                                                    {items.map((item) => (
                                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                                            <td className="px-4 py-3 align-top text-gray-900">{language === 'fa' ? item.requirement : item.requirement}</td>
                                                            <td className="px-4 py-3 align-top text-center">
                                                                {getStatusContent(item.status as ResumeAnalysisStatus)}
                                                            </td>
                                                            <td className="px-4 py-3 align-top text-gray-600 italic">
                                                                {item.evidence || t('resumeAnalyzer.table.noEvidence')}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    )}
                    
                    {!isLoading && !analysisResult && !error && (
                         <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                             <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                             <p>{t('resumeAnalyzer.subtitle')}</p>
                         </div>
                    )}
                </div>
            </div>
            
            {improvedResume && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col m-4 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-teal-dark text-white">
                            <h3 className="text-xl font-bold">{t('resumeAnalyzer.improvedTitle')}</h3>
                            <button onClick={() => setImprovedResume(null)} className="text-gray-300 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 bg-gray-100">
                            <DocumentDisplay 
                                generatedDocument={improvedResume} 
                                isLoading={false} 
                                error={null} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ResumeAnalyzer;
