import { applyGlobalConfig, initMobileMenu } from './shared-ui.js';
import { CONFIG } from './config.js';

// DIAR STUDIO - Cost Estimator Engine v4.0
// [ARCHITECTURE] Specialized module managing the dynamic pricing quoting system.
// Handles complex state management for inputs (radio, sliders, checkboxes), PDF generation, and UI mirroring.

/**
 * @function syncPDF
 * @description PDF Template Sync Logic. Mirrors the selected configuration into the hidden PDF template.
 * Uses DOM API exclusively — no innerHTML mutations.
 */
const syncPDF = () => {
    const container = document.getElementById('pdf-container');
    if (!container || container.childElementCount === 0) return;

    const baseInput = document.querySelector('input[name="architecture"]:checked');
    const baseValue = parseInt(baseInput.value);
    const baseName = baseInput.closest('label').querySelector('span').textContent;

    const addonInputs = Array.from(document.querySelectorAll('input[name="addon"]:checked'));
    const addonsTotal = addonInputs.reduce((total, el) => total + parseInt(el.value), 0);
    const multiplier = parseFloat(document.getElementById('rush-multiplier').value);
    const total = (baseValue + addonsTotal) * multiplier;

    // Update PDF Fields
    const pdfArchName = container.querySelector('#pdf-arch-name');
    const pdfArchCost = container.querySelector('#pdf-arch-cost');
    const pdfTotal = container.querySelector('#pdf-total');
    const pdfVelocity = container.querySelector('#pdf-velocity');
    const pdfAddonsContainer = container.querySelector('#pdf-addons-container');

    if (pdfArchName) pdfArchName.textContent = baseName;
    if (pdfArchCost) pdfArchCost.textContent = `$${baseValue.toLocaleString()}.00`;
    if (pdfTotal) pdfTotal.textContent = `$${total.toLocaleString()}.00`;
    if (pdfVelocity) pdfVelocity.textContent = `${multiplier.toFixed(1)}x`;

    if (pdfAddonsContainer) {
        // [SECURITY] Build addon rows via DOM API — no innerHTML, prevents XSS from input values.
        pdfAddonsContainer.textContent = '';
        const fragment = document.createDocumentFragment();
        addonInputs.forEach(el => {
            const row = document.createElement('div');
            row.className = 'flex items-center py-4 border-b border-slate-100';
            row.style.cssText = 'display:flex; align-items:center; padding:12px 0; border-bottom:1px solid #f1f5f9;';

            const iconCol = document.createElement('div');
            iconCol.className = 'w-12 mono-tech text-slate-300 font-bold';
            iconCol.style.cssText = 'width:3rem; font-family:monospace; color:#cbd5e1; font-weight:700; flex-shrink:0;';
            iconCol.textContent = '+';

            const nameCol = document.createElement('div');
            nameCol.className = 'grow';
            nameCol.style.cssText = 'flex:1; min-width:0;';
            const nameHeading = document.createElement('h3');
            nameHeading.className = 'text-[11px] font-bold uppercase text-slate-600';
            nameHeading.style.cssText = 'font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#475569; margin:0;';
            nameHeading.textContent = el.closest('label').querySelector('span').textContent;
            nameCol.appendChild(nameHeading);

            const priceCol = document.createElement('div');
            priceCol.className = 'w-32 mono-tech text-right font-bold text-slate-600';
            priceCol.style.cssText = 'width:8rem; font-family:monospace; text-align:right; font-weight:700; color:#475569; flex-shrink:0;';
            priceCol.textContent = `+$${parseInt(el.value).toLocaleString()}.00`;

            row.append(iconCol, nameCol, priceCol);
            fragment.appendChild(row);
        });
        pdfAddonsContainer.appendChild(fragment);
    }
};

const showBotMessage = (text) => {
    const bubble = document.getElementById('bot-message');
    bubble.textContent = text;
    bubble.classList.add('show');

    if (window.botTimeout) clearTimeout(window.botTimeout);
    window.botTimeout = setTimeout(() => {
        bubble.classList.remove('show');
    }, 3000);
};

