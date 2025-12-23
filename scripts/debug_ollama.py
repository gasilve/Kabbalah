from openai import OpenAI
import time

print("1. Initializing Client...")
try:
    client = OpenAI(
        api_key="ollama",
        base_url="http://192.168.100.21:11434/v1",
        timeout=10.0
    )
    print("2. Client Initialized.")

    print("3. Listing Models...")
    start = time.time()
    models = client.models.list()
    elapsed = time.time() - start
    print(f"4. Succeeded in {elapsed:.2f}s")
    
    print("5. Models found:")
    for m in models:
        print(f" - {m.id}")

except Exception as e:
    print(f"❌ ERROR: {e}")
