# Diar Studio - Arquitectura y Estándares de Seguridad

Este documento define la arquitectura del proyecto, directrices de escalabilidad y los estándares de seguridad implementados para garantizar un ecosistema robusto y preparado para producción bajo los lineamientos de la industria técnica del 2026.

## 1. Integridad y Estándares de Seguridad

El proyecto está auditado y diseñado siguiendo los estándares más rigurosos de seguridad web:

### OWASP Top 10 (2025/2026)
- **Mitigación de Inyecciones (A03):** 
  - Prevención de XSS mediante Content Security Policy (CSP).
  - Sanitización de entradas y manipulación segura del DOM (evitando el uso de `innerHTML` con datos no confiables cuando sea posible).
- **Diseño Inseguro (A04):**
  - Implementación de un modelo de amenazas temprano.
  - El sistema de carga de PDFs (template) debe aislarse correctamente o cargarse de manera síncrona/segura para evitar manipulación (HTML Injection).
- **Fallas de Integridad de Datos y Software (A08):**
  - Uso de recursos externos con Integridad de Subrecursos (SRI -> `integrity` attr).

### Content Security Policy (CSP) Level 3
- Implementación de políticas estrictas mediante la cabecera / meta-tag `Content-Security-Policy`.
- Eliminación explícita de `script-src 'unsafe-inline'` en los HTML (como `index.html` y `contact.html`) para bloquear de raíz cualquier ejecución de script XSS inyectado.
- Protección contra ataques de Clickjacking usando la directiva `frame-ancestors 'none'`.

### W3C Security Best Practices (2026)
- **Formularios Seguros:** 
  - Validación fuerte en el lado del cliente usando atributos nativos de HTML5 (`required`, `pattern`, `minlength`, `maxlength`).
  - Protección de envío automático y mitigación de spoofing.
- **Aislamiento de Navegación:**
  - Enlaces externos (como GitHub, LinkedIn) deben usar explícitamente `rel="noopener noreferrer"` y `target="_blank"` para prevenir el ataque conocido como *Reverse Tabnabbing*.

---

## 2. Historial de Auditoría y Cambios de Seguridad (Marzo 2026)

Durante la última auditoría de seguridad preventiva en los puntos críticos de contacto del sitio (`index.html` y `contact.html`), se realizaron los siguientes parches:

1. **Hardening de CSP (index.html, contact.html):** 
   - Se removió el parámetro vulnerable `'unsafe-inline'` de la directiva `script-src`.
   - Se añadió la directiva `frame-ancestors 'none'` para bloquear iframe embedding (prevención de Clickjacking).
2. **Validación de Datos (contact.html):**
   - Endurecimiento del formulario: El input "Nombre Completo" ahora exige `minlength="2"` y `maxlength="100"`.
   - El input "Teléfono" ahora valida exclusivamente formatos telefónicos internacionales usando RegExp en el atributo `pattern="[\+0-9\s\-\(\)]+"`.
3. **Protección de Enlaces (index.html, contact.html):**
   - Corrección de la vulnerabilidad de tabnabbing en enlaces de pie de página (LinkedIn) añadiendo `target="_blank" rel="noopener noreferrer"`.

> *Nota:* Algunas páginas como `cost.html` / `template_pdf.html` mantienen configuraciones legacy que deben ser tratadas mediante servidor local o refactorización integral en el futuro para evitar bloqueos por CORS o dependencias de cdn de Tailwind sin SRI.
<IMPORTANTE: NO TOCAR EL TAILWIND DEL COST.HTML Y TEMPLATE_PDF.HTMl.>
---

## 3. Arquitectura del Proyecto y Escalabilidad

Para que la Landing Page sea escalable desde su stack inicial (Vanilla JS / Tailwind V4 / HTML) hacia infraestructuras más complejas (ej. integración con Next.js o microservicios), se deben mantener los siguientes principios:

### A. Estructura Modular del Cliente
- **Vanilla JS Engine:** El código JS debe mantenerse separado en *Engines* lógicos (ej. `cost-engine.js`, `contact-engine.js`, `shared-ui.js`). La lógica compartida se aísla, se exporta y se reutiliza.
- **Evitar la Contaminación del DOM:** Cualquier inyección o modificación del DOM debe ser predecible. Preferir la creación y ocultamiento de clases CSS (Tailwind) por sobre la inyección de largas cadenas HTML desde Javascript.

### B. UI / Estilos
- **Tailwind CLI:** Depender exclusivamente de la generación del archivo estático `./css/style.css` a través del proceso Build (`npm run build`). Se desaconseja totalmente el uso del CDN en runtime (`<script src="https://cdn.tailwindcss.com..."></script>`) en producción por motivos de rendimiento y latencia.
- **Estandarización:** Uso de variables CSS para el "Glass effect" y luces ambientales estandarizados (ej. `ambient-light`), los cuales no deben invadir el scope lógico del JS.
- **Diseño Responsivo (Mobile-First):** La implementación debe priorizar la experiencia en dispositivos móviles sin comprometer la estructura y legibilidad en resoluciones de escritorio. Se debe garantizar una navegación fluida y un rendimiento óptimo en ambas plataformas.

### C. Despliegue (Deployment) y Borde (Edge)
- **Metadatos y Prerenderizado:** Uso continuo de `<script type="speculationrules">` para mejorar LCP y precarga inteligente de rutas (Pre-rendering moderado).
- **Seguridad en Headers del Server:** En un entorno productivo como Netlify, la política de seguridad (CSP, HSTS `Strict-Transport-Security`, `X-Content-Type-Options`) debe pasarse de las meta-etiquetas locales al archivo `_headers` nativo del servidor para evitar mitigaciones del lado del cliente.
