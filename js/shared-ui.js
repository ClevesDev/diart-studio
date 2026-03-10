// DIAR STUDIO - Shared UI Components v1.0
import { CONFIG } from './config.js';


/**
 * Technical Stack Tooltip Logic
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
 * Universal Form Submission Feedback
 * Used in index.html and contact.html
 */
export const initFormHandler = (formName) => {
    const form = document.querySelector(`form[name="${formName}"]`);
    const btn = form?.querySelector('button[type="submit"]');

    if (form && btn) {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
                return;
            }

            // Visual feedback
            btn.innerHTML = `<span>Procesando...</span><span class="material-symbols-outlined text-lg animate-spin">autorenew</span>`;
            btn.classList.add('opacity-80', 'cursor-not-allowed', 'pointer-events-none');
            
            // Netlify handling is native
        });
    }
};

/**
 * Theme Engine (Dark/Light Mode)
 * Persistence with localStorage
 */
export const initTheme = () => {
    const theme = localStorage.getItem('theme');
    const html = document.documentElement;
    
    // Check if user has explicit preference
    if (theme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcons();
};

export const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons();
};

const updateThemeIcons = () => {
    const sunIcons = document.querySelectorAll('.ui-sun-icon');
    const moonIcons = document.querySelectorAll('.ui-moon-icon');
    const isDark = document.documentElement.classList.contains('dark');

    // Show Sun icon in Dark Mode (to go light)
    // Show Moon icon in Light Mode (to go dark)
    sunIcons.forEach(icon => icon.classList.toggle('hidden', !isDark));
    moonIcons.forEach(icon => icon.classList.toggle('hidden', isDark));
};



/**
 * Apply Global Configuration to UI
 * Synchronizes links across all pages
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



