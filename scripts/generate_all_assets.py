"""
Generate all missing visual assets for the Kabbalah App using Pollinations.ai
This script generates icons, backgrounds, and UI elements for a premium game-like experience.
"""

import requests
import os
import time
from urllib.parse import quote

# Output directories
ICONS_DIR = "kabbalah-app/public/icons"
IMAGES_DIR = "kabbalah-app/public/images"
SPHERES_DIR = "kabbalah-app/public/spheres"

# Ensure directories exist
os.makedirs(ICONS_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(SPHERES_DIR, exist_ok=True)

def generate_image(prompt, filename, width=512, height=512):
    """Generate image using Pollinations.ai"""
    encoded_prompt = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
    
    print(f"⏳ Generating: {filename}")
    try:
        response = requests.get(url, timeout=120)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✅ Saved: {filename}")
            return True
        else:
            print(f"❌ Error {response.status_code}: {filename}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

# ============================================================
# ASSET INVENTORY - What we need to generate
# ============================================================

ASSETS_TO_GENERATE = {
    # -------------------- NAVIGATION ICONS (Bottom Bar) --------------------
    "nav_icons": [
        {
            "name": "zohar_icon.png",
            "path": ICONS_DIR,
            "prompt": "Mystical ancient book icon, glowing golden Hebrew letters emerging from pages, dark purple background, magical sparkles, premium game UI icon style, minimalist, centered, no text",
            "size": (256, 256)
        },
        {
            "name": "arbol_vida_icon.png", 
            "path": ICONS_DIR,
            "prompt": "Tree of Life Kabbalah symbol icon, 10 golden glowing spheres connected by lines, Sephirot diagram, dark cosmic background, premium game UI icon, minimalist sacred geometry",
            "size": (256, 256)
        },
        {
            "name": "72_names_icon.png",
            "path": ICONS_DIR,
            "prompt": "Hebrew letters floating in golden light, three mystical Hebrew characters, divine names, cosmic purple background, premium game icon style, magical glow effect",
            "size": (256, 256)
        },
        {
            "name": "sefer_yetzirah_icon.png",
            "path": ICONS_DIR,
            "prompt": "Ancient mystical scroll icon with Hebrew letters, glowing golden parchment, cosmic dark background, Kabbalistic symbols, premium game UI icon style",
            "size": (256, 256)
        },
        {
            "name": "tefila_icon.png",
            "path": ICONS_DIR,
            "prompt": "Prayer hands icon with divine golden light rays, spiritual connection symbol, dark cosmic background, premium game UI icon, sacred meditation symbol",
            "size": (256, 256)
        },
    ],
    
    # -------------------- SPHERE IMAGES (For carousel) --------------------
    "spheres": [
        {
            "name": "protection.png",
            "path": SPHERES_DIR,
            "prompt": "Glowing red protective shield sphere, Kabbalah Gevurah sephirah, cosmic dark background, divine protection energy, sacred geometry patterns, premium game orb style",
            "size": (512, 512)
        },
        {
            "name": "connection.png",
            "path": SPHERES_DIR,
            "prompt": "Glowing purple sphere of divine connection, Yesod sephirah energy, cosmic starfield background, spiritual bonds, ethereal light beams, premium game orb style",
            "size": (512, 512)
        },
        {
            "name": "peace.png",
            "path": SPHERES_DIR,
            "prompt": "Serene white glowing sphere of peace and tranquility, Keter sephirah crown energy, cosmic dark background, pure divine light, premium game orb style",
            "size": (512, 512)
        },
    ],
    
    # -------------------- PAGE BACKGROUNDS --------------------
    "backgrounds": [
        {
            "name": "sefer_yetzirah_bg.jpg",
            "path": IMAGES_DIR,
            "prompt": "Ancient mystical library with floating Hebrew letters, golden candlelight illuminating ancient scrolls, cosmic purple nebula visible through windows, Kabbalistic atmosphere, premium fantasy game background",
            "size": (1024, 1024)
        },
        {
            "name": "tefila_bg.jpg",
            "path": IMAGES_DIR,
            "prompt": "Sacred temple interior with golden light rays descending from above, mystical prayer space, cosmic starfield through dome ceiling, Kabbalistic symbols on walls, premium fantasy game background",
            "size": (1024, 1024)
        },
        {
            "name": "home_bg.jpg",
            "path": IMAGES_DIR,
            "prompt": "Cosmic deep space with golden Tree of Life constellation, purple and blue nebula clouds, sacred geometry patterns, stars and divine light, premium fantasy game background, mystical Kabbalah theme",
            "size": (1024, 1024)
        },
        {
            "name": "profile_bg.jpg",
            "path": IMAGES_DIR,
            "prompt": "Personal sacred space with glowing golden aura, cosmic meditation chamber, purple ethereal mist, Kabbalistic journey progression symbols, premium fantasy game background",
            "size": (1024, 1024)
        },
    ],
    
    # -------------------- UI MOCKUPS (for design reference) --------------------
    "mockups": [
        {
            "name": "home_mockup.jpg",
            "path": IMAGES_DIR,
            "prompt": "Mobile app home screen mockup, Kabbalah spiritual app, dark cosmic purple background, golden Tree of Life symbol center, glowing Tiferet orb, bottom navigation dock with 5 icons, premium game UI, 9:16 mobile ratio",
            "size": (540, 960)
        },
        {
            "name": "zohar_mockup.jpg",
            "path": IMAGES_DIR,
            "prompt": "Mobile app screen mockup, Secrets of Zohar page, dark purple background, golden Hebrew title, search bar, filter buttons, grid of mystical class cards with book icons, bottom navigation dock, premium game UI style, 9:16 mobile ratio",
            "size": (540, 960)
        },
        {
            "name": "meditation_mockup.jpg",
            "path": IMAGES_DIR,
            "prompt": "Mobile app meditation player screen mockup, large golden circular timer in center, cosmic dark background, sacred geometry patterns, play controls, bottom navigation dock, premium game UI style, 9:16 mobile ratio",
            "size": (540, 960)
        },
    ],
}

def main():
    print("=" * 60)
    print("🔮 KABBALAH APP - ASSET GENERATOR")
    print("=" * 60)
    
    total_assets = sum(len(assets) for assets in ASSETS_TO_GENERATE.values())
    generated = 0
    failed = 0
    
    for category, assets in ASSETS_TO_GENERATE.items():
        print(f"\n📁 Category: {category.upper()}")
        print("-" * 40)
        
        for asset in assets:
            filepath = os.path.join(asset["path"], asset["name"])
            
            # Skip if already exists
            if os.path.exists(filepath):
                print(f"⏭️  Skipping (exists): {asset['name']}")
                continue
            
            success = generate_image(
                asset["prompt"],
                filepath,
                width=asset["size"][0],
                height=asset["size"][1]
            )
            
            if success:
                generated += 1
            else:
                failed += 1
            
            # Small delay to be nice to the API
            time.sleep(2)
    
    print("\n" + "=" * 60)
    print(f"✨ GENERATION COMPLETE")
    print(f"   Generated: {generated}")
    print(f"   Failed: {failed}")
    print(f"   Skipped (already exist): {total_assets - generated - failed}")
    print("=" * 60)

if __name__ == "__main__":
    main()
