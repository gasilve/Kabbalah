import os
import json
import subprocess
import time
from pathlib import Path

# Paths
BASE_DIR = Path("/home/willy")
AUDIO_DIR = BASE_DIR / "kabbalah_audios"
MISSING_FILE = BASE_DIR / "missing_zohar_videos.json"

# Potential yt-dlp paths
YT_DLP_PATHS = [
    "/home/willy/.local/bin/yt-dlp",
    "/usr/local/bin/yt-dlp",
    "yt-dlp"
]

def get_yt_dlp():
    for path in YT_DLP_PATHS:
        try:
            subprocess.run([path, "--version"], capture_output=True, check=True)
            return path
        except:
            continue
    return None

def install_dependencies():
    print("Checking dependencies...")
    path = get_yt_dlp()
    if path:
        print(f"yt-dlp is available at: {path}")
        return path
    else:
        print("Installing yt-dlp via pip...")
        subprocess.run(["pip3", "install", "yt-dlp"], check=True)
        return get_yt_dlp()

def download_audio(video_id, idx, title, yt_dlp_path):
    print(f"\nProcessing {idx}: {title} ({video_id})")
    safe_title = "".join(c for c in title if c.isalnum() or c in " -_").strip()[:60]
    output_name = f"{idx:03d}_{safe_title}.mp3"
    output_path = AUDIO_DIR / output_name
    
    if output_path.exists():
        print(f"  ✓ Already exists: {output_name}")
        return True

    cmd = [
        yt_dlp_path, "-x", "--audio-format", "mp3", "--audio-quality", "128K",
        "--no-playlist", "-o", str(output_path),
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            print(f"  ✅ Successfully downloaded: {output_name}")
            return True
        else:
            print(f"  ❌ Error downloading: {result.stderr[:100]}")
            return False
    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")
        return False

def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    yt_dlp_path = install_dependencies()
    
    if not yt_dlp_path:
        print("Error: yt-dlp could not be installed or found!")
        return
        
    if not MISSING_FILE.exists():
        print(f"Error: {MISSING_FILE} not found!")
        return

    with open(MISSING_FILE, "r") as f:
        videos = json.load(f)

    print(f"Starting download of {len(videos)} videos using {yt_dlp_path}...")
    
    success_count = 0
    fail_count = 0
    
    for i, video in enumerate(videos, 1):
        print(f"[{i}/{len(videos)}]", end="")
        if download_audio(video['id'], video['idx'], video['title'], yt_dlp_path):
            success_count += 1
        else:
            fail_count += 1
            
        # To avoid YouTube blocks, slight delay
        time.sleep(2)

    print("\n" + "="*40)
    print(f"Finished. Success: {success_count}, Failed: {fail_count}")
    print("="*40)

if __name__ == "__main__":
    main()
