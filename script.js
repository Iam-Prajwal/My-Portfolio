// ─── Mobile Nav Toggle ───
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ─── Active Nav Highlight ───
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinksAll.forEach(a => {
                a.style.color = '';
                if (a.getAttribute('href') === '#' + id) {
                    a.style.color = 'var(--gold-light)';
                }
            });
        }
    });
}

// ─── Header Shrink on Scroll ───
const headerEl = document.getElementById('mainHeader');
const backToTop = document.getElementById('backToTop');

function onScroll() {
    if (window.scrollY > 60) {
        headerEl.classList.add('scrolled');
    } else {
        headerEl.classList.remove('scrolled');
    }

    // back to top
    if (window.scrollY > 600) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Scroll Reveal (Intersection Observer) ───
const revealEls = document.querySelectorAll('.reveal');
const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealIO.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealIO.observe(el));

// ─── Progress Bar Fill Animation ───
const progressFills = document.querySelectorAll('.progress-fill');
const progressIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const pct = parseFloat(entry.target.dataset.pct);
            entry.target.style.width = pct + '%';
            progressIO.unobserve(entry.target);
        }
    });
}, { threshold: 0.35 });
progressFills.forEach(p => progressIO.observe(p));

// ─── Cursor Glow & Trail (desktop only) ───
const cursorGlow = document.getElementById('cursorGlow');
const cursorTrails = document.querySelectorAll('.cursor-trail');
const cursorCoords = { x: 0, y: 0 };

if (window.matchMedia('(pointer: fine)').matches) {
    cursorTrails.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorCoords.x = e.clientX;
        cursorCoords.y = e.clientY;
    });

    function animateCursorTrails() {
        let x = cursorCoords.x;
        let y = cursorCoords.y;

        cursorTrails.forEach(function (circle, index) {
            circle.style.left = x + "px";
            circle.style.top = y + "px";
            
            circle.style.transform = `translate(-50%, -50%) scale(${(cursorTrails.length - index) / cursorTrails.length})`;
            
            circle.x = x;
            circle.y = y;

            const nextCircle = cursorTrails[index + 1] || cursorTrails[0];
            x += (nextCircle.x - x) * 0.45;
            y += (nextCircle.y - y) * 0.45;
        });

        requestAnimationFrame(animateCursorTrails);
    }
    animateCursorTrails();
} else {
    cursorGlow.style.display = 'none';
    cursorTrails.forEach(t => t.style.display = 'none');
}

// ─── Particle Canvas ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
    const hero = canvas.parentElement;
    if(!hero) return;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}

function createParticles() {
    particles = [];
    const count = Math.min(Math.floor(canvas.width * canvas.height / 14000), 80);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 168, 50, ${p.opacity})`;
        ctx.fill();

        // draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(200, 168, 50, ${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    animId = requestAnimationFrame(drawParticles);
}

// Only run particles when hero is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const particleIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                drawParticles();
            } else {
                cancelAnimationFrame(animId);
            }
        });
    }, { threshold: 0 });

    resizeCanvas();
    createParticles();
    particleIO.observe(heroSection);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// ─── Typing effect for hero role (subtle) ───
const heroRole = document.querySelector('.hero-role');
if (heroRole) {
    const originalHTML = heroRole.innerHTML;
    // We keep the original content - the animation is handled by CSS fadeInUp
}

// Initial scroll check
onScroll();

// ─── Project Cards Expand Logic ───
const expandBtns = document.querySelectorAll('.expand-btn');
expandBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = btn.closest('.proj-card');
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
        } else {
            card.classList.add('expanded');
        }
    });
});
