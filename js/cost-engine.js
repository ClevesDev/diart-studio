// DIAR STUDIO - Cost Estimator Engine v4.0
// [ARCHITECTURE] Specialized module managing the dynamic pricing quoting system.
// Handles complex state management for inputs (radio, sliders, checkboxes), PDF generation, and UI mirroring.

/**
 * @function syncPDF
 * @description PDF Template Sync Logic. Mirrors the selected configuration into the hidden PDF template.
 * Validates integrity dynamically. WARNING: innerHTML injections must be sanitized manually 
 * if inputs are not static HTML text content.
 */
const syncPDF = () => {
    const container = document.getElementById('pdf-container');
    if (!container.innerHTML) return;

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
        pdfAddonsContainer.innerHTML = addonInputs.map(el => `
            <div class="flex items-center py-4 border-b border-slate-100">
                <div class="w-12 mono-tech text-slate-300 font-bold">+</div>
                <div class="grow">
                    <h3 class="text-[11px] font-bold uppercase text-slate-600">${el.closest('label').querySelector('span').textContent}</h3>
                </div>
                <div class="w-32 mono-tech text-right font-bold text-slate-600">+$${parseInt(el.value).toLocaleString()}.00</div>
            </div>
        `).join('');
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
    document.getElementById('total-display').innerHTML = `$${total.toLocaleString()}<span class="text-slate-500 text-2xl">.00</span>`;
    document.getElementById('base-price-display').textContent = `$${baseValue.toLocaleString()}.00`;
    document.getElementById('addons-price-display').textContent = `$${addonsAmt.toLocaleString()}.00`;
    document.getElementById('multiplier-display').textContent = `${multiplier.toFixed(1)}x`;

    const rushLabels = { "1": "Estándar (1.0x)", "1.5": "Acelerado (1.5x)", "2": "Despliegue Rush (2.0x)" };
    document.getElementById('rush-label').textContent = rushLabels[multiplier.toString()] || `${multiplier.toFixed(1)}x`;

    // Update Pre-Invoice List in Terminal
    const invoiceList = document.getElementById('pre-invoice-list');
    let invoiceHTML = `
        <div class="flex justify-between text-[9px] text-primary/80 uppercase font-mono tracking-tighter">
            <span>> ${baseName}</span>
            <span>$${baseValue.toLocaleString()}.00</span>
        </div>
    `;

    addonInputs.forEach(input => {
        const name = input.closest('label').querySelector('span').textContent;
        const value = parseInt(input.value);
        invoiceHTML += `
            <div class="flex justify-between text-[9px] text-slate-400 uppercase font-mono tracking-tighter">
                <span>+ ${name}</span>
                <span>$${value.toLocaleString()}.00</span>
            </div>
        `;
    });

    if (multiplier > 1) {
        invoiceHTML += `
            <div class="flex justify-between text-[9px] text-neon-pink/80 uppercase font-mono tracking-tighter">
                <span>* COEF_VELOCIDAD (${multiplier.toFixed(1)}x)</span>
                <span>AJUSTADO</span>
            </div>
        `;
    }

    invoiceList.innerHTML = invoiceHTML;

    syncPDF();
};

// Load External PDF Template
// [SECURITY_NOTE]: Fetching external HTML templates directly into the DOM can be hazardous 
// if the source server is compromised. In production, ensure CSP restrict connections.
// Important: Local execution (file:///) will throw CORS errors. Requires a web server.
fetch('template_pdf.html')
    .then(response => response.text())
    .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Inject body content (Trimmed to avoid empty spaces)
        const content = doc.querySelector('body').innerHTML.trim();
        document.getElementById('pdf-container').innerHTML = content;

        // Inject style tags (Scoped in template_pdf.html to avoid leak)
        const styles = doc.querySelectorAll('style');
        styles.forEach(style => {
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

    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Procesando Datos...</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    btn.classList.add('cursor-not-allowed');

    // Simulate loading steps for 4 seconds
    let step = 0;
    const steps = [
        "Compilando Módulos...",
        "Calculando Costos...",
        "Inyectando Datos PDF...",
        "Finalizando Propuesta..."
    ];

    const interval = setInterval(() => {
        if (step < steps.length) {
            btn.innerHTML = `<span class="flex items-center gap-2"><span class="size-2 bg-primary rounded-full animate-pulse blur-[1px]"></span> ${steps[step]}</span>`;
            step++;
        }
    }, 800);

    setTimeout(() => {
        clearInterval(interval);

        if (typeof html2pdf === 'undefined') {
            alert("Error: El motor de PDF no cargó correctamente. Reintente en un momento.");
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            return;
        }

        btn.innerHTML = `<span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check_circle</span> Iniciando Descarga</span>`;

        const element = document.getElementById('pdf-content');
        if (!element) {
            console.error("Critical Error: #pdf-content not found.");
            alert("Error técnico: No se pudo localizar la estructura del PDF. Reintegre el sistema.");
            btn.innerHTML = originalText;
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
                useCORS: true,
                allowTaint: true,
                letterRendering: true,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Temporarily show container for capture
        const container = document.getElementById('pdf-container');
        container.style.visibility = 'visible';
        container.style.height = 'auto';

        html2pdf().set(opt).from(element).save().then(() => {
            container.style.visibility = 'hidden';
            container.style.height = '0';
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            btn.classList.remove('cursor-not-allowed');

            // Mensaje de cierre del bot
            setTimeout(() => {
                showBotMessage("Documento listo, te espero para discutir los detalles🚀");
            }, 500);
        }).catch(err => {
            console.error("PDF Generation Error:", err);
            alert("Error al generar el PDF. Verifique la conexión o intente nuevamente.");
            container.style.visibility = 'hidden';
            container.style.height = '0';
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    }, 4000);
});

// AuditBot Floating and Scroll Follow Scroll Logic
window.addEventListener('scroll', () => {
    const bot = document.getElementById('audit-bot');
    if (!bot.hasAttribute('data-lock')) {
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

updatePrice();
