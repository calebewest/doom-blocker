#!/usr/bin/env python3
"""
Simple script to generate extension icons using PIL/Pillow
Install: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, filename):
        # Create image with gradient-like purple background
        img = Image.new('RGB', (size, size), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        # Draw a simple stop/block symbol (square with X)
        margin = size // 4
        # Draw border
        draw.rectangle([margin, margin, size - margin, size - margin], 
                      fill='white', outline='white', width=2)
        # Draw X
        line_width = max(2, size // 16)
        draw.line([margin + line_width, margin + line_width, 
                  size - margin - line_width, size - margin - line_width], 
                 fill='#667eea', width=line_width)
        draw.line([size - margin - line_width, margin + line_width, 
                  margin + line_width, size - margin - line_width], 
                 fill='#667eea', width=line_width)
        
        img.save(filename)
        print(f"Created {filename}")
    
    # Create icons directory
    os.makedirs('icons', exist_ok=True)
    
    # Generate icons
    create_icon(16, 'icons/icon16.png')
    create_icon(48, 'icons/icon48.png')
    create_icon(128, 'icons/icon128.png')
    
    print("All icons generated successfully!")
    
except ImportError:
    print("Pillow not installed. Install with: pip install Pillow")
    print("Or use the generate-icons.html file in a browser to create icons manually.")
except Exception as e:
    print(f"Error: {e}")
    print("You can also create simple PNG icons manually (16x16, 48x48, 128x128)")
