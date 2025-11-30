
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
        dashboard: 'پیشخوان (WP)',
        tools: 'ابزارها',
        resources: 'منابع',
        login: 'ورود',
        signup: 'ثبت نام',
        professionalTools: 'ابزارهای تخصصی',
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
        healthStatus: {
            checking: 'در حال بررسی وضعیت API...',
            ok: 'اتصال به API برقرار است.',
            error: 'خطا در اتصال به API.'
        }
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
    dashboard: {
        welcome: 'خوش آمدید',
        atAGlance: 'در یک نگاه',
        quickDraft: 'پیش‌نویس سریع',
        activity: 'فعالیت',
        posts: 'نوشته‌ها',
        media: 'رسانه',
        pages: 'برگه‌ها',
        comments: 'دیدگاه‌ها',
        appearance: 'نمایش',
        plugins: 'افزونه‌ها',
        users: 'کاربران',
        tools: 'ابزارها',
        settings: 'تنظیمات',
        howdy: 'سلام، مدیر',
        screenOptions: 'تنظیمات صفحه',
        help: 'راهنما',
        all: 'همه',
        published: 'منتشر شده',
        search: 'جستجو',
        bulkActions: 'کارهای دسته‌جمعی',
        apply: 'اجرا',
        filter: 'صافی',
        title: 'عنوان',
        author: 'نویسنده',
        date: 'تاریخ',
        edit: 'ویرایش',
        quickEdit: 'ویرایش سریع',
        trash: 'زباله‌دان',
        view: 'نمایش',
        stats: {
            applications: 'درخواست',
            lawyers: 'وکیل',
            generatedDocs: 'سند'
        },
        noActivity: 'فعالیتی نیست.'
    },
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
            dropzone: 'فایل رزومه یا پروفایل لینکدین (PDF, DOCX, TXT, MD) را اینجا بکشید یا برای انتخاب کلیک کنید',
            placeholder: 'متن رزومه خود را اینجا وارد کنید...',
            linkedinLabel: 'همگام‌سازی با پروفایل لینکدین',
            linkedinPlaceholder: 'URL پروفایل لینکدین خود را وارد کنید...',
            syncButton: 'همگام‌سازی پروفایل',
            syncingButton: 'در حال همگام‌سازی...',
            parsing: 'در حال پردازش فایل...'
        },
        jobSearch: {
            title: 'جستجوی شغل متناسب با رزومه',
            button: 'یافتن شغل‌های مرتبط',
            loading: 'در حال تحلیل رزومه و جستجو...'
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
            unsupportedFile: 'نوع فایل پشتیبانی نمی‌شود. لطفا یک فایل PDF، DOCX، TXT یا MD بارگذاری کنید.'
        },
        autoSave: {
            saving: 'در حال ذخیره...',
            saved: 'ذخیره شد'
        }
    },
    resumeAnalyzer: {
        title: 'تحلیلگر تخصصی رزومه',
        subtitle: 'رزومه خود را بارگذاری کنید تا یک تحلیل عمیق بر اساس ۳۱ معیار کلیدی دریافت کنید و با مصاحبه‌گر هوش مصنوعی ما گفتگو کنید.',
        uploadTab: 'بارگذاری فایل',
        textTab: 'کپی متن',
        dropzone: 'فایل رزومه (PDF, DOCX, TXT, MD) را اینجا رها کنید، یا برای انتخاب کلیک کنید',
        placeholder: 'متن رزومه خود را اینجا جای‌گذاری کنید...',
        analyzeButton: 'شروع تحلیل',
        analyzingButton: 'در حال تحلیل...',
        overallScore: 'امتیاز کلی',
        predictedRole: 'نقش پیش‌بینی شده',
        improveButton: 'ساخت رزومه اصلاح شده (PDF/Word)',
        improvingButton: 'در حال بازنویسی...',
        improvedTitle: 'رزومه حرفه‌ای جدید شما',
        findJobsButton: 'یافتن شغل‌های مرتبط',
        findingJobs: 'در حال جستجو...',
        jobsTitle: 'فرصت‌های شغلی پیشنهادی',
        linkedin: {
            tab: 'پروفایل لینکدین',
            importButton: 'دریافت پروفایل و تحلیل'
        },
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
        },
        chat: {
            initialMessage: 'تحلیل اولیه رزومه شما کامل شد. برای تکمیل "رزومه واقعی" و ارزیابی نهایی، چند سوال از موارد مفقود یا ضمنی خواهم پرسید. لطفاً با متن یا صدا پاسخ دهید.',
            placeholder: 'پاسخ خود را تایپ کنید...',
            listening: 'در حال شنیدن...',
        },
        progressBar: {
            upload: 'بارگذاری',
            parse: 'پردازش فایل',
            analyze: 'تحلیل محتوا',
            complete: 'تکمیل شد',
        },
        aiThoughts: {
            title: 'مشاهده افکار هوش مصنوعی',
            finalizing: 'در حال نهایی‌سازی تحلیل...'
        }
    },
    generatorForm: {
        title: 'مشخصات سند حقوقی',
        docType: 'نوع سند',
        topic: 'موضوع',
        topicPlaceholder: 'مثلاً: درخواست طلاق توافقی',
        description: 'شرح درخواست',
        descriptionPlaceholder: 'توضیحات کامل در مورد پرونده و نکات مهم را اینجا بنویسید...',
        useExample: 'استفاده از نمونه',
        buttonText: 'تولید پیش‌نویس',
        validationError: 'لطفاً موضوع و توضیحات را وارد کنید.'
    },
    reportDisplay: {
        title: 'سند تولید شده',
        generating: 'در حال تولید سند...',
        placeholder1: 'سند شما اینجا نمایش داده می‌شود',
        placeholder2: 'فرم را پر کنید و دکمه تولید را بزنید.',
        copy: 'کپی متن',
        downloadMD: 'دانلود Markdown',
        downloadDOCX: 'دانلود Word (DOCX)',
        downloadHTML: 'دانلود HTML',
        printPDF: 'چاپ / PDF',
        shareEmail: 'ارسال با ایمیل',
        shareWhatsApp: 'ارسال با واتساپ',
        export: 'خروجی',
        docTitle: 'سند حقوقی تولید شده با هوش مصنوعی',
        headerDate: 'تاریخ',
        headerCaseNo: 'شماره پرونده',
        caseNoPlaceholder: '---'
    },
    reportTypes: {
        petition: 'دادخواست',
        contract: 'قرارداد',
        statement: 'اظهارنامه',
        power_of_attorney: 'وکالت‌نامه',
        legal_warning: 'اخطاریه قانونی',
        complaint: 'شکواییه'
    },
    reportPrompts: {
        petition: 'یک دادخواست رسمی و حقوقی برای موضوع "{topic}" با توجه به جزئیات زیر بنویس. ساختار استاندارد دادخواست شامل خواهان، خوانده، خواسته و دلایل را رعایت کن.\n\nجزئیات:\n{description}',
        contract: 'یک قرارداد حقوقی کامل و دقیق برای "{topic}" بر اساس توضیحات زیر تنظیم کن. تمام بندهای ضروری شامل طرفین، موضوع، مدت، مبلغ، تعهدات، و حل اختلاف را پوشش بده.\n\nتوضیحات:\n{description}',
        statement: 'یک اظهارنامه رسمی برای موضوع "{topic}" با لحن قاطع و حقوقی بنویس. جزئیات زیر را در متن بگنجان:\n{description}',
        power_of_attorney: 'یک متن وکالت‌نامه برای "{topic}" با حدود اختیارات مشخص شده در زیر تنظیم کن:\n{description}',
        legal_warning: 'یک اخطاریه قانونی رسمی در مورد "{topic}" با استناد به قوانین مربوطه و با توجه به توضیحات زیر بنویس:\n{description}',
        complaint: 'یک شکواییه رسمی برای ارائه به دادسرا با موضوع "{topic}" و شرح ماوقع زیر تنظیم کن:\n{description}'
    },
    reportExamples: {
        petition: { topic: 'مطالبه وجه چک', description: 'چکی به مبلغ ۵۰۰ میلیون ریال به تاریخ سررسید ۱۴۰۲/۱۰/۰۱ صادر شده که در بانک برگشت خورده است. تقاضای صدور حکم به پرداخت وجه چک به انضمام خسارت تاخیر تادیه را دارم.' },
        contract: { topic: 'اجاره آپارتمان مسکونی', description: 'موجر: علی محمدی، مستاجر: رضا احمدی. آپارتمان ۱۰۰ متری در خیابان ولیعصر. مدت یک سال. ودیعه ۲۰۰ میلیون تومان، اجاره ماهیانه ۱۰ میلیون تومان. استفاده مسکونی.' },
        statement: { topic: 'فسخ قرارداد به دلیل عدم انجام تعهد', description: 'طرف مقابل طبق قرارداد شماره ۱۲۳ مورخ ۱۴۰۲/۰۱/۰۱ متعهد به تحویل کالا بوده که انجام نداده است. اخطار جهت فسخ قرارداد و مطالبه خسارت.' },
        power_of_attorney: { topic: 'فروش خودرو', description: 'وکالت کاری و اداری جهت مراجعه به مراکز تعویض پلاک و دفاتر اسناد رسمی برای انتقال سند قطعی خودرو پژو ۲۰۶ به شماره پلاک ...' },
        legal_warning: { topic: 'اخطار تخلیه ملک', description: 'قرارداد اجاره در تاریخ ۱۴۰۲/۱۲/۲۹ به پایان رسیده است. اخطار جهت تخلیه ملک ظرف مدت ۱۰ روز.' },
        complaint: { topic: 'کلاهبرداری اینترنتی', description: 'شخصی با هویت ناشناس در سایت دیوار آگهی فروش موبایل گذاشته و پس از دریافت وجه، گوشی را ارسال نکرده و پاسخگو نیست.' }
    },
    camera: {
        use: 'استفاده از دوربین',
        takePicture: 'عکس گرفتن',
        cancel: 'لغو',
        error: 'خطا در دسترسی به دوربین',
        permissionDenied: 'دسترسی به دوربین رد شد.',
        notFound: 'دوربین پیدا نشد.',
        unsupported: 'مرورگر شما از دوربین پشتیبانی نمی‌کند.',
        orDivider: 'یا',
        captureSectionTitle: 'متن استخراج شده از تصویر',
        extractingText: 'در حال استخراج متن از تصویر...'
    },
    aiSuggestions: {
        thinking: 'در حال فکر کردن...',
        noResults: 'پیشنهادی یافت نشد'
    },
    lawyerFinder: {
        keywordsLabel: 'تخصص یا مشکل حقوقی',
        keywordsPlaceholder: 'مثلاً: طلاق توافقی، کلاهبرداری ملکی، ثبت شرکت...',
        maxResults: 'تعداد نتایج',
        findButton: 'یافتن وکلا',
        finding: 'در حال جستجو...',
        validationError: 'لطفاً کلمات کلیدی را وارد کنید.',
        prompt: 'من به دنبال لیستی از وکلای ایرانی هستم که در زمینه "{queries}" تخصص دارند. لطفاً جدولی شامل نام وکیل، تخصص دقیق، شهر، آدرس، اطلاعات تماس (تلفن/وب‌سایت)، آدرس وب‌سایت (اگر موجود است)، میزان تجربه تخمینی (سال) و امتیاز ارتباط با موضوع (۰ تا ۱۰۰٪) تهیه کن. حداکثر {maxResults} مورد را لیست کن. خروجی را به صورت فرمت Markdown جدول ارائه بده.',
        resultsTitle: 'وکلای پیشنهادی',
        savedTitle: 'وکلای ذخیره شده',
        saved: 'ذخیره شد',
        save: 'ذخیره',
        remove: 'حذف',
        clearAll: 'حذف همه',
        notesLabel: 'یادداشت‌های شخصی',
        notesPlaceholder: 'یادداشت خود را اینجا بنویسید...',
        address: 'آدرس',
        contact: 'تماس',
        sendWhatsApp: 'ارسال در واتساپ',
        whatsAppMessage: 'سلام، من پروفایل شما را در کار-یاب AI دیدم و مایل به مشاوره هستم.',
        example: { keywords: 'دعاوی ملکی و سرقفلی' },
        parseErrorTitle: 'خطا در پردازش ساختار یافته',
        parseErrorSubtitle: 'هوش مصنوعی متنی تولید کرد که قابل تبدیل به جدول نبود. متن خام را در زیر مشاهده کنید:',
        semanticSearchBadge: 'جستجوی معنایی',
        crateTitle: 'صندوق وکلا',
        crateSubtitle: 'جستجو و فیلتر در بین نتایج یافت شده',
        clearCrate: 'پاکسازی صندوق',
        filterByCity: 'فیلتر شهر',
        filterBySpecialty: 'فیلتر تخصص',
        filterByExperience: 'حداقل تجربه (سال)',
        sortBy: 'مرتب‌سازی بر اساس',
        sort: {
            relevance: 'ارتباط با موضوع',
            name: 'نام',
            city: 'شهر',
            experience_desc: 'تجربه (زیاد به کم)',
            city_specialty: 'شهر و تخصص'
        },
        crateEmpty: 'هنوز وکیلی یافت نشده است.',
        noFilterResults: 'با فیلترهای فعلی نتیجه‌ای یافت نشد.',
        aiGeneratedQueryTitle: 'اصلاح هوشمند جستجو',
        aiGeneratedQuerySubtitle: 'هوش مصنوعی عبارت جستجوی شما را برای نتایج بهتر بهینه کرد.',
        confirmAndSearch: 'تایید و جستجو',
        editQuery: 'ویرایش'
    },
    newsSummarizer: {
        queryLabel: 'موضوع خبر',
        queryPlaceholder: 'مثلاً: تغییرات قانون کار در سال ۱۴۰۳',
        buttonText: 'جستجو و خلاصه اخبار',
        summarizing: 'در حال جستجو و خلاصه سازی...',
        validationError: 'لطفاً موضوع خبر را وارد کنید.',
        prompt: 'لطفاً جدیدترین اخبار و تحولات پیرامون "{query}" در ایران را جستجو کن. سپس یک خلاصه جامع و ساختاریافته به زبان فارسی ارائه بده. منابع معتبر را در انتهای متن ذکر کن.',
        example: { query: 'افزایش حقوق بازنشستگان تامین اجتماعی ۱۴۰۳' },
        sourcesTitle: 'منابع'
    },
    caseStrategist: {
        goalLabel: 'هدف حقوقی',
        goalPlaceholder: 'مثلاً: می‌خواهم برای کاهش مهریه اقدام کنم...',
        buttonText: 'تولید استراتژی',
        generating: 'در حال طراحی استراتژی...',
        validationError: 'لطفاً هدف خود را وارد کنید.',
        prompt: 'کاربر هدف حقوقی زیر را دارد: "{goal}". لطفاً یک استراتژی گام‌به‌گام برای رسیدن به این هدف طراحی کن. خروجی باید یک آرایه JSON از اشیاء باشد که هر کدام شامل فیلدهای زیر است: taskName (عنوان گام)، description (توضیحات دقیق)، effortPercentage (تخمین درصد سختی کار از ۰ تا ۱۰۰)، deliverableType (نوع خروجی این گام، مثلا "متن"، "تحقیق"، "اقدام")، و suggestedPrompt (یک پرامپت پیشنهادی برای هوش مصنوعی جهت کمک به انجام این گام).',
        executeTaskPrompt: 'من می‌خواهم گام "{taskName}" را انجام دهم. توضیحات گام: "{description}". لطفاً بر اساس این اطلاعات و پرامپت پیشنهادی "{suggestedPrompt}"، یک پیش‌نویس یا راهنمای عملی برای من آماده کن تا بتوانم این گام را تکمیل کنم. خروجی باید یک JSON باشد با فیلدهای: docType (یکی از موارد: {docTypeOptions} که مناسب‌ترین است، یا اگر هیچکدام نبود، نزدیکترین)، topic (موضوع سند)، description (متن کامل پیش‌نویس یا راهنما).',
        resultsTitle: 'نقشه راه پیشنهادی',
        effort: 'سختی',
        deliverable: 'خروجی',
        suggestedPrompt: 'پرامپت پیشنهادی',
        executeTask: 'اجرای این گام',
        executingTask: 'در حال اجرا...',
        example: { goal: 'ثبت برند تجاری مواد غذایی' }
    },
    notaryFinder: {
        keywordsLabel: 'خدمات مورد نیاز',
        keywordsPlaceholder: 'مثلاً: گواهی امضا، سند رهنی، وکالت فروش...',
        findButton: 'یافتن دفاتر اسناد رسمی',
        finding: 'در حال جستجو...',
        validationError: 'لطفاً خدمات مورد نیاز را وارد کنید.',
        prompt: 'من به دنبال دفاتر اسناد رسمی (محضر) در ایران هستم که خدمات "{keywords}" را ارائه می‌دهند یا برای آن مناسب هستند. لطفاً لیستی شامل نام دفترخانه، شهر، آدرس دقیق، شماره تماس، وب‌سایت (در صورت وجود) و خدمات شاخص را پیدا کن. خروجی را به صورت یک جدول Markdown ارائه بده.',
        resultsTitle: 'دفاتر اسناد رسمی پیشنهادی',
        address: 'آدرس',
        contact: 'تماس',
        services: 'خدمات',
        sendWhatsApp: 'ارسال پیام',
        whatsAppMessage: 'سلام، جهت هماهنگی برای خدمات ثبتی پیام می‌دهم.',
        example: { keywords: 'تنظیم سند قطعی غیرمنقول' },
        parseErrorTitle: 'خطا در پردازش',
        parseErrorSubtitle: 'اطلاعات یافت شد اما در قالب جدول استاندارد نیست:',
        aiGeneratedQueryTitle: 'پیشنهاد جستجوی بهتر',
        aiGeneratedQuerySubtitle: 'برای یافتن دفاتر مرتبط‌تر، عبارت جستجو بهینه شد.',
        confirmAndSearch: 'تایید و جستجو',
        editQuery: 'ویرایش',
        filterByCity: 'فیلتر شهر',
        filterByOfficeName: 'نام دفترخانه',
        filterByService: 'نوع خدمت',
        sortBy: 'مرتب‌سازی',
        sort: {
            officeName: 'نام دفترخانه',
            city: 'شهر'
        },
        noFilterResults: 'دفتری با این مشخصات یافت نشد.',
        crateEmpty: 'هنوز جستجویی انجام نشده است.'
    },
    webAnalyzer: {
        urlLabel: 'آدرس وب‌سایت',
        urlPlaceholder: 'https://...',
        queryLabel: 'سوال یا دستورالعمل',
        queryPlaceholder: 'مثلاً: شرایط و قوانین این سایت را خلاصه کن...',
        buttonText: 'تحلیل وب‌سایت',
        analyzing: 'در حال تحلیل...',
        validationError: 'لطفاً آدرس و سوال را وارد کنید.',
        prompt: 'لطفاً محتوای وب‌سایت به آدرس "{url}" را مطالعه کن و به درخواست زیر پاسخ بده: "{query}". پاسخ باید جامع و به زبان فارسی باشد. اگر لازم است به بخش‌های خاصی از متن سایت ارجاع بده.',
        example: { url: 'https://rrk.ir', query: 'آخرین قوانین مصوب در مورد چک صیادی را پیدا کن.' }
    },
    contractAnalyzer: {
        uploadTab: 'آپلود فایل',
        textTab: 'متن قرارداد',
        dropzoneText: 'فایل قرارداد (PDF/DOCX/عکس) را اینجا بکشید',
        unsupportedFileType: 'فرمت فایل پشتیبانی نمی‌شود.',
        userQueryLabel: 'سوال یا نکته خاص (اختیاری)',
        userQueryPlaceholder: 'مثلاً: آیا بند فسخ به نفع من است؟',
        analyzing: 'در حال تحلیل...',
        analyzeButton: 'تحلیل قرارداد',
        prompt: 'تو یک مشاور حقوقی خبره هستی. متن قرارداد زیر را به دقت بررسی کن. به دنبال ریسک‌های قانونی، ابهامات، و بندهای ناعادلانه باش. اگر کاربر سوال خاصی پرسیده ("{userQuery}")، به آن پاسخ دقیق بده. در نهایت یک خلاصه از نقاط قوت و ضعف قرارداد ارائه کن. خروجی باید به زبان فارسی و فرمت Markdown باشد.',
        example: { userQuery: 'آیا جریمه دیرکرد در این قرارداد متعارف است؟' }
    },
    evidenceAnalyzer: {
        dropzoneText: 'تصویر مدرک (عکس/PDF) را اینجا بکشید',
        userQueryLabel: 'سوال در مورد مدرک',
        userQueryPlaceholder: 'مثلاً: آیا این امضا معتبر به نظر می‌رسد؟ تاریخ سند چیست؟',
        analyzing: 'در حال بررسی...',
        analyzeButton: 'بررسی مدرک',
        prompt: 'تصویر ارائه شده یک مدرک یا سند است. لطفاً آن را با دقت بررسی کن. تمام متن‌های قابل خواندن، تاریخ‌ها، امضاها و مهرهای موجود را شناسایی کن. به سوال کاربر پاسخ بده: "{userQuery}". اگر نکته مشکوک یا غیرعادی در ظاهر سند وجود دارد، ذکر کن.',
        example: { userQuery: 'تاریخ و مبلغ ذکر شده در این رسید را استخراج کن.' },
        extractText: {
            button: 'استخراج متن تصویر (OCR)',
            extracting: 'در حال استخراج...',
            copy: 'کپی متن',
            copied: 'کپی شد!',
            title: 'متن استخراج شده'
        }
    },
    imageGenerator: {
        promptLabel: 'توصیف تصویر',
        promptPlaceholder: 'مثلاً: تصویری از یک دادگاه در آینده با حضور ربات‌های وکیل...',
        aspectRatioLabel: 'نسبت ابعاد',
        buttonText: 'تولید تصویر',
        generating: 'در حال تولید تصویر...',
        validationError: 'لطفاً توصیف تصویر را وارد کنید.',
        placeholder: 'تصویر تولید شده اینجا نمایش داده می‌شود',
        download: 'دانلود تصویر'
    },
    aiGuide: {
        title: 'راهنمای هوشمند',
        subtitle: 'نمی‌دانید از کدام ابزار استفاده کنید؟ هدف خود را بنویسید.',
        placeholder: 'مثلاً: می‌خواهم یک قرارداد اجاره بنویسم و مطمئن شوم کلاه سرم نمی‌رود...',
        buttonText: 'راهنمایی کن',
        gettingSuggestions: 'در حال بررسی...',
        validationError: 'لطفاً سوال خود را وارد کنید.',
        resultsTitle: 'ابزارهای پیشنهادی',
        confidence: 'میزان اطمینان',
        goTo: 'برو به ابزار',
        prompt: 'کاربر هدف زیر را دارد: "{goal}". با توجه به ابزارهای موجود در برنامه (legal_drafter, lawyer_finder, news_summarizer, case_strategist, notary_finder, web_analyzer, contract_analyzer, evidence_analyzer, image_generator, corporate_services, insurance_services, job_assistant, resume_analyzer)، کدام ابزارها برای او مناسب‌تر هستند؟ خروجی باید یک آرایه JSON باشد که هر آیتم شامل module (کلید ابزار)، confidencePercentage (عدد ۰ تا ۱۰۰) و reasoning (توضیح کوتاه علت پیشنهاد) باشد. حداکثر ۳ پیشنهاد بده.',
        example: { prompt: 'می‌خواهم بدانم آیا می‌توانم از کارفرمایم شکایت کنم؟' }
    },
    corporateServices: {
        title: 'خدمات شرکتی و اداری',
        subtitle: 'مجموعه ابزارهای هوشمند برای ثبت شرکت، تنظیم اساسنامه و امور اداری',
        nameGenerator: {
            title: 'پیشنهاد نام شرکت',
            description: 'ایده‌پردازی نام‌های خلاقانه و تاییدپذیر برای شرکت شما.',
            keywordsLabel: 'کلمات کلیدی یا حوزه فعالیت',
            keywordsPlaceholder: 'مثلاً: فناوری، ساختمانی، بازرگانی...',
            typeLabel: 'نوع شرکت',
            types: { llc: 'مسئولیت محدود', js: 'سهامی خاص', general: 'تضامنی', coop: 'تعاونی' },
            buttonText: 'تولید نام',
            generating: 'در حال تولید...',
            resultsTitle: 'نام‌های پیشنهادی:',
            prompt: 'برای یک شرکت "{type}" که در زمینه "{keywords}" فعالیت می‌کند، ۱۰ نام پیشنهادی خلاقانه، فارسی و با وقار که احتمال ثبت بالایی در اداره ثبت شرکت‌های ایران داشته باشند، پیشنهاد بده. خروجی فقط یک آرایه JSON از رشته‌ها باشد.'
        },
        articlesDrafter: {
            title: 'تنظیم اساسنامه',
            description: 'تولید پیش‌نویس اساسنامه متناسب با نوع شرکت.',
            nameLabel: 'نام شرکت',
            namePlaceholder: 'شرکت ...',
            activityLabel: 'موضوع فعالیت',
            activityPlaceholder: 'شرح کامل فعالیت‌های شرکت...',
            capitalLabel: 'سرمایه اولیه',
            capitalPlaceholder: 'مثلاً: ۱۰,۰۰۰,۰۰۰ ریال',
            buttonText: 'تنظیم اساسنامه',
            prompt: 'یک اساسنامه کامل و استاندارد برای شرکت "{name}" از نوع "{type}" با موضوع فعالیت "{activity}" و سرمایه "{capital}" تنظیم کن. تمام مواد قانونی لازم برای اساسنامه‌های استاندارد ایران را رعایت کن.'
        },
        complianceQA: {
            title: 'پرسش و پاسخ اداری',
            description: 'پاسخ به سوالات شما در مورد قوانین ثبت، مالیات و بیمه.',
            queryLabel: 'سوال شما',
            queryPlaceholder: 'مثلاً: مدارک لازم برای تغییر آدرس شرکت چیست؟',
            buttonText: 'دریافت پاسخ',
            gettingAnswer: 'در حال جستجوی پاسخ...',
            prompt: 'به عنوان یک کارشناس ثبت شرکت‌ها و امور اداری در ایران، به سوال زیر پاسخ دقیق و کاربردی بده: "{question}"'
        }
    },
    insuranceServices: {
        title: 'خدمات هوشمند بیمه',
        subtitle: 'دستیار شما در تحلیل، خرید و دریافت خسارت بیمه',
        policyAnalyzer: {
            title: 'تحلیل‌گر بیمه‌نامه',
            description: 'بررسی دقیق پوشش‌ها و استثنائات بیمه‌نامه.',
            userQueryPlaceholder: 'سوالی در مورد بیمه‌نامه دارید؟ (اختیاری)',
            prompt: 'متن بیمه‌نامه زیر را تحلیل کن. پوشش‌های اصلی، استثنائات مهم و تعهدات بیمه‌گذار را خلاصه کن. اگر کاربر سوالی پرسیده ("{userQuery}") به آن پاسخ بده. لحن پاسخ باید ساده و قابل فهم باشد.'
        },
        claimDrafter: {
            title: 'نگارش متن اعلام خسارت',
            description: 'تنظیم نامه رسمی برای دریافت خسارت از بیمه.',
            incidentTypeLabel: 'نوع حادثه',
            incidentTypePlaceholder: 'مثلاً: تصادف رانندگی، آتش‌سوزی...',
            policyNumberLabel: 'شماره بیمه‌نامه',
            policyNumberPlaceholder: '---',
            descriptionLabel: 'شرح حادثه',
            descriptionPlaceholder: 'توضیح دهید چه اتفاقی افتاده است...',
            buttonText: 'تولید نامه',
            prompt: 'یک نامه رسمی اعلام خسارت برای شرکت بیمه بنویس. نوع حادثه: "{type}". شماره بیمه‌نامه: "{policy}". شرح ماوقع: "{description}". نامه باید لحن اداری داشته باشد و درخواست پرداخت خسارت را به وضوح بیان کند.'
        },
        recommender: {
            title: 'پیشنهاد دهنده بیمه',
            description: 'مشاوره برای انتخاب بهترین بیمه متناسب با نیاز شما.',
            queryLabel: 'نیازها و شرایط شما',
            queryPlaceholder: 'مثلاً: برای یک خودروی دنا پلاس مدل ۱۴۰۲ چه بیمه بدنه‌ای مناسب است؟',
            buttonText: 'دریافت پیشنهاد',
            gettingAnswer: 'در حال تحلیل...',
            prompt: 'به عنوان مشاور بیمه، بر اساس شرایط زیر بهترین پوشش‌های بیمه‌ای را پیشنهاد بده و دلیل آن را توضیح بده: "{needs}".'
        },
        riskAssessor: {
            title: 'ارزیابی ریسک',
            description: 'تخمین ریسک‌های احتمالی برای دارایی‌های شما.',
            assetTypeLabel: 'نوع دارایی',
            assetTypePlaceholder: 'مثلاً: انبار کالا، ساختمان مسکونی...',
            descriptionLabel: 'توضیحات بیشتر',
            descriptionPlaceholder: 'موقعیت مکانی، سیستم‌های ایمنی و...',
            buttonText: 'ارزیابی ریسک',
            assessing: 'در حال ارزیابی...',
            prompt: 'برای دارایی از نوع "{asset}" با مشخصات "{description}"، یک ارزیابی ریسک انجام بده. خطرات بالقوه را شناسایی کن و راهکارهایی برای کاهش ریسک و پوشش‌های بیمه‌ای مناسب پیشنهاد بده.'
        },
        fraudDetector: {
            title: 'تشخیص تقلب (ویژه کارشناسان)',
            description: 'بررسی اولیه نشانه‌های مشکوک در ادعای خسارت.',
            claimDescriptionLabel: 'توضیحات ادعای خسارت',
            claimDescriptionPlaceholder: 'جزئیات ادعا و شواهد موجود...',
            buttonText: 'بررسی تقلب',
            analyzing: 'در حال بررسی...',
            prompt: 'به عنوان کارشناس تشخیص تخلفات بیمه، شرح ادعای خسارت زیر را بررسی کن و اگر نشانه‌هایی (Red Flags) از تقلب یا صحنه‌سازی احتمالی وجود دارد، آن‌ها را لیست کن: "{description}".'
        },
        autoClaimAssessor: {
            title: 'تخمین خسارت خودرو (تصویری)',
            description: 'بررسی تصویر تصادف و تخمین اولیه خسارت.',
            userQueryPlaceholder: 'توضیح اضافی (اختیاری)...',
            buttonText: 'بررسی تصویر',
            assessing: 'در حال پردازش تصویر...',
            prompt: 'تصویر ارائه شده مربوط به یک تصادف یا خسارت خودرو است. لطفاً قطعات آسیب‌دیده را شناسایی کن، نوع آسیب (قر شدگی، شکستگی، خط و خش) را مشخص کن و یک برآورد کلی از شدت خسارت ارائه بده. سوال کاربر: "{userQuery}"'
        },
        quoteSimulator: {
            title: 'شبیه‌ساز حق بیمه (شخص ثالث)',
            description: 'محاسبه تخمینی حق بیمه شخص ثالث.',
            carModelLabel: 'مدل خودرو',
            carModelPlaceholder: 'پراید ۱۳۱',
            carYearLabel: 'سال ساخت',
            carYearPlaceholder: '۱۳۹۵',
            driverAgeLabel: 'سن راننده',
            driverAgePlaceholder: '۳۰',
            drivingHistoryLabel: 'سابقه عدم خسارت (سال)',
            drivingHistoryPlaceholder: '۲',
            buttonText: 'محاسبه تخمینی',
            calculating: 'در حال محاسبه...',
            prompt: 'بر اساس نرخ‌های مصوب بیمه مرکزی ایران (حدودی)، حق بیمه شخص ثالث را برای خودروی "{model}" مدل "{year}" با راننده‌ای به سن "{age}" و "{history}" سال تخفیف عدم خسارت، تخمین بزن. فقط یک عدد حدودی و توضیحات کوتاه بده.'
        },
        lifeNeedsAnalyzer: {
            title: 'تحلیل نیازهای بیمه عمر',
            description: 'محاسبه سرمایه فوت و مستمری مورد نیاز.',
            ageLabel: 'سن',
            incomeLabel: 'درآمد ماهانه',
            dependentsLabel: 'تعداد افراد تحت تکفل',
            debtsLabel: 'مجموع بدهی‌ها',
            goalsLabel: 'اهداف مالی (مثلاً هزینه تحصیل فرزندان)',
            goalsPlaceholder: 'توضیح دهید...',
            buttonText: 'تحلیل نیازها',
            analyzing: 'در حال تحلیل...',
            prompt: 'برای فردی {age} ساله با درآمد {income} و {dependents} نفر تحت تکفل و {debts} بدهی، که هدفش "{goals}" است، تحلیل کن که چه مقدار سرمایه فوت و چه نوع بیمه عمری (مانده بدهکار، زمانی، مختلط) نیاز دارد.'
        }
    },
    chatbot: {
        title: 'دستیار هوشمند',
        welcomeMessage: 'سلام! من دستیار هوشمند کار-یاب هستم. چطور می‌توانم کمکتان کنم؟',
        placeholder: 'پیام خود را بنویسید...',
        initialSuggestions: {
            s1: 'چطور رزومه‌ام را بهتر کنم؟',
            s2: 'یک وکیل ملکی خوب معرفی کن',
            s3: 'متن استعفا می‌خواهم'
        }
    },
    thinkingMode: {
        label: 'حالت تفکر عمیق (Thinking Mode)',
        description: 'برای مسائل پیچیده، از مدل قدرتمندتر با استدلال عمیق استفاده می‌کند.'
    }
};

