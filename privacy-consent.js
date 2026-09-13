(function () {
  "use strict";

  const config = window.TOKIO_PRIVACY || {};
  const storageKey = "tokio_cookie_consent_v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let consent = readConsent();
  let pixelLoaded = false;

  function readConsent() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || !["accepted", "rejected"].includes(saved.value)) return null;
      if (Date.now() - saved.savedAt > lifetime) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return saved.value;
    } catch (_error) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ value, savedAt: Date.now() }));
    } catch (_error) {
      // A escolha ainda vale durante esta visita quando o armazenamento está bloqueado.
    }
  }

  function loadMetaPixel() {
    if (pixelLoaded || !config.metaPixelId || consent !== "accepted") return;
    pixelLoaded = true;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", String(config.metaPixelId));
    window.fbq("track", "PageView");

    if (config.viewContent) {
      window.fbq("track", "ViewContent", config.viewContent);
    }
  }

  function removeMetaCookies() {
    ["_fbp", "_fbc"].forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.tokioeditions.com; SameSite=Lax`;
    });
  }

  function closeBanner() {
    document.querySelector(".privacy-banner")?.remove();
  }

  function choose(value) {
    const wasAccepted = consent === "accepted";
    consent = value;
    writeConsent(value);
    closeBanner();

    if (value === "accepted") {
      loadMetaPixel();
    } else {
      removeMetaCookies();
      if (wasAccepted) window.location.reload();
    }
  }

  function showBanner() {
    closeBanner();

    const banner = document.createElement("section");
    banner.className = "privacy-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Preferências de privacidade");
    banner.innerHTML = `
      <div class="privacy-banner__copy">
        <strong>Você escolhe como seus dados são usados.</strong>
        <p>Usamos o Meta Pixel somente com sua autorização para medir visitas e compras desta campanha. Recusar não limita o acesso ao conteúdo.</p>
        <a href="privacidade.html">Ler a Política de Privacidade</a>
      </div>
      <div class="privacy-banner__actions">
        <button type="button" data-consent="rejected">Recusar</button>
        <button type="button" class="privacy-banner__accept" data-consent="accepted">Aceitar</button>
      </div>`;

    banner.querySelectorAll("[data-consent]").forEach((button) => {
      button.addEventListener("click", () => choose(button.dataset.consent));
    });

    document.body.appendChild(banner);
    banner.querySelector("[data-consent='rejected']")?.focus();
  }

  window.tokioTracking = {
    getConsent: () => consent,
    track: function (eventName, parameters, options) {
      if (consent !== "accepted" || typeof window.fbq !== "function") return false;
      window.fbq((options && options.custom) ? "trackCustom" : "track", eventName, parameters || {});
      return true;
    },
    openPreferences: showBanner,
  };

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
    button.addEventListener("click", showBanner);
  });

  if (consent === "accepted") loadMetaPixel();
  if (!consent) showBanner();
})();
