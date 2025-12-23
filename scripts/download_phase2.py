"""
Extended Playlist Downloader - Phase 2
Adds new playlists: Aleph-Bet, 72 Names, Metatron Wisdom
"""

import os
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
STATUS_FILE = BASE_DIR / "download_status_phase2.json"

# Extended playlists including new ones
PLAYLISTS = {
    # Original playlists
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
    "tefila_kavanah": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXPslhwmh15iQPZuNSPXuWt",
        "folder": "tefila_kavanah"
    },
    # NEW playlists
    "aleph_bet_conceptos": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqVwf0L5M0SLBNBcMcZagoog",
        "folder": "aleph_bet_conceptos"
    },
    "72_nombres_dios": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqXTu8yLrqUbWfFh2JAOrPrv",
        "folder": "72_nombres_dios"
    },
    "joyas_metatron": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqWdKgttUP2zN8c7b3Ygr0Xn",
        "folder": "joyas_metatron"
    }
}

BATCH_SIZE = 3  # Per playlist per run

def get_playlist_videos(playlist_url):
    cmd = f'yt-dlp --flat-playlist --print id "{playlist_url}"'
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, cwd=str(BASE_DIR))
        if result.returncode == 0 and result.stdout.strip():
            return [vid.strip() for vid in result.stdout.strip().split('\n') if vid.strip()]
    except Exception as e:
        print(f"Error: {e}")
    return []

def download_subtitle(video_id, output_dir, index):
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

def main():
    print("=" * 60)
    print("KABBALAH EXTENDED DOWNLOADER - PHASE 2")
    print(f"Playlists: {len(PLAYLISTS)}")
    print("=" * 60)
    
    status = load_status()
    total_new = 0
    
    for playlist_name, config in PLAYLISTS.items():
        print(f"\n📚 {playlist_name.upper()}")
        
        folder = TRANSCRIPTS_DIR / config["folder"]
        folder.mkdir(parents=True, exist_ok=True)
        
        videos = get_playlist_videos(config["url"])
        
        if not videos:
            print("  ⚠️ Could not fetch, skipping...")
            continue
        
        downloaded = count_downloaded(folder)
        print(f"  📊 Total: {len(videos)} | Done: {downloaded} | Pending: {len(videos) - downloaded}")
        
        status[playlist_name] = {
            "total": len(videos),
            "downloaded": downloaded,
            "last_updated": datetime.now().isoformat()
        }
        save_status(status)
        
        count = 0
        for idx, video_id in enumerate(videos, 1):
            if count >= BATCH_SIZE:
                print(f"  ⏸️ Batch limit ({BATCH_SIZE}). Run again to continue.")
                break
            
            pattern = f"{idx:03d}_*.json3"
            if list(folder.glob(pattern)):
                continue
            
            print(f"  ⬇️ [{idx}/{len(videos)}] {video_id}...", end=" ", flush=True)
            
            success, msg = download_subtitle(video_id, folder, idx)
            
            if success:
                print("✅")
                count += 1
                total_new += 1
            else:
                print(f"❌ {msg}")
            
            time.sleep(2)
        
        status[playlist_name]["downloaded"] = count_downloaded(folder)
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
    print("\nRun again to continue downloading.")

if __name__ == "__main__":
    main()
