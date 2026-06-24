// ==========================================
// ENHANCED FLUID MOUSE ANIMATION (UNIQUE)
// ==========================================

let mouseX = 50;
let mouseY = 50;
let currentX = 50;
let currentY = 50;
let lastTime = performance.now();
let hue = 220;
let wavePhase = 0;

// Create ambient glow element (with blur and color cycling)
const ambientGlow = document.createElement('div');
ambientGlow.className = 'ambient-glow';
document.body.appendChild(ambientGlow);

let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let currentGlowX = glowX;
let currentGlowY = glowY;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    glowX = e.clientX;
    glowY = e.clientY;
    document.body.classList.add('mouse-active');
    ambientGlow.classList.add('active');
});

// Unique, smooth animation loop for main gradient
function animateFluid() {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // Smoother interpolation
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    // Add organic wave motion
    wavePhase += delta * 0.8;
    const waveX = Math.sin(wavePhase) * 3;
    const waveY = Math.cos(wavePhase * 0.7) * 3;

    // Animate hue for color shifting
    hue = (hue + delta * 30) % 360;

    // Set CSS custom properties for gradient and color
    document.body.style.setProperty('--mouse-x', `${currentX + waveX}%`);
    document.body.style.setProperty('--mouse-y', `${currentY + waveY}%`);
    document.body.style.setProperty('--fluid-hue', hue);

    requestAnimationFrame(animateFluid);
}

// Animate ambient glow with color cycling and blur
function animateGlow() {
    // Smoother interpolation
    currentGlowX += (glowX - currentGlowX) * 0.07;
    currentGlowY += (glowY - currentGlowY) * 0.07;

    // Animate glow color
    const glowHue = (hue + 60) % 360;
    ambientGlow.style.left = `${currentGlowX - 250}px`;
    ambientGlow.style.top = `${currentGlowY - 250}px`;
    ambientGlow.style.background = `radial-gradient(circle, hsla(${glowHue}, 90%, 70%, 0.25) 0%, transparent 70%)`;
    ambientGlow.style.filter = `blur(60px)`;

    requestAnimationFrame(animateGlow);
}

// Start animations
animateFluid();
animateGlow();

// Enhanced cursor trail effect with variation
let trailCounter = 0;
document.addEventListener('mousemove', (e) => {
    trailCounter++;
    if (trailCounter % 3 === 0) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        // Add slight random offset for more organic feel
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        trail.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        document.body.appendChild(trail);
        setTimeout(() => {
            trail.style.opacity = '1';
        }, 10);
        setTimeout(() => {
            trail.remove();
        }, 1200);
    }
});

// Click ripple effect
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 800);
});

// Remove active class when mouse stops moving
let mouseStopTimeout;
document.addEventListener('mousemove', () => {
    clearTimeout(mouseStopTimeout);
    mouseStopTimeout = setTimeout(() => {
        document.body.classList.remove('mouse-active');
        setTimeout(() => {
            ambientGlow.classList.remove('active');
        }, 500);
    }, 3000);
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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


// ==========================================
// SECTION REVEAL ON SCROLL (OPTIONAL)
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});


// ==========================================
// FADE-IN ANIMATION ON LOAD
// ==========================================

window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    setTimeout(function() {
        document.body.style.opacity = '1';
    }, 100);
});

