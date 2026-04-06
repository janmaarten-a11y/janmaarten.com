/**
 * <footnote-inline> web component
 *
 * Renders a numbered footnote that reveals its content inline (below
 * the parent paragraph) when the superscript number is clicked.
 * Always inline — never in the margin, regardless of viewport width.
 *
 * Usage in Ghost HTML card:
 *   Text here<footnote-inline>The actual footnote text.</footnote-inline>
 *   and the sentence continues.
 *
 * If JS fails, the content renders inline as readable text.
 */
class FootnoteInline extends HTMLElement {
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

        // Build the inline trigger (stays in flow inside the paragraph)
        this.innerHTML =
            '<button class="footnote-inline-toggle" aria-expanded="false">' +
                '<sup class="footnote-inline-number">' + index + '</sup>' +
            '</button>';

        // Build the expandable content and place it AFTER the parent
        // paragraph, so it doesn't break the paragraph flow
        this._content = document.createElement('span');
        this._content.className = 'footnote-inline-content';
        this._content.setAttribute('role', 'note');
        this._content.setAttribute('id', 'fn-' + index);
        this._content.innerHTML =
            '<span class="footnote-inline-index" aria-hidden="true">' + index + '.</span> ' +
            content;

        var parentBlock = this.closest('p') || this.closest('li') || this.parentElement;
        if (parentBlock && parentBlock.parentNode) {
            parentBlock.parentNode.insertBefore(this._content, parentBlock.nextSibling);
        } else {
            this.appendChild(this._content);
        }

        this._toggle = this.querySelector('.footnote-inline-toggle');
        this._toggle.addEventListener('click', this._handleClick.bind(this));
    }

    _handleClick() {
        var expanded = this._toggle.getAttribute('aria-expanded') === 'true';
        this._toggle.setAttribute('aria-expanded', String(!expanded));
        this._content.classList.toggle('footnote-inline-visible', !expanded);

        if (!expanded) {
            this._content.setAttribute('tabindex', '-1');
            this._content.focus();
        }
    }
}

customElements.define('footnote-inline', FootnoteInline);
