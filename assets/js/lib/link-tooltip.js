/**
 * Link tooltips — progressive enhancement for external links
 *
 * Shows a tooltip on hover/focus for external links in .gh-content.
 * Default: domain-only. Rich: reads data-tooltip-title, data-tooltip-description,
 * data-tooltip-image attributes if present.
 *
 * Skips: internal links, bookmark cards, nav/footer links, mailto/tel/#,
 * links with data-no-tooltip, and touch-only devices.
 *
 * WCAG 1.4.13 compliant: hoverable, dismissable (Escape), persistent.
 */
(function () {
    // Skip on touch-only devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    var HOVER_DELAY = 300;
    var HIDE_GRACE = 200;
    var tooltipCounter = 0;
    var activeTooltip = null;
    var activeLink = null;
    var hoverTimer = null;
    var hideTimer = null;

    // Extract domain from URL, strip www.
    function getDomain(url) {
        try {
            var host = new URL(url).hostname;
            return host.replace(/^www\./, '');
        } catch (e) {
            return '';
        }
    }

    // Should this link get a tooltip?
    function isEligible(link) {
        var href = link.getAttribute('href') || '';

        // Skip non-http links
        if (!href.match(/^https?:\/\//)) return false;

        // Skip internal links
        try {
            if (new URL(href).hostname.replace(/^www\./, '') === location.hostname.replace(/^www\./, '')) return false;
        } catch (e) {
            return false;
        }

        // Skip opt-out
        if (link.hasAttribute('data-no-tooltip')) return false;

        // Skip links inside bookmark cards, nav, footer, header
        if (link.closest('.kg-bookmark-card, nav, footer, header, .gh-head')) return false;

        return true;
    }

    // Create or return the tooltip element for a link
    function getTooltip(link) {
        var existingId = link.getAttribute('aria-describedby');
        if (existingId) {
            var existing = document.getElementById(existingId);
            if (existing) return existing;
        }

        tooltipCounter++;
        var id = 'link-tooltip-' + tooltipCounter;
        var href = link.getAttribute('href') || '';
        var domain = getDomain(href);
        var title = link.getAttribute('data-tooltip-title') || '';
        var description = link.getAttribute('data-tooltip-description') || '';
        var image = link.getAttribute('data-tooltip-image') || '';

        var tooltip = document.createElement('span');
        tooltip.id = id;
        tooltip.className = 'link-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('hidden', '');

        var html = '';

        if (image) {
            html += '<img class="link-tooltip-image" src="' +
                image.replace(/"/g, '&quot;') +
                '" alt="" loading="lazy">';
        }

        if (title) {
            html += '<strong class="link-tooltip-title">' +
                title.replace(/</g, '&lt;') + '</strong>';
        }

        html += '<span class="link-tooltip-domain">' +
            '<svg class="link-tooltip-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/></svg>' +
            href.replace(/</g, '&lt;') + '</span>';

        if (description) {
            // Truncate to 160 chars
            var desc = description.length > 160
                ? description.substring(0, 157) + '…'
                : description;
            html += '<span class="link-tooltip-description">' +
                desc.replace(/</g, '&lt;') + '</span>';
        }

        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);
        link.setAttribute('aria-describedby', id);

        return tooltip;
    }

    // Position tooltip above the link (or below if no space above)
    function positionTooltip(tooltip, link) {
        tooltip.removeAttribute('hidden');
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';

        var linkRect = link.getBoundingClientRect();
        var tipRect = tooltip.getBoundingClientRect();
        var scrollY = window.scrollY;
        var scrollX = window.scrollX;
        var gap = 8;

        // Vertical: prefer above
        var top = linkRect.top + scrollY - tipRect.height - gap;
        if (top < scrollY) {
            // Not enough space above, place below
            top = linkRect.bottom + scrollY + gap;
        }

        // Horizontal: centered on link, constrained to viewport
        var left = linkRect.left + scrollX + (linkRect.width / 2) - (tipRect.width / 2);
        var maxLeft = scrollX + document.documentElement.clientWidth - tipRect.width - 8;
        if (left < scrollX + 8) left = scrollX + 8;
        if (left > maxLeft) left = maxLeft;

        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
        tooltip.style.visibility = '';
    }

    function showTooltip(link) {
        if (activeTooltip) hideTooltip();

        var tooltip = getTooltip(link);
        positionTooltip(tooltip, link);
        activeTooltip = tooltip;
        activeLink = link;
    }

    function hideTooltip() {
        if (activeTooltip) {
            activeTooltip.setAttribute('hidden', '');
            activeTooltip.style.display = '';
            activeTooltip = null;
            activeLink = null;
        }
    }

    function clearTimers() {
        if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null; }
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    // Delegated mouse events on .gh-content
    var content = document.querySelector('.gh-content');
    if (!content) return;

    content.addEventListener('mouseenter', function (e) {
        var link = e.target.closest('a');
        if (!link || !isEligible(link)) return;

        clearTimers();
        hoverTimer = setTimeout(function () {
            showTooltip(link);
        }, HOVER_DELAY);
    }, true);

    content.addEventListener('mouseleave', function (e) {
        var link = e.target.closest('a');
        if (!link) return;

        clearTimers();
        // Grace period: allow moving to the tooltip
        hideTimer = setTimeout(function () {
            hideTooltip();
        }, HIDE_GRACE);
    }, true);

    // Keep tooltip open when hovering the tooltip itself
    document.addEventListener('mouseenter', function (e) {
        if (e.target.closest && e.target.closest('.link-tooltip')) {
            clearTimers();
        }
    }, true);

    document.addEventListener('mouseleave', function (e) {
        if (e.target.closest && e.target.closest('.link-tooltip')) {
            clearTimers();
            hideTimer = setTimeout(function () {
                hideTooltip();
            }, HIDE_GRACE);
        }
    }, true);

    // Keyboard: show on focus, hide on blur
    // Defer show so scroll-into-view (triggered by Tab) completes first,
    // preventing the tooltip from positioning against a stale rect.
    var focusShowTimer = null;

    content.addEventListener('focusin', function (e) {
        var link = e.target.closest('a');
        if (!link || !isEligible(link)) return;
        clearTimers();
        if (focusShowTimer) { clearTimeout(focusShowTimer); focusShowTimer = null; }
        focusShowTimer = setTimeout(function () {
            focusShowTimer = null;
            // Confirm focus is still on this link after scroll settled
            if (document.activeElement === link || link.contains(document.activeElement)) {
                showTooltip(link);
            }
        }, 150);
    });

    content.addEventListener('focusout', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        if (focusShowTimer) { clearTimeout(focusShowTimer); focusShowTimer = null; }
        // Delay hide to allow focus moving to next element
        setTimeout(function () {
            if (activeTooltip && !activeTooltip.contains(document.activeElement)) {
                hideTooltip();
            }
        }, 100);
    });

    // Escape key dismisses
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && activeTooltip) {
            hideTooltip();
        }
    });
})();
