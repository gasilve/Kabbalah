
import sys

print("--- DIAGNOSTIC START ---")

print("Test 1: Numpy")
try:
    import numpy
    print(f"   [OK] Numpy {numpy.__version__}")
except Exception as e:
    print(f"   [FAIL] Numpy: {e}")

print("Test 2: Tiktoken")
try:
    import tiktoken
    print(f"   [OK] Tiktoken {tiktoken.__version__}")
except Exception as e:
    print(f"   [FAIL] Tiktoken: {e}")
    # Force flush to ensure we see this before potential crash next step
    sys.stdout.flush()

print("Test 3: Numba")
try:
    import numba
    print(f"   [OK] Numba {numba.__version__}")
except Exception as e:
    print(f"   [FAIL] Numba: {e}")
    sys.stdout.flush()

print("Test 4: Whisper")
try:
    import whisper
    print(f"   [OK] Whisper imported!")
except Exception as e:
    print(f"   [FAIL] Whisper: {e}")

print("--- DIAGNOSTIC END ---")
