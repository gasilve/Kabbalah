import subprocess
import os
from pathlib import Path

# The 11 missing videos
MISSING_VIDEOS = [
    {"id": "-c_wPCK9tEg", "idx": 100, "title": "Kabbalah: Secretos del Zohar - clase 95 Mishpatim"},
    {"id": "nqWpiAZwmo4", "idx": 102, "title": "Video 102"},
    {"id": "zOgl1AazVow", "idx": 110, "title": "Video 110"},
    {"id": "pqn86jVV25o", "idx": 112, "title": "Video 112"},
    {"id": "bXvQMKywrGU", "idx": 144, "title": "Video 144"},
    {"id": "YpIrkEU2GYY", "idx": 145, "title": "Video 145"},
    {"id": "TeCW6eoeVog", "idx": 146, "title": "Video 146"},
    {"id": "P9F1wN-QfiE", "idx": 147, "title": "Video 147"},
    {"id": "iIZ7Vw-xIKY", "idx": 148, "title": "Video 148"},
    {"id": "9grcZ3fv9NI", "idx": 149, "title": "Video 149"},
    {"id": "YM42UKMl3KQ", "idx": 161, "title": "Video 161"}
]

AUDIO_DIR = Path("c:/Users/paparinots/Documents/Kabbalah/audios/secretos_zohar")

def download_video(video):
    video_id = video['id']
    idx = video['idx']
    title = video['title']
    
    print(f"\n[{idx}] Downloading: {title} ({video_id})")
    
    safe_title = "".join(c for c in title if c.isalnum() or c in " -_").strip()[:60]
    output_path = AUDIO_DIR / f"{idx:03d}_{safe_title}.mp3"
    
    if output_path.exists():
        print(f"  ✓ Already exists")
        return True

    # Try with advanced arguments
    cmd = [
        "yt-dlp",
        "-x", "--audio-format", "mp3", "--audio-quality", "128K",
        "--extractor-args", "youtube:player-client=web",
        "-o", str(output_path),
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ Downloaded successfully")
            return True
        else:
            print(f"  ❌ Error: {result.stderr[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return False

def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    success = 0
    for video in MISSING_VIDEOS:
        if download_video(video):
            success += 1
    
    print(f"\nSummary: {success}/{len(MISSING_VIDEOS)} downloaded locally.")

if __name__ == "__main__":
    main()
