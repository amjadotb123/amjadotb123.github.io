(() => {
  const D = window.PORTFOLIO;
  const P = D.profile;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const arrow = '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';

  /* ---------- profile ---------- */
  document.title = `${P.shortName || P.name} | معرض الأعمال`;
  $$("[data-bind]").forEach((el) => (el.textContent = P[el.dataset.bind] ?? ""));
  $("#cvBtn").href = P.cv;
  if (P.cv && P.cv !== "#") $("#cvBtn").setAttribute("download", "");
  $("#mailBtn").href = `mailto:${P.email}`;
  if (P.phone) $("#waBtn").href = `https://wa.me/${P.phone.replace(/\D/g, "")}`; else $("#waBtn").remove();
  $("#year").textContent = new Date().getFullYear();
  $("#socials").innerHTML = P.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");

  /* ---------- stats ---------- */
  const statLi = (s) =>
    s.text
      ? `<li><strong>${esc(s.text)}</strong><span>${esc(s.label)}</span></li>`
      : `<li><strong data-count="${s.value}" data-suffix="${esc(s.suffix || "")}">0</strong><span>${esc(s.label)}</span></li>`;
  $("#stats").innerHTML = D.stats.map(statLi).join("");
  $("#sideStats").innerHTML = [
    { value: D.projects.length, label: "مشروعات في المعرض" },
    { value: D.experience.filter((x) => !/بكالوريوس|تطوع/.test(x.role + x.period)).length, label: "محطات عملية" },
    { text: "2", label: "لغتان" },
  ].map(statLi).join("");

  /* ---------- hero card ---------- */
  const H = D.heroCard;
  if (H) {
    $("#heroCard").innerHTML = `
      <div class="hcard__top">
        <div><small>${esc(H.eyebrow)}</small><strong>${esc(H.title)}</strong></div>
        <span class="avatar">${esc(P.initials)}</span>
      </div>
      <div class="hcard__hl">
        <small>${esc(H.sub)}</small><b>${esc(H.highlight)}</b><span>${esc(H.highlightLabel)}</span><br>
        <a href="#work">شاهد المشروع</a>
      </div>
      ${H.rows.map((r) => `<div class="hcard__row"><span class="ico">${r.icon}</span><div><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></div></div>`).join("")}`;
  }

  /* ---------- reasons ---------- */
  const rIcons = [
    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  ];
  $("#principles").innerHTML = D.principles
    .map((x, i) => `<div class="reason reveal"><div class="reason__icon"><svg viewBox="0 0 24 24">${rIcons[i % 3]}</svg></div><h4>${esc(x.title)}</h4><p>${esc(x.text)}</p></div>`)
    .join("");

  /* ---------- projects ---------- */
  const media = (p) =>
    p.cover
      ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy"${p.coverPos ? ` style="object-position:${esc(p.coverPos)}"` : ""}>${p.illustrative ? '<span class="illus">صورة توضيحية</span>' : ""}`
      : `<div class="ph" style="--c:${esc(p.accent || "#1E4A44")}"><span>${esc(p.title.trim()[0])}</span></div>`;
  const tags = (t) => `<div class="tags">${t.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>`;
  const meta = (p) => `<div class="meta"><b>${esc(p.category)}</b><span>•</span><span>${esc(p.year)}</span></div>`;
  const org = (p) => (p.org ? `<span class="org">${esc(p.org)}</span>` : "");
  const metrics = (p) => (p.metrics?.length ? `<div class="metrics">${p.metrics.map((m) => `<div><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></div>`).join("")}</div>` : "");

  $("#featured").innerHTML = D.projects
    .filter((p) => p.featured)
    .map(
      (p) => `
    <article class="feature reveal" data-id="${esc(p.id)}" data-cat="${esc(p.category)}" tabindex="0" role="button" aria-label="${esc(p.title)}">
      <div class="feature__media">${media(p)}</div>
      <div class="feature__body">
        ${org(p)}${meta(p)}
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        ${metrics(p)}${tags(p.tags)}
        <span class="more">اقرأ دراسة الحالة ${arrow}</span>
      </div>
    </article>`
    )
    .join("");

  $("#grid").innerHTML = D.projects
    .filter((p) => !p.featured)
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
  $("#filters").innerHTML = D.categories.map((c, i) => `<button class="filter${i ? "" : " active"}" role="tab" data-f="${esc(c)}">${esc(c)}</button>`).join("");
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    $$(".filter").forEach((x) => x.classList.toggle("active", x === b));
    const f = b.dataset.f;
    $$(".feature, .card").forEach((el) => el.classList.toggle("is-hidden", f !== D.categories[0] && el.dataset.cat !== f));
  });

  /* ---------- case-study modal ---------- */
  const modal = $("#modal");
  const open = (id) => {
    const p = D.projects.find((x) => x.id === id);
    if (!p) return;
    $("#modalBody").innerHTML = `
      <div class="cs__hero">${media(p)}</div>
      <div class="cs__body">
        ${org(p)}${meta(p)}
        <h2 id="modalTitle">${esc(p.title)}</h2>
        <p class="lead">${esc(p.summary)}</p>
        ${metrics(p)}${tags(p.tags)}
        <div class="cs__grid">
          <div class="cs__block"><h4>التحدّي</h4><p>${esc(p.problem)}</p></div>
          <div class="cs__block"><h4>الحل</h4><p>${esc(p.solution)}</p></div>
          <div class="cs__block"><h4>النتيجة</h4><p>${esc(p.result)}</p></div>
        </div>
        ${p.gallery?.length ? `<div class="cs__gallery">${p.gallery.map((g) => `<img src="${esc(g)}" alt="" loading="lazy">`).join("")}</div>` : ""}
        <div class="cs__links">${(p.links || []).map((l) => `<a class="btn btn--primary" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${arrow}</a>`).join("")}
          <a class="btn btn--line" href="#contact" data-close>ناقشني في هذا المشروع</a></div>
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

  /* ---------- experience ---------- */
  $("#timeline").innerHTML = D.experience
    .map(
      (x, i) => `<li class="step reveal"><span class="step__num">${String(i + 1).padStart(2, "0")}</span>
        <div><h3>${esc(x.role)}</h3>${x.company ? `<span class="co">${esc(x.company)}</span>` : ""}<span class="when">${esc(x.period)}</span><p>${esc(x.text)}</p></div>
        <span class="step__go">${arrow}</span></li>`
    )
    .join("");

  /* ---------- skills ---------- */
  const sIcons = [
    '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  ];
  $("#skillsList").innerHTML = D.skills
    .map((g, i) => `<div class="skill reveal"><div class="skill__icon"><svg viewBox="0 0 24 24">${sIcons[i % 3]}</svg></div><h3>${esc(g.title)}</h3>${tags(g.items)}</div>`)
    .join("");

  /* ---------- reveal + counters ---------- */
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count), suf = el.dataset.suffix, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 4))) + suf;
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
    { threshold: 0.1 }
  );
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });

  /* ---------- copy email ---------- */
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };
  $("#copyEmail").onclick = async () => {
    try { await navigator.clipboard.writeText(P.email); toast("تم نسخ البريد ✓"); }
    catch { location.href = `mailto:${P.email}`; }
  };
})();
