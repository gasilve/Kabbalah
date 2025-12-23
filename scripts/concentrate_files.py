import os
import shutil
from pathlib import Path

# Configuración
BASE_DIR = Path("transcripciones")
# Mapeo: {nombre_carpeta_destino: [variantes_a_buscar]}
MAPPING = {
    'secretos_zohar': ['Secretos_del_Zohar', 'secretos_zohar'],
    'arbol_vida': ['arbol_vida', 'Arbol_de_la_Vida'],
    'sefer_yetzirah': ['sefer_yetzirah', 'Sefer_Yetzirah'],
    'tefila': ['tefila', 'Tefila']
}

def consolidate_files():
    print("="*60)
    print("CONSOLIDACIÓN DE TRANSCRIPCIONES")
    print("="*60)
    
    stats = {'moved': 0, 'errors': 0}
    
    # Asegurar directorios destino
    for dest in MAPPING.keys():
        (BASE_DIR / dest).mkdir(exist_ok=True, parents=True)
        
    # Buscar archivos recursivamente
    all_files = list(BASE_DIR.rglob("*"))
    files_to_move = [f for f in all_files if f.is_file() and f.suffix in ['.json', '.json3', '.txt', '.vtt']]
    
    print(f"Encontrados {len(files_to_move)} archivos potenciales.")
    
    for file_path in files_to_move:
        # Determinar destino
        dest_folder = None
        
        # Check path parts
        parts = file_path.parts
        
        # Determinar a qué categoría pertenece
        for dest, variants in MAPPING.items():
            # Check si alguna variante está en el path
            if any(v.lower() in str(file_path).lower() for v in variants):
                dest_folder = dest
                break
        
        if dest_folder:
            target_file = BASE_DIR / dest_folder / file_path.name
            
            # Si el archivo está en el lugar correcto, saltar
            if file_path.parent == (BASE_DIR / dest_folder):
                continue
                
            # Mover
            try:
                # Si existe, no sobreescribir salvo que sea mayor
                if target_file.exists():
                    if target_file.stat().st_size < file_path.stat().st_size:
                        print(f"Update: {file_path.name} -> {dest_folder}/ (Más grande)")
                        shutil.move(str(file_path), str(target_file))
                        stats['moved'] += 1
                    else:
                        # Eliminar duplicado menor o igual
                        #print(f"Skip (Duplicado): {file_path.name}")
                        pass
                else:
                    print(f"Mover: {file_path.name} -> {dest_folder}/")
                    shutil.move(str(file_path), str(target_file))
                    stats['moved'] += 1
                    
            except Exception as e:
                print(f"Error moviendo {file_path}: {e}")
                stats['errors'] += 1
    
    # Limpieza de carpetas vacías
    print("\nLimpiando directorios vacíos...")
    for _ in range(3): # Repetir para limpiar carpetas anidadas vacías
        for dir_path in BASE_DIR.rglob("*"):
            if dir_path.is_dir() and dir_path.name not in MAPPING.keys():
                try:
                    dir_path.rmdir() # Solo borra si está vacía
                    print(f"Borrado dir vacío: {dir_path}")
                except:
                    pass

    print(f"\nResumen: {stats['moved']} archivos movidos. {stats['errors']} errores.")

if __name__ == "__main__":
    consolidate_files()
