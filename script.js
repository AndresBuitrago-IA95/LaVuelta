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

const cartItems = new Map();
const cartList = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const cartStatus = document.querySelector("#cart-status");
const cartCheckout = document.querySelector("#cart-checkout");
const formatPrice = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function renderCart() {
  if (!cartList || !cartEmpty || !cartCount || !cartTotal || !cartCheckout) return;

  cartList.replaceChildren();
  let itemCount = 0;
  let total = 0;

  cartItems.forEach((item) => {
    itemCount += item.quantity;
    total += item.price * item.quantity;

    const row = document.createElement("li");
    row.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-item-details";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const price = document.createElement("span");
    price.textContent = `${formatPrice.format(item.price)} c/u`;
    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Quitar una unidad de ${item.name}`);
    decrease.addEventListener("click", () => changeQuantity(item.name, -1));

    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    quantity.setAttribute("aria-label", `Cantidad: ${item.quantity}`);

    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Agregar una unidad de ${item.name}`);
    increase.addEventListener("click", () => changeQuantity(item.name, 1));
    controls.append(decrease, quantity, increase);
    row.append(details, controls);
    cartList.append(row);
  });

  cartEmpty.hidden = itemCount > 0;
  cartList.hidden = itemCount === 0;
  cartCount.textContent = String(itemCount);
  cartTotal.textContent = formatPrice.format(total);
  cartCheckout.disabled = itemCount === 0;
}

function changeQuantity(name, amount) {
  const item = cartItems.get(name);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) cartItems.delete(name);
  renderCart();
  if (cartStatus) cartStatus.textContent = `${name} actualizado en tu carrito.`;
}

document.querySelectorAll("[data-cart-product]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.cartProduct;
    const price = Number(button.dataset.cartPrice);
    if (!name || !Number.isSafeInteger(price) || price <= 0) {
      console.error("No se pudo agregar el producto: faltan datos válidos de nombre o precio.", button);
      return;
    }

    const item = cartItems.get(name);
    if (item) {
      item.quantity += 1;
    } else {
      cartItems.set(name, { name, price, quantity: 1 });
    }

    renderCart();
    if (cartStatus) cartStatus.textContent = `${name} agregado al carrito.`;
  });
});

if (cartCheckout) {
  cartCheckout.addEventListener("click", () => {
    if (cartItems.size === 0) return;

    const orderLines = Array.from(cartItems.values(), (item) =>
      `• ${item.quantity} x ${item.name} — ${formatPrice.format(item.price * item.quantity)}`,
    );
    const total = Array.from(cartItems.values()).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const message = [
      "Hola La Vuelta, quiero hacer este pedido:",
      "",
      ...orderLines,
      "",
      `Total: ${formatPrice.format(total)}`,
    ].join("\n");
    const url = `https://wa.me/573128503095?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

renderCart();

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
