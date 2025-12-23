import json
import os
import glob

# Paths
PLAYLISTS_DIR = "transcripciones"
OUTPUT_FILE = "kabbalah-app/data/playlists.json"

def main():
    print("🔄 Consolidating playlists...")
    
    playlists = []
    playlist_dirs = [d for d in os.listdir(PLAYLISTS_DIR) if os.path.isdir(os.path.join(PLAYLISTS_DIR, d))]
    
    for pd in playlist_dirs:
        playlist_path = os.path.join(PLAYLISTS_DIR, pd)
        video_files = glob.glob(os.path.join(playlist_path, "*.json"))
        
        if not video_files: continue
        
        # Get metadata from the first video to use as representative for the playlist
        try:
            with open(video_files[0], 'r', encoding='utf-8') as f:
                data = json.load(f)
                metadata = data.get('metadata', {})
                
                playlist_item = {
                    "id": pd,
                    "titulo": pd.replace("_", " "),
                    "video_count": len(video_files),
                    "descripcion": f"Serie de clases sobre {pd.replace('_', ' ')}.",
                    "image": f"https://images.unsplash.com/photo-1518005020250-67592b2261b2?w=500&q=80" # Placeholder
                }
                
                # Special cases for better titles
                if "72_Nombres" in pd:
                    playlist_item["titulo"] = "Los 72 Nombres de Dios"
                    playlist_item["image"] = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=500&q=80"
                elif "Secretos_del_Zohar" in pd:
                    playlist_item["titulo"] = "Secretos del Zohar"
                    playlist_item["image"] = "https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?w=500&q=80"
                elif "Arbol_de_la_Vida" in pd:
                    playlist_item["titulo"] = "Árbol de la Vida"
                    playlist_item["image"] = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80"
                
                playlists.append(playlist_item)
        except:
            pass
            
    # Save output
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(playlists, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Consolidated {len(playlists)} playlists.")

if __name__ == "__main__":
    main()
