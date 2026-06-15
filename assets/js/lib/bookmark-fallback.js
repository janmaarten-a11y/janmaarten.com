/**
 * Bookmark card image fallbacks
 *
 * When a remote favicon or thumbnail fails to load (404, hotlink block,
 * CORS, etc.), Ghost's bookmark cards show a broken-image icon. This
 * intercepts those errors and degrades gracefully:
 *
 *  - Failed favicon → swap in a neutral viridis "link" SVG glyph
 *  - Failed thumbnail → hide the entire .kg-bookmark-thumbnail container
 *    so the card collapses to text-only width
 *
 * Listens during the capture phase because `error` does not bubble.
 */
(function () {
    var LINK_GLYPH = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgb(124 139 154 / 0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' +
        '</svg>'
    );

    document.addEventListener('error', function (e) {
        var img = e.target;
        if (!(img instanceof HTMLImageElement)) return;
        if (!img.closest('.kg-bookmark-card')) return;

        // Avoid loops: once we've swapped a favicon to the inline SVG, don't re-handle
        if (img.dataset.bookmarkFallback === 'applied') return;

        var iconWrap = img.closest('.kg-bookmark-icon');
        if (iconWrap) {
            img.dataset.bookmarkFallback = 'applied';
            img.removeAttribute('srcset');
            img.removeAttribute('sizes');
            img.src = LINK_GLYPH;
            return;
        }

        var thumbWrap = img.closest('.kg-bookmark-thumbnail');
        if (thumbWrap) {
            thumbWrap.style.display = 'none';
        }
    }, true);
})();
