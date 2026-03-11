<div align="center">
  <img src="./assets/mobile-app-banner.webp" alt="UI/UX Engineering Banner" width="850">
  <h1>🚀 DIAR STUDIO</h1>
  <p><b>High-End Software Engineering & Digital Architecture</b></p>
</div>

---

Arquitectura web estática y de alto rendimiento diseñada para **Diar Studio**. Creada desde cero bajo el paradigma de "Ingeniería de Interfaz" (UI Engineering), con métricas perfectas en Core Web Vitals, animaciones a 60fps y un ecosistema de conversión B2B nativo.

## 📋 Stack Tecnológico

| Categoría | Tecnología | Versión | Propósito |
|---|---|---|---|
| **CSS Framework** | Tailwind CSS | `v4.1.18` | Motor de diseño utility-first compilado |
| **Tipografía** | Geist (Google Fonts) | `wght@400;600;800` | Sistema tipográfico de alta legibilidad |
| **Iconografía** | Material Symbols Outlined | Variable | Iconos paramétricos con pesos dinámicos |
| **Hosting** | Netlify | Edge Functions | CDN global, formularios nativos, redirecciones |
| **Formularios** | Netlify Forms | Nativo | Procesamiento serverless de datos de contacto |
| **Bundler CSS** | @tailwindcss/cli | `4.1.0` | Compilación de `input.css` → `css/style.css` |
| **Plugins TW** | @tailwindcss/forms | `^0.5.11` | Reset de formularios cross-browser |

## 📁 Estructura del Proyecto

```
Landing DiarStudio/
├── index.html              # Hub principal — Hero, Solutions, Bento Grid, CTA
├── contact.html            # Terminal de conversión — Formulario B2B avanzado
├── cost.html               # Cotizador interactivo de proyectos
├── thanks.html             # Success page post-envío (noindex, nofollow)
├── template_pdf.html       # Plantilla de generación de cotizaciones PDF
│
├── input.css               # 🎨 FUENTE CSS — Tokens, componentes y animaciones
├── css/
│   └── style.css           # ⚙️ GENERADO — Output compilado de Tailwind (no editar)
│
├── js/
│   ├── config.js           # Configuración global centralizada (URLs, enlaces)
│   ├── shared-ui.js        # Módulo compartido: Tech Icons, Form Handler, Config
│   ├── main.js             # Engine del index — Audit Bot, CTA Photon, Observer
│   ├── contact-engine.js   # Engine de contact.html
│   ├── cost-engine.js      # Engine del cotizador interactivo
│   └── thanks-engine.js    # Engine de la página de éxito
│
├── img/                    # Assets optimizados (AVIF + WebP + fallback)
├── assets/                 # SVGs de frameworks, banners e íconos
├── _redirects              # Reglas de redirección Netlify (HTTP 200)
├── robots.txt              # Directivas de rastreo para bots
├── sitemap.xml             # Mapa del sitio para indexación SEO
└── package.json            # Scripts de compilación Tailwind
```

## 🚀 Ecosistema y Navegación

El proyecto se despliega como un ecosistema multi-página interconectado mediante estados estáticos, eliminando la necesidad de frameworks pesados de JS.

- **`index.html`**: Hub principal de presentación. Incorpora secuencias cinemáticas accionadas por el scroll (`IntersectionObserver`) y componentes tridimensionales ligeros.
- **`contact.html`**: Terminal de inicialización de ingeniería. Formulario de conversión adaptado a la estética "Platino-Void".
- **`thanks.html`**: Landing page de confirmación, protegida mediante etiquetas `noindex, nofollow`, que finaliza el customer journey (Success Page).
- **`cost.html`**: Cotizador interactivo que permite al cliente calcular presupuestos en tiempo real.

## 🏗️ Arquitectura CSS (Tailwind v4 + Capas Nativas)

El sistema de diseño está definido en `input.css` usando la arquitectura de capas de Tailwind CSS v4:

```css
@import "tailwindcss";

@theme {
    --color-primary: #3b83f7;          /* Acento principal */
    --color-background-dark: #101722;  /* Fondo oscuro principal */
    --color-void: #0b0b0b;            /* Negro absoluto */
    --color-platinum: #f5f7f8;         /* Blanco platino */
    --font-display: "Geist", sans-serif;
}
```

> ⚠️ **Importante:** El archivo `css/style.css` (~2800 líneas) es **generado automáticamente** por Tailwind CSS. Nunca editarlo manualmente — los cambios se hacen exclusivamente en `input.css`.

### Capas de diseño personalizadas

| Capa | Contenido |
|---|---|
| `@layer base` | Reset tipográfico con `font-family: var(--font-display)` y anti-aliasing |
| `@layer components` | Clases reutilizables: `.swiss-grid`, `.polished-silver-ingot`, `.photon-orb`, `.bot-levitate`, `.glass-card`, `.ambient-light` |
| `@layer utilities` | Helpers de animación: `.animate-photon`, `.animate-reveal`, `.terminal-typing`, `.intro-animate`, `.section-fade-in` |
| `@keyframes` | 8 animaciones GPU-optimizadas: `photon-path-impact`, `text-reveal-sequence`, `levitate`, `ambient-breathing`, etc. |

## ⚙️ Arquitectura JavaScript (ES Modules Nativos)

Todo el JavaScript usa **ES Modules nativos** (`type="module"` en `<script>`), sin bundlers ni transpiladores.

### Diagrama de dependencias

