(() => {
  const D = window.PORTFOLIO;
  const P = D.profile;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arrow = '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';

  /* ---------- profile bindings ---------- */
  document.title = `${P.shortName || P.name} | معرض الأعمال`;
  $$("[data-bind]").forEach((el) => (el.textContent = P[el.dataset.bind] ?? ""));
  if (!P.available) $("#availability").hidden = true;
  $("#cvBtn").href = P.cv;
  if (P.cv && P.cv !== "#") $("#cvBtn").setAttribute("download", "");
  $("#mailBtn").href = `mailto:${P.email}`;
  if (P.phone) $("#waBtn").href = `https://wa.me/${P.phone.replace(/\D/g, "")}`; else $("#waBtn").remove();
  $("#year").textContent = new Date().getFullYear();
  $("#socials").innerHTML = P.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");

  /* ---------- stats ---------- */
  $("#stats").innerHTML = D.stats
    .map((s) =>
      s.text
        ? `<li><strong class="is-text">${esc(s.text)}</strong><span>${esc(s.label)}</span></li>`
        : `<li><strong data-count="${s.value}" data-dec="${s.decimals || 0}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</strong><span>${esc(s.label)}</span></li>`
    )
    .join("");

  /* ---------- hero card ---------- */
  const H = D.heroCard;
  if (H) {
    $("#heroCard").innerHTML = `
      <div class="phone__top">
        <div><small>${esc(H.eyebrow)}</small><strong>${esc(H.title)}</strong></div>
        <span class="avatar">${esc(P.initials)}</span>
      </div>
      <div class="peach">
        <div><small>${esc(H.sub)}</small><b>${esc(H.highlight)}</b><span>${esc(H.highlightLabel)}</span>
          <a href="#work" class="peach__btn">شاهد المشروع</a></div>
        <div class="peach__stack">${H.chips.slice(0, 3).map((c, i) => `<i style="--d:${i}">${esc(c[0])}</i>`).join("")}<i class="plus">+</i></div>
      </div>
      ${H.rows.map((r) => `<div class="phone__row"><span class="ico">${r.icon}</span><div><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></div></div>`).join("")}
      <div class="phone__chips">${H.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>`;
  } else $("#heroCard").remove();

  /* ---------- marquee ---------- */
  const words = [...new Set(D.skills.flatMap((g) => g.items))];
  const row = words.map((w) => `<span>${esc(w)}</span>`).join("");
  $("#marquee").innerHTML = row + row;

  /* ---------- projects ---------- */
  const media = (p, cls = "") =>
    p.cover
      ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" class="${cls}"${p.coverPos ? ` style="object-position:${esc(p.coverPos)}"` : ""}>`
      : `<div class="placeholder ${cls}" style="--c:${esc(p.accent || "#7c5cff")}"><span>${esc(p.title.trim()[0])}</span></div>`;
  const mock = (p) => `<div class="mock"><div class="mock__card">
      <small>${esc(p.category)} · ${esc(p.year)}</small>
      <b>${esc(p.title.split("—")[0].trim())}</b>
      <div class="mock__metrics">${p.metrics.map((m) => `<span><strong>${esc(m.value)}</strong>${esc(m.label)}</span>`).join("")}</div>
    </div><div class="phone__chips">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`;
  const tags = (t) => `<div class="tags">${t.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>`;
  const meta = (p) => `<div class="meta"><b>${esc(p.category)}</b><span>•</span><span>${esc(p.year)}</span></div>`;

  const featured = D.projects.filter((p) => p.featured);
  const rest = D.projects.filter((p) => !p.featured);

  $("#featured").innerHTML = featured
    .map(
      (p) => `
    <article class="feature reveal" data-id="${esc(p.id)}" data-cat="${esc(p.category)}" tabindex="0" role="button" aria-label="${esc(p.title)}">
      <div class="feature__media">${p.cover ? media(p) : mock(p)}<span class="feature__badge">مشروع مميّز</span></div>
      <div class="feature__body">
        ${meta(p)}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="metrics">${p.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>
        ${tags(p.tags)}
        <span class="more">اقرأ دراسة الحالة ${arrow}</span>
      </div>
    </article>`
    )
    .join("");

  $("#grid").innerHTML = rest
    .map(
      (p) => `
    <article class="card reveal" data-id="${esc(p.id)}" data-cat="${esc(p.category)}" tabindex="0" role="button" aria-label="${esc(p.title)}">
      <div class="card__media">${media(p)}</div>
      <div class="card__body">
        ${meta(p)}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        ${tags(p.tags)}
        <span class="more">التفاصيل ${arrow}</span>
      </div>
    </article>`
    )
    .join("");

  /* ---------- filters ---------- */
  $("#filters").innerHTML = D.categories
    .map((c, i) => `<button class="filter${i ? "" : " active"}" role="tab" data-f="${esc(c)}">${esc(c)}</button>`)
    .join("");
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    $$(".filter").forEach((x) => x.classList.toggle("active", x === b));
    const f = b.dataset.f;
    $$(".feature, .card").forEach((el) => el.classList.toggle("is-hidden", f !== D.categories[0] && el.dataset.cat !== f));
  });
  const style = document.createElement("style");
  style.textContent = ".feature.is-hidden{display:none}";
  document.head.appendChild(style);

  /* ---------- case-study modal ---------- */
  const modal = $("#modal");
  const open = (id) => {
    const p = D.projects.find((x) => x.id === id);
    if (!p) return;
    $("#modalBody").innerHTML = `
      <div class="cs__hero">${media(p)}</div>
      <div class="cs__body">
        ${meta(p)}
        <h2 id="modalTitle">${esc(p.title)}</h2>
        <p class="lead">${esc(p.summary)}</p>
        <div class="metrics">${p.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>
        ${tags(p.tags)}
        <div class="cs__grid">
          <div class="cs__block"><h4>التحدّي</h4><p>${esc(p.problem)}</p></div>
          <div class="cs__block"><h4>الحل</h4><p>${esc(p.solution)}</p></div>
          <div class="cs__block"><h4>النتيجة</h4><p>${esc(p.result)}</p></div>
        </div>
        ${p.gallery?.length ? `<div class="cs__gallery">${p.gallery.map((g) => `<img src="${esc(g)}" alt="" loading="lazy">`).join("")}</div>` : ""}
        <div class="cs__links">${(p.links || []).map((l) => `<a class="btn btn--primary" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${arrow}</a>`).join("")}
          <a class="btn btn--ghost" href="#contact" data-close>ناقشني في هذا المشروع</a></div>
      </div>`;
    modal.showModal();
    $(".modal__inner").scrollTop = 0;
  };
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".feature, .card");
    if (t) open(t.dataset.id);
    if (e.target.closest("[data-close]")) modal.close();
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target.closest?.(".feature, .card");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(t.dataset.id); }
  });
  $("#modalClose").onclick = () => modal.close();
  modal.addEventListener("click", (e) => e.target === modal && modal.close());

  /* ---------- about / skills / timeline ---------- */
  $("#principles").innerHTML = D.principles
    .map((x, i) => `<div class="principle reveal"><span class="principle__num">0${i + 1}</span><div><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></div></div>`)
    .join("");
  const icons = [
    '<path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a4 4 0 0 1-8 0v-1a3 3 0 0 1-2-5 3 3 0 0 1 2-5V6a4 4 0 0 1 4-4z"/><path d="M12 2v20"/>',
    '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  ];
  $("#skillsList").innerHTML = D.skills
    .map((g, i) => `<div class="skill reveal"><div class="skill__icon"><svg viewBox="0 0 24 24">${icons[i % icons.length]}</svg></div><h3>${esc(g.title)}</h3>${tags(g.items)}</div>`)
    .join("");
  $("#timeline").innerHTML = D.experience
    .map((x) => `<li class="tl reveal"><span class="tl__period">${esc(x.period)}</span><div><h3>${esc(x.role)}<small>${esc(x.company)}</small></h3><p>${esc(x.text)}</p></div></li>`)
    .join("");

  /* ---------- reveal + counters ---------- */
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec, suf = el.dataset.suffix, t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 4));
      el.textContent = v.toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

  /* ---------- nav: hide on scroll + active link ---------- */
  let lastY = 0;
  const nav = $("#nav");
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > lastY && y > 300);
    lastY = y;
  }, { passive: true });
  const links = $$(".nav__links a");
  const so = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && links.forEach((a) => a.classList.toggle("active", a.hash === `#${e.target.id}`))),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("section[id]").forEach((s) => so.observe(s));

  /* ---------- theme ---------- */
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch {}
  root.dataset.theme = saved || "dark";
  $("#themeToggle").onclick = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  };

  /* ---------- cursor glow ---------- */
  const glow = $(".cursor-glow");
  addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });

  /* ---------- copy email ---------- */
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };
  $("#copyEmail").onclick = async () => {
    try { await navigator.clipboard.writeText(P.email); toast("تم نسخ البريد ✓"); }
    catch { location.href = `mailto:${P.email}`; }
  };
  $("#cvBtn").addEventListener("click", (e) => { if (P.cv === "#") { e.preventDefault(); toast("أضيفي رابط السيرة الذاتية في data.js"); } });
})();
