
import sys

print("1. Importing torch...")
try:
    import torch
    print(f"   [OK] Torch version: {torch.__version__}")
except Exception as e:
    print(f"   [FAIL] Import torch: {e}")
    sys.exit(1)

print("2. Importing whisper...")
try:
    import whisper
    print(f"   [OK] Whisper imported")
except Exception as e:
    print(f"   [FAIL] Import whisper: {e}")
    sys.exit(1)

print("3. Loading Model (medium)...")
try:
    model = whisper.load_model("medium")
    print(f"   [OK] Model loaded!")
except Exception as e:
    print(f"   [FAIL] Load model: {e}")
    sys.exit(1)

print("Diagnostic COMPLETE: Success")
