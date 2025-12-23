"""
Auto-Download Script with Timer
Runs continuously, downloading subtitles every X minutes
Press Ctrl+C to stop
"""

import os
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

# Configuration
BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
STATUS_FILE = BASE_DIR / "download_status.json"
LOG_FILE = BASE_DIR / "download_log.txt"

# Timer settings
INTERVAL_MINUTES = 10  # Run every 10 minutes
BATCH_SIZE = 3  # Download 3 per playlist per run (to avoid rate limiting)

PLAYLISTS = {
    "secretos_zohar": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqU80cECmKxsC-bfT58x6xwX",
        "folder": "Secretos_del_Zohar"
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
    }
}

def log(message):
    """Log to file and console"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {message}"
    print(line)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(line + "\n")

def get_playlist_videos(playlist_url):
    """Get list of video IDs"""
    cmd = f'yt-dlp --flat-playlist --print id "{playlist_url}"'
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, cwd=str(BASE_DIR))
        if result.returncode == 0 and result.stdout.strip():
            return [vid.strip() for vid in result.stdout.strip().split('\n') if vid.strip()]
    except Exception as e:
        log(f"Error fetching playlist: {e}")
    return []

def download_subtitle(video_id, output_dir, index):
    """Download subtitle for single video"""
    output_template = f"{index:03d}_%(title)s"
    url = f"https://www.youtube.com/watch?v={video_id}"
    cmd = f'yt-dlp --skip-download --write-auto-sub --sub-lang es --sub-format json3 -o "{output_template}" "{url}"'
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, cwd=str(output_dir))
        if result.returncode == 0 and "Writing video subtitles" in result.stdout:
            return True, "OK"
        elif "no subtitles" in (result.stdout + result.stderr).lower():
            return False, "No subs"
        else:
            return False, "Error"
    except subprocess.TimeoutExpired:
        return False, "Timeout"
    except Exception as e:
        return False, str(e)[:20]

def load_status():
    if STATUS_FILE.exists():
        with open(STATUS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_status(status):
    with open(STATUS_FILE, 'w', encoding='utf-8') as f:
        json.dump(status, f, indent=2, ensure_ascii=False)

def count_downloaded(folder):
    if not folder.exists():
        return 0
    return len([f for f in folder.glob("*.json3") if not f.name.startswith("ERROR")])

def run_download_cycle():
    """Run one download cycle"""
    log("=" * 50)
    log("Starting download cycle...")
    
    status = load_status()
    total_new = 0
    
    for playlist_name, config in PLAYLISTS.items():
        folder = TRANSCRIPTS_DIR / config["folder"]
        folder.mkdir(parents=True, exist_ok=True)
        
        # Fetch playlist (with caching to reduce API calls)
        videos = get_playlist_videos(config["url"])
        
        if not videos:
            log(f"  {playlist_name}: Could not fetch, skipping")
            continue
        
        downloaded = count_downloaded(folder)
        log(f"  {playlist_name}: {downloaded}/{len(videos)}")
        
        # Download missing (limited batch)
        count = 0
        for idx, video_id in enumerate(videos, 1):
            if count >= BATCH_SIZE:
                break
            
            pattern = f"{idx:03d}_*.json3"
            if list(folder.glob(pattern)):
                continue
            
            success, msg = download_subtitle(video_id, folder, idx)
            
            if success:
                count += 1
                total_new += 1
                log(f"    ✅ {idx}/{len(videos)}")
            else:
                log(f"    ❌ {idx}: {msg}")
            
            time.sleep(2)  # Small delay between downloads
        
        # Update status
        status[playlist_name] = {
            "total": len(videos),
            "downloaded": count_downloaded(folder),
            "last_updated": datetime.now().isoformat()
        }
        save_status(status)
    
    log(f"Cycle complete. Downloaded {total_new} new subtitles.")
    return total_new

def main():
    log("=" * 50)
    log("AUTO-DOWNLOAD STARTED")
    log(f"Interval: {INTERVAL_MINUTES} minutes")
    log(f"Batch size: {BATCH_SIZE} per playlist")
    log("Press Ctrl+C to stop")
    log("=" * 50)
    
    try:
        while True:
            run_download_cycle()
            
            # Check if all done
            status = load_status()
            total = sum(s.get("total", 0) for s in status.values())
            done = sum(s.get("downloaded", 0) for s in status.values())
            
            if done >= total and total > 0:
                log("🎉 All subtitles downloaded!")
                break
            
            log(f"Next run in {INTERVAL_MINUTES} minutes... (Total: {done}/{total})")
            time.sleep(INTERVAL_MINUTES * 60)
            
    except KeyboardInterrupt:
        log("\nStopped by user.")
        
    log("=" * 50)
    log("FINAL STATUS:")
    status = load_status()
    for name, data in status.items():
        log(f"  {name}: {data.get('downloaded', 0)}/{data.get('total', 0)}")
    log("=" * 50)

if __name__ == "__main__":
    main()
