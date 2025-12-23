"""
Complete Audio-to-SRT Transcription Pipeline
- Transcribes MP3 files to SRT using Whisper
- Saves SRTs to transcripciones/{playlist}/ folder  
- Deletes MP3 after successful transcription
- Triggers AI processing on new SRTs

Requirements:
  pip install openai-whisper
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import timedelta
import subprocess

# Configuration
BASE_DIR = Path("c:/Users/paparinots/Documents/Kabbalah")
AUDIO_DIR = BASE_DIR / "audios"
TRANSCRIPTS_DIR = BASE_DIR / "transcripciones"

def format_timestamp(seconds):
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
    td = timedelta(seconds=seconds)
    hours = int(td.total_seconds() // 3600)
    minutes = int((td.total_seconds() % 3600) // 60)
    secs = int(td.total_seconds() % 60)
    millis = int((td.total_seconds() % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def transcribe_to_srt(audio_path, output_path, model_name="medium", language="es"):
    """Transcribe audio file to SRT format"""
    try:
        import whisper
    except ImportError:
        print("❌ Whisper no está instalado. Ejecuta:")
        print("   pip install openai-whisper")
        return False
    
    print(f"  📥 Cargando modelo '{model_name}'...")
    model = whisper.load_model(model_name)
    
    print(f"  🎙️ Transcribiendo...")
    result = model.transcribe(
        str(audio_path),
        language=language,
        task="transcribe",
        verbose=False
    )
    
    # Generate SRT content
    srt_content = []
    for i, segment in enumerate(result["segments"], 1):
        start = format_timestamp(segment["start"])
        end = format_timestamp(segment["end"])
        text = segment["text"].strip()
        
        srt_content.append(f"{i}")
        srt_content.append(f"{start} --> {end}")
        srt_content.append(text)
        srt_content.append("")
    
    # Write SRT file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(srt_content))
    
    # Also save as JSON for AI processing compatibility
    json_path = output_path.with_suffix('.json')
    import json
    json_content = {
        "text": result["text"],
        "segments": result["segments"],
        "language": result["language"]
    }
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_content, f, ensure_ascii=False, indent=2)
    
    return True

def trigger_ai_processing(srt_path):
    """Trigger AI processing on a new SRT file"""
    print(f"  🤖 Iniciando procesamiento IA...")
    # The AI script will pick this up on next run
    # For now we just mark it as ready
    return True

def main():
    parser = argparse.ArgumentParser(description='Transcribe audio files to SRT')
    parser.add_argument('--model', default='medium', 
                        choices=['tiny', 'base', 'small', 'medium', 'large'],
                        help='Whisper model size (default: medium)')
    parser.add_argument('--language', default='es', help='Language code (default: es)')
    parser.add_argument('--playlist', default='secretos_zohar', help='Playlist folder name')
    parser.add_argument('--keep-audio', action='store_true', help='Keep MP3 files after transcription')
    args = parser.parse_args()
    
    print("=" * 60)
    print("TRANSCRIPTOR DE AUDIO A SRT (Whisper)")
    print("=" * 60)
    print(f"Modelo: {args.model}")
    print(f"Idioma: {args.language}")
    print(f"Playlist: {args.playlist}")
    print()
    
    audio_folder = AUDIO_DIR / args.playlist
    transcript_folder = TRANSCRIPTS_DIR / args.playlist
    transcript_folder.mkdir(parents=True, exist_ok=True)
    
    if not audio_folder.exists():
        print(f"❌ Carpeta de audios no encontrada: {audio_folder}")
        print("   Primero ejecuta: python scripts/download_audio.py")
        return
    
    # Find MP3 files
    mp3_files = sorted(audio_folder.glob("*.mp3"))
    
    if not mp3_files:
        print("❌ No se encontraron archivos MP3")
        return
    
    print(f"📊 Archivos MP3 encontrados: {len(mp3_files)}")
    
    # Filter out already transcribed
    pending = []
    for mp3 in mp3_files:
        # Check if SRT or JSON already exists in transcripts folder
        base_name = mp3.stem
        srt_path = transcript_folder / (base_name + ".srt")
        json_path = transcript_folder / (base_name + ".json")
        json3_path = transcript_folder / (base_name + ".json3")
        
        if not (srt_path.exists() or json_path.exists() or json3_path.exists()):
            pending.append(mp3)
    
    print(f"⏳ Pendientes de transcribir: {len(pending)}")
    
    if not pending:
        print("✅ Todos los audios ya están transcritos")
        return
    
    # Load model once
    try:
        import whisper
        print(f"\n📥 Cargando modelo Whisper '{args.model}'...")
        model = whisper.load_model(args.model)
        print("✅ Modelo cargado")
    except ImportError:
        print("❌ Whisper no está instalado. Ejecuta:")
        print("   pip install openai-whisper")
        return
    
    # Process each file
    success = 0
    failed = 0
    
    for i, mp3 in enumerate(pending, 1):
        print(f"\n[{i}/{len(pending)}] {mp3.name}")
        
        base_name = mp3.stem
        srt_path = transcript_folder / (base_name + ".srt")
        json_path = transcript_folder / (base_name + ".json")
        
        try:
            print(f"  🎙️ Transcribiendo...")
            result = model.transcribe(
                str(mp3),
                language=args.language,
                task="transcribe",
                verbose=False
            )
            
            # Generate SRT content
            srt_content = []
            for j, segment in enumerate(result["segments"], 1):
                start = format_timestamp(segment["start"])
                end = format_timestamp(segment["end"])
                text = segment["text"].strip()
                
                srt_content.append(f"{j}")
                srt_content.append(f"{start} --> {end}")
                srt_content.append(text)
                srt_content.append("")
            
            # Write SRT file
            with open(srt_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(srt_content))
            
            # Also save as JSON for AI processing compatibility
            import json
            json_content = {
                "text": result["text"],
                "segments": result["segments"],
                "language": result["language"]
            }
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(json_content, f, ensure_ascii=False, indent=2)
            
            print(f"  ✅ Guardado: {srt_path.name}")
            success += 1
            
            # Delete MP3 if requested
            if not args.keep_audio:
                try:
                    mp3.unlink()
                    print(f"  🗑️ MP3 eliminado")
                except Exception as e:
                    print(f"  ⚠️ No se pudo eliminar MP3: {e}")
                    
        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Resumen: {success} transcritos, {failed} fallidos")
    print(f"📁 SRTs guardados en: {transcript_folder}")
    print("=" * 60)
    
    if success > 0:
        print("\n💡 Ejecuta el procesador de IA para extraer contenido:")
        print("   python scripts/extract_content_ai.py")

if __name__ == "__main__":
    main()
