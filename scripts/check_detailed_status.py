
import os
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Import configuration from download_robust
# We assume download_robust.py is in the same directory or accessible
try:
    from download_robust import PLAYLISTS
except ImportError:
    # Fallback configuration if import fails (e.g. running from different dir)
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

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
PROCESSED_DIR = BASE_DIR / "contenido_procesado"
CACHE_FILE = BASE_DIR / "playlist_cache.json"
REPORT_FILE = BASE_DIR / "DETAILED_STATUS.md"

def get_playlist_videos(playlist_url):
    """Fetch video IDs from YouTube using yt-dlp"""
    cmd = f'yt-dlp --flat-playlist --print id --print title "{playlist_url}"'
    try:
        # cwd=BASE_DIR ensures we are in the right context if needed
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120, encoding='utf-8', cwd=str(BASE_DIR))
        if result.returncode == 0 and result.stdout.strip():
            lines = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]
            videos = []
            # Output is alternating ID and Title because of --print id --print title
            # Actually, standard --print outputs line by line. 
            # Let's parse carefully. 
            # Better approach: yt-dlp -j --flat-playlist
            return fetch_playlist_json(playlist_url)
    except Exception as e:
        print(f"Error fetching playlist: {e}")
    return []

def fetch_playlist_json(playlist_url):
    cmd = f'yt-dlp --flat-playlist -j "{playlist_url}"'
    videos = []
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=180, encoding='utf-8', cwd=str(BASE_DIR))
        if result.returncode == 0:
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    try:
                        data = json.loads(line)
                        videos.append({
                            'id': data.get('id'),
                            'title': data.get('title', 'Unknown Title')
                        })
                    except:
                        pass
    except Exception as e:
        print(f"Error fetching JSON playlist: {e}")
    return videos

def update_cache():
    cache = {}
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except:
            pass

    for name, config in PLAYLISTS.items():
        # Only fetch if not in cache or manually forced (we'll just fetch if empty or old for now)
        # For this tool, let's trust the cache if it has items, but maybe refresh if requested.
        # We will assume we want to refresh if the list is empty.
        
        if name not in cache or not cache[name].get('videos'):
            print(f"Fetching playlist info for {name}...")
            videos = fetch_playlist_json(config['url'])
            if videos:
                cache[name] = {
                    'videos': videos,
                    'last_updated': datetime.now().isoformat()
                }
            else:
                print(f"Failed to fetch {name} from YouTube. Checking local download_progress.json...")
                # Fallback to download_progress.json
                if not 'progress_data' in locals():
                     try:
                        with open(BASE_DIR / 'download_progress.json', 'r', encoding='utf-8') as f:
                            progress_data = json.load(f)
                     except:
                        progress_data = {}
                
                if name in progress_data and 'video_ids' in progress_data[name]:
                    ids = progress_data[name]['video_ids']
                    print(f"  Found {len(ids)} videos in local progress records.")
                    cache[name] = {
                        'videos': [{'id': vid_id, 'title': 'Offline Record'} for vid_id in ids],
                        'last_updated': datetime.now().isoformat()
                    }
                else:
                    print(f"  No local records found for {name}")
    
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)
    
    return cache

