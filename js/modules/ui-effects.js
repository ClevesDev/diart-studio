/**
 * @file ui-effects.js
 * @description Módulo para inicializar efectos de UI decorativos (Carruseles secundarios y animaciones Matrix)
 * Respetando CSP Level 3 y sin sacrificar Main Thread performance.
 */

export class SecurityMicroCarousel {
    #slides;
    #currentIndex = 0;
    #intervalId = null;

    constructor(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.#slides = Array.from(container.querySelectorAll('[data-sec-slide]'));
        if (this.#slides.length === 0) return;

        this.#startAutoPlay();
    }

    #goToSlide(index) {
        const currentSlide = this.#slides[this.#currentIndex];
        currentSlide.classList.remove('opacity-100');
        currentSlide.classList.add('opacity-0');
        currentSlide.setAttribute('aria-hidden', 'true');

        this.#currentIndex = index;

        const nextSlide = this.#slides[this.#currentIndex];
        nextSlide.classList.remove('opacity-0');
        nextSlide.classList.add('opacity-100');
        nextSlide.setAttribute('aria-hidden', 'false');
    }

    #startAutoPlay() {
        this.#intervalId = setInterval(() => {
            const nextIndex = (this.#currentIndex + 1) % this.#slides.length;
            this.#goToSlide(nextIndex);
        }, 3000); // Transitions every 3 seconds
    }
}

// We can remove EdgeMatrixEffect since the user requested a pure CSS scrolling text effect
// for the "deploy logs" simulation to save CPU/JS execution time.

export function initUIEffects() {
    // Start Security Card Secondary Carousel
    new SecurityMicroCarousel('security-carousel');
    
    // Start Edge Optimization Card Secondary Carousel
    new SecurityMicroCarousel('edge-carousel');
}