```
config.js ─────────────────┐
                           ▼
shared-ui.js ◄─────── Módulo Central
  ├── initTechIcons()      │ Hover/click en stack tecnológico
  ├── initFormHandler()    │ Envío con feedback UX de 4s + fetch paralelo
  └── applyGlobalConfig()  │ Sincronización de URLs globales (LinkedIn, GitHub)
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
  main.js           contact-engine.js    thanks-engine.js
  (index.html)      (contact.html)       (thanks.html)
  └── initAuditBot()  Inicializa icons    Inicializa icons
      + CTA Photon     + form handler      + config global
```

### Patrón de envío de formularios (`shared-ui.js`)

```
Usuario hace submit
       │
       ▼
  ┌─ checkValidity() ─── Falla? → Navegador muestra errores nativos
  │
  ▼ (Válido)
  preventDefault()
  Botón → Estado "loading" (animación pulse + spin)
       │
       ├── fetch() POST → Netlify (background)     ─┐
       ├── setTimeout(4000ms) → UX timer            ─┤
       │                                             │
       ▼                                             │
  Promise.all([fetch, timer]) ◄──────────────────────┘
       │
       ├── ✅ Éxito → redirect a /thanks
       └── ❌ Error → Restaura botón + alert()
```

## 💎 Identidad Visual y Diseño (UI)

- **Geist Typography System**: Sustitución global por Geist (Google Fonts) en pesos ultra-legibles y limpios, renderizados asíncronamente vía `font-display: swap`.
- **Estética "Platino-Void"**: Interfaz oscilante entre el vacío absoluto (`#0b0b0b`) y elementos de acción en Blanco Platino (`#f5f7f8`).
- **Precision Micro-interactions**: Botones de llamada a la acción con respuesta háptica inversa (`scale-95`), elevación milimétrica en Hover, cursores dinámicos (`_`, flechas de sistema) y control de inercia usando curvas Bezier de alta gama (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Cinematic CTA (Photon Impact)**: Animación acelerada por GPU donde una molécula interactúa e ilumina (`filter: brightness`) el texto en el punto crítico del viewport.
- **Audit-Bot (Levitación Infinita)**: En `index.html`, un drone paramétrico acompaña el scroll cambiando adaptativamente su estado (`idle`, `audit`, `handshake`).
- **SVG Sprite System**: Logo definido como `<symbol>` reutilizable vía `<use href="#diar-logo">`, eliminando redundancia de SVG inline.

## ⚡ Deployment y Performance (Netlify)

- **Netlify Native Forms**: Interceptores embebidos a nivel HTML en los `<form data-netlify="true">` que automatizan el envío del POST y redirigen hacia `thanks.html` mediante inteligencia de borde.
- **Form Interceptor Guard**: Script inteligente de control DOM que muta el botón de envío a animación de procesamiento (feedback asíncrono de 4 segundos) sin coartar la propagación de Netlify.
- **Gestión de Rutas (`_redirects`)**: Fichero nativo para asegurar resoluciones `HTTP 200` y atajar fugas de SPA a nivel servidor.
- **Speculation Rules API (2026)**: Pre-renderizado predictivo de páginas internas (`contact.html`, `cost.html`) usando la API nativa del navegador para navegación instantánea.
- **Asset Optimization**: Imágenes servidas en formato AVIF (primary) → WebP (fallback) con `fetchpriority="high"` y `decoding="async"` en recursos LCP.

## 🛡️ Enterprise Hardening (SecOps)

- **Content Security Policy (CSP)**: Autorización en lista blanca únicamente para Google Fonts y conexiones del propio Origin (`'self'`). Bloqueo de `frame-ancestors` para prevenir clickjacking.
- **Permissions Policy**: Denegación por defecto de cámara, micrófono y geolocalización para asegurar un entorno de lectura no intrusivo.
- **X-Content-Type-Options**: Cabecera `nosniff` para prevenir MIME-type sniffing.
- **Referrer Policy**: `strict-origin-when-cross-origin` para control de información de referencia.
- **Honeypot Anti-Spam**: Campo oculto `bot-field` en formularios para filtrar bots sin necesidad de CAPTCHA.
- **Advanced SEO JSON-LD**: Rich Snippets (Schema.org) configurados semánticamente como `ProfessionalService` para indexación de Google a partir del 2026.

## 🧪 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Compilar CSS (una vez)
npm run build

# Compilar CSS en modo watch (desarrollo continuo)
npm run watch
```

> Los scripts compilan `input.css` → `css/style.css` usando Tailwind CSS v4.1.18.

## 📊 Métricas de Escalabilidad

| Métrica | Puntuación | Detalle |
|---|---|---|
| **CSS Escalable** | ✅ 100% | Tailwind compilado + variables nativas CSS |
| **JS Modular** | ✅ 100% | ES Modules sin dependencias externas |
| **Rendimiento** | ✅ 100% | Animaciones GPU, AVIF, preload, speculation rules |
| **Seguridad** | ✅ 100% | CSP + Permissions Policy + honeypot + nosniff |
| **SEO** | ✅ 100% | JSON-LD, sitemap, robots, meta OG/Twitter |
| **DRY (No Repetición)** | ⚠️ 70% | Header/Footer/CSP replicados manualmente entre HTMLs |
| **Global** | 🔷 **85%** | Base sólida; componentes compartidos mejorarían al 100% |

## 🗺️ Roadmap de Escalabilidad

- [ ] Migrar a un SSG ligero (Astro/11ty) para componentizar Header, Footer y Head
- [ ] Centralizar CSP en archivo `_headers` de Netlify en lugar de `<meta>` por página
- [ ] Externalizar strings de UI a un archivo de configuración para soporte multi-idioma
- [ ] Implementar Service Worker para funcionamiento offline

---

Diseñado y compilado por el departamento de Ingeniería Frontend de **Diar Studio © 2026. Systems Nominal.**