def analyze_status(cache):
    report_data = {}
    
    for name, data in cache.items():
        folder_name = PLAYLISTS.get(name, {}).get('folder')
        if not folder_name: continue
        
        playlist_dir = TRANSCRIPTS_DIR / folder_name
        videos = data.get('videos', [])
        
        playlist_stats = []
        
        for idx, video in enumerate(videos, 1):
            vid_id = video['id']
            title = video['title']
            
            # Check Download Status
            # Patterns: {index}_{title}.json3, or just containing video_id
            # More robust: check for any file containing the ID
            
            # Check for success file
            download_status = "PENDING"
            download_file = None
            
            # Search for files with this ID
            files_by_id = list(playlist_dir.glob(f"*{vid_id}*"))
            # Search by Index Prefix
            files_by_index = list(playlist_dir.glob(f"{idx:03d}_*"))
            
            # Combine unique files
            found_files = list(set(files_by_id + files_by_index))
            
            # Check for specific markers
            
            # Check for specific markers
            is_no_subs = any("NO_SUBS" in f.name for f in found_files)
            is_downloaded = any(f.suffix in ['.json3', '.json'] and "NO_SUBS" not in f.name and "ERROR" not in f.name for f in found_files)
            is_error = any("ERROR" in f.name for f in found_files)
            
            if is_downloaded:
                download_status = "✅ DOWNLOADED"
                # Find the actual file
                for f in found_files:
                    if f.suffix in ['.json3', '.json'] and "NO_SUBS" not in f.name:
                        download_file = f
                        break
            elif is_no_subs:
                download_status = "⚠️ NO SUBS"
            elif is_error:
                download_status = "❌ ERROR"
            
            # Check AI Status
            ai_status = "PENDING"
            if download_status == "✅ DOWNLOADED" and download_file:
                # Expected extracted filename: {original_stem}_extracted.json
                expected_extracted = PROCESSED_DIR / f"{download_file.stem}_extracted.json"
                if expected_extracted.exists():
                    ai_status = "✅ PROCESSED"
                else:
                    ai_status = "⏳ QUEUED"
            elif download_status == "⚠️ NO SUBS":
                ai_status = "N/A"
                
            playlist_stats.append({
                'index': idx,
                'id': vid_id,
                'title': title,
                'download_status': download_status,
                'ai_status': ai_status
            })
            
        report_data[name] = playlist_stats
        
    return report_data

def generate_markdown(report_data):
    md = f"# 📊 Reporte Detallado de Estado - Kabbalah App\n"
    md += f"**Generado:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
    
    total_videos = 0
    total_downloaded = 0
    total_nosubs = 0
    total_ai = 0
    
    # Summary Section
    md += "## 📈 Resumen General\n\n"
    md += "| Playlist | Total | Descargados | Sin Subs | Procesados IA | % Completado |\n"
    md += "|----------|-------|-------------|----------|---------------|--------------|\n"
    
    for name, stats in report_data.items():
        total = len(stats)
        downloaded = len([s for s in stats if s['download_status'] == "✅ DOWNLOADED"])
        nosubs = len([s for s in stats if s['download_status'] == "⚠️ NO SUBS"])
        ai = len([s for s in stats if s['ai_status'] == "✅ PROCESSED"])
        
        # Completion includes Nosubs as "done" for download purposes, but let's track useful ones
        # Use AI / (Total - NoSubs) for useful completion? Or just raw AI count.
        # Let's keep it simple.
        
        md += f"| {name} | {total} | {downloaded} | {nosubs} | {ai} | {int(ai/total*100) if total else 0}% |\n"
        
        total_videos += total
        total_downloaded += downloaded
        total_nosubs += nosubs
        total_ai += ai
        
    md += f"| **TOTAL** | **{total_videos}** | **{total_downloaded}** | **{total_nosubs}** | **{total_ai}** | **{int(total_ai/total_videos*100) if total_videos else 0}%** |\n\n"
    
    # Detailed Sections
    for name, stats in report_data.items():
        md += f"## 📁 {name.upper()} ({len(stats)} videos)\n\n"
        md += "| # | ID | Título | Descarga | IA |\n"
        md += "|---|----|--------|----------|----|\n"
        
        for s in stats:
            # Truncate title
            title = s['title'][:50] + "..." if len(s['title']) > 50 else s['title']
            title = title.replace("|", "-") # avoid breaking table
            md += f"| {s['index']} | `{s['id']}` | {title} | {s['download_status']} | {s['ai_status']} |\n"
        
        md += "\n"
        
    return md

def main():
    print("🔍 Checking status...")
    cache = update_cache()
    report_data = analyze_status(cache)
    md_content = generate_markdown(report_data)
    
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"\n✅ Report generated: {REPORT_FILE}")
    print("\nSummary:")
    # Print simple summary to console
    for name, stats in report_data.items():
        downloaded = len([s for s in stats if s['download_status'] == "✅ DOWNLOADED"])
        ai = len([s for s in stats if s['ai_status'] == "✅ PROCESSED"])
        print(f"  - {name}: {downloaded} Downloads, {ai} AI Processed")

if __name__ == "__main__":
    main()
