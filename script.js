/* =========================================================
   Camila Sotelo — Portfolio · interacciones
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Año en el footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Barra de progreso de scroll ---------- */
  const bar = $(".scroll-bar");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? h.scrollTop / max : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
  };

  /* ---------- Nav: fondo al hacer scroll ---------- */
  const nav = $(".nav");
  const onScrollNav = () => {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 40);
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScrollProgress();
      onScrollNav();
      ticking = false;
    });
  }, { passive: true });
  onScrollProgress();
  onScrollNav();

  /* ---------- Menú móvil ---------- */
  const toggle = $(".nav__toggle");
  const menu = $("#menu");
  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(menu.hidden));
  $$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && !menu.hidden) setMenu(false);
  });

  /* ---------- Smooth scroll (con respeto a reduce-motion) ---------- */
  const scrollToHash = (hash) => {
    // "Volver arriba": el #top es la barra fija, así que llevamos la ventana al inicio.
    if (hash === "#top") {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
      return;
    }
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };
  $$('a[href^="#"], [data-link-to]').forEach(el => {
    el.addEventListener("click", (e) => {
      const hash = el.getAttribute("href") || el.dataset.linkTo;
      if (!hash || hash === "#" || !hash.startsWith("#")) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToHash(hash);
      history.pushState(null, "", hash);
    });
  });

  /* ---------- Reveal al hacer scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add("is-in"));
  }

  /* ---------- Nav activa según sección visible ---------- */
  const sections = ["trabajo", "sobre", "servicios", "proceso", "contacto"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$(".nav__links a[href^='#']");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === `#${id}`));
      });
    }, { threshold: 0.5 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Filtro de proyectos ---------- */
  const filters = $$(".filter");
  const cards = $$(".card");
  const emptyMsg = $(".work__empty");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const f = btn.dataset.filter;
      let visible = 0;
      cards.forEach(card => {
        const cats = (card.dataset.cat || "").split(" ");
        const show = f === "all" || cats.includes(f);
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      if (emptyMsg) emptyMsg.hidden = visible !== 0;
    });
  });

  /* ---------- Hero: parallax de las capas de tinta ---------- */
  const hero = $(".hero");
  const inks = $$(".hero__title .ink--coral, .hero__title .ink--blue");
  if (hero && finePointer && !prefersReduced && inks.length) {
    let raf = null;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        inks.forEach(ink => {
          const dir = ink.classList.contains("ink--coral") ? 1 : -1;
          ink.style.transform = `translate(${dx * 16 * dir}px, ${dy * 12 * dir}px)`;
        });
      });
    });
    hero.addEventListener("pointerleave", () => {
      inks.forEach(ink => { ink.style.transform = "translate(0,0)"; });
    });
  }

  /* ---------- Cursor custom ---------- */
  const cursor = $(".cursor");
  if (cursor && finePointer && !prefersReduced) {
    let cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverables = "a, button, .card, .service, input, textarea";
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
    });
  }

  /* ---------- Formulario de contacto (Formspree) ---------- */
  // Reemplaza "TU_FORM_ID" con el ID que obtienes en https://formspree.io
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeebzrzb";

  const form = $(".form");
  if (form) {
    const status = $(".form__status", form);
    const submitBtn = $("button[type='submit']", form);
    const fields = {
      name:    { el: $("#name", form),    validate: v => v.trim().length >= 2 || "Decime tu nombre." },
      email:   { el: $("#email", form),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Revisá el email." },
      message: { el: $("#message", form), validate: v => v.trim().length >= 10 || "Contame un poco más (mín. 10 caracteres)." },
    };

    const showError = (key, msg) => {
      const f = fields[key];
      const field = f.el.closest(".field");
      const errEl = $(`.error[data-for="${key}"]`, form);
      field.classList.toggle("has-error", Boolean(msg));
      if (errEl) errEl.textContent = msg || "";
    };

    Object.entries(fields).forEach(([key, f]) => {
      f.el.addEventListener("input", () => {
        if (f.el.closest(".field").classList.contains("has-error")) {
          const res = f.validate(f.el.value);
          showError(key, res === true ? "" : res);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let ok = true;
      let firstBad = null;
      Object.entries(fields).forEach(([key, f]) => {
        const res = f.validate(f.el.value);
        if (res !== true) { ok = false; showError(key, res); firstBad = firstBad || f.el; }
        else showError(key, "");
      });

      if (!ok) {
        status.textContent = "Revisá los campos marcados.";
        status.classList.remove("is-ok");
        firstBad?.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando…";
      status.textContent = "";
      status.classList.remove("is-ok", "is-error");

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            name:    fields.name.el.value.trim(),
            email:   fields.email.el.value.trim(),
            message: fields.message.el.value.trim(),
          }),
        });

        if (res.ok) {
          status.textContent = "¡Mensaje enviado! Te respondo en menos de 48 horas.";
          status.classList.add("is-ok");
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Error ${res.status}`);
        }
      } catch (err) {
        status.textContent = "No se pudo enviar. Escribime directo a jarviszuniga84@gmail.com";
        status.classList.add("is-error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
      }
    });
  }

  /* ---------- Lightbox / galería ---------- */
  const lb = $("#lightbox");
  const albums = $$("[data-album]");
  if (lb && albums.length) {
    const lbImg = $(".lightbox__img", lb);
    const lbVideo = $(".lightbox__video", lb);
    const lbCap = $(".lightbox__cap", lb);
    const lbCounter = $(".lightbox__counter", lb);
    const btnClose = $(".lightbox__close", lb);
    const btnNext = $(".lightbox__nav--next", lb);
    const btnPrev = $(".lightbox__nav--prev", lb);
    let list = [], idx = 0, lastFocus = null;

    const render = () => {
      const item = list[idx];
      if (!item) return;
      if (item.type === "video") {
        lbImg.hidden = true; lbImg.removeAttribute("src");
        lbVideo.hidden = false; lbVideo.src = item.src; lbVideo.currentTime = 0;
        lbVideo.play().catch(() => {});
      } else {
        if (lbVideo) { lbVideo.pause(); lbVideo.hidden = true; lbVideo.removeAttribute("src"); }
        lbImg.hidden = false; lbImg.src = item.src; lbImg.alt = item.cap || "";
      }
      lbCap.textContent = item.cap || "";
      const multi = list.length > 1;
      lbCounter.textContent = multi ? `${idx + 1} / ${list.length}` : "";
      btnPrev.style.display = btnNext.style.display = multi ? "" : "none";
    };
    const open = (data, start = 0) => {
      list = data; idx = start; render();
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      lastFocus = document.activeElement;
      btnClose.focus();
    };
    const close = () => {
      if (lbVideo) { lbVideo.pause(); lbVideo.removeAttribute("src"); }
      lb.hidden = true;
      document.body.style.overflow = "";
      lastFocus && lastFocus.focus();
    };
    const next = () => { idx = (idx + 1) % list.length; render(); };
    const prev = () => { idx = (idx - 1 + list.length) % list.length; render(); };

    albums.forEach(el => el.addEventListener("click", () => {
      try { open(JSON.parse(el.dataset.album), Number(el.dataset.start) || 0); } catch (e) { /* json inválido */ }
    }));

    // Deep-link: abrir un álbum por hash (#reels, #animacion, etc.)
    const openByHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const t = document.getElementById(id);
      if (t && t.dataset.album) {
        try { open(JSON.parse(t.dataset.album), 0); } catch (e) { /* noop */ }
      }
    };
    openByHash();
    window.addEventListener("hashchange", openByHash);
    btnClose.addEventListener("click", close);
    btnNext.addEventListener("click", next);
    btnPrev.addEventListener("click", prev);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });
  }
})();
