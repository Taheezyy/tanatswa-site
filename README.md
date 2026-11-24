# Tanatswa Inc website

A two-page static site (Home and Products). No build step, no framework: you edit plain files and upload them.

## Before you share the link

- [ ] Set the absolute `og:image` and `twitter:image` addresses in **both** pages, and uncomment and fill `og:url` (`https://<username>.github.io/<repo>/`). See step 4. Until then the share preview will show no picture.
- [ ] Upload **only the contents of `site/`**. Never upload `specs/`, `tests/` or `source-assets/`.
- [ ] Turn on two-factor authentication (2FA) on your GitHub and Payhip accounts.

IMPORTANT: this repository is **public**. Never put the kit's `.docx` or `.zip` files (or anything private) in it. Payhip delivers the files; this site only links to Payhip.

## Folder map

- `index.html` - Home page (animated logo, "Shop products" button)
- `products.html` - Products page
- `js/config.js` - **the file you edit**: prices, links, text, product images
- `css/styles.css` - colours and layout (colours are at the top)
- `assets/` - product images (WebP) and the share-preview image
- `.nojekyll` - tells GitHub Pages not to process the files with Jekyll (leave it there; some upload tools hide dot-files, so check it arrived)

## 1. Change a price, link or text

1. Open `js/config.js`.
2. Change only the text between the quote marks, for example `price: "AED 25.50"` or `buyUrl: "https://payhip.com/b/vXpc6"`. The price lives only in `config.js` (it is not written in the page descriptions). Links must start with `https://`.
3. `storeUrl` is the Payhip store link used in the footer of both pages. `contactEmail` is the footer email.
4. Save, upload the file again (see step 3) and refresh the site after a minute.

Note: `index.html` and `products.html` also hold the same store link and email as a backup for visitors whose browser blocks JavaScript: the footer of both pages, plus the "See our products" line in `products.html`. If you ever change them in `config.js`, update those places too (search for `payhip.com/VTANATSWA` and `tanatswainc@gmail.com`).

## 2. Add a new product

1. Put the product pictures in `assets/` (WebP, about 1000 px wide, under 300 KB each).
2. In `js/config.js`, inside the `products: [ ... ]` list, copy the whole `{ ... }` block of the existing product.
3. Paste it after the existing block and put a comma `,` between the two blocks.
4. Give it a new unique `id` (lowercase, dashes), then change the name, price, description, `buyUrl`, list and images.
   Every image needs `alt` text describing what is in the picture, and the real `width` and `height` in pixels.
5. The "More products coming soon" card is the `comingSoon` section in the same file. Set it to `null` to hide it.

## 3. Publish with GitHub Pages (free)

1. On github.com click **New repository**, name it (for example `tanatswa-site`), set it to **Public**, and create it.
2. Click **Add file > Upload files** and drag in the **contents** of the `site` folder (`index.html`, `products.html`, `css`, `js`, `assets`, the icon files, `.nojekyll`), not the folder itself. Commit.
3. Go to **Settings > Pages**. Under **Build and deployment** choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`. To update later, upload the changed files again (same names replace the old ones).

## 4. Fix the share preview image (og:image)

WhatsApp, Facebook and X need the **full web address** of the preview image, so the relative path in the pages will not show a picture until you set it.

1. Work out your address: `https://YOUR-USERNAME.github.io/YOUR-REPO/assets/og-image.jpg` (use your real username and repo name).
2. In both `index.html` and `products.html`, find these two lines in the `<head>` and replace `assets/og-image.jpg` with that full address:
   - `<meta property="og:image" content="assets/og-image.jpg">`
   - `<meta name="twitter:image" content="assets/og-image.jpg">`
3. Upload the two files again. Social apps cache previews, so a new link may take a while to refresh.

## Notes

- The site uses the Outfit font from Google Fonts and falls back to a standard sans-serif if it cannot load.
- The Home animation respects the visitor's "reduce motion" setting.
- Images were made from the listing artwork. The "What's included" image was edited to remove an unverified delivery claim, and the cover was cropped to remove the app badges, so the site only claims Word and WPS Office.
