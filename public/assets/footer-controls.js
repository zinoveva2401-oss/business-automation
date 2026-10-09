const footer = document.querySelector('.site-footer');

if (footer && 'IntersectionObserver' in window) {
  const floatingControls = document.querySelectorAll('.mobile-action, .back-top');
  new IntersectionObserver(([entry]) => {
    floatingControls.forEach(control => control.classList.toggle('is-footer-visible', entry.isIntersecting));
  }, { threshold: 0 }).observe(footer);
}
