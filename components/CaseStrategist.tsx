

import React, { useState } from 'react';
import { StrategyTask, useLanguage } from '../types';
import { useAISuggestions, AISuggestionsDisplay } from './AISuggestions';

interface CaseStrategistProps {
    onGenerate: (goal: string, useThinkingMode: boolean) => void;
    goal: string;
    setGoal: (value: string) => void;
    result: StrategyTask[];
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
    onExecuteTask: (task: StrategyTask) => Promise<void>;
    isExecutingTask: boolean;
}

const CaseStrategist: React.FC<CaseStrategistProps> = ({ 
    onGenerate, goal, setGoal, result, isLoading, error, isQuotaExhausted, onExecuteTask, isExecutingTask 
}) => {
    const { t } = useLanguage();
    const [visiblePromptId, setVisiblePromptId] = useState<number | null>(null);
    const [executingTaskId, setExecutingTaskId] = useState<number | null>(null);
    const [isGoalFocused, setIsGoalFocused] = useState(false);
    const [useThinkingMode, setUseThinkingMode] = useState(false);
    
    const { suggestions, isLoading: areSuggestionsLoading, setSuggestions } = useAISuggestions(
        goal,
        "Suggest high-level project goals a user might want to plan",
        !isQuotaExhausted && isGoalFocused,
        'case_strategist_goal'
    );

    const handleSuggestionSelect = (suggestion: string) => {
        setGoal(suggestion);
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) {
            alert(t('caseStrategist.validationError'));
            return;
        }
        onGenerate(goal, useThinkingMode);
        setVisiblePromptId(null);
    };
    
    const handleUseExample = () => {
        setGoal(t('caseStrategist.example.goal'));
    };

    const handleExecute = async (task: StrategyTask, index: number) => {
        setExecutingTaskId(index);
        try {
            await onExecuteTask(task);
        } finally {
            setExecutingTaskId(null);
        }
    };

    const ThinkingModeToggle = () => (
        <div className="flex items-center justify-between mt-4 p-3 bg-indigo-900/50 rounded-lg border border-indigo-700/50">
          <div>
            <label htmlFor="thinking-mode-toggle-strategy" className="font-semibold text-white">
              {t('thinkingMode.label')}
            </label>
            <p className="text-xs text-gray-400">{t('thinkingMode.description')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="thinking-mode-toggle-strategy"
              checked={useThinkingMode}
              onChange={(e) => setUseThinkingMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-gold peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
          </label>
        </div>
    );

    return (
        <section id="case-strategist" className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto">
                <div className="mt-10 bg-brand-blue/30 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-brand-blue/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="goal-input" className="block text-sm font-medium text-gray-300">{t('caseStrategist.goalLabel')}</label>
                                <button type="button" onClick={handleUseExample} className="text-xs text-brand-gold hover:underline focus:outline-none">
                                    {t('generatorForm.useExample')}
                                </button>
                            </div>
                            <div className="relative">
                                <textarea
                                    id="goal-input"
                                    rows={4}
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    onFocus={() => setIsGoalFocused(true)}
                                    onBlur={() => setIsGoalFocused(false)}
                                    autoComplete="off"
                                    className="mt-1 block w-full bg-brand-blue/50 border-brand-blue/70 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-white"
                                    placeholder={t('caseStrategist.goalPlaceholder')}
                                />
                                {isGoalFocused && (
                                    <AISuggestionsDisplay
                                        suggestions={suggestions}
                                        isLoading={areSuggestionsLoading}
                                        onSelect={handleSuggestionSelect}
                                    />
                                )}
                            </div>
                        </div>
                        <ThinkingModeToggle />
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || isQuotaExhausted}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-blue bg-brand-gold hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-brand-gold disabled:bg-brand-gold/50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? t('caseStrategist.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('caseStrategist.buttonText')}
                            </button>
                        </div>
                    </form>
                </div>

                {(isLoading || error || result.length > 0) && (
                    <div className="mt-10 animate-fade-in">
                        <div className="mb-4">
                            <h3 className="text-2xl font-semibold text-white">{t('caseStrategist.resultsTitle')}</h3>
                        </div>
                        <div className="space-y-6">
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-brand-gold"></div>
                                    <span className="ml-3 text-gray-400">{t('caseStrategist.generating')}</span>
                                </div>
                            )}
                            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                            {result.map((task, index) => (
                                <div key={index} className="bg-brand-blue/30 rounded-lg shadow-lg backdrop-blur-sm border border-brand-blue/50 p-6">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold text-brand-gold">{task.taskName}</h4>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <div className="text-sm text-gray-400">{t('caseStrategist.effort')}</div>
                                            <div className="text-lg font-bold text-white">{task.effortPercentage}%</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-brand-blue/80 rounded-full h-2.5 my-2">
                                        <div className="bg-brand-gold h-2.5 rounded-full" style={{ width: `${task.effortPercentage}%` }}></div>
                                    </div>
                                    <p className="text-gray-300 mt-3">{task.description}</p>
                                    <div className="mt-4 pt-4 border-t border-brand-blue/70 flex flex-wrap items-center gap-4">
                                        <p className="text-sm flex-shrink-0"><span className="font-semibold text-gray-400">{t('caseStrategist.deliverable')}:</span> <span className="font-medium text-gray-200 bg-brand-blue/70 px-2 py-1 rounded-md">{task.deliverableType}</span></p>
                                        <div className="flex-grow flex items-center space-x-4">
                                            <button 
                                                onClick={() => setVisiblePromptId(visiblePromptId === index ? null : index)}
                                                className="text-sm text-brand-gold hover:text-yellow-200 transition-colors"
                                            >
                                                {visiblePromptId === index ? '▲ ' : '▼ '} {t('caseStrategist.suggestedPrompt')}
                                            </button>
                                            <button 
                                                onClick={() => handleExecute(task, index)}
                                                disabled={isExecutingTask}
                                                className="flex items-center text-sm px-3 py-1 rounded-md bg-brand-gold text-brand-blue hover:bg-yellow-200 disabled:bg-gray-600 transition-colors"
                                            >
                                                {executingTaskId === index ? (
                                                    <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    {t('caseStrategist.executingTask')}</>
                                                ) : (
                                                    '⚡️ ' + t('caseStrategist.executeTask')
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                     {visiblePromptId === index && (
                                        <div className="mt-4 bg-brand-blue/70 p-4 rounded-md border border-brand-blue">
                                            <pre className="whitespace-pre-wrap text-sm text-gray-300">
                                                <code>{task.suggestedPrompt}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CaseStrategist;