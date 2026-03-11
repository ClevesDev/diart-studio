// DIAR STUDIO - Main Landing Engine v1.0
// [ARCHITECTURE] Bootstrapper for the primary landing experience.
// Imports shared utilities to decouple logic.

import { initFormHandler, applyGlobalConfig } from './shared-ui.js';
import { CONFIG } from './config.js';
import { BentoCarousel } from './bento-carousel.js';

/**
 * @function initAuditBot
 * @description IntersectionObserver logic that orchestrates the "Audit Bot" avatar
 * behavior dynamically according to scroll depth (hero, work, contact sections).
 * Performance optimized by delegating animations to CSS via data-state toggling.
 */
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

/**
 * Initialization Hook
 * Guaranteed to execute only after DOM tree is fully parsed.
 */
document.addEventListener('DOMContentLoaded', () => {
    applyGlobalConfig(CONFIG);
    initAuditBot();
    initFormHandler('contact'); // Applies secure custom form submission logic
    
    // Iniciar Módulo Seguro del Bento Grid
    new BentoCarousel('#flutter-carousel');
});
