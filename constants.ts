export const REPORT_TYPES = [
    { value: 'petition' },
    { value: 'contract' },
    { value: 'statement' },
    { value: 'power_of_attorney' },
    { value: 'legal_warning' },
    { value: 'complaint' },
];

export const RESUME_ANALYSIS_CRITERIA = [
    { id: 1, category: { fa: 'توانایی‌های ذهنی و تمرکز', en: 'Focus & Cognitive Abilities' }, requirement: { fa: 'توانایی اینکه یک جا بنشینی و ۱۲ ساعت فقط متمرکز کار کنی.', en: 'Ability to sit in one place and work focused for 12 hours.' } },
    { id: 2, category: { fa: 'توانایی‌های ذهنی و تمرکز', en: 'Focus & Cognitive Abilities' }, requirement: { fa: 'هوش ریاضی و محاسبه لحظه‌ای.', en: 'Mathematical intelligence and real-time calculation.' } },
    { id: 3, category: { fa: 'توانایی‌های ذهنی و تمرکز', en: 'Focus & Cognitive Abilities' }, requirement: { fa: 'قدرت حافظه کلامی و بصری به تفکیک.', en: 'Strength of verbal and visual memory, separately.' } },
    { id: 4, category: { fa: 'توانایی‌های ذهنی و تمرکز', en: 'Focus & Cognitive Abilities' }, requirement: { fa: 'هوش جسمی و قدرت یادگیری سریع حرکات با یک بار دیدن.', en: 'Physical intelligence and ability to quickly learn movements after seeing them once.' } },
    { id: 5, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'میزان تبحر در کار فنی و تعمیر قطعات.', en: 'Level of expertise in technical work and component repair.' } },
    { id: 6, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'امکان تعمیر دستگاه خاص.', en: 'Ability to repair a specific device.' } },
    { id: 7, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'شناخت شیمیایی مواد و علاقه به علم شیمی.', en: 'Chemical knowledge of materials and interest in chemistry.' } },
    { id: 8, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'شناخت عمیق نسبت به یه محصول خاص.', en: 'Deep knowledge of a specific product.' } },
    { id: 9, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'هنر آشپزی موسیقی و ...', en: 'Skills in cooking, music, etc.' } },
    { id: 10, category: { fa: 'تخصص و دانش فنی', en: 'Hard Skills & Expertise' }, requirement: { fa: 'علایق کودکی و بازی‌های مورد علاقه.', en: 'Childhood interests and favorite games.' } },
    { id: 11, category: { fa: 'مهارت‌های ارتباطی و فروش', en: 'Communication & Sales Skills' }, requirement: { fa: 'قدرت فروشندگی.', en: 'Sales ability.' } },
    { id: 12, category: { fa: 'مهارت‌های ارتباطی و فروش', en: 'Communication & Sales Skills' }, requirement: { fa: 'توانایی و مهارت مذاکره و متقاعدسازی.', en: 'Ability and skill in negotiation and persuasion.' } },
    { id: 13, category: { fa: 'مهارت‌های ارتباطی و فروش', en: 'Communication & Sales Skills' }, requirement: { fa: 'قدرت گویندگی.', en: 'Public speaking ability.' } },
    { id: 14, category: { fa: 'مهارت‌های ارتباطی و فروش', en: 'Communication & Sales Skills' }, requirement: { fa: 'قدرت نویسندگی.', en: 'Writing ability.' } },
    { id: 15, category: { fa: 'مهارت‌های ارتباطی و فروش', en: 'Communication & Sales Skills' }, requirement: { fa: 'توانایی زبان انگلیسی.', en: 'English language proficiency.' } },
    { id: 16, category: { fa: 'استراتژی و دیدگاه کسب‌وکار', en: 'Strategy & Business Vision' }, requirement: { fa: 'سرویس دهی در شرایط سخت اقتصادی باید به قشر ثروتمند جامعه باشه.', en: 'Belief that service in tough economic times should target the wealthy class.' } },
    { id: 17, category: { fa: 'استراتژی و دیدگاه کسب‌وکار', en: 'Strategy & Business Vision' }, requirement: { fa: 'باید ببینی چه ارزش تلفیقی ممکنه بسازی که برای اون آدم پولداره جذاب و خاص هست و رقیب نداری توش.', en: 'Ability to create a unique value proposition for a wealthy demographic with no competition.' } },
    { id: 18, category: { fa: 'استراتژی و دیدگاه کسب‌وکار', en: 'Strategy & Business Vision' }, requirement: { fa: 'این میشه رزومه واقعی آدم‌ها برای خودشون بدون نیاز به ارائه به دیگران.', en: 'Understands the concept of a "real resume" for self-assessment.' } },
    { id: 19, category: { fa: 'استراتژی و دیدگاه کسب‌وکار', en: 'Strategy & Business Vision' }, requirement: { fa: 'هر توانمندی غیر از آشنایی با AI.', en: 'Any capability besides familiarity with AI.' } },
    { id: 20, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'اندوخته بانکی و یا امکان وام.', en: 'Bank savings or loan eligibility.' } },
    { id: 21, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'حساب بانکی بنام خودت خارج از ایران.', en: 'Personal bank account outside of Iran.' } },
    { id: 22, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'حمایت از خانواده و یا دوستان بسیار نزدیک.', en: 'Support from family or very close friends.' } },
    { id: 23, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'اینترنت پر سرعت با قید میزان سرعتش.', en: 'High-speed internet with specified speed.' } },
    { id: 24, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'یه زیرزمین خالی حتی اگه داری.', en: 'Access to an empty basement/space.' } },
    { id: 25, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'حتی یه لپ تاپ اگه داری.', en: 'Ownership of a laptop.' } },
    { id: 26, category: { fa: 'دارایی‌ها و زیرساخت', en: 'Assets & Resources' }, requirement: { fa: 'امکان مسافرت با خودرو یا قطار.', en: 'Ability to travel by car or train.' } },
    { id: 27, category: { fa: 'الزامات ارزیابی', en: 'Assessment Requirements' }, requirement: { fa: 'برای امروز تمام امکاناتی که داری رو روی کاغذ بنویس.', en: 'Willingness to write down all available facilities today.' } },
    { id: 28, category: { fa: 'الزامات ارزیابی', en: 'Assessment Requirements' }, requirement: { fa: 'هر چیزی که داری.', en: 'Willingness to list everything you have.' } },
    { id: 29, category: { fa: 'الزامات ارزیابی', en: 'Assessment Requirements' }, requirement: { fa: 'همه اون رابط ها دارایی تو هستند.', en: 'Recognition that all connections are assets.' } },
    { id: 30, category: { fa: 'الزامات ارزیابی', en: 'Assessment Requirements' }, requirement: { fa: 'هر چیزی تکرار می کنم.', en: 'Emphasis on listing everything, repeatedly.' } },
    { id: 31, category: { fa: 'الزامات ارزیابی', en: 'Assessment Requirements' }, requirement: { fa: 'هر چیزی که داری باید مکتوب بشه.', en: 'Requirement that everything owned must be written down.' } }
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
        resume_analyzer: 'تحلیلگر رزومه',
    },
    home: {
        title: 'رزومه بهتر. جستجوی سریعتر. مصاحبه‌های بیشتر.',
        subtitle: 'با مجموعه ابزارهای شغلی ما، جستجوی شغل خود را ساده کرده و شغل بعدی خود را سریعتر پیدا کنید.',
        cta: 'رایگان شروع کنید!',
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
            title: 'ابزارهای تخصصی ما'
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
            dropzone: 'فایل رزومه (TXT, MD, DOCX, PDF) را اینجا بکشید یا برای انتخاب کلیک کنید',
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
            unsupportedFile: 'نوع فایل پشتیبانی نمی‌شود. لطفا یک فایل .txt، .md، .docx یا .pdf بارگذاری کنید.'
        }
    },
    resumeAnalyzer: {
        title: 'تحلیلگر تخصصی رزومه',
        subtitle: 'رزومه خود را بارگذاری کنید تا یک تحلیل عمیق بر اساس ۳۱ معیار کلیدی دریافت کنید و با مصاحبه‌گر هوش مصنوعی ما گفتگو کنید.',
        uploadTab: 'بارگذاری فایل',
        textTab: 'کپی متن',
        dropzone: 'فایل رزومه (TXT, MD, DOCX, PDF) را اینجا رها کنید، یا برای انتخاب کلیک کنید',
        placeholder: 'متن رزومه خود را اینجا جای‌گذاری کنید...',
        analyzeButton: 'شروع تحلیل',
        analyzingButton: 'در حال تحلیل...',
        table: {
            title: 'تحلیل و وضعیت توانمندی‌های محوری',
            category: 'دسته‌بندی',
            requirement: 'الزام',
            status: 'وضعیت',
            evidence: 'شواهد استخراج شده',
            present: 'موجود',
            implicit: 'ضمنی',
            missing: 'مفقود',
            noEvidence: 'شواهدی یافت نشد',
            showDetails: 'نمایش جزئیات',
            hideDetails: 'پنهان کردن جزئیات',
        },
        chat: {
            initialMessage: 'تحلیل اولیه رزومه شما کامل شد. برای تکمیل "رزومه واقعی" و ارزیابی نهایی، چند سوال از موارد مفقود یا ضمنی خواهم پرسید. لطفاً با متن یا صدا پاسخ دهید.',
            placeholder: 'پاسخ خود را تایپ کنید...',
            listening: 'در حال شنیدن...',
        }
    }
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
        resume_analyzer: 'Resume Analyzer',
    },
    home: {
        title: 'Better Resumes. Faster Job Search. More Interviews.',
        subtitle: "Simplify your job search and land your next job faster with Kar-Yab's suite of career tools.",
        cta: "Get Started - It's Free!",
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
            title: 'Explore Our Specialized Tools'
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
            dropzone: 'Drag & drop CV file (TXT, MD, DOCX, PDF) here, or click to select',
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
            unsupportedFile: 'Unsupported file type. Please upload a .txt, .md, .docx, or .pdf file.',
        }
    },
    resumeAnalyzer: {
        title: 'Expert Resume Analyzer',
        subtitle: 'Upload your resume to get a deep analysis based on 31 key criteria and chat with our AI interviewer.',
        uploadTab: 'Upload File',
        textTab: 'Paste Text',
        dropzone: 'Drop your resume file (TXT, MD, DOCX, PDF) here, or click to select',
        placeholder: 'Paste your resume text here...',
        analyzeButton: 'Start Analysis',
        analyzingButton: 'Analyzing...',
        table: {
            title: 'Core Competencies Analysis & Status',
            category: 'Category',
            requirement: 'Requirement',
            status: 'Status',
            evidence: 'Extracted Evidence',
            present: 'Present',
            implicit: 'Implicit',
            missing: 'Missing',
            noEvidence: 'No evidence found',
            showDetails: 'Show Details',
            hideDetails: 'Hide Details',
        },
        chat: {
            initialMessage: 'Your initial resume analysis is complete. To build out your "real resume" and finalize the assessment, I\'ll ask a few questions about the missing or implicit items. Please respond via text or voice.',
            placeholder: 'Type your answer...',
            listening: 'Listening...',
        }
    }
};

export const DEFAULT_SUGGESTIONS = {
  // ... (no changes needed)
};