(function () {
  const endpoint = document.body.dataset.acEndpoint || "content/site.json";

  async function getJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load " + url + ": " + res.status);
    return res.json();
  }

  function setText(sel, val) {
    const el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (el) el.textContent = val || "";
  }

  function render(data) {
    document.title = data.siteName ? `${data.siteName} — ${data.tagline || ""}`.trim() : document.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", data.hero?.subheadline || data.tagline || "");

    setText('[data-ac="brand"]', data.siteName);
    setText('[data-ac="hero-headline"]', data.hero?.headline);
    setText('[data-ac="hero-sub"]', data.hero?.subheadline);

    const cta = document.querySelector('[data-ac="cta"]');
    if (cta) {
      cta.textContent = data.cta?.text || cta.textContent || "Get in touch";
      cta.href = data.cta?.href || cta.getAttribute("href") || "#contact";
    }

    setText('[data-ac="about-title"]', data.about?.title);
    setText('[data-ac="about-body"]', data.about?.body);

    const svc = document.querySelector('[data-ac="services"]');
    if (svc) {
      svc.innerHTML = "";
      (data.services || []).forEach(s => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<h3>${s.title || ""}</h3><p>${s.desc || ""}</p>`;
        svc.appendChild(div);
      });
    }

    setText('[data-ac="menu-title"]', data.menu?.title || "Menu");
    const menu = document.querySelector('[data-ac="menu-items"]');
    if (menu) {
      menu.innerHTML = "";
      (data.menu?.items || []).forEach(m => {
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `<div><div class="name">${m.name || ""}</div><div class="desc">${m.desc || ""}</div></div>`;
        menu.appendChild(row);
      });
    }

    const testi = document.querySelector('[data-ac="testimonials"]');
    if (testi) {
      testi.innerHTML = "";
      (data.testimonials || []).forEach(t => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<div class="quote">"${t.quote || ""}"</div><div class="author">— ${t.author || "Client"}</div>`;
        testi.appendChild(card);
      });
    }

    const insta = document.querySelector('[data-ac="insta"]');
    if (insta && data.contact?.insta) {
      insta.href = data.contact.insta;
      insta.classList.remove("hidden");
    }

    const email = document.querySelector('[data-ac="email-btn"]');
    if (email && data.contact?.email) {
      email.href = `mailto:${data.contact.email}`;
    }

    setText('[data-ac="contact-note"]', data.contact?.note || "");
    setText('[data-ac="footer"]', `${data.siteName || ""} ${data.location ? "· " + data.location : ""}`.trim());

    const ld = {
      "@context": "https://schema.org",
      "@type": data.schema?.type || "LocalBusiness",
      "name": data.siteName || "",
      "areaServed": data.location || "",
      "description": data.hero?.subheadline || data.tagline || "",
      "sameAs": data.schema?.sameAs || []
    };
    const ldScript = document.getElementById("jsonld");
    if (ldScript) ldScript.textContent = JSON.stringify(ld, null, 2);
  }

  getJSON(endpoint)
    .then(render)
    .catch(() => {
      const heroLead = document.querySelector(".hero .lead");
      if (heroLead) heroLead.textContent = "We are updating content. Please check back.";
    });
})();
