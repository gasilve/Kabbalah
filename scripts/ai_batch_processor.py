"""
AI Batch Processor (Windows Compatible)
Processes all transcriptions with Ollama AI
Saves to organized folders by playlist
"""

from pathlib import Path
import sys
import json
from typing import List
import time

sys.path.insert(0, str(Path(__file__).parent))
from state_manager import load_state, mark_completed, increment_stat, update_phase
from extract_content_ai import load_transcription

BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"
PROCESSED_DIR = BASE_DIR / "contenido_procesado"

def extract_index(filename: str) -> str:
    """Extract index from filename"""
    return filename.split('_')[0]

def process_playlist_batch(playlist: str) -> bool:
    """
    Process all pending transcriptions for a playlist
    """
    print(f"\n{'='*70}")
    print(f"PROCESAMIENTO IA - {playlist}")
    print(f"{'='*70}\n")
    
    # Setup directories
    transcript_folder = TRANSCRIPTS_DIR / playlist
    output_folder = PROCESSED_DIR / playlist
    output_folder.mkdir(parents=True, exist_ok=True)
    
    if not transcript_folder.exists():
        print(f"[ERROR] Carpeta de transcripciones no existe: {transcript_folder}")
        return False
    
    # Get all transcription files
    transcript_files = list(transcript_folder.glob("*.json")) + list(transcript_folder.glob("*.json3"))
    transcript_files = [f for f in transcript_files if not any(x in f.name for x in ['ERROR', 'NO_SUBS', '_extracted'])]
    transcript_files = sorted(transcript_files)
    
    print(f"Transcripciones encontradas: {len(transcript_files)}")
    
    if not transcript_files:
        print(f"[INFO] No hay transcripciones para procesar")
        return True
    
    # Get already processed
    processed_files = list(output_folder.glob("*_extracted.json"))
    processed_indices = {extract_index(f.name) for f in processed_files}
    
    print(f"[OK] Ya procesados: {len(processed_files)}")
    
    # Find pending
    pending = []
    for tf in transcript_files:
        idx = extract_index(tf.name)
        if idx not in processed_indices:
            pending.append(tf)
    
    print(f"[WAIT] Pendientes: {len(pending)}")
    
    if not pending:
        print(f"\n[OK] Todos los archivos ya estan procesados")
        update_phase(playlist, "verification")
        return True
    
    # Process pending files
    print(f"\n[START] Iniciando procesamiento con IA...\n")
    
    success_count = 0
    failed_count = 0
    
    # Import here to avoid import errors if not needed
    try:
        from extract_content_ai import extract_content_with_gpt4
    except ImportError:
         # Fallback if function name changed
         try:
             from extract_content_ai import process_video_content as extract_content_with_gpt4
         except:
             print("[ERROR] No se pudo importar funcion de extraccion de extract_content_ai.py")
             return False

    for i, transcript_file in enumerate(pending, 1):
        print(f"\n[{i}/{len(pending)}] {transcript_file.name}")
        
        try:
            # Load transcription
            transcription = load_transcription(transcript_file)
            
            extracted = extract_content_with_gpt4(transcription)
            
            if extracted:
                # Save to organized folder
                output_file = output_folder / f"{transcript_file.stem}_extracted.json"
                
                extracted['source_file'] = str(transcript_file)
                extracted['processed_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(extracted, f, ensure_ascii=False, indent=2)
                
                print(f"   [SAVED] Guardado: {output_file.name}")
                
                # Update state
                idx = extract_index(transcript_file.name)
                mark_completed(playlist, idx, 'ai')
                increment_stat(playlist, 'ai_processed', 1)
                
                success_count += 1
            else:
                print(f"   [FAIL] Error en procesamiento IA (respuesta vacia)")
                failed_count += 1
            
            # Pause between requests
            if i < len(pending):
                print(f"   [PAUSE] Pausa 2s...")
                time.sleep(2)
                
        except Exception as e:
            print(f"   [ERROR] Excepcion: {str(e)[:100]}")
            failed_count += 1
    
    # Summary
    print(f"\n{'='*70}")
    print(f"RESUMEN - {playlist}")
    print(f"{'='*70}")
    print(f"Procesados exitosamente: {success_count}")
    print(f"Fallidos: {failed_count}")
    print(f"Carpeta: {output_folder}")
    print(f"{'='*70}\n")
    
    if failed_count == 0:
        update_phase(playlist, "verification")
        print(f"[OK] Todos procesados - Fase actualizada a 'verification'")
    
    return failed_count == 0

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Procesar transcripciones con IA')
    parser.add_argument('playlist', nargs='?', help='Playlist a procesar')
    parser.add_argument('--all', action='store_true', help='Procesar todas las playlists')
    
    args = parser.parse_args()
    
    if args.all:
        state = load_state()
        for playlist in state.keys():
            phase = state[playlist]['phase']
            if phase in ['ai_processing', 'whisper_transcription']:
                process_playlist_batch(playlist)
    elif args.playlist:
        process_playlist_batch(args.playlist)
    else:
        print("Uso:")
        print("  python ai_batch_processor.py <playlist>")
    
if __name__ == "__main__":
    main()
