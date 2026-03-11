// DIAR STUDIO - Shared UI Components v1.0
// [ARCHITECTURE] Centralized module for reusable, scalable UI components across the ecosystem.
import { CONFIG } from './config.js';

/**
 * @function initTechIcons
 * @description Technical Stack Tooltip Logic. Handles hover states and dynamic 
 * terminal-style information display for the tech stack icons.
 * @module shared-ui.js
 * Used in contact.html and thanks.html
 */
export const initTechIcons = () => {
    const techIcons = document.querySelectorAll('.tech-icon');
    const techDisplay = document.getElementById('tech-display');
    const textSpan = document.getElementById('tech-text');

    if (techIcons.length > 0 && techDisplay && textSpan) {
        let displayTimeout;

        techIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const info = icon.getAttribute('data-info');

                // Reset all icons
                techIcons.forEach(i => {
                    i.classList.remove('opacity-100', 'scale-110', '-translate-y-1');
                });

                // Highlight selected
                icon.classList.add('opacity-100', 'scale-110', '-translate-y-1');

                // Show terminal display
                clearTimeout(displayTimeout);
                textSpan.textContent = info;
                techDisplay.classList.remove('opacity-0');
                techDisplay.classList.add('opacity-100');

                // Auto-hide after 4 seconds
                displayTimeout = setTimeout(() => {
                    techDisplay.classList.remove('opacity-100');
                    techDisplay.classList.add('opacity-0');
                    icon.classList.remove('opacity-100', 'scale-110', '-translate-y-1');
                }, 4000);
            });
        });
    }
};

/**
 * @function initFormHandler
 * @description Universal Form Submission Feedback handler. Provides simulated processing
 * sequences (4s delay) and Netlify background submission to enhance User Experience.
 * @param {string} formName - The `name` attribute of the HTML form to bind this handler to.
 * Used in index.html and contact.html
 */
export const initFormHandler = (formName) => {
    const form = document.querySelector(`form[name="${formName}"]`);
    const btn = form?.querySelector('button[type="submit"]');

    if (form && btn) {
        form.addEventListener('submit', (e) => {
            // Check HTML5 validity first
            if (!form.checkValidity()) {
                return; // Let browser handle basic alerts
            }

            // [NEW] Prevent default to force 4-second delay
            e.preventDefault();

            // [SECURITY] Preserve original DOM tree via cloneNode — never via innerHTML string.
            const originalContent = btn.cloneNode(true);

            // Apply loading state
            btn.disabled = true;
            btn.classList.add('opacity-80', 'cursor-wait', 'pointer-events-none');

            // [SECURITY] Build loading state via DOM API — no innerHTML, no XSS surface.
            btn.textContent = '';
            const loadingText = document.createElement('span');
            loadingText.className = 'animate-pulse';
            loadingText.textContent = 'Calculando infraestructura...';
            const loadingIcon = document.createElement('span');
            loadingIcon.className = 'material-symbols-outlined text-lg animate-spin ml-2';
            loadingIcon.textContent = 'data_thresholding';
            btn.append(loadingText, loadingIcon);

            // Prepare Data for Netlify
            const formData = new FormData(form);

            // 1. Submit in background
            const submitPromise = fetch(form.action || '/', {
                method: 'POST',
                headers: { 'Accept': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: new URLSearchParams(formData).toString()
            });

            // 2. Force 4 second wait timer
            const timerPromise = new Promise(resolve => setTimeout(resolve, 4000));

            // Wait for both before redirecting
            Promise.all([submitPromise, timerPromise])
                .then(() => {
                    window.location.href = '/thanks';
                })
                .catch((error) => {
                    console.error('Submission Error:', error);
                    btn.disabled = false;
                    btn.classList.remove('opacity-80', 'cursor-wait', 'pointer-events-none');
                    // [SECURITY] Restore original children from cloned node — no innerHTML.
                    btn.textContent = '';
                    btn.append(...originalContent.childNodes);
                    alert('Error en conexión. Por favor reintenta.');
                });
        });
    }
};




/**
 * @function applyGlobalConfig
 * @description Apply Global Configuration (e.g., dynamic URLs) to the DOM.
 * Synchronizes links across all pages from constraints defined in config.js.
 * @param {Object} config - The global system configuration object.
 */
export const applyGlobalConfig = (config) => {
    const linkedinLinks = document.querySelectorAll('[id*="linkedin-link"]');
    const githubLinks = document.querySelectorAll('[href*="github.com"]');

    linkedinLinks.forEach(link => {
        if (config.links.linkedin) link.href = config.links.linkedin;
    });

    githubLinks.forEach(link => {
        if (config.links.github) link.href = config.links.github;
    });
};




/**
 * @function initMobileMenu
 * @description Logical controller for the mobile navigation dropdown.
 * Manages the open/close state of the menu and ensures accessibility (ARIA).
 * @module shared-ui.js
 */
export const initMobileMenu = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const icon = toggle?.querySelector('.material-symbols-outlined');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('active');
        
        if (isOpen) {
            // Close State
            menu.classList.remove('active');
            menu.classList.add('hidden');
            if (icon) icon.textContent = 'menu';
            document.body.style.overflow = '';
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            // Open State
            menu.classList.remove('hidden');
            // Allow browser to register 'hidden' removal before adding 'active' for transition
            setTimeout(() => menu.classList.add('active'), 10);
            if (icon) icon.textContent = 'close';
            document.body.style.overflow = 'hidden'; // Lock scroll
            toggle.setAttribute('aria-expanded', 'true');
        }
    });

    // Close on link click
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menu.classList.add('hidden');
            if (icon) icon.textContent = 'menu';
            document.body.style.overflow = '';
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
};
