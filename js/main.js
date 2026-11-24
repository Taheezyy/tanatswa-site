/* Shared script for every page: fills the footer from config.js.
   The footer HTML already contains the same values as a fallback. */
(function () {
  "use strict";
  var cfg = window.TANATSWA || {};

  // Only allow https links coming from config.js.
  function safeUrl(u) { return typeof u === "string" && /^https:\/\//i.test(u) ? u : null; }

  // Copyright year (static 2026 stays in the HTML if this script does not run).
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Payhip store links.
  if (safeUrl(cfg.storeUrl)) {
    document.querySelectorAll("[data-store-link]").forEach(function (a) {
      a.href = cfg.storeUrl;
    });
  }

  // Contact email links.
  if (cfg.contactEmail) {
    document.querySelectorAll("[data-contact-email]").forEach(function (a) {
      a.href = "mailto:" + cfg.contactEmail;
      a.textContent = cfg.contactEmail;
    });
  }
})();
