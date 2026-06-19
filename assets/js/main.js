var html = document.documentElement;
var body = document.body;
var timeout;
var st = 0;

featured();
darkPage();
normalizeLocalhostAssetUrls();
footerGroup();
pagination(false);
externalLinks();
bookmarkFocus();
preTabindex();
modeSwitcher();
// On posts with a TOC, defer headingAnchors() until after tocbot has read
// the headings — otherwise the appended "anchor" text leaks into the TOC.
// default.hbs calls window.headingAnchors() after tocbot.init.
if (!document.querySelector('.toc-desktop, .toc-mobile')) headingAnchors();
window.headingAnchors = headingAnchors;

function normalizeLocalhostAssetUrls() {
    var localhostPrefix = 'http://localhost:2368';
    var targetOrigin = window.location.origin;

    if (!targetOrigin || targetOrigin.indexOf('localhost') > -1) return;

    function rewriteUrl(value) {
        if (!value || typeof value !== 'string') return value;
        return value.split(localhostPrefix).join(targetOrigin);
    }

    document.querySelectorAll('[src], [href], [poster], [srcset], [style]').forEach(function (el) {
        var src = el.getAttribute('src');
        if (src && src.indexOf(localhostPrefix) > -1) {
            el.setAttribute('src', rewriteUrl(src));
        }

        var href = el.getAttribute('href');
        if (href && href.indexOf(localhostPrefix) > -1) {
            el.setAttribute('href', rewriteUrl(href));
        }

        var poster = el.getAttribute('poster');
        if (poster && poster.indexOf(localhostPrefix) > -1) {
            el.setAttribute('poster', rewriteUrl(poster));
        }

        var srcset = el.getAttribute('srcset');
        if (srcset && srcset.indexOf(localhostPrefix) > -1) {
            var rewrittenSrcset = srcset
                .split(',')
                .map(function (candidate) {
                    return rewriteUrl(candidate.trim());
                })
                .join(', ');

            el.setAttribute('srcset', rewrittenSrcset);
        }

        var style = el.getAttribute('style');
        if (style && style.indexOf(localhostPrefix) > -1) {
            el.setAttribute('style', rewriteUrl(style));
        }
    });
}

function headingAnchors() {
    // Add a `#` permalink to every heading inside .gh-content that has an id.
    // Skips post titles (those live outside .gh-content) and headings without an id
    // (Ghost only auto-IDs h2–h4 by default).
    var headings = document.querySelectorAll('.gh-content h2[id], .gh-content h3[id], .gh-content h4[id]');
    headings.forEach(function (h) {
        // Skip the TOC inside .gh-content (h2 "Table of contents" on mobile)
        if (h.closest('.toc-container')) return;
        // Skip headings explicitly marked to ignore
        if (h.classList.contains('toc-ignore')) return;
        // Don't double up if one already exists
        if (h.querySelector('.heading-anchor')) return;

        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.className = 'heading-anchor';
        // Accessible name is just "anchor" — the heading text is announced
        // separately when the user navigates by headings, so repeating it
        // in the link's name would be redundant.
        var hash = document.createElement('span');
        hash.setAttribute('aria-hidden', 'true');
        hash.textContent = '#';
        var label = document.createElement('span');
        label.className = 'visually-hidden';
        label.textContent = 'anchor';
        a.appendChild(hash);
        a.appendChild(label);
        h.appendChild(a);
    });
}

function modeSwitcher() {
    var switchers = document.querySelectorAll('select[data-mode-switcher]');
    if (!switchers.length || typeof window.setMode !== 'function') return;
    var current = typeof window.getMode === 'function' ? window.getMode() : 'system';

    function syncAll(value) {
        switchers.forEach(function (s) { s.value = value; });
    }

    switchers.forEach(function (select) {
        select.value = current;
        select.addEventListener('change', function () {
            window.setMode(select.value);
        });
    });

    // Listen for mode changes from anywhere (header toggle, other tabs, etc.)
    window.addEventListener('jm:mode-change', function (e) {
        syncAll(e.detail.mode);
    });
}

function bookmarkFocus() {
    const bookmarkDescription = document.querySelectorAll('.kg-bookmark-description');
    bookmarkDescription .forEach(element => {
        element.setAttribute('tabindex', '-1');
    });
}

// Undo prism.js adding tabindex="0" to all <pre> elements.
// Only keep it when the pre has horizontal overflow (scrollbar).
function preTabindex() {
    document.querySelectorAll('pre[tabindex="0"]').forEach(function(pre) {
        if (pre.scrollWidth <= pre.clientWidth) {
            pre.removeAttribute('tabindex');
        }
    });
}


function externalLinks() {
    const domain = location.host.replace('www.', '');
    const links = document.querySelectorAll('.gh-content a');
  
    links.forEach((link) => {
      //if (!link.href.includes(domain)) {
      if (!link.href.includes('janmaarten.com')) {
        // link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'external noopener');
      }
    });
}

function portalButton() {
    'use strict';
    st = window.scrollY;

    if (st > 300) {
        body.classList.add('portal-visible');
    } else {
        body.classList.remove('portal-visible');
    }
}

function featured() {
    'use strict';
    var feed = document.querySelector('.featured-feed');
    if (!feed) return;

    tns({
        container: feed,
        controlsText: [
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        gutter: 1,
        loop: false,
        nav: false,
        mouseDrag: true,
        responsive: {
            0: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

function darkPage() {
    var isDark = body.classList.contains('tag-hash-dark') ? 'dark' : 'light';
    html.classList.add(`${isDark}-page`);
}
function footerGroup() {
    const footerNav = document.querySelector(".footer-nav");
    if (!footerNav) return;
    const navList = footerNav.querySelector("ul.nav");
    if (!navList) return;
    const items = navList.querySelectorAll("li");

    const groups = [];
    let index = null;
    items.forEach(item => {
        const text = item.textContent.trim();
        const PREFIXFOOTERHEADER = "#";
        if (text.startsWith(PREFIXFOOTERHEADER)) {
            index = index === null ? 0 : ++index;
            groups[index] = { header: "", items: [] };
            groups[index].header = text.slice(PREFIXFOOTERHEADER.length);
        } else if (index !== null) {
            const anchor = item.querySelector("a");
            const link = anchor ? anchor.href : "#";
            groups[index].items.push({ text, link });
        }
    })
    navList.remove();
    groups.forEach((group, i) => {
        const nav = document.createElement('nav');
        var headingId = 'footer-group-' + i;
        nav.setAttribute('aria-labelledby', headingId);
        const h3 = document.createElement('h3');
        h3.classList.add("footer-group-header");
        h3.id = headingId;
        h3.textContent = group.header;
        const ul = document.createElement("ul");
        ul.classList.add("nav");
        group.items.forEach((item) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = item.link;
            a.textContent = item.text;
            li.appendChild(a);
            ul.append(li);
        })
        nav.append(h3, ul);
        footerNav.appendChild(nav);
    });
}