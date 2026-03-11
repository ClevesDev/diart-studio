// DIAR STUDIO - Contact Page Engine v1.0
import { initTechIcons, initFormHandler, applyGlobalConfig, initMobileMenu } from './shared-ui.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    applyGlobalConfig(CONFIG);
    initTechIcons();
    initMobileMenu();
    initFormHandler('contact');
});
