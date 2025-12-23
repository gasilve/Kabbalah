import json
import os
import time
from youtube_transcript_api import YouTubeTranscriptApi
from datetime import datetime

# Paths
PROGRESS_FILE = "download_progress.json"
OUTPUT_BASE_DIR = "transcripciones"

def sanitize_filename(filename):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def download_transcript(video_id, playlist_name, index):
    output_dir = os.path.join(OUTPUT_BASE_DIR, playlist_name)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        video_title = f"{playlist_name} - Video {index}"
        print(f"Processing {playlist_name} [{index}]: {video_id}")
        
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        transcript = None
        try:
            transcript = transcript_list.find_transcript(['es', 'es-419', 'es-ES', 'es-MX'])
        except:
             try:
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
        if hasattr(fetched_obj, '__iter__') and not isinstance(fetched_obj, list):
             transcript_data = [item for item in fetched_obj]
        else:
             transcript_data = fetched_obj

        # Save
        metadata = {
            'video_id': video_id,
            'video_title': video_title,
            'video_number': index,
            'downloaded_at': datetime.now().isoformat(),
            'is_generated': transcript.is_generated
        }
        
        safe_title = sanitize_filename(video_title)
        base_filename = f"{int(index):03d}_{safe_title}"
        json_path = os.path.join(output_dir, f"{base_filename}.json")
        
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
    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    playlists = ['arbol_vida', 'sefer_yetzirah', 'tefila']
    
    for playlist in playlists:
        print(f"\n--- Processing Playlist: {playlist} ---")
        playlist_data = data.get(playlist, {})
        video_ids = playlist_data.get('video_ids', [])
        
        success_count = 0
        for i, vid_id in enumerate(video_ids, 1):
            if download_transcript(vid_id, playlist, i):
                success_count += 1
            time.sleep(2.5)  # Pausa de 2.5s para evitar rate limiting de YouTube
            
        print(f"Finished {playlist}. Total: {success_count}/{len(video_ids)}")

if __name__ == "__main__":
    main()
