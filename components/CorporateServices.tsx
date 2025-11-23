
import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import { AppState, useLanguage } from '../types';
import DocumentDisplay from './ReportDisplay';

interface CorporateServicesProps {
    onGenerateNames: (keywords: string, companyType: string) => void;
    onDraftArticles: (query: AppState['corporateServices_articlesQuery']) => void;
    onAnswerQuestion: (query: string) => void;
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
    nameQuery: string;
    setNameQuery: (value: string) => void;
    generatedNames: string[];
    articlesQuery: AppState['corporateServices_articlesQuery'];
    setArticlesQuery: (value: AppState['corporateServices_articlesQuery']) => void;
    generatedArticles: string;
    complianceQuery: string;
    setComplianceQuery: (value: string) => void;
    complianceAnswer: string;
    // Setters for restoring state from drafts
    setGeneratedArticles: (text: string) => void;
    setGeneratedNames: (names: string[]) => void;
    setComplianceAnswer: (text: string) => void;
}

interface SavedCorporateDraft {
    id: string;
    name: string;
    date: string;
    query: AppState['corporateServices_articlesQuery'];
    content: string;
}

const CorporateServices: React.FC<CorporateServicesProps> = ({
    onGenerateNames, onDraftArticles, onAnswerQuestion,
    isLoading, error, isQuotaExhausted,
    nameQuery, setNameQuery, generatedNames,
    articlesQuery, setArticlesQuery, generatedArticles,
    complianceQuery, setComplianceQuery, complianceAnswer,
    setGeneratedArticles, setGeneratedNames, setComplianceAnswer
}) => {
    const { t } = useLanguage();
    const [activeTool, setActiveTool] = useState<'names' | 'articles' | 'qa' | null>(null);
    const [savedDrafts, setSavedDrafts] = useState<SavedCorporateDraft[]>([]);
    const [showSavedDrafts, setShowSavedDrafts] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dadgar-corporate-drafts');
        if (saved) {
            try {
                setSavedDrafts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved corporate drafts", e);
            }
        }
    }, []);

    const handleArticlesQueryChange = (field: keyof typeof articlesQuery, value: string) => {
        setArticlesQuery(produce(articlesQuery, draft => {
            draft[field] = value;
        }));
    };

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveTool('names');
        onGenerateNames(nameQuery, articlesQuery.type);
    };

    const handleArticlesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveTool('articles');
        onDraftArticles(articlesQuery);
    };

    const handleQASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveTool('qa');
        onAnswerQuestion(complianceQuery);
    };

    const handleSaveDraft = () => {
        if (!generatedArticles) return;
        const newDraft: SavedCorporateDraft = {
            id: Date.now().toString(),
            name: articlesQuery.name || 'Untitled Company',
            date: new Date().toLocaleDateString(),
            query: articlesQuery,
            content: generatedArticles
        };
        const updatedDrafts = [newDraft, ...savedDrafts];
        setSavedDrafts(updatedDrafts);
        localStorage.setItem('dadgar-corporate-drafts', JSON.stringify(updatedDrafts));
        setShowSavedDrafts(true);
    };

    const handleLoadDraft = (draft: SavedCorporateDraft) => {
        setArticlesQuery(draft.query);
        setGeneratedArticles(draft.content);
        setActiveTool('articles');
        // Scroll to document
        setTimeout(() => {
            document.getElementById('generated-articles-display')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleDeleteDraft = (id: string) => {
        const updatedDrafts = savedDrafts.filter(d => d.id !== id);
        setSavedDrafts(updatedDrafts);
        localStorage.setItem('dadgar-corporate-drafts', JSON.stringify(updatedDrafts));
    };

    return (
        <section id="corporate-services" className="py-12 sm:py-16 animate-fade-in">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold text-white">{t('corporateServices.title')}</h1>
                <p className="mt-4 text-lg text-gray-400">{t('corporateServices.subtitle')}</p>
            </div>
            
            <div className="space-y-12 max-w-5xl mx-auto">
                {/* AI Tool 1: Name Generator */}
                <div className="bg-brand-blue/30 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-brand-blue/50">
                    <h2 className="text-2xl font-bold mb-2 text-white">{t('corporateServices.nameGenerator.title')}</h2>
                    <p className="text-gray-400 mb-6">{t('corporateServices.nameGenerator.description')}</p>
                    <form onSubmit={handleNameSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="company-keywords" className="block text-sm font-medium text-gray-300">{t('corporateServices.nameGenerator.keywordsLabel')}</label>
                                <input type="text" id="company-keywords" value={nameQuery} onChange={e => setNameQuery(e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white" placeholder={t('corporateServices.nameGenerator.keywordsPlaceholder')} />
                            </div>
                            <div>
                                <label htmlFor="company-type" className="block text-sm font-medium text-gray-300">{t('corporateServices.nameGenerator.typeLabel')}</label>
                                <select id="company-type" value={articlesQuery.type} onChange={e => handleArticlesQueryChange('type', e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white">
                                    {Object.entries(t('corporateServices.nameGenerator.types')).map(([key, value]) => (
                                        <option key={key} value={key}>{value as string}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <button type="submit" disabled={isLoading || isQuotaExhausted || !nameQuery} className="w-full py-3 px-4 rounded-md text-brand-blue bg-brand-gold hover:bg-yellow-200 disabled:bg-brand-gold/50">{isLoading && activeTool === 'names' ? t('corporateServices.nameGenerator.generating') : t('corporateServices.nameGenerator.buttonText')}</button>
                        </div>
                    </form>
                    { (isLoading && activeTool === 'names') && <div className="text-center p-4 text-gray-400">{t('corporateServices.nameGenerator.generating')}</div> }
                    { (error && activeTool === 'names') && <div className="mt-4 text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div> }
                    { generatedNames.length > 0 && activeTool === 'names' && (
                        <div className="mt-6 animate-fade-in">
                            <h3 className="font-semibold text-white">{t('corporateServices.nameGenerator.resultsTitle')}</h3>
                            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {generatedNames.map((name, index) => <li key={index} className="bg-brand-blue/50 p-3 rounded-md text-gray-200">{name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>

                {/* AI Tool 2: Articles Drafter */}
                <div className="bg-brand-blue/30 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-brand-blue/50">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <h2 className="text-2xl font-bold text-white">{t('corporateServices.articlesDrafter.title')}</h2>
                             <p className="text-gray-400 mt-1">{t('corporateServices.articlesDrafter.description')}</p>
                        </div>
                        <button 
                            onClick={() => setShowSavedDrafts(!showSavedDrafts)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-gold border border-brand-gold/50 rounded-md hover:bg-brand-gold/10 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            Saved Drafts ({savedDrafts.length})
                        </button>
                    </div>

                    {showSavedDrafts && savedDrafts.length > 0 && (
                        <div className="mb-8 p-4 bg-brand-blue/50 rounded-lg border border-brand-blue/70 animate-fade-in">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Your Saved Documents</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {savedDrafts.map(draft => (
                                    <div key={draft.id} className="flex justify-between items-center bg-brand-blue/70 p-3 rounded-md border border-brand-blue hover:border-brand-gold/30 transition-colors">
                                        <div className="overflow-hidden">
                                            <h4 className="text-white font-medium truncate">{draft.name}</h4>
                                            <p className="text-xs text-gray-400">{draft.date}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleLoadDraft(draft)} className="px-3 py-1 text-xs bg-brand-gold text-brand-blue rounded hover:bg-yellow-200">Load</button>
                                            <button onClick={() => handleDeleteDraft(draft.id)} className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleArticlesSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="articles-name" className="block text-sm font-medium text-gray-300">{t('corporateServices.articlesDrafter.nameLabel')}</label>
                                <input type="text" id="articles-name" value={articlesQuery.name} onChange={e => handleArticlesQueryChange('name', e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white" placeholder={t('corporateServices.articlesDrafter.namePlaceholder')} />
                            </div>
                             <div>
                                <label htmlFor="articles-capital" className="block text-sm font-medium text-gray-300">{t('corporateServices.articlesDrafter.capitalLabel')}</label>
                                <input type="text" id="articles-capital" value={articlesQuery.capital} onChange={e => handleArticlesQueryChange('capital', e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white" placeholder={t('corporateServices.articlesDrafter.capitalPlaceholder')} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="articles-activity" className="block text-sm font-medium text-gray-300">{t('corporateServices.articlesDrafter.activityLabel')}</label>
                            <textarea id="articles-activity" rows={4} value={articlesQuery.activity} onChange={e => handleArticlesQueryChange('activity', e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white" placeholder={t('corporateServices.articlesDrafter.activityPlaceholder')} />
                        </div>
                        <button type="submit" disabled={isLoading || isQuotaExhausted || !articlesQuery.name || !articlesQuery.activity || !articlesQuery.capital} className="w-full py-3 px-4 rounded-md text-brand-blue bg-brand-gold hover:bg-yellow-200 disabled:bg-brand-gold/50">{isLoading && activeTool === 'articles' ? t('reportDisplay.generating') : t('corporateServices.articlesDrafter.buttonText')}</button>
                    </form>
                </div>
                {(generatedArticles || (isLoading && activeTool === 'articles') || (error && activeTool === 'articles')) && (
                    <div id="generated-articles-display" className="bg-brand-blue/30 rounded-lg shadow-lg backdrop-blur-sm border border-brand-blue/50">
                        <DocumentDisplay
                            generatedDocument={generatedArticles}
                            isLoading={isLoading && activeTool === 'articles'}
                            error={activeTool === 'articles' ? error : null}
                        />
                         {!isLoading && generatedArticles && (
                            <div className="p-4 border-t border-brand-blue/50 flex justify-end">
                                <button 
                                    onClick={handleSaveDraft}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                    Save Draft
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* AI Tool 3: Compliance Q&A */}
                <div className="bg-brand-blue/30 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-brand-blue/50">
                    <h2 className="text-2xl font-bold mb-2 text-white">{t('corporateServices.complianceQA.title')}</h2>
                    <p className="text-gray-400 mb-6">{t('corporateServices.complianceQA.description')}</p>
                    <form onSubmit={handleQASubmit} className="space-y-4">
                         <div>
                            <label htmlFor="qa-query" className="block text-sm font-medium text-gray-300">{t('corporateServices.complianceQA.queryLabel')}</label>
                            <textarea id="qa-query" rows={3} value={complianceQuery} onChange={e => setComplianceQuery(e.target.value)} className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md py-2 px-3 focus:ring-brand-gold focus:border-brand-gold text-white" placeholder={t('corporateServices.complianceQA.queryPlaceholder')} />
                        </div>
                         <button type="submit" disabled={isLoading || isQuotaExhausted || !complianceQuery} className="w-full py-3 px-4 rounded-md text-brand-blue bg-brand-gold hover:bg-yellow-200 disabled:bg-brand-gold/50">{isLoading && activeTool === 'qa' ? t('corporateServices.complianceQA.gettingAnswer') : t('corporateServices.complianceQA.buttonText')}</button>
                    </form>
                    { (isLoading && activeTool === 'qa') && <div className="text-center p-4 text-gray-400">{t('corporateServices.complianceQA.gettingAnswer')}</div> }
                    { (error && activeTool === 'qa') && <div className="mt-4 text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div> }
                    { complianceAnswer && activeTool === 'qa' && (
                        <div className="mt-6 p-4 bg-brand-blue/50 border border-brand-blue/70 rounded-md animate-fade-in">
                            <p className="text-gray-200 whitespace-pre-wrap">{complianceAnswer}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CorporateServices;
