# Component Test Kitchen Sink

This post tests all custom components and native Ghost/Kyoto features together. Add the `#show-toc` internal tag to enable the table of contents sidebar.

---

## Typography Basics

Regular paragraph text. The quick brown fox jumps over the lazy dog. This paragraph exists to establish a baseline of normal body text so you can see how the custom components interact with regular content flow. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at sapien nec nisi tincidunt fermentum vitae id urna.

A second paragraph to establish vertical rhythm. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Heading Level 3

Some body text under a heading to test the TOC hierarchy.

#### Heading Level 4

And a level 4 heading for nested TOC entries.

---

## Side Notes

This section tests the `<footnote-side>` web component, which shows numbered notes in the right margin on wide screens and as toggleable inline notes on narrow screens.

Sidenotes are a typographic convention popularised by Edward Tufte that keeps supplementary information close to the text it references, rather than banishing it to the bottom of the page as endnotes. The reader can saccade over to the margin instantly to skim the note and back, improving information density without interrupting flow.

<!--kg-card-begin: html-->
<p>The Enlightenment philosophers wrote in ways that challenged their readers<footnote-side>The term "Enlightenment" was retroactively applied to a period spanning roughly 1650–1800. The thinkers themselves didn't use the label consistently.</footnote-side>, making them grapple with difficult concepts, presenting opposing viewpoints, and encouraging them to develop their own judgements.</p>
<!--kg-card-end: html-->

Here's some text between the two side notes to create spacing and test how multiple notes coexist in the margin.

<!--kg-card-begin: html-->
<p>Bringhurst comments in <em>The Elements of Typographic Style</em> that sidenotes "give more life and variety to the page and are the easiest of all to find and read."<footnote-side>Robert Bringhurst, <em>The Elements of Typographic Style</em>, 4th edition, 2004. Bringhurst himself uses sidenotes extensively throughout the book, naturally.</footnote-side> This is widely considered the definitive reference on Western typography.</p>
<!--kg-card-end: html-->

A regular paragraph after sidenotes to confirm flow resumes normally. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

---

## Inline Notes

This section tests the `<footnote-inline>` web component — footnotes that expand inline (below the paragraph) when clicked, regardless of viewport width.

<!--kg-card-begin: html-->
<p>What I really mean when I say "AI" is large language models<footnote-inline>LLMs like ChatGPT, Claude, Gemini, Copilot, etc. Since AI originally meant something else — and since LLMs aren't actually intelligent — the pedantic side of me always feels compelled to make this distinction.</footnote-inline>, though the terms are widely considered interchangeable at this point.</p>
<!--kg-card-end: html-->

Another paragraph to establish normal flow between footnoted paragraphs.

<!--kg-card-begin: html-->
<p>There's evidence that AI actually only makes you feel more productive<footnote-inline>Several studies suggest a "productivity illusion" — users report feeling faster while measurable output stays flat or decreases, likely because time spent fixing AI-generated errors offsets the initial speed gain.</footnote-inline>, while in fact, it slows you down. This matches my own experience.</p>
<!--kg-card-end: html-->

<!--kg-card-begin: html-->
<p>AI's ability to replace workers is overstated<footnote-inline>Workers do — and are — a great deal more than the sum of a task list, as some companies who have been forced to re-hire after layoffs have already discovered. Unfortunately, most executives still don't seem to be deterred from trying.</footnote-inline>, it should be noted. But the job market impact is real for those at the entry level.</p>
<!--kg-card-end: html-->

---

## Citation Cards

Testing the structured blockquote with title and attribution.

<!--kg-card-begin: html-->
<figure class="citation-card">
  <figcaption class="citation-label">Bell's Exhibit A</figcaption>
  <blockquote>
    <p>"One should never so exhaust a subject that nothing is left for readers to do. The point is not to make them read, but to make them think."</p>
  </blockquote>
  <cite><span class="citation-source">The Spirit of the Laws</span> — <span class="citation-author">Baron de Montesquieu</span>, <time datetime="1750">1750</time></cite>
</figure>
<!--kg-card-end: html-->

A paragraph between citation cards to test spacing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

<!--kg-card-begin: html-->
<figure class="citation-card">
  <figcaption class="citation-label">On the Purpose of Footnotes</figcaption>
  <blockquote>
    <p>"Sidenotes give more life and variety to the page and are the easiest of all to find and read. If carefully designed, they need not enlarge either the page or the cost of printing it."</p>
  </blockquote>
  <cite><span class="citation-source">The Elements of Typographic Style</span> — <span class="citation-author">Robert Bringhurst</span>, <time datetime="2004">2004</time></cite>
</figure>
<!--kg-card-end: html-->

---

## Private YouTube

Testing the privacy-hardened YouTube embed component.

<!--kg-card-begin: html-->
<private-youtube videoid="jfKfPfyJRdk" videotitle="lofi hip hop radio — beats to relax/study to">
  <a href="https://www.youtube.com/watch?v=jfKfPfyJRdk">Watch lofi hip hop radio on YouTube</a>
</private-youtube>
<!--kg-card-end: html-->

---

## Accessible Toggle

Testing the native `<details>/<summary>` toggle that replaces Ghost's inaccessible toggle card.

