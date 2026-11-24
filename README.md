# Tanatswa Inc website

A two-page static site (Home and Products). No build step, no framework: you edit plain files, commit and push.

Live at https://taheezyy.github.io/tanatswa-site/

## Before you share the link

- [x] Share-preview addresses are set in both pages (see step 4).
- [x] Turn on two-factor authentication (2FA) on your GitHub and Payhip accounts.
- [ ] Open the live site on a real iPhone and a real Android phone, and from a link in WhatsApp and Instagram.

IMPORTANT: this repository is **public**, including its history. Never put the kit's `.docx` or `.zip` files (or anything private) in it. Payhip delivers the files; this site only links to Payhip.

## Folder map

- `index.html` - Home page (animated logo, "Shop products" button)
- `products.html` - Products page
- `js/config.js` - **the file you edit**: prices, links, text, product images
- `css/styles.css` - colours and layout (colours are at the top)
- `assets/` - product images (WebP; `-large` copies are for zooming) and the share-preview image
- `favicon.ico`, `favicon.png`, `apple-touch-icon.png` - the site icon
- `.nojekyll` - tells GitHub Pages not to process the files with Jekyll (leave it there)

## 1. Change a price, link or text

1. Open `js/config.js`.
2. Change only the text between the quote marks, for example `price: "AED 25.50"` or `buyUrl: "https://payhip.com/b/vXpc6"`. The price lives only in `config.js` (it is not written in the page descriptions). Links must start with `https://`.
3. `storeUrl` is the Payhip store link used in the footer of both pages. `contactEmail` is the footer email.
4. Save, then commit and push (see step 3). Refresh the live site after a minute.

If the Products page only shows "See our products on the Payhip store", there is a typo in `config.js` (usually a missing comma or quote mark).

Note: `index.html` and `products.html` also hold the same store link and email as a backup for visitors whose browser blocks JavaScript: the footer of both pages, plus the "See our products" line in `products.html`. If you ever change them in `config.js`, update those places too (search for `payhip.com/VTANATSWA` and `tanatswainc@gmail.com`).

## 2. Add a new product

1. Put the product pictures in `assets/` (WebP, about 1000 px wide, under 300 KB each). Optional: add a copy at exactly twice the width and height and name it in `zoomSrc`, so the picture stays sharp when a visitor zooms in.
2. In `js/config.js`, inside the `products: [ ... ]` list, copy the whole `{ ... }` block of the existing product.
3. Paste it after the existing block and put a comma `,` between the two blocks.
4. Give it a new unique `id` (lowercase, dashes), then change the name, price, description, `buyUrl`, list and images.
   Every image needs `alt` text describing what is in the picture, and the real `width` and `height` in pixels.
5. The "More products coming soon" card is the `comingSoon` section in the same file. Set it to `null` to hide it.

## 3. Save your changes and publish

To save a change to GitHub, run these in this folder:

```
git add .
git commit -m "Describe what you changed"
git push
```

The site is published with GitHub Pages (**Settings > Pages**: deploy from branch **main**, folder **/ (root)**). Every push to `main` updates the live site after a minute or two.

## 4. Share preview image

WhatsApp, Facebook and X need **full web addresses**. They are set for https://taheezyy.github.io/tanatswa-site/. If the site ever moves (new repository name, username or domain), update these three lines in the `<head>` of **both** `index.html` and `products.html`:

- `og:url`
- `og:image`
- `twitter:image`

Then commit and push. Social apps cache previews, so a change may take a while to show.

## Notes

- The site uses the Outfit font, hosted in `assets/fonts/` (licence in `OFL.txt`, keep it there). It covers Latin letters; other alphabets such as Arabic fall back to the device's own font.
- The Home animation respects the visitor's "reduce motion" setting.
- Images were made from the listing artwork. The "What's included" image was edited to remove an unverified delivery claim, and the cover was cropped to remove the app badges. The apps the kit works with are listed in `js/config.js` (`compatibility`).
