/**
 * @file bento-carousel.js
 * @description Motor de carrusel optimizado para DOM sin inyecciones inseguras.
 * Diseñado para la visualización de proyectos Flutter en el Bento Grid.
 */

export class BentoCarousel {
    #slides;
    #indicators;
    #currentIndex = 0;
    #intervalId = null;
    #duration = 4000;
    #container;

    constructor(containerSelector) {
        this.#container = document.querySelector(containerSelector);
        if (!this.#container) return;

        // Búsqueda segura de elementos sin innerHTML/XSS risks
        this.#slides = Array.from(this.#container.querySelectorAll('[data-carousel-slide]'));
        this.#indicators = Array.from(this.#container.querySelectorAll('[data-carousel-indicator]'));

        if (this.#slides.length === 0) return;

        this.#initEvents();
        this.#startAutoPlay();
    }

    #initEvents() {
        // Pausar en hover (Accesibilidad/UX)
        this.#container.addEventListener('mouseenter', () => this.#stopAutoPlay());
        this.#container.addEventListener('mouseleave', () => this.#startAutoPlay());

        // Controles de indicadores
        this.#indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.#goToSlide(index);
                // Reiniciar el timer en interacción manual
                this.#stopAutoPlay();
                this.#startAutoPlay();
            });
        });

        // Controles de teclado
        this.#container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.#prev();
            } else if (e.key === 'ArrowRight') {
                this.#next();
            }
        });
    }

    #goToSlide(index) {
        // Validación de rango
        if (index < 0 || index >= this.#slides.length) return;

        // Ocultar actual
        const currentSlide = this.#slides[this.#currentIndex];
        const currentIndicator = this.#indicators[this.#currentIndex];
        
        currentSlide.classList.remove('opacity-100', 'scale-100', 'z-10');
        currentSlide.classList.add('opacity-0', 'scale-95', 'z-0');
        currentSlide.setAttribute('aria-hidden', 'true');
        
        if (currentIndicator) {
             currentIndicator.classList.remove('bg-primary', 'w-6');
             currentIndicator.classList.add('bg-white/30', 'w-2');
        }

        // Actualizar índice
        this.#currentIndex = index;

        // Mostrar nuevo
        const nextSlide = this.#slides[this.#currentIndex];
        const nextIndicator = this.#indicators[this.#currentIndex];

        nextSlide.classList.remove('opacity-0', 'scale-95', 'z-0');
        nextSlide.classList.add('opacity-100', 'scale-100', 'z-10');
        nextSlide.setAttribute('aria-hidden', 'false');

        if (nextIndicator) {
             nextIndicator.classList.remove('bg-white/30', 'w-2');
             nextIndicator.classList.add('bg-primary', 'w-6');
        }
    }

    #next() {
        const nextIndex = (this.#currentIndex + 1) % this.#slides.length;
        this.#goToSlide(nextIndex);
    }

    #prev() {
        const prevIndex = (this.#currentIndex - 1 + this.#slides.length) % this.#slides.length;
        this.#goToSlide(prevIndex);
    }

    #startAutoPlay() {
        if (this.#intervalId) return;
        this.#intervalId = setInterval(() => this.#next(), this.#duration);
    }

    #stopAutoPlay() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    /**
     * Limpieza de memoria si el componente se destruye en un SPA context
     */
    destroy() {
        this.#stopAutoPlay();
        // Event listeners en el container se limpiarían si se elimina el propio nodo DOM, 
        // pero en este caso estático es suficiente con detener el timer.
    }
}
