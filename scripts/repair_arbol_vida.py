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
                # Fallback to generated Spanish
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
        transcript_data = []
        for item in fetched_obj:
            # Handle both dictionary and object/namedtuple styles just in case
            if isinstance(item, dict):
                transcript_data.append(item)
            else:
                transcript_data.append({
                    'text': getattr(item, 'text', ''),
                    'start': getattr(item, 'start', 0.0),
                    'duration': getattr(item, 'duration', 0.0)
                })

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
        
        # Write to temporary file first to avoid corruption
        temp_path = json_path + ".tmp"
        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': metadata,
                'transcript': transcript_data
            }, f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())
            
        # Rename to final
        if os.path.exists(json_path):
            os.remove(json_path)
        os.rename(temp_path, json_path)
            
        print(f"  + Downloaded successfully: {json_path}")
        return True

    except Exception as e:
        print(f"  - Error: {e}")
        return False

def main():
    if not os.path.exists(PROGRESS_FILE):
        print(f"Error: {PROGRESS_FILE} not found.")
        return

    with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # ONLY ARBOL_VIDA
    playlists = ['arbol_vida']
    
    for playlist in playlists:
        print(f"\n--- Processing Playlist: {playlist} ---")
        playlist_data = data.get(playlist, {})
        video_ids = playlist_data.get('video_ids', [])
        
        success_count = 0
        for i, vid_id in enumerate(video_ids, 1):
            if download_transcript(vid_id, playlist, i):
                success_count += 1
            # Slight delay to avoid aggressive rate limiting
            time.sleep(1.0)
            
        print(f"Finished {playlist}. Total: {success_count}/{len(video_ids)}")

if __name__ == "__main__":
    main()
