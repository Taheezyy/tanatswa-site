/* =====================================================================
   TANATSWA INC - SITE CONTENT (EDIT THIS FILE)
   ---------------------------------------------------------------------
   Everything you are likely to change lives here: prices, links, text,
   image paths. You normally do not need to touch the HTML or CSS. The only
   exceptions (footer backup links, share-preview address) are listed in
   README.md.

   - Keep every quote mark ("), comma (,) and bracket exactly as it is.
   - Change only the text between the quote marks.
   - Image paths are relative to the site folder (no leading slash).
   ===================================================================== */

window.TANATSWA = {
  // Your Payhip store (used by the "Visit our Payhip store" link in the footer).
  storeUrl: "https://payhip.com/VTANATSWA",

  // Email shown and linked in the footer of every page.
  contactEmail: "tanatswainc@gmail.com",

  // The quiet card shown under the products. Set to null to hide it.
  comingSoon: {
    heading: "More products coming soon",
    body: "New digital tools for job seekers and students are on the way."
  },

  // One object per product. To add a product, copy a whole { ... } block,
  // paste it after the last one (with a comma between blocks) and edit it.
  products: [
    {
      id: "cv-builder-master-kit",
      name: "CV Builder Master Kit",
      price: "AED 25.50",
      description:
        "Editable CV and cover letter templates for Gulf job seekers. " +
        "Pick a style, add your details and export a polished A4 document.",

      // Where the "Buy on Payhip" button goes (opens in a new tab).
      buyUrl: "https://payhip.com/b/vXpc6",
      buyLabel: "Buy on Payhip",

      // Bullet list under "What's included".
      included: [
        "9 editable Word files, A4",
        "3 Classic CVs with photo",
        "3 ATS-friendly CVs",
        "3 matching cover letters",
        "3 colours: Navy, Charcoal, Black"
      ],

      // Single line under the list.
      compatibility: "Works with Microsoft Word and WPS Office",

      // Pictures. The FIRST one is the large main image; every image also
      // becomes a clickable thumbnail. width/height are the real pixel size
      // of the file (they stop the page jumping while it loads).
      images: [
        {
          src: "assets/cover.webp", width: 1000, height: 750,
          alt: "CV Builder Master Kit cover showing sample CV templates"
        },
        {
          src: "assets/included.webp", width: 1000, height: 750,
          alt: "Overview of the 9 included files: 3 Classic CVs, 3 ATS-friendly CVs and 3 cover letters"
        },
        {
          src: "assets/styles.webp", width: 1000, height: 750,
          alt: "The Classic and ATS-friendly CV styles side by side"
        },
        {
          src: "assets/colours.webp", width: 1000, height: 750,
          alt: "The three colour options: Navy, Charcoal and Black"
        }
      ]
    }
  ]
};
