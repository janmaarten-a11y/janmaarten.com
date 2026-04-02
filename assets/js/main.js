var html = document.documentElement;
var body = document.body;
var timeout;
var st = 0;

introHighlight();
featured();
darkPage();
footerGroup();
externalLinks();
bookmarkFocus();

// Call the function when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupFootnotes();
        randomizeCardRotation();
    });
} else {
    setupFootnotes();
    randomizeCardRotation();
}

window.addEventListener('scroll', introHighlight);

pagination();

function portalButton() {
    'use strict';
    st = window.scrollY;

    if (st > 300) {
        body.classList.add('portal-visible');
    } else {
        body.classList.remove('portal-visible');
    }
}

function randomizeCardRotation() {
    'use strict';
    // Get all category card media elements
    const cardMediaElements = document.querySelectorAll('.category-card-media');
    
    // If no elements found, exit early
    if (!cardMediaElements.length) return;
    
    // For each element, set a random rotation
    cardMediaElements.forEach(element => {
        // Generate random number between -20 and 20, but avoid -4 to 4 range
        let randomRotation;
        do {
            randomRotation = Math.floor(Math.random() * 41) - 20; // 41 possible values from -20 to 20
        } while (randomRotation >= -4 && randomRotation <= 4);
        
        // Set the custom property on the element
        element.style.setProperty('--random-rotation', `${randomRotation}deg`);
        
        // Set a longer initial transition duration (will be overridden by CSS after animation completes)
        element.style.transition = 'transform 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        
        // Reset to CSS-defined transition after initial animation
        setTimeout(() => {
            element.style.transition = '';
        }, 800); // Match the duration above
    });
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
    });

    if (groups.length === 0) return;

    navList.remove();
    groups.forEach((group) => {
        const div = document.createElement('div');
        div.classList.add("footer-nav-group");
        const h3 = document.createElement('h3');
        h3.classList.add("footer-group-header");
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
        });
        div.append(h3, ul);
        footerNav.appendChild(div);
    });
}

function externalLinks() {
    document.querySelectorAll('.gh-content a').forEach(function(el) {
        if (!el.href.includes('janmaarten.com')) {
            el.setAttribute('rel', 'external noopener');
        }
    });
}

function bookmarkFocus() {
    var bookmarkDescription = document.querySelectorAll('.kg-bookmark-description');
    bookmarkDescription.forEach(function(element) {
        element.setAttribute('tabindex', '-1');
        element.setAttribute('aria-hidden', 'true');
    });
}

function setupFootnotes() {
    'use strict';
    const contentSelector = 'article.ghost-content';
    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    let htmlContent = contentElement.innerHTML;
    const regexPattern = /\[\^(.*?)\]/g;
    
    // Check if there are any footnotes before proceeding
    const matches = htmlContent.match(regexPattern);
    if (!matches) return;

    const footnoteList = document.createElement('ol');
    footnoteList.classList.add('footnote-list');
    footnoteList.id = 'footnotes';
    
    const footnoteWrapper = document.createElement('div');
    footnoteWrapper.classList.add('kg-canvas', 'section-footnotes');
    
    let index = 1;
    
    htmlContent = htmlContent.replace(regexPattern, (match, p1) => {
        footnoteList.innerHTML = footnoteList.innerHTML + `<li id="footnote-${index}">${p1}</li>`;
        const returnValue = `<sup class="footnote"><a href="#footnote-${index}">[${index}]</a></sup>`;
        index++;
        return returnValue;
    });

    contentElement.innerHTML = htmlContent;
    
    footnoteWrapper.appendChild(footnoteList);
    contentElement.appendChild(footnoteWrapper);
}


