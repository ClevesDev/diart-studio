// DIAR STUDIO - Main Landing Engine v1.0
import { initFormHandler, applyGlobalConfig, initTheme, toggleTheme } from './shared-ui.js';
import { CONFIG } from './config.js';

const initAuditBot = () => {
    const bot = document.getElementById('audit-bot');
    const sections = ['hero', 'work', 'contact'].map(id => document.getElementById(id));

    const config = { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            switch (entry.target.id) {
                case 'hero':
                    bot.setAttribute('data-state', 'idle');
                    bot.style.top = '25%';
                    bot.style.right = '6%';
                    break;
                case 'work':
                    bot.setAttribute('data-state', 'audit');
                    bot.style.top = '50%';
                    bot.style.right = '4%';
                    break;
                case 'contact':
                    bot.setAttribute('data-state', 'handshake');
                    bot.style.top = '80%';
                    bot.style.right = '10%';
                    break;
            }
        });
    }, config);

    sections.forEach(sec => sec && observer.observe(sec));

    // [CINEMATIC TRIGGER] CTA Animation
    const ctaHeader = document.getElementById('cta-header');
    const ctaPhoton = document.getElementById('cta-photon');
    const ctaObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            ctaPhoton.classList.add('animate-photon');
            ctaHeader.classList.add('animate-reveal');
            ctaObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.8 });
    ctaHeader && ctaObserver.observe(ctaHeader);
};

document.addEventListener('DOMContentLoaded', () => {
    applyGlobalConfig(CONFIG);
    initTheme();
    initAuditBot();
    initFormHandler('contact');

    // Theme Switch Event
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
});
