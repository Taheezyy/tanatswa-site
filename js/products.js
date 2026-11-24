/* Products page: builds the product section and the coming-soon card
   from window.TANATSWA (js/config.js). Nothing to edit here for normal use. */
(function () {
  "use strict";
  var cfg = window.TANATSWA;
  var root = document.getElementById("products-root");
  if (!root) return;

  var FALLBACK_STORE = "https://payhip.com/VTANATSWA";

  // Only allow https links coming from config.js.
  function safeUrl(u) { return typeof u === "string" && /^https:\/\//i.test(u) ? u : null; }

  // Small helper: create an element with a class and optional text.
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function setImage(img, data) {
    img.src = data.src;
    img.alt = data.alt || "";
    if (!data.alt) console.warn("config.js: image is missing alt text:", data.src);
    if (typeof data.width === "number") img.width = data.width;
    if (typeof data.height === "number") img.height = data.height;
  }

  function buildGallery(product, mainFrame, thumbs) {
    var imgs = (product.images || []).filter(Boolean);
    if (!imgs.length) return;
    var mainImg = el("img", "product__main-img");
    setImage(mainImg, imgs[0]);   // cover: loads straight away
    mainFrame.appendChild(mainImg);
    if (imgs.length < 2) return;

    var buttons = [];
    imgs.forEach(function (data, i) {
      var btn = el("button", "thumb");
      btn.type = "button";
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      var img = el("img");
      setImage(img, data);
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", function () {
        setImage(mainImg, data);
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      });
      buttons.push(btn);
      thumbs.appendChild(btn);
    });
  }

  function buildProduct(p, i) {
    var article = el("article", "product card");
    article.setAttribute("aria-labelledby", "name-product-" + i);

    var mainFrame = el("div", "product__image frame");
    var thumbs = el("div", "product__thumbs");
    thumbs.setAttribute("role", "group");
    thumbs.setAttribute("aria-label", "Product images");
    buildGallery(p, mainFrame, thumbs);

    var details = el("div", "product__details");
    var name = el("h2", "product__name", p.name);
    name.id = "name-product-" + i;
    details.appendChild(name);
    details.appendChild(el("p", "product__price", p.price));
    details.appendChild(el("p", "product__desc", p.description));

    var buy = el("a", "btn btn--buy", p.buyLabel || "Buy");
    var href = safeUrl(p.buyUrl);
    if (!href) {
      console.warn("config.js: product #" + (i + 1) + " has no valid https buyUrl; using the store link.");
      href = safeUrl(cfg.storeUrl) || FALLBACK_STORE;
    }
    buy.href = href;
    buy.target = "_blank";
    buy.rel = "noopener"; // noopener only: do NOT add noreferrer, Payhip referral stats depend on the Referer
    var note = el("p", "buy-note", "Secure checkout on Payhip. Opens in a new tab.");
    note.id = "note-product-" + i;
    buy.setAttribute("aria-describedby", note.id);
    details.appendChild(buy);
    details.appendChild(note);

    var incTitle = el("h3", "product__subhead", "What’s included");
    details.appendChild(incTitle);
    var list = el("ul", "included");
    (p.included || []).forEach(function (item) { list.appendChild(el("li", "", item)); });
    details.appendChild(list);
    if (p.compatibility) details.appendChild(el("p", "product__compat", p.compatibility));

    // DOM order = phone order: image, details, thumbnails.
    article.appendChild(mainFrame);
    article.appendChild(details);
    if (thumbs.children.length) article.appendChild(thumbs);
    return article;
  }

  var list = (cfg && Array.isArray(cfg.products)) ? cfg.products : [];
  var shown = 0;
  list.forEach(function (p, i) {
    try {
      root.appendChild(buildProduct(p, i));
      shown++;
    } catch (e) {
      console.error("config.js: product #" + (i + 1) + " could not be shown:", e);
    }
  });
  // Visible fallback stays only if nothing could be rendered.
  var fallback = root.querySelector(".products-fallback");
  if (shown && fallback) fallback.parentNode.removeChild(fallback);

  if (cfg && cfg.comingSoon) {
    var soon = el("section", "coming-soon");
    soon.setAttribute("aria-labelledby", "soon-title");
    var h = el("h2", "coming-soon__title", cfg.comingSoon.heading);
    h.id = "soon-title";
    soon.appendChild(h);
    soon.appendChild(el("p", "", cfg.comingSoon.body));
    root.appendChild(soon);
  }
})();
