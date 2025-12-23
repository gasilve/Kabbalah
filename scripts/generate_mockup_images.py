"""
Generate premium images to match the mockup exactly.
Uses Pollinations.ai (free, no API key needed).
"""

import urllib.request
import urllib.parse
import os
import time

OUTPUT_DIR = "kabbalah-app/public"

IMAGES_TO_GENERATE = [
    # Cosmic Background
    {
        "path": "images/cosmic_bg.jpg",
        "prompt": "dark cosmic space background, deep blue and teal nebula clouds, scattered bright stars, mystical celestial atmosphere, subtle green aurora, soft glowing cosmic dust, fantasy game aesthetic, 4k quality, vertical mobile format",
        "width": 1080,
        "height": 1920
    },
    # Tiferet Sun Sphere
    {
        "path": "spheres/tiferet.png",
        "prompt": "3D golden sun sphere, brilliant yellow gold glowing orb, photorealistic metallic texture, radiating light rays, mystical energy, dark background, high detail, premium game asset, isolated centered",
        "width": 512,
        "height": 512
    },
    # Health Green Sphere
    {
        "path": "spheres/health.png",
        "prompt": "3D emerald green glowing sphere, brilliant green orb with inner light, glass translucent material, mystical healing energy glow, dark background, premium game asset, isolated centered",
        "width": 512,
        "height": 512
    },
    # Prosperity Gold Sphere
    {
        "path": "spheres/prosperity.png",
        "prompt": "3D golden prosperity medallion sphere, ornate gold coin with ancient symbols, glowing golden aura, wealth symbol, dark background, premium game asset, isolated centered",
        "width": 512,
        "height": 512
    },
    # Love Rose Sphere
    {
        "path": "spheres/love.png",
        "prompt": "3D rose pink glowing sphere, romantic pink crystal orb with inner light, soft glow, love energy, dark background, premium game asset, isolated centered",
        "width": 512,
        "height": 512
    },
    # Wisdom Blue Sphere
    {
        "path": "spheres/wisdom.png",
        "prompt": "3D sapphire blue glowing sphere, deep blue crystal orb with inner light, mystical wisdom energy, dark background, premium game asset, isolated centered",
        "width": 512,
        "height": 512
    },
    # Navbar Icons
    {
        "path": "icons/explore.png",
        "prompt": "golden compass icon, elegant stylized compass symbol, mystical golden glow, dark background, premium game UI icon, isolated centered, simple clean design",
        "width": 256,
        "height": 256
    },
    {
        "path": "icons/meditations.png",
        "prompt": "golden lotus flower icon, elegant meditation symbol, mystical golden glow, dark background, premium game UI icon, isolated centered, simple clean design",
        "width": 256,
        "height": 256
    },
    {
        "path": "icons/home.png",
        "prompt": "golden tree of life icon, kabbalah tree symbol, elegant mystical golden glow, dark background, premium game UI icon, isolated centered, simple clean design",
        "width": 256,
        "height": 256
    },
    {
        "path": "icons/connections.png",
        "prompt": "golden network connections icon, interconnected nodes symbol, mystical golden glow, dark background, premium game UI icon, isolated centered, simple clean design",
        "width": 256,
        "height": 256
    },
    {
        "path": "icons/profile.png",
        "prompt": "golden user profile silhouette icon, elegant human figure, mystical golden glow, dark background, premium game UI icon, isolated centered, simple clean design",
        "width": 256,
        "height": 256
    },
]

def generate_image(prompt, width, height, output_path):
    """Generate image using Pollinations.ai"""
    try:
        # Build URL
        encoded_prompt = urllib.parse.quote(prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true"
        
        # Download
        full_path = os.path.join(OUTPUT_DIR, output_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        print(f"🎨 Generating: {output_path}")
        urllib.request.urlretrieve(url, full_path)
        print(f"   ✅ Saved to: {full_path}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("🔮 PREMIUM IMAGE GENERATOR (Pollinations.ai)")
    print("="*60)
    
    success = 0
    failed = 0
    
    for img in IMAGES_TO_GENERATE:
        if generate_image(img["prompt"], img["width"], img["height"], img["path"]):
            success += 1
        else:
            failed += 1
        # Small delay between requests
        time.sleep(3)
    
    print("\n" + "="*60)
    print(f"🏁 DONE: {success} generated, {failed} failed")
    print("="*60)

if __name__ == "__main__":
    main()
