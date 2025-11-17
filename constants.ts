export const REPORT_TYPES = [
    { value: 'petition' },
    { value: 'contract' },
    { value: 'statement' },
    { value: 'power_of_attorney' },
    { value: 'legal_warning' },
    { value: 'complaint' },
];

export const fa = {
    langCode: 'fa',
    dir: 'rtl',
    font: 'font-iransans',
    header: {
        resumeBuilder: 'رزومه‌ساز',
        jobTracker: 'ردیاب شغل',
        tools: 'ابزارها',
        resources: 'منابع',
        login: 'ورود',
        signup: 'ثبت نام',
        professionalTools: 'ابزارهای تخصصی',
        // old feature links
        legal_drafter: 'دستیار حقوقی',
        lawyer_finder: 'وکیل‌یاب',
        news_summarizer: 'خلاصه اخبار',
        case_strategist: 'استراتژی پرونده',
        notary_finder: 'دفترخانه‌یاب',
        web_analyzer: 'تحلیلگر وب',
        contract_analyzer: 'تحلیلگر قرارداد',
        evidence_analyzer: 'تحلیلگر مدارک',
        image_generator: 'تصویرساز',
        corporate_services: 'خدمات شرکتی',
        insurance_services: 'خدمات بیمه',
        job_assistant: 'دستیار کاریابی',
    },
    home: {
        title: 'رزومه بهتر. جستجوی سریعتر. مصاحبه‌های بیشتر.',
        subtitle: 'با مجموعه ابزارهای شغلی ما، جستجوی شغل خود را ساده کرده و شغل بعدی خود را سریعتر پیدا کنید.',
        cta: 'ثبت نام کنید - ۱۰۰٪ رایگان!',
        tabs: {
            resumeBuilder: 'رزومه‌ساز هوشمند',
            jobTracker: 'ردیاب شغل',
            matchingMode: 'حالت تطبیق',
        },
        howItWorks: {
            title: 'چگونه کار می‌کند',
            step1: 'ثبت نام!',
            step2: 'جستجو',
            step3: 'درخواست',
            step4: 'رشد',
            cta: 'رایگان شروع کنید'
        },
        otherFeatures: {
            title: 'سایر امکانات'
        }
    },
    footer: {
        tools: 'ابزارها',
        templates: 'قالب‌ها و نمونه‌ها',
        resources: 'منابع',
        company: 'شرکت',
        copyright: `© ${new Date().getFullYear()} Kar-Yab AI. تمام حقوق محفوظ است.`
    },
    // Keep other translations...
    jobAssistant: {
        heroDescription: 'رزومه و نامه پوششی خود را برای هر آگهی به صورت هوشمند آماده کنید.',
        subtitle: 'ابزارهای هوشمند برای بهینه‌سازی فرآیند درخواست شغل شما.',
        tabs: {
            apply: 'درخواست جدید',
            dashboard: 'داشبورد',
            cv: 'رزومه من'
        },
        apply: {
            title: 'ایجاد درخواست جدید',
            jobUrlLabel: 'آدرس اینترنتی آگهی شغل (URL)',
            jobUrlPlaceholder: 'https://example.com/job/123',
            jobDescLabel: 'شرح شغل',
            jobDescPlaceholder: 'متن آگهی شغل را اینجا کپی کنید...',
            generateButton: 'تولید رزومه و نامه پوششی'
        },
        preview: {
            title: 'پیش‌نمایش و ارسال',
            resume: 'رزومه سفارشی‌شده',
            coverLetter: 'نامه پوششی',
            whatsappButton: 'ارسال برای تایید (واتساپ)',
            applyButton: 'ارسال درخواست (ایمیل)'
        },
        dashboard: {
            title: 'داشبورد درخواست‌ها',
            jobTitle: 'عنوان شغلی',
            company: 'شرکت',
            date: 'آخرین بروزرسانی',
            status: 'وضعیت',
            noApps: 'هنوز درخواستی ثبت نشده است.'
        },
        cv: {
            title: 'مدیریت رزومه',
            description: 'رزومه اصلی خود را اینجا بارگذاری یا ویرایش کنید. این رزومه به عنوان پایه برای تمام درخواست‌های شما استفاده خواهد شد.',
            dropzone: 'فایل رزومه (TXT, MD) را اینجا بکشید یا برای انتخاب کلیک کنید',
            placeholder: 'متن رزومه خود را اینجا وارد کنید...',
            linkedinLabel: 'همگام‌سازی با پروفایل لینکدین',
            linkedinPlaceholder: 'URL پروفایل لینکدین خود را وارد کنید...',
            syncButton: 'همگام‌سازی پروفایل',
            syncingButton: 'در حال همگام‌سازی...',
            parsing: 'در حال پردازش فایل...'
        },
        status: {
            draft: 'پیش‌نویس',
            pending_approval: 'در انتظار تایید',
            applying: 'در حال ارسال',
            applied: 'ارسال شد',
            viewed: 'مشاهده شد',
            interview_scheduled: 'مصاحبه تنظیم شد',
            offer_received: 'پیشنهاد دریافت شد',
            rejected: 'رد شد',
            error: 'خطا',
            scraping: 'در حال استخراج اطلاعات شغل...',
            generatingResume: 'در حال تولید رزومه سفارشی...',
            generatingCoverLetter: 'در حال تولید نامه پوششی...',
            sendingApproval: 'در حال ارسال برای تایید...',
            approvalWaiting: 'در انتظار تایید شما... (شبیه‌سازی شده)'
        },
        error: {
            noCv: 'لطفا ابتدا رزومه خود را در تب "رزومه من" وارد کنید.',
            noJob: 'لطفا آدرس آگهی یا شرح شغل را وارد کنید.',
            unsupportedFile: 'نوع فایل پشتیبانی نمی‌شود. لطفا یک فایل .txt یا .md بارگذاری کنید.'
        }
    },
};

