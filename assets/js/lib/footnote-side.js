/**
 * <footnote-side> web component
 *
 * Renders a numbered sidenote in the right margin on wide viewports
 * (Tufte-CSS float approach), and as a toggle on narrow viewports.
 *
 * Usage in Ghost HTML card:
 *   <footnote-side>This appears in the margin on desktop,
 *   toggles on mobile.</footnote-side>
 *
 * Content is authored as light DOM children. If JS fails, the content
 * renders inline as readable text.
 */
class FootnoteSide extends HTMLElement {
    connectedCallback() {
        // Auto-number: count all footnote elements (both types) before this one
        var allNotes = document.querySelectorAll('footnote-side, footnote-inline');
        var index = 0;
        for (var i = 0; i < allNotes.length; i++) {
            if (allNotes[i] === this) {
                index = i + 1;
                break;
            }
        }

        // Preserve original content
        var content = this.innerHTML;

        // Build the component markup
        // - Superscript trigger button (always present)
        // - Span with role="note" for the content
        //   On desktop: stays inside the element for Tufte-CSS float to work
        //   On mobile: moved after parent paragraph to avoid splitting it
        this.innerHTML =
            '<button class="footnote-side-toggle" aria-expanded="false" ' +
                    'aria-label="Footnote ' + index + '" ' +
                    'aria-controls="sn-' + index + '">' +
                '<sup class="footnote-side-number" aria-hidden="true">' + index + '</sup>' +
            '</button>';

        // Build content element
        this._content = document.createElement('span');
        this._content.className = 'footnote-side-content';
        this._content.setAttribute('role', 'note');
        this._content.setAttribute('id', 'sn-' + index);
        this._content.innerHTML =
            '<span class="footnote-side-index" aria-hidden="true">' + index + '.</span> ' +
            content;

        this._parentBlock = this.closest('p') || this.closest('li') || this.parentElement;

        // Place content based on viewport: inside element for desktop float,
        // after paragraph for mobile toggle
        this._mql = window.matchMedia('(min-width: 1440px)');
        this._placeContent(this._mql.matches);
        this._mql.addEventListener('change', function(e) {
            this._placeContent(e.matches);
        }.bind(this));

        this._toggle = this.querySelector('.footnote-side-toggle');

        this._toggle.addEventListener('click', this._handleClick.bind(this));
    }

    _placeContent(isDesktop) {
        if (isDesktop) {
            // Desktop: content inside the element for float to work
            this.appendChild(this._content);
        } else {
            // Mobile: content after parent paragraph to avoid splitting it
            if (this._parentBlock && this._parentBlock.parentNode) {
                this._parentBlock.parentNode.insertBefore(this._content, this._parentBlock.nextSibling);
            }
        }
    }

    _handleClick() {
        var expanded = this._toggle.getAttribute('aria-expanded') === 'true';
        this._toggle.setAttribute('aria-expanded', String(!expanded));
        this._content.classList.toggle('footnote-side-visible', !expanded);

        // On mobile, move focus to the content when opening
        if (!expanded) {
            this._content.setAttribute('tabindex', '-1');
            this._content.focus();
        }
    }
}

customElements.define('footnote-side', FootnoteSide);
