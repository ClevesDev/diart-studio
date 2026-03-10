// DIAR STUDIO - Contact Page Engine v1.0
import { initTechIcons, initFormHandler, applyGlobalConfig, initTheme, toggleTheme } from './shared-ui.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    applyGlobalConfig(CONFIG);
    initTheme();
    initTechIcons();
    initFormHandler('contact');

    // Theme Switch Event
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
});
