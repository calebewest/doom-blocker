# Doom Blocker

A browser extension that blocks infinite scroll feeds on major websites to help you stay focused and reduce doomscrolling.

## What It Does

Doom Blocker removes distracting infinite scroll feeds from websites, helping you maintain better focus and productivity. Currently supports:

- **YouTube**: Hides the recommendation sidebars, related videos panels, YouTube Shorts, and expands the main video player to full width
- **LinkedIn**: Hides the main feed to prevent endless scrolling through job postings and sponsored content

The extension works silently in the background and includes a popup panel showing when it's active with a toggle button to enable/disable the blocking.

## How to Download and Use

### Installation

1. **Clone or download this repository** to your local machine:
   ```bash
   git clone https://github.com/yourusername/doom-blocker.git
   cd doom-blocker
   ```

2. **Load the extension into your browser**:
   - **Chrome/Edge**: 
     - Open `chrome://extensions/` (or `edge://extensions/`)
     - Enable "Developer mode" (top right corner)
     - Click "Load unpacked"
     - Select the `doom-blocker` folder
   
   - **Firefox**: 
     - Open `about:debugging#/runtime/this-firefox`
     - Click "Load Temporary Add-on"
     - Select the `manifest.json` file from this folder

3. **Verify installation**: You should see the "Feed Hider" icon in your browser's extension area

### Usage

- The extension runs automatically when you visit YouTube or LinkedIn
- Click the extension icon in your toolbar to see the Feed Hider popup
- Use the "Toggle Feature" button to enable/disable the blocker
- Your preference is saved automatically

## Future Steps

The roadmap includes expanding Feed Hider to block doomscroll feeds on additional major platforms:

### Planned Additions
- **TikTok**: Hide the infinite For You feed
- **Reddit**: Block the home feed and popular feeds
- **Twitter/X**: Hide the algorithmic timeline
- **Instagram**: Block the feed and Reels
- **Facebook**: Hide the news feed
- **Twitch**: Block the recommended streams feed

### Development Goals
- Add granular controls to selectively hide different types of content (i.e. some users may want to block the news instead of reels)
- Implement whitelist/blacklist functionality for specific channels or creators
- Add time-based scheduling (e.g., disable blocking during work hours)
- Create a dashboard showing time saved from not doomscrolling
- Support for additional social media platforms based on user feedback
- 

## Suggestions

If you want to stay updated or suggest changes please send me an email `calebewest[at]outlook.com` or open an issue. I'd love to hear your thoughts!

## Development

### Project Structure
```
doom-blocker/
├── manifest.json          # Extension configuration
├── popup/
│   ├── popup.html        # Popup UI
│   └── popup.js          # Popup logic
├── content/
│   ├── youtube.js        # YouTube blocking logic
│   ├── linkedin.js       # LinkedIn blocking logic
│   └── youtube.css       # YouTube styling
└── README.md
```

### Adding a New Site

To add blocking for a new website:

1. Create a new content script in `content/` (e.g., `tiktok.js`)
2. Update `manifest.json` to include the new site:
   ```json
   {
     "matches": ["*://*.tiktok.com/*"],
     "js": ["content/tiktok.js"],
     "run_at": "document_idle"
   }
   ```
3. Implement the blocking logic using DOM selectors and `MutationObserver` to handle dynamic content

## ⚠️ Disclaimer

This extension is designed to improve focus and productivity. Use responsibly as part of a broader strategy for digital wellness.
