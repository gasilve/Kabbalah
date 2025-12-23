import json
import os
import glob

# Paths
PROCESSED_DIR = "contenido_procesado"
OUTPUT_FILE = "kabbalah-app/data/zohar_db.json"

def main():
    print("🔄 Consolidating Zohar data...")
    
    # Find all extracted JSON files
    files = glob.glob(os.path.join(PROCESSED_DIR, "*_extracted.json"))
    print(f"   Found {len(files)} processed files.")
    
    all_items = []
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # The extracted JSON structure might vary slightly, let's normalize it
                # We expect the root to have metadata and the extracted fields
                
                # If the AI wrapped it in a specific key, handle it. 
                # Assuming the root is the object we want, or it has 'metadata'
                
                item = {
                    'metadata': data.get('metadata', {}),
                    'meditaciones': data.get('meditaciones', []),
                    'nombres_divinos': data.get('nombres_divinos', []),
                    'conceptos': data.get('conceptos', []),
                    'intenciones_principales': data.get('intenciones_principales', [])
                }
                
                # Fallback: If metadata is missing or video_id is empty, try to get it from source_file
                if not item['metadata'].get('video_id') and 'source_file' in data:
                    source_rel_path = data['source_file']
                    # source_file path might be relative or absolute, normalize it
                    # It seems to be "transcripciones\Playlist\Filename.json"
                    
                    if os.path.exists(source_rel_path):
                        with open(source_rel_path, 'r', encoding='utf-8') as sf:
                            source_data = json.load(sf)
                            original_metadata = source_data.get('metadata', {})
                            
                            # Merge original metadata with existing (preserving extracted fields if any)
                            if original_metadata:
                                # Ensure we have the base fields
                                item['metadata']['video_id'] = original_metadata.get('video_id', '')
                                item['metadata']['titulo'] = original_metadata.get('video_title', item['metadata'].get('titulo', ''))
                                item['metadata']['video_number'] = original_metadata.get('video_number', 0)
                                if not item['metadata'].get('duracion_minutos'):
                                     item['metadata']['duracion_minutos'] = 0 # Placeholder if not found
                                     
                # Validate again
                if item['metadata'].get('video_id'):
                    all_items.append(item)
                else:
                    print(f"   ⚠️  Skipping {file_path}: Missing video_id even after fallback")
                    
        except Exception as e:
            print(f"   ❌ Error reading {file_path}: {e}")

    # Sort by video number if available
    try:
        all_items.sort(key=lambda x: x['metadata'].get('video_number', 0))
    except:
        pass

    # Create final DB structure
    db = {
        "total_videos": len(all_items),
        "last_updated": os.path.getmtime(PROCESSED_DIR) if os.path.exists(PROCESSED_DIR) else 0,
        "items": all_items
    }
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Database created with {len(all_items)} items at {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
