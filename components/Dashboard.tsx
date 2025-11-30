
import React, { useState, useEffect } from 'react';
import { useLanguage, PageKey, JobApplication, Lawyer } from '../types';

interface DashboardProps {
    setPage: (page: 'home' | PageKey) => void;
    applications: JobApplication[];
    savedLawyers: Lawyer[];
    generatedDocument: string;
    onEditApplication: (app: JobApplication) => void;
}

type AdminMenu = 'dashboard' | 'posts' | 'media' | 'pages' | 'comments' | 'appearance' | 'plugins' | 'users' | 'tools' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ setPage, applications, savedLawyers, generatedDocument, onEditApplication }) => {
    const { t, language, dir } = useLanguage();
    const [activeMenu, setActiveMenu] = useState<AdminMenu>('dashboard');
    const [quickDraftTitle, setQuickDraftTitle] = useState('');
    const [quickDraftContent, setQuickDraftContent] = useState('');
    const [draftStatus, setDraftStatus] = useState<'idle' | 'saved'>('idle');
    const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

    // Simulate recent activity
    const recentActivity = [
        ...applications.map(app => ({ 
            type: 'application', 
            text: `${app.jobTitle} - ${app.company}`, 
            date: new Date(app.lastUpdated),
            status: app.status
        })),
        ...savedLawyers.map(lawyer => ({ 
            type: 'lawyer', 
            text: `${t('dashboard.stats.lawyers')}: ${lawyer.name}`, 
            date: new Date(),
            status: 'saved'
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    const handleSaveDraft = () => {
        if (!quickDraftTitle || !quickDraftContent) return;
        localStorage.setItem('dashboard_quick_draft', JSON.stringify({ title: quickDraftTitle, content: quickDraftContent }));
        setDraftStatus('saved');
        setTimeout(() => setDraftStatus('idle'), 2000);
    };

    useEffect(() => {
        const saved = localStorage.getItem('dashboard_quick_draft');
        if (saved) {
            const parsed = JSON.parse(saved);
            setQuickDraftTitle(parsed.title);
            setQuickDraftContent(parsed.content);
        }
    }, []);

    const toggleSelectPost = (id: string) => {
        const newSelected = new Set(selectedPosts);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedPosts(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedPosts.size === applications.length) setSelectedPosts(new Set());
        else setSelectedPosts(new Set(applications.map(a => a.id)));
    };

    // --- SUB-COMPONENTS ---

    const SidebarItem = ({ id, label, icon, onClick }: { id: AdminMenu, label: string, icon: React.ReactNode, onClick: () => void }) => (
        <li 
            onClick={onClick}
            className={`cursor-pointer flex items-center px-3 py-2 text-[13px] font-medium transition-colors border-l-4 ${
                activeMenu === id 
                ? 'bg-[#0073aa] text-white border-[#0073aa]' 
                : 'text-[#eee] hover:bg-[#191e23] hover:text-[#00b9eb] border-transparent'
            }`}
        >
            <span className={`w-5 h-5 flex items-center justify-center opacity-70 ${language === 'fa' ? 'ml-2' : 'mr-2'}`}>{icon}</span>
            {label}
        </li>
    );

    const DashboardWidgets = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* At a Glance */}
            <div className="bg-white border border-[#ccd0d4] shadow-sm">
                <div className="px-4 py-3 border-b border-[#ccd0d4]">
                    <h2 className="font-semibold text-[14px] text-[#23282d]">{t('dashboard.atAGlance')}</h2>
                </div>
                <div className="p-4">
                    <ul className="space-y-2 text-[13px] text-[#50575e]">
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-[#82878c] mx-2" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
                            <span className="font-bold text-[#0073aa] mr-1">{applications.length}</span> {t('dashboard.stats.applications')}
                        </li>
                        <li className="flex items-center">
                            <svg className="w-4 h-4 text-[#82878c] mx-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                            <span className="font-bold text-[#0073aa] mr-1">{savedLawyers.length}</span> {t('dashboard.stats.lawyers')}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Quick Draft */}
            <div className="bg-white border border-[#ccd0d4] shadow-sm">
                <div className="px-4 py-3 border-b border-[#ccd0d4]">
                    <h2 className="font-semibold text-[14px] text-[#23282d]">{t('dashboard.quickDraft')}</h2>
                </div>
                <div className="p-4 space-y-3">
                    <input 
                        type="text" 
                        value={quickDraftTitle}
                        onChange={(e) => setQuickDraftTitle(e.target.value)}
                        placeholder={t('dashboard.title')}
                        className="w-full border border-[#8c8f94] p-1.5 text-[13px] focus:border-[#007cba] focus:outline-none shadow-inner"
                    />
                    <textarea 
                        value={quickDraftContent}
                        onChange={(e) => setQuickDraftContent(e.target.value)}
                        placeholder={t('dashboard.contentPlaceholder')}
                        rows={3}
                        className="w-full border border-[#8c8f94] p-1.5 text-[13px] focus:border-[#007cba] focus:outline-none shadow-inner"
                    />
                    <div className="flex justify-between items-center pt-2">
                        <button onClick={handleSaveDraft} className="bg-[#f7f7f7] border border-[#ccc] text-[#0073aa] hover:border-[#999] hover:text-[#00a0d2] text-[13px] px-3 py-1 rounded transition-colors shadow-sm">
                            {t('dashboard.saveDraft')}
                        </button>
                        {draftStatus === 'saved' && <span className="text-green-600 text-xs">Saved!</span>}
                    </div>
                </div>
            </div>

            {/* Activity */}
            <div className="bg-white border border-[#ccd0d4] shadow-sm">
                <div className="px-4 py-3 border-b border-[#ccd0d4]">
                    <h2 className="font-semibold text-[14px] text-[#23282d]">{t('dashboard.activity')}</h2>
                </div>
                <div className="p-4">
                    <h3 className="text-[#50575e] text-[13px] font-medium mb-3">{t('dashboard.recentActivity')}</h3>
                    <ul className="space-y-3">
                        {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                            <li key={i} className="text-[13px] text-[#50575e] border-b border-[#f0f0f1] pb-2 last:border-0">
                                <span className="text-[#b5bfc9] text-xs block mb-0.5">{activity.date.toLocaleDateString()}</span>
                                {activity.text}
                            </li>
                        )) : (
                            <p className="text-[13px] text-[#a0a5aa]">{t('dashboard.noActivity')}</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );

    const PostsTable = () => (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#50575e]">{t('dashboard.all')} ({applications.length})</span>
                    <span className="text-[#a0a5aa]">|</span>
                    <span className="text-[13px] text-[#0073aa] cursor-pointer">{t('dashboard.published')} ({applications.filter(a => a.status === 'applied').length})</span>
                </div>
                <div className="flex gap-2">
                    <input type="text" className="border border-[#8c8f94] p-1 text-[13px]" />
                    <button className="bg-[#f7f7f7] border border-[#ccc] text-[#555] hover:border-[#999] hover:text-[#23282d] px-3 py-1 text-[13px] rounded">{t('dashboard.search')}</button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3 bg-white p-2 border border-[#ccd0d4] shadow-sm rounded-sm">
                <select className="border border-[#8c8f94] text-[13px] p-1 bg-white">
                    <option>{t('dashboard.bulkActions')}</option>
                    <option>{t('dashboard.edit')}</option>
                    <option>{t('dashboard.trash')}</option>
                </select>
                <button className="bg-[#f7f7f7] border border-[#ccc] text-[#555] hover:border-[#999] px-3 py-1 text-[13px] rounded">{t('dashboard.apply')}</button>
                <select className="border border-[#8c8f94] text-[13px] p-1 bg-white ml-4">
                    <option>{t('dashboard.date')}</option>
                </select>
                <button className="bg-[#f7f7f7] border border-[#ccc] text-[#555] hover:border-[#999] px-3 py-1 text-[13px] rounded">{t('dashboard.filter')}</button>
            </div>

            <table className="w-full bg-white border border-[#ccd0d4] text-[13px] shadow-sm">
                <thead>
                    <tr className="bg-[#f9f9f9] border-b border-[#ccd0d4] text-left">
                        <th className="p-2 w-8"><input type="checkbox" onChange={toggleSelectAll} checked={selectedPosts.size === applications.length && applications.length > 0} /></th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.title')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.author')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('jobAssistant.dashboard.status')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.date')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1]">
                    {applications.map(app => (
                        <tr key={app.id} className="group hover:bg-[#fcfcfc]">
                            <td className="p-2 border-l-4 border-transparent"><input type="checkbox" checked={selectedPosts.has(app.id)} onChange={() => toggleSelectPost(app.id)} /></td>
                            <td className="p-2 relative">
                                <strong className="text-[#0073aa] text-[14px] font-semibold cursor-pointer hover:text-[#00a0d2]" onClick={() => onEditApplication(app)}>
                                    {app.jobTitle}
                                </strong>
                                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px]">
                                    <button onClick={() => onEditApplication(app)} className="text-[#0073aa] hover:underline">{t('dashboard.edit')}</button>
                                    <span className="text-[#ddd]">|</span>
                                    <button className="text-[#0073aa] hover:underline">{t('dashboard.quickEdit')}</button>
                                    <span className="text-[#ddd]">|</span>
                                    <button className="text-[#a00] hover:underline">{t('dashboard.trash')}</button>
                                    <span className="text-[#ddd]">|</span>
                                    <button className="text-[#0073aa] hover:underline">{t('dashboard.view')}</button>
                                </div>
                            </td>
                            <td className="p-2 text-[#0073aa]">{app.company}</td>
                            <td className="p-2">{t(`jobAssistant.status.${app.status}`)}</td>
                            <td className="p-2">
                                {new Date(app.lastUpdated).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')}
                                <br />
                                <span className="text-[#a0a5aa] text-[11px]">{t('dashboard.published')}</span>
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr><td colSpan={5} className="p-4 text-center text-[#a0a5aa]">{t('jobAssistant.dashboard.noApps')}</td></tr>
                    )}
                </tbody>
                <tfoot>
                    <tr className="bg-[#f9f9f9] border-t border-[#ccd0d4] text-left">
                        <th className="p-2"><input type="checkbox" onChange={toggleSelectAll} checked={selectedPosts.size === applications.length && applications.length > 0} /></th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.title')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.author')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('jobAssistant.dashboard.status')}</th>
                        <th className="p-2 font-semibold text-[#23282d]">{t('dashboard.date')}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    return (
        <div className={`flex min-h-screen bg-[#f1f1f1] font-sans ${dir === 'rtl' ? 'font-iransans' : ''}`} dir={dir}>
            {/* Sidebar */}
            <aside className="w-[160px] bg-[#23282d] text-[#eee] flex-shrink-0 relative z-20">
                <div className="h-12 bg-[#0073aa] flex items-center justify-center font-bold text-white text-lg">
                    W
                </div>
                <ul className="mt-2 space-y-1">
                    <SidebarItem id="dashboard" label={t('dashboard.dashboard')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>} onClick={() => setActiveMenu('dashboard')} />
                    <SidebarItem id="posts" label={t('dashboard.posts')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>} onClick={() => setActiveMenu('posts')} />
                    <SidebarItem id="media" label={t('dashboard.media')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>} onClick={() => setActiveMenu('media')} />
                    <SidebarItem id="pages" label={t('dashboard.pages')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>} onClick={() => setPage('job_assistant')} />
                    <SidebarItem id="comments" label={t('dashboard.comments')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>} onClick={() => {}} />
                    
                    <div className="h-4"></div>
                    
                    <SidebarItem id="appearance" label={t('dashboard.appearance')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>} onClick={() => {}} />
                    <SidebarItem id="plugins" label={t('dashboard.plugins')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" /></svg>} onClick={() => {}} />
                    <SidebarItem id="users" label={t('dashboard.users')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>} onClick={() => {}} />
                    <SidebarItem id="tools" label={t('dashboard.tools')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-2a3 3 0 11-6 0 3 3 0 016 0zm-8 3a3 3 0 116 0 3 3 0 01-6 0zm6 4a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" /></svg>} onClick={() => {}} />
                    <SidebarItem id="settings" label={t('dashboard.settings')} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>} onClick={() => {}} />
                </ul>
                <div onClick={() => setPage('home')} className="absolute bottom-0 w-full p-2 cursor-pointer hover:bg-gray-700 text-xs text-gray-400 text-center flex items-center justify-center border-t border-gray-700">
                    Exit to App
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Admin Top Bar */}
                <div className="h-8 bg-[#1d2327] flex justify-between items-center px-4 text-[#eee] text-[13px] sticky top-0 z-10">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <span className="font-bold flex items-center cursor-pointer hover:text-[#00b9eb]">
                            <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" /></svg>
                            Kar-Yab AI
                        </span>
                        <div className="relative group cursor-pointer hover:text-[#00b9eb] flex items-center">
                            <svg className="w-4 h-4 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            <span className="w-4 h-4 flex items-center justify-center bg-[#ca4a1f] text-white rounded-full text-[9px] absolute -top-1 -right-2">1</span>
                        </div>
                        <div className="cursor-pointer hover:text-[#00b9eb] flex items-center">
                            <span className="mr-1">+ New</span>
                        </div>
                    </div>
                    <div className="flex items-center cursor-pointer hover:text-[#00b9eb]">
                        {t('dashboard.howdy')}
                        <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="Avatar" className="w-5 h-5 rounded ml-2" />
                    </div>
                </div>

                {/* Main Body */}
                <div className="p-5 flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-normal text-[#1d2327]">
                                {activeMenu === 'dashboard' ? t('dashboard.dashboard') : 
                                 activeMenu === 'posts' ? t('dashboard.posts') : 
                                 t(`dashboard.${activeMenu}`)}
                            </h1>
                            <div className="flex gap-2">
                                <button className="bg-white border border-[#0073aa] text-[#0073aa] text-[13px] px-3 py-1 rounded hover:bg-[#0073aa] hover:text-white transition-colors">{t('dashboard.screenOptions')}</button>
                                <button className="bg-white border border-[#0073aa] text-[#0073aa] text-[13px] px-3 py-1 rounded hover:bg-[#0073aa] hover:text-white transition-colors">{t('dashboard.help')}</button>
                            </div>
                        </div>

                        {activeMenu === 'dashboard' && <DashboardWidgets />}
                        {activeMenu === 'posts' && <PostsTable />}
                        {activeMenu === 'media' && (
                            <div className="bg-white p-6 border border-[#ccd0d4]">
                                <h3 className="font-semibold mb-4 text-[#23282d]">{t('lawyerFinder.savedTitle')}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {savedLawyers.map((l, i) => (
                                        <div key={i} className="border border-[#ddd] p-2 bg-[#f9f9f9]">
                                            <div className="h-24 bg-gray-200 flex items-center justify-center text-gray-400 mb-2 text-4xl">⚖️</div>
                                            <p className="font-bold text-[13px] truncate">{l.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{l.specialty}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Placeholders for other menus */}
                        {!['dashboard', 'posts', 'media'].includes(activeMenu) && (
                            <div className="bg-white p-10 border border-[#ccd0d4] text-center text-[#a0a5aa]">
                                Content for {activeMenu} goes here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
