import requests
import os
import time

# Directory for assets
ASSETS_DIR = "kabbalah-app/public/images"
ICONS_DIR = "kabbalah-app/public/icons"

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(ICONS_DIR, exist_ok=True)

def generate_image(prompt, filename, width=1024, height=1024, is_icon=False):
    print(f"🎨 Generating: {filename}...")
    
    # Enhance prompt for Pollinations
    full_prompt = prompt
    if not is_icon:
        full_prompt += ", cinematic lighting, 8k resolution, mystical atmosphere, golden and blue hues, hyperrealistic, divine light"
    else:
        full_prompt += ", vector style, minimal, flat design, white on black, high contrast, logo"

    # Pollinations API URL
    url = f"https://image.pollinations.ai/prompt/{full_prompt}?width={width}&height={height}&nologo=true"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            path = os.path.join(ICONS_DIR if is_icon else ASSETS_DIR, filename)
            with open(path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Saved to {path}")
            return True
        else:
            print(f"❌ Failed to generate {filename}: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    # 1. Navbar Icon - Tree of Life
    generate_image(
        "Kabbalah Tree of Life symbol, sacred geometry, golden lines, glowing, minimal, spiritual symbol",
        "tree_of_life_icon.png",
        width=512, height=512,
        is_icon=True
    )

    # 2. Backgrounds for Pages
    backgrounds = [
        ("72_names_bg.jpg", "72 names of god hebrew letters floating in space, mystical, galaxy background"),
        ("tree_of_life_bg.jpg", "Sephirot tree of life glowing in the cosmos, connecting lines, divine energy"),
        ("meditation_bg.jpg", "Peaceful abstract spiritual energy, soft purple and gold clouds, divine presence"),
        ("zohar_bg.jpg", "Ancient book of Zohar opening with light coming out, mystical library, particles of light")
    ]

    for filename, prompt in backgrounds:
        generate_image(prompt, filename, width=1280, height=720)
        time.sleep(1)

if __name__ == "__main__":
    main()
