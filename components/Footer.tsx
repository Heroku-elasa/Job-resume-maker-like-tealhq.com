import React from 'react';
import { PageKey, useLanguage } from '../types';

interface SiteFooterProps {
    setPage: (page: 'home' | PageKey) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ setPage }) => {
    const { t } = useLanguage();

    const footerLinks = {
        tools: [
            { text: t('header.resumeBuilder'), action: () => setPage('job_assistant') },
            { text: t('header.jobTracker'), action: () => setPage('job_assistant') },
            { text: t('header.contract_analyzer'), action: () => setPage('contract_analyzer') },
            { text: t('header.legal_drafter'), action: () => setPage('legal_drafter') },
        ],
        templates: [
            { text: "Resume Examples", href: "#" },
            { text: "Resume Templates", href: "#" },
            { text: "Cover Letter Examples", href: "#" },
        ],
        resources: [
            { text: "Career Hub", href: "#" },
            { text: "Job Search", href: "#" },
            { text: "Career Paths", href: "#" },
        ],
        company: [
            { text: "About Us", href: "#" },
            { text: "Pricing", href: "#" },
            { text: "Affiliate Program", href: "#" },
        ]
    };

    return (
        <footer className="bg-teal-red text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
                         <img className="h-8 w-auto mb-4" src="https://cdn.prod.website-files.com/62775a91cc3db44c787149de/62775d8abf9f57629c567a0a_Group%201148.svg" alt="Teal Logo" style={{filter: 'brightness(0) invert(1)'}} />
                         <p className="text-sm text-gray-300">Over 3.6 Million Users</p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider">{t('footer.tools')}</h2>
                        <ul className="space-y-3">
                            {footerLinks.tools.map(link => <li key={link.text}><button onClick={link.action} className="text-gray-300 hover:text-white text-sm">{link.text}</button></li>)}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider">{t('footer.templates')}</h2>
                        <ul className="space-y-3">
                            {footerLinks.templates.map(link => <li key={link.text}><a href={link.href} className="text-gray-300 hover:text-white text-sm">{link.text}</a></li>)}
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider">{t('footer.resources')}</h2>
                        <ul className="space-y-3">
                            {footerLinks.resources.map(link => <li key={link.text}><a href={link.href} className="text-gray-300 hover:text-white text-sm">{link.text}</a></li>)}
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider">{t('footer.company')}</h2>
                        <ul className="space-y-3">
                            {footerLinks.company.map(link => <li key={link.text}><a href={link.href} className="text-gray-300 hover:text-white text-sm">{link.text}</a></li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 text-gray-600">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p>{t('footer.copyright')}</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
