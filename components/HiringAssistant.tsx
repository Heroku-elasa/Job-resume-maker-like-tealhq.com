
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { produce } from 'immer';
import { nanoid } from 'nanoid';
import { useLanguage, HiringCandidate, FilePart } from '../types';
import { extractTextFromDocument, analyzeCandidateMatch, generateText } from '../services/geminiService';

interface HiringAssistantProps {
    jobDescription: string;
    setJobDescription: (jd: string) => void;
    candidates: HiringCandidate[];
    setCandidates: (candidates: HiringCandidate[]) => void;
    isLoading: boolean;
    error: string | null;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
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

const HiringAssistant: React.FC<HiringAssistantProps> = ({
    jobDescription, setJobDescription, candidates, setCandidates,
    isLoading, error, setIsLoading, setError, isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [analyzingFile, setAnalyzingFile] = useState<string>('');
    const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
    
    // JD Drafter State
    const [jdPrompt, setJdPrompt] = useState('');
    const [isDraftingJd, setIsDraftingJd] = useState(false);
    const [isUploadingJd, setIsUploadingJd] = useState(false);

    const handleAnalyze = async (files: File[]) => {
        if (!jobDescription.trim()) {
            alert("Please enter a Job Description first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Maintain a local copy of candidates to avoid stale closure issues in the loop
        let currentCandidates = [...candidates];

        // Process sequentially to avoid rate limits
        for (const file of files) {
            setAnalyzingFile(file.name);
            try {
                // 1. Extract Text
                let text = "";
                if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                    const base64Data = await fileToBase64(file);
                    const filePart: FilePart = { mimeType: file.type, data: base64Data };
                    text = await extractTextFromDocument(filePart);
                } else {
                    // Fallback for simple text/md
                    text = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsText(file);
                        reader.onload = () => resolve(reader.result as string);
                    });
                }

                // 2. Analyze against JD
                const analysis = await analyzeCandidateMatch(text, jobDescription);
                
                // 3. Add to list
                const newCandidate: HiringCandidate = {
                    ...analysis,
                    id: nanoid(),
                    fileName: file.name,
                    resumeText: text,
                };

                // Update local list and push to state
                currentCandidates = produce(currentCandidates, (draft) => {
                    draft.push(newCandidate);
                });
                setCandidates(currentCandidates);

            } catch (err) {
                console.error(`Error analyzing ${file.name}`, err);
                setError(`Failed to analyze ${file.name}`);
            }
        }

        setIsLoading(false);
        setAnalyzingFile('');
    };

    const onDropResumes = useCallback((acceptedFiles: File[]) => {
        handleAnalyze(acceptedFiles);
    }, [jobDescription, candidates]); 

    const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
        onDrop: onDropResumes,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'text/plain': ['.txt'],
        }
    });

    // JD Upload Handler
    const onDropJd = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsUploadingJd(true);
        try {
            const file = acceptedFiles[0];
            let text = "";
            if (file.type === 'application/pdf' || file.type.startsWith('image/') || file.type.includes('word')) {
                 const base64Data = await fileToBase64(file);
                 const filePart: FilePart = { mimeType: file.type, data: base64Data };
                 text = await extractTextFromDocument(filePart);
            } else {
                 text = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => resolve(reader.result as string);
                });
            }
            setJobDescription(text);
        } catch (err) {
            console.error("Error uploading JD", err);
            setError("Failed to process JD file.");
        } finally {
            setIsUploadingJd(false);
        }
    }, [setJobDescription, setError]);

    const { getRootProps: getJdRootProps, getInputProps: getJdInputProps } = useDropzone({
        onDrop: onDropJd,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        }
    });

    const handleDraftJD = async () => {
        if (!jdPrompt.trim()) return;
        setIsDraftingJd(true);
        try {
            const prompt = `Write a comprehensive Job Description for the following role/requirements: "${jdPrompt}". Include Responsibilities, Requirements, and Benefits. Use professional formatting.`;
            const text = await generateText(prompt);
            setJobDescription(text);
        } catch (err) {
            setError("Failed to draft Job Description.");
        } finally {
            setIsDraftingJd(false);
        }
    };

    const handleUseExample = (type: 'dev' | 'marketing') => {
        const example = t(`hiringAssistant.examples.${type}`);
        if (example) {
            setJobDescription(`${example.title}\n\n${example.description}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
            case 'maybe': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-teal-dark">{t('hiringAssistant.title')}</h1>
                    <p className="mt-4 text-lg text-gray-600">{t('hiringAssistant.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* JD Drafter Box */}
                        <div className="bg-teal-50 p-6 rounded-lg shadow-sm border border-teal-100">
                            <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                {t('hiringAssistant.jdDrafter.title')}
                            </h4>
                            <input 
                                type="text" 
                                value={jdPrompt}
                                onChange={(e) => setJdPrompt(e.target.value)}
                                placeholder={t('hiringAssistant.jdDrafter.promptPlaceholder')}
                                className="w-full text-sm border-gray-300 rounded-md mb-3"
                            />
                            <button 
                                onClick={handleDraftJD} 
                                disabled={isDraftingJd || !jdPrompt}
                                className="w-full bg-teal-600 text-white py-2 rounded-md text-sm hover:bg-teal-700 disabled:opacity-50"
                            >
                                {isDraftingJd ? t('hiringAssistant.jdDrafter.generating') : t('hiringAssistant.jdDrafter.button')}
                            </button>
                            
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-px bg-teal-200 flex-grow"></div>
                                <span className="text-xs text-teal-600">{t('hiringAssistant.jdDrafter.useExample')}</span>
                                <div className="h-px bg-teal-200 flex-grow"></div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleUseExample('dev')} className="flex-1 text-xs bg-white border border-teal-200 py-1.5 rounded hover:bg-teal-50">Dev</button>
                                <button onClick={() => handleUseExample('marketing')} className="flex-1 text-xs bg-white border border-teal-200 py-1.5 rounded hover:bg-teal-50">Marketing</button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('hiringAssistant.jdLabel')}</label>
                            <textarea
                                rows={10}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-blue focus:border-teal-blue sm:text-sm"
                                placeholder={t('hiringAssistant.jdPlaceholder')}
                            />
                            {/* Upload JD Overlay Button */}
                            <div {...getJdRootProps()} className="absolute top-6 right-6 cursor-pointer" title={t('hiringAssistant.jdDrafter.uploadButton')}>
                                <input {...getJdInputProps()} />
                                <svg className={`w-5 h-5 text-gray-400 hover:text-teal-600 ${isUploadingJd ? 'animate-spin text-teal-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('hiringAssistant.uploadLabel')}</label>
                            <div 
                                {...getResumeRootProps()} 
                                className={`p-8 border-2 border-dashed rounded-md cursor-pointer text-center transition-colors ${
                                    isResumeDragActive ? 'border-teal-blue bg-teal-50' : 'border-gray-300 hover:border-teal-blue'
                                }`}
                            >
                                <input {...getResumeInputProps()} />
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">{t('hiringAssistant.uploadPlaceholder')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-2">
                        {isLoading && (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-blue mb-2"></div>
                                    <p className="text-teal-dark font-medium">{t('hiringAssistant.analyzing')}</p>
                                    {analyzingFile && <p className="text-sm text-gray-500 mt-1">Processing: {analyzingFile}</p>}
                                </div>
                            </div>
                        )}

                        {candidates.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-teal-dark mb-4">{t('hiringAssistant.resultsTitle')}</h3>
                                {candidates
                                    .slice() // Create a shallow copy before sorting to avoid mutating state directly
                                    .sort((a, b) => b.matchScore - a.matchScore) 
                                    .map(candidate => (
                                    <div key={candidate.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                        <div 
                                            className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setExpandedCandidateId(expandedCandidateId === candidate.id ? null : candidate.id)}
                                        >
                                            <div className="flex-grow">
                                                <h4 className="text-lg font-bold text-teal-dark">{candidate.name}</h4>
                                                <p className="text-xs text-gray-500">{candidate.fileName}</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">{t('hiringAssistant.score')}</div>
                                                    <div className={`text-xl font-bold ${candidate.matchScore >= 80 ? 'text-green-600' : candidate.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {candidate.matchScore}%
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(candidate.status)}`}>
                                                    {t(`hiringAssistant.${candidate.status}`)}
                                                </span>
                                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedCandidateId === candidate.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {expandedCandidateId === candidate.id && (
                                            <div className="p-6 border-t border-gray-100 bg-gray-50 animate-fade-in">
                                                <p className="text-gray-700 mb-4 leading-relaxed">{candidate.summary}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L9 10.586l-2-2z" clipRule="evenodd"/></svg>
                                                            {t('hiringAssistant.keySkills')}
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {candidate.keySkills.map(skill => (
                                                                <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-red-700 mb-2 flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                                                            {t('hiringAssistant.missingSkills')}
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {candidate.missingSkills.map(skill => (
                                                                <span key={skill} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded border border-red-200">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h5 className="font-semibold text-teal-800 mb-3">{t('hiringAssistant.interviewQuestions')}</h5>
                                                    <ul className="space-y-2">
                                                        {candidate.interviewQuestions?.map((q, i) => (
                                                            <li key={i} className="flex items-start text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 shadow-sm">
                                                                <span className="text-teal-500 font-bold mr-2">{i+1}.</span>
                                                                {q}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isLoading && candidates.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No candidates analyzed yet.</p>
                                <p className="text-gray-400 text-sm">Upload resumes to see the AI ranking.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HiringAssistant;
