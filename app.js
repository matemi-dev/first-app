// Quali Consultora — interacciones de la landing
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav__link");

  // ---------- Menú móvil ----------
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // ---------- Sombra del header al hacer scroll ----------
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Link activo según la sección visible + animaciones ----------
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => sectionObserver.observe(s));

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- Formulario de contacto (mailto, sin backend) ----------
  const form = document.getElementById("contactForm");
  const errorBox = document.getElementById("formError");
  const DESTINO = "info@quali.com.ar";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const campos = {
      nombre: form.nombre,
      email: form.email,
      mensaje: form.mensaje,
    };
    const invalidos = Object.values(campos).filter((input) => !input.checkValidity() || !input.value.trim());

    Object.values(campos).forEach((input) => input.classList.toggle("is-invalid", invalidos.includes(input)));

    if (invalidos.length) {
      errorBox.textContent = "Por favor completá nombre, un email válido y tu mensaje.";
      errorBox.hidden = false;
      invalidos[0].focus();
      return;
    }
    errorBox.hidden = true;

    const empresa = form.empresa.value.trim();
    const asunto = "Consulta web" + (empresa ? " - " + empresa : "");
    const cuerpo =
      "Nombre: " + campos.nombre.value.trim() + "\n" +
      (empresa ? "Empresa: " + empresa + "\n" : "") +
      "Email: " + campos.email.value.trim() + "\n\n" +
      campos.mensaje.value.trim();

    window.location.href =
      "mailto:" + DESTINO +
      "?subject=" + encodeURIComponent(asunto) +
      "&body=" + encodeURIComponent(cuerpo);
  });

  // ---------- Año del footer ----------
  document.getElementById("year").textContent = new Date().getFullYear();
})();
