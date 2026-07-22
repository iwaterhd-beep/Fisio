(function () {
  "use strict";

  var DATA = window.acGetContent
    ? window.acGetContent()
    : { contact: {}, stats: {}, hours: [], services: [], team: [], reviews: [], faq: [] };
  var ICONS = window.AC_ICONS || {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function stars(n) {
    n = Math.max(0, Math.min(5, parseInt(n, 10) || 5));
    return new Array(n + 1).join("★");
  }

  /* ---------- Render servicios ---------- */
  var grid = document.getElementById("servicesGrid");
  if (grid) {
    grid.innerHTML = DATA.services.map(function (s) {
      return (
        '<article class="service-card reveal">' +
          '<span class="service-card__icon">' +
            '<svg viewBox="0 0 24 24" width="24" height="24">' + (ICONS[s.i] || ICONS.pulse) + "</svg>" +
          "</span>" +
          '<h3 class="service-card__title">' + esc(s.t) + "</h3>" +
          '<p class="service-card__text">' + esc(s.d) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------- Render opiniones ---------- */
  var reviewsGrid = document.getElementById("reviewsGrid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML = DATA.reviews.map(function (r) {
      return (
        '<article class="review reveal">' +
          '<div class="review__stars">' + stars(r.stars) + "</div>" +
          '<p class="review__text">"' + esc(r.text) + '"</p>' +
          '<div class="review__author">' +
            '<span class="review__avatar">' + esc(r.initial || (r.name || "?").charAt(0)) + "</span>" +
            "<div><strong>" + esc(r.name) + "</strong><span>" + esc(r.meta) + "</span></div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------- Render equipo ---------- */
  var teamGrid = document.getElementById("teamGrid");
  if (teamGrid) {
    teamGrid.innerHTML = DATA.team.map(function (m) {
      var tags = (m.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      return (
        '<article class="team-card reveal">' +
          '<div class="team-card__avatar"><span>' + esc(m.initial || (m.name || "?").charAt(0)) + "</span></div>" +
          '<h3 class="team-card__name">' + esc(m.name) + "</h3>" +
          '<span class="team-card__role">' + esc(m.role) + "</span>" +
          '<p class="team-card__bio">' + esc(m.bio) + "</p>" +
          '<ul class="team-card__tags">' + tags + "</ul>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------- Render FAQ ---------- */
  var faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = DATA.faq.map(function (f) {
      return (
        '<details class="faq__item">' +
          "<summary>" + esc(f.q) + "</summary>" +
          '<div class="faq__answer"><p>' + esc(f.a) + "</p></div>" +
        "</details>"
      );
    }).join("");
  }

  /* ---------- Render galería ---------- */
  var galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    galleryGrid.innerHTML = DATA.gallery.map(function (g) {
      var sizeClass = g.size === "lg" ? " gallery__item--lg" : (g.size === "wide" ? " gallery__item--wide" : "");
      var cap = g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "";
      return (
        '<figure class="gallery__item' + sizeClass + ' reveal">' +
          '<img src="' + esc(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy" />' +
          cap +
        "</figure>"
      );
    }).join("");
  }

  /* ---------- Enlazar datos de contacto ---------- */
  var c = DATA.contact || {};
  function setText(key, value) {
    document.querySelectorAll('[data-bind="' + key + '"]').forEach(function (el) {
      el.textContent = value;
    });
  }
  if (c.phoneRaw) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) { a.href = "tel:" + c.phoneRaw; });
  }
  if (c.whatsapp) {
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      if (a.getAttribute("href").indexOf("?text=") === -1) a.href = "https://wa.me/" + c.whatsapp;
    });
  }
  if (c.email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { a.href = "mailto:" + c.email; });
  }
  setText("phoneDisplay", c.phoneDisplay);
  setText("phoneIntl", c.phoneIntl);
  setText("email", c.email);
  setText("address", c.address);
  setText("city", c.city);

  /* ---------- Redes sociales ---------- */
  if (c.instagram) {
    document.querySelectorAll('[data-social="instagram"]').forEach(function (a) { a.href = c.instagram; });
  }
  if (c.facebook) {
    document.querySelectorAll('[data-social="facebook"]').forEach(function (a) { a.href = c.facebook; });
  }

  /* ---------- Imágenes (hero, clínica) ---------- */
  var imgs = DATA.images || {};
  Object.keys(imgs).forEach(function (k) {
    if (!imgs[k]) return;
    document.querySelectorAll('[data-img="' + k + '"]').forEach(function (el) { el.src = imgs[k]; });
  });

  /* ---------- Estadísticas ---------- */
  var st = DATA.stats || {};
  setText("rating", st.rating);
  setText("ratingStar", st.rating + "★");
  setText("reviewsCount", st.reviewsCount);
  setText("reviewsLine", st.reviewsCount + " reseñas en Google");
  setText("reviewsCta", "Ver las " + st.reviewsCount + " opiniones en Google");

  /* ---------- Horario (pie de página) ---------- */
  if (Array.isArray(DATA.hours) && DATA.hours.length) {
    document.querySelectorAll('[data-bind="hours"]').forEach(function (ul) {
      ul.innerHTML = DATA.hours.map(function (h) {
        return "<li><span>" + esc(h.d) + "</span><span>" + esc(h.h) + "</span></li>";
      }).join("");
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.prototype.slice.call(
              el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : []
            );
            var pos = siblings.indexOf(el);
            el.style.transitionDelay = (pos > 0 ? pos * 0.07 : 0) + "s";
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var close = function () {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  /* ---------- Formulario de cita -> WhatsApp ---------- */
  var WHATSAPP_NUMBER = c.whatsapp || "34664685266";
  var serviceSelect = document.getElementById("bf-service");
  if (serviceSelect) {
    DATA.services.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.t;
      opt.textContent = s.t;
      serviceSelect.appendChild(opt);
    });
    var other = document.createElement("option");
    other.value = "Otra consulta";
    other.textContent = "Otra consulta";
    serviceSelect.appendChild(other);
  }

  var form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("bf-name");
      var phone = document.getElementById("bf-phone");
      var service = document.getElementById("bf-service");
      var message = document.getElementById("bf-message");

      var valid = true;
      [name, phone].forEach(function (el) {
        if (!el.value.trim()) { el.classList.add("invalid"); valid = false; }
        else { el.classList.remove("invalid"); }
      });
      if (!valid) { name.value.trim() ? phone.focus() : name.focus(); return; }

      var lines = [
        "¡Hola! Me gustaría pedir una cita en AC Fisioterapia Avanzada.",
        "",
        "Nombre: " + name.value.trim(),
        "Teléfono: " + phone.value.trim(),
      ];
      if (service && service.value) lines.push("Motivo: " + service.value);
      if (message && message.value.trim()) lines.push("Comentario: " + message.value.trim());

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });

    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("invalid"); });
    });
  }

  /* ---------- Banner de cookies ---------- */
  var cookies = document.getElementById("cookies");
  if (cookies) {
    var stored = null;
    try { stored = localStorage.getItem("ac_cookies"); } catch (e) {}
    var setChoice = function (value) {
      try { localStorage.setItem("ac_cookies", value); } catch (e) {}
      cookies.classList.remove("is-visible");
      setTimeout(function () { cookies.hidden = true; }, 500);
    };
    if (!stored) {
      cookies.hidden = false;
      setTimeout(function () { cookies.classList.add("is-visible"); }, 900);
      var accept = document.getElementById("cookiesAccept");
      var reject = document.getElementById("cookiesReject");
      if (accept) accept.addEventListener("click", function () { setChoice("accepted"); });
      if (reject) reject.addEventListener("click", function () { setChoice("rejected"); });
    }
  }

  /* ---------- Año footer ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
