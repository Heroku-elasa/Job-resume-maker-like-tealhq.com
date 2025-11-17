import React, { useState } from 'react';
import { useLanguage, PageKey } from '../types';

interface HomePageProps {
    setPage: (page: 'home' | PageKey) => void;
    onOpenAIGuide: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('resume');

  const otherFeatures = [
    { key: 'legal_drafter', title: t('header.legal_drafter'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> },
    { key: 'lawyer_finder', title: t('header.lawyer_finder'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M5.375 6.375a6.375 6.375 0 1112.75 0 6.375 6.375 0 01-12.75 0z" /></svg> },
    { key: 'contract_analyzer', title: t('header.contract_analyzer'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.5h-8.01a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5h12a1.5 1.5 0 011.5 1.5v5.231m-7.5 1.5_01" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75h.008v.008H18v-.008z" /></svg> },
    { key: 'case_strategist', title: t('header.caseStrategist'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3v-1.5A2.25 2.25 0 016 0h12A2.25 2.25 0 0120.25 1.5v1.5M3.75 3h16.5M16.5 6.75h-9M12.75 12h-5.25" /></svg> },
    { key: 'corporate_services', title: t('header.corporateServices'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375M9 12h6.375m-6.375 5.25h6.375M5.25 21V3m13.5 18V3" /></svg> },
    { key: 'insurance_services', title: t('header.insuranceServices'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" /></svg> },
  ];

  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="u--container px-4 mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-teal-dark">
              {t('home.title')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600">
              {t('home.subtitle')}
            </p>
            <div className="mt-8">
              <a href="#" onClick={() => setPage('job_assistant')} className="inline-block px-8 py-4 bg-teal-yellow text-teal-dark font-bold rounded-lg hover:bg-opacity-90 transition-all text-lg shadow-lg transform hover:scale-105">
                {t('home.cta')}
              </a>
            </div>
          </div>
          <div className="mt-16">
            <div className="flex justify-center border-b border-gray-200">
              <button onClick={() => setActiveTab('resume')} className={`px-4 py-3 font-medium border-b-2 ${activeTab === 'resume' ? 'border-teal-blue text-teal-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t('home.tabs.resumeBuilder')}
              </button>
              <button onClick={() => setActiveTab('tracker')} className={`px-4 py-3 font-medium border-b-2 ${activeTab === 'tracker' ? 'border-teal-green text-teal-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t('home.tabs.jobTracker')}
              </button>
              <button onClick={() => setActiveTab('matching')} className={`px-4 py-3 font-medium border-b-2 ${activeTab === 'matching' ? 'border-teal-yellow text-teal-yellow' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t('home.tabs.matchingMode')}
              </button>
            </div>
            <div className="mt-4">
              {activeTab === 'resume' && <img alt="AI Resume Builder" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/6626dcd99e5897d6b632e5c6_AI%20RESUME%20BUILDER.webp" className="mx-auto rounded-lg shadow-2xl"/>}
              {activeTab === 'tracker' && <img alt="Job Tracker" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/6626dcd756c2dda96f10138a_JOBTRACKER.webp" className="mx-auto rounded-lg shadow-2xl"/>}
              {activeTab === 'matching' && <img alt="Matching Mode" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/6626dcd31448e98cf6d52d9f_MATCHINGMODE.webp" className="mx-auto rounded-lg shadow-2xl"/>}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
       <section className="py-20 sm:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 text-teal-dark">{t('home.howItWorks.title')}</h2>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center"><div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-blue text-white text-2xl font-bold">1</div><h3 className="text-xl font-semibold">{t('home.howItWorks.step1')}</h3></div>
                <div className="flex flex-col items-center"><div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-blue text-white text-2xl font-bold">2</div><h3 className="text-xl font-semibold">{t('home.howItWorks.step2')}</h3></div>
                <div className="flex flex-col items-center"><div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-blue text-white text-2xl font-bold">3</div><h3 className="text-xl font-semibold">{t('home.howItWorks.step3')}</h3></div>
                <div className="flex flex-col items-center"><div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-teal-blue text-white text-2xl font-bold">4</div><h3 className="text-xl font-semibold">{t('home.howItWorks.step4')}</h3></div>
             </div>
             <div className="text-center mt-16">
                 <a href="#" onClick={() => setPage('job_assistant')} className="inline-block px-8 py-4 bg-teal-blue text-white font-bold rounded-lg hover:bg-opacity-90 transition-all text-lg shadow-lg transform hover:scale-105">
                     {t('home.howItWorks.cta')}
                 </a>
             </div>
        </div>
       </section>

        {/* Other Features Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 text-teal-dark">{t('home.otherFeatures.title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {otherFeatures.map(feature => (
                 <button key={feature.key} onClick={() => setPage(feature.key)} className="group text-center p-6 space-y-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-teal-blue transition-all transform hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-blue/10 text-teal-blue mx-auto transition-all group-hover:scale-110 group-hover:bg-teal-blue/20">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-teal-dark transition-colors group-hover:text-teal-blue">{feature.title}</h4>
                  </button>
              ))}
            </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
