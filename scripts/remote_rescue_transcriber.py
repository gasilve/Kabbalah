import os
import json
import whisper
from pathlib import Path
import torch

RESCUE_DIR = Path("/home/willy/kabbalah_audios/rescue")
MODEL_NAME = "medium"
LANGUAGE = "Spanish"

def main():
    print(f"🚀 Iniciando transcripción de rescate...")
    print(f"🖥️ CUDA disponible: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"🎸 GPU: {torch.cuda.get_device_name(0)}")

    print(f"📥 Cargando modelo '{MODEL_NAME}'...")
    model = whisper.load_model(MODEL_NAME)
    print("✅ Modelo cargado.")

    mp3_files = sorted(list(RESCUE_DIR.glob("*.mp3")))
    print(f"📊 Archivos encontrados: {len(mp3_files)}")

    for i, mp3 in enumerate(mp3_files, 1):
        json_path = mp3.with_suffix(".json")
        
        if json_path.exists():
            print(f"[{i}/{len(mp3_files)}] ⏭️ Saltando {mp3.name} (ya existe)")
            continue

        print(f"[{i}/{len(mp3_files)}] 🎤 Transcribiendo {mp3.name}...")
        try:
            result = model.transcribe(
                str(mp3),
                language=LANGUAGE,
                task="transcribe",
                verbose=False
            )
            
            output_data = {
                "text": result["text"],
                "segments": result["segments"],
                "language": result["language"]
            }
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
                
            print(f"   ✅ Guardado: {json_path.name}")
        except Exception as e:
            print(f"   ❌ Error en {mp3.name}: {e}")

    print("\n🏁 Proceso finalizado.")

if __name__ == "__main__":
    main()
