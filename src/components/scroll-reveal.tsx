'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll<HTMLElement>(
      'main > section:not(.hero) .section-heading, main > section .experience-heading, ' +
      '.intro-grid > div, .schedule-layout, .activity-item, .experience-photo, ' +
      '.pickleball-layout > *, .handbook-grid > *, .faq-layout > *, ' +
      '.destination-content, .closing-section .container',
    );
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });

    elements.forEach(element => {
      // Keep content already visible on initial load or at an anchor readable.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });

    const showAll = () => {
      if (motion.matches) {
        observer.disconnect();
        elements.forEach(element => element.classList.add('is-revealed'));
      }
    };
    motion.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', showAll);
      elements.forEach(element => element.classList.remove('scroll-reveal', 'is-revealed'));
    };
  }, []);

  return null;
}
