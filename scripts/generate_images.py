"""
Multi-Provider Image Generator - Updated with FREE APIs
Supports: Pollinations.ai (FREE), Hugging Face (FREE), OpenAI, Stability
"""

import os
import json
import time
import requests
import urllib.parse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

OUTPUT_DIR = Path("c:/Users/paparinots/Documents/Kabbalah/kabbalah-app/public/generated")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

class ImageGenerator:
    """Multi-provider image generator with FREE options"""
    
    def __init__(self):
        self.providers = ["pollinations"]  # Always available, no key needed
        
        if os.getenv("HUGGINGFACE_API_KEY"):
            self.providers.append("huggingface")
        if os.getenv("OPENAI_API_KEY"):
            self.providers.append("openai")
        if os.getenv("STABILITY_API_KEY"):
            self.providers.append("stability")
            
        print(f"✅ Available providers: {self.providers}")
        print("   (Pollinations.ai is always free, no API key needed!)")
    
    def generate_pollinations(self, prompt: str, filename: str) -> bool:
        """
        Generate image with Pollinations.ai - 100% FREE, no API key!
        https://pollinations.ai/
        """
        try:
            # URL encode the prompt
            encoded_prompt = urllib.parse.quote(prompt)
            url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&nologo=true"
            
            print(f"  Generating with Pollinations.ai...")
            response = requests.get(url, timeout=120)
            
            if response.status_code == 200:
                filepath = OUTPUT_DIR / f"{filename}.png"
                filepath.write_bytes(response.content)
                print(f"  ✅ Saved: {filepath}")
                return True
            else:
                print(f"  ❌ Error: {response.status_code}")
                return False
        except Exception as e:
            print(f"  ❌ Pollinations error: {e}")
            return False
    
    def generate_huggingface(self, prompt: str, filename: str) -> bool:
        """Generate with Hugging Face Inference API"""
        api_key = os.getenv("HUGGINGFACE_API_KEY")
        
        try:
            response = requests.post(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                headers={"Authorization": f"Bearer {api_key}"},
                json={"inputs": prompt},
                timeout=120
            )
            
            if response.status_code == 200:
                filepath = OUTPUT_DIR / f"{filename}.png"
                filepath.write_bytes(response.content)
                print(f"  ✅ Saved: {filepath}")
                return True
            else:
                print(f"  ❌ HuggingFace error: {response.text[:100]}")
                return False
        except Exception as e:
            print(f"  ❌ HuggingFace error: {e}")
            return False
    
    def generate_openai(self, prompt: str, filename: str) -> bool:
        """Generate image with OpenAI DALL-E"""
        api_key = os.getenv("OPENAI_API_KEY")
        
        try:
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "quality": "standard"
                },
                timeout=120
            )
            
            if response.status_code == 200:
                img_url = response.json()["data"][0]["url"]
                img_data = requests.get(img_url).content
                filepath = OUTPUT_DIR / f"{filename}.png"
                filepath.write_bytes(img_data)
                print(f"  ✅ Saved: {filepath}")
                return True
            else:
                print(f"  ❌ OpenAI error: {response.text[:100]}")
                return False
        except Exception as e:
            print(f"  ❌ OpenAI error: {e}")
            return False
    
    def generate(self, prompt: str, filename: str, preferred_provider: str = None) -> bool:
        """Generate image, trying providers in order"""
        providers_to_try = self.providers.copy()
        
        if preferred_provider and preferred_provider in providers_to_try:
            providers_to_try.remove(preferred_provider)
            providers_to_try.insert(0, preferred_provider)
        
        for provider in providers_to_try:
            print(f"\n🎨 Trying {provider}...")
            try:
                if provider == "pollinations":
                    if self.generate_pollinations(prompt, filename):
                        return True
                elif provider == "huggingface":
                    if self.generate_huggingface(prompt, filename):
                        return True
                elif provider == "openai":
                    if self.generate_openai(prompt, filename):
                        return True
            except Exception as e:
                print(f"  {provider} failed: {e}")
                continue
            
            time.sleep(1)  # Rate limit between providers
        
        print("❌ All providers failed")
        return False


# Kabbalah App Asset Prompts
KABBALAH_PROMPTS = {
    # Spheres
    "sphere_protection": "A 3D rendered ruby red glowing sphere with shield symbol, mystical protection energy, cosmic dark background, game asset style",
    
    # Course backgrounds
    "course_tree_life": "Mystical Tree of Life Kabbalah with 10 glowing Sephirot spheres connected by light paths, cosmic purple gold background, spiritual",
    "course_72_names": "Ancient Hebrew letters grid glowing golden light, mystical Kabbalah 72 names, dark cosmic background, spiritual atmosphere",
    "course_zohar": "Ancient mystical Zohar book with golden light emanating from pages, floating in cosmic space, Hebrew mystical symbols",
    "course_aleph_bet": "Hebrew Alef Bet letters floating in cosmic space, each letter glowing different color, mystical spiritual atmosphere",
    
    # Medals
    "medal_beginner": "Golden star medal badge for app achievement, beginner level, glowing effect, game asset on dark background",
    "medal_intermediate": "Silver and gold ornate medal badge, intermediate level achievement, ethereal glow, game asset style",
    "medal_master": "Diamond and gold crown medal badge, master level achievement, brilliant glow, premium game asset",
    
    # UI Elements
    "card_glass": "Glass morphism UI card element, frosted transparent, subtle glow border, dark background, mobile app style",
    "button_glow": "Golden glowing button UI element, rounded corners, mystical glow effect, game UI style",
}


def main():
    print("=" * 50)
    print("🖼️  KABBALAH APP IMAGE GENERATOR")
    print("    Using FREE Pollinations.ai (no API key!)")
    print("=" * 50)
    
    generator = ImageGenerator()
    
    print("\n📋 Available assets to generate:")
    for i, name in enumerate(KABBALAH_PROMPTS.keys(), 1):
        print(f"   {i}. {name}")
    
    print("\n⚙️  Options:")
    print("   a - Generate ALL assets")
    print("   1-9 - Generate specific asset")
    print("   q - Quit")
    
    choice = input("\n👉 Enter choice: ").strip().lower()
    
    if choice == 'q':
        return
    elif choice == 'a':
        print("\n🚀 Generating all assets...")
        for name, prompt in KABBALAH_PROMPTS.items():
            print(f"\n⬇️ [{name}]")
            generator.generate(prompt, name)
            time.sleep(2)  # Be nice to free APIs
        print("\n✅ Done! Check kabbalah-app/public/generated/")
    else:
        try:
            idx = int(choice) - 1
            name = list(KABBALAH_PROMPTS.keys())[idx]
            prompt = KABBALAH_PROMPTS[name]
            print(f"\n⬇️ Generating: {name}")
            generator.generate(prompt, name)
        except (ValueError, IndexError):
            print("❌ Invalid choice")


if __name__ == "__main__":
    main()
