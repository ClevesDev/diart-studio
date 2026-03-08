<div align="center">
  <img src="./assets/mobile-app-banner.webp" alt="UI/UX Engineering Banner" width="850">
  <h1>🚀 DIAR STUDIO</h1>
  <p><b>High-End Software Engineering & Digital Architecture</b></p>
</div>

---

Arquitectura web estática y de alto rendimiento diseñada para **Diar Studio**. Creada desde cero bajo el paradigma de "Ingeniería de Interfaz" (UI Engineering), con métricas perfectas en Core Web Vitals, animaciones a 60fps y un ecosistema de conversión B2B nativo.

## 🚀 Ecosistema y Navegación

El proyecto se despliega como un ecosistema multi-página interconectado mediante estados estáticos, eliminando la necesidad de frameworks pesados de JS.

- `index.html`: Hub principal de presentación. Incorpora secuencias cinemáticas accionadas por el scroll (Intersection Observer) y componentes tridimensionales ligeros.
- `contact.html`: Terminal de inicialización de ingeniería. Formulario de conversión adaptado a la estética "Platino-Void".
- `thanks.html`: Landing page de confirmación, protegida mediante etiquetas `noindex, nofollow`, que finaliza el customer journey (Success Page).

## 💎 Identidad Visual y Diseño (UI)

- **Geist Typography System**: Sustitucion global por Geist (Google Fonts) en pesos ultra-legibles y limpios, renderizados asíncronamente vía `font-display: swap`.
- **Estética "Platino-Void"**: Interfaz oscilante entre el vacío absoluto (`#0b0b0b`) y elementos de acción en Blanco Platino (`#f5f7f8`).
- **Precision Micro-interactions**: Botones de llamada a la acción con respuesta háptica inversa (scale-95), elevación milimétrica en Hover, cursores dinámicos (`_`, flechas de sistema) y control de inercia usando curvas Bezier de alta gama (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Cinematic CTA (Photon Impact)**: Animación acelerada por GPU donde una molécula interactúa e ilumina (filter: brightness) el texto en el punto crítico del viewport.
- **Audit-Bot (Levitación Infinita)**: En `index.html`, un drone paramétrico acompaña el scroll cambiando adaptativamente su estado (idle, audit, handshake).

## ⚡ Deployment Constante y Perfomance (Netlify)

- **Netlify Native Forms**: Interceptores embebidos a nivel HTML en los `<form data-netlify="true">` que automatizan el envío del POST y redigiren hacia `thanks.html` mediante inteligencia de borde.
- **Form Interceptor Guard**: Script inteligente de control DOM que muta el botón de envío a _'Processing...'_ (feedback asíncrono) sin coartar la propagación de Netlify.
- **Gestión de Rutas (`_redirects`)**: Fichero nativo para asegurar resoluciones `HTTP 200` y atajar fugas de SPA (Single Page Applications) a nivel servidor.

## 🛡️ Enterprise Hardening (SecOps)

- **Content Security Policy (CSP)**: Autorización en lista blanca únicamente para CDN Tailwind, Google Fonts y conexiones del propio Origin (`'self'`).
- **Permissions Policy**: Denegación por defecto del sensor de red, cámaras y GPS para asegurar un entorno de lectura no intrusivo.
- **Advanced SEO JSON-LD**: Rich Snippets (Schema.org) configurados semánticamente como `ProfessionalService` para indexación de Google a partir del 2026.

---

Diseñado y compilado por el departamento de Ingeniería Frontend de **Diar Studio © 2026. Systems Nominal.**