const messagesPositive = [
    "Excelente decisión",
    "Arquitectura validada",
    "Infrasctructura optimizada",
    "Precisión técnica detectada",
    "Escalabilidad confirmada",
    "Ajuste profesional",
    "Integridad de datos OK"
];

const messagesNegative = [
    "Optimizando presupuesto...",
    "Simplificando módulos",
    "Reduciendo complejidad técnica",
    "Ajuste de recursos detectado",
    "Re-evaluando escalabilidad",
    "Menos es más, a veces..."
];

let lastAddonCount = 0;

/**
 * @function updatePrice
 * @description Core Pricing Calculation Engine. Evaluates base costs, multiplies factors (rush delivery),
 * aggregates add-ons, and subsequently paints the DOM (Terminal UI).
 * @param {Event} e - DOM Input/Change Event triggers bot animations.
 */
const updatePrice = (e) => {
    const baseInput = document.querySelector('input[name="architecture"]:checked');
    const addonInputs = Array.from(document.querySelectorAll('input[name="addon"]:checked'));
    const currentAddonCount = addonInputs.length;

    const baseValue = parseInt(baseInput.value);
    const baseName = baseInput.closest('label').querySelector('span').textContent;
    const addonsAmt = addonInputs.reduce((total, el) => total + parseInt(el.value), 0);
    const multiplier = parseFloat(document.getElementById('rush-multiplier').value);

    const total = (baseValue + addonsAmt) * multiplier;

    if (e && (e.type === 'change' || e.type === 'input')) {
        // Smooth move bot using viewport relative positioning
        const target = e.target;
        const rect = target.getBoundingClientRect();
        const bot = document.getElementById('audit-bot');
        const isMobile = window.innerWidth <= 768;

        // Calculate safe viewport position
        const targetY = Math.max(80, Math.min(rect.top, window.innerHeight - 100));

        bot.style.top = `${targetY}px`;
        bot.style.left = isMobile ? '1rem' : '1.5rem';
        bot.style.position = 'fixed'; // Keep fixed to avoid jumps when switching modes

        // Prevent immediate scroll override
        bot.setAttribute('data-lock', 'true');
        setTimeout(() => bot.removeAttribute('data-lock'), 1500);

        if (total >= 10000) {
            showBotMessage("!ALELLUYA HABEMUS PRESUPUESTO!");
        } else if (e.target.name === 'addon' && currentAddonCount < lastAddonCount) {
            const randomMsg = messagesNegative[Math.floor(Math.random() * messagesNegative.length)];
            showBotMessage(randomMsg);
        } else {
            const randomMsg = messagesPositive[Math.floor(Math.random() * messagesPositive.length)];
            showBotMessage(randomMsg);
        }
    }
    lastAddonCount = currentAddonCount;

    // Update Main Displays
    // [SECURITY] Build total display via DOM API. The .00 suffix uses a sibling span safely.
    const totalDisplay = document.getElementById('total-display');
    totalDisplay.textContent = `$${total.toLocaleString()}`;
    const centsSpan = document.createElement('span');
    centsSpan.className = 'text-slate-500 text-2xl';
    centsSpan.textContent = '.00';
    totalDisplay.appendChild(centsSpan);
    document.getElementById('base-price-display').textContent = `$${baseValue.toLocaleString()}.00`;
    document.getElementById('addons-price-display').textContent = `$${addonsAmt.toLocaleString()}.00`;
    document.getElementById('multiplier-display').textContent = `${multiplier.toFixed(1)}x`;

    const rushLabels = { "1": "Estándar (1.0x)", "1.5": "Acelerado (1.5x)", "2": "Despliegue Rush (2.0x)" };
    document.getElementById('rush-label').textContent = rushLabels[multiplier.toString()] || `${multiplier.toFixed(1)}x`;

    // [SECURITY] Build invoice list via DocumentFragment — no innerHTML template literals.
    const invoiceList = document.getElementById('pre-invoice-list');
    const fragment = document.createDocumentFragment();

    const baseRow = document.createElement('div');
    baseRow.className = 'flex justify-between text-[9px] text-primary/80 uppercase font-mono tracking-tighter';
    const baseLabel = document.createElement('span');
    baseLabel.textContent = `> ${baseName}`;
    const basePrice = document.createElement('span');
    basePrice.textContent = `$${baseValue.toLocaleString()}.00`;
    baseRow.append(baseLabel, basePrice);
    fragment.appendChild(baseRow);

    addonInputs.forEach(input => {
        const name = input.closest('label').querySelector('span').textContent;
        const value = parseInt(input.value);
        const addonRow = document.createElement('div');
        addonRow.className = 'flex justify-between text-[9px] text-slate-400 uppercase font-mono tracking-tighter';
        const addonLabel = document.createElement('span');
        addonLabel.textContent = `+ ${name}`;
        const addonPrice = document.createElement('span');
        addonPrice.textContent = `$${value.toLocaleString()}.00`;
        addonRow.append(addonLabel, addonPrice);
        fragment.appendChild(addonRow);
    });

    if (multiplier > 1) {
        const coefRow = document.createElement('div');
        coefRow.className = 'flex justify-between text-[9px] text-neon-pink/80 uppercase font-mono tracking-tighter';
        const coefLabel = document.createElement('span');
        coefLabel.textContent = `* COEF_VELOCIDAD (${multiplier.toFixed(1)}x)`;
        const coefValue = document.createElement('span');
        coefValue.textContent = 'AJUSTADO';
        coefRow.append(coefLabel, coefValue);
        fragment.appendChild(coefRow);
    }

    invoiceList.textContent = ''; // Clear safely before repaint
    invoiceList.appendChild(fragment);

    syncPDF();
};

