import json
import os
import glob
import re

# Paths
PROCESSED_DIR = "contenido_procesado"
OUTPUT_FILE = "kabbalah-app/data/meditations_all.json"

def get_category(filename):
    if "72 Nombres" in filename or "72-names" in filename:
        return "72 Nombres"
    if "Zohar" in filename:
        return "Zohar"
    if "árbol de la vida" in filename.lower():
        return "Árbol de la Vida"
    if "Puertas de la Luz" in filename:
        return "Puertas de la Luz"
    if "Tefila" in filename:
        return "Tefilá"
    if "Shir Ha Shirim" in filename:
        return "Shir Ha Shirim"
    if "Sefer Yetzirah" in filename:
        return "Seer Yetzirah"
    return "Otros"

def main():
    print("🔄 Consolidating all meditations...")
    
    # We look for enhanced files first as they usually have more data
    enhanced_files = glob.glob(os.path.join(PROCESSED_DIR, "*_enhanced.json"))
    extracted_files = glob.glob(os.path.join(PROCESSED_DIR, "*_extracted.json"))
    
    # Combine lists, using basename to avoid duplicates (preferring enhanced)
    processed_files = {}
    for f in extracted_files:
        basename = os.path.basename(f).replace("_extracted.json", "")
        processed_files[basename] = f
    
    for f in enhanced_files:
        basename = os.path.basename(f).replace("_enhanced.json", "")
        processed_files[basename] = f
        
    print(f"   Found {len(processed_files)} unique processed classes/videos.")
    
    all_meditations = []
    
    for basename, file_path in processed_files.items():
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Some files are wrapped in a root object, others are direct
                meds = data.get('meditaciones', [])
                if not meds and 'items' in data: # check if it's the consolidated db format
                    for item in data['items']:
                        meds.extend(item.get('meditaciones', []))
                
                metadata = data.get('metadata', {})
                category = get_category(basename)
                
                for m in meds:
                    # Clean up and normalize
                    med_item = {
                        "id": f"med-{len(all_meditations):03d}",
                        "titulo": m.get('titulo', 'Sin título'),
                        "descripcion": m.get('descripcion', ''),
                        "duracion": m.get('duracion', '10 min'), # default
                        "tipo": m.get('tipo', 'Meditación Guiada'),
                        "category": category,
                        "video_id": metadata.get('video_id', ''),
                        "timestamp_inicio": m.get('timestamp_inicio', 0),
                        "timestamp_fin": m.get('timestamp_fin', 0),
                        "instrucciones": m.get('instrucciones', ''),
                        "clase_titulo": metadata.get('titulo', basename)
                    }
                    
                    # Deduplicate if exact same title and video_id
                    is_duplicate = any(
                        prev['titulo'] == med_item['titulo'] and prev['video_id'] == med_item['video_id']
                        for prev in all_meditations
                    )
                    
                    if not is_duplicate and med_item['titulo'] != "Nombre de la meditación":
                        all_meditations.append(med_item)
                        
        except Exception as e:
            print(f"   ❌ Error reading {file_path}: {e}")

    # Final result
    output_data = {
        "count": len(all_meditations),
        "meditaciones": all_meditations
    }
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Created {OUTPUT_FILE} with {len(all_meditations)} meditations.")

if __name__ == "__main__":
    main()
