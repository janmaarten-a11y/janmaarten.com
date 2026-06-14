# [janmaarten.com](https://janmaarten.com)

Personal portfolio and blog. Built on [Ghost](https://ghost.org/) with a heavily customised theme that began as a fork of [Kyoto](https://themex.studio/kyoto/) and has since diverged into its own thing — codenamed **portforkioto**.

Issues with the site or its accessibility can be submitted [here](https://github.com/janmaarten-a11y/janmaarten.com/issues/new/choose).

## What this theme is

A content-forward Ghost theme designed for long-form writing and a portfolio of accessibility, design-systems and front-end work. The visual identity is built on the **viridis** colour palette — a perceptually uniform, colour-blind-safe gradient extended into a full design-token system.

Key characteristics:

- **OKLCH design tokens** in `tokens/tokens.json`, generated into CSS custom properties by `tokens/generate-variables.js` → `assets/css/base/variables.css`
- **Fluid typography & spacing** via `clamp()` — every type step and spacing token scales smoothly between 320px and 1360px viewports without breakpoints
- **CUBE CSS** methodology (Composition / Utility / Block / Exception) layered on top of the legacy Kyoto styles, progressively replacing them
- **Theme + mode model**: `data-theme="viridis"` + `data-mode="light|dark"` (absent = follow OS). Light is the brand canon; dark is fully designed, not an afterthought.
- **WCAG 2.2 AA** target, audited via subagent + manual checks; reduced-motion honoured throughout
- **Custom web components** for editorial long-form (sidenotes, pull quotes, citation cards, footnotes) authored in Ghost's HTML card editor


## Custom components

These are authored in Ghost's HTML card editor and rendered by the theme's CSS / web-component JS. All have JS-off fallbacks where applicable.

### Accessible toggle

Native `<details>/<summary>` styled to match Ghost's toggle card. No JS — keyboard, screen reader, and open/close state handled by the browser.

```html
<details class="accessible-toggle">
  <summary>Heading text</summary>
  <div class="toggle-content">
    <p>Content here</p>
  </div>
</details>
```

### Private YouTube

`<private-youtube>` shows a static thumbnail + play button. Click loads a privacy-hardened `youtube-nocookie.com` iframe with full sandbox, strict referrer policy, and all Permissions Policy directives denied. No cookies or tracking until play.

```html
<private-youtube videoid="VIDEO_ID" videotitle="Video title">
  <a href="https://www.youtube.com/watch?v=VIDEO_ID">Watch on YouTube</a>
</private-youtube>
```

The `<a>` fallback renders if JS fails. Optional `start` attribute for a timestamp in seconds.

### Sidenotes — margin variant

`<footnote-side>` — Tufte-style numbered notes in the right margin on ≥1440px screens; toggle inline below the paragraph on narrower viewports. Auto-numbered across the post. Shares a numbering counter with `<footnote-inline>`.

```html
Body text<footnote-side>This appears in the right margin on desktop,
toggles inline on mobile.</footnote-side> and the sentence continues.
```

### Sidenotes — inline variant

`<footnote-inline>` — always inline, expands below the parent paragraph when the superscript is clicked. Use when you want the footnote behaviour without the margin treatment.

```html
Body text<footnote-inline>This expands below the paragraph when
the number is clicked.</footnote-inline> and the sentence continues.
```

### Unnumbered side note

`<side-note>` — CSS-only margin aside, no numbering, no JS. Floats into the right margin at ≥1440px; renders inline as part of the paragraph below that.

```html
<p>The Enlightenment lasted roughly 150 years<side-note>Though
historians disagree on exact boundaries.</side-note>, producing
an extraordinary flowering of ideas.</p>
```

### Pull quote

`<pull-quote>` — editorial pull-quote that floats into the right gutter at ≥1440px with body text narrowing beside it; renders as a block-quote-style aside below that breakpoint. Two variants:

```html
<!-- Duplicative: text also exists elsewhere in the post -->
<pull-quote>Key insight repeated for emphasis.</pull-quote>

<!-- Non-duplicative (inline attr): text only lives here -->
<pull-quote inline>Key insight that appears only once.</pull-quote>
```

The duplicative variant uses `role="doc-pullquote"` + `aria-hidden="true"` (DPUB-ARIA).

### Citation card

Structured blockquote with contextual label, quotation, and proper `<cite>` attribution. CSS-only — no JS. Pairs with a decorative quote-mark glyph in the corner.

```html
<figure class="citation-card">
  <figcaption class="citation-label">Bell's Exhibit A</figcaption>
  <blockquote>
    <p>"One should never so exhaust a subject that nothing is left
    for readers to do."</p>
  </blockquote>
  <cite><span class="citation-source">The Spirit of the Laws</span> —
  <span class="citation-author">Baron de Montesquieu</span>,
  <time datetime="1750">1750</time></cite>
</figure>
```

### Link tooltips

External links inside `.gh-content` show a small tooltip on hover/focus with the domain name. Opt into rich previews per-link with `data-tooltip-*` attributes:

```html
<a href="https://example.com/article"
   data-tooltip-title="Article title"
   data-tooltip-description="A short description."
   data-tooltip-image="https://example.com/og.jpg">link text</a>
```

Opt-out: `data-no-tooltip` on any link. Hidden on touch-only devices.

### Dense lists

Opt-in pattern for sections with long reference / footnote-style lists. Mark the section's heading with `class="dense-section"`; mark a later heading with `class="dense-section-end"` to close it (omit if it's the final section).

```html
<h2 class="dense-section">References</h2>
<ol>
  <li>Bringhurst, Robert. <em>The Elements of Typographic Style</em>. 2004.</li>
  <li>Tufte, Edward. <em>The Visual Display of Quantitative Information</em>. 2001.</li>
</ol>
<h2 class="dense-section-end">Next section</h2>
```

### Long-form opt-in features (`#long-form` internal tag)

Tagging a post with the internal tag `#long-form` switches in:
- EB Garamond body type with a larger reading scale
- Reading progress bar at the top of the viewport
- Drop cap (`<p class="dropcap">…</p>`)

### Table of contents (`#show-toc` internal tag)

Tagging a post with `#show-toc` enables a fixed left-sidebar TOC on desktop (≥1440px) with a sliding viridis active marker, and a collapsible `<details>` TOC on narrower screens. Powered by [tocbot](https://tscanlin.github.io/tocbot/). Add `class="toc-ignore"` to any heading to exclude it.

### Callout cards — labelled variants

Ghost's native callout card colours are mapped to semantic labels:

| Colour | Label | Use for |
|---|---|---|
| Blue | Side note | Tangential context |
| Green | Tip | Helpful advice |
| Yellow | Notice | Heads-up / important |
| Red | Content warning | Sensitive content |
| Pink | Personal | First-person aside |
| Purple | Definition | Glossary-style terms |
| Grey / White / Accent | *(no label)* | Pure background variants |

Pick the colour in Ghost's callout card UI — no HTML editing needed.

## Theme system

`<html data-theme="viridis" data-mode="...">` on every page.

- **Theme** = design language. Currently only `viridis`; the architecture leaves room for CRT, Retro, Pixel themes etc. without coupling them to colour-scheme.
- **Mode** = light / dark / system. `data-mode` is absent when the user pref is `system`, letting `prefers-color-scheme` take over.
- Mode is set via the footer `<select>` ("Appearance" — System / Light / Dark) or the binary moon/sun toggle in the header.
- Smooth 220ms transition during a mode swap (skipped under `prefers-reduced-motion: reduce`).

localStorage keys: `jm-theme` + `jm-mode`. Legacy single-key `theme` from the binary-toggle era is migrated on first load.

## Accessibility

- WCAG 2.2 AA target
- Skip-to-content link on every page
- `aria-pressed` on the header mode toggle; `<label>` + `<select>` for the footer mode switcher
- Full keyboard support, visible 3px focus rings, focus-visible-only outlines
- `prefers-reduced-motion` honoured on theme transitions, card ring animations, heading-anchor pulses, and component reveals
- `rel="external noopener"` auto-applied to external links
- ARIA landmarks throughout (`<header>`, `<main>`, `<nav>`, `<footer>` with `aria-labelledby` groups)
- Native `<details>/<summary>` over inaccessible ARIA toggle patterns

## Tech notes

- **Build**: Gulp 5; CSS via PostCSS (postcss-import, autoprefixer, cssnano), JS concatenated + minified
- **No JS framework / bundler** beyond Gulp. Vanilla web components, no React/Vue.
- **Code highlighting**: Prism with a custom Monokai override that uses the cool `--color-dark` token instead of warm `#272822`, so languaged and un-languaged `<pre>` blocks share one surface
- **Deploy**: GitHub Actions → `TryGhost/action-deploy-theme@v1`. Pushing to `main` auto-deploys to production; branches deploy via `workflow_dispatch`.

## Licence

Theme code: MIT (see [`LICENSE`](./LICENSE)). Content (writing, images, illustrations) is © Jan Maarten, all rights reserved.

## Inspirations

This theme stands on the shoulders of others. Direct credits:

- **[Themex Studio](https://themex.studio/kyoto/)** — the original Kyoto Ghost theme that everything here was forked from
- **[Andy Bell](https://andy-bell.co.uk/) / [Set Studio](https://set.studio/)** — the [CUBE CSS](https://cube.fyi/) methodology and the `.flow`, `.cluster`, `.repel`, `.wrapper` composition primitives used everywhere
- **[Maggie Appleton](https://maggieappleton.com/)** — inspiration for the footnote, citation, table-of-contents, and other editorial long-form components
- **[Tufte CSS](https://edwardtufte.github.io/tufte-css/)** — direct CSS basis for `<footnote-side>` and `<side-note>` (the float + clear margin sidenote pattern)
- **[Mat “Wilto” Marquis](https://wil.to/)** — viridis gradient on the hero heading and the broader theme-switching pattern
- **[Josh Collinsworth](https://joshcollinsworth.com/)** — sidenote and pull-quote treatments
- **[Adrian Roselli](https://adrianroselli.com/)** — accessible heading anchor patterns
