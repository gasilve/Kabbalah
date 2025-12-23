import json
import os
from datetime import datetime

PROGRESS_FILE = "download_progress.json"

def update_progress():
    if not os.path.exists(PROGRESS_FILE):
        print("Progress file not found")
        return

    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'arbol_vida' in data:
        print("Updating arbol_vida progress...")
        video_ids = data['arbol_vida'].get('video_ids', [])
        data['arbol_vida']['downloaded'] = video_ids
        data['arbol_vida']['last_updated'] = datetime.now().isoformat()
        print(f"Marked {len(video_ids)} videos as downloaded.")

    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print("Done.")

if __name__ == "__main__":
    update_progress()
