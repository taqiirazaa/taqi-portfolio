/* ==========================================
   TAQI RAZA PORTFOLIO — JavaScript
   ========================================== */

// ==========================================
// AI PARTICLE NETWORK BACKGROUND
// ==========================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80);
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const particleColor = isDark ? 'rgba(37, 99, 235,' : 'rgba(37, 99, 235,';
        const lineColor = isDark ? 'rgba(37, 99, 235,' : 'rgba(37, 99, 235,';

        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction
            if (this.mouse.x) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.vx += dx * 0.00005;
                    p.vy += dy * 0.00005;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor + '0.5)';
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = lineColor + (0.15 * (1 - dist / 150)) + ')';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// TYPING EFFECT
// ==========================================
class TypeWriter {
    constructor(element, phrases, speed = 80, pause = 2000) {
        this.element = element;
        this.phrases = phrases;
        this.speed = speed;
        this.pause = pause;
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.phrases[this.phraseIndex];

        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let delay = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.charIndex === current.length) {
            delay = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            delay = 400;
        }

        setTimeout(() => this.type(), delay);
    }
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        if (counter.dataset.animated) return;

        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(ease * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
                counter.dataset.animated = 'true';
            }
        }

        requestAnimationFrame(update);
    });
}

// ==========================================
// SKILL BAR ANIMATION
// ==========================================
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
        if (fill.dataset.animated) return;
        const level = fill.dataset.level;
        fill.style.width = level + '%';
        fill.dataset.animated = 'true';
    });
}

// ==========================================
// SCROLL REVEAL
// ==========================================
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counters when stats section is visible
                if (entry.target.closest('#stats') || entry.target.id === 'stats') {
                    animateCounters();
                }

                // Trigger skill bars
                if (entry.target.closest('#skills') || entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add reveal class to animated elements
    const elements = document.querySelectorAll(
        '.stat-card, .timeline-item, .project-card, .skill-group, .edu-card, .contact-card, .about-grid, .highlight-item'
    );

    elements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Also observe sections for counter/skill triggers
    document.querySelectorAll('#stats, #skills').forEach(sec => observer.observe(sec));
}

// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === '#' + id
                    );
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// MOBILE MENU
// ==========================================
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ==========================================
// THEME TOGGLE
// ==========================================
function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    // Always default to dark. Only use light if user explicitly chose it before.
    const savedTheme = localStorage.getItem('theme-chosen') === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme-chosen', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ==========================================
// PROJECT FILTERS
// ==========================================
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ==========================================
// DYNAMIC GREETING
// ==========================================
function setGreeting() {
    const greeting = document.getElementById('greeting');
    if (!greeting) return;

    const hour = new Date().getHours();
    let text = "Hello, I'm";

    if (hour >= 5 && hour < 12) text = "Good morning, I'm";
    else if (hour >= 12 && hour < 17) text = "Good afternoon, I'm";
    else if (hour >= 17 && hour < 21) text = "Good evening, I'm";
    else text = "Hello, I'm";

    greeting.textContent = text;
}

// ==========================================
// SMOOTH SCROLL FOR NAV LINKS
// ==========================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // AI Particle Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) new ParticleNetwork(canvas);

    // Typing Effect
    const typedElement = document.getElementById('typed-text');
    if (typedElement) {
        new TypeWriter(typedElement, [
            'Data Analyst | Power BI | Excel | SQL',
            'Economics Graduate | Carleton University',
            'Dashboard Developer & Report Automation',
            'Aspiring Business & Data Analyst',
            'Turning Data Into Strategic Decisions'
        ], 60, 2200);
    }

    // Setup all features
    setGreeting();
    setupThemeToggle();
    setupNavbarScroll();
    setupMobileMenu();
    setupActiveNav();
    setupSmoothScroll();
    setupScrollReveal();
    setupProjectFilters();
});
