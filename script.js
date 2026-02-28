// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initFAQ();
    initContactForm();
    initSmoothScroll();
    initCounterAnimation();
});

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
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

// ===== MOBILE MENU =====
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const links = document.getElementById('navLinks');

    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        links.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            links.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerInner = item.querySelector('.faq-answer-inner');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if was closed)
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answerInner.scrollHeight + 40 + 'px';
            }
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const business = document.getElementById('business').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !phone || !business) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Show success animation
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon">✅</span> Demo Booked Successfully!';
        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        btn.disabled = true;

        // Build WhatsApp message
        const waMessage = `Hi! I'd like to book a free demo for AutoWA Pro.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Business:* ${encodeURIComponent(business)}${message ? '%0A*Message:* ' + encodeURIComponent(message) : ''}`;

        showNotification('🎉 Thank you! We\'ll contact you within 2 hours. Redirecting to WhatsApp...', 'success');

        setTimeout(() => {
            window.open(`https://wa.me/918142093420?text=${waMessage}`, '_blank');
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 2500);
    });
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'success') {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
    <p>${message}</p>
    <button onclick="this.parentElement.remove()" style="background:none;color:inherit;font-size:1.2rem;padding:0 0 0 12px;">×</button>
  `;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 24px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: '500',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        animation: 'fadeInUp 0.4s ease-out',
        maxWidth: '90vw',
        textAlign: 'center',
        background: type === 'success' ? '#10B981' : '#EF4444',
        color: '#fff',
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.proof-stat .number, .hero-stat .stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;

    // Check if it's a pure number or has suffix
    const match = text.match(/^([\d,]+)(\+?)(%?)(L?\+?)$/);
    if (!match) return; // Skip non-numeric values like "24/7" or "3x"

    const targetText = text;
    const numericPart = text.replace(/[^\d]/g, '');
    const target = parseInt(numericPart);

    if (isNaN(target) || target === 0) return;

    const suffix = text.replace(/[\d,]/g, '');
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);

        // Format with commas if original had them
        let formatted = current.toString();
        if (text.includes(',')) {
            formatted = current.toLocaleString('en-IN');
        }

        element.textContent = formatted + suffix;

        if (step >= steps) {
            element.textContent = targetText;
            clearInterval(timer);
        }
    }, duration / steps);
}

// ===== PARALLAX SUBTLE EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const scrolled = window.scrollY;
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