export const en = {
    langCode: 'en',
    dir: 'ltr',
    font: 'font-inter',
    header: {
        resumeBuilder: 'Resume Builder',
        jobTracker: 'Job Tracker',
        tools: 'Tools',
        resources: 'Resources',
        login: 'Log in',
        signup: 'Sign up',
        professionalTools: 'Professional Tools',
        legal_drafter: 'Legal Drafter',
        lawyer_finder: 'Lawyer Finder',
        news_summarizer: 'News Summarizer',
        case_strategist: 'Case Strategist',
        notary_finder: 'Notary Finder',
        web_analyzer: 'Web Analyzer',
        contract_analyzer: 'Contract Analyzer',
        evidence_analyzer: 'Evidence Analyzer',
        image_generator: 'Image Generator',
        corporate_services: 'Corporate Services',
        insurance_services: 'Insurance Services',
        job_assistant: 'AI Job Assistant',
    },
    home: {
        title: 'Better Resume. Faster Search. 6X the Interviews.',
        subtitle: "Simplify your job search and land your next job faster with Kar-Yab's suite of career tools.",
        cta: "Sign Up! - It's 100% Free!",
        tabs: {
            resumeBuilder: 'AI Resume Builder',
            jobTracker: 'Job Tracker',
            matchingMode: 'Matching Mode',
        },
        howItWorks: {
            title: 'How it Works',
            step1: 'Sign Up!',
            step2: 'Search',
            step3: 'Apply',
            step4: 'Grow',
            cta: 'Get Started for Free'
        },
        otherFeatures: {
            title: 'Other Features'
        }
    },
    footer: {
        tools: 'Tools',
        templates: 'Templates & Examples',
        resources: 'Resources',
        company: 'Company',
        copyright: `© ${new Date().getFullYear()} Kar-Yab AI. All rights reserved.`
    },
    jobAssistant: {
        heroDescription: 'Intelligently prepare your resume and cover letter for any job posting.',
        subtitle: 'Smart tools to optimize your job application process.',
        tabs: {
            apply: 'New Application',
            dashboard: 'Dashboard',
            cv: 'My CV'
        },
        apply: {
            title: 'Create New Application',
            jobUrlLabel: 'Job Posting URL',
            jobUrlPlaceholder: 'https://example.com/job/123',
            jobDescLabel: 'Job Description',
            jobDescPlaceholder: 'Paste the job description text here...',
            generateButton: 'Generate Resume & Cover Letter'
        },
        preview: {
            title: 'Preview & Send',
            resume: 'Tailored Resume',
            coverLetter: 'Cover Letter',
            whatsappButton: 'Send for Approval (WhatsApp)',
            applyButton: 'Apply (Email)'
        },
        dashboard: {
            title: 'Application Dashboard',
            jobTitle: 'Job Title',
            company: 'Company',
            date: 'Last Updated',
            status: 'Status',
            noApps: 'No applications have been created yet.'
        },
        cv: {
            title: 'CV Management',
            description: 'Upload or edit your master CV here. This will be used as the base for all your applications.',
            dropzone: 'Drag & drop CV file (TXT, MD) here, or click to select',
            placeholder: 'Paste your CV text here...',
            linkedinLabel: 'Sync with LinkedIn Profile',
            linkedinPlaceholder: 'Enter your LinkedIn profile URL...',
            syncButton: 'Sync Profile',
            syncingButton: 'Syncing...',
            parsing: 'Parsing file...',
        },
        status: {
            draft: 'Draft',
            pending_approval: 'Pending Approval',
            applying: 'Applying',
            applied: 'Applied',
            viewed: 'Viewed',
            interview_scheduled: 'Interview',
            offer_received: 'Offer',
            rejected: 'Rejected',
            error: 'Error',
            scraping: 'Extracting job details...',
            generatingResume: 'Generating tailored resume...',
            generatingCoverLetter: 'Generating cover letter...',
            sendingApproval: 'Sending for approval...',
            approvalWaiting: 'Waiting for your approval... (Simulated)'
        },
        error: {
            noCv: 'Please enter your CV in the "My CV" tab first.',
            noJob: 'Please enter a job URL or description.',
            unsupportedFile: 'Unsupported file type. Please upload a .txt or .md file.',
        }
    },
};

export const DEFAULT_SUGGESTIONS = {
  // ... (no changes needed)
};