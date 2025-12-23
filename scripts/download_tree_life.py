import os
import time
import random
import subprocess

# Playlist: Kabbalah Mashiah - Árbol de la Vida
PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLJMifOLgCzqXLCiy3lO_VflsLmK5mGiVV"
OUTPUT_DIR = "transcripciones_arbol_vida"

def download_playlist_subtitles():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"Iniciando descarga segura de subtítulos para: {PLAYLIST_URL}")
    print("Se usará un delay aleatorio entre 15 y 45 segundos entre videos para evitar bloqueos.")
    
    # yt-dlp command to get video IDs
    # We use --flat-playlist to just get IDs first
    cmd_get_ids = [
        "yt-dlp", 
        "--flat-playlist", 
        "--print", "id", 
        PLAYLIST_URL
    ]
    
    try:
        result = subprocess.run(cmd_get_ids, capture_output=True, text=True, check=True)
        video_ids = result.stdout.strip().split('\n')
        print(f"Se encontraron {len(video_ids)} videos en la playlist.")
    except subprocess.CalledProcessError as e:
        print(f"Error al obtener lista de videos: {e}")
        return

    for i, video_id in enumerate(video_ids):
        if not video_id: continue
        
        print(f"\n[{i+1}/{len(video_ids)}] Procesando video ID: {video_id}")
        
        # Check if already exists
        expected_filename = os.path.join(OUTPUT_DIR, f"transcript_{video_id}")
        # yt-dlp might add language code, so we check loosely or just let it overwrite/skip
        
        cmd_download = [
            "yt-dlp",
            "--write-auto-sub",
            "--sub-lang", "es",
            "--skip-download",
            "--output", f"{OUTPUT_DIR}/transcript_%(id)s",
            f"https://www.youtube.com/watch?v={video_id}"
        ]
        
        try:
            subprocess.run(cmd_download, check=True)
            print("✓ Subtítulos descargados correctamente")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error al descargar subtítulos para {video_id}: {e}")
        
        # Sleep to be safe
        sleep_time = random.randint(15, 45)
        print(f"Esperando {sleep_time} segundos...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    download_playlist_subtitles()
