#!/usr/bin/env python3
"""
Whisper Transcription Script for Ollama Server
Run this on the server (192.168.100.21) after copying MP3 files.

Usage:
  python3 transcribe_server.py
"""

import os
import sys
from pathlib import Path
from datetime import timedelta

# Configuration - aligned with USB symlinks
AUDIO_DIR = Path.home() / "kabbalah_audios"
OUTPUT_DIR = Path.home() / "kabbalah_transcripciones"

def format_timestamp(seconds):
    """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)"""
    td = timedelta(seconds=seconds)
    hours = int(td.total_seconds() // 3600)
    minutes = int((td.total_seconds() % 3600) // 60)
    secs = int(td.total_seconds() % 60)
    millis = int((td.total_seconds() % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def main():
    print("=" * 60)
    print("WHISPER TRANSCRIPTION - SERVER VERSION")
    print("=" * 60)
    
    # Check Whisper installation
    try:
        import whisper
        print(f"✅ Whisper version: {whisper.__version__}")
    except ImportError:
        print("❌ Whisper not installed. Run: pip install openai-whisper")
        sys.exit(1)
    
    # Check CUDA availability
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
            device = "cuda"
        else:
            print("⚠️ No GPU detected, using CPU (slower)")
            device = "cpu"
    except:
        device = "cpu"
        print("⚠️ Using CPU")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Find MP3 files
    mp3_files = sorted(AUDIO_DIR.glob("*.mp3"))
    
    if not mp3_files:
        print(f"❌ No MP3 files found in {AUDIO_DIR}")
        print("Copy MP3s from Windows PC first:")
        print(f"  scp user@windows_ip:/path/to/audios/*.mp3 {AUDIO_DIR}/")
        sys.exit(1)
    
    print(f"📊 MP3 files found: {len(mp3_files)}")
    
    # Filter already transcribed
    pending = []
    for mp3 in mp3_files:
        srt_path = OUTPUT_DIR / (mp3.stem + ".srt")
        if not srt_path.exists():
            pending.append(mp3)
    
    print(f"⏳ Pending: {len(pending)}")
    
    if not pending:
        print("✅ All files already transcribed!")
        return
    
    # Load model
    print("\n📥 Loading Whisper 'medium' model...")
    model = whisper.load_model("medium", device=device)
    print("✅ Model loaded")
    
    # Process files
    import json
    success = 0
    failed = 0
    
    for i, mp3 in enumerate(pending, 1):
        print(f"\n[{i}/{len(pending)}] {mp3.name}")
        print("  🎙️ Transcribing...")
        
        try:
            result = model.transcribe(
                str(mp3),
                language="es",
                task="transcribe",
                verbose=False
            )
            
            # Generate SRT
            srt_content = []
            for j, segment in enumerate(result["segments"], 1):
                start = format_timestamp(segment["start"])
                end = format_timestamp(segment["end"])
                text = segment["text"].strip()
                srt_content.extend([str(j), f"{start} --> {end}", text, ""])
            
            # Save SRT
            srt_path = OUTPUT_DIR / (mp3.stem + ".srt")
            with open(srt_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(srt_content))
            
            # Save JSON
            json_path = OUTPUT_DIR / (mp3.stem + ".json")
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump({
                    "text": result["text"],
                    "segments": result["segments"],
                    "language": result["language"]
                }, f, ensure_ascii=False, indent=2)
            
            print(f"  ✅ Saved: {srt_path.name}")
            success += 1
            
            # Optionally delete MP3 after success
            # mp3.unlink()
            # print("  🗑️ MP3 deleted")
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Summary: {success} transcribed, {failed} failed")
    print(f"📁 Output: {OUTPUT_DIR}")
    print("=" * 60)
    print("\nCopy results back to Windows:")
    print(f"  scp {OUTPUT_DIR}/*.srt user@windows_ip:/path/to/transcripciones/secretos_zohar/")
    print(f"  scp {OUTPUT_DIR}/*.json user@windows_ip:/path/to/transcripciones/secretos_zohar/")

if __name__ == "__main__":
    main()
