/**
 * Reusable Intersection Observer utility
 * @param {Object} options - Configuration options
 * @param {string|NodeList|Element|Element[]} options.target - Element(s) to observe
 * @param {Function} options.onIntersect - Callback when element intersects
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.root - Root element selector (null for viewport)
 * @param {string} options.rootMargin - Root margin (e.g., "0px 0px -100px 0px")
 * @param {boolean} options.once - Unobserve after first intersection
 * @returns {IntersectionObserver} - The observer instance
 */
function createIntersectionObserver(options = {}) {
  const {
    target,
    onIntersect,
    threshold = 0,
    root = null,
    rootMargin = '0px',
    once = false
  } = options;

  if (typeof onIntersect !== 'function') {
    throw new Error('onIntersect callback is required and must be a function');
  }

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      onIntersect(entry, observerInstance);
      
      if (once && entry.isIntersecting) {
        observerInstance.unobserve(entry.target);
      }
    });
  }, {
    root: root ? document.querySelector(root) : null,
    rootMargin,
    threshold
  });

  if (target) {
    const elements = getElements(target);
    elements.forEach(el => observer.observe(el));
  }

  return observer;
}

/**
 * Helper function untuk mendapatkan elements
 */
function getElements(target) {
  if (typeof target === 'string') {
    return document.querySelectorAll(target);
  } else if (target instanceof NodeList) {
    return Array.from(target);
  } else if (target instanceof Element) {
    return [target];
  } else if (Array.isArray(target)) {
    return target;
  }
  return [];
}