// Load External PDF Template
// [SECURITY] Uses DOMParser to parse the template as a document tree,
// then transfers nodes via adoptNode/appendChild instead of string-injecting innerHTML.
fetch('template_pdf.html')
    .then(response => response.text())
    .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const pdfContainer = document.getElementById('pdf-container');

        // [SECURITY] Transfer body children via adoptNode — no raw innerHTML assignment.
        pdfContainer.textContent = '';
        const body = doc.querySelector('body');
        const nodeFragment = document.createDocumentFragment();
        while (body.firstChild) {
            nodeFragment.appendChild(document.adoptNode(body.firstChild));
        }
        pdfContainer.appendChild(nodeFragment);

        // Inject scoped styles safely via textContent (not innerHTML on style element)
        doc.querySelectorAll('style').forEach(style => {
            const newStyle = document.createElement('style');
            newStyle.textContent = style.textContent;
            document.head.appendChild(newStyle);
        });

        updatePrice(); // Initial sync
    });

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updatePrice);
    input.addEventListener('input', updatePrice);
});

document.getElementById('download-pdf').addEventListener('click', () => {
    const btn = document.getElementById('download-pdf');
    if (btn.disabled) return;

    showBotMessage("Hoy se come 😂");

    // [SECURITY] Preserve original DOM children via cloneNode.
    const originalContent = btn.cloneNode(true);

    // [SECURITY] Set initial processing state via textContent.
    btn.textContent = 'Procesando Datos...';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    btn.classList.add('cursor-not-allowed');

    const steps = [
        "Compilando Módulos...",
        "Calculando Costos...",
        "Inyectando Datos PDF...",
        "Finalizando Propuesta..."
    ];
    let step = 0;

    // [SECURITY] Update button text via textContent — never via innerHTML.
    const interval = setInterval(() => {
        if (step < steps.length) {
            btn.textContent = '';
            const stepWrapper = document.createElement('span');
            stepWrapper.className = 'flex items-center gap-2';
            const dot = document.createElement('span');
            dot.className = 'size-2 bg-primary rounded-full animate-pulse blur-[1px]';
            const stepText = document.createTextNode(` ${steps[step]}`);
            stepWrapper.append(dot, stepText);
            btn.appendChild(stepWrapper);
            step++;
        }
    }, 800);

    setTimeout(() => {
        clearInterval(interval);

        if (typeof html2pdf === 'undefined') {
            alert("Error: El motor de PDF no cargó correctamente. Reintente en un momento.");
            btn.textContent = '';
            btn.append(...originalContent.childNodes);
            btn.disabled = false;
            btn.style.opacity = '1';
            return;
        }

        // [SECURITY] Set success state via DOM API.
        btn.textContent = '';
        const successWrapper = document.createElement('span');
        successWrapper.className = 'flex items-center gap-2';
        const checkIcon = document.createElement('span');
        checkIcon.className = 'material-symbols-outlined text-sm';
        checkIcon.textContent = 'check_circle';
        const successText = document.createTextNode(' Iniciando Descarga');
        successWrapper.append(checkIcon, successText);
        btn.appendChild(successWrapper);

        const element = document.getElementById('pdf-content');
        if (!element) {
            console.error("Critical Error: #pdf-content not found.");
            alert("Error técnico: No se pudo localizar la estructura del PDF. Reintegre el sistema.");
            btn.textContent = '';
            btn.append(...originalContent.childNodes);
            btn.disabled = false;
            return;
        }

        const opt = {
            margin: 0,
            filename: 'DiarStudio_Propuesta_Tecnica.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                backgroundColor: '#f8fafc',
                useCORS: false,
                allowTaint: true,
                letterRendering: true,
                scrollY: 0,
                scrollX: 0,
                // [COMPAT] html2canvas v1.x can't parse oklch() (Tailwind v4 default).
                // Strategy: remove external <link> tags from clone (prevent re-fetch), then
                // read already-parsed CSS rules from memory, strip only oklch declarations
                // (flex/grid/position/spacing/typography all survive), inject as inline <style>.
                onclone: (clonedDoc) => {
                    // 1. Remove link tags so html2canvas doesn't try to re-fetch/parse them
                    clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(l => l.remove());

                    // 2. Read CSS rules already parsed in memory (no network needed)
                    let safeCSS = '';
                    for (const sheet of document.styleSheets) {
                        try {
                            for (const rule of sheet.cssRules) {
                                // Strip individual property declarations that use oklch/oklab/color-mix —
                                // Tailwind v4 uses all three. Keeps layout/spacing/typography untouched.
                                safeCSS += rule.cssText.replace(
                                    /[\w-]+\s*:\s*[^;]*(?:oklch|oklab|color-mix)\([^;]*;/g, ''
                                ) + '\n';
                            }
                        } catch (_) { /* Skip cross-origin sheets (fonts.googleapis.com) */ }
                    }

                    // 3. Inject clean CSS as inline style — no oklch, full layout support
                    const safeStyle = clonedDoc.createElement('style');
                    safeStyle.textContent = safeCSS;
                    clonedDoc.head.appendChild(safeStyle);
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        const container = document.getElementById('pdf-container');
        container.style.visibility = 'visible';
        container.style.height = 'auto';

        html2pdf().set(opt).from(element).save().then(() => {
            container.style.visibility = 'hidden';
            container.style.height = '0';
            btn.textContent = '';
            btn.append(...originalContent.childNodes);
            btn.style.opacity = '1';
            btn.disabled = false;
            btn.classList.remove('cursor-not-allowed');
            setTimeout(() => { showBotMessage("Documento listo, te espero para discutir los detalles🚀"); }, 500);
        }).catch(err => {
            console.error("PDF Generation Error:", err);
            alert("Error al generar el PDF. Verifique la conexión o intente nuevamente.");
            container.style.visibility = 'hidden';
            container.style.height = '0';
            btn.textContent = '';
            btn.append(...originalContent.childNodes);
            btn.disabled = false;
        });
    }, 4000);
});

// AuditBot Floating and Scroll Follow Scroll Logic
window.addEventListener('scroll', () => {
    const bot = document.getElementById('audit-bot');
    if (!bot?.hasAttribute('data-lock')) {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const targetTop = 20 + (scrollPercent * 60);
        bot.style.top = `${targetTop}%`;
        bot.style.position = 'fixed';

        if (window.innerWidth <= 768) {
            bot.style.left = '1rem';
        } else {
            bot.style.left = '1.5rem';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    applyGlobalConfig(CONFIG);
    initMobileMenu();
});

updatePrice();
