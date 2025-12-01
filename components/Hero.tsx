
import React, { useState } from 'react';
import { useLanguage, PageKey } from '../types';

interface HomePageProps {
    setPage: (page: 'home' | PageKey) => void;
    onOpenAIGuide: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onOpenAIGuide }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'career' | 'legal' | 'business'>('career');

  const toolsByCategory: Record<'career' | 'legal' | 'business', { key: PageKey; title: string; icon: React.ReactNode; desc: string }[]> = {
    career: [
        { key: 'resume_analyzer', title: t('header.resume_analyzer'), desc: t('home.toolDescs.resume_analyzer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { key: 'job_assistant', title: t('header.job_assistant'), desc: t('home.toolDescs.job_assistant'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
        { key: 'hiring_assistant', title: t('header.hiring_assistant'), desc: t('home.toolDescs.hiring_assistant'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    ],
    legal: [
        { key: 'legal_drafter', title: t('header.legal_drafter'), desc: t('home.toolDescs.legal_drafter'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> },
        { key: 'contract_analyzer', title: t('header.contract_analyzer'), desc: t('home.toolDescs.contract_analyzer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { key: 'lawyer_finder', title: t('header.lawyer_finder'), desc: t('home.toolDescs.lawyer_finder'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M5.375 6.375a6.375 6.375 0 1112.75 0 6.375 6.375 0 01-12.75 0z" /></svg> },
        { key: 'case_strategist', title: t('header.case_strategist'), desc: t('home.toolDescs.case_strategist'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3v-1.5A2.25 2.25 0 016 0h12A2.25 2.25 0 0120.25 1.5v1.5M3.75 3h16.5M16.5 6.75h-9M12.75 12h-5.25" /></svg> },
        { key: 'notary_finder', title: t('header.notary_finder'), desc: t('home.toolDescs.notary_finder'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg> },
    ],
    business: [
        { key: 'corporate_services', title: t('header.corporate_services'), desc: t('home.toolDescs.corporate_services'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375M9 12h6.375m-6.375 5.25h6.375M5.25 21V3m13.5 18V3" /></svg> },
        { key: 'insurance_services', title: t('header.insurance_services'), desc: t('home.toolDescs.insurance_services'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" /></svg> },
        { key: 'news_summarizer', title: t('header.news_summarizer'), desc: t('home.toolDescs.news_summarizer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
        { key: 'web_analyzer', title: t('header.web_analyzer'), desc: t('home.toolDescs.web_analyzer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
        { key: 'evidence_analyzer', title: t('header.evidence_analyzer'), desc: t('home.toolDescs.evidence_analyzer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg> },
        { key: 'image_generator', title: t('header.image_generator'), desc: t('home.toolDescs.image_generator'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    ]
  };

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Background blobs for "psychological" calming effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-blue rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-green rounded-full blur-[100px]"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-left max-w-2xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-50 mr-2 animate-pulse"></span>
                    {t('home.trust.aiPowered')}
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-teal-dark leading-tight">
                  {t('home.title')}
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  {t('home.subtitle')}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={() => setPage('job_assistant')} className="px-8 py-4 bg-teal-blue text-white font-bold rounded-xl hover:bg-teal-light-blue transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    {t('home.cta')}
                  </button>
                  <button onClick={onOpenAIGuide} className="px-8 py-4 bg-white text-teal-dark font-semibold rounded-xl border border-gray-200 hover:border-teal-blue hover:text-teal-blue transition-all shadow-sm hover:shadow-md">
                    {t('aiGuide.title')}
                  </button>
                </div>
                
                <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex -space-x-2 overflow-hidden rtl:space-x-reverse">
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
                    </div>
                    <span>{t('home.trust.users')}</span>
                </div>
              </div>
              
              {/* Illustration Placeholder */}
              <div className="hidden lg:block w-full max-w-lg">
                  <div className="relative">
                      <div className="absolute inset-0 bg-teal-blue blur-3xl opacity-20 rounded-full"></div>
                      <img src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/6626dcd99e5897d6b632e5c6_AI%20RESUME%20BUILDER.webp" alt="App Preview" className="relative rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm transform rotate-[-2deg] hover:rotate-0 transition-all duration-500" />
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* Feature Navigation - "Psychology of Choice": Categorized Tabs */}
      <section className="py-16 bg-gray-50/50">
        <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-teal-dark">{t('home.otherFeatures.title')}</h2>
                <p className="text-gray-500 mt-2">{t('home.subtitle')}</p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    {(['career', 'legal', 'business'] as const).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeCategory === cat 
                                ? 'bg-teal-dark text-white shadow-md' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {cat === 'career' ? t('home.categories.career') : cat === 'legal' ? t('home.categories.legal') : t('home.categories.business')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {toolsByCategory[activeCategory].map(feature => (
                 <button 
                    key={feature.key} 
                    onClick={() => setPage(feature.key)} 
                    className="group text-left p-6 bg-white border border-gray-100 rounded-xl hover:border-teal-blue/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-teal-blue/5 text-teal-blue group-hover:bg-teal-blue group-hover:text-white transition-colors">
                            {feature.icon}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-teal-dark group-hover:text-teal-blue transition-colors">{feature.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                        </div>
                    </div>
                  </button>
              ))}
            </div>
        </div>
      </section>

      {/* How it Works Section */}
       <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-teal-dark">{t('home.howItWorks.title')}</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-100 -z-10"></div>
                
                {[1, 2, 3, 4].map((step, idx) => (
                    <div key={step} className="flex flex-col items-center group">
                        <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-white border-2 border-teal-50 text-teal-blue text-2xl font-bold shadow-sm group-hover:border-teal-blue group-hover:bg-teal-blue group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                            {step}
                        </div>
                        <h3 className="text-xl font-bold text-teal-dark mb-2">{t(`home.howItWorks.step${step}`)}</h3>
                        <p className="text-sm text-gray-500 px-4">
                            {t(`home.howItWorks.desc${step}`)}
                        </p>
                    </div>
                ))}
             </div>
             <div className="text-center mt-20">
                 <button onClick={() => setPage('job_assistant')} className="inline-block px-10 py-4 bg-teal-yellow text-teal-dark font-bold rounded-xl hover:bg-yellow-400 transition-all text-lg shadow-lg transform hover:scale-105">
                     {t('home.howItWorks.cta')}
                 </button>
             </div>
        </div>
       </section>
    </div>
  );
};

export default HomePage;
