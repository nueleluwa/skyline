/* Henry Montego Homes — Oniru Twin Towers. Plain JS, no dependencies. */
(() => {
  "use strict";

  const cfg = window.HM_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  /* ---- Header: background on scroll + active section ------------------- */
  function initHeader() {
    const header = $("#site-header");
    let ticking = false;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    const links = $$('.site-nav a[href^="#"]').filter((a) => a.getAttribute("href").length > 1);
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const setCurrent = (id) => links.forEach((a) => {
      if (a === byId.get(id)) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    // Sections without a nav entry (Experience, the enquiry form) clear the highlight.
    const alias = { experience: null, enquire: null };
    const targets = $$("main section[id]");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id in alias ? alias[e.target.id] : e.target.id;
        setCurrent(id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach((t) => io.observe(t));
  }

  /* ---- Mobile navigation ------------------------------------------------ */
  function initMobileNav() {
    const header = $("#site-header");
    const toggle = $(".nav-toggle");
    const nav = $("#primary-nav");
    const set = (open) => {
      header.classList.toggle("nav-open", open);
      document.body.classList.toggle("no-scroll", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => set(!header.classList.contains("nav-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) { set(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 981px)").addEventListener("change", (m) => { if (m.matches) set(false); });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* ---- Dialogs ---------------------------------------------------------- */
  const openDialogs = new Set();
  function openDialog(dlg) {
    if (!dlg || dlg.open) return;
    dlg.showModal();
    openDialogs.add(dlg);
    document.body.classList.add("no-scroll");
  }
  function initDialogs() {
    $$("dialog.modal").forEach((dlg) => {
      dlg.addEventListener("close", () => {
        openDialogs.delete(dlg);
        if (!openDialogs.size && !$("#site-header").classList.contains("nav-open")) document.body.classList.remove("no-scroll");
      });
      // Click on the dark backdrop (outside the shell content) closes.
      dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.classList.contains("modal__shell")) dlg.close(); });
      $$("[data-close]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
    });
    $$("[data-open]").forEach((btn) => btn.addEventListener("click", () => openDialog(document.getElementById(btn.dataset.open))));
  }

  /* ---- Lightbox --------------------------------------------------------- */
  function initLightbox() {
    const dlg = $("#lightbox");
    const img = $("#lb-img");
    const cap = $("#lb-caption");
    const items = $$("[data-lightbox]");
    let i = 0;
    const show = (n) => {
      i = (n + items.length) % items.length;
      const el = items[i];
      img.src = el.dataset.full;
      img.alt = $("img", el)?.alt || "";
      cap.innerHTML = el.dataset.caption || "";
    };
    items.forEach((el, n) => el.addEventListener("click", () => { show(n); openDialog(dlg); }));
    $("[data-lb-prev]", dlg).addEventListener("click", () => show(i - 1));
    $("[data-lb-next]", dlg).addEventListener("click", () => show(i + 1));
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
    // Touch swipe
    let x0 = null;
    dlg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---- Floor-plan modal ------------------------------------------------- */
  function initPlan() {
    const dlg = $("#plan-dialog");
    const stage = $("#plan-stage");
    const zoom = $("#plan-zoom");
    const set = (on) => {
      stage.classList.toggle("is-zoomed", on);
      zoom.setAttribute("aria-pressed", String(on));
      zoom.lastChild.textContent = on ? " Fit to screen" : " Zoom in";
    };
    zoom.addEventListener("click", () => set(!stage.classList.contains("is-zoomed")));
    stage.addEventListener("click", () => set(!stage.classList.contains("is-zoomed")));
    dlg.addEventListener("close", () => set(false));
    // Pre-select "Floor plans" when enquiring from the modal.
    $("[data-plan-enquire]", dlg).addEventListener("click", (e) => {
      e.preventDefault();
      dlg.close();
      $("#f-type").value = "Floor plans & brochure";
      scrollToEnquiry();
    });
  }

  function scrollToEnquiry() {
    const target = $("#enquire");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setTimeout(() => $("#f-name").focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }

  /* ---- Film ------------------------------------------------------------- */
  function initFilm() {
    const dlg = $("#film-dialog");
    const frame = $("#film-frame");
    const soon = $("#film-soon");
    const url = (cfg.filmUrl || "").trim();
    if (url) {
      soon.hidden = true;
      frame.hidden = false;
      const mount = () => {
        if (/\.(mp4|webm)(\?|$)/i.test(url)) {
          frame.innerHTML = `<video src="${url}" controls autoplay playsinline></video>`;
        } else {
          const sep = url.includes("?") ? "&" : "?";
          frame.innerHTML = `<iframe src="${url}${sep}autoplay=1" title="Oniru Twin Towers film" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        }
      };
      $$('[data-open="film-dialog"]').forEach((b) => b.addEventListener("click", mount));
      dlg.addEventListener("close", () => { frame.innerHTML = ""; });
    }
  }

  /* ---- "Register interest" links (Tally) -------------------------------- */
  function initRegisterLinks() {
    const url = (cfg.registerInterestUrl || "").trim();
    $$("[data-register-interest]").forEach((a) => {
      if (url) {
        a.href = url; a.target = "_blank"; a.rel = "noopener";
      } else {
        // No Tally URL configured: take the visitor to the enquiry form instead.
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const dlg = a.closest("dialog");
          if (dlg) dlg.close();
          scrollToEnquiry();
        });
      }
    });
  }

  /* ---- Enquiry form ----------------------------------------------------- */
  function initForm() {
    const form = $("#enquiry-form");
    const status = $("#form-status");

    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
      phone: (v) => {
        const digits = v.replace(/\D/g, "");
        return /^[+()\d\s.-]+$/.test(v.trim()) && digits.length >= 7 && digits.length <= 15 ? "" : "Please enter a valid phone number.";
      },
      development: (v) => (v ? "" : "Please choose a development."),
      type: (v) => (v ? "" : "Please select the type of enquiry."),
      message: (v) => (v.length <= 1500 ? "" : "Please keep your message under 1,500 characters.")
    };

    const check = (name) => {
      const field = form.elements[name];
      const msg = rules[name](field.value);
      const err = $("#e-" + name);
      err.textContent = msg;
      if (msg) field.setAttribute("aria-invalid", "true"); else field.removeAttribute("aria-invalid");
      field.setAttribute("aria-describedby", "e-" + name);
      return !msg;
    };

    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      field.addEventListener("blur", () => { if (field.value || field.hasAttribute("aria-invalid")) check(name); });
      field.addEventListener("input", () => { if (field.hasAttribute("aria-invalid")) check(name); });
      field.addEventListener("change", () => check(name));
    });

    const values = () => ({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      development: form.elements.development.value,
      type: form.elements.type.value,
      message: form.elements.message.value.trim()
    });

    const summary = (v) =>
      `Enquiry: ${v.development}\n` +
      `Type of enquiry: ${v.type}\n\n` +
      `Name: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone}\n` +
      (v.message ? `\nMessage:\n${v.message}\n` : "");

    const showNotice = (cls, title, text, actionsHtml = "", moveFocus = true) => {
      status.innerHTML = `<div class="notice ${cls}"><strong></strong><span></span>${actionsHtml}</div>`;
      $("strong", status).textContent = title;
      $("span", status).textContent = text;
      if (!moveFocus) return;
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    };

    // Delivery without a backend: hand the prepared enquiry to the visitor's mail app or WhatsApp.
    const fallbackActions = (v) => {
      const subject = encodeURIComponent(`Enquiry: ${v.development} — ${v.type}`);
      const body = encodeURIComponent(summary(v));
      const mail = `mailto:${cfg.leadEmail}?subject=${subject}&body=${body}`;
      const wa = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(summary(v))}`;
      return `<div class="notice__actions">
        <a class="btn btn--dark btn--sm" href="${mail}">Send by email</a>
        <a class="btn btn--outline-dark btn--sm" href="${wa}" target="_blank" rel="noopener">Send on WhatsApp</a>
      </div>`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.innerHTML = "";

      // Honeypot: bots fill hidden fields.
      if (form.elements.company.value) return;

      const names = Object.keys(rules);
      const bad = names.filter((n) => !check(n));
      if (bad.length) {
        showNotice("notice--error", "Please check the highlighted fields.", "Some details are missing or look incorrect.", "", false);
        form.elements[bad[0]].focus();
        return;
      }

      const v = values();
      const endpoint = (cfg.formEndpoint || "").trim();

      if (!endpoint) {
        showNotice(
          "", "Your enquiry is ready.",
          "Choose how you would like to send it to our sales team, and we will respond personally.",
          fallbackActions(v)
        );
        return;
      }

      form.classList.add("is-busy");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...v, source: location.href, submittedAt: new Date().toISOString() })
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        showNotice("notice--success", "Thank you.", "Your enquiry has been received. A member of the Henry Montego Homes team will be in touch shortly.");
      } catch (err) {
        showNotice(
          "notice--error", "We could not send your enquiry.",
          "Please try again, or send it directly using one of the options below.",
          fallbackActions(v)
        );
      } finally {
        form.classList.remove("is-busy");
      }
    });
  }

  /* ---- Init ------------------------------------------------------------- */
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  initHeader();
  initMobileNav();
  initReveal();
  initDialogs();
  initLightbox();
  initPlan();
  initFilm();
  initRegisterLinks();
  initForm();
})();
