# One of Us – website

Landing, support and privacy page for **One of Us – Random Games** (iPhone),
served by GitHub Pages at <https://geofffreyyy.github.io/oneofus-site/>.

Static HTML/CSS with a little vanilla JS. No build step, no framework,
no cookies, no analytics.

## App Store Connect URLs

- Support URL: `https://geofffreyyy.github.io/oneofus-site/#support`
- Privacy Policy URL: `https://geofffreyyy.github.io/oneofus-site/#privacy`

## Files

- `index.html` – the whole page (hero, games, features, FAQ, `#support`, `#privacy`)
- `styles.css` – all styles (colors are CSS variables at the top)
- `script.js` – EN/FR toggle (remembers the choice in `localStorage`)
- `assets/` – icon copies made from the app icon with `sips`

## Editing text (English + French)

Every piece of text exists twice, side by side:

```html
<span lang="en">Who goes first?</span><span lang="fr">Qui commence&nbsp;?</span>
<p lang="en">…</p>
<p lang="fr">…</p>
```

CSS hides whichever language is not active. Without JavaScript the page shows
English. Attributes that can't hold two spans (`aria-label`, `alt`) use a
`data-fr-…` twin, e.g. `aria-label="Language" data-fr-aria-label="Langue"`.
Add `?lang=fr` or `?lang=en` to a link to force a language.

When you change the privacy policy, update the effective date in both languages.
