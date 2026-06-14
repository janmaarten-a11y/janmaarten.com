/**
 * Webmention handler for janmaarten.com
 * Fetches mentions from webmention.io and renders them on post pages.
 */
(function () {
    var container = document.getElementById('webmentions');
    if (!container) return;

    var pageUrl = window.location.href.replace(/#.*$/, '');

    // Fetch from both www and non-www variants
    var targets = [pageUrl];
    if (pageUrl.indexOf('://www.') > -1) {
        targets.push(pageUrl.replace('://www.', '://'));
    } else {
        targets.push(pageUrl.replace('://', '://www.'));
    }

    var endpoint = 'https://webmention.io/api/mentions.jf2?' +
        targets.map(function (t) { return 'target[]=' + encodeURIComponent(t); }).join('&') +
        '&per-page=100&sort-by=published';

    fetch(endpoint)
        .then(function (res) { return res.json(); })
        .then(function (data) { renderWebmentions(data, container); })
        .catch(function () {
            container.innerHTML = '';
        });

    function renderWebmentions(data, el) {
        if (!data.children || data.children.length === 0) {
            el.innerHTML = '';
            return;
        }

        var likes = data.children.filter(function (m) {
            return m['wm-property'] === 'like-of';
        });
        var reposts = data.children.filter(function (m) {
            return m['wm-property'] === 'repost-of' || m['wm-property'] === 'bookmark-of';
        });
        var replies = data.children.filter(function (m) {
            return m['wm-property'] === 'in-reply-to' || m['wm-property'] === 'mention-of';
        });

        var html = '<div class="wm-section">';
        html += '<h3 class="section-title wm-heading">Mentions</h3>';

        // Likes and reposts as avatar row
        if (likes.length > 0 || reposts.length > 0) {
            var reactions = likes.concat(reposts);
            html += '<div class="wm-reactions">';
            html += '<div class="wm-avatars">';
            reactions.forEach(function (r) {
                var author = r.author || {};
                var name = escapeHtml(author.name || 'Someone');
                var photo = author.photo || '';
                var url = author.url || r.url || '#';
                var initial = escapeHtml((author.name || '?').trim().charAt(0).toUpperCase());
                html += '<a href="' + escapeHtml(url) + '" class="wm-avatar-link" rel="noopener noreferrer">';
                if (photo) {
                    html += '<img src="' + escapeHtml(photo) + '" alt="' + name + '" class="wm-avatar" loading="lazy" onerror="this.outerHTML=&quot;<span class=\&quot;wm-avatar wm-avatar-fallback\&quot; aria-label=\&quot;' + name + '\&quot;>' + initial + '</span>&quot;">';
                } else {
                    html += '<span class="wm-avatar wm-avatar-fallback" aria-label="' + name + '">' + initial + '</span>';
                }
                html += '</a>';
            });
            html += '</div>';
            var likeCount = likes.length;
            var repostCount = reposts.length;
            var parts = [];
            if (likeCount > 0) parts.push(likeCount + (likeCount === 1 ? ' like' : ' likes'));
            if (repostCount > 0) parts.push(repostCount + (repostCount === 1 ? ' repost' : ' reposts'));
            html += '<span class="wm-reaction-count">' + parts.join(', ') + '</span>';
            html += '</div>';
        }

        // Replies as comments
        if (replies.length > 0) {
            html += '<div class="wm-replies">';
            replies.forEach(function (m) {
                var author = m.author || {};
                var name = escapeHtml(author.name || 'Anonymous');
                var photo = author.photo || '';
                var authorUrl = author.url || m.url || '#';
                var sourceUrl = m.url || '#';
                var content = m.content && m.content.text ? truncate(escapeHtml(m.content.text), 500) : '';
                var date = m.published || m['wm-received'] || '';
                var dateStr = date ? formatDate(date) : '';

                html += '<article class="wm-reply">';
                var initial = escapeHtml((author.name || '?').trim().charAt(0).toUpperCase());
                if (photo) {
                    html += '<img src="' + escapeHtml(photo) + '" alt="" class="wm-reply-avatar" loading="lazy" onerror="this.outerHTML=&quot;<span class=\&quot;wm-reply-avatar wm-avatar-fallback\&quot; aria-hidden=\&quot;true\&quot;>' + initial + '</span>&quot;">';
                } else {
                    html += '<span class="wm-reply-avatar wm-avatar-fallback" aria-hidden="true">' + initial + '</span>';
                }
                html += '<div class="wm-reply-content">';
                html += '<div class="wm-reply-meta">';
                html += '<a href="' + escapeHtml(authorUrl) + '" class="wm-reply-author" rel="noopener noreferrer">' + name + '</a>';
                if (dateStr) {
                    html += ' <a href="' + escapeHtml(sourceUrl) + '" class="wm-reply-date" rel="noopener noreferrer">' + dateStr + '</a>';
                }
                html += '</div>';
                if (content) {
                    html += '<p class="wm-reply-text">' + content + '</p>';
                }
                html += '</div>';
                html += '</article>';
            });
            html += '</div>';
        }

        html += '</div>';
        el.innerHTML = html;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function truncate(str, max) {
        if (str.length <= max) return str;
        return str.substring(0, max) + '\u2026';
    }

    function formatDate(dateStr) {
        try {
            var d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return '';
        }
    }
})();
