# [janmaarten.com](https://janmaarten.com)

Personal portfolio and blog, built with [Ghost](https://ghost.org/) and a customized [Kyoto](https://themex.studio/kyoto/) theme. 

Issues with the site or its accessibility can be submitted [here](https://github.com/janmaarten-a11y/janmaarten.com/issues/new/choose).

## Custom components

The theme includes custom web components for use in Ghost's HTML card editor.

### Accessible Toggle

A native `<details>/<summary>` element styled to match Ghost's toggle card. No JavaScript required — keyboard interaction, screen reader announcements, and open/close state are handled natively by the browser.

```html
<details class="accessible-toggle">
  <summary>Heading text</summary>
  <div class="toggle-content">
    <p>Content here</p>
  </div>
</details>
```

### Private YouTube

A `<private-youtube>` web component that displays a static thumbnail with a play button. Clicking loads a privacy-hardened iframe via `youtube-nocookie.com` with sandboxing and all Permissions Policy directives denied. No cookies or tracking until the user clicks play.

```html
<private-youtube videoid="VIDEO_ID" videotitle="Video title">
  <a href="https://www.youtube.com/watch?v=VIDEO_ID">Watch on YouTube</a>
</private-youtube>
```

The `<a>` fallback is shown if JavaScript fails to load. An optional `start` attribute accepts a timestamp in seconds.
