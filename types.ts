
import React, { useState, useCallback, createContext, useContext } from 'react';
import { en, fa } from './constants';

// --- LANGUAGE & TRANSLATION SETUP ---
type Language = 'en' | 'fa';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}
const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    const translations = language === 'fa' ? fa : en;
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  }, [language]);

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

// --- TYPE DEFINITIONS ---
export type PageKey = 'legal_drafter' | 'lawyer_finder' | 'news_summarizer' | 'case_strategist' | 'notary_finder' | 'web_analyzer' | 'contract_analyzer' | 'evidence_analyzer' | 'image_generator' | 'corporate_services' | 'insurance_services' | 'job_assistant' | 'resume_analyzer';

export interface LatLng {
  latitude: number;
  longitude: number;
}

// Type for auto-save status indicator
export type SaveStatus = 'idle' | 'saving' | 'saved';

// Type for a single chat message
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FilePart {
  mimeType: string;
  data: string; // base64 encoded
}

export interface Lawyer {
    name: string;
    specialty: string;
    city: string;
    contactInfo: string;
    address: string;
    website: string;
    websiteTitle: string;
    relevanceScore?: number;
    yearsOfExperience?: number;
    notes?: string;
}

export interface Notary {
    officeName: string;
    city: string;
    address: string;
    contactInfo: string;
    website: string;
    websiteTitle: string;
    services?: string;
}

export interface GroundingChunk {
  web?: { 
    uri: string; 
    title: string; 
  };
  maps?: {
    uri: string; 
    title: string; 
  };
}

export interface StrategyTask {
  taskName: string;
  description: string;
  effortPercentage: number;
  deliverableType: string;
  suggestedPrompt: string;
}

export interface IntentRoute {
  module: PageKey;
  confidencePercentage: number;
  reasoning: string;
}

export interface DraftPreparationResult {
  docType: string;
  topic: string;
  description: string;
}

// --- NEW JOB ASSISTANT TYPES ---
export type JobApplicationStatus = 'draft' | 'pending_approval' | 'applying' | 'applied' | 'viewed' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'error';

export interface JobDetails {
  title: string;
  company: string;
  description: string;
  skills: string[];
}

export interface JobApplication {
    id: string;
    jobTitle: string;
    company: string;
    jobUrl: string;
    status: JobApplicationStatus;
    cvText: string;
    jobDescription: string;
    tailoredResume: string;
    coverLetter: string;
    lastUpdated: number;
    appliedDate?: number;
    notes?: string;
    chatHistory?: ChatMessage[];
}

// --- NEW RESUME ANALYZER TYPES ---
export type ResumeAnalysisStatus = 'present' | 'implicit' | 'missing';

export interface ResumeAnalysisItem {
  id: number;
  category: string;
  requirement: string;
  status: ResumeAnalysisStatus;
  evidence: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  predictedJobTitle: string;
  summaryAndRecommendations: string;
  analysis: ResumeAnalysisItem[];
}


// --- APP STATE & CHECKPOINT SETUP ---

export interface AutoSaveData {
  topic: string;
  description: string;
  docType: string;
  lawyerFinderKeywords: string;
  notaryFinderKeywords: string;
  newsQuery: string;
  webAnalyzerUrl: string;
  webAnalyzerQuery: string;
  strategyGoal: string;
  aiGuidePrompt: string;
  contractAnalyzerQuery: string;
  initialContractText: string;
  evidenceAnalyzerQuery: string;
  imageGenPrompt: string;
  imageGenAspectRatio: string;
  corporateServices_nameQuery: string;
  corporateServices_generatedNames: string[];
  corporateServices_articlesQuery: {
    name: string;
    type: string;
    activity: string;
    capital: string;
  };
  corporateServices_generatedArticles: string;
  corporateServices_complianceQuery: string;
  corporateServices_complianceAnswer: string;
  insurance_policyQuery: string;
  insurance_initialPolicyText: string;
  insurance_claimQuery: {
    incidentType: string;
    description: string;
    policyNumber: string;
  };
  insurance_recommendationQuery: string;
  insurance_riskQuery: {
    assetType: string;
    description: string;
  };
  insurance_fraudQuery: {
    claimDescription: string;
  };
  insurance_autoClaimQuery: string;
  insurance_quoteQuery: {
    carModel: string;
    carYear: string;
    driverAge: string;
    drivingHistory: string;
  };
  insurance_lifeNeedsQuery: {
    age: string;
    income: string;
    dependents: string;
    debts: string;
    goals: string;
  };
  jobAssistant_currentUserCv: string;
  resumeAnalyzer_resumeText: string;
}

export interface AppState {
  page: 'home' | PageKey;
  document: string;
  form: {
    topic: string;
    description: string;
    docType: string;
  };
  lawyers: Lawyer[];
  allLawyers: Lawyer[];
  lawyerFinderKeywords: string;
  notaryFinderKeywords: string;
  foundNotaries: Notary[];
  newsQuery: string;
  newsSummary: string;
  newsSources: GroundingChunk[];
  strategyGoal: string;
  strategyResult: StrategyTask[];
  webAnalyzerUrl: string;
  webAnalyzerQuery: string;
  webAnalyzerResult: string;
  webAnalyzerSources: GroundingChunk[];
  aiGuidePrompt: string;
  aiGuideResults: IntentRoute[];
  contractAnalyzerQuery: string;
  contractAnalysis: string;
  initialContractText: string;
  evidenceAnalyzerQuery: string;
  evidenceAnalysisResult: string;
  imageGenPrompt: string;
  imageGenAspectRatio: string;
  generatedImage: string;
  corporateServices_nameQuery: string;
  corporateServices_generatedNames: string[];
  corporateServices_articlesQuery: {
    name: string;
    type: string;
    activity: string;
    capital: string;
  };
  corporateServices_generatedArticles: string;
  corporateServices_complianceQuery: string;
  corporateServices_complianceAnswer: string;
  insurance_policyQuery: string;
  insurance_policyAnalysis: string;
  insurance_initialPolicyText: string;
  insurance_claimQuery: {
    incidentType: string;
    description: string;
    policyNumber: string;
  };
  insurance_generatedClaim: string;
  insurance_recommendationQuery: string;
  insurance_recommendationAnswer: string;
  insurance_riskQuery: {
    assetType: string;
    description: string;
  };
  insurance_riskAssessmentResult: string;
  insurance_fraudQuery: {
    claimDescription: string;
  };
  insurance_fraudDetectionResult: string;
  insurance_autoClaimQuery: string;
  insurance_autoClaimResult: string;
  insurance_quoteQuery: {
    carModel: string;
    carYear: string;
    driverAge: string;
    drivingHistory: string;
  };
  insurance_quoteResult: string;
  insurance_lifeNeedsQuery: {
    age: string;
    income: string;
    dependents: string;
    debts: string;
    goals: string;
  };
  insurance_lifeNeedsResult: string;
  // Job Assistant
  jobAssistant_applications: JobApplication[];
  jobAssistant_currentUserCv: string;
  // Resume Analyzer
  resumeAnalyzer_resumeText: string;
  resumeAnalyzer_analysisResult: ResumeAnalysisResult | null;
  resumeAnalyzer_chatHistory: ChatMessage[];
}
export interface Checkpoint {
  id: string;
  timestamp: number;
  name: string;
  state: AppState;
}
