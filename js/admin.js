(function () {
  "use strict";

  /* Contraseña del panel (acceso local, no es seguridad real). Cámbiala aquí. */
  var PASSWORD = "ac-admin";
  var AUTH_KEY = "ac_admin_auth";

  var ICONS = window.AC_ICONS || {};

  /* ---------- Utilidades ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function escHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escAttr(s) {
    return escHtml(s).replace(/"/g, "&quot;");
  }

  /* Redimensiona y comprime una imagen a un data URL ligero */
  function resizeImage(file, maxW, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxW / img.width);
        var w = Math.round(img.width * scale);
        var h = Math.round(img.height * scale);
        var canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        var out;
        try {
          out = canvas.toDataURL("image/webp", 0.82);
          if (out.indexOf("image/webp") === -1) out = canvas.toDataURL("image/jpeg", 0.85);
        } catch (e) {
          out = canvas.toDataURL("image/jpeg", 0.85);
        }
        cb(out);
      };
      img.onerror = function () { toast("No se pudo leer la imagen"); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  var dirty = false;
  function setDirty(v) {
    dirty = v;
    $("#saveBar").classList.toggle("is-visible", v);
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2400);
  }

  /* ---------- Login ---------- */
  function isAuthed() {
    try { return sessionStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; }
  }
  function showApp() {
    $("#loginWrap").style.display = "none";
    var app = $("#admin");
    app.classList.add("is-auth");
    render();
  }
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var pwd = $("#pwd").value;
    if (pwd === PASSWORD) {
      try { sessionStorage.setItem(AUTH_KEY, "1"); } catch (er) {}
      showApp();
    } else {
      $("#loginError").textContent = "Contraseña incorrecta.";
      $("#pwd").value = "";
      $("#pwd").focus();
    }
  });
  $("#logoutBtn").addEventListener("click", function () {
    try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {}
    location.reload();
  });

  /* ---------- Pestañas ---------- */
  $("#tabs").addEventListener("click", function (e) {
    var btn = e.target.closest(".admin-tab");
    if (!btn) return;
    var tab = btn.getAttribute("data-tab");
    $all(".admin-tab").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
    $all(".admin-panel").forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === tab);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Plantillas de items ---------- */
  function itemBar(title) {
    return (
      '<div class="item__bar">' +
        '<span class="item__title">' + escHtml(title) + "</span>" +
        '<div class="item__tools">' +
          '<button type="button" class="icon-btn" data-move="up" title="Subir">↑</button>' +
          '<button type="button" class="icon-btn" data-move="down" title="Bajar">↓</button>' +
          '<button type="button" class="icon-btn icon-btn--danger" data-remove title="Eliminar">✕</button>' +
        "</div>" +
      "</div>"
    );
  }
  function iconOptions(sel) {
    return Object.keys(ICONS).map(function (k) {
      return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + k + "</option>";
    }).join("");
  }
  function iconSvg(key) {
    return '<svg viewBox="0 0 24 24" width="22" height="22">' + (ICONS[key] || ICONS.pulse) + "</svg>";
  }

  function tplHours(h) {
    h = h || { d: "", h: "" };
    return (
      '<div class="item" data-type="hours">' +
        itemBar("Día") +
        '<div class="grid-2">' +
          '<div class="field"><label>Día</label><input type="text" data-field="d" value="' + escAttr(h.d) + '" /></div>' +
          '<div class="field"><label>Horario</label><input type="text" data-field="h" value="' + escAttr(h.h) + '" /></div>' +
        "</div>" +
      "</div>"
    );
  }
  function tplService(s) {
    s = s || { t: "", d: "", i: "pulse" };
    return (
      '<div class="item" data-type="services">' +
        itemBar(s.t || "Servicio") +
        '<div class="field"><label>Título</label><input type="text" data-field="t" value="' + escAttr(s.t) + '" /></div>' +
        '<div class="field"><label>Descripción</label><textarea data-field="d">' + escHtml(s.d) + "</textarea></div>" +
        '<div class="field"><label>Icono</label>' +
          '<div class="icon-row">' +
            '<span class="icon-preview">' + iconSvg(s.i) + "</span>" +
            '<select data-field="i" class="js-icon">' + iconOptions(s.i) + "</select>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }
  function tplTeam(m) {
    m = m || { initial: "", name: "", role: "", bio: "", tags: [] };
    var tags = (m.tags || []).join(", ");
    return (
      '<div class="item" data-type="team">' +
        itemBar(m.name || "Miembro") +
        '<div class="grid-2">' +
          '<div class="field"><label>Inicial (avatar)</label><input type="text" data-field="initial" maxlength="2" value="' + escAttr(m.initial) + '" /></div>' +
          '<div class="field"><label>Nombre</label><input type="text" data-field="name" value="' + escAttr(m.name) + '" /></div>' +
        "</div>" +
        '<div class="field"><label>Rol</label><input type="text" data-field="role" value="' + escAttr(m.role) + '" /></div>' +
        '<div class="field"><label>Biografía</label><textarea data-field="bio">' + escHtml(m.bio) + "</textarea></div>" +
        '<div class="field"><label>Etiquetas (separadas por comas)</label><input type="text" data-field="tags" value="' + escAttr(tags) + '" /></div>' +
      "</div>"
    );
  }
  function tplReview(r) {
    r = r || { initial: "", name: "", meta: "", stars: 5, text: "" };
    var starsOpts = [5, 4, 3, 2, 1].map(function (n) {
      return '<option value="' + n + '"' + (n === (parseInt(r.stars, 10) || 5) ? " selected" : "") + ">" + n + " ★</option>";
    }).join("");
    return (
      '<div class="item" data-type="reviews">' +
        itemBar(r.name || "Opinión") +
        '<div class="grid-2">' +
          '<div class="field"><label>Inicial (avatar)</label><input type="text" data-field="initial" maxlength="2" value="' + escAttr(r.initial) + '" /></div>' +
          '<div class="field"><label>Nombre</label><input type="text" data-field="name" value="' + escAttr(r.name) + '" /></div>' +
          '<div class="field"><label>Detalle (p. ej. "Hace 3 meses")</label><input type="text" data-field="meta" value="' + escAttr(r.meta) + '" /></div>' +
          '<div class="field"><label>Estrellas</label><select data-field="stars">' + starsOpts + "</select></div>" +
        "</div>" +
        '<div class="field"><label>Texto</label><textarea data-field="text">' + escHtml(r.text) + "</textarea></div>" +
      "</div>"
    );
  }
  function tplFaq(f) {
    f = f || { q: "", a: "" };
    return (
      '<div class="item" data-type="faq">' +
        itemBar(f.q || "Pregunta") +
        '<div class="field"><label>Pregunta</label><input type="text" data-field="q" value="' + escAttr(f.q) + '" /></div>' +
        '<div class="field"><label>Respuesta</label><textarea data-field="a">' + escHtml(f.a) + "</textarea></div>" +
      "</div>"
    );
  }

  function sizeOpts(sel) {
    var opts = [["", "Normal"], ["lg", "Grande (vertical)"], ["wide", "Ancha (horizontal)"]];
    return opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === (sel || "") ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("");
  }
  function tplGallery(g) {
    g = g || { src: "", caption: "", size: "" };
    return (
      '<div class="item" data-type="gallery" data-maxw="1000">' +
        itemBar(g.caption || "Foto") +
        '<div class="img-preview"><img src="' + escAttr(g.src) + '" alt="" /></div>' +
        '<div class="field"><label>URL de la imagen</label><input type="text" data-field="src" value="' + escAttr(g.src) + '" /></div>' +
        '<div class="img-edit__actions" style="margin-bottom:12px"><button type="button" class="btn btn--outline btn--sm" data-upload>Subir imagen…</button><input type="file" accept="image/*" hidden /></div>' +
        '<div class="grid-2">' +
          '<div class="field"><label>Pie de foto</label><input type="text" data-field="caption" value="' + escAttr(g.caption) + '" /></div>' +
          '<div class="field"><label>Tamaño</label><select data-field="size">' + sizeOpts(g.size) + "</select></div>" +
        "</div>" +
      "</div>"
    );
  }
  function imgEditor(src, maxW) {
    return (
      '<div class="img-edit" data-maxw="' + maxW + '">' +
        '<div class="img-preview"><img src="' + escAttr(src) + '" alt="" /></div>' +
        '<div class="img-edit__fields">' +
          '<div class="field"><label>URL de la imagen</label><input type="text" data-imgfield="src" value="' + escAttr(src) + '" /></div>' +
          '<div class="img-edit__actions"><button type="button" class="btn btn--outline btn--sm" data-upload>Subir imagen…</button><input type="file" accept="image/*" hidden /></div>' +
        "</div>" +
      "</div>"
    );
  }

  var TEMPLATES = { hours: tplHours, services: tplService, team: tplTeam, reviews: tplReview, faq: tplFaq, gallery: tplGallery };
  var LISTS = {
    hours: "#hoursList",
    services: "#servicesList",
    team: "#teamList",
    reviews: "#reviewsList",
    faq: "#faqList",
    gallery: "#galleryList",
  };

  /* ---------- Render ---------- */
  function renderList(type, arr) {
    var tpl = TEMPLATES[type];
    $(LISTS[type]).innerHTML = (arr || []).map(tpl).join("");
  }
  function render() {
    var data = window.acGetContent();
    // Contacto
    var c = data.contact;
    $("#ac-phoneDisplay").value = c.phoneDisplay || "";
    $("#ac-phoneIntl").value = c.phoneIntl || "";
    $("#ac-phoneRaw").value = c.phoneRaw || "";
    $("#ac-whatsapp").value = c.whatsapp || "";
    $("#ac-email").value = c.email || "";
    $("#ac-address").value = c.address || "";
    $("#ac-city").value = c.city || "";
    $("#ac-instagram").value = c.instagram || "";
    $("#ac-facebook").value = c.facebook || "";
    // Stats
    $("#ac-rating").value = data.stats.rating || "";
    $("#ac-reviewsCount").value = data.stats.reviewsCount || "";
    // Imágenes
    $("#imgHero").innerHTML = imgEditor(data.images.hero || "", 1280);
    $("#imgAbout").innerHTML = imgEditor(data.images.about || "", 1100);
    // Listas
    renderList("hours", data.hours);
    renderList("services", data.services);
    renderList("team", data.team);
    renderList("reviews", data.reviews);
    renderList("faq", data.faq);
    renderList("gallery", data.gallery);
    setDirty(false);
  }

  /* ---------- Recoger datos del DOM ---------- */
  function readItems(type) {
    return $all(LISTS[type] + " > .item").map(function (item) {
      var o = {};
      $all("[data-field]", item).forEach(function (el) {
        o[el.getAttribute("data-field")] = el.value;
      });
      return o;
    });
  }
  function gather() {
    return {
      contact: {
        phoneDisplay: $("#ac-phoneDisplay").value.trim(),
        phoneIntl: $("#ac-phoneIntl").value.trim(),
        phoneRaw: $("#ac-phoneRaw").value.trim(),
        whatsapp: $("#ac-whatsapp").value.trim(),
        email: $("#ac-email").value.trim(),
        address: $("#ac-address").value.trim(),
        city: $("#ac-city").value.trim(),
        instagram: $("#ac-instagram").value.trim(),
        facebook: $("#ac-facebook").value.trim(),
      },
      stats: {
        rating: $("#ac-rating").value.trim(),
        reviewsCount: $("#ac-reviewsCount").value.trim(),
      },
      images: {
        hero: (($("#imgHero [data-imgfield='src']") || {}).value || "").trim(),
        about: (($("#imgAbout [data-imgfield='src']") || {}).value || "").trim(),
      },
      gallery: readItems("gallery"),
      hours: readItems("hours"),
      services: readItems("services"),
      team: readItems("team").map(function (m) {
        m.tags = (m.tags || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
        return m;
      }),
      reviews: readItems("reviews").map(function (r) {
        r.stars = parseInt(r.stars, 10) || 5;
        return r;
      }),
      faq: readItems("faq"),
    };
  }

  /* ---------- Eventos de edición ---------- */
  var content = $(".admin-content");

  content.addEventListener("input", function (e) {
    setDirty(true);
    var t = e.target;
    if (t.matches && t.matches('[data-imgfield="src"], [data-field="src"]')) {
      var box = t.closest(".img-edit, .item");
      var prev = box && box.querySelector(".img-preview img");
      if (prev) prev.src = t.value;
    }
  });
  content.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches && t.matches('input[type="file"]')) {
      var file = t.files[0];
      if (file) {
        var box = t.closest(".img-edit, .item");
        var maxW = parseInt(box.getAttribute("data-maxw"), 10) || 1000;
        resizeImage(file, maxW, function (dataUrl) {
          var input = box.querySelector('[data-imgfield="src"], [data-field="src"]');
          if (input) input.value = dataUrl;
          var prev = box.querySelector(".img-preview img");
          if (prev) prev.src = dataUrl;
          setDirty(true);
        });
      }
      t.value = "";
      return;
    }
    setDirty(true);
    var sel = t.closest && t.closest(".js-icon");
    if (sel) {
      var preview = $(".icon-preview", sel.closest(".item"));
      if (preview) preview.innerHTML = iconSvg(sel.value);
    }
  });

  content.addEventListener("click", function (e) {
    var uploadBtn = e.target.closest("[data-upload]");
    if (uploadBtn) {
      var box = uploadBtn.closest(".img-edit, .item");
      var fileInput = box && box.querySelector('input[type="file"]');
      if (fileInput) fileInput.click();
      return;
    }
    var addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      var type = addBtn.getAttribute("data-add");
      var wrap = document.createElement("div");
      wrap.innerHTML = TEMPLATES[type]();
      $(LISTS[type]).appendChild(wrap.firstChild);
      setDirty(true);
      return;
    }
    var removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      removeBtn.closest(".item").remove();
      setDirty(true);
      return;
    }
    var moveBtn = e.target.closest("[data-move]");
    if (moveBtn) {
      var item = moveBtn.closest(".item");
      var dir = moveBtn.getAttribute("data-move");
      if (dir === "up" && item.previousElementSibling) {
        item.parentNode.insertBefore(item, item.previousElementSibling);
      } else if (dir === "down" && item.nextElementSibling) {
        item.parentNode.insertBefore(item.nextElementSibling, item);
      }
      setDirty(true);
    }
  });

  /* ---------- Guardar / descartar ---------- */
  $("#saveBtn").addEventListener("click", function () {
    var ok = window.acSaveContent(gather());
    setDirty(false);
    toast(ok ? "Cambios guardados ✓" : "No se pudo guardar (almacenamiento bloqueado)");
  });
  $("#discardBtn").addEventListener("click", function () {
    render();
    toast("Cambios descartados");
  });

  /* ---------- Exportar / Importar / Restablecer ---------- */
  $("#exportBtn").addEventListener("click", function () {
    var data = gather();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "contenido.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Archivo exportado ✓");
  });
  $("#importBtn").addEventListener("click", function () { $("#importFile").click(); });
  $("#importFile").addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        window.acSaveContent(parsed);
        render();
        toast("Contenido importado ✓");
      } catch (err) {
        toast("Archivo no válido");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });
  $("#resetBtn").addEventListener("click", function () {
    if (!confirm("¿Seguro que quieres borrar todos los cambios y volver al contenido original?")) return;
    window.acResetContent();
    render();
    toast("Contenido restablecido ✓");
  });

  /* ---------- Aviso al salir con cambios ---------- */
  window.addEventListener("beforeunload", function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  /* ---------- Inicio ---------- */
  if (isAuthed()) {
    showApp();
  } else {
    $("#pwd").focus();
  }
})();
