(() => {
  "use strict";

  const config = window.ESCALA_CERO_CONFIG || {};
  const consentKey = "tokio-editions-analytics-consent";
  const panel = document.querySelector("#cookie-panel");
  const status = document.querySelector("#checkout-status");
  const campaignParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  let analyticsLoaded = false;

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const isConfigured = (value, placeholder) => Boolean(value && value !== placeholder);

  const buildCheckoutUrl = () => {
    const checkoutUrl = new URL(config.checkoutUrl);
    const landingParameters = new URLSearchParams(window.location.search);

    campaignParameters.forEach((name) => {
      const value = landingParameters.get(name);
      if (value) checkoutUrl.searchParams.set(name, value.slice(0, 200));
    });

    return checkoutUrl.toString();
  };

  document.querySelectorAll(".checkout-link").forEach((link) => {
    if (isConfigured(config.checkoutUrl, "CHECKOUT_HOTMART_PENDIENTE")) {
      link.href = buildCheckoutUrl();
      link.rel = "noopener sponsored";
      link.addEventListener("click", () => {
        if (typeof window.fbq === "function") {
          window.fbq("track", "InitiateCheckout", {
            content_name: "Escala Cero",
            content_ids: ["escala-cero-es-latam"],
            content_type: "product",
            value: 8.90,
            currency: "USD"
          });
        }
        if (typeof window.gtag === "function") {
          window.gtag("event", "begin_checkout", {
            currency: "USD",
            value: 8.90,
            items: [{ item_id: "escala-cero-es-latam", item_name: "Escala Cero" }]
          });
        }
      });
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#oferta")?.scrollIntoView({ behavior: "smooth" });
      if (status) status.textContent = "El checkout se conectará aquí antes de publicar la página.";
    });
  });

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    if (isConfigured(config.ga4MeasurementId, "GA4_ID_PENDIENTE")) {
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`;
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", config.ga4MeasurementId, { anonymize_ip: true });
    }

    if (isConfigured(config.metaPixelId, "META_PIXEL_ID_PENDIENTE")) {
      const fbq = function fbq() { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      window.fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      const meta = document.createElement("script");
      meta.async = true;
      meta.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(meta);
      fbq("init", config.metaPixelId);
      fbq("track", "PageView");
      fbq("track", "ViewContent", {
        content_name: "Escala Cero",
        content_ids: ["escala-cero-es-latam"],
        content_type: "product",
        value: 8.90,
        currency: "USD"
      });
    }
  };

  const applyConsent = (choice) => {
    localStorage.setItem(consentKey, choice);
    if (panel) panel.hidden = true;
    if (choice === "accepted") loadAnalytics();
  };

  document.querySelectorAll("[data-cookie]").forEach((button) => {
    button.addEventListener("click", () => applyConsent(button.dataset.cookie === "accept" ? "accepted" : "rejected"));
  });

  document.querySelector("#cookie-preferences")?.addEventListener("click", () => {
    if (!panel) return;
    panel.hidden = false;
    panel.querySelector("button")?.focus();
  });

  const savedConsent = localStorage.getItem(consentKey);
  if (savedConsent === "accepted") loadAnalytics();
  if (!savedConsent && panel) panel.hidden = false;
})();
