/* =====================================================================
   Contenido editable del sitio (AC Fisioterapia Avanzada)
   - AC_DEFAULTS: contenido por defecto (igual que el sitio original).
   - acGetContent(): combina los valores por defecto con lo guardado por
     el panel de administración en localStorage ("ac_site_content").
   - AC_ICONS: catálogo de iconos SVG para los servicios.
   ===================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "ac_site_content";

  window.AC_ICONS = {
    magnet: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3Z"/>',
    run: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m4 17 4 1 2-4 3 2 1 5M13 8l4-1 3 3M13 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/>',
    hands: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M5 11V6a2 2 0 1 1 4 0v5m0-1a2 2 0 1 1 4 0v1m0-1a2 2 0 1 1 4 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 16"/>',
    bone: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M7 17a2.2 2.2 0 1 1-2-3 2.2 2.2 0 1 1 3-2l6-6a2.2 2.2 0 1 1 2-3 2.2 2.2 0 1 1 3 2 2.2 2.2 0 1 1 2 3 2.2 2.2 0 1 1-3 2l-6 6a2.2 2.2 0 1 1-2 3 2.2 2.2 0 1 1-3-2Z"/>',
    neck: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M9 4a3 3 0 0 1 6 0c0 2-2 3-2 5l1 3-3 1m-2 0 1-5"/>',
    spine: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M12 3v18M9 5h6M8.5 9h7M9 13h6M9.5 17h5"/>',
    back: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm-2 6 4 0 1 6-2 0-1 4-2-4 1-6Z"/>',
    knee: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M8 3v6a4 4 0 0 0 4 4 4 4 0 0 1 4 4v4M8 9c0 4 2 6 4 7"/>',
    shoulder: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M5 20v-3a5 5 0 0 1 5-5h1a4 4 0 0 0 4-4V5m1 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>',
    pulse: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M3 12h4l2-6 4 12 2-6h6"/>',
    needle: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m14 4 6 6-9 9-3 1 1-3 9-9M9 15l-4 4"/>',
    wave: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M2 12c2 0 2-5 4-5s2 10 4 10 2-12 4-12 2 7 4 7 2-3 4-3"/>',
    jaw: '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M5 5v6a7 7 0 0 0 7 7h2a3 3 0 0 0 3-3 3 3 0 0 0-3-3h-2M8 8h.01M12 8h.01"/>',
  };

  window.AC_DEFAULTS = {
    contact: {
      phoneDisplay: "664 68 52 66",
      phoneIntl: "+34 664 68 52 66",
      phoneRaw: "+34664685266",
      whatsapp: "34664685266",
      email: "info@acfisioterapia.es",
      address: "C/ Cardenal Bueno Monreal, 14-A",
      city: "41013 · Sevilla",
      instagram: "https://www.instagram.com/chaparrocastano/",
      facebook: "",
    },
    images: {
      hero: "assets/tratamiento-hero.webp",
      about: "assets/sobre-clinica.webp",
    },
    gallery: [
      { src: "assets/fachada-3.webp", caption: "Fachada", size: "lg" },
      { src: "assets/recepcion.webp", caption: "Recepción", size: "" },
      { src: "assets/sala-espera.webp", caption: "Sala de espera", size: "" },
      { src: "assets/magnetolith.webp", caption: "Magnetoterapia Magnetolith", size: "" },
      { src: "assets/salas-tratamiento.webp", caption: "Salas de tratamiento", size: "wide" },
      { src: "assets/readaptacion.webp", caption: "Readaptación deportiva", size: "" },
    ],
    stats: {
      rating: "4,9",
      reviewsCount: "107",
    },
    hours: [
      { d: "Lunes", h: "9:00–14:00 · 16:00–21:00" },
      { d: "Martes", h: "9:00–21:00" },
      { d: "Miércoles", h: "9:00–14:00 · 16:00–21:00" },
      { d: "Jueves", h: "9:00–14:00 · 16:00–21:00" },
      { d: "Viernes", h: "9:00–15:00" },
      { d: "Sábado", h: "Cerrado" },
      { d: "Domingo", h: "Cerrado" },
    ],
    services: [
      { t: "Magnetoterapia Magnetolith", d: "Regeneración celular y alivio del dolor con campos magnéticos de alta intensidad.", i: "magnet" },
      { t: "Readaptación deportiva", d: "Vuelta segura a la actividad y rehabilitación tras la lesión.", i: "run" },
      { t: "Osteopatía", d: "Terapia manual global para restaurar el equilibrio del cuerpo.", i: "hands" },
      { t: "Edemas óseos y fracturas", d: "Tratamiento avanzado para acelerar la consolidación y reducir el edema.", i: "bone" },
      { t: "Dolor cervical", d: "Recupera la movilidad del cuello y libera tensión y rigidez.", i: "neck" },
      { t: "Lumbalgia y ciática", d: "Solución del dolor lumbar y la irradiación por el nervio ciático.", i: "spine" },
      { t: "Dolor dorsal", d: "Tratamiento de contracturas y tensión en la zona media de la espalda.", i: "back" },
      { t: "Dolor crónico de espalda", d: "Programas de largo recorrido para mejorar tu calidad de vida.", i: "spine" },
      { t: "Lesiones de rodilla", d: "Rehabilitación de ligamentos, menisco y patología femoropatelar.", i: "knee" },
      { t: "Rehabilitación de hombro", d: "Recupera fuerza y rango articular tras lesión o cirugía.", i: "shoulder" },
      { t: "Tendinopatías", d: "Tratamiento basado en evidencia para tendones lesionados.", i: "pulse" },
      { t: "Fisioterapia invasiva ecoguiada", d: "Máxima precisión con control ecográfico en tiempo real.", i: "needle" },
      { t: "Neuromodulación", d: "Modulación del sistema nervioso para el control del dolor.", i: "wave" },
      { t: "ATM y bruxismo", d: "Tratamiento de la articulación temporomandibular y el bruxismo.", i: "jaw" },
    ],
    team: [
      {
        initial: "A",
        name: "Arturo Chaparro",
        role: "Director · Fisioterapeuta colegiado",
        bio: "Fundador de la clínica, con más de 10 años de experiencia. Especialista en fisioterapia avanzada, diagnóstico ecográfico y readaptación deportiva. Apuesta por un enfoque basado en la evidencia y un trato cercano.",
        tags: ["Ecografía", "Invasiva ecoguiada", "Readaptación"],
      },
      {
        initial: "F",
        name: "Francisco",
        role: "Fisioterapeuta",
        bio: "Destacado una y otra vez por los pacientes por su amabilidad, cercanía y profesionalidad. Acompaña tu evolución sesión a sesión, adaptando cada tratamiento a tus necesidades.",
        tags: ["Terapia manual", "Osteopatía", "Seguimiento"],
      },
    ],
    reviews: [
      { initial: "G", name: "Gonzalo Valverde", meta: "Local Guide · Hace 3 meses", stars: 5, text: "Tratamiento cuidado, serio y muy profesional. Arturo junto a su equipo son una apuesta segura tanto en lo clínico como en lo personal. Las instalaciones, el equipamiento de ecografía y magnetolith de última generación y el equipo humano hacen de AC Fisioterapia Avanzada una clínica de referencia. ¡Gracias por la pasión que dedicáis al bienestar de los pacientes!" },
      { initial: "M", name: "Marta Castro", meta: "Local Guide · Hace 5 meses", stars: 5, text: "Estoy encantada con haber acudido a esta clínica. Me atendió Paco, desde el primer momento con mucha amabilidad y profesionalidad. Tuve tres sesiones y se interesó en todo momento por mi evolución. Sin duda volveré a acudir. ¡10/10!" },
      { initial: "P", name: "Paloma Martín Osuna", meta: "Local Guide · Hace 3 meses", stars: 5, text: "Vine a la clínica por recomendación de una amiga ante una lesión inesperada. Me hicieron hueco en el día y en dos sesiones la lesión mejoró y ya ha desaparecido. Muy profesionales y atentos, pendientes de tu evolución. ¡Gracias!" },
      { initial: "T", name: "Triana Ternero S.", meta: "Hace 3 meses", stars: 5, text: "Todos los problemas musculares que he tenido me los han resuelto de manera totalmente satisfactoria. Gran profesionalidad, honradez y empatía, y extremadamente agradables en el trato. Muy útiles los consejos para hacer ejercicios en casa. Recomendables 100%. ¡No te arrepentirás!" },
      { initial: "L", name: "L. R.", meta: "Hace 4 meses", stars: 5, text: "Acudí con mi madre (89 años), a la que una artrosis le ocasionaba dolor y rigidez en los dedos. Tras varias sesiones ha experimentado una grandísima mejoría que le permite volver a abrocharse los botones, peinarse, manejar los cubiertos... Muy agradecidos por la profesionalidad y el exquisito trato de Paco." },
      { initial: "J", name: "Juan A. Rodríguez Lora", meta: "Local Guide · Hace 3 meses", stars: 5, text: "Llevaba más de un mes con dolor de espalda sin mejorar con otros tratamientos. Con la metodología de la clínica de Arturo Chaparro noté una enorme mejoría desde la primera sesión. Destaco la cercanía y amabilidad del trato, especialmente de Paco. Volveré sin duda. ¡Muchas gracias por todo!" },
    ],
    faq: [
      { q: "¿Necesito cita previa?", a: "Sí, trabajamos con cita previa para poder dedicarte el tiempo que necesitas. Puedes pedirla por teléfono, WhatsApp o desde el formulario de esta web." },
      { q: "¿La primera sesión incluye valoración?", a: "En la primera visita realizamos una valoración completa, funcional y ecográfica si es necesaria, para entender el origen del problema y diseñar tu plan de tratamiento personalizado." },
      { q: "¿Trabajáis con seguros médicos?", a: "Consúltanos tu caso por teléfono o WhatsApp y te informamos sobre las opciones disponibles y la documentación que puedes necesitar." },
      { q: "¿Qué es la fisioterapia invasiva ecoguiada?", a: "Es una técnica de máxima precisión en la que, con control ecográfico en tiempo real, tratamos la estructura lesionada de forma segura y eficaz. Indicada en tendinopatías, contracturas profundas y más." },
      { q: "¿Cuántas sesiones voy a necesitar?", a: "Depende de cada lesión y persona. Tras la valoración inicial te daremos una estimación realista y haremos un seguimiento de tu evolución para ajustar el tratamiento." },
      { q: "¿Dónde estáis y cuál es el horario?", a: "Estamos en C/ Cardenal Bueno Monreal, 14-A, 41013 Sevilla. Abrimos de lunes a viernes (consulta el horario detallado en el pie de página). Sábados y domingos cerrado." },
    ],
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  window.acGetStored = function () {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  };

  window.acSaveContent = function (data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  };

  window.acResetContent = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  window.acGetContent = function () {
    var d = deepClone(window.AC_DEFAULTS);
    var s = window.acGetStored();
    return {
      contact: Object.assign({}, d.contact, s.contact || {}),
      stats: Object.assign({}, d.stats, s.stats || {}),
      images: Object.assign({}, d.images, s.images || {}),
      hours: Array.isArray(s.hours) ? s.hours : d.hours,
      services: Array.isArray(s.services) ? s.services : d.services,
      team: Array.isArray(s.team) ? s.team : d.team,
      reviews: Array.isArray(s.reviews) ? s.reviews : d.reviews,
      faq: Array.isArray(s.faq) ? s.faq : d.faq,
      gallery: Array.isArray(s.gallery) ? s.gallery : d.gallery,
    };
  };

  window.AC_STORAGE_KEY = STORAGE_KEY;
})();
