var html = document.documentElement;
var body = document.body;
var timeout;
var st = 0;

featured();
darkPage();
footerGroup();
pagination(false);
externalLinks();
bookmarkFocus();

function bookmarkFocus() {
    const bookmarkDescription = document.querySelectorAll('.kg-bookmark-description');
    bookmarkDescription .forEach(element => {
        element.setAttribute('tabindex', '-1');
        element.setAttribute('aria-hidden', 'true');
    });
    bookmarkDescription[0];
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
    const items = document.querySelectorAll(".footer-nav .nav li");

    const groups = [];
    let index = null;
    items.forEach(item => {
        const text = item.textContent.trim();
        const PREFIXFOOTERHEADER = "#";
        if (text.includes(PREFIXFOOTERHEADER)) {
            index = index === null ? 0 : ++index;
            groups[index] = { header: "", items: [] };
            groups[index].header = text.slice(PREFIXFOOTERHEADER.length);
        } else {
            groups[index].items.push({ text, link: item.childNodes[0].href });
        }
    })
    document.querySelector(".footer-nav ul.nav").remove();
    groups.forEach((group) => {
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.classList.add("footer-group-header");
        h3.innerHTML = group.header;
        const ul = document.createElement("ul");
        ul.classList.add("nav");
        group.items.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${item.link}">${item.text}</a>`;
            ul.append(li);
        })
        div.append(h3, ul);
        footerNav.appendChild(div);
    });
}