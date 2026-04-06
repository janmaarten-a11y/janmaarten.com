/**
 * <pull-quote> web component
 *
 * Two variants:
 *
 * 1. Duplicative (default) — repeats text from the article body for
 *    visual emphasis. Hidden from assistive technology via aria-hidden
 *    and role="doc-pullquote" (DPUB-ARIA).
 *
 * 2. Non-duplicative (inline attribute) — text appears only once in the
 *    document, promoted visually. No aria-hidden; stays in reading order.
 *
 * Desktop (≥1440px): a <span> with float:right is inserted into the
 * next sibling paragraph. Body text doesn't narrow — the float pushes
 * into the right gutter via negative margin (same as footnote-side).
 *
 * Mobile (<1440px): the original <pull-quote> element is shown as a
 * full-width block between paragraphs.
 *
 * Ghost HTML cards render as bare elements inside .gh-content (wrapped
 * only in <!--kg-card-begin: html--> comments, NOT in a .kg-html-card
 * div). So the JS works directly from the element itself — finding the
 * next sibling and inserting the float span there.
 *
 * Usage in Ghost HTML card (always its own card, before the paragraph
 * the pull-quote should float beside):
 *
 *   <pull-quote>The key insight from this article.</pull-quote>
 *   <pull-quote inline>The key insight from this article.</pull-quote>
 *
 * If JS fails, the content renders as readable text in both cases.
 */
class PullQuote extends HTMLElement {
    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        var isInline = this.hasAttribute('inline');

        if (!isInline) {
            this.setAttribute('role', 'doc-pullquote');
            this.setAttribute('aria-hidden', 'true');
        }

        // Find the next sibling element (paragraph, list, etc.)
        // The <pull-quote> is a direct child of .gh-content, so
        // nextElementSibling is the next content block.
        var next = this.nextElementSibling;
        while (next && (next.nodeType !== 1 || next.tagName === 'STYLE')) {
            next = next.nextElementSibling;
        }
        if (!next) return;

        // Build a <span> for the desktop float — <span> is phrasing
        // content, valid inside <p>, and can be styled as block + float
        var floater = document.createElement('span');
        floater.className = 'pull-quote-float';
        if (isInline) floater.classList.add('pull-quote-float--inline');
        if (!isInline) {
            floater.setAttribute('role', 'doc-pullquote');
            floater.setAttribute('aria-hidden', 'true');
        }
        floater.innerHTML = this.innerHTML;

        this._floater = floater;
        this._next = next;

        // Responsive: float on desktop (≥1440px), block on mobile
        this._mql = window.matchMedia('(min-width: 1440px)');
        this._place(this._mql.matches);
        this._mql.addEventListener('change', function(e) {
            this._place(e.matches);
        }.bind(this));
    }

    _place(isDesktop) {
        if (isDesktop) {
            // Desktop: insert float span at the start of the next paragraph.
            // Wrap the float + several following siblings in a container div
            // so the float clears naturally within the container, preventing
            // short subsequent paragraphs from being pushed below the float.
            if (!this._container) {
                this._container = document.createElement('div');
                this._container.className = 'pull-quote-context';
                // Collect the next element and a few siblings after it
                // so they share a formatting context with the float
                var parent = this._next.parentNode;
                var sibling = this._next;
                var collected = [];
                var count = 0;
                while (sibling && count < 5) {
                    var nextSib = sibling.nextSibling;
                    collected.push(sibling);
                    count++;
                    sibling = nextSib;
                }
                parent.insertBefore(this._container, collected[0]);
                for (var i = 0; i < collected.length; i++) {
                    this._container.appendChild(collected[i]);
                }
            }
            this._container.insertBefore(this._floater, this._container.firstChild);
            this._container.style.display = '';
            this.style.display = 'none';
        } else {
            // Mobile: remove float span, unwrap container, show original
            if (this._floater.parentNode) {
                this._floater.parentNode.removeChild(this._floater);
            }
            if (this._container && this._container.parentNode) {
                var parent = this._container.parentNode;
                while (this._container.firstChild) {
                    parent.insertBefore(this._container.firstChild, this._container);
                }
                parent.removeChild(this._container);
                this._container = null;
            }
            this.style.display = '';
        }
    }
}

customElements.define('pull-quote', PullQuote);
