"""
Cleanup Processed MP3s
Deletes MP3s ONLY after comprehensive verification
NO BACKUP - verification ensures safety
"""

from pathlib import Path
import sys
from typing import List

sys.path.insert(0, str(Path(__file__).parent))
from state_manager import load_state, mark_cleanup_done, update_phase
from verify_processing import verify_playlist

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
AUDIOS_DIR = BASE_DIR / "audios"

def cleanup_playlist(playlist: str, dry_run: bool = True) -> bool:
    """
    Delete MP3s for a playlist after verification
    
    Args:
        playlist: Playlist name
        dry_run: If True, only show what would be deleted
    
    Returns:
        True if cleanup successful
    """
    print(f"\n{'='*70}")
    print(f"LIMPIEZA DE MP3s - {playlist}")
    print(f"{'='*70}\n")
    
    # CRITICAL: Verify first
    print("🔍 PASO 1: Verificación de seguridad...")
    passed, issues = verify_playlist(playlist)
    
    if not passed:
        print(f"\n❌ VERIFICACIÓN FALLÓ - NO ES SEGURO BORRAR")
        print(f"\nProblemas encontrados:")
        for issue in issues:
            print(f"   {issue}")
        return False
    
    print(f"\n✅ Verificación pasada - Es seguro proceder\n")
    
    # Get MP3 files
    audio_folder = AUDIOS_DIR / playlist
    
    if not audio_folder.exists():
        print(f"📁 No hay carpeta de audios para {playlist}")
        print(f"   (Ya limpiada o nunca usada)")
        mark_cleanup_done(playlist)
        return True
    
    mp3_files = list(audio_folder.glob("*.mp3"))
    
    if not mp3_files:
        print(f"📁 No hay MP3s en {audio_folder}")
        mark_cleanup_done(playlist)
        return True
    
    print(f"🎵 MP3s encontrados: {len(mp3_files)}")
    
    # Calculate space
    total_size = sum(f.stat().st_size for f in mp3_files)
    size_mb = total_size / (1024 * 1024)
    size_gb = size_mb / 1024
    
    print(f"💾 Espacio a liberar: {size_mb:.1f} MB ({size_gb:.2f} GB)")
    
    if dry_run:
        print(f"\n⚠️ MODO DRY-RUN - No se borrarán archivos")
        print(f"\nArchivos que se borrarían:")
        for f in mp3_files[:10]:
            print(f"   • {f.name}")
        if len(mp3_files) > 10:
            print(f"   ... y {len(mp3_files) - 10} más")
        
        print(f"\n💡 Para borrar realmente, ejecuta:")
        print(f"   python scripts/cleanup_processed.py {playlist} --confirm")
        return False
    
    # Confirm deletion
    print(f"\n⚠️ ADVERTENCIA: Se borrarán {len(mp3_files)} archivos MP3")
    print(f"💾 Se liberarán {size_gb:.2f} GB de espacio")
    print(f"\n🔍 Verificación pasada - Estos archivos ya están:")
    print(f"   ✅ Transcritos (Whisper o YouTube)")
    print(f"   ✅ Procesados con IA")
    print(f"   ✅ Verificados como completos")
    
    # Delete files
    print(f"\n🗑️ Borrando archivos...")
    deleted = 0
    failed = []
    
    for mp3 in mp3_files:
        try:
            mp3.unlink()
            deleted += 1
            if deleted % 10 == 0:
                print(f"   Borrados: {deleted}/{len(mp3_files)}")
        except Exception as e:
            failed.append((mp3.name, str(e)))
    
    print(f"\n✅ Borrados: {deleted}/{len(mp3_files)}")
    
    if failed:
        print(f"\n⚠️ Fallos: {len(failed)}")
        for name, error in failed[:5]:
            print(f"   {name}: {error[:50]}")
        return False
    
    # Mark as done
    mark_cleanup_done(playlist)
    update_phase(playlist, "completed")
    
    print(f"\n{'='*70}")
    print(f"✅ LIMPIEZA COMPLETADA - {playlist}")
    print(f"{'='*70}")
    print(f"\n💾 Espacio liberado: {size_gb:.2f} GB")
    print(f"🗑️ Archivos borrados: {deleted}")
    print()
    
    return True

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Limpiar MP3s procesados')
    parser.add_argument('playlist', nargs='?', help='Playlist a limpiar (opcional)')
    parser.add_argument('--confirm', action='store_true', help='Confirmar borrado (sin esto es dry-run)')
    parser.add_argument('--all', action='store_true', help='Limpiar todas las playlists verificadas')
    
    args = parser.parse_args()
    
    if args.all:
        # Clean all verified playlists
        state = load_state()
        for playlist in state.keys():
            if state[playlist]['stats'].get('verified', False):
                cleanup_playlist(playlist, dry_run=not args.confirm)
    elif args.playlist:
        cleanup_playlist(args.playlist, dry_run=not args.confirm)
    else:
        print("Uso:")
        print("  python cleanup_processed.py <playlist> [--confirm]")
        print("  python cleanup_processed.py --all [--confirm]")
        print("\nEjemplos:")
        print("  python cleanup_processed.py secretos_zohar              # Dry-run")
        print("  python cleanup_processed.py secretos_zohar --confirm    # Borrar realmente")
        print("  python cleanup_processed.py --all --confirm             # Borrar todas verificadas")

if __name__ == "__main__":
    main()
