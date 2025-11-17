import React, { useRef, useEffect, useState, useMemo } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

interface DocumentDisplayProps {
  generatedDocument: string;
  isLoading: boolean;
  error: string | null;
}

const getDocumentStyles = () => `
    @font-face {
        font-family: 'Iransans';
        font-weight: 400;
        src: url('https://sevinsazeh.com/wp-content/uploads/2024/03/IRANSansWebFaNum.woff2') format('woff2'),
             url('https://sevinsazeh.com/wp-content/uploads/2024/03/IRANSansWebFaNum.woff') format('woff');
    }
    @font-face {
        font-family: 'Iransans';
        font-weight: 700;
        src: url('https://sevinsazeh.com/wp-content/uploads/2024/03/IRANSansWebFaNum_Bold.woff2') format('woff2'),
             url('https://sevinsazeh.com/wp-content/uploads/2024/03/IRANSansWebFaNum_Bold.woff') format('woff');
    }
    body { font-family: 'Inter', 'Iransans', sans-serif; line-height: 1.8; background-color: #f3f4f6; padding: 2rem; margin: 0; color: #111827; }
    .document-page { background-color: #ffffff; color: #111827; padding: 2.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); max-width: 8.5in; min-height: 10in; margin: 0 auto; }
    .document-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 2rem; }
    .document-logo { display: flex; align-items: center; gap: 0.75rem; }
    .document-logo svg { height: 40px; width: auto; }
    .document-logo span { font-size: 1.125rem; font-weight: 700; color: #374151; }
    .document-header-info { text-align: right; font-size: 0.875rem; color: #4b5563; }
    body[dir="rtl"] .document-header-info { text-align: left; }
    .document-body { color: #111827; max-width: none; }
    .document-body h1, .document-body h2, .document-body h3 { color: #005149; font-family: 'Inter', 'Iransans', sans-serif; }
    .document-body h4, .document-body h5, .document-body h6 { color: #111827; font-family: 'Inter', 'Iransans', sans-serif; }
    .document-body h1 { padding-bottom: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; }
    .document-body h2 { padding-bottom: 0.25rem; margin-bottom: 1.25rem; border-bottom: 1px solid #e5e7eb; }
    .document-body p, .document-body li { color: #374151; line-height: 2; }
    body[dir="rtl"] { direction: rtl; }
    body[dir="rtl"] .document-body { text-align: right; }
    body[dir="rtl"] .document-body p, body[dir="rtl"] .document-body li { text-align: justify; }
    code { font-family: monospace; background-color: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; text-align: left; direction: ltr; }
    pre code { background-color: transparent; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    body[dir="ltr"] td { text-align: left; }
    body[dir="rtl"] td { text-align: right; }
    th { background-color: #f2f2f2; }
    blockquote { color: #666; margin: 0; padding-inline-start: 1em; border-inline-start: 0.25em solid #dfe2e5; }
    ul { padding-inline-start: 20px; }
    mark { background-color: #fde047; padding: 2px 1px; border-radius: 2px; color: inherit; }
    mark.current-match { background-color: #f97316; color: white; }
`;

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ generatedDocument, isLoading, error }) => {
  const { t, language } = useLanguage();
  const endOfReportRef = useRef<HTMLDivElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [reportHtml, setReportHtml] = useState('');
  const currentDate = useMemo(() => new Date().toLocaleDateString(language === 'fa' ? 'fa-IR-u-nu-latn' : 'en-US'), [language]);

  // Search state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  const isComplete = !isLoading && generatedDocument.length > 0 && !error;

  const searchMatches = useMemo(() => {
    if (!generatedDocument || !searchQuery) {
      return [];
    }
    // Escape special characters for regex
    const escapedQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'gi');
    const matches = [];
    let match;
    while ((match = regex.exec(generatedDocument)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
      });
    }
    return matches;
  }, [generatedDocument, searchQuery]);

  // Reset search index when query changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentMatchIndex(searchMatches.length > 0 ? 0 : -1);
    } else {
      setCurrentMatchIndex(-1);
    }
  }, [searchQuery, searchMatches]);

  // Scroll to the current match
  useEffect(() => {
    if (currentMatchIndex > -1) {
      const element = document.getElementById(`search-match-${currentMatchIndex}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentMatchIndex]);

  const highlightedMarkdown = useMemo(() => {
    if (!searchQuery || searchMatches.length === 0) {
      return generatedDocument;
    }

    let lastIndex = 0;
    const parts = [];
    searchMatches.forEach((match, index) => {
      // Add the text before the match
      parts.push(generatedDocument.substring(lastIndex, match.index));
      // Add the highlighted match
      const isCurrent = index === currentMatchIndex;
      const className = isCurrent ? 'current-match' : '';
      const id = `search-match-${index}`;
      const originalText = generatedDocument.substring(match.index, match.index + match.length);
      parts.push(
        `<mark id="${id}" class="${className}">${originalText}</mark>`
      );
      lastIndex = match.index + match.length;
    });
    // Add the remaining text
    parts.push(generatedDocument.substring(lastIndex));
    return parts.join('');
  }, [generatedDocument, searchQuery, searchMatches, currentMatchIndex]);


  useEffect(() => {
    if (isLoading) {
      endOfReportRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedDocument, isLoading]);

  useEffect(() => {
    let isMounted = true;
    const parseMarkdown = async () => {
      if (highlightedMarkdown) {
        const html = await marked.parse(highlightedMarkdown);
        if (isMounted) setReportHtml(html);
      } else {
        if (isMounted) setReportHtml('');
      }
    };
    parseMarkdown();
    return () => { isMounted = false; };
  }, [highlightedMarkdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadFile = (filename: string, content: string | Blob | ArrayBuffer, mimeType: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setIsExportMenuOpen(false);
  };
  
  const handleDownloadMD = () => {
    downloadFile('document.md', generatedDocument, 'text/markdown;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handleDownloadDOCX = async () => {
    const reportHtmlString = await createHtmlContent(generatedDocument);
    try {
      const htmlToDocxModule = await import('html-to-docx');
      const htmlToDocx = htmlToDocxModule.default;
      
      if (typeof htmlToDocx !== 'function') {
        console.error('Failed to load html-to-docx function', htmlToDocxModule);
        throw new Error('Could not convert to DOCX. The library did not load correctly.');
      }

      const docxBlob = await htmlToDocx(reportHtmlString, '', {
        margins: { top: 720, right: 720, bottom: 720, left: 720 }
      });
      downloadFile('document.docx', docxBlob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } catch (e) {
      console.error("Error converting HTML to DOCX:", e);
      alert(e instanceof Error ? e.message : "An error occurred while trying to generate the DOCX file.");
    }
    setIsExportMenuOpen(false);
  };
  
  const createHtmlContent = async (markdownContent: string) => {
    const parsedHtml = await marked.parse(markdownContent);
    const styles = getDocumentStyles();
    const dir = language === 'fa' ? 'rtl' : 'ltr';
    const lang = language;

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <title>${t('reportDisplay.docTitle')}</title>
  <style>${styles}</style>
</head>
<body dir="${dir}">
  <div class="document-page">
    <div class="document-header">
        <div class="document-logo">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#005149"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" font-weight="bold" fill="#F5B501">ک</text></svg>
            <span class="font-bold text-teal-dark">Kar-Yab AI</span>
        </div>
        <div class="document-header-info">
            <p><strong>${t('reportDisplay.headerDate')}:</strong> ${currentDate}</p>
            <p><strong>${t('reportDisplay.headerCaseNo')}:</strong> ${t('reportDisplay.caseNoPlaceholder')}</p>
        </div>
    </div>
    <div class="document-body">
      ${parsedHtml}
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadHTML = async () => {
    const htmlContent = await createHtmlContent(generatedDocument);
    downloadFile('document.html', htmlContent, 'text/html;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handlePrint = async () => {
    const htmlContent = await createHtmlContent(generatedDocument);
    const printWindow = window.open('', '_blank');
    if(printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
    setIsExportMenuOpen(false);
  };

  const handleShareEmail = () => {
    const subject = t('reportDisplay.docTitle');
    const body = `Please find the legal document details below:\n\n---\n\n${generatedDocument}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setIsExportMenuOpen(false);
  };

  const handleShareWhatsApp = () => {
    const text = `${t('reportDisplay.docTitle')}\n\n---\n\n${generatedDocument}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsExportMenuOpen(false);
  };

  const handleNextMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
    }
  };

  const handlePrevMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 relative">
        <h3 className="text-lg font-semibold text-teal-dark flex items-center" key={isComplete ? 'complete' : 'pending'}>
          {isComplete && (
            <svg className="h-5 w-5 text-green-500 ml-2 animate-fade-in" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {t('reportDisplay.title')}
        </h3>
        <div className="flex items-center space-x-2">
            {isComplete && (
                 <button onClick={() => setIsSearchVisible(prev => !prev)} className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-md transition-colors" title="Search document">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                 </button>
            )}
            {isComplete && (
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setIsExportMenuOpen(prev => !prev)}
                  className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm rounded-md transition-colors flex items-center"
                >
                  {t('reportDisplay.export')}
                  <svg className={`w-4 h-4 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''} ${language === 'fa' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isExportMenuOpen && (
                  <div className={`absolute mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200 ${language === 'fa' ? 'left-0' : 'right-0'}`}>
                    <ul className="py-1 text-gray-700 text-sm">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleCopy}>{t('reportDisplay.copy')}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDownloadMD}>{t('reportDisplay.downloadMD')}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDownloadDOCX}>{t('reportDisplay.downloadDOCX')}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleDownloadHTML}>{t('reportDisplay.downloadHTML')}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handlePrint}>{t('reportDisplay.printPDF')}</li>
                      <li className="border-t border-gray-200 my-1"></li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleShareEmail}>{t('reportDisplay.shareEmail')}</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleShareWhatsApp}>{t('reportDisplay.shareWhatsApp')}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
        {isSearchVisible && isComplete && (
            <div className="absolute top-full left-0 right-0 bg-gray-100 p-2 z-10 border-b border-gray-200 flex items-center gap-2 animate-fade-in">
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-grow bg-white border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-teal-blue text-teal-dark text-sm"
                />
                <span className="text-xs text-gray-500 w-20 text-center">
                    {searchMatches.length > 0 ? `${currentMatchIndex + 1} / ${searchMatches.length}` : '0 / 0'}
                </span>
                <button onClick={handlePrevMatch} disabled={searchMatches.length === 0} className="p-1 text-gray-600 disabled:text-gray-300 hover:bg-gray-200 rounded-md transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
                <button onClick={handleNextMatch} disabled={searchMatches.length === 0} className="p-1 text-gray-600 disabled:text-gray-300 hover:bg-gray-200 rounded-md transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></button>
                <button onClick={() => setIsSearchVisible(false)} className="p-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
            </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto bg-gray-100 p-4 sm:p-8">
        <div className="document-page">
          {!isLoading && !error && isComplete && (
            <div className="document-header animate-fade-in">
                <div className="document-logo">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="12" fill="#005149"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="40" font-weight="bold" fill="#F5B501">ک</text></svg>
                    <span className="font-bold text-teal-dark">Kar-Yab AI</span>
                </div>
                <div className="document-header-info">
                    <p><strong>${t('reportDisplay.headerDate')}:</strong> ${currentDate}</p>
                    <p><strong>${t('reportDisplay.headerCaseNo')}:</strong> ${t('reportDisplay.caseNoPlaceholder')}</p>
                </div>
            </div>
          )}

          <div className="document-body">
            {error && <div className="text-red-600 p-4 bg-red-100 border border-red-200 rounded-md">{error}</div>}
            
            <div className="prose prose-sm sm:prose-base max-w-none prose-p:text-gray-800 prose-li:text-gray-800" dangerouslySetInnerHTML={{ __html: reportHtml }} />

            {isLoading && (
              <div className="flex items-center justify-center pt-4">
                <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-teal-blue"></div>
                <span className="text-gray-500 ${language === 'fa' ? 'mr-2' : 'ml-2'}">{t('reportDisplay.generating')}</span>
              </div>
            )}

            {!isLoading && !generatedDocument && !error && (
                <div className="text-center text-gray-500 py-16">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm font-semibold">{t('reportDisplay.placeholder1')}</p>
                    <p className="mt-1 text-sm">{t('reportDisplay.placeholder2')}</p>
                </div>
            )}
            <div ref={endOfReportRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDisplay;
