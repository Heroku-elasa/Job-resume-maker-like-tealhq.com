
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { produce } from 'immer';
import { nanoid } from 'nanoid';

// Component Imports
import SiteHeader from './components/Header';
import SiteFooter from './components/Footer';
import HomePage from './components/Hero';
import LegalDrafter from './components/LegalDrafter';
import LawyerFinder from './components/LawyerFinder';
import NewsSummarizer from './components/NewsSummarizer';
import CaseStrategist from './components/CaseStrategist';
import NotaryFinder from './components/NotaryFinder';
import WebAnalyzer from './components/WebAnalyzer';
import ContractAnalyzer from './components/ContractAnalyzer';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import ImageGenerator from './components/ImageGenerator';
import CorporateServices from './components/CorporateServices';
import InsuranceServices from './components/InsuranceServices';
import JobAssistant from './components/JobAssistant';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import AIGuideModal from './components/AIGuideModal';
import QuotaErrorModal from './components/QuotaErrorModal';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';

// Type and Service Imports
import { AppState, Checkpoint, PageKey, SaveStatus, useLanguage, Lawyer, Notary, LatLng, StrategyTask, IntentRoute, FilePart, DraftPreparationResult, AutoSaveData, JobApplication, JobDetails, ResumeAnalysisItem, ChatMessage, ResumeAnalysisResult } from './types';
import * as geminiService from './services/geminiService';
import * as dbService from './services/dbService';
import { REPORT_TYPES, RESUME_ANALYSIS_CRITERIA } from './constants';

const LOCAL_STORAGE_KEY = 'dadgar-ai-autosave';
const CHECKPOINTS_STORAGE_KEY = 'dadgar-ai-checkpoints';

const initialState: AppState = {
  page: 'resume_analyzer',
  document: '',
  form: {
    topic: '',
    description: '',
    docType: REPORT_TYPES[0].value,
  },
  lawyers: [],
  allLawyers: [],
  lawyerFinderKeywords: '',
  notaryFinderKeywords: '',
  foundNotaries: [],
  newsQuery: '',
  newsSummary: '',
  newsSources: [],
  strategyGoal: '',
  strategyResult: [],
  webAnalyzerUrl: '',
  webAnalyzerQuery: '',
  webAnalyzerResult: '',
  webAnalyzerSources: [],
  aiGuidePrompt: '',
  aiGuideResults: [],
  contractAnalyzerQuery: '',
  contractAnalysis: '',
  initialContractText: '',
  evidenceAnalyzerQuery: '',
  evidenceAnalysisResult: '',
  imageGenPrompt: '',
  imageGenAspectRatio: '1:1',
  generatedImage: '',
  corporateServices_nameQuery: '',
  corporateServices_generatedNames: [],
  corporateServices_articlesQuery: {
    name: '',
    type: 'llc',
    activity: '',
    capital: '',
  },
  corporateServices_generatedArticles: '',
  corporateServices_complianceQuery: '',
  corporateServices_complianceAnswer: '',
  insurance_policyQuery: '',
  insurance_policyAnalysis: '',
  insurance_initialPolicyText: '',
  insurance_claimQuery: {
    incidentType: '',
    description: '',
    policyNumber: '',
  },
  insurance_generatedClaim: '',
  insurance_recommendationQuery: '',
  insurance_recommendationAnswer: '',
  insurance_riskQuery: {
    assetType: '',
    description: '',
  },
  insurance_riskAssessmentResult: '',
  insurance_fraudQuery: {
    claimDescription: '',
  },
  insurance_fraudDetectionResult: '',
  insurance_autoClaimQuery: '',
  insurance_autoClaimResult: '',
  insurance_quoteQuery: {
    carModel: '',
    carYear: '',
    driverAge: '',
    drivingHistory: '',
  },
  insurance_quoteResult: '',
  insurance_lifeNeedsQuery: {
    age: '',
    income: '',
    dependents: '',
    debts: '',
    goals: '',
  },
  insurance_lifeNeedsResult: '',
  jobAssistant_applications: [],
  jobAssistant_currentUserCv: '',
  resumeAnalyzer_resumeText: '',
  resumeAnalyzer_analysisResult: null,
  resumeAnalyzer_chatHistory: [],
};