function introHighlight() {
    const textIntro = document.querySelector('.hero-intro.tag-hash-animate, .hero-intro.animate');
    if (!textIntro) return;

    const textElements = textIntro.querySelectorAll('p, ul, ol, h1, h2, h3, h4, h5, h6, blockquote');
    const viewportHeight = window.innerHeight;

    // Get values from CSS variables
    const maxBlur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intro-blur-max'));
    const blurZoneStart = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--blur-zone-start')) / 100;
    const safeZoneHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-zone-height')) / 100;

    // Calculate safe zone boundaries
    const safeZoneStart = blurZoneStart - safeZoneHeight; // Safe zone starts before blur zone

    // Function to process HTML content and split into words while preserving <br> and other inline tags
    function processElementContent(element) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;

        // Convert **text** to <strong>text</strong> (markdown style)
        tempDiv.innerHTML = tempDiv.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        const result = [];

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                // Split by spaces but keep the spaces
                const parts = text.split(/(\s+)/);

                parts.forEach(part => {
                    if (part.trim() !== '') {
                        result.push({ type: 'text', content: part });
                    } else if (part.match(/\s+/)) {
                        // Add space to previous item if it exists and is text
                        if (result.length > 0 && result[result.length - 1].type === 'text') {
                            result[result.length - 1].content += part;
                        }
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR') {
                    // Preserve <br> as a special item
                    result.push({ type: 'br' });
                } else {
                    // For other inline elements like <strong>, <a>, etc., wrap their content
                    const wrapper = document.createElement(node.tagName);
                    // Copy attributes
                    Array.from(node.attributes).forEach(attr => {
                        wrapper.setAttribute(attr.name, attr.value);
                    });

                    // Process children and collect text
                    const childTexts = [];
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            childTexts.push(child.textContent);
                        }
                    });

                    const innerText = childTexts.join('');
                    if (innerText.trim()) {
                        wrapper.textContent = innerText;
                        result.push({ type: 'html', content: wrapper.outerHTML });
                    }
                }
            }
        }

        tempDiv.childNodes.forEach(node => processNode(node));
        return result;
    }

    // Process each text element only once
    if (!textIntro.dataset.processed) {
        textElements.forEach(element => {
            // Skip if element is a list container - we'll process list items instead
            if (element.tagName === 'UL' || element.tagName === 'OL') {
                const listItems = element.querySelectorAll('li');
                listItems.forEach(li => {
                    const items = processElementContent(li);
                    li.innerHTML = ''; // Clear the list item content

                    items.forEach(item => {
                        if (item.type === 'br') {
                            li.appendChild(document.createElement('br'));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'word-reveal';
                            span.innerHTML = item.content; // Use innerHTML to preserve tags
                            li.appendChild(span);
                        }
                    });
                });
            } else {
                // Process other elements (p, h1-h6, blockquote)
                const items = processElementContent(element);
                element.innerHTML = ''; // Clear the element content

                items.forEach(item => {
                    if (item.type === 'br') {
                        element.appendChild(document.createElement('br'));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'word-reveal';
                        span.innerHTML = item.content; // Use innerHTML to preserve tags
                        element.appendChild(span);
                    }
                });
            }
        });

        // Add special elements as single reveal units
        const specialElements = textIntro.querySelectorAll('.primary-author-social-links, .form-wrapper, .subscription-wrapper, .subscription-box, .staff-social-link, figure, .kg-button-card');
        specialElements.forEach(element => {
            element.classList.add('element-reveal');
        });

        textIntro.dataset.processed = 'true';
    }

    const allWords = textIntro.querySelectorAll('.word-reveal');
    const specialElements = textIntro.querySelectorAll('.element-reveal');
    const allRevealItems = [...allWords, ...specialElements];

    // Get values from CSS variables
    const triggerPointMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intro-trigger-point'));

    const triggerPoint = viewportHeight * triggerPointMultiplier;

    // Calculate dynamic reveal zone based on text container height
    const textHeight = textIntro.scrollHeight;
    const minRevealZone = viewportHeight * 0.5; // Minimum zone for very short text
    const maxRevealZone = viewportHeight * 2.0; // Maximum zone for very long text

    // Use text height as basis, but constrain within reasonable bounds
    // Factor 1.5 ensures smooth revelation even with container padding/margins
    const dynamicRevealZone = textHeight * 1.5;
    const revealZone = Math.max(minRevealZone, Math.min(maxRevealZone, dynamicRevealZone));

    // Check if the intro section has entered the trigger point
    const introRect = textIntro.getBoundingClientRect();
    const introHasEntered = introRect.top < triggerPoint;

    if (!introHasEntered) {
        // Before entering trigger zone - all items are grey
        allRevealItems.forEach(item => {
            item.classList.remove('word-highlighted');

            // Apply blur effect for items in blur zone even before trigger
            const itemRect = item.getBoundingClientRect();
            const itemTopFromViewport = itemRect.top / viewportHeight;

            if (itemTopFromViewport >= blurZoneStart) {
                // Item is in blur zone
                const blurProgress = (itemTopFromViewport - blurZoneStart) / (1 - blurZoneStart);
                const blurAmount = Math.min(blurProgress * maxBlur, maxBlur);
                item.style.filter = `blur(${blurAmount}px)`;
            } else {
                item.style.filter = 'none';
            }
        });
        return;
    }

    // Calculate how far we've scrolled into the reveal zone
    const scrollProgress = Math.max(0, (triggerPoint - introRect.top) / revealZone);

    // Check if any item would be revealed in the safe zone or blur zone
    let maxRevealableItems = allRevealItems.length;
    allRevealItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemTopFromViewport = itemRect.top / viewportHeight;

        // If this item is in the safe zone or blur zone, don't reveal beyond the previous item
        if (itemTopFromViewport >= safeZoneStart && index < maxRevealableItems) {
            maxRevealableItems = Math.max(0, index - 1); // Stop before this item
        }
    });

    // Adaptive item revelation with smoother progression
    // Ensure minimum scroll distance per item to prevent bunching
    const totalItems = allRevealItems.length;
    const minItemsPerScrollUnit = 0.1; // Minimum revelation rate
    const adaptiveProgress = Math.min(scrollProgress, 1.0);

    // Use smooth curve for item revelation with 1.5 multiplier for faster progression
    const easedProgress = adaptiveProgress * 1.5;

    // Calculate items to reveal with adaptive rate, ensuring gradual revelation
    const itemsToReveal = Math.min(
        Math.floor(easedProgress * totalItems + minItemsPerScrollUnit),
        maxRevealableItems
    );

    // Apply effects to each item
    allRevealItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemTopFromViewport = itemRect.top / viewportHeight;

        // Handle color transition (grey to black) - item by item
        if (index <= itemsToReveal) {
            item.classList.add('word-highlighted');
        } else {
            item.classList.remove('word-highlighted');
        }

        // Handle blur effect based on position
        if (itemTopFromViewport >= blurZoneStart) {
            // Item is in blur zone
            const blurProgress = (itemTopFromViewport - blurZoneStart) / (1 - blurZoneStart);
            const blurAmount = Math.min(blurProgress * maxBlur, maxBlur);
            item.style.filter = `blur(${blurAmount}px)`;
        } else {
            // Item is not in blur zone - keep clear
            item.style.filter = 'none';
        }
    });

    // If we've scrolled past the intro section, reveal all items and remove blur
    if (introRect.bottom < viewportHeight * 0.2) {
        allRevealItems.forEach(item => {
            item.classList.add('word-highlighted');
            item.style.filter = 'none';
        });
    }
}
