# Doom Blocker - Infinite Scroll Blocker

A browser extension that blocks infinite scrolling on popular social media and content platforms to help you stay focused and avoid endless content consumption.

## Features

- Blocks infinite scroll on 8 major platforms:
  - Twitter/X
  - Facebook
  - Instagram
  - Reddit
  - LinkedIn
  - TikTok
  - YouTube
  - Pinterest

- Configurable per-site blocking via settings page
- Prevents API calls that load more content
- Blocks scroll-based loading mechanisms
- Works across all major browsers (Chrome, Firefox, Edge, Safari)

## Installation

### Chrome/Edge/Brave

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `doom-blocker` directory
6. The extension is now installed!

### Firefox

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the `doom-blocker` directory
6. The extension is now installed!

### Safari

1. Enable Safari Developer menu (Preferences > Advanced > Show Develop menu)
2. Open Safari and go to Develop > Show Extension Builder
3. Click "+" and select "Add Extension"
4. Select the `doom-blocker` directory
5. Click "Run" to enable the extension

## Usage

1. **Configure Settings**: Click the extension icon in your browser toolbar to open the settings page
2. **Toggle Sites**: Use the toggle switches to enable/disable blocking for each site
3. **Save**: Settings are saved automatically when you toggle switches
4. **Refresh Pages**: After changing settings, refresh the target website for changes to take effect

## How It Works

The extension uses multiple techniques to prevent infinite scrolling:

1. **API Request Blocking**: Intercepts and blocks fetch/XMLHttpRequest calls to pagination endpoints
2. **Scroll Event Prevention**: Prevents scroll event listeners from triggering content loading
3. **Intersection Observer Blocking**: Blocks IntersectionObserver instances that detect when users scroll to the bottom
4. **Container Height Limiting**: Limits the height of scrollable containers to prevent infinite scroll

Each site has a custom blocker that targets its specific API patterns and scroll mechanisms.

## File Structure

```
doom-blocker/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker for initialization
├── options.html           # Settings page UI
├── options.js             # Settings page logic
├── content/
│   ├── base.js            # Shared utilities for content scripts
│   ├── twitter.js         # Twitter/X blocker
│   ├── facebook.js        # Facebook blocker
│   ├── instagram.js       # Instagram blocker
│   ├── reddit.js          # Reddit blocker
│   ├── linkedin.js        # LinkedIn blocker
│   ├── tiktok.js          # TikTok blocker
│   ├── youtube.js         # YouTube blocker
│   └── pinterest.js       # Pinterest blocker
└── icons/                 # Extension icons (placeholder)
```

## Development

### Prerequisites

- No external dependencies required (vanilla JavaScript)
- Works with Manifest V3 (compatible with all modern browsers)

### Testing

1. Load the extension in your browser (see Installation above)
2. Visit one of the supported sites
3. Try scrolling - infinite scroll should be blocked
4. Check the browser console for any errors
5. Test the settings page to toggle blocking on/off

### Adding New Sites

To add support for a new site:

1. Create a new file in `content/` directory (e.g., `content/newsite.js`)
2. Set `window.DOOM_BLOCKER_SITE = 'newsite'`
3. Identify the site's API patterns and scroll mechanisms
4. Implement blocking logic using the base utilities
5. Add the site to `manifest.json` content scripts
6. Add the site to `options.html` and `options.js`
7. Update `background.js` default settings

## Browser Compatibility

- ✅ Chrome/Chromium (Manifest V3)
- ✅ Firefox (Manifest V3)
- ✅ Microsoft Edge (Manifest V3)
- ✅ Brave (Manifest V3)
- ✅ Safari (with adjustments)

## Troubleshooting

**Extension not blocking a site:**
- Make sure blocking is enabled for that site in settings
- Refresh the page after changing settings
- Check browser console for errors
- Some sites may update their code - the blocker may need updates

**Settings not saving:**
- Check browser permissions for the extension
- Try disabling and re-enabling the extension
- Clear browser cache and reload

**Extension not loading:**
- Ensure you're using a Manifest V3 compatible browser
- Check that all files are present in the extension directory
- Review browser console for error messages

## Privacy

This extension:
- Does not collect any data
- Does not send information to external servers
- Only stores your blocking preferences locally in browser storage
- Does not track your browsing activity

## License

This project is open source. Feel free to modify and distribute as needed.

## Contributing

Contributions are welcome! Areas for improvement:
- Support for additional sites
- Better detection of infinite scroll mechanisms
- Performance optimizations
- UI/UX improvements

## Notes

- Icons are currently placeholders - you can replace them with custom icons if desired
- Some sites may require periodic updates as they change their code
- The extension works best when loaded before page content (uses `document_start`)