const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [state, setState] = useState<AppState>(initialState);
  const [savedLawyers, setSavedLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiError, setIsApiError] = useState<string | null>(null);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [isExecutingTask, setIsExecutingTask] = useState(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  
  const preparedSearchQueryRef = useRef<{ for: 'lawyer_finder' | 'notary_finder' | null; query: string }>({ for: null, query: '' });
  const [preparedSearchQuery, setPreparedSearchQuery] = useState(preparedSearchQueryRef.current);

  // Use a ref for currentApplicationId to pass to JobAssistant via state if needed, 
  // though JobAssistant manages its own "current" state usually. 
  // For Dashboard edit, we need to force JobAssistant to open a specific app.
  // We'll add a temporary state for "appToEdit"
  const [appToEdit, setAppToEdit] = useState<JobApplication | null>(null);

  const saveTimeout = useRef<number | null>(null);
  
  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.body.className = language === 'fa' 
      ? 'bg-teal-light font-iransans' 
      : 'bg-teal-light font-sans';
  }, [language]);


  const handleApiError = useCallback((err: unknown): string => {
    const error = err instanceof Error ? err : new Error(String(err));
    const lowerCaseMessage = error.message.toLowerCase();

    if (lowerCaseMessage.includes('quota')) {
      setIsQuotaExhausted(true);
      return t('quotaErrorModal.title');
    }
    return error.message;
  }, [t]);

  // --- Data Persistence ---
  useEffect(() => {
    geminiService.checkApiHealth().then(setIsApiHealthy);

    dbService.initDB().then(() => {
      dbService.getAllLawyers().then(allLawyers => {
        setState(produce(draft => { draft.allLawyers = allLawyers }));
      });
      dbService.getAllApplications().then(apps => {
        setState(produce(draft => { draft.jobAssistant_applications = apps }));
      });
    });

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedCheckpoints = localStorage.getItem(CHECKPOINTS_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData: AutoSaveData = JSON.parse(savedData);
        // Don't overwrite the initial state if empty
        setState(produce(draft => {
          Object.assign(draft, parsedData);
        }));
      } catch (e) {
        console.error("Failed to parse autosave data:", e);
      }
    }
    if (savedCheckpoints) {
      setCheckpoints(JSON.parse(savedCheckpoints));
    }
  }, []);
  
  // FIX: Moved handleAnalyzeResume before the useEffect that calls it to fix block-scoped variable error.
  const handleAnalyzeResume = useCallback(async (resumeText: string) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => {
      draft.resumeAnalyzer_resumeText = resumeText;
      draft.resumeAnalyzer_analysisResult = null;
      draft.resumeAnalyzer_chatHistory = [];
    }));
    try {
      const criteria = RESUME_ANALYSIS_CRITERIA.map(c => ({
          id: c.id,
          category: language === 'fa' ? c.category.fa : c.category.en,
          requirement: language === 'fa' ? c.requirement.fa : c.requirement.en
      }));
      const result = await geminiService.analyzeResume(resumeText, criteria, language);
      setState(produce(draft => { 
        draft.resumeAnalyzer_analysisResult = result;
        const initialBotMessage: ChatMessage = { role: 'model', text: t('resumeAnalyzer.chat.initialMessage') };
        draft.resumeAnalyzer_chatHistory.push(initialBotMessage);
      }));
    } catch (err) {
      const msg = handleApiError(err);
      setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  }, [language, t, handleApiError]);

  const triggerSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaveStatus('saving');
    saveTimeout.current = window.setTimeout(() => {
      const dataToSave: AutoSaveData = {
        topic: state.form.topic,
        description: state.form.description,
        docType: state.form.docType,
        lawyerFinderKeywords: state.lawyerFinderKeywords,
        notaryFinderKeywords: state.notaryFinderKeywords,
        newsQuery: state.newsQuery,
        webAnalyzerUrl: state.webAnalyzerUrl,
        webAnalyzerQuery: state.webAnalyzerQuery,
        strategyGoal: state.strategyGoal,
        aiGuidePrompt: state.aiGuidePrompt,
        contractAnalyzerQuery: state.contractAnalyzerQuery,
        initialContractText: state.initialContractText,
        evidenceAnalyzerQuery: state.evidenceAnalyzerQuery,
        imageGenPrompt: state.imageGenPrompt,
        imageGenAspectRatio: state.imageGenAspectRatio,
        corporateServices_nameQuery: state.corporateServices_nameQuery,
        corporateServices_generatedNames: state.corporateServices_generatedNames,
        corporateServices_articlesQuery: state.corporateServices_articlesQuery,
        corporateServices_generatedArticles: state.corporateServices_generatedArticles,
        corporateServices_complianceQuery: state.corporateServices_complianceQuery,
        corporateServices_complianceAnswer: state.corporateServices_complianceAnswer,
        insurance_policyQuery: state.insurance_policyQuery,
        insurance_initialPolicyText: state.insurance_initialPolicyText,
        insurance_claimQuery: state.insurance_claimQuery,
        insurance_recommendationQuery: state.insurance_recommendationQuery,
        insurance_riskQuery: state.insurance_riskQuery,
        insurance_fraudQuery: state.insurance_fraudQuery,
        insurance_autoClaimQuery: state.insurance_autoClaimQuery,
        insurance_quoteQuery: state.insurance_quoteQuery,
        insurance_lifeNeedsQuery: state.insurance_lifeNeedsQuery,
        jobAssistant_currentUserCv: state.jobAssistant_currentUserCv,
        resumeAnalyzer_resumeText: state.resumeAnalyzer_resumeText,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  }, [state]);

  useEffect(() => {
    triggerSave();
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [triggerSave]);


  // --- Checkpoint Management ---
  // ... (no changes needed)

  // --- Page Navigation ---
  const setPage = (page: 'home' | PageKey) => {
    setState(produce(draft => { draft.page = page; }));
    setIsApiError(null); // Clear errors on page change
  };
  
  // --- API Handlers ---
  const handleGenerateReport = async (topic: string, description: string, docType: string, useThinkingMode: boolean) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => {
      draft.document = '';
      draft.form = { topic, description, docType };
    }));

    const prompt = t(`reportPrompts.${docType}`).replace('{topic}', topic).replace('{description}', description);
    try {
      const generator = geminiService.generateReportStream(prompt, useThinkingMode);
      let fullReport = '';
      for await (const chunk of generator) {
        fullReport += chunk;
        setState(produce(draft => { draft.document = fullReport; }));
      }
    } catch (err) {
      const msg = handleApiError(err);
      setIsApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResumeChat = async (userMessage: string) => {
    const newUserMessage: ChatMessage = { role: 'user', text: userMessage };
    const currentHistory = [...state.resumeAnalyzer_chatHistory, newUserMessage];
    
    setState(produce(draft => {
        draft.resumeAnalyzer_chatHistory = currentHistory;
    }));
    setIsLoading(true);
    setIsApiError(null);

    try {
        const missingItems = state.resumeAnalyzer_analysisResult
          ? state.resumeAnalyzer_analysisResult.analysis.filter(item => item.status === 'missing' || item.status === 'implicit')
          : [];
        const { reply, updatedItem } = await geminiService.continueResumeChat(currentHistory, missingItems);
        
        setState(produce(draft => {
            draft.resumeAnalyzer_chatHistory.push({ role: 'model', text: reply });
            if (updatedItem && draft.resumeAnalyzer_analysisResult) {
                const index = draft.resumeAnalyzer_analysisResult.analysis.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    draft.resumeAnalyzer_analysisResult.analysis[index] = updatedItem;
                }
            }
        }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
        setState(produce(draft => {
            draft.resumeAnalyzer_chatHistory.push({ role: 'model', text: `Sorry, an error occurred: ${msg}` });
        }));
    } finally {
        setIsLoading(false);
    }
};

  const handleLawyersFound = async (lawyers: Lawyer[]) => {
      await dbService.addLawyers(lawyers);
      const all = await dbService.getAllLawyers();
      setState(produce(draft => { draft.allLawyers = all; }));
  };

  const handleClearAllDbLawyers = async () => {
      await dbService.clearAllLawyers();
      setState(produce(draft => { draft.allLawyers = []; }));
  };

  const handleFindNotaries = async (keywords: string, location: LatLng | null): Promise<string | null> => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { draft.notaryFinderKeywords = keywords; draft.foundNotaries = []; }));
    
    let prompt = t('notaryFinder.prompt').replace('{keywords}', keywords);
      if (location) {
        prompt += ` The search should be prioritized for offices near my current location.`;
    }

    try {
        const { text } = await geminiService.findNotaries(prompt, location);
        return text;
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
        return null;
    } finally {
        setIsLoading(false);
    }
  };

  const handleSummarizeNews = async (query: string, useThinkingMode: boolean) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.newsQuery = query; draft.newsSummary = ''; draft.newsSources = []; }));
      const prompt = t('newsSummarizer.prompt').replace('{query}', query);
      try {
          const { text, sources } = await geminiService.summarizeNews(prompt, useThinkingMode);
          setState(produce(draft => { draft.newsSummary = text; draft.newsSources = sources; }));
      } catch (err) {
          const msg = handleApiError(err);
          setIsApiError(msg);
      } finally {
          setIsLoading(false);
      }
  };

  const handleGenerateStrategy = async (goal: string, useThinkingMode: boolean) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.strategyGoal = goal; draft.strategyResult = []; }));
      try {
          const result = await geminiService.generateStrategy(goal, t('caseStrategist.prompt'), useThinkingMode);
          setState(produce(draft => { draft.strategyResult = result; }));
      } catch (err) {
          const msg = handleApiError(err);
          setIsApiError(msg);
      } finally {
          setIsLoading(false);
      }
  };

  const handleExecuteStrategyTask = async (task: StrategyTask) => {
      setIsExecutingTask(true);
      setIsApiError(null);
      try {
          const docTypeOptions = REPORT_TYPES.map(t => t.value).join(', ');
          const result = await geminiService.prepareDraftFromTask(task, t('caseStrategist.executeTaskPrompt'), docTypeOptions);
          
          setState(produce(draft => {
            draft.form.topic = result.topic;
            draft.form.description = result.description;
            // Ensure the docType is valid, otherwise default
            draft.form.docType = REPORT_TYPES.some(dt => dt.value === result.docType) ? result.docType : REPORT_TYPES[0].value;
            draft.page = 'legal_drafter';
          }));
          window.scrollTo(0, 0);

      } catch (err) {
          const msg = handleApiError(err);
          // Show error as an alert because we are navigating away
          alert(`Error preparing draft: ${msg}`);
      } finally {
          setIsExecutingTask(false);
      }
  };
  
  const handleAnalyzeWebPage = async (url: string, query: string, useThinkingMode: boolean) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { 
        draft.webAnalyzerUrl = url; 
        draft.webAnalyzerQuery = query; 
        draft.webAnalyzerResult = ''; 
        draft.webAnalyzerSources = []; 
    }));
    const prompt = t('webAnalyzer.prompt').replace('{url}', url).replace('{query}', query);
    try {
        const { text, sources } = await geminiService.analyzeWebPage(prompt, useThinkingMode);
        setState(produce(draft => { draft.webAnalyzerResult = text; draft.webAnalyzerSources = sources; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRouteUserIntent = async (goal: string) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.aiGuidePrompt = goal; draft.aiGuideResults = []; }));
      try {
        const results = await geminiService.routeUserIntent(goal, t('aiGuide.prompt'));
        setState(produce(draft => { draft.aiGuideResults = results; }));
      } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
      } finally {
        setIsLoading(false);
      }
  };
  
  const handleSelectRoute = async (page: PageKey) => {
      let queryForPage = '';
      if (page === 'legal_drafter' || page === 'case_strategist') {
          queryForPage = state.aiGuidePrompt;
      }
      
      setState(produce(draft => {
          draft.page = page;
          if (page === 'case_strategist') draft.strategyGoal = queryForPage;
      }));
      setIsAIGuideOpen(false);
  };

  const handleAnalyzeContract = async (content: { file?: FilePart; text?: string }, userQuery: string, useThinkingMode: boolean) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => {
        draft.contractAnalyzerQuery = userQuery;
        if (content.text) draft.initialContractText = content.text;
        draft.contractAnalysis = '';
    }));
    try {
        const result = await geminiService.analyzeContract(content, userQuery, t('contractAnalyzer.prompt'), useThinkingMode);
        setState(produce(draft => { draft.contractAnalysis = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAnalyzeEvidence = async (content: { file: FilePart }, userQuery: string, useThinkingMode: boolean) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => {
        draft.evidenceAnalyzerQuery = userQuery;
        draft.evidenceAnalysisResult = '';
    }));
    try {
        const result = await geminiService.analyzeImage(content, userQuery, t('evidenceAnalyzer.prompt'), useThinkingMode);
        setState(produce(draft => { draft.evidenceAnalysisResult = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string, aspectRatio: string) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { 
        draft.imageGenPrompt = prompt;
        draft.imageGenAspectRatio = aspectRatio;
        draft.generatedImage = '';
    }));
    try {
        const result = await geminiService.generateImage(prompt, aspectRatio);
        setState(produce(draft => { draft.generatedImage = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateCompanyNames = async (keywords: string, companyType: string) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { draft.corporateServices_nameQuery = keywords; draft.corporateServices_generatedNames = []; }));
    const prompt = t('corporateServices.nameGenerator.prompt').replace('{keywords}', keywords).replace('{type}', companyType);
    try {
        const result = await geminiService.generateJsonArray(prompt);
        setState(produce(draft => { draft.corporateServices_generatedNames = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDraftArticles = async (query: AppState['corporateServices_articlesQuery']) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { draft.corporateServices_articlesQuery = query; draft.corporateServices_generatedArticles = ''; }));
    const prompt = t('corporateServices.articlesDrafter.prompt').replace('{name}', query.name).replace('{type}', query.type).replace('{activity}', query.activity).replace('{capital}', query.capital);
    try {
        const result = await geminiService.generateText(prompt);
        setState(produce(draft => { draft.corporateServices_generatedArticles = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAnswerComplianceQuestion = async (query: string) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { draft.corporateServices_complianceQuery = query; draft.corporateServices_complianceAnswer = ''; }));
    const prompt = t('corporateServices.complianceQA.prompt').replace('{question}', query);
    try {
        const result = await geminiService.generateText(prompt);
        setState(produce(draft => { draft.corporateServices_complianceAnswer = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAnalyzePolicy = async (content: { file?: FilePart; text?: string }, userQuery: string, useThinkingMode: boolean) => {
    setIsLoading(true);
    setIsApiError(null);
    setState(produce(draft => { draft.insurance_policyQuery = userQuery; draft.insurance_policyAnalysis = ''; if(content.text) draft.insurance_initialPolicyText = content.text; }));
    try {
        const result = await geminiService.analyzeContract(content, userQuery, t('insuranceServices.policyAnalyzer.prompt'), useThinkingMode);
        setState(produce(draft => { draft.insurance_policyAnalysis = result; }));
    } catch (err) {
        const msg = handleApiError(err);
        setIsApiError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDraftClaim = async (query: AppState['insurance_claimQuery']) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_claimQuery = query; draft.insurance_generatedClaim = ''; }));
      const prompt = t('insuranceServices.claimDrafter.prompt').replace('{type}', query.incidentType).replace('{policy}', query.policyNumber).replace('{description}', query.description);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_generatedClaim = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleRecommendInsurance = async (query: string) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_recommendationQuery = query; draft.insurance_recommendationAnswer = ''; }));
      const prompt = t('insuranceServices.recommender.prompt').replace('{needs}', query);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_recommendationAnswer = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleAssessRisk = async (query: AppState['insurance_riskQuery']) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_riskQuery = query; draft.insurance_riskAssessmentResult = ''; }));
      const prompt = t('insuranceServices.riskAssessor.prompt').replace('{asset}', query.assetType).replace('{description}', query.description);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_riskAssessmentResult = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleDetectFraud = async (query: AppState['insurance_fraudQuery']) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_fraudQuery = query; draft.insurance_fraudDetectionResult = ''; }));
      const prompt = t('insuranceServices.fraudDetector.prompt').replace('{description}', query.claimDescription);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_fraudDetectionResult = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleAutoClaimAssess = async (content: { file: FilePart }, userQuery: string, useThinkingMode: boolean) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_autoClaimQuery = userQuery; draft.insurance_autoClaimResult = ''; }));
      try {
          const result = await geminiService.analyzeImage(content, userQuery, t('insuranceServices.autoClaimAssessor.prompt'), useThinkingMode);
          setState(produce(draft => { draft.insurance_autoClaimResult = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleSimulateQuote = async (query: AppState['insurance_quoteQuery']) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_quoteQuery = query; draft.insurance_quoteResult = ''; }));
      const prompt = t('insuranceServices.quoteSimulator.prompt').replace('{model}', query.carModel).replace('{year}', query.carYear).replace('{age}', query.driverAge).replace('{history}', query.drivingHistory);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_quoteResult = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };
  
  const handleAnalyzeLifeNeeds = async (query: AppState['insurance_lifeNeedsQuery']) => {
      setIsLoading(true);
      setIsApiError(null);
      setState(produce(draft => { draft.insurance_lifeNeedsQuery = query; draft.insurance_lifeNeedsResult = ''; }));
      const prompt = t('insuranceServices.lifeNeedsAnalyzer.prompt').replace('{age}', query.age).replace('{income}', query.income).replace('{dependents}', query.dependents).replace('{debts}', query.debts).replace('{goals}', query.goals);
      try {
          const result = await geminiService.generateText(prompt);
          setState(produce(draft => { draft.insurance_lifeNeedsResult = result; }));
      } catch(err) { setIsApiError(handleApiError(err)); } finally { setIsLoading(false); }
  };

  const handleUpdateApplication = useCallback(async (updatedApp: JobApplication) => {
      await dbService.updateApplication(updatedApp);
      setState(produce(draft => {
          const index = draft.jobAssistant_applications.findIndex(a => a.id === updatedApp.id);
          if (index !== -1) {
              draft.jobAssistant_applications[index] = updatedApp;
          }
      }));
  }, []);
  const handleAddApplication = useCallback(async (newApp: JobApplication) => {
      await dbService.addApplication(newApp);
      setState(produce(draft => {
          draft.jobAssistant_applications.push(newApp);
      }));
  }, []);

  const handleEditApplicationFromDashboard = (app: JobApplication) => {
      setAppToEdit(app);
      setPage('job_assistant');
  };


  const setSingleState = (key: keyof AppState, value: any) => {
    setState(produce(draft => {
      (draft as any)[key] = value;
    }));
  };
  
  const setNestedState = (parentKey: keyof AppState, childKey: string, value: any) => {
    setState(produce(draft => {
      (draft[parentKey] as any)[childKey] = value;
    }));
  };

  const renderPage = () => {
    // If we are in dashboard, we want it full width without standard headers
    if (state.page === 'dashboard') {
        return <Dashboard 
                  setPage={setPage} 
                  applications={state.jobAssistant_applications}
                  savedLawyers={savedLawyers}
                  generatedDocument={state.document}
                  onEditApplication={handleEditApplicationFromDashboard}
               />;
    }

    const pageProps = { setPage, onOpenAIGuide: () => setIsAIGuideOpen(true) };
    if (state.page === 'home') return <HomePage {...pageProps} />;
    
    // Wrap other pages in a standard container for consistent look
    const ToolWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <div className="bg-white text-teal-dark min-h-screen">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    );
    
    switch (state.page) {
      case 'legal_drafter':
        return <ToolWrapper><LegalDrafter
          onGenerate={handleGenerateReport}
          isLoading={isLoading}
          isComplete={!!state.document && !isLoading}
          topic={state.form.topic}
          description={state.form.description}
          docType={state.form.docType}
          setTopic={(v) => setNestedState('form', 'topic', v)}
          setDescription={(v) => setNestedState('form', 'description', v)}
          setDocType={(v) => setNestedState('form', 'docType', v)}
          generatedDocument={state.document}
          error={isApiError}
          isQuotaExhausted={isQuotaExhausted}
        /></ToolWrapper>;
      case 'lawyer_finder':
        return <ToolWrapper><LawyerFinder
            savedLawyers={savedLawyers}
            onSaveLawyer={(lawyer) => setSavedLawyers(produce(draft => { if (!draft.some(l => l.website === lawyer.website)) draft.push(lawyer); }))}
            onRemoveLawyer={(lawyer) => setSavedLawyers(draft => draft.filter(l => l.website !== lawyer.website))}
            onClearAllSaved={() => setSavedLawyers([])}
            onNoteChange={(index, note) => setSavedLawyers(produce(draft => { draft[index].notes = note; }))}
            keywords={state.lawyerFinderKeywords}
            setKeywords={(v) => setSingleState('lawyerFinderKeywords', v)}
            handleApiError={handleApiError}
            isQuotaExhausted={isQuotaExhausted}
            allLawyers={state.allLawyers}
            onLawyersFound={handleLawyersFound}
            onClearAllDbLawyers={handleClearAllDbLawyers}
            preparedSearchQuery={preparedSearchQuery}
            setPreparedSearchQuery={setPreparedSearchQuery}
            generatedDocument={state.document}
        /></ToolWrapper>;
      case 'news_summarizer':
        return <ToolWrapper><NewsSummarizer 
            onSummarize={handleSummarizeNews}
            query={state.newsQuery}
            setQuery={(v) => setSingleState('newsQuery', v)}
            summary={state.newsSummary}
            sources={state.newsSources}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
        /></ToolWrapper>;
      case 'case_strategist':
        return <ToolWrapper><CaseStrategist
            onGenerate={handleGenerateStrategy}
            goal={state.strategyGoal}
            setGoal={(v) => setSingleState('strategyGoal', v)}
            result={state.strategyResult}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
            onExecuteTask={handleExecuteStrategyTask}
            isExecutingTask={isExecutingTask}
        /></ToolWrapper>;
      case 'notary_finder':
        return <ToolWrapper><NotaryFinder
            onSearch={handleFindNotaries}
            keywords={state.notaryFinderKeywords}
            setKeywords={(v) => setSingleState('notaryFinderKeywords', v)}
            results={state.foundNotaries}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
            preparedSearchQuery={preparedSearchQuery}
            setPreparedSearchQuery={setPreparedSearchQuery}
            generatedDocument={state.document}
        /></ToolWrapper>;
      case 'web_analyzer':
        return <ToolWrapper><WebAnalyzer
            onAnalyze={handleAnalyzeWebPage}
            url={state.webAnalyzerUrl}
            setUrl={(v) => setSingleState('webAnalyzerUrl', v)}
            query={state.webAnalyzerQuery}
            setQuery={(v) => setSingleState('webAnalyzerQuery', v)}
            result={state.webAnalyzerResult}
            sources={state.webAnalyzerSources}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
        /></ToolWrapper>;
      case 'contract_analyzer':
        return <ToolWrapper><ContractAnalyzer
            onAnalyze={handleAnalyzeContract}
            analysisResult={state.contractAnalysis}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
            userQuery={state.contractAnalyzerQuery}
            setUserQuery={(v) => setSingleState('contractAnalyzerQuery', v)}
            initialText={state.initialContractText}
            setInitialText={(v) => setSingleState('initialContractText', v)}
        /></ToolWrapper>;
      case 'evidence_analyzer':
          return <ToolWrapper><EvidenceAnalyzer
            onAnalyze={handleAnalyzeEvidence}
            analysisResult={state.evidenceAnalysisResult}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
            userQuery={state.evidenceAnalyzerQuery}
            setUserQuery={(v) => setSingleState('evidenceAnalyzerQuery', v)}
          /></ToolWrapper>;
      case 'image_generator':
        return <ToolWrapper><ImageGenerator
            onGenerate={handleGenerateImage}
            prompt={state.imageGenPrompt}
            setPrompt={(v) => setSingleState('imageGenPrompt', v)}
            aspectRatio={state.imageGenAspectRatio}
            setAspectRatio={(v) => setSingleState('imageGenAspectRatio', v)}
            generatedImage={state.generatedImage}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
        /></ToolWrapper>;
      case 'corporate_services':
        return <ToolWrapper><CorporateServices
            onGenerateNames={handleGenerateCompanyNames}
            onDraftArticles={handleDraftArticles}
            onAnswerQuestion={handleAnswerComplianceQuestion}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
            nameQuery={state.corporateServices_nameQuery}
            setNameQuery={(v) => setSingleState('corporateServices_nameQuery', v)}
            generatedNames={state.corporateServices_generatedNames}
            articlesQuery={state.corporateServices_articlesQuery}
            setArticlesQuery={(v) => setSingleState('corporateServices_articlesQuery', v)}
            generatedArticles={state.corporateServices_generatedArticles}
            complianceQuery={state.corporateServices_complianceQuery}
            setComplianceQuery={(v) => setSingleState('corporateServices_complianceQuery', v)}
            complianceAnswer={state.corporateServices_complianceAnswer}
            setGeneratedArticles={(v) => setSingleState('corporateServices_generatedArticles', v)}
            setGeneratedNames={(v) => setSingleState('corporateServices_generatedNames', v)}
            setComplianceAnswer={(v) => setSingleState('corporateServices_complianceAnswer', v)}
        /></ToolWrapper>;
      case 'insurance_services':
        return <ToolWrapper><InsuranceServices
            onAnalyzePolicy={handleAnalyzePolicy}
            onDraftClaim={handleDraftClaim}
            onRecommendInsurance={handleRecommendInsurance}
            onAssessRisk={handleAssessRisk}
            onDetectFraud={handleDetectFraud}
            onAutoClaimAssess={handleAutoClaimAssess}
            onSimulateQuote={handleSimulateQuote}
            onAnalyzeLifeNeeds={handleAnalyzeLifeNeeds}
            isLoading={isLoading} error={isApiError} isQuotaExhausted={isQuotaExhausted}
            policyQuery={state.insurance_policyQuery} setPolicyQuery={v => setSingleState('insurance_policyQuery', v)} policyAnalysis={state.insurance_policyAnalysis} initialPolicyText={state.insurance_initialPolicyText} setInitialPolicyText={v => setSingleState('insurance_initialPolicyText', v)}
            claimQuery={state.insurance_claimQuery} setClaimQuery={v => setSingleState('insurance_claimQuery', v)} generatedClaim={state.insurance_generatedClaim}
            recommendationQuery={state.insurance_recommendationQuery} setRecommendationQuery={v => setSingleState('insurance_recommendationQuery', v)} recommendationAnswer={state.insurance_recommendationAnswer}
            riskQuery={state.insurance_riskQuery} setRiskQuery={v => setSingleState('insurance_riskQuery', v)} riskAssessmentResult={state.insurance_riskAssessmentResult}
            fraudQuery={state.insurance_fraudQuery} setFraudQuery={v => setSingleState('insurance_fraudQuery', v)} fraudDetectionResult={state.insurance_fraudDetectionResult}
            autoClaimQuery={state.insurance_autoClaimQuery} setAutoClaimQuery={v => setSingleState('insurance_autoClaimQuery', v)} autoClaimResult={state.insurance_autoClaimResult}
            quoteQuery={state.insurance_quoteQuery} setQuoteQuery={v => setSingleState('insurance_quoteQuery', v)} quoteResult={state.insurance_quoteResult}
            lifeNeedsQuery={state.insurance_lifeNeedsQuery} setLifeNeedsQuery={v => setSingleState('insurance_lifeNeedsQuery', v)} lifeNeedsResult={state.insurance_lifeNeedsResult}
        /></ToolWrapper>;
      case 'job_assistant':
          // Pass the appToEdit if set from Dashboard
          return <ToolWrapper><JobAssistant
            applications={state.jobAssistant_applications}
            currentUserCv={state.jobAssistant_currentUserCv}
            setCurrentUserCv={(cv) => setSingleState('jobAssistant_currentUserCv', cv)}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            handleApiError={handleApiError}
            isQuotaExhausted={isQuotaExhausted}
            initialAppToEdit={appToEdit} // Note: You'll need to add this prop to JobAssistant
            onClearAppToEdit={() => setAppToEdit(null)} // And this
           /></ToolWrapper>;
      case 'resume_analyzer':
          return <ToolWrapper><ResumeAnalyzer
            resumeText={state.resumeAnalyzer_resumeText}
            analysisResult={state.resumeAnalyzer_analysisResult}
            chatHistory={state.resumeAnalyzer_chatHistory}
            onAnalyze={handleAnalyzeResume}
            onChat={handleResumeChat}
            isLoading={isLoading}
            error={isApiError}
            isQuotaExhausted={isQuotaExhausted}
          /></ToolWrapper>;
      default:
        return <HomePage {...pageProps} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col text-teal-dark`}>
      {/* Conditionally render header/footer only if NOT in dashboard mode */}
      {state.page !== 'dashboard' && (
        <SiteHeader 
          currentPage={state.page} 
          setPage={setPage}
          isApiHealthy={isApiHealthy}
        />
      )}
      
      <div className="flex-grow">
        {renderPage()}
      </div>

      {state.page !== 'dashboard' && (
        <SiteFooter setPage={setPage} />
      )}

      <QuotaErrorModal isOpen={isQuotaExhausted} onClose={() => setIsQuotaExhausted(false)} />
      <AIGuideModal 
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        onRoute={handleRouteUserIntent}
        onSelectRoute={handleSelectRoute}
        prompt={state.aiGuidePrompt}
        setPrompt={(v) => setSingleState('aiGuidePrompt', v)}
        results={state.aiGuideResults}
        isLoading={isLoading}
        error={isApiError}
      />
      {state.page !== 'dashboard' && <Chatbot isQuotaExhausted={isQuotaExhausted} handleApiError={handleApiError} />}
    </div>
  );
};

export default App;
