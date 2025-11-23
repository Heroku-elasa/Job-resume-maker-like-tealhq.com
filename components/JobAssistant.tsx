
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { produce } from 'immer';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { nanoid } from 'nanoid';
import { JobApplication, JobDetails, useLanguage, JobApplicationStatus, FilePart, ChatMessage } from '../types';
import * as geminiService from '../services/geminiService';

const CV_LOCAL_STORAGE_KEY = 'dadgar-ai-cv-draft';

interface JobAssistantProps {
    applications: JobApplication[];
    currentUserCv: string;
    setCurrentUserCv: (cv: string) => void;
    onAddApplication: (app: JobApplication) => Promise<void>;
    onUpdateApplication: (app: JobApplication) => Promise<void>;
    handleApiError: (err: unknown) => string;
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
                 const text = await geminiService.extractTextFromDocument(filePart);
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


const JobAssistant: React.FC<JobAssistantProps> = ({ 
    applications, currentUserCv, setCurrentUserCv, 
    onAddApplication, onUpdateApplication, handleApiError, isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'apply' | 'dashboard' | 'cv'>('apply');
    
    // Generation Mode State
    const [jobUrl, setJobUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    
    // Manual Log Mode State
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualTitle, setManualTitle] = useState('');
    const [manualCompany, setManualCompany] = useState('');
    const [manualStatus, setManualStatus] = useState<JobApplicationStatus>('applied');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualUrl, setManualUrl] = useState('');

    const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [linkedInUrl, setLinkedInUrl] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isParsingCv, setIsParsingCv] = useState(false);

