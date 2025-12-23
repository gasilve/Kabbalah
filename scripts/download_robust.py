"""
Robust Subtitle Downloader v2 - FIXED
- Uses correct working directory
- Properly tracks progress
- Handles rate limiting
"""

import os
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

# Configuration - use absolute paths
BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
STATUS_FILE = BASE_DIR / "download_status.json"

PLAYLISTS = {
    "secretos_zohar": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqU80cECmKxsC-bfT58x6xwX",
        "folder": "secretos_zohar"
    },
    "arbol_vida": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXLCiy3lO_VflsLmK5mGiVV",
        "folder": "arbol_vida"
    },
    "sefer_yetzirah": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXAvZhSaWgdSoywAOTYskGi",
        "folder": "sefer_yetzirah"
    },
    "tefila": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXPslhwmh15iQPZuNSPXuWt",
        "folder": "tefila"
    },
    "puertas_luz": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqX9mb2KeWkI1rzpzSjPXmA5",
        "folder": "puertas_luz"
    },
    "shir_hashirim": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqWnji1Z6ntTHv49gl0f3-jb",
        "folder": "shir_hashirim"
    },
    "nombres_72": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXTu8yLrqUbWfFh2JAOrPrv",
        "folder": "nombres_72"
    },
    "letras_hebreas": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqVwf0L5M0SLBNBcMcZagoog",
        "folder": "letras_hebreas"
    }
}

def get_playlist_videos(playlist_url):
    """Get list of video IDs in playlist"""
    cmd = f'yt-dlp --flat-playlist --print id "{playlist_url}"'
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, cwd=str(BASE_DIR))
        if result.returncode == 0 and result.stdout.strip():
            return [vid.strip() for vid in result.stdout.strip().split('\n') if vid.strip()]
    except Exception as e:
        print(f"Error: {e}")
    return []

def download_subtitle(video_id, output_dir, index):
    """Download subtitle for a single video"""
    # Change to output directory before running
    output_template = f"{index:03d}_%(title)s"
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    cmd = f'yt-dlp --skip-download --write-auto-sub --sub-lang es --sub-format json3 -o "{output_template}" "{url}"'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, cwd=str(output_dir))
        if result.returncode == 0 and "Writing video subtitles" in result.stdout:
            return True, "Success"
        elif "no subtitles" in result.stdout.lower() or "no subtitles" in result.stderr.lower():
            return False, "No subtitles available"
        else:
            return False, result.stderr[:100] if result.stderr else result.stdout[:100]
    except subprocess.TimeoutExpired:
        return False, "Timeout"
    except Exception as e:
        return False, str(e)

def load_status():
    if STATUS_FILE.exists():
        with open(STATUS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_status(status):
    with open(STATUS_FILE, 'w', encoding='utf-8') as f:
        json.dump(status, f, indent=2, ensure_ascii=False)

def count_downloaded(folder):
    """Count .json3 files (not ERROR files)"""
    if not folder.exists():
        return 0
    return len([f for f in folder.glob("*.json3") if not f.name.startswith("ERROR")])

def main():
    print("=" * 60)
    print("KABBALAH SUBTITLE DOWNLOADER v2")
    print("=" * 60)
    
    status = load_status()
    
    for playlist_name, config in PLAYLISTS.items():
        print(f"\n📚 {playlist_name.upper()}")
        
        folder = TRANSCRIPTS_DIR / config["folder"]
        folder.mkdir(parents=True, exist_ok=True)
        
        # Get playlist
        print("  → Fetching playlist...")
        videos = get_playlist_videos(config["url"])
        
        if not videos:
            print("  ⚠️ Could not fetch, skipping...")
            continue
        
        # Count existing
        downloaded = count_downloaded(folder)
        pending = len(videos) - downloaded
        
        print(f"  📊 Total: {len(videos)} | Done: {downloaded} | Pending: {pending}")
        
        # Update status
        status[playlist_name] = {
            "total": len(videos),
            "downloaded": downloaded,
            "pending": pending,
            "last_updated": datetime.now().isoformat()
        }
        save_status(status)
        
        # Download missing (limit to 5 per playlist to avoid rate limiting)
        count = 0
        max_per_run = 50
        
        for idx, video_id in enumerate(videos, 1):
            # Check if already exists
            pattern = f"{idx:03d}_*.json3"
            if list(folder.glob(pattern)):
                continue
            
            if count >= max_per_run:
                print(f"  ⏸️ Limit reached ({max_per_run}). Will continue next run.")
                break
            
            print(f"  ⬇️ [{idx}/{len(videos)}] {video_id}...", end=" ", flush=True)
            
            success, msg = download_subtitle(video_id, folder, idx)
            
            if success:
                print("✅")
                count += 1
                status[playlist_name]["downloaded"] += 1
            else:
                print(f"❌ {msg[:30]}")
                # Save marker for No Subtitles
                if "No subtitles" in msg:
                     # Create empty marker file
                     marker_file = folder / f"NO_SUBS_{idx:03d}_{video_id}.txt"
                     try:
                         with open(marker_file, 'w') as f:
                             f.write(f"No subtitles available as of {datetime.now()}")
                     except:
                         pass
            
            save_status(status)
            time.sleep(3)  # Rate limit
        
        status[playlist_name]["pending"] = len(videos) - count_downloaded(folder)
        save_status(status)
    
    # Final report
    print("\n" + "=" * 60)
    print("📊 STATUS REPORT")
    print("=" * 60)
    
    status = load_status()
    total_all, done_all = 0, 0
    
    for name, data in status.items():
        total = data.get("total", 0)
        done = data.get("downloaded", 0)
        total_all += total
        done_all += done
        pct = (done / total * 100) if total > 0 else 0
        print(f"  {name}: {done}/{total} ({pct:.0f}%)")
    
    pct_all = (done_all / total_all * 100) if total_all > 0 else 0
    print(f"\n  TOTAL: {done_all}/{total_all} ({pct_all:.0f}%)")
    print("=" * 60)
    print("\nRun again to continue downloading more subtitles.")

if __name__ == "__main__":
    main()
