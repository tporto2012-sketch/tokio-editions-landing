(() => {
  const META_PIXEL_ID = '1375226887389900';
  const consentKey = 'tokio_editions_analytics_consent';
  const banner = document.querySelector('#cookie-banner');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox?.querySelector('img');

  document.querySelector('#year').textContent = new Date().getFullYear();

  function loadMetaPixel() {
    if (window.fbq) return;
    const fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: 'Escala Zero', content_category: 'ebook', value: 19.90, currency: 'BRL' });
  }

  const consent = localStorage.getItem(consentKey);
  if (consent === 'accepted') loadMetaPixel();
  else if (!consent) banner.hidden = false;

  banner?.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-consent]')?.dataset.consent;
    if (!choice) return;
    localStorage.setItem(consentKey, choice === 'accept' ? 'accepted' : 'rejected');
    banner.hidden = true;
    if (choice === 'accept') loadMetaPixel();
  });

  document.querySelectorAll('.checkout-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: 'Escala Zero', platform: link.dataset.platform, value: 19.90, currency: 'BRL' });
    });
  });

  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = button.dataset.alt;
      lightbox.showModal();
    });
  });
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
})();
