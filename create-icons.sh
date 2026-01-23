#!/bin/bash
# Simple script to create placeholder icons using ImageMagick (if available)
# Or creates a simple SVG-based approach

mkdir -p icons

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Creating icons with ImageMagick..."
    convert -size 16x16 xc:'#667eea' -fill white -gravity center -pointsize 12 -annotate +0+0 '🚫' icons/icon16.png
    convert -size 48x48 xc:'#667eea' -fill white -gravity center -pointsize 36 -annotate +0+0 '🚫' icons/icon48.png
    convert -size 128x128 xc:'#667eea' -fill white -gravity center -pointsize 96 -annotate +0+0 '🚫' icons/icon128.png
    echo "Icons created successfully!"
else
    echo "ImageMagick not found. Please:"
    echo "1. Install ImageMagick: brew install imagemagick (macOS) or apt-get install imagemagick (Linux)"
    echo "2. Or open generate-icons.html in a browser and save the canvas images manually"
    echo "3. Or create simple PNG icons manually (16x16, 48x48, 128x128) with a stop/block symbol"
fi
