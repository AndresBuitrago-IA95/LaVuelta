const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  siteNav.classList.remove("is-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll("[data-product]").forEach((link) => {
  const product = link.dataset.product;
  const message = `Hola La Vuelta, quiero pedir ${product}.`;
  link.href = `https://wa.me/573128503095?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const brandVideo = document.querySelector("#brand-video");
const videoFallback = document.querySelector("#video-fallback");

if (brandVideo && videoFallback) {
  if (window.location.protocol === "file:") {
    videoFallback.textContent = "El navegador bloquea la reproducción de video en archivos locales. Abre el sitio desde un servidor local, por ejemplo Live Server en VS Code.";
    videoFallback.hidden = false;
  }

  brandVideo.addEventListener("error", () => {
    videoFallback.hidden = false;
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());
