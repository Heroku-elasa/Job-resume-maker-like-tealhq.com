import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { ResumeAnalysisItem, ChatMessage, useLanguage, ResumeAnalysisStatus, FilePart } from '../types';
import * as geminiService from '../services/geminiService';

interface ResumeAnalyzerProps {
    resumeText: string;
    analysisResult: ResumeAnalysisItem[];
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
        } else if (file.type === 'application/pdf') {
            try {
                const base64Data = await fileToBase64(file);
                const filePart: FilePart = { mimeType: file.type, data: base64Data };
                const text = await geminiService.extractTextFromImage(filePart);
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
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
    const [resumeText, setResumeText] = useState(initialResumeText);
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [chatError, setChatError] = useState<string | null>(null);
    const speechRecognitionRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    
    const toggleRowExpansion = (itemId: number) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    
    useEffect(() => {
        setResumeText(initialResumeText);
    }, [initialResumeText]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFileError(null);
        setFormError(null);
        if (acceptedFiles.length > 0) {
            const droppedFile = acceptedFiles[0];
            setFile(droppedFile);
            setIsParsing(true);
            try {
                const text = await fileToText(droppedFile);
                setResumeText(text);
            } catch (err) {
                const e = err as Error;
                 if (e.message === 'UNSUPPORTED_FILE_TYPE') {
                    setFileError(t('jobAssistant.error.unsupportedFile'));
                } else {
                    setFileError(e.message);
                }
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
        },
        maxFiles: 1,
    });
    
    const handleAnalyzeClick = () => {
        if (!resumeText.trim()) {
            setFormError('Please upload or paste a resume before analyzing.');
            return;
        }
        setFormError(null);
        onAnalyze(resumeText);
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatInput.trim()) {
            onChat(chatInput);
            setChatInput('');
        }
    };
    
    const handleVoiceInput = () => {
        setChatError(null);
        if (isListening) {
            speechRecognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setChatError('Speech recognition is not supported in this browser.');
            setTimeout(() => setChatError(null), 5000);
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
            let message = 'An unknown speech recognition error occurred.';
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                message = 'Microphone access was denied. Please check browser permissions.';
            } else if (event.error === 'no-speech') {
                message = 'No speech was detected. Please try again.';
            }
            setChatError(message);
            setTimeout(() => setChatError(null), 5000);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setChatInput(transcript);
            if (event.results[event.results.length - 1].isFinal) {
                onChat(transcript);
                setChatInput('');
            }
        };
        recognition.start();
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
        const initialValue: Record<string, ResumeAnalysisItem[]> = {};
        return analysisResult.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, initialValue);
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
                        <div className="border-b border-gray-200"><nav className="-mb-px flex space-x-4"><button onClick={() => {setActiveTab('upload'); setFormError(null);}} className={`${activeTab === 'upload' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500'} py-2 px-1 border-b-2 text-sm`}>{t('resumeAnalyzer.uploadTab')}</button><button onClick={() => {setActiveTab('text'); setFormError(null);}} className={`${activeTab === 'text' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500'} py-2 px-1 border-b-2 text-sm`}>{t('resumeAnalyzer.textTab')}</button></nav></div>
                        {activeTab === 'upload' ? (
                            <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-md cursor-pointer text-center ${isDragActive ? 'border-teal-blue bg-teal-blue/10' : 'border-gray-300'}`}>
                                <input {...getInputProps()} />
                                {isParsing ? (
                                    <p className="text-gray-500 text-sm animate-pulse">Parsing file...</p>
                                ) : (
                                    <p className="text-gray-500 text-sm">{file ? file.name : t('resumeAnalyzer.dropzone')}</p>
                                )}
                                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                            </div>
                        ) : (
                            <textarea rows={8} value={resumeText} onChange={e => {setResumeText(e.target.value); setFormError(null);}} className="w-full bg-gray-50 border-gray-300 rounded-md py-2 px-3 text-sm text-teal-dark" placeholder={t('resumeAnalyzer.placeholder')} />
                        )}
                        {formError && <p className="text-red-500 text-sm text-center -mb-2">{formError}</p>}
                         <button onClick={handleAnalyzeClick} disabled={isLoading || isQuotaExhausted || !resumeText.trim()} className="w-full py-3 px-4 rounded-md text-white font-semibold bg-teal-blue hover:bg-teal-light-blue disabled:bg-gray-400">{isLoading && !analysisResult.length ? t('resumeAnalyzer.analyzingButton') : t('resumeAnalyzer.analyzeButton')}</button>
                     </div>
                     {analysisResult.length > 0 && (
                         <div className="bg-white rounded-lg shadow-lg flex flex-col h-[60vh]">
                            <div className="p-4 border-b border-gray-200"><h3 className="font-bold text-teal-dark">AI Interviewer</h3></div>
                            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                                {chatHistory.map((msg, i) => <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-xs px-3 py-2 rounded-xl ${msg.role === 'user' ? 'bg-teal-blue text-white rounded-br-none' : 'bg-gray-200 text-teal-dark rounded-bl-none'}`}><p className="text-sm">{msg.text}</p></div></div>)}
                                {isLoading && analysisResult.length > 0 && <div className="flex justify-start"><div className="px-3 py-2 rounded-xl bg-gray-200 flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div></div></div>}
                                <div ref={chatEndRef} />
                            </div>
                             <div className="p-4 border-t border-gray-200">
                                {chatError && <p className="text-red-500 text-xs text-center pb-2">{chatError}</p>}
                                <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={isListening ? t('resumeAnalyzer.chat.listening') : t('resumeAnalyzer.chat.placeholder')} className="flex-grow border-gray-300 rounded-lg py-2 px-3 text-sm" />
                                    <button type="button" onClick={handleVoiceInput} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path fillRule="evenodd" d="M5.5 8.5A.5.5 0 016 8h1v2a.5.5 0 01-1 0V8zM14 8a.5.5 0 00-1 0v2a.5.5 0 001 0V8z" clipRule="evenodd" /><path d="M9 13a1 1 0 102 0v-1a1 1 0 10-2 0v1z" /><path fillRule="evenodd" d="M11 11.333V13a3 3 0 01-3 3H8a3 3 0 01-3-3v-1.667A5.002 5.002 0 013 7V4a4 4 0 118 0v3a5.002 5.002 0 01-1 2.333zM9 1a3 3 0 00-3 3v3a3.989 3.989 0 00-1 2.333V13a4 4 0 004 4h4a4 4 0 004-4v-1.667A3.989 3.989 0 0015 7V4a3 3 0 00-3-3H9z" clipRule="evenodd" /></svg></button>
                                </form>
                             </div>
                         </div>
                     )}
                </div>
                <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-teal-dark mb-4">{t('resumeAnalyzer.table.title')}</h3>
                     {isLoading && !analysisResult.length ? (
                        <div className="text-center py-10"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-blue mx-auto"></div></div>
                     ) : error ? (
                        <div className="text-red-600 p-4 bg-red-100 rounded-md">{error}</div>
                     ) : analysisResult.length === 0 ? (
                        <div className="text-center text-gray-500 py-10"><p>Analysis results will appear here.</p></div>
                     ) : (
                         <div className="space-y-6">
                             {Object.entries(groupedResults).map(([category, items]) => (
                                 <div key={category}>
                                     <h4 className="font-semibold text-teal-green mb-2">{category}</h4>
                                     <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                         <table className="w-full text-sm">
                                             <thead className="bg-gray-50 text-left">
                                                <tr className="text-xs text-gray-500 uppercase">
                                                    <th className="p-3 font-medium w-1/2">{t('resumeAnalyzer.table.requirement')}</th>
                                                    <th className="p-3 font-medium w-1/4">{t('resumeAnalyzer.table.status')}</th>
                                                    <th className="p-3 font-medium w-1/4 text-right">Details</th>
                                                </tr>
                                             </thead>
                                             <tbody className="divide-y divide-gray-200 bg-white">
                                                 {(items as ResumeAnalysisItem[]).map(item => {
                                                     const isExpanded = expandedRows.has(item.id);
                                                     return (
                                                         <React.Fragment key={item.id}>
                                                             <tr
                                                                 onClick={() => toggleRowExpansion(item.id)}
                                                                 className="cursor-pointer hover:bg-gray-50"
                                                                 aria-expanded={isExpanded}
                                                             >
                                                                 <td className="p-3 text-gray-700 font-medium">{item.requirement}</td>
                                                                 <td className="p-3">{getStatusContent(item.status)}</td>
                                                                 <td className="p-3 text-right">
                                                                     <div className="text-teal-blue text-xs flex items-center ml-auto font-semibold">
                                                                         <span>{isExpanded ? t('resumeAnalyzer.table.hideDetails') : t('resumeAnalyzer.table.showDetails')}</span>
                                                                         <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                                             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                         </svg>
                                                                     </div>
                                                                 </td>
                                                             </tr>
                                                             {isExpanded && (
                                                                 <tr>
                                                                     <td colSpan={3} className="p-0">
                                                                         <div className="p-4 bg-gray-50 animate-fade-in">
                                                                             <h5 className="font-semibold text-xs text-gray-500 uppercase mb-1">{t('resumeAnalyzer.table.evidence')}</h5>
                                                                             <p className="text-gray-600 italic text-sm">
                                                                                 {item.evidence || t('resumeAnalyzer.table.noEvidence')}
                                                                             </p>
                                                                         </div>
                                                                     </td>
                                                                 </tr>
                                                             )}
                                                         </React.Fragment>
                                                     );
                                                 })}
                                             </tbody>
                                         </table>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
            </div>
        </section>
    );
};

export default ResumeAnalyzer;