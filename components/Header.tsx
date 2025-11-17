import React, { useState, useRef, useEffect } from 'react';
import { PageKey, useLanguage } from '../types';

interface SiteHeaderProps {
    currentPage: string;
    setPage: (page: 'home' | PageKey) => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(event.target as Node)) {
        setIsResourcesMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = (page: 'home' | PageKey) => {
      setPage(page);
      window.scrollTo(0, 0);
      setIsMobileMenuOpen(false);
  }
  
  const professionalTools: { key: PageKey; text: string }[] = [
      { key: 'legal_drafter', text: t('header.legal_drafter') },
      { key: 'lawyer_finder', text: t('header.lawyer_finder') },
      { key: 'news_summarizer', text: t('header.news_summarizer') },
      { key: 'case_strategist', text: t('header.case_strategist') },
      { key: 'notary_finder', text: t('header.notary_finder') },
      { key: 'web_analyzer', text: t('header.web_analyzer') },
      { key: 'contract_analyzer', text: t('header.contract_analyzer') },
      { key: 'evidence_analyzer', text: t('header.evidence_analyzer') },
      { key: 'image_generator', text: t('header.image_generator') },
      { key: 'corporate_services', text: t('header.corporate_services') },
      { key: 'insurance_services', text: t('header.insurance_services') },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Main Nav */}
          <div className="flex items-center">
            <button onClick={() => handlePageChange('home')} className="flex-shrink-0">
              <img className="h-8 w-auto" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/62775d8abf9f57629c567a0a_Group%201148.svg" alt="Teal Logo" />
            </button>
            <nav className="hidden md:flex md:ml-10 md:space-x-8">
              <button onClick={() => handlePageChange('job_assistant')} className="text-gray-700 hover:text-teal-blue font-medium transition-colors">
                {t('header.resumeBuilder')}
              </button>
              <button onClick={() => handlePageChange('job_assistant')} className="text-gray-700 hover:text-teal-blue font-medium transition-colors">
                {t('header.jobTracker')}
              </button>
              {/* Tools Dropdown */}
              <div className="relative" ref={toolsMenuRef}>
                <button onClick={() => setIsToolsMenuOpen(prev => !prev)} className="flex items-center text-gray-700 hover:text-teal-blue font-medium transition-colors">
                  {t('header.professionalTools')}
                  <svg className={`w-5 h-5 ml-1 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isToolsMenuOpen && (
                  <div className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                        {professionalTools.map(tool => (
                          <button key={tool.key} onClick={() => { handlePageChange(tool.key); setIsToolsMenuOpen(false); }} className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 text-left w-full">
                             <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">{tool.text}</p>
                             </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-blue transition-colors">{t('header.login')}</a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-teal-blue rounded-md hover:bg-opacity-90 transition-colors">{t('header.signup')}</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(prev => !prev)} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-0 inset-x-0 p-2 transition transform origin-top-right z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                   <img className="h-8 w-auto" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/62775d8abf9f57629c567a0a_Group%201148.svg" alt="Teal Logo" />
                </div>
                <div className="-mr-2">
                  <button onClick={() => setIsMobileMenuOpen(false)} type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                     <span className="sr-only">Close menu</span>
                     <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                    <button onClick={() => handlePageChange('job_assistant')} className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 text-base font-medium text-gray-900">{t('header.resumeBuilder')}</button>
                    <button onClick={() => handlePageChange('job_assistant')} className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 text-base font-medium text-gray-900">{t('header.jobTracker')}</button>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('header.professionalTools')}</h3>
                     {professionalTools.map(tool => (
                        <button key={tool.key} onClick={() => handlePageChange(tool.key)} className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 text-base font-medium text-gray-900">{tool.text}</button>
                     ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
               <div>
                  <a href="#" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-blue hover:bg-opacity-90">{t('header.signup')}</a>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Existing user? <a href="#" className="text-teal-blue hover:text-opacity-90">{t('header.login')}</a>
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
