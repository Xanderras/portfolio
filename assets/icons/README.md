# Icons Folder

This folder can be used for custom icons if needed.

## Current Setup:

The website currently uses **Font Awesome** icons loaded from CDN, which provides:

- Social media icons (LinkedIn, GitHub, Twitter)
- UI icons (menu, theme toggle, contact icons)
- Technology icons (JavaScript, React, etc.)

## If You Want Custom Icons:

You can add SVG icons to this folder and reference them in your HTML/CSS:

### Recommended Icon Formats:

- **SVG** - Best for scalability and performance
- **PNG** - For complex icons (use 32x32, 64x64, 128x128px sizes)
- **ICO** - For favicon

### Custom Icon Usage Example:

```html
<!-- In HTML -->
<img src="assets/icons/custom-icon.svg" alt="Custom Icon" />

<!-- Or as CSS background -->
<span class="custom-icon"></span>
```

```css
/* In CSS */
.custom-icon {
  background-image: url('../assets/icons/custom-icon.svg');
  width: 24px;
  height: 24px;
  background-size: contain;
}
```

## Favicon:

If you want a custom favicon, add these files:

- `favicon.ico` (16x16, 32x32px)
- `apple-touch-icon.png` (180x180px for iOS)
- `android-chrome-192x192.png` (192x192px for Android)

Then update the HTML head section with:

```html
<link rel="icon" href="assets/icons/favicon.ico" />
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png" />
```

## Current Font Awesome Icons Used:

- fas fa-moon / fas fa-sun (theme toggle)
- fas fa-bars (mobile menu)
- fab fa-linkedin, fab fa-github, fab fa-twitter (social links)
- fas fa-envelope, fas fa-phone, fas fa-map-marker-alt (contact)
- fas fa-download (CV download)
- fas fa-external-link-alt (project links)
- Various technology icons (fab fa-js-square, fab fa-react, etc.)
