"""
Robust Audio Downloader for Videos Without Subtitles
- Resumes from where it left off if interrupted
- Tracks progress in JSON file
- Downloads MP3 audio at 128kbps
- Includes retry logic for failed downloads
"""

import os
import json
import subprocess
import time
from pathlib import Path
from datetime import datetime

# Configuration
BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
AUDIO_DIR = BASE_DIR / "audios"
PROGRESS_FILE = BASE_DIR / "audio_download_progress.json"

# Playlist configuration
PLAYLIST_CONFIG = {
    "secretos_zohar": {
        "url": "https://www.youtube.com/playlist?list=PLJMifOLgCzqU80cECmKxsC-bfT58x6xwX",
        "folder": "secretos_zohar"
    }
}

def load_progress():
    """Load download progress from file"""
    if PROGRESS_FILE.exists():
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {}

def save_progress(progress):
    """Save download progress to file"""
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)

def get_playlist_videos(playlist_url):
    """Get list of video IDs and titles from playlist"""
    cmd = f'yt-dlp --flat-playlist --print "%(id)s|%(title)s" "{playlist_url}"'
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=180)
        if result.returncode == 0 and result.stdout.strip():
            videos = []
            for line in result.stdout.strip().split('\n'):
                if '|' in line:
                    vid_id, title = line.split('|', 1)
                    videos.append({'id': vid_id.strip(), 'title': title.strip()})
            return videos
    except Exception as e:
        print(f"Error fetching playlist: {e}")
    return []

def has_subtitle(folder, index, video_id):
    """Check if video already has subtitle downloaded"""
    patterns = [
        f"{index:03d}_*.json3",
        f"{index:03d}_*.json",
        f"{index:03d}_*.txt"
    ]
    for pattern in patterns:
        matches = list(folder.glob(pattern))
        valid = [m for m in matches if 'ERROR' not in m.name and 'NO_SUBS' not in m.name]
        if valid:
            return True
    return False

def has_audio(folder, index):
    """Check if audio already downloaded"""
    pattern = f"{index:03d}_*.mp3"
    return len(list(folder.glob(pattern))) > 0

def download_audio(video_id, output_dir, index, title, retries=3):
    """Download audio as MP3 128kbps with retry logic"""
    # Sanitize title for filename
    safe_title = "".join(c for c in title if c.isalnum() or c in " -_").strip()[:80]
    output_template = f"{index:03d}_{safe_title}"
    url = f"https://www.youtube.com/watch?v={video_id}"
    
    for attempt in range(retries):
        cmd = f'yt-dlp -x --audio-format mp3 --audio-quality 128K --no-playlist -o "{output_template}.%(ext)s" "{url}"'
        
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=600, cwd=str(output_dir))
            if result.returncode == 0:
                return True, "Success"
            error = result.stderr[:100] if result.stderr else "Unknown error"
            if attempt < retries - 1:
                print(f"     ⚠️ Reintentando ({attempt + 2}/{retries})...")
                time.sleep(5)
        except subprocess.TimeoutExpired:
            if attempt < retries - 1:
                print(f"     ⚠️ Timeout, reintentando...")
                time.sleep(5)
            else:
                return False, "Timeout after retries"
        except Exception as e:
            return False, str(e)
    
    return False, f"Failed after {retries} attempts"

def main():
    print("=" * 60)
    print("AUDIO DOWNLOADER ROBUSTO - Videos sin subtítulos")
    print("=" * 60)
    print(f"📁 Destino: {AUDIO_DIR}")
    print(f"📊 Progreso: {PROGRESS_FILE}")
    print()
    
    progress = load_progress()
    
    for playlist_name, config in PLAYLIST_CONFIG.items():
        print(f"\n📚 {playlist_name.upper()}")
        
        # Initialize progress for playlist
        if playlist_name not in progress:
            progress[playlist_name] = {
                'downloaded': [],
                'failed': [],
                'skipped': [],
                'last_updated': None
            }
        
        # Create directories
        transcript_folder = TRANSCRIPTS_DIR / config["folder"]
        audio_folder = AUDIO_DIR / config["folder"]
        audio_folder.mkdir(parents=True, exist_ok=True)
        
        # Get playlist
        print("  → Obteniendo lista de videos...")
        videos = get_playlist_videos(config["url"])
        
        if not videos:
            print("  ⚠️ No se pudo obtener la playlist, usando cache local...")
            # Try to use cached video list from download_progress.json
            try:
                with open(BASE_DIR / 'download_progress.json', 'r') as f:
                    dp = json.load(f)
                    if playlist_name in dp and 'video_ids' in dp[playlist_name]:
                        videos = [{'id': vid, 'title': f'Video {i}'} for i, vid in enumerate(dp[playlist_name]['video_ids'], 1)]
            except:
                print("  ❌ No hay cache disponible")
                continue
        
        print(f"  📊 Total videos en playlist: {len(videos)}")
        
        # Find videos that need audio download
        to_download = []
        for idx, video in enumerate(videos, 1):
            # Skip if already has subtitle
            if has_subtitle(transcript_folder, idx, video['id']):
                if video['id'] not in progress[playlist_name]['skipped']:
                    progress[playlist_name]['skipped'].append(video['id'])
                continue
            
            # Skip if already downloaded audio
            if has_audio(audio_folder, idx):
                if video['id'] not in progress[playlist_name]['downloaded']:
                    progress[playlist_name]['downloaded'].append(video['id'])
                continue
            
            # Skip if already processed (failed)
            if video['id'] in progress[playlist_name]['failed']:
                continue
            
            to_download.append((idx, video))
        
        already_done = len(progress[playlist_name]['downloaded'])
        skipped = len(progress[playlist_name]['skipped'])
        
        print(f"  ✅ Ya descargados: {already_done}")
        print(f"  ⏭️  Con subtítulos (skip): {skipped}")
        print(f"  ⏳ Pendientes: {len(to_download)}")
        
        if not to_download:
            print("  ✅ No hay más audios pendientes")
            continue
        
        save_progress(progress)
        
        # Download pending audios
        for i, (idx, video) in enumerate(to_download, 1):
            print(f"\n  [{i}/{len(to_download)}] #{idx} - {video['title'][:45]}...")
            
            success, msg = download_audio(video['id'], audio_folder, idx, video['title'])
            
            if success:
                print(f"     ✅ Descargado")
                progress[playlist_name]['downloaded'].append(video['id'])
            else:
                print(f"     ❌ Error: {msg[:50]}")
                progress[playlist_name]['failed'].append(video['id'])
            
            progress[playlist_name]['last_updated'] = datetime.now().isoformat()
            save_progress(progress)
            
            # Brief pause to avoid rate limiting
            time.sleep(2)
        
        # Summary
        print(f"\n  📊 Progreso actual:")
        print(f"     Descargados: {len(progress[playlist_name]['downloaded'])}")
        print(f"     Fallidos: {len(progress[playlist_name]['failed'])}")
        print(f"     Skipped (tienen subs): {len(progress[playlist_name]['skipped'])}")
    
    print("\n" + "=" * 60)
    print("✅ Sesión completada")
    print(f"📁 Audios en: {AUDIO_DIR}")
    print(f"📊 Progreso guardado en: {PROGRESS_FILE}")
    print("\n💡 Ejecuta de nuevo para continuar si fue interrumpido")
    print("=" * 60)

if __name__ == "__main__":
    main()
