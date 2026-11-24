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

  /* Zoom viewer: one <dialog> shared by every product image.
     Tap or click toggles zoom at that point; drag or scroll to move; + and -
     buttons (or keys) change size; Escape or Close leaves. */
  function createZoom() {
    if (typeof window.HTMLDialogElement !== "function" || !HTMLDialogElement.prototype.showModal) return null;

    var dialog = el("dialog", "zoom");
    dialog.setAttribute("aria-label", "Zoomed product image");
    var bar = el("div", "zoom__bar");
    var hint = el("p", "zoom__hint",
      (window.matchMedia("(hover: hover)").matches ? "Click" : "Tap") + " to zoom. Drag to move.");
    function button(cls, label, text) {
      var b = el("button", "zoom__btn " + cls, text);
      b.type = "button";
      b.setAttribute("aria-label", label);
      bar.appendChild(b);
      return b;
    }
    bar.appendChild(hint);
    var outBtn = button("", "Zoom out", "\u2212");
    var inBtn = button("", "Zoom in", "+");
    var closeBtn = button("", "Close", "\u00d7");
    var view = el("div", "zoom__view");
    view.tabIndex = 0;
    view.setAttribute("role", "region");
    view.setAttribute("aria-label", "Image. Use arrow keys to move, plus and minus to zoom.");
    var img = el("img", "zoom__img");
    img.draggable = false;
    view.appendChild(img);
    dialog.appendChild(bar);
    dialog.appendChild(view);
    document.body.appendChild(dialog);

    var ratio = 0.75, fit = 0, max = 0, width = 0, base = 0, token = 0, opener = null;

    // Change the image width, keeping the point under (cx, cy) where it is.
    function setWidth(w, cx, cy, fx, fy) {
      var before = img.getBoundingClientRect();
      if (fx === undefined) {
        fx = before.width ? (cx - before.left) / before.width : 0.5;
        fy = before.height ? (cy - before.top) / before.height : 0.5;
      }
      fx = Math.min(1, Math.max(0, fx));
      fy = Math.min(1, Math.max(0, fy));
      width = Math.min(max, Math.max(fit, w));
      img.style.width = width + "px";
      img.style.height = width * ratio + "px";
      var after = img.getBoundingClientRect();
      view.scrollLeft += after.left + fx * after.width - cx;
      view.scrollTop += after.top + fy * after.height - cy;
      var zoomed = width > fit + 1;
      view.classList.toggle("is-zoomed", zoomed);
      outBtn.disabled = !zoomed;
      inBtn.disabled = width >= max - 1;
    }
    function measure() {
      fit = Math.min(view.clientWidth, view.clientHeight / ratio);
      max = Math.max(base, fit * 2);
    }
    function centre() {
      var r = view.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    }
    function readable() { return Math.min(max, fit * 4); }
    function step(factor) { var c = centre(); setWidth(width * factor, c[0], c[1]); }

    function open(data, pageImg, e) {
      opener = e && e.currentTarget;
      var t = ++token;
      var o = pageImg.getBoundingClientRect();
      // Where on the picture did they tap? (keyboard: the middle)
      var tapped = e && e.detail > 0 && o.width;
      var fx = tapped ? (e.clientX - o.left) / o.width : 0.5;
      var fy = tapped ? (e.clientY - o.top) / o.height : 0.5;
      ratio = (data.height / data.width) || (pageImg.naturalHeight / pageImg.naturalWidth) || 0.75;
      base = (data.width || pageImg.naturalWidth || 1000) * (data.zoomSrc ? 2 : 1);
      img.alt = data.alt || "";
      img.src = data.src;
      // Show the small picture at once, swap in the sharp one when it arrives.
      if (data.zoomSrc) {
        var big = new Image();
        big.onload = function () { if (t === token && dialog.open) img.src = big.src; };
        big.src = data.zoomSrc;
      }
      img.style.width = img.style.height = "0px";
      document.documentElement.classList.add("zoom-lock");
      dialog.showModal();
      view.focus({ preventScroll: true });
      measure();
      // On phones the fitted picture is barely bigger than on the page,
      // so start zoomed in where they tapped.
      var c = centre();
      var start = fit < o.width * 1.4 ? readable() : fit;
      setWidth(start, c[0], c[1], fx, fy);
    }

    outBtn.addEventListener("click", function () { step(1 / 1.5); });
    inBtn.addEventListener("click", function () { step(1.5); });
    closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("close", function () {
      token++;
      document.documentElement.classList.remove("zoom-lock");
      if (opener) opener.focus({ preventScroll: true }); // Safari does not do this by itself
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "+" || e.key === "=") { step(1.5); e.preventDefault(); }
      else if (e.key === "-") { step(1 / 1.5); e.preventDefault(); }
    });

    // Mouse drag moves the picture (touch already scrolls by itself).
    var drag = null, moved = false;
    view.addEventListener("pointerdown", function (e) {
      moved = false;
      if (e.pointerType !== "mouse" || e.button !== 0 || e.target !== img) return;
      drag = { x: e.clientX, y: e.clientY, l: view.scrollLeft, t: view.scrollTop };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) { view.scrollLeft = drag.l - dx; view.scrollTop = drag.t - dy; }
    });
    window.addEventListener("pointerup", function () { drag = null; });
    window.addEventListener("pointercancel", function () { drag = null; });

    img.addEventListener("click", function (e) {
      if (moved) { moved = false; return; }
      setWidth(width > fit + 1 ? fit : readable(), e.clientX, e.clientY);
    });
    // A click on the empty area around the picture closes the viewer.
    view.addEventListener("click", function (e) { if (e.target === view && !moved) dialog.close(); });

    window.addEventListener("resize", function () {
      if (!dialog.open) return;
      var wasFit = width <= fit + 1, c = centre();
      measure();
      setWidth(wasFit ? fit : width, c[0], c[1]);
    });

    return { open: open };
  }
  var zoom = createZoom();

  function buildGallery(product, mainFrame, thumbs) {
    var imgs = (product.images || []).filter(Boolean);
    if (!imgs.length) return;
    var mainImg = el("img", "product__main-img");
    var current = imgs[0];
    setImage(mainImg, current);   // cover: loads straight away

    // The main image opens the zoom viewer (plain image in very old browsers).
    var zoomBtn = null;
    if (zoom) {
      zoomBtn = el("button", "zoom-open");
      zoomBtn.type = "button";
      zoomBtn.appendChild(mainImg);
      var badge = el("span", "zoom-open__badge", "Zoom");
      zoomBtn.appendChild(badge);
      zoomBtn.addEventListener("click", function (e) { zoom.open(current, mainImg, e); });
      mainFrame.appendChild(zoomBtn);
    } else {
      mainFrame.appendChild(mainImg);
    }
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
        current = data;
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
    details.appendChild(el("p", "product__desc", p.description));

    var incTitle = el("h3", "product__subhead", "What’s included");
    details.appendChild(incTitle);
    var list = el("ul", "included");
    (p.included || []).forEach(function (item) { list.appendChild(el("li", "", item)); });
    details.appendChild(list);
    if (p.compatibility) details.appendChild(el("p", "product__compat", p.compatibility));

    // DOM order = phone order: image, thumbnails right under it (so a tap shows
    // its result on screen), then details.
    article.appendChild(mainFrame);
    if (thumbs.children.length) article.appendChild(thumbs);
    article.appendChild(details);
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
