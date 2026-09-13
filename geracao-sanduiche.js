const CHECKOUT_URL = "https://pay.hotmart.com/S107588415M";
const CAMPAIGN_PARAMETERS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function buildCheckoutUrl() {
  const checkoutUrl = new URL(CHECKOUT_URL);
  const landingParameters = new URLSearchParams(window.location.search);

  CAMPAIGN_PARAMETERS.forEach((name) => {
    const value = landingParameters.get(name);
    if (value) checkoutUrl.searchParams.set(name, value.slice(0, 200));
  });

  return checkoutUrl.toString();
}

document.querySelectorAll("[data-checkout]").forEach((link) => {
  link.href = buildCheckoutUrl();
  link.addEventListener("click", () => {
    window.tokioTracking?.track(
      "CheckoutClick",
      {
        content_name: "Geração Sanduíche",
        content_ids: ["geracao-sanduiche"],
        content_type: "product",
        value: 19.90,
        currency: "BRL",
      },
      { custom: true }
    );
  });
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen ? "Abrir menu" : "Fechar menu";
  navigation?.classList.toggle("is-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".sr-only").textContent = "Abrir menu";
    navigation.classList.remove("is-open");
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelector("#year").textContent = new Date().getFullYear();