<!--kg-card-begin: html-->
<details class="accessible-toggle">
  <summary>What is CUBE CSS?</summary>
  <div class="toggle-content">
    <p>CUBE CSS stands for <strong>Composition, Utility, Block, Exception</strong>. It's a CSS methodology created by Andy Bell that embraces the cascade rather than fighting it. It layers styles from broad compositions (layout primitives like flow and cluster) through utilities (single-purpose classes) down to specific blocks (component styles) with exceptions for variant states.</p>
    <p>The key insight is that most styling should happen at the composition and utility layers, with blocks only needed for truly component-specific styles that can't be achieved through composition.</p>
  </div>
</details>
<!--kg-card-end: html-->

<!--kg-card-begin: html-->
<details class="accessible-toggle">
  <summary>Why use design tokens?</summary>
  <div class="toggle-content">
    <p>Design tokens are the single source of truth for visual design decisions — colors, spacing, typography, and other style values. By defining them once in a structured format (JSON), they can be transformed into CSS custom properties, Tailwind config, Figma variables, or any other target format.</p>
    <p>This means changing a color in one place updates it everywhere consistently, and the design vocabulary is shared between designers and developers.</p>
  </div>
</details>
<!--kg-card-end: html-->

---

## Native Ghost Components

### Bookmark Card

Below is a Ghost bookmark card (paste a URL in the editor to create one):

> **Note:** Bookmark cards can't be created via HTML — paste a URL directly in the Ghost editor and select "Create bookmark" to test this.

### Blockquotes

A standard Ghost blockquote:

> The computer world is a continual war over software politics and paradigms, where we fight on for vindication and the last laugh.

And a wide/alternative blockquote (use the blockquote toolbar button twice):

> Typography is the craft of endowing human language with a durable visual form, and thus with an independent existence.

### Callout Card

> 💡 **Tip:** This is a Ghost callout card. You can create these natively in the Ghost editor by typing `/callout`. They support emoji icons and coloured backgrounds.

### Code Block

```css
/* Example: fluid type scale using clamp() */
:root {
    --size-step-0: clamp(1.125rem, 0.9rem + 0.56vw, 1.5rem);
    --size-step-1: clamp(1.35rem, 1.05rem + 0.75vw, 1.875rem);
    --size-step-2: clamp(1.62rem, 1.22rem + 1vw, 2.34rem);
}

.wrapper {
    max-width: calc(1034px + 2 * 5vw);
    padding-inline: 5vw;
    margin-inline: auto;
}
```

### Image (Wide)

> **Note:** Add a wide image in the Ghost editor using the image card → expand to "Wide" width to test `.kg-width-wide` behaviour within the `.kg-canvas` grid.

### Gallery

> **Note:** Add a gallery card with 3–4 images in the Ghost editor to test the PhotoSwipe lightbox integration.

### Divider

The horizontal rules between sections above are Ghost dividers (`---` in Markdown).

---

## Mixed Component Stress Test

This section mixes multiple component types in close proximity to stress-test layout interactions.

<!--kg-card-begin: html-->
<p>The original Xanadu vision was ambitious<footnote-side>Ted Nelson coined the term "hypertext" in 1963 as part of his Project Xanadu vision — two decades before Berners-Lee built the World Wide Web.</footnote-side>. Unreasonably ambitious. The feature list was enormous.</p>
<!--kg-card-end: html-->

<!--kg-card-begin: html-->
<figure class="citation-card">
  <figcaption class="citation-label">On Hypertext</figcaption>
  <blockquote>
    <p>"The most useful books are those that the readers write half of themselves."</p>
  </blockquote>
  <cite><span class="citation-author">Voltaire</span></cite>
</figure>
<!--kg-card-end: html-->

<!--kg-card-begin: html-->
<p>Perhaps you sense the problem<footnote-inline>Solving all the things all at once gets tricky. Xanadu became a sad parable, when it should have been a piece of speculative design — a set of seeds scattered into the wind.</footnote-inline>. Solving all the things all at once gets tricky.</p>
<!--kg-card-end: html-->

<!--kg-card-begin: html-->
<details class="accessible-toggle">
  <summary>What happened to Project Xanadu?</summary>
  <div class="toggle-content">
    <p>Xanadu's failure to mature into a widespread, usable commercial product makes great fodder for a dramatic cover story. Yet the historical skirmishes and financial flops are the <em>least</em> interesting thing about Xanadu. The most interesting part is its pattern language — the design ideas it pioneered that are now showing up piecemeal across the modern web.</p>
  </div>
</details>
<!--kg-card-end: html-->

A regular paragraph to re-establish flow. Then another side note to verify numbering continues correctly across sections:

<!--kg-card-begin: html-->
<p>Curiously enough, there appear to be rogue seedlings sprouting around the web<footnote-side>A number of Xanadu's design patterns are showing up in modern manifestations — hover previews, transclusion, bidirectional links. People are building Xanadu without knowing what Xanadu is.</footnote-side>. People are building Xanadu without knowing what Xanadu is. Which is the essence of a good pattern language.</p>
<!--kg-card-end: html-->

---

## Long-form Typography Test

This section has enough body text to test reading rhythm and the interaction between the TOC, sidenotes, and standard paragraph flow.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?

### A Subheading for TOC Depth

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

### Another Subheading

Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

> Block quote amidst body text to test visual rhythm. The best practices for accessibility are not clear yet for anchor positioning. As such, this may not be something you want to deploy in production, even as a progressive enhancement.

Final paragraph. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
