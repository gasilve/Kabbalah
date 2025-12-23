"""
Show Current Processing Status (Windows-compatible version)
Enhanced with detailed file counts
"""

from pathlib import Path
import json
from datetime import datetime
import sys

sys.path.insert(0, str(Path(__file__).parent))
from state_manager import load_state

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
PROCESSED_DIR = BASE_DIR / "contenido_procesado"
AUDIOS_DIR = BASE_DIR / "audios"

def count_files(folder: Path, pattern: str) -> int:
    """Count files matching pattern in folder"""
    if not folder.exists():
        return 0
    return len(list(folder.glob(pattern)))

def get_actual_counts(playlist: str) -> dict:
    """Get actual file counts from filesystem"""
    transcript_folder = TRANSCRIPTS_DIR / playlist
    processed_folder = PROCESSED_DIR / playlist
    audio_folder = AUDIOS_DIR / playlist
    
    # Count transcriptions (subtitles from YouTube or Whisper)
    subtitles_count = 0
    if transcript_folder.exists():
        json_files = list(transcript_folder.glob("*.json")) + list(transcript_folder.glob("*.json3"))
        # Exclude error files and extracted files
        subtitles_count = len([f for f in json_files if not any(x in f.name for x in ['ERROR', 'NO_SUBS', '_extracted'])])
    
    # Count audios (MP3s)
    audios_count = count_files(audio_folder, "*.mp3")
    
    # Count processed files
    processed_count = count_files(processed_folder, "*_extracted.json")
    
    return {
        'subtitles': subtitles_count,
        'audios': audios_count,
        'processed': processed_count
    }

def show_status():
    """Display current processing status with detailed file counts"""
    state = load_state()
    
    print("\n" + "="*70)
    print("ESTADO DEL PROCESAMIENTO - KABBALAH")
    print("="*70 + "\n")
    
    for playlist, data in state.items():
        phase = data.get('phase', 'unknown')
        stats = data.get('stats', {})
        completed = data.get('completed', {})
        last_updated = data.get('last_updated')
        
        # Get actual file counts
        actual = get_actual_counts(playlist)
        
        # Header
        print(f"{'-'*70}")
        print(f"{playlist.upper().replace('_', ' ')}")
        print(f"{'-'*70}")
        
        # Phase
        print(f"\nFase actual: {phase}")
        
        # Detailed file counts
        print(f"\nArchivos descargados:")
        print(f"   Subtitulos (YouTube/Whisper): {actual['subtitles']}")
        print(f"   Audios (MP3):                  {actual['audios']}")
        
        print(f"\nProcesamiento:")
        print(f"   Procesados con IA:             {actual['processed']}")
        
        # Pending calculations
        pending_ai = actual['subtitles'] - actual['processed']
        if pending_ai > 0:
            print(f"   Pendientes de IA:              {pending_ai}")
        
        # Stats from state (for reference)
        print(f"\nEstadisticas generales:")
        print(f"   Total videos en playlist:      {stats.get('total_videos', 0)}")
        
        # Progress bar
        total = stats.get('total_videos', 1)
        ai_done = actual['processed']
        progress_pct = (ai_done / total * 100) if total > 0 else 0
        
        bar_length = 40
        filled = int(bar_length * progress_pct / 100)
        bar = '#' * filled + '.' * (bar_length - filled)
        
        print(f"\nProgreso general: [{bar}] {progress_pct:.1f}%")
        print(f"   ({ai_done}/{total} videos procesados)")
        
        # Verification status
        verified = stats.get('verified', False)
        if verified:
            print(f"\n[OK] Verificado: Seguro para limpieza")
        elif phase in ['verification', 'cleanup', 'completed']:
            print(f"\n[!] Verificacion pendiente")
        
        # Cleanup status
        if completed.get('cleanup', False):
            print(f"[CLEAN] Limpieza completada: MP3s eliminados")
        elif actual['audios'] > 0:
            # Calculate space
            audio_folder = AUDIOS_DIR / playlist
            if audio_folder.exists():
                mp3_files = list(audio_folder.glob("*.mp3"))
                if mp3_files:
                    total_size = sum(f.stat().st_size for f in mp3_files)
                    size_gb = total_size / (1024 * 1024 * 1024)
                    print(f"\n[SPACE] MP3s ocupan: {size_gb:.2f} GB")
        
        # Last updated
        if last_updated:
            try:
                dt = datetime.fromisoformat(last_updated)
                print(f"\nUltima actualizacion: {dt.strftime('%Y-%m-%d %H:%M:%S')}")
            except:
                pass
        
        print()
    
    print("="*70)
    
    # Summary
    print("\nRESUMEN GLOBAL:")
    total_subtitles = 0
    total_audios = 0
    total_processed = 0
    
    for playlist in state.keys():
        actual = get_actual_counts(playlist)
        total_subtitles += actual['subtitles']
        total_audios += actual['audios']
        total_processed += actual['processed']
    
    print(f"   Total subtitulos:  {total_subtitles}")
    print(f"   Total audios:      {total_audios}")
    print(f"   Total procesados:  {total_processed}")
    print(f"   Pendientes de IA:  {total_subtitles - total_processed}")
    print()

if __name__ == "__main__":
    show_status()
