/**
 * <private-youtube> web component
 *
 * Shows a YouTube thumbnail with a play button. On click, replaces itself
 * with a privacy-hardened iframe (youtube-nocookie.com, sandboxed,
 * credentialless, all permissions denied).
 *
 * Usage in Ghost HTML card:
 *   <private-youtube videoid="jfKfPfyJRdk" videotitle="lofi hip hop radio">
 *     <a href="https://www.youtube.com/watch?v=jfKfPfyJRdk">Watch on YouTube</a>
 *   </private-youtube>
 *
 * The <a> fallback is shown if JS fails to load.
 */
class PrivateYoutube extends HTMLElement {
    connectedCallback() {
        var videoid = this.getAttribute('videoid');
        var title = this.getAttribute('videotitle') || 'YouTube video';

        if (!videoid) return;

        // Build thumbnail + play button (replaces fallback link)
        this.innerHTML =
            '<button class="private-youtube-activate" aria-label="Play: ' + title.replace(/"/g, '&quot;') + '">' +
                '<img src="https://i.ytimg.com/vi/' + videoid + '/hqdefault.jpg"' +
                    ' alt="" loading="lazy" class="private-youtube-thumb">' +
                '<span class="private-youtube-play" aria-hidden="true">' +
                    '<svg viewBox="0 0 68 48" width="68" height="48">' +
                        '<path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/>' +
                        '<path d="M45 24 27 14v20" fill="white"/>' +
                    '</svg>' +
                '</span>' +
            '</button>';

        this.querySelector('.private-youtube-activate').addEventListener('click', function () {
            this.parentElement._activate();
        });
    }

    _activate() {
        var videoid = this.getAttribute('videoid');
        var title = this.getAttribute('videotitle') || 'YouTube video';
        var start = this.getAttribute('start') || '';
        var src = 'https://www.youtube-nocookie.com/embed/' + videoid + '?autoplay=1' + (start ? '&start=' + start : '');

        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('title', title);
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('credentialless', '');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allow',
            "accelerometer 'none'; " +
            "ambient-light-sensor 'none'; " +
            "autoplay 'src'; " +
            "battery 'none'; " +
            "bluetooth 'none'; " +
            "browsing-topics 'none'; " +
            "camera 'none'; " +
            "ch-ua 'none'; " +
            "display-capture 'none'; " +
            "domain-agent 'none'; " +
            "document-domain 'none'; " +
            "encrypted-media 'none'; " +
            "execution-while-not-rendered 'none'; " +
            "execution-while-out-of-viewport 'none'; " +
            "gamepad 'none'; " +
            "geolocation 'none'; " +
            "gyroscope 'none'; " +
            "hid 'none'; " +
            "identity-credentials-get 'none'; " +
            "idle-detection 'none'; " +
            "keyboard-map 'none'; " +
            "local-fonts 'none'; " +
            "magnetometer 'none'; " +
            "microphone 'none'; " +
            "midi 'none'; " +
            "navigation-override 'none'; " +
            "otp-credentials 'none'; " +
            "payment 'none'; " +
            "picture-in-picture 'none'; " +
            "publickey-credentials-create 'none'; " +
            "publickey-credentials-get 'none'; " +
            "screen-wake-lock 'none'; " +
            "serial 'none'; " +
            "speaker-selection 'none'; " +
            "sync-xhr 'none'; " +
            "usb 'none'; " +
            "web-share 'none'; " +
            "window-management 'none'; " +
            "xr-spatial-tracking 'none'"
        );
        iframe.setAttribute('csp', 'sandbox allow-scripts allow-same-origin;');

        this.innerHTML = '';
        this.appendChild(iframe);
        this.classList.add('private-youtube-active');
    }
}

customElements.define('private-youtube', PrivateYoutube);
