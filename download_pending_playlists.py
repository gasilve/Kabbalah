"""
Script para descargar subtítulos de playlists pendientes
Versión mejorada con manejo de múltiples playlists
"""
import os
import json
import time
from pathlib import Path

# Configuración de playlists pendientes
PENDING_PLAYLISTS = [
    {
        'name': 'sefer_yetzirah',
        'file': 'download_progress.json',
        'key': 'sefer_yetzirah',
        'output_dir': 'transcripciones/sefer_yetzirah'
    },
    {
        'name': 'tefila',
        'file': 'download_progress.json',
        'key': 'tefila',
        'output_dir': 'transcripciones/tefila'
    }
]

def get_playlist_status(playlist_key):
    """Obtiene el estado de una playlist"""
    progress_file = Path('download_progress.json')
    
    if not progress_file.exists():
        return None
    
    with open(progress_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if playlist_key not in data:
        return None
    
    playlist_data = data[playlist_key]
    total = playlist_data['total']
    downloaded = len(playlist_data.get('downloaded', []))
    pending = total - downloaded
    
    return {
        'total': total,
        'downloaded': downloaded,
        'pending': pending,
        'video_ids': playlist_data.get('video_ids', [])
    }

def download_playlist_subtitles(playlist_key, output_dir):
    """Descarga subtítulos de una playlist específica"""
    import subprocess
    
    cmd = f'python download_playlist_subtitles.py --playlist {playlist_key}'
    
    print(f"\n🚀 Ejecutando: {cmd}")
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✅ Descarga completada para {playlist_key}")
            return True
        else:
            print(f"⚠️  Error en descarga: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    print("""
╔════════════════════════════════════════════════════════════════════╗
║     DESCARGADOR DE PLAYLISTS PENDIENTES                            ║
║     Kabbalah App - YouTube Transcripts                             ║
╚════════════════════════════════════════════════════════════════════╝
    """)
    
    print("\n📊 Estado de playlists:")
    print("="*70)
    
    total_pending = 0
    
    for playlist in PENDING_PLAYLISTS:
        status = get_playlist_status(playlist['key'])
        
        if status:
            print(f"\n📁 {playlist['name']}")
            print(f"   Total: {status['total']}")
            print(f"   ✓ Descargados: {status['downloaded']}")
            print(f"   ⏳ Pendientes: {status['pending']}")
            total_pending += status['pending']
    
    print(f"\n{'='*70}")
    print(f"Total pendientes: {total_pending} videos")
    print(f"{'='*70}")
    
    if total_pending == 0:
        print("\n🎉 ¡Todas las playlists están completas!")
        return
    
    print("\n⚠️  NOTA: YouTube puede bloquear después de ~30 videos")
    print("   El script pausará automáticamente si detecta bloqueo")
    
    input("\n✋ Presiona ENTER para comenzar...")
    
    # Procesar cada playlist
    for playlist in PENDING_PLAYLISTS:
        status = get_playlist_status(playlist['key'])
        
        if status and status['pending'] > 0:
            print(f"\n\n{'='*70}")
            print(f"Procesando: {playlist['name']}")
            print(f"{'='*70}")
            
            download_playlist_subtitles(playlist['key'], playlist['output_dir'])
            
            # Pausa entre playlists
            print("\n⏸️  Pausa de 30 segundos entre playlists...")
            time.sleep(30)
    
    print("\n\n🎉 ¡Proceso completado!")

if __name__ == "__main__":
    main()
