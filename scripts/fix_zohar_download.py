import json
import os
import time
from youtube_transcript_api import YouTubeTranscriptApi
from datetime import datetime

# Paths
PROGRESS_FILE = "download_progress.json"
OUTPUT_DIR = "transcripciones/Secretos_del_Zohar"

def sanitize_filename(filename):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def download_transcript(video_id, video_title, index):
    try:
        print(f"Processing [{index}]: {video_title} ({video_id})")
        
        # Check if already exists
        safe_title = sanitize_filename(video_title)
        base_filename = f"{int(index):03d}_{safe_title}"
        json_path = os.path.join(OUTPUT_DIR, f"{base_filename}.json")
        
        if os.path.exists(json_path):
            print(f"  - Already exists, skipping.")
            return True

        # Fetch transcript
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        transcript = None
        try:
            transcript = transcript_list.find_transcript(['es', 'es-419', 'es-ES', 'es-MX'])
        except:
             try:
                # Try to find generated Spanish
                generated_transcripts = [t for t in transcript_list if t.is_generated]
                es_generated = next((t for t in generated_transcripts if t.language_code in ['es', 'es-419']), None)
                if es_generated:
                    transcript = es_generated
                else:
                    print(f"  - No Spanish transcript found.")
                    return False
             except Exception as e:
                print(f"  - Error finding transcript: {e}")
                return False

        # Fetch and convert to list of dicts explicitly
        fetched_obj = transcript.fetch()
        
        # Ensure it's a list of dicts
        if hasattr(fetched_obj, '__iter__') and not isinstance(fetched_obj, list):
             transcript_data = [item for item in fetched_obj]
        else:
             transcript_data = fetched_obj

        # Double check it's serializable (list of dicts)
        # If it's still an object, we might need to inspect it, but usually it's list of dicts.
        
        # Save
        metadata = {
            'video_id': video_id,
            'video_title': video_title,
            'video_number': index,
            'downloaded_at': datetime.now().isoformat(),
            'is_generated': transcript.is_generated
        }
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': metadata,
                'transcript': transcript_data
            }, f, ensure_ascii=False, indent=2)
            
        print(f"  + Downloaded successfully.")
        return True

    except Exception as e:
        print(f"  - Error: {e}")
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    zohar_data = data.get('secretos_zohar', {})
    video_ids = zohar_data.get('video_ids', [])
    
    print(f"Found {len(video_ids)} videos in progress file.")
    
    titles_map = {}
    if os.path.exists("secretos_del_zohar_videos.json"):
        with open("secretos_del_zohar_videos.json", 'r', encoding='utf-8') as f:
            vid_list = json.load(f)
            for v in vid_list.get('videos', []):
                titles_map[v['id']] = v['title']

    success_count = 0
    
    for i, vid_id in enumerate(video_ids, 1):
        title = titles_map.get(vid_id, f"Secretos del Zohar Clase {i}")
        if download_transcript(vid_id, title, i):
            success_count += 1
        
        # Rate limit
        time.sleep(1)

    print(f"Finished. Total successful checks/downloads: {success_count}/{len(video_ids)}")

if __name__ == "__main__":
    main()
