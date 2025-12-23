import requests
import time

URL = "http://192.168.100.21:11434/api/tags"

print(f"Testing connectivity to {URL}...")
try:
    start = time.time()
    response = requests.get(URL, timeout=5)
    elapsed = time.time() - start
    
    print(f"Status Code: {response.status_code}")
    print(f"Elapsed: {elapsed:.2f}s")
    if response.status_code == 200:
        print("Success! data snippet:", response.text[:100])
    else:
        print("Failed with status:", response.status_code)

except Exception as e:
    print(f"❌ Error: {e}")
