"""
Script para reprocesar archivos fallidos de Secretos del Zohar
Lee la lista de archivos fallidos y los procesa uno por uno
"""

import os
import sys
from pathlib import Path

# Agregar el directorio de scripts al path
sys.path.insert(0, str(Path(__file__).parent))

# Importar el procesador principal
from enhanced_content_extractor import process_video

def main():
    # Leer lista de archivos fallidos
    failed_list_path = Path("c:/Users/paparinots/Documents/Kabbalah/failed_files.txt")
    transcriptions_dir = Path("c:/Users/paparinots/Documents/Kabbalah/transcripciones/secretos_zohar")
    
    if not failed_list_path.exists():
        print(f"❌ No se encontró {failed_list_path}")
        return
    
    # Leer archivos fallidos
    with open(failed_list_path, 'r', encoding='utf-16le') as f:
        failed_files = [line.strip() for line in f if line.strip()]
    
    print(f"""
╔══════════════════════════════════════════════════════════════════╗
║  REPROCESAMIENTO DE ARCHIVOS FALLIDOS                            ║
║  Total de archivos: {len(failed_files):<47}║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    successful = 0
    failed = 0
    
    for idx, filename in enumerate(failed_files, 1):
        json_file = transcriptions_dir / f"{filename}.json"
        
        if not json_file.exists():
            print(f"\n[{idx}/{len(failed_files)}] ⚠️  No existe: {filename}")
            failed += 1
            continue
        
        print(f"\n[{idx}/{len(failed_files)}] Procesando: {filename}")
        
        try:
            result = process_video(json_file)
            if result:
                successful += 1
                print(f"   ✓ Exitoso")
            else:
                failed += 1
                print(f"   ⏭️  Saltado (ya procesado)")
        except Exception as e:
            failed += 1
            print(f"   ✗ Error: {str(e)[:100]}")
    
    # Resumen final
    print(f"""

{'='*70}
{'  RESUMEN FINAL  ':^70}
{'='*70}
✓  Exitosos: {successful}
✗  Fallidos: {failed}
⏭️  Saltados: {len(failed_files) - successful - failed}
{'='*70}
    """)

if __name__ == "__main__":
    main()
