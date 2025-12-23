import subprocess
import os
from pathlib import Path

# Configuración
BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
RESCUE_DIR = BASE_DIR / "audios" / "rescue"
YT_DLP_PATH = "yt-dlp" # Asumiendo que está en el PATH, si no usar ruta absoluta

VIDEOS = [
    {"id": "iK6Uz6KjJVo", "playlist": "sefer_yetzirah", "title": "Clase 3"},
    {"id": "ki9E5c0CTug", "playlist": "sefer_yetzirah", "title": "Clase 4"},
    {"id": "aA7ba_FWnwY", "playlist": "sefer_yetzirah", "title": "Clase 5"},
    {"id": "xMB7KkjGp-k", "playlist": "sefer_yetzirah", "title": "Clase 6"},
    {"id": "T4waX0ZgkdY", "playlist": "sefer_yetzirah", "title": "Clase 8"},
    {"id": "0IWsTxx9TSs", "playlist": "sefer_yetzirah", "title": "Clase 9"},
    {"id": "AA9WCAwde28", "playlist": "sefer_yetzirah", "title": "Clase 13"},
    {"id": "b4SHIFkmOcU", "playlist": "sefer_yetzirah", "title": "Clase 18"},
    {"id": "KJM7ociVLog", "playlist": "tefila", "title": "Clase 38"},
    {"id": "wlEtY3fphjY", "playlist": "nombres_72", "title": "Libro Meditaciones"},
    {"id": "6mRl5wsqPhs", "playlist": "letras_hebreas", "title": "Privado"}
]

def download_audio(video_id, playlist, title):
    output_dir = RESCUE_DIR / playlist
    if not output_dir.exists():
        os.makedirs(output_dir)
    
    output_filename = f"{video_id}.mp3"
    output_path = output_dir / output_filename
    
    print(f"\n🎵 Descargando: {playlist} - {title} ({video_id})")
    
    cmd = [
        YT_DLP_PATH,
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "0",
        "-o", str(output_path),
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"✅ Descargado exito: {output_path}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al descargar {video_id}: {e}")
        return False

def main():
    if not RESCUE_DIR.exists():
        os.makedirs(RESCUE_DIR)
        
    success_count = 0
    for v in VIDEOS:
        if download_audio(v["id"], v["playlist"], v["title"]):
            success_count += 1
            
    print(f"\n📊 Resumen: {success_count}/{len(VIDEOS)} descargados.")

if __name__ == "__main__":
    main()
