"""
Download missing subtitles from all playlists.
Run this with VPN enabled to bypass YouTube rate limiting.
Compatible with youtube-transcript-api v1.2.3+
"""

from youtube_transcript_api import YouTubeTranscriptApi
import json
import os
import time
import random

PLAYLISTS = {
    'Secretos_del_Zohar': {
        'total': 167,
        'dir': 'transcripciones/Secretos_del_Zohar'
    },
    'arbol_vida': {
        'total': 64,
        'dir': 'transcripciones/arbol_vida'
    },
    'sefer_yetzirah': {
        'total': 19,
        'dir': 'transcripciones/sefer_yetzirah'
    },
    'tefila': {
        'total': 48,
        'dir': 'transcripciones/tefila'
    }
}

def download_transcript(video_id, output_dir, index):
    """Download transcript for a single video"""
    try:
        # New API: use fetch() directly
        ytt_api = YouTubeTranscriptApi()
        
        # Try to fetch Spanish transcript
        try:
            data = ytt_api.fetch(video_id, languages=['es'])
        except:
            try:
                data = ytt_api.fetch(video_id, languages=['es', 'en'])
            except:
                data = ytt_api.fetch(video_id)
        
        # Convert to serializable format
        data_list = [{'text': item.text, 'start': item.start, 'duration': item.duration} for item in data]
        
        # Save as JSON
        json_path = os.path.join(output_dir, f"{index:03d}_{video_id}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data_list, f, ensure_ascii=False, indent=2)
        
        # Save as plain text
        txt_path = os.path.join(output_dir, f"{index:03d}_{video_id}.txt")
        full_text = ' '.join([item.text for item in data])
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(full_text)
        
        print(f"✅ {index:03d} - {video_id}")
        return True
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ {index:03d} - {video_id}: {error_msg[:60]}")
        
        # Save error for reference
        error_path = os.path.join(output_dir, f"ERROR_{index:03d}_{video_id}.txt")
        with open(error_path, 'w', encoding='utf-8') as f:
            f.write(f"Video ID: {video_id}\nError: {error_msg}")
        
        return False

def main():
    # Load video IDs from download_progress.json
    with open('download_progress.json', 'r') as f:
        progress = json.load(f)
    
    print("=" * 60)
    print("🔮 SUBTITLE DOWNLOADER (VPN MODE)")
    print("=" * 60)
    
    total_success = 0
    total_failed = 0
    
    for playlist_name, config in PLAYLISTS.items():
        print(f"\n📁 Processing: {playlist_name}")
        print("-" * 40)
        
        output_dir = config['dir']
        os.makedirs(output_dir, exist_ok=True)
        
        # Get video IDs from progress file
        pn_lower = playlist_name.lower().replace('_', '')
        if 'secretosdelzohar' in pn_lower or 'secretos_del_zohar' in pn_lower:
            video_ids = progress.get('secretos_zohar', {}).get('video_ids', [])
        else:
            video_ids = progress.get(playlist_name, {}).get('video_ids', [])
        
        if not video_ids:
            print(f"   ⚠️ No video IDs found for {playlist_name}")
            continue
        
        # Check what's already downloaded
        existing_files = os.listdir(output_dir) if os.path.exists(output_dir) else []
        downloaded_vids = set()
        for f in existing_files:
            if f.endswith('.json') and not f.startswith('ERROR'):
                for vid in video_ids:
                    if vid in f:
                        downloaded_vids.add(vid)
        
        # Find videos to download
        to_download = [(i + 1, vid) for i, vid in enumerate(video_ids) if vid not in downloaded_vids]
        
        print(f"   Total videos: {len(video_ids)}")
        print(f"   Already downloaded: {len(downloaded_vids)}")
        print(f"   To download: {len(to_download)}")
        
        if not to_download:
            print("   ✅ All done for this playlist!")
            continue
        
        # Download with delays
        success = 0
        failed = 0
        
        for idx, (num, vid) in enumerate(to_download):
            if download_transcript(vid, output_dir, num):
                success += 1
            else:
                failed += 1
            
            # Random delay
            if idx < len(to_download) - 1:
                delay = random.uniform(2, 4)
                time.sleep(delay)
            
            # Longer pause every 10
            if (idx + 1) % 10 == 0:
                print(f"   ⏸️ Pausing 20s...")
                time.sleep(20)
        
        total_success += success
        total_failed += failed
        print(f"   Results: {success} success, {failed} failed")
    
    print("\n" + "=" * 60)
    print(f"🏁 COMPLETE: {total_success} downloaded, {total_failed} failed")
    print("=" * 60)

if __name__ == "__main__":
    main()