    const [localSaveStatus, setLocalSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const isLoaded = useRef(false);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('userCv');
        if (saved !== null) {
            setCurrentUserCv(saved);
        }
        isLoaded.current = true;
    }, [setCurrentUserCv]);

    // Auto-save to localStorage
    useEffect(() => {
        if (!isLoaded.current) return;

        const timeout = setTimeout(() => {
            localStorage.setItem('userCv', currentUserCv);
            setLocalSaveStatus('saved');
            setTimeout(() => setLocalSaveStatus('idle'), 2000);
        }, 500);

        setLocalSaveStatus('saving');

        return () => clearTimeout(timeout);
    }, [currentUserCv]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentApplication?.chatHistory]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError(null);
        setCvFile(null);
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIsParsingCv(true);
            try {
                const text = await fileToText(file);
                setCurrentUserCv(text);
                setCvFile(file); // Set file on success
            } catch (e) {
                const err = e instanceof Error ? e : new Error(String(e));
                if (err.message === 'UNSUPPORTED_FILE_TYPE') {
                    setError(t('jobAssistant.error.unsupportedFile'));
                } else {
                    setError(err.message);
                }
                // Do not clear CV if error, keep previous text
            } finally {
                setIsParsingCv(false);
            }
        }
    }, [setCurrentUserCv, t]);

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

    const handleLinkedInSync = async () => {
        if (!linkedInUrl) {
            setError('Please enter your LinkedIn profile URL.');
            return;
        }
        setError(null);
        setIsSyncing(true);
        try {
            const cvText = await geminiService.syncLinkedInProfile(linkedInUrl);
            setCurrentUserCv(cvText);
            setCvFile(null); // Clear file when syncing from LinkedIn
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsSyncing(false);
        }
    };
    
    const handleGenerate = async () => {
        if (!currentUserCv) {
            setError(t('jobAssistant.error.noCv'));
            setActiveTab('cv');
            return;
        }
        if (!jobUrl && !jobDescription) {
             setError(t('jobAssistant.error.noJob'));
             return;
        }

        setError(null);
        setIsLoading(true);
        
        try {
            setLoadingMessage(t('jobAssistant.status.scraping'));
            const jobDetails: JobDetails = jobUrl 
                ? await geminiService.scrapeJobDetails(jobUrl)
                : { title: 'Custom Job', company: 'N/A', description: jobDescription, skills: [] };

            const newApp: JobApplication = {
                id: nanoid(),
                jobTitle: jobDetails.title,
                company: jobDetails.company,
                jobUrl: jobUrl,
                status: 'draft',
                cvText: currentUserCv,
                jobDescription: jobDetails.description,
                tailoredResume: '',
                coverLetter: '',
                lastUpdated: Date.now(),
                chatHistory: [] // Initialize empty chat history
            };

            setLoadingMessage(t('jobAssistant.status.generatingResume'));
            newApp.tailoredResume = await geminiService.generateTailoredResume(jobDetails, currentUserCv);
            
            setLoadingMessage(t('jobAssistant.status.generatingCoverLetter'));
            newApp.coverLetter = await geminiService.generateCoverLetter(jobDetails, currentUserCv);
            
            await onAddApplication(newApp);
            setCurrentApplication(newApp);

        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleManualLog = async () => {
        if (!manualTitle || !manualCompany) {
            setError('Job Title and Company are required.');
            return;
        }
        
        const newApp: JobApplication = {
            id: nanoid(),
            jobTitle: manualTitle,
            company: manualCompany,
            jobUrl: manualUrl,
            status: manualStatus,
            cvText: currentUserCv,
            jobDescription: '',
            tailoredResume: '',
            coverLetter: '',
            lastUpdated: new Date(manualDate).getTime(),
            appliedDate: manualStatus === 'applied' ? new Date(manualDate).getTime() : undefined,
            chatHistory: []
        };

        await onAddApplication(newApp);
        
        // Reset form
        setManualTitle('');
        setManualCompany('');
        setManualUrl('');
        setManualStatus('applied');
        setActiveTab('dashboard');
    };
    
    const handleSendApproval = async () => {
        if (!currentApplication) return;
        setIsLoading(true);
        setLoadingMessage(t('jobAssistant.status.sendingApproval'));
        try {
            await geminiService.sendWhatsAppApproval(currentApplication.id, "1234567890"); // Placeholder number
            const updatedApp = produce(currentApplication, draft => {
                draft.status = 'pending_approval';
                draft.lastUpdated = Date.now();
            });
            await onUpdateApplication(updatedApp);
            setCurrentApplication(updatedApp);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        if (!currentApplication) return;
        setIsLoading(true);
        setLoadingMessage(t('jobAssistant.status.applying'));
        try {
            await geminiService.applyByEmail(currentApplication.id, "job@example.com"); // Placeholder email
            const updatedApp = produce(currentApplication, draft => {
                draft.status = 'applied';
                draft.appliedDate = Date.now();
                draft.lastUpdated = Date.now();
            });
            await onUpdateApplication(updatedApp);
            setCurrentApplication(updatedApp);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (appId: string, newStatus: JobApplicationStatus) => {
        const appToUpdate = applications.find(a => a.id === appId);
        if (appToUpdate) {
            const updatedApp = produce(appToUpdate, draft => {
                draft.status = newStatus;
                draft.lastUpdated = Date.now();
            });
            await onUpdateApplication(updatedApp);
        }
    };
    
    const handleJobChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !currentApplication) return;

        const newMessage: ChatMessage = { role: 'user', text: chatInput };
        const currentHistory = currentApplication.chatHistory || [];
        const newHistory = [...currentHistory, newMessage];

        // Optimistically update UI
        const optimisticApp = produce(currentApplication, draft => {
            draft.chatHistory = newHistory;
        });
        setCurrentApplication(optimisticApp);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const reply = await geminiService.chatWithJobCoach(newHistory, currentApplication);
            const botMessage: ChatMessage = { role: 'model', text: reply };
            const finalHistory = [...newHistory, botMessage];
            
            const updatedApp = produce(currentApplication, draft => {
                draft.chatHistory = finalHistory;
            });
            
            // Persist to DB and State
            await onUpdateApplication(updatedApp);
            setCurrentApplication(updatedApp);
        } catch (err) {
             const errorMsg = handleApiError(err);
             const errorApp = produce(currentApplication, draft => {
                 draft.chatHistory = [...newHistory, {role: 'model', text: `Error: ${errorMsg}`}];
             });
             setCurrentApplication(errorApp);
        } finally {
            setIsChatLoading(false);
        }
    };

    const getStatusColor = (status: JobApplicationStatus) => {
        switch (status) {
            case 'draft': return 'bg-gray-500';
            case 'pending_approval': return 'bg-yellow-500';
            case 'applying': return 'bg-blue-500';
            case 'applied': return 'bg-green-600';
            case 'viewed': return 'bg-teal-500';
            case 'interview_scheduled': return 'bg-purple-500';
            case 'offer_received': return 'bg-orange-500';
            case 'rejected': return 'bg-red-600';
            case 'error': return 'bg-red-800';
            default: return 'bg-gray-500';
        }
    };
    
    const allStatuses: JobApplicationStatus[] = ['draft', 'pending_approval', 'applying', 'applied', 'viewed', 'interview_scheduled', 'offer_received', 'rejected', 'error'];

    const renderApplyTab = () => (
        <div className="space-y-8">
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <button 
                        onClick={() => setIsManualMode(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isManualMode ? 'bg-white text-teal-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        AI Assistant
                    </button>
                    <button 
                        onClick={() => setIsManualMode(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isManualMode ? 'bg-white text-teal-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Manual Log
                    </button>
                </div>
            </div>

            {!isManualMode ? (
                <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                    <h3 className="text-xl font-bold text-teal-dark">{t('jobAssistant.apply.title')}</h3>
                     <div>
                        <label htmlFor="job-url" className="block text-sm font-medium text-gray-700">{t('jobAssistant.apply.jobUrlLabel')}</label>
                        <input type="url" id="job-url" value={jobUrl} onChange={e => setJobUrl(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" placeholder={t('jobAssistant.apply.jobUrlPlaceholder')} />
                    </div>
                    <div className="relative flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-xs text-gray-500">OR</span><div className="flex-grow border-t border-gray-300"></div></div>
                     <div>
                        <label htmlFor="job-desc" className="block text-sm font-medium text-gray-700">{t('jobAssistant.apply.jobDescLabel')}</label>
                        <textarea id="job-desc" rows={5} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" placeholder={t('jobAssistant.apply.jobDescPlaceholder')} />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading || isQuotaExhausted} className="w-full py-3 px-4 rounded-md text-white font-semibold bg-teal-blue hover:bg-teal-light-blue disabled:bg-gray-400">{t('jobAssistant.apply.generateButton')}</button>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
                    <h3 className="text-xl font-bold text-teal-dark">Log Application Manually</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                            <input type="text" value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company *</label>
                            <input type="text" value={manualCompany} onChange={e => setManualCompany(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job URL (Optional)</label>
                        <input type="url" value={manualUrl} onChange={e => setManualUrl(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                             <select value={manualStatus} onChange={e => setManualStatus(e.target.value as JobApplicationStatus)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-teal-blue focus:border-teal-blue bg-white">
                                {allStatuses.map(s => <option key={s} value={s}>{t(`jobAssistant.status.${s}`)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={manualDate} onChange={e => setManualDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                        </div>
                    </div>
                    <button onClick={handleManualLog} className="w-full py-3 px-4 rounded-md text-white font-semibold bg-teal-green hover:bg-teal-800">Log Application</button>
                </div>
            )}
            
             {isLoading && (
                <div className="text-center p-6 bg-white rounded-lg">
                     <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-teal-blue mx-auto"></div>
                     <p className="mt-3 text-gray-600">{loadingMessage}</p>
                </div>
            )}
            
            {error && !currentApplication && <div className="text-red-600 p-4 bg-red-100 rounded-md">{error}</div>}

            {currentApplication && !isManualMode && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-teal-dark mb-6">{t('jobAssistant.preview.title')}</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-teal-green">{t('jobAssistant.preview.resume')}</h4>
                                        <span className="text-xs text-gray-500">Editable</span>
                                    </div>
                                   <textarea value={currentApplication.tailoredResume} onChange={e => setCurrentApplication(produce(currentApplication, d => {d.tailoredResume = e.target.value}))} rows={15} className="w-full bg-gray-50 border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                                </div>
                                <div className="space-y-2">
                                   <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-teal-green">{t('jobAssistant.preview.coverLetter')}</h4>
                                        <span className="text-xs text-gray-500">Editable</span>
                                    </div>
                                   <textarea value={currentApplication.coverLetter} onChange={e => setCurrentApplication(produce(currentApplication, d => {d.coverLetter = e.target.value}))} rows={15} className="w-full bg-gray-50 border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 mt-6">
                                <button onClick={handleSendApproval} disabled={isLoading || currentApplication.status !== 'draft'} className="flex-1 py-2 px-4 rounded-md bg-green-600 text-white disabled:bg-gray-400 hover:bg-green-700 transition-colors">{t('jobAssistant.preview.whatsappButton')}</button>
                                <button onClick={handleApply} disabled={isLoading || currentApplication.status === 'applied'} className="flex-1 py-2 px-4 rounded-md bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors">{t('jobAssistant.preview.applyButton')}</button>
                            </div>
                            {currentApplication.status === 'pending_approval' && <p className="text-center text-yellow-600 animate-pulse mt-4">{t('jobAssistant.status.approvalWaiting')}</p>}
                        </div>
                    </div>

                    {/* AI Assistant Panel */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-teal-blue/20 flex flex-col h-[600px]">
                            <div className="p-4 bg-teal-green text-white">
                                <h4 className="font-bold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    AI Application Coach
                                </h4>
                                <p className="text-xs text-teal-100 mt-1">Ask for help tailored to this job.</p>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {(!currentApplication.chatHistory || currentApplication.chatHistory.length === 0) && (
                                    <p className="text-sm text-gray-500 text-center italic mt-10">
                                        "How can I improve my cover letter?"<br/>
                                        "What interview questions should I expect?"
                                    </p>
                                )}
                                {currentApplication.chatHistory?.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-teal-blue text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 rounded-bl-none flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleJobChat} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask the coach..."
                                        className="flex-grow text-sm border-gray-300 rounded-md focus:ring-teal-green focus:border-teal-green"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isChatLoading || !chatInput.trim()}
                                        className="p-2 bg-teal-green text-white rounded-md hover:bg-teal-800 disabled:opacity-50 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderDashboardTab = () => (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-teal-dark mb-4">{t('jobAssistant.dashboard.title')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-4 py-3">{t('jobAssistant.dashboard.jobTitle')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.company')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.date')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.status')}</th><th className="px-4 py-3">Actions</th></tr></thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-teal-dark truncate max-w-xs">
                                    {app.jobUrl ? <a href={app.jobUrl} target="_blank" rel="noreferrer" className="hover:underline">{app.jobTitle}</a> : app.jobTitle}
                                </td>
                                <td className="px-4 py-3">{app.company}</td>
                                <td className="px-4 py-3">{new Date(app.lastUpdated).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplicationStatus)}
                                        className={`w-full text-xs font-semibold text-white rounded-md border-transparent focus:ring-2 focus:ring-teal-blue focus:border-transparent ${getStatusColor(app.status)}`}
                                        style={{ WebkitAppearance: 'none', appearance: 'none', paddingRight: '2rem', backgroundPosition: `right 0.5rem center`, backgroundRepeat: 'no-repeat', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                    >
                                        {allStatuses.map(statusKey => (
                                            <option key={statusKey} value={statusKey} className="bg-white text-teal-dark">
                                                {t(`jobAssistant.status.${statusKey}`)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <button 
                                        onClick={() => { setCurrentApplication(app); setActiveTab('apply'); }}
                                        className="text-teal-blue hover:underline font-medium"
                                    >
                                        Edit/View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {applications.length === 0 && <p className="text-center text-gray-500 py-8">{t('jobAssistant.dashboard.noApps')}</p>}
            </div>
        </div>
    );
    
    const renderCvTab = () => (
         <div className="bg-white rounded-lg p-6 shadow-lg space-y-4">
             <h3 className="text-xl font-bold text-teal-dark">{t('jobAssistant.cv.title')}</h3>
             <p className="text-gray-600 text-sm">{t('jobAssistant.cv.description')}</p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-700">{t('jobAssistant.cv.linkedinLabel')}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="url" id="linkedin-url" value={linkedInUrl} onChange={e => setLinkedInUrl(e.target.value)} className="flex-grow border-gray-300 rounded-md py-2 px-3 text-teal-dark shadow-sm" placeholder={t('jobAssistant.cv.linkedinPlaceholder')} />
                    <button onClick={handleLinkedInSync} disabled={isSyncing} className="sm:w-auto w-full px-4 py-2 rounded-md text-white font-semibold bg-teal-blue hover:bg-teal-light-blue disabled:bg-gray-400 flex items-center justify-center">
                        {isSyncing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {t('jobAssistant.cv.syncingButton')}
                            </>
                        ) : (
                            t('jobAssistant.cv.syncButton')
                        )}
                    </button>
                </div>
              </div>
            
             <div className="relative flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-xs text-gray-500">OR</span><div className="flex-grow border-t border-gray-300"></div></div>

             <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-md cursor-pointer text-center ${isDragActive ? 'border-teal-blue bg-teal-blue/10' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                {isParsingCv ? (
                    <p className="text-gray-500 animate-pulse">{t('jobAssistant.cv.parsing')}</p>
                ) : cvFile ? (
                    <p className="text-green-600">{cvFile.name}</p>
                ) : (
                    <p className="text-gray-500">{t('jobAssistant.cv.dropzone')}</p>
                )}
            </div>
            
            {error && activeTab === 'cv' && <div className="text-red-600 p-2 bg-red-100 rounded-md text-sm text-center">{error}</div>}
             
             <div className="relative">
                <textarea 
                    value={currentUserCv} 
                    onChange={e => setCurrentUserCv(e.target.value)} 
                    rows={20} 
                    className="w-full bg-gray-50 border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark shadow-sm focus:ring-teal-blue focus:border-teal-blue" 
                    placeholder={t('jobAssistant.cv.placeholder')} 
                />
                 <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded pointer-events-none transition-opacity duration-300" style={{ opacity: localSaveStatus !== 'idle' ? 1 : 0 }}>
                    {localSaveStatus === 'saving' ? t('jobAssistant.autoSave.saving') : t('jobAssistant.autoSave.saved')}
                </div>
             </div>
         </div>
    );

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-teal-dark">{t('header.jobAssistant')}</h1>
                    <p className="mt-4 text-lg text-gray-600">{t('jobAssistant.subtitle')}</p>
                </div>
                
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                        <button onClick={() => setActiveTab('apply')} className={`${activeTab === 'apply' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.apply')}</button>
                        <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.dashboard')}</button>
                        <button onClick={() => setActiveTab('cv')} className={`${activeTab === 'cv' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.cv')}</button>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {activeTab === 'apply' && renderApplyTab()}
                  {activeTab === 'dashboard' && renderDashboardTab()}
                  {activeTab === 'cv' && renderCvTab()}
                </div>
            </div>
        </section>
    );
};

export default JobAssistant;
