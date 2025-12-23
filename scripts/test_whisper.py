import whisper
import os
import sys

print("=== Whisper Test Script ===")

audio_file = "test_audio.mp3"

if not os.path.exists(audio_file):
    print(f"❌ Error: {audio_file} not found. Please cp from ~/kabbalah_audios/ first.")
    # Attempt copy if missing (assuming mount is there)
    try:
        import shutil
        from pathlib import Path
        src = Path.home() / "kabbalah_audios/027_Video 27.mp3"
        if src.exists():
            print(f"Copying from {src}...")
            shutil.copy(src, audio_file)
        else:
            print(f"❌ Source file {src} not found!")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Copy failed: {e}")
        sys.exit(1)

print(f"✅ Audio file present: {os.path.getsize(audio_file)} bytes")

try:
    print("📥 Loading Whisper 'medium' model...")
    model = whisper.load_model("medium")
    print("✅ Model loaded successfully")
    
    print("🎙️ Starting transcription...")
    result = model.transcribe(audio_file)
    print("✅ Transcription SUCCESS during test!")
    print(f"Text snippet: {result['text'][:100]}...")
    
except Exception as e:
    print(f"❌ CRASH: {e}")
    sys.exit(1)
