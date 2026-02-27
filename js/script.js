const navSlide = () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
        
        // Simple burger transforms
        if(nav.classList.contains('nav-active')) {
            burger.children[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            burger.children[1].style.opacity = '0';
            burger.children[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            burger.children[0].style.transform = 'none';
            burger.children[1].style.opacity = '1';
            burger.children[2].style.transform = 'none';
        }
    });
}

const scrollReveal = () => {
    const hiddenElements = document.querySelectorAll('.hidden-element');
    if (!hiddenElements.length) return;

    // Add a subtle stagger so elements appear gradually
    hiddenElements.forEach((el, index) => {
        // Let authors override via data-reveal-delay (ms)
        const custom = el.getAttribute('data-reveal-delay');
        const delayMs = custom ? Number(custom) : Math.min(index * 70, 420);
        if (!Number.isNaN(delayMs)) {
            el.style.setProperty('--reveal-delay', `${delayMs}ms`);
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px'
    });

    hiddenElements.forEach((el) => observer.observe(el));
}

// Parallax sections (lightweight)
const parallaxSections = () => {
    const sections = document.querySelectorAll('[data-parallax]');
    if (!sections.length) return;

    let ticking = false;

    const update = () => {
        ticking = false;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        sections.forEach((section) => {
            const speed = Number(section.getAttribute('data-parallax'));
            const factor = Number.isFinite(speed) ? speed : 0.1;

            // Offset relative to the section to keep movement stable
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const delta = scrollY - sectionTop;

            // Clamp for performance / aesthetics
            const y = Math.max(-120, Math.min(120, Math.round(delta * factor)));
            section.style.setProperty('--parallax-y', `${y}px`);
        });
    };

    const requestTick = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    update();
}

// Hero Zoom Effect
const heroZoomEffect = () => {
    const bg = document.querySelector('.zoom-layer-bg');
    const text = document.querySelector('.zoom-layer-text');
    
    if(!bg || !text) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Don't animate if scrolled past viewport height to save performance
        if (scrolled > window.innerHeight) return;

        // Scale background: starts at 1, increases faster for more effect
        const scaleValue = 1 + (scrolled * 0.0025);
        
        // Translate background slightly downwards for parallax
        const translateValue = scrolled * 0.8;

        // Fade out text and move it up faster
        const opacityValue = 1 - (scrolled * 0.0035);
        const textTranslate = scrolled * 0.8;

        // Apply styles - increased parallax effect
        bg.style.transform = `scale(${scaleValue}) translateY(${translateValue * 0.6}px)`;
        
        text.style.opacity = opacityValue > 0 ? opacityValue : 0;
        text.style.transform = `translateY(-${textTranslate}px)`;
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        // Close mobile menu if open
        const nav = document.querySelector('.nav-links');
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            const burger = document.querySelector('.hamburger');
            if(burger) {
                 // Reset burger icon
                burger.children[0].style.transform = 'none';
                burger.children[1].style.opacity = '1';
                burger.children[2].style.transform = 'none';
            }
        }

        const target = document.querySelector(targetId);
        if (!target) return;

        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cookie Consent Banner
const cookieConsent = () => {
    const banner = document.querySelector('[data-cookie-banner]');
    if (!banner) return;

    const storageKey = 'ta_cookie_consent_v1';
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000; // 12 months
    const now = Date.now();

    const readValue = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const writeValue = (value) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ value, ts: now }));
        } catch {
            // ignore
        }
    };

    const existing = readValue();
    const isValidExisting =
        existing &&
        typeof existing === 'object' &&
        (existing.value === 'accepted' || existing.value === 'rejected') &&
        typeof existing.ts === 'number' &&
        now - existing.ts < maxAgeMs;

    if (isValidExisting) {
        banner.hidden = true;
        return;
    }

    banner.hidden = false;

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const rejectBtn = banner.querySelector('[data-cookie-reject]');

    const close = (value) => {
        writeValue(value);
        banner.hidden = true;
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => close('accepted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => close('rejected'));
}

// Accordion Functionality
const accordion = () => {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle content
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Services classic: collapsible cards
const servicesDropdown = () => {
    const cards = document.querySelectorAll('.service-classic-card');
    if (!cards.length) return;

    cards.forEach((card) => {
        const toggle = card.querySelector('.service-classic-toggle');
        const list = card.querySelector('.service-classic-list');
        if (!toggle || !list) return;

        toggle.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');
            card.classList.toggle('is-open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            list.setAttribute('aria-hidden', String(isOpen));
        });
    });
}

// Projects Page: filter + search + expand details
const projectsPage = () => {
    const filterButtons = document.querySelectorAll('.filter-chip');
    const searchInput = document.querySelector('#project-search');
    const countEl = document.querySelector('#project-count');
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectCards.length) return;

    let activeFilter = 'all';

    const normalize = (s) => (s || '').toLowerCase();

    const updateCount = (visibleCount, totalCount) => {
        if (!countEl) return;
        countEl.textContent = `Mostrant ${visibleCount} de ${totalCount}`;
    };

    const applyFilters = () => {
        const query = normalize(searchInput ? searchInput.value : '');

        let visible = 0;
        projectCards.forEach((card) => {
            const category = card.getAttribute('data-category') || 'all';
            const matchesCategory = activeFilter === 'all' || category === activeFilter;
            const text = normalize(card.innerText);
            const matchesQuery = !query || text.includes(query);

            const show = matchesCategory && matchesQuery;
            card.style.display = show ? '' : 'none';
            if (show) visible += 1;
        });

        updateCount(visible, projectCards.length);
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter') || 'all';
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Collapsible details
    document.querySelectorAll('.project-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const details = toggle.nextElementSibling;
            if (!details || !details.classList.contains('project-details')) return;

            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isOpen));
            details.setAttribute('aria-hidden', String(isOpen));

            if (isOpen) {
                details.style.maxHeight = '0px';
                details.classList.remove('open');
                toggle.textContent = 'Veure detalls';
            } else {
                details.classList.add('open');
                details.style.maxHeight = details.scrollHeight + 'px';
                toggle.textContent = 'Amagar detalls';
            }
        });
    });

    // Initial state
    applyFilters();
}

// Back to Top Button
const backToTop = () => {
    const btn = document.querySelector('.back-to-top');
    if(!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// App initiation
const app = () => {
    navSlide();
    scrollReveal();
    heroZoomEffect();
    parallaxSections();
    accordion();
    servicesDropdown();
    backToTop();
    projectsPage();
    cookieConsent();
}

app();
