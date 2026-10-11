const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuLinks = mobileMenu?.querySelectorAll("a");
const stickyCta = document.querySelector("[data-mobile-sticky]");
const hero = document.querySelector("[data-hero]");
const catalog = document.querySelector("[data-catalog]");

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuLinks?.forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8%" },
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

let heroVisible = true;
let catalogReached = false;

function updateStickyCta() {
  if (!stickyCta) return;
  const visible = !heroVisible && !catalogReached;
  stickyCta.classList.toggle("is-visible", visible);
  stickyCta.setAttribute("aria-hidden", String(!visible));
  stickyCta.tabIndex = visible ? 0 : -1;
}

if (hero && catalog && stickyCta) {
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    updateStickyCta();
  }, { threshold: 0.08 }).observe(hero);

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) catalogReached = true;
    updateStickyCta();
  }, { threshold: 0.02 }).observe(catalog);
}

document.querySelectorAll(".faq details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq details[open]").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
