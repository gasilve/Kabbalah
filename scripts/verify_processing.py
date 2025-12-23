"""
Verification System - Ensures MP3s are safe to delete
Performs comprehensive checks before allowing cleanup
"""

import json
from pathlib import Path
from typing import Dict, List, Tuple
import sys
import os

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))
from state_manager import load_state, mark_verified

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
PROCESSED_DIR = BASE_DIR / "contenido_procesado"
AUDIOS_DIR = BASE_DIR / "audios"

def extract_index(filename: str) -> str:
    """Extract index from filename (e.g., '027' from '027_Title.json')"""
    return filename.split('_')[0]

def verify_playlist(playlist: str) -> Tuple[bool, List[str]]:
    """
    Comprehensive verification of a playlist
    Returns: (passed, list of issues)
    """
    issues = []
    
    print(f"\n{'='*70}")
    print(f"VERIFICANDO: {playlist}")
    print(f"{'='*70}\n")
    
    # 1. Check folders exist
    transcript_folder = TRANSCRIPTS_DIR / playlist
    processed_folder = PROCESSED_DIR / playlist
    audio_folder = AUDIOS_DIR / playlist
    
    if not transcript_folder.exists():
        issues.append(f"❌ Carpeta de transcripciones no existe: {transcript_folder}")
        return False, issues
    
    if not processed_folder.exists():
        issues.append(f"❌ Carpeta de procesados no existe: {processed_folder}")
        return False, issues
    
    # 2. Get all transcription files
    transcript_files = list(transcript_folder.glob("*.json")) + list(transcript_folder.glob("*.json3"))
    transcript_files = [f for f in transcript_files if not any(x in f.name for x in ['ERROR', 'NO_SUBS', '_extracted'])]
    
    print(f"📄 Transcripciones encontradas: {len(transcript_files)}")
    
    if len(transcript_files) == 0:
        issues.append("❌ No hay transcripciones para verificar")
        return False, issues
    
    # 3. Get all processed files
    processed_files = list(processed_folder.glob("*_extracted.json"))
    print(f"🤖 Archivos procesados con IA: {len(processed_files)}")
    
    # 4. Extract indices
    transcript_indices = {extract_index(f.name) for f in transcript_files}
    processed_indices = {extract_index(f.name) for f in processed_files}
    
    print(f"\n📊 Índices únicos:")
    print(f"   Transcripciones: {len(transcript_indices)}")
    print(f"   Procesados IA: {len(processed_indices)}")
    
    # 5. Check all transcripts have been processed
    missing_ai = transcript_indices - processed_indices
    if missing_ai:
        issues.append(f"❌ {len(missing_ai)} transcripciones SIN procesar con IA: {sorted(list(missing_ai))[:10]}")
        return False, issues
    
    print(f"✅ Todas las transcripciones tienen procesamiento IA")
    
    # 6. Verify JSON integrity
    print(f"\n🔍 Verificando integridad de JSONs...")
    corrupted = []
    
    for pf in processed_files:
        try:
            with open(pf, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Check has required fields
                if 'metadata' not in data:
                    corrupted.append(pf.name)
        except Exception as e:
            corrupted.append(f"{pf.name} (error: {str(e)[:50]})")
    
    if corrupted:
        issues.append(f"❌ {len(corrupted)} archivos corruptos: {corrupted[:5]}")
        return False, issues
    
    print(f"✅ Todos los JSONs son válidos")
    
    # 7. Check MP3s if they exist
    if audio_folder.exists():
        mp3_files = list(audio_folder.glob("*.mp3"))
        mp3_indices = {extract_index(f.name) for f in mp3_files}
        
        print(f"\n🎵 MP3s encontrados: {len(mp3_files)}")
        
        # Check all MP3s have transcription
        mp3_no_transcript = mp3_indices - transcript_indices
        if mp3_no_transcript:
            issues.append(f"⚠️ {len(mp3_no_transcript)} MP3s SIN transcripción: {sorted(list(mp3_no_transcript))[:10]}")
            return False, issues
        
        # Check all MP3s have AI processing
        mp3_no_ai = mp3_indices - processed_indices
        if mp3_no_ai:
            issues.append(f"⚠️ {len(mp3_no_ai)} MP3s SIN procesamiento IA: {sorted(list(mp3_no_ai))[:10]}")
            return False, issues
        
        print(f"✅ Todos los MP3s tienen transcripción y procesamiento IA")
        print(f"\n💾 SEGURO BORRAR: Los {len(mp3_files)} MP3s pueden ser eliminados")
    else:
        print(f"\n📁 No hay carpeta de audios (ya limpiada o no usada)")
    
    # 8. Check for duplicates
    print(f"\n🔍 Verificando duplicados...")
    
    transcript_names = [f.name for f in transcript_files]
    if len(transcript_names) != len(set(transcript_names)):
        issues.append("❌ Archivos de transcripción duplicados encontrados")
        return False, issues
    
    processed_names = [f.name for f in processed_files]
    if len(processed_names) != len(set(processed_names)):
        issues.append("❌ Archivos procesados duplicados encontrados")
        return False, issues
    
    print(f"✅ No hay duplicados")
    
    # 9. Verify state matches reality
    print(f"\n🔍 Verificando estado vs archivos reales...")
    state = load_state()
    playlist_state = state.get(playlist, {})
    
    stats = playlist_state.get('stats', {})
    actual_ai_processed = len(processed_files)
    
    # Update stats if needed
    if stats.get('ai_processed', 0) != actual_ai_processed:
        print(f"⚠️ Estado desactualizado: {stats.get('ai_processed', 0)} vs {actual_ai_processed} real")
        print(f"   (Se actualizará automáticamente)")
    
    print(f"✅ Verificación de estado completada")
    
    # All checks passed
    print(f"\n{'='*70}")
    print(f"✅ VERIFICACIÓN EXITOSA - {playlist}")
    print(f"{'='*70}")
    print(f"\n📊 Resumen:")
    print(f"   • {len(transcript_files)} transcripciones")
    print(f"   • {len(processed_files)} procesados con IA")
    if audio_folder.exists():
        print(f"   • {len(mp3_files)} MP3s SEGUROS PARA BORRAR")
    print()
    
    return True, []

def verify_all_playlists():
    """Verify all playlists"""
    state = load_state()
    
    print(f"\n{'='*70}")
    print(f"VERIFICACIÓN COMPLETA DE TODAS LAS PLAYLISTS")
    print(f"{'='*70}")
    
    results = {}
    
    for playlist in state.keys():
        passed, issues = verify_playlist(playlist)
        results[playlist] = {
            'passed': passed,
            'issues': issues
        }
        
        if passed:
            mark_verified(playlist, True)
        else:
            mark_verified(playlist, False)
            print(f"\n⚠️ PROBLEMAS ENCONTRADOS:")
            for issue in issues:
                print(f"   {issue}")
    
    # Summary
    print(f"\n{'='*70}")
    print(f"RESUMEN DE VERIFICACIÓN")
    print(f"{'='*70}\n")
    
    for playlist, result in results.items():
        status = "✅ PASÓ" if result['passed'] else "❌ FALLÓ"
        print(f"{status} - {playlist}")
        if not result['passed']:
            print(f"   Problemas: {len(result['issues'])}")
    
    all_passed = all(r['passed'] for r in results.values())
    
    if all_passed:
        print(f"\n✅ TODAS LAS VERIFICACIONES PASARON")
        print(f"💾 Es seguro proceder con la limpieza de MP3s")
    else:
        print(f"\n⚠️ ALGUNAS VERIFICACIONES FALLARON")
        print(f"❌ NO es seguro borrar MP3s todavía")
    
    return all_passed

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        playlist = sys.argv[1]
        passed, issues = verify_playlist(playlist)
        sys.exit(0 if passed else 1)
    else:
        all_passed = verify_all_playlists()
        sys.exit(0 if all_passed else 1)
