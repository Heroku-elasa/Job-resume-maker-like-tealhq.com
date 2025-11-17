import React, { useState, useCallback } from 'react';
import { produce } from 'immer';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { JobApplication, JobDetails, useLanguage, JobApplicationStatus } from '../types';
import * as geminiService from '../services/geminiService';
import * as dbService from '../services/dbService';
import { marked } from 'marked';

interface JobAssistantProps {
    applications: JobApplication[];
    currentUserCv: string;
    setCurrentUserCv: (cv: string) => void;
    onAddApplication: (app: JobApplication) => Promise<void>;
    onUpdateApplication: (app: JobApplication) => Promise<void>;
    handleApiError: (err: unknown) => string;
    isQuotaExhausted: boolean;
}

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.type !== 'text/plain' && file.type !== 'text/markdown') {
             reject(new Error("UNSUPPORTED_FILE_TYPE"));
             return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};


const JobAssistant: React.FC<JobAssistantProps> = ({ 
    applications, currentUserCv, setCurrentUserCv, 
    onAddApplication, onUpdateApplication, handleApiError, isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'apply' | 'dashboard' | 'cv'>('apply');
    const [jobUrl, setJobUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    
    const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [linkedInUrl, setLinkedInUrl] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isParsingCv, setIsParsingCv] = useState(false);

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
                setCurrentUserCv('');
            } finally {
                setIsParsingCv(false);
            }
        }
    }, [setCurrentUserCv, t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'text/markdown': ['.md'] },
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
                lastUpdated: Date.now()
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
            <div className="bg-brand-blue/30 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-brand-blue/50 space-y-4">
                <h3 className="text-xl font-bold text-white">{t('jobAssistant.apply.title')}</h3>
                 <div>
                    <label htmlFor="job-url" className="block text-sm font-medium text-gray-300">{t('jobAssistant.apply.jobUrlLabel')}</label>
                    <input type="url" id="job-url" value={jobUrl} onChange={e => setJobUrl(e.target.value)} className="mt-1 w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-white" placeholder={t('jobAssistant.apply.jobUrlPlaceholder')} />
                </div>
                <div className="relative flex items-center"><div className="flex-grow border-t border-brand-blue/50"></div><span className="mx-4 text-xs text-gray-400">OR</span><div className="flex-grow border-t border-brand-blue/50"></div></div>
                 <div>
                    <label htmlFor="job-desc" className="block text-sm font-medium text-gray-300">{t('jobAssistant.apply.jobDescLabel')}</label>
                    <textarea id="job-desc" rows={5} value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="mt-1 w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-white" placeholder={t('jobAssistant.apply.jobDescPlaceholder')} />
                </div>
                <button onClick={handleGenerate} disabled={isLoading || isQuotaExhausted} className="w-full py-3 px-4 rounded-md text-brand-blue bg-brand-gold hover:bg-yellow-200 disabled:bg-brand-gold/50">{t('jobAssistant.apply.generateButton')}</button>
            </div>
            
             {isLoading && (
                <div className="text-center p-6 bg-brand-blue/30 rounded-lg">
                     <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-brand-gold mx-auto"></div>
                     <p className="mt-3 text-gray-300">{loadingMessage}</p>
                </div>
            )}
            
            {error && !currentApplication && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}

            {currentApplication && (
                <div className="bg-brand-blue/30 rounded-lg p-6 shadow-lg animate-fade-in space-y-6">
                    <h3 className="text-xl font-bold text-white">{t('jobAssistant.preview.title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <h4 className="font-semibold text-brand-gold">{t('jobAssistant.preview.resume')}</h4>
                           <textarea value={currentApplication.tailoredResume} onChange={e => setCurrentApplication(produce(currentApplication, d => {d.tailoredResume = e.target.value}))} rows={15} className="w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-sm text-white" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="font-semibold text-brand-gold">{t('jobAssistant.preview.coverLetter')}</h4>
                           <textarea value={currentApplication.coverLetter} onChange={e => setCurrentApplication(produce(currentApplication, d => {d.coverLetter = e.target.value}))} rows={15} className="w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-sm text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-brand-blue/70">
                        <button onClick={handleSendApproval} disabled={isLoading || currentApplication.status !== 'draft'} className="flex-1 py-2 px-4 rounded-md bg-green-600 text-white disabled:bg-gray-600">{t('jobAssistant.preview.whatsappButton')}</button>
                        <button onClick={handleApply} disabled={isLoading || currentApplication.status === 'applied'} className="flex-1 py-2 px-4 rounded-md bg-blue-600 text-white disabled:bg-gray-600">{t('jobAssistant.preview.applyButton')}</button>
                    </div>
                    {currentApplication.status === 'pending_approval' && <p className="text-center text-yellow-400 animate-pulse">{t('jobAssistant.status.approvalWaiting')}</p>}
                </div>
            )}
        </div>
    );
    
    const renderDashboardTab = () => (
        <div className="bg-brand-blue/30 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-brand-blue/50">
            <h3 className="text-xl font-bold text-white mb-4">{t('jobAssistant.dashboard.title')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-brand-blue/50"><tr><th className="px-4 py-3">{t('jobAssistant.dashboard.jobTitle')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.company')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.date')}</th><th className="px-4 py-3">{t('jobAssistant.dashboard.status')}</th></tr></thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} className="border-b border-brand-blue/50 hover:bg-brand-blue/40">
                                <td className="px-4 py-3 font-medium text-white truncate max-w-xs">{app.jobTitle}</td>
                                <td className="px-4 py-3">{app.company}</td>
                                <td className="px-4 py-3">{new Date(app.lastUpdated).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplicationStatus)}
                                        className={`w-full text-xs font-semibold text-white rounded-md border-transparent focus:ring-2 focus:ring-brand-gold focus:border-transparent ${getStatusColor(app.status)}`}
                                        style={{ WebkitAppearance: 'none', appearance: 'none', paddingRight: '2rem', backgroundPosition: `right 0.5rem center`, backgroundRepeat: 'no-repeat', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                                    >
                                        {allStatuses.map(statusKey => (
                                            <option key={statusKey} value={statusKey} className="bg-brand-blue text-white">
                                                {t(`jobAssistant.status.${statusKey}`)}
                                            </option>
                                        ))}
                                    </select>
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
         <div className="bg-brand-blue/30 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-brand-blue/50 space-y-4">
             <h3 className="text-xl font-bold text-white">{t('jobAssistant.cv.title')}</h3>
             <p className="text-gray-400 text-sm">{t('jobAssistant.cv.description')}</p>

              <div className="bg-brand-blue/50 p-4 rounded-lg border border-brand-blue/70 space-y-3">
                <label htmlFor="linkedin-url" className="block text-sm font-medium text-gray-300">{t('jobAssistant.cv.linkedinLabel')}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="url" id="linkedin-url" value={linkedInUrl} onChange={e => setLinkedInUrl(e.target.value)} className="flex-grow bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-white" placeholder={t('jobAssistant.cv.linkedinPlaceholder')} />
                    <button onClick={handleLinkedInSync} disabled={isSyncing} className="sm:w-auto w-full px-4 py-2 rounded-md text-brand-blue bg-brand-gold hover:bg-yellow-200 disabled:bg-brand-gold/50 flex items-center justify-center">
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
            
             <div className="relative flex items-center"><div className="flex-grow border-t border-brand-blue/50"></div><span className="mx-4 text-xs text-gray-400">OR</span><div className="flex-grow border-t border-brand-blue/50"></div></div>

             <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-md cursor-pointer text-center ${isDragActive ? 'border-brand-gold bg-brand-blue/70' : 'border-brand-blue/70'}`}>
                <input {...getInputProps()} />
                {isParsingCv ? (
                    <p className="text-gray-400 animate-pulse">{t('jobAssistant.cv.parsing')}</p>
                ) : cvFile ? (
                    <p className="text-green-400">{cvFile.name}</p>
                ) : (
                    <p className="text-gray-400">{t('jobAssistant.cv.dropzone')}</p>
                )}
            </div>
            
            {error && activeTab === 'cv' && <div className="text-red-400 p-2 bg-red-900/30 rounded-md text-sm text-center">{error}</div>}
             
             <textarea value={currentUserCv} onChange={e => setCurrentUserCv(e.target.value)} rows={20} className="w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 text-sm text-white" placeholder={t('jobAssistant.cv.placeholder')} />
         </div>
    );

    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-white">{t('header.jobAssistant')}</h1>
                    <p className="mt-4 text-lg text-gray-400">{t('jobAssistant.subtitle')}</p>
                </div>
                
                <div className="border-b border-brand-blue/50 mb-8">
                    <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
                        <button onClick={() => setActiveTab('apply')} className={`${activeTab === 'apply' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.apply')}</button>
                        <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.dashboard')}</button>
                        <button onClick={() => setActiveTab('cv')} className={`${activeTab === 'cv' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>{t('jobAssistant.tabs.cv')}</button>
                    </nav>
                </div>

                {activeTab === 'apply' && renderApplyTab()}
                {activeTab === 'dashboard' && renderDashboardTab()}
                {activeTab === 'cv' && renderCvTab()}
            </div>
        </section>
    );
};

export default JobAssistant;