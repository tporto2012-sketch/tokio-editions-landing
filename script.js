const CHECKOUT_URL = "https://pay.hotmart.com/C107288371W";

const allowedParams = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid"];
const incoming = new URLSearchParams(window.location.search);

document.querySelectorAll("[data-checkout]").forEach((link) => {
  const url = new URL(CHECKOUT_URL);
  allowedParams.forEach((name) => {
    const value = incoming.get(name);
    if (value) url.searchParams.set(name, value);
  });
  link.href = url.toString();
  link.addEventListener("click", () => {
    if (window.fbq) window.fbq("track", "InitiateCheckout");
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
    if (menuButton) menuButton.querySelector(".sr-only").textContent = "Abrir menu";
    navigation?.classList.remove("is-open");
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10%", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelector("#year").textContent = new Date().getFullYear();
