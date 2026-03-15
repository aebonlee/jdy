/* ===========================
   직업미래연구소 – script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ── Mobile menu toggle ──
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ── Scroll animations (Intersection Observer) ──
    const animatedElements = document.querySelectorAll(
        '.fade-up-element, .fade-in-left, .fade-in-right'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => observer.observe(el));

    // ── Counter animation ──
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (target === 0) return;
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(update);
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ══════════════════════════════════════
    // ── i18n: Korean ↔ English Toggle ──
    // ══════════════════════════════════════
    const translations = {
        en: {
            'logo.text': 'Job Future Institute',
            'logo.sub': 'by Dr. Dong-Yeop Jung',
            'nav.about': 'About',
            'nav.expertise': 'Strengths',
            'nav.programs': 'Programs',
            'nav.history': 'Track Record',
            'nav.contact': 'Contact',
            'hero.badge': 'PhD in Vocational Studies · 20 Years in IT · Futures Research · Career Consulting',
            'hero.title': 'Future Society & the World of Work,<br><strong>Strategically Designing</strong> Your Career.',
            'hero.subtitle': 'Combining vocational research with 20 years of IT field experience,<br>Job Future Institute prepares careers for all generations — from youth to baby boomers.',
            'hero.cta1': 'Explore Programs',
            'hero.cta2': 'About the Director',
            'about.title': 'Dr. Dong-Yeop Jung\'s<br><span>Job Future Institute</span>',
            'about.lead': '"I research future society and the world of work, helping all generations — youth, adults, and baby boomer retirees — with career planning and career transition. With 20+ years in IT, I am a practitioner who integrates educational technology with career consulting."',
            'about.body1': 'Director Jung Dong-yeop holds a PhD coursework completion in Vocational Studies from Kyonggi University, an MA in Employment & Vocational Counseling from Gachon University, and an MEd in Learning Coaching from the International Graduate School of Culture. He also serves as a WorkNet vocational psychology specialist and online counselor for youth.',
            'about.body2': 'With 20+ years in IT — including academic information systems and e-learning platform design at Kyohaksa and Sambo Computer — he currently works as a professional consultant in career planning, career transition, resume/interview coaching, and social contribution education.',
            'about.cert1': 'Kyonggi Univ. PhD Coursework in Vocational Studies (2024)',
            'about.cert2': 'Gachon Univ. MA in Employment & Vocational Counseling (2014)',
            'about.cert3': 'International Culture Grad School — MEd in Learning Coaching (2012)',
            'about.cert4': 'Busan Univ. of Foreign Studies — BS in Computer Engineering (1994)',
            'about.cert5': 'Author: "The Future of Thinking" (2016) · Gangseo Social Economy textbook',
            'about.cert6': 'Korean Language Instructor Lv.2 · Social Worker Lv.2 · Lifelong Educator Lv.2 · Vocational Trainer Lv.3',
            'about.cert7': 'Vocational Psychology Specialist · Freditger Instructor · Halftime Coach (Life Transition)',
            'about.stat1': 'Yrs IT Exp.',
            'about.stat2': 'Degrees',
            'about.stat3': 'Certifications+',
            'career.title': 'Career <span>History</span>',
            'career.c1.title': 'Director, Job Future Institute',
            'career.c1.desc': 'Research on future society & the world of work, career planning & transition support',
            'career.c2.title': 'SUNY Korea — Futures Master & Futures Coach',
            'career.c2.desc': 'Futures-based strategic consulting and coaching',
            'career.c3.title': 'WorkNet Vocational Psychology Specialist',
            'career.c3.desc': 'Online counselor for youth career psychology',
            'career.c4.title': 'Adjunct Professor, Dong-ah Institute of Media and Arts',
            'career.c4.desc': 'Creative Convergence Dept. — Cultural Content Entrepreneurship, NCS Fundamentals (2026)',
            'career.c5.title': 'Director, Asia Future Talent Research Institute',
            'career.c5.desc': 'Future talent development and research',
            'career.c6.title': 'Secretary General, Asia Futures Group Cooperative',
            'career.c6.desc': 'Futures-based cooperative management',
            'career.c7.title': 'Seoul Business Agency',
            'career.c7.desc': 'New Occupation Advisor (4th Industrial Rev.) · IT Platform Consultant · Startup Doctor',
            'career.c8.title': '20 Years in IT Industry',
            'career.c8.desc': 'Kyohaksa, Sambo Computer, etc. — Academic IS, e-Learning system design, EdTech sales',
            'expertise.title': '<span>6 Key Strengths</span> of Job Future Institute',
            'expertise.desc': 'A unique educational methodology combining deep vocational research, 20 years of IT experience, and futures expertise.',
            'feat.1.title': 'Academic Expertise in Vocational Studies',
            'feat.1.desc': 'PhD coursework at Kyonggi Univ., MA from Gachon Univ. — systematic career education combining academic depth with practical experience.',
            'feat.2.title': 'Futures-Based Strategic Consulting',
            'feat.2.desc': 'As a SUNY Korea Futures Master & Coach, we apply foresight methodologies to career guidance and strategic consulting.',
            'feat.3.title': 'Career Design for All Ages',
            'feat.3.desc': 'Customized career planning and transition support for all age groups — from teens and college students to adults and baby boomer retirees.',
            'feat.4.title': '20 Years IT + EdTech',
            'feat.4.desc': 'Digital-based career education leveraging 20 years of IT experience in academic IS, e-learning, and big data.',
            'feat.5.title': 'Startup & New Career Consulting',
            'feat.5.desc': 'Simulation-based startup consulting backed by experience as Seoul Business Agency Startup Doctor and New Occupation Advisor.',
            'feat.6.title': 'Vocational Psychology & Counseling',
            'feat.6.desc': 'Certified vocational psychology specialist. Scientific career counseling using Freditger, NLP, and other diagnostic tools.',
            'programs.title': 'Our <span>Programs</span>',
            'programs.desc': 'From futures research to startup & career transition support — choose by your goals.',
            'prog.g1.tag': 'Career Support',
            'prog.g1.title': 'Career Planning & Transition Support Programs',
            'prog.g2.tag': 'Entrepreneurship & Education',
            'prog.g2.title': 'Startup & Professional Development Programs',
            'prog.1.title': 'Futures-Based Career Guidance',
            'prog.1.desc': 'Analyzing changes in work and occupations in the 4th Industrial Revolution era, using foresight methods to set strategic career directions.',
            'prog.2.title': 'Resume & Interview Coaching',
            'prog.2.desc': 'Systematic experience organization, resume writing, company-specific consulting, mock interviews, and 1:1 feedback.',
            'prog.3.title': 'Baby Boomer Retirement Planning',
            'prog.3.desc': 'Post-retirement life redesign for office workers, career transition counseling, and Halftime (life transition design) programs.',
            'prog.4.title': 'Startup & New Career Consulting',
            'prog.4.desc': 'Simulation-based startup consulting, new occupation coaching, IT platform consulting with futures methodology.',
            'prog.5.title': 'Vocational Psychology & Self-Directed Learning',
            'prog.5.desc': 'Freditger-based self-analysis, vocational psychology assessment, NLP stress management, and self-directed learning coaching.',
            'prog.6.title': 'Custom Lectures for Organizations',
            'prog.6.desc': 'Tailored education for government agencies, universities, education offices, and companies — 4th Industrial Rev., big data, social contribution, and more.',
            'prog.g3.tag': 'AI & Digital Literacy',
            'prog.g3.title': 'Gen AI Era: AI Literacy Enhancement Program',
            'prog.7.title': 'Generative AI Practical Skills',
            'prog.7.desc': 'Understand generative AI tools like ChatGPT and Copilot, and build practical skills to apply them immediately in work, study, and creation.',
            'prog.8.title': 'AI Literacy & Prompt Engineering',
            'prog.8.desc': 'Systematically learn digital literacy for the AI era, including effective prompt writing and AI ethics education.',
            'prog.9.title': 'AI-Based Career Strategy',
            'prog.9.desc': 'Analyze how AI is changing the world of work, and leverage AI tools for resume writing, interview prep, and career roadmap design.',
            'prog.g4.tag': 'Multicultural Support',
            'prog.g4.title': 'Living in Korea as a Foreigner Project',
            'prog.10.title': 'Korean Life Adaptation & Cultural Understanding',
            'prog.10.desc': 'Systematic guidance on Korean lifestyle, institutions, and social norms to support stable settlement of foreigners in Korea.',
            'prog.11.title': 'Korean Language & Communication Skills',
            'prog.11.desc': 'Practical Korean language education based on Korean Language Instructor Lv.2 certification, enhancing communication in workplace and daily life.',
            'prog.12.title': 'Foreigner Employment & Startup Consulting',
            'prog.12.desc': 'Customized career support for foreigners including job procedures in Korea, resume/interview coaching, and visa-specific startup guides.',
            'history.title': 'Track Record & <span>Expected Impact</span>',
            'history.desc': 'A proven futures & career education expert at major universities, public institutions, and education offices nationwide.',
            'history.univ': 'Key University Lectures',
            'history.u1': 'Dong-ah Institute of Media and Arts (Adjunct Prof.)',
            'history.u2': 'Jeju Tourism University',
            'history.org': 'Key Partner Organizations & Companies',
            'history.edu': 'Education Office Special Lectures',
            'history.edu.etc': 'and 8 more regional offices',
            'history.topics': 'Key Lecture Topics',
            'history.t1': '4th Industrial Revolution & Work Changes',
            'history.t2': 'Futures-Based Strategic Consulting & Vision',
            'history.t3': 'K-Digital Big Data & Data Preprocessing',
            'history.t4': 'Startup Simulation Consulting',
            'history.t5': 'Vocational Psychology & Career Transition',
            'history.t6': 'Self-Directed Learning Coaching',
            'history.t7': 'Parent Coaching (Children\'s Career)',
            'history.t8': 'Job Stress Management (NLP)',
            'history.t9': 'Social Contribution (NGO/NPO) Education',
            'history.t10': 'Presentation Planning & Delivery',
            'effect.participant': 'Expected Impact for Participants',
            'effect.p1': 'Improved <strong>career confidence</strong> through understanding future job trends',
            'effect.p2': 'Customized <strong>employment & transition strategies</strong>',
            'effect.p3': 'Vocational psychology-based <strong>self-understanding & strengths discovery</strong>',
            'effect.p4': 'Enhanced <strong>practical readiness</strong> for resumes, interviews, and hiring',
            'effect.institution': 'Expected Impact for Institutions',
            'effect.i1': 'Futures research-based <strong>career support service enhancement</strong>',
            'effect.i2': 'Improved <strong>employment rate & satisfaction</strong> for students and job seekers',
            'effect.i3': '<strong>Tangible results</strong> reflecting 4th Industrial Revolution trends',
            'effect.i4': 'Staff & consultant <strong>professional competency co-growth</strong>',
            'history.certs': 'Professional Certifications & Activities',
            'cta.title': 'Start Designing<br>Your Career Future Today',
            'cta.desc': 'We welcome 1:1 coaching and institutional lecture inquiries.<br>Your career, completed with vocational research and IT field experience.',
            'cta.kakao': 'KakaoTalk Chat',
            'cta.email': 'Email Inquiry',
            'cta.phone': 'Call: 010-7315-4585',
            'cta.qr.caption': '<span style="color:#22d3ee;font-weight:700;">Scan the QR code</span> to connect directly via KakaoTalk Open Chat.',
            'cta.qr.click': 'Click to open →',
            'footer.brand': 'Job Future Institute',
            'footer.brandDesc': 'Combining vocational research + 20 years of IT experience<br>to design your career future.',
            'footer.links': 'Quick Links',
            'footer.career': 'Career History',
            'footer.history': 'Track Record & Impact',
            'footer.email': 'Email: newjob4u@naver.com',
            'footer.phone': 'Phone: 010-7315-4585',
        }
    };

    // Store Korean originals
    const koTexts = {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
        koTexts[el.getAttribute('data-i18n')] = el.textContent;
    });
    const koHtmls = {};
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        koHtmls[el.getAttribute('data-i18n-html')] = el.innerHTML;
    });

    let currentLang = 'ko';

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        if (lang === 'en') {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations.en[key]) el.textContent = translations.en[key];
            });
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                if (translations.en[key]) el.innerHTML = translations.en[key];
            });
        } else {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (koTexts[key]) el.textContent = koTexts[key];
            });
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                if (koHtmls[key]) el.innerHTML = koHtmls[key];
            });
        }

        const btn = document.getElementById('langToggle');
        if (btn) {
            btn.textContent = lang === 'ko' ? 'EN' : 'KO';
            btn.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 전환');
        }
    }

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setLanguage(currentLang === 'ko' ? 'en' : 'ko');
        });
    }

    // ══════════════════════════════════════
    // ── Theme: Dark / Light Toggle ──
    // ══════════════════════════════════════
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme or default to light
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // ══════════════════════════════════════
    // ── Color Palette Picker ──
    // ══════════════════════════════════════
    const colorToggle = document.getElementById('colorToggle');
    const colorDropdown = document.getElementById('colorDropdown');
    const savedColor = localStorage.getItem('color');

    // Apply saved color
    if (savedColor && savedColor !== 'default') {
        document.documentElement.setAttribute('data-color', savedColor);
    }

    // Mark active swatch
    function updateActiveColor(color) {
        document.querySelectorAll('.color-swatch').forEach(sw => {
            sw.classList.toggle('active', sw.getAttribute('data-color') === color);
        });
    }
    updateActiveColor(savedColor || 'default');

    if (colorToggle && colorDropdown) {
        colorToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            colorDropdown.classList.toggle('active');
        });

        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = swatch.getAttribute('data-color');
                if (color === 'default') {
                    document.documentElement.removeAttribute('data-color');
                } else {
                    document.documentElement.setAttribute('data-color', color);
                }
                localStorage.setItem('color', color);
                updateActiveColor(color);
                colorDropdown.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            colorDropdown.classList.remove('active');
        });
    }

    // ══════════════════════════════════════
    // ── Back to Top Button ──
    // ══════════════════════════════════════
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ══════════════════════════════════════
    // ── Active Nav Link Highlighting ──
    // ══════════════════════════════════════
    const allSections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightActiveNav() {
        let current = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightActiveNav);

    // ══════════════════════════════════════
    // ── Staggered Badge Animation ──
    // ══════════════════════════════════════
    const clientGrids = document.querySelectorAll('.client-grid');
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const badges = entry.target.querySelectorAll('.client-badge');
                badges.forEach((badge, i) => {
                    setTimeout(() => {
                        badge.classList.add('badge-visible');
                    }, i * 60);
                });
                badgeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    clientGrids.forEach(grid => badgeObserver.observe(grid));

    // ══════════════════════════════════════
    // ── Hero Parallax (subtle) ──
    // ══════════════════════════════════════
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    function heroParallax() {
        const scrollY = window.scrollY;
        const heroH = window.innerHeight;
        if (scrollY < heroH && heroContent) {
            const ratio = scrollY / heroH;
            heroContent.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
            heroContent.style.opacity = 1 - ratio * 0.7;
        }
        if (scrollIndicator) {
            scrollIndicator.style.opacity = 1 - (window.scrollY / 200);
        }
    }
    window.addEventListener('scroll', heroParallax);
});