export const en = {
    langCode: 'en',
    dir: 'ltr',
    font: 'font-inter',
    header: {
        resumeBuilder: 'Resume Builder',
        jobTracker: 'Job Tracker',
        dashboard: 'Dashboard (WP)',
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
        healthStatus: {
            checking: 'Checking API status...',
            ok: 'API connection is healthy.',
            error: 'API connection error.'
        }
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
    dashboard: {
        welcome: 'Welcome',
        atAGlance: 'At a Glance',
        quickDraft: 'Quick Draft',
        activity: 'Activity',
        posts: 'Posts',
        media: 'Media',
        pages: 'Pages',
        comments: 'Comments',
        appearance: 'Appearance',
        plugins: 'Plugins',
        users: 'Users',
        tools: 'Tools',
        settings: 'Settings',
        howdy: 'Howdy, Admin',
        screenOptions: 'Screen Options',
        help: 'Help',
        all: 'All',
        published: 'Published',
        search: 'Search',
        bulkActions: 'Bulk Actions',
        apply: 'Apply',
        filter: 'Filter',
        title: 'Title',
        author: 'Author',
        date: 'Date',
        edit: 'Edit',
        quickEdit: 'Quick Edit',
        trash: 'Trash',
        view: 'View',
        stats: {
            applications: 'Applications',
            lawyers: 'Saved Lawyers',
            generatedDocs: 'Generated Docs'
        },
        noActivity: 'No activity yet.'
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
            dropzone: 'Drag & drop CV file or LinkedIn Profile (PDF, DOCX, TXT, MD) here, or click to select',
            placeholder: 'Paste your CV text here...',
            linkedinLabel: 'Sync with LinkedIn Profile',
            linkedinPlaceholder: 'Enter your LinkedIn profile URL...',
            syncButton: 'Sync Profile',
            syncingButton: 'Syncing...',
            parsing: 'Parsing file...',
        },
        jobSearch: {
            title: 'Find Matching Jobs',
            button: 'Suggest Jobs based on CV',
            loading: 'Analyzing CV & Searching...'
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
            unsupportedFile: 'Unsupported file type. Please upload a PDF, DOCX, TXT, or MD file.',
        },
        autoSave: {
            saving: 'Saving...',
            saved: 'Saved'
        }
    },
    resumeAnalyzer: {
        title: 'Expert Resume Analyzer',
        subtitle: 'Upload your resume to get a deep analysis based on 31 key criteria and chat with our AI interviewer.',
        uploadTab: 'Upload File',
        textTab: 'Paste Text',
        dropzone: 'Drop your resume file (PDF, DOCX, TXT, MD) here, or click to select',
        placeholder: 'Paste your resume text here...',
        analyzeButton: 'Start Analysis',
        analyzingButton: 'Analyzing...',
        overallScore: 'Overall Score',
        predictedRole: 'Predicted Role',
        improveButton: 'Generate Improved Resume (PDF/Word)',
        improvingButton: 'Rewriting Resume...',
        improvedTitle: 'Your New Professional Resume',
        findJobsButton: 'Find Matching Jobs',
        findingJobs: 'Searching...',
        jobsTitle: 'Recommended Job Opportunities',
        linkedin: {
            tab: 'LinkedIn Profile',
            importButton: 'Import & Analyze Profile'
        },
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
        },
        chat: {
            initialMessage: 'Your initial resume analysis is complete. To build out your "real resume" and finalize the assessment, I\'ll ask a few questions about the missing or implicit items. Please respond via text or voice.',
            placeholder: 'Type your answer...',
            listening: 'Listening...',
        },
        progressBar: {
            upload: 'Upload',
            parse: 'Parse File',
            analyze: 'Analyze Content',
            complete: 'Complete',
        },
        aiThoughts: {
            title: 'View AI Thoughts',
            finalizing: 'Finalizing analysis...'
        }
    },
    generatorForm: {
        title: 'Document Details',
        docType: 'Document Type',
        topic: 'Topic',
        topicPlaceholder: 'e.g., Divorce Petition',
        description: 'Description',
        descriptionPlaceholder: 'Enter full details of the case...',
        useExample: 'Use Example',
        buttonText: 'Generate Draft',
        validationError: 'Please enter a topic and description.'
    },
    reportDisplay: {
        title: 'Generated Document',
        generating: 'Generating document...',
        placeholder1: 'Your document will appear here',
        placeholder2: 'Fill the form and click generate.',
        copy: 'Copy Text',
        downloadMD: 'Download Markdown',
        downloadDOCX: 'Download Word (DOCX)',
        downloadHTML: 'Download HTML',
        printPDF: 'Print / PDF',
        shareEmail: 'Share via Email',
        shareWhatsApp: 'Share via WhatsApp',
        export: 'Export',
        docTitle: 'AI Generated Legal Document',
        headerDate: 'Date',
        headerCaseNo: 'Case No',
        caseNoPlaceholder: '---'
    },
    reportTypes: {
        petition: 'Petition',
        contract: 'Contract',
        statement: 'Statement',
        power_of_attorney: 'Power of Attorney',
        legal_warning: 'Legal Warning',
        complaint: 'Complaint'
    },
    reportPrompts: {
        petition: 'Write a formal legal petition for "{topic}" based on the following details. Include Plaintiff, Defendant, Demands, and Reasons.\n\nDetails:\n{description}',
        contract: 'Draft a comprehensive legal contract for "{topic}" based on the details below. Include Parties, Subject, Duration, Amount, Obligations, and Dispute Resolution.\n\nDetails:\n{description}',
        statement: 'Write a formal legal statement for "{topic}" with a firm tone. Include the following details:\n{description}',
        power_of_attorney: 'Draft a Power of Attorney for "{topic}" with the following authorities:\n{description}',
        legal_warning: 'Write a formal Legal Warning regarding "{topic}" citing relevant laws and based on:\n{description}',
        complaint: 'Draft a formal Complaint for the prosecutor regarding "{topic}" with the following statement of facts:\n{description}'
    },
    reportExamples: {
        petition: { topic: 'Cheque Claim', description: 'A cheque for 500M IRR due on 2024/01/01 bounced. I request a judgment for the payment plus late payment damages.' },
        contract: { topic: 'Residential Lease', description: 'Landlord: Ali, Tenant: Reza. 100sqm apt. 1 year duration. Deposit 200M, Rent 10M. Residential use.' },
        statement: { topic: 'Contract Termination', description: 'The other party failed to deliver goods as per contract #123 dated 2024/01/01. Warning for termination and damages.' },
        power_of_attorney: { topic: 'Car Sale', description: 'Administrative PoA for plate exchange and official transfer of a Peugeot 206 with plate number ...' },
        legal_warning: { topic: 'Eviction Notice', description: 'Lease expired on 2024/03/19. Notice to vacate within 10 days.' },
        complaint: { topic: 'Online Fraud', description: 'Someone sold a mobile on Divar, took the money, never sent the phone and is not answering.' }
    },
    camera: {
        use: 'Use Camera',
        takePicture: 'Take Picture',
        cancel: 'Cancel',
        error: 'Error accessing camera',
        permissionDenied: 'Camera permission denied.',
        notFound: 'Camera not found.',
        unsupported: 'Camera not supported.',
        orDivider: 'OR',
        captureSectionTitle: 'Text Extracted from Image',
        extractingText: 'Extracting text from image...'
    },
    aiSuggestions: {
        thinking: 'Thinking...',
        noResults: 'No suggestions found'
    },
    lawyerFinder: {
        keywordsLabel: 'Specialty or Legal Issue',
        keywordsPlaceholder: 'e.g., Divorce, Real Estate Fraud, Company Registration...',
        maxResults: 'Max Results',
        findButton: 'Find Lawyers',
        finding: 'Searching...',
        validationError: 'Please enter keywords.',
        prompt: 'I am looking for a list of Iranian lawyers specializing in "{queries}". Please provide a table with Name, Exact Specialty, City, Address, Contact Info (Phone/Website), Website URL (if available), Estimated Experience (Years), and Relevance Score (0-100%). List max {maxResults} items. Output as a Markdown table.',
        resultsTitle: 'Recommended Lawyers',
        savedTitle: 'Saved Lawyers',
        saved: 'Saved',
        save: 'Save',
        remove: 'Remove',
        clearAll: 'Clear All',
        notesLabel: 'Personal Notes',
        notesPlaceholder: 'Enter your notes here...',
        address: 'Address',
        contact: 'Contact',
        sendWhatsApp: 'Send WhatsApp',
        whatsAppMessage: 'Hi, I saw your profile on Kar-Yab AI and would like a consultation.',
        example: { keywords: 'Real Estate Litigation' },
        parseErrorTitle: 'Structured Data Error',
        parseErrorSubtitle: 'AI generated text that could not be parsed into a table. Raw text below:',
        semanticSearchBadge: 'Semantic Search',
        crateTitle: 'Lawyer Crate',
        crateSubtitle: 'Search and filter within found results',
        clearCrate: 'Clear Crate',
        filterByCity: 'Filter by City',
        filterBySpecialty: 'Filter by Specialty',
        filterByExperience: 'Min Experience (Yrs)',
        sortBy: 'Sort By',
        sort: {
            relevance: 'Relevance',
            name: 'Name',
            city: 'City',
            experience_desc: 'Experience (High-Low)',
            city_specialty: 'City & Specialty'
        },
        crateEmpty: 'No lawyers found yet.',
        noFilterResults: 'No results match your filters.',
        aiGeneratedQueryTitle: 'Smart Query Refinement',
        aiGeneratedQuerySubtitle: 'AI optimized your search query for better results.',
        confirmAndSearch: 'Confirm & Search',
        editQuery: 'Edit'
    },
    newsSummarizer: {
        queryLabel: 'News Topic',
        queryPlaceholder: 'e.g., Labor Law changes in 1403',
        buttonText: 'Search & Summarize',
        summarizing: 'Searching & Summarizing...',
        validationError: 'Please enter a topic.',
        prompt: 'Please search for the latest news and developments regarding "{query}" in Iran. Then provide a comprehensive and structured summary in Persian. Cite reliable sources at the end.',
        example: { query: 'Social Security Pension Increase 1403' },
        sourcesTitle: 'Sources'
    },
    caseStrategist: {
        goalLabel: 'Legal Goal',
        goalPlaceholder: 'e.g., I want to reduce my Mahrieh...',
        buttonText: 'Generate Strategy',
        generating: 'Designing Strategy...',
        validationError: 'Please enter a goal.',
        prompt: 'The user has the following legal goal: "{goal}". Please design a step-by-step strategy to achieve this. Output a JSON array of objects, each containing: taskName, description, effortPercentage (0-100), deliverableType (e.g., "Text", "Research", "Action"), and suggestedPrompt (a prompt for AI to help with this step).',
        executeTaskPrompt: 'I want to execute the step "{taskName}". Description: "{description}". Based on this and the suggested prompt "{suggestedPrompt}", please prepare a draft or practical guide for me to complete this step. Output JSON with: docType (one of {docTypeOptions}, or nearest), topic, description (the full draft/guide).',
        resultsTitle: 'Proposed Roadmap',
        effort: 'Effort',
        deliverable: 'Deliverable',
        suggestedPrompt: 'Suggested Prompt',
        executeTask: 'Execute Step',
        executingTask: 'Executing...',
        example: { goal: 'Register a food brand' }
    },
    notaryFinder: {
        keywordsLabel: 'Required Services',
        keywordsPlaceholder: 'e.g., Signature Verification, Mortgage Deed...',
        findButton: 'Find Notaries',
        finding: 'Searching...',
        validationError: 'Please enter required services.',
        prompt: 'I am looking for Notary Public offices in Iran that offer "{keywords}". Please find a list including Office Name, City, Address, Phone, Website (if any), and Key Services. Output as a Markdown table.',
        resultsTitle: 'Recommended Notaries',
        address: 'Address',
        contact: 'Contact',
        services: 'Services',
        sendWhatsApp: 'Send Message',
        whatsAppMessage: 'Hi, I need to coordinate for notary services.',
        example: { keywords: 'Immovable Property Deed' },
        parseErrorTitle: 'Processing Error',
        parseErrorSubtitle: 'Data found but not in standard table format:',
        aiGeneratedQueryTitle: 'Better Search Suggestion',
        aiGeneratedQuerySubtitle: 'Query optimized for more relevant results.',
        confirmAndSearch: 'Confirm & Search',
        editQuery: 'Edit',
        filterByCity: 'Filter by City',
        filterByOfficeName: 'Office Name',
        filterByService: 'Service Type',
        sortBy: 'Sort By',
        sort: {
            officeName: 'Office Name',
            city: 'City'
        },
        noFilterResults: 'No office matches criteria.',
        crateEmpty: 'No search performed yet.'
    },
    webAnalyzer: {
        urlLabel: 'Website URL',
        urlPlaceholder: 'https://...',
        queryLabel: 'Question or Instruction',
        queryPlaceholder: 'e.g., Summarize the terms and conditions...',
        buttonText: 'Analyze Website',
        analyzing: 'Analyzing...',
        validationError: 'Please enter URL and question.',
        prompt: 'Please read the website content at "{url}" and answer the following request: "{query}". The answer should be comprehensive and in Persian. Reference specific sections if needed.',
        example: { url: 'https://rrk.ir', query: 'Find the latest laws regarding Sayad Cheques.' }
    },
    contractAnalyzer: {
        uploadTab: 'Upload File',
        textTab: 'Contract Text',
        dropzoneText: 'Drop contract file (PDF/DOCX/Image) here',
        unsupportedFileType: 'File type not supported.',
        userQueryLabel: 'Specific Question (Optional)',
        userQueryPlaceholder: 'e.g., Is the termination clause fair?',
        analyzing: 'Analyzing...',
        analyzeButton: 'Analyze Contract',
        prompt: 'You are an expert legal advisor. Analyze the following contract text carefully. Look for legal risks, ambiguities, and unfair clauses. If the user asked a specific question ("{userQuery}"), answer it precisely. Finally, provide a summary of pros and cons. Output in Persian and Markdown format.',
        example: { userQuery: 'Is the late penalty in this contract standard?' }
    },
    evidenceAnalyzer: {
        dropzoneText: 'Drop evidence image (Photo/PDF) here',
        userQueryLabel: 'Question about Evidence',
        userQueryPlaceholder: 'e.g., Does this signature look valid? What is the date?',
        analyzing: 'Analyzing...',
        analyzeButton: 'Analyze Evidence',
        prompt: 'The provided image is a piece of evidence or document. Examine it carefully. Identify all readable text, dates, signatures, and stamps. Answer the user\'s question: "{userQuery}". Mention any suspicious or unusual features.',
        example: { userQuery: 'Extract the date and amount from this receipt.' },
        extractText: {
            button: 'Extract Text (OCR)',
            extracting: 'Extracting...',
            copy: 'Copy Text',
            copied: 'Copied!',
            title: 'Extracted Text'
        }
    },
    imageGenerator: {
        promptLabel: 'Image Description',
        promptPlaceholder: 'e.g., A futuristic court with robot lawyers...',
        aspectRatioLabel: 'Aspect Ratio',
        buttonText: 'Generate Image',
        generating: 'Generating Image...',
        validationError: 'Please enter an image description.',
        placeholder: 'Generated image will appear here',
        download: 'Download Image'
    },
    aiGuide: {
        title: 'Smart Guide',
        subtitle: 'Don\'t know which tool to use? Type your goal.',
        placeholder: 'e.g., I want to write a lease contract and ensure I don\'t get scammed...',
        buttonText: 'Guide Me',
        gettingSuggestions: 'Checking...',
        validationError: 'Please enter your question.',
        resultsTitle: 'Suggested Tools',
        confidence: 'Confidence',
        goTo: 'Go to Tool',
        prompt: 'User has this goal: "{goal}". Considering the app tools (legal_drafter, lawyer_finder, news_summarizer, case_strategist, notary_finder, web_analyzer, contract_analyzer, evidence_analyzer, image_generator, corporate_services, insurance_services, job_assistant, resume_analyzer), which ones are best? Output a JSON array where each item has module (key), confidencePercentage (0-100), and reasoning (short explanation). Max 3 suggestions.',
        example: { prompt: 'I want to know if I can sue my employer?' }
    },
    corporateServices: {
        title: 'Corporate & Admin Services',
        subtitle: 'Smart tools for company registration, articles of association, and admin tasks',
        nameGenerator: {
            title: 'Company Name Generator',
            description: 'Brainstorm creative and valid names for your company.',
            keywordsLabel: 'Keywords or Industry',
            keywordsPlaceholder: 'e.g., Tech, Construction, Trading...',
            typeLabel: 'Company Type',
            types: { llc: 'LLC (Limited Liability)', js: 'Joint Stock', general: 'General Partnership', coop: 'Cooperative' },
            buttonText: 'Generate Names',
            generating: 'Generating...',
            resultsTitle: 'Suggested Names:',
            prompt: 'For a "{type}" company in "{keywords}" industry, suggest 10 creative, Persian, and dignified names that have a high chance of registration in Iran. Output ONLY a JSON array of strings.'
        },
        articlesDrafter: {
            title: 'Articles of Association Drafter',
            description: 'Draft articles based on company type.',
            nameLabel: 'Company Name',
            namePlaceholder: 'Company ...',
            activityLabel: 'Subject of Activity',
            activityPlaceholder: 'Full description of activities...',
            capitalLabel: 'Initial Capital',
            capitalPlaceholder: 'e.g., 10,000,000 IRR',
            buttonText: 'Draft Articles',
            prompt: 'Draft a complete and standard Articles of Association for company "{name}" of type "{type}" with activity "{activity}" and capital "{capital}". Follow all necessary legal articles for Iranian standards.'
        },
        complianceQA: {
            title: 'Compliance Q&A',
            description: 'Answers to registration, tax, and insurance questions.',
            queryLabel: 'Your Question',
            queryPlaceholder: 'e.g., Documents required for address change?',
            buttonText: 'Get Answer',
            gettingAnswer: 'Searching...',
            prompt: 'As an expert in Iranian corporate registration and admin affairs, provide a precise and practical answer to: "{question}"'
        },
    },
    insuranceServices: {
        title: 'Smart Insurance Services',
        subtitle: 'Your assistant for analyzing, buying, and claiming insurance',
        policyAnalyzer: {
            title: 'Policy Analyzer',
            description: 'Deep review of policy coverages and exclusions.',
            userQueryPlaceholder: 'Any specific question? (Optional)',
            prompt: 'Analyze the following insurance policy. Summarize key coverages, important exclusions, and policyholder obligations. If the user asked ("{userQuery}"), answer it. Keep it simple.'
        },
        claimDrafter: {
            title: 'Claim Letter Drafter',
            description: 'Write a formal letter to claim damages.',
            incidentTypeLabel: 'Incident Type',
            incidentTypePlaceholder: 'e.g., Car Accident, Fire...',
            policyNumberLabel: 'Policy Number',
            policyNumberPlaceholder: '---',
            descriptionLabel: 'Incident Description',
            descriptionPlaceholder: 'Explain what happened...',
            buttonText: 'Generate Letter',
            prompt: 'Write a formal insurance claim letter. Incident: "{type}". Policy #: "{policy}". Description: "{description}". Use a formal tone and clearly request compensation.'
        },
        recommender: {
            title: 'Insurance Recommender',
            description: 'Advice on best insurance for your needs.',
            queryLabel: 'Your Needs & Conditions',
            queryPlaceholder: 'e.g., Best body insurance for a 2023 Dena Plus?',
            buttonText: 'Get Recommendation',
            gettingAnswer: 'Analyzing...',
            prompt: 'As an insurance advisor, recommend the best insurance coverages based on: "{needs}". Explain why.'
        },
        riskAssessor: {
            title: 'Risk Assessor',
            description: 'Estimate risks for your assets.',
            assetTypeLabel: 'Asset Type',
            assetTypePlaceholder: 'e.g., Warehouse, Residential Building...',
            descriptionLabel: 'More Details',
            descriptionPlaceholder: 'Location, safety systems...',
            buttonText: 'Assess Risk',
            assessing: 'Assessing...',
            prompt: 'Perform a risk assessment for asset "{asset}" with details "{description}". Identify potential hazards and suggest mitigation strategies and insurance covers.'
        },
        fraudDetector: {
            title: 'Fraud Detector (Expert)',
            description: 'Initial check for suspicious claim signs.',
            claimDescriptionLabel: 'Claim Details',
            claimDescriptionPlaceholder: 'Claim details and evidence...',
            buttonText: 'Check Fraud',
            analyzing: 'Checking...',
            prompt: 'As an insurance fraud expert, review this claim description for Red Flags of potential fraud or staging: "{description}". List them.'
        },
        autoClaimAssessor: {
            title: 'Auto Damage Estimator (Visual)',
            description: 'Analyze accident photo for damage estimate.',
            userQueryPlaceholder: 'Extra info (Optional)...',
            buttonText: 'Analyze Photo',
            assessing: 'Processing Image...',
            prompt: 'This image shows a car accident/damage. Identify damaged parts, type of damage (dent, scratch, break), and give a rough estimate of severity. User question: "{userQuery}"'
        },
        quoteSimulator: {
            title: 'Premium Simulator (TPL)',
            description: 'Estimate Third Party Liability premium.',
            carModelLabel: 'Car Model',
            carModelPlaceholder: 'Pride 131',
            carYearLabel: 'Year',
            carYearPlaceholder: '1395',
            driverAgeLabel: 'Driver Age',
            driverAgePlaceholder: '30',
            drivingHistoryLabel: 'No-Claim Bonus (Years)',
            drivingHistoryPlaceholder: '2',
            buttonText: 'Calculate Estimate',
            calculating: 'Calculating...',
            prompt: 'Based on approximate Iranian Central Insurance rates, estimate TPL premium for car "{model}", year "{year}", driver age "{age}", "{history}" years NCB. Give a rough number and short explanation.'
        },
        lifeNeedsAnalyzer: {
            title: 'Life Insurance Needs',
            description: 'Calculate death capital and pension needs.',
            ageLabel: 'Age',
            incomeLabel: 'Monthly Income',
            dependentsLabel: 'Dependents',
            debtsLabel: 'Total Debts',
            goalsLabel: 'Financial Goals',
            goalsPlaceholder: 'Explain...',
            buttonText: 'Analyze Needs',
            analyzing: 'Analyzing...',
            prompt: 'For a {age} year old with {income} income, {dependents} dependents, {debts} debt, aiming for "{goals}", analyze required death capital and type of life insurance needed.'
        }
    },
    chatbot: {
        title: 'Smart Assistant',
        welcomeMessage: 'Hello! I am Kar-Yab AI assistant. How can I help you?',
        placeholder: 'Type your message...',
        initialSuggestions: {
            s1: 'How to improve my resume?',
            s2: 'Find a good real estate lawyer',
            s3: 'I need a resignation letter'
        }
    },
    thinkingMode: {
        label: 'Deep Thinking Mode',
        description: 'Uses a more powerful model with deep reasoning capabilities for complex tasks.'
    }
};

export const DEFAULT_SUGGESTIONS = {
    // ... (no changes needed)
};
