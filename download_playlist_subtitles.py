"""
Script para descargar automáticamente los subtítulos de una playlist completa de YouTube
Organiza cada video en archivos JSON y TXT separados dentro de carpetas por playlist
"""
import os
import json
import time
from youtube_transcript_api import YouTubeTranscriptApi
from datetime import datetime
import re

# Configuración
PLAYLIST_ID = "PLJMifOLgCzqXqs1HCd-n4m6YQleyzNL2v"  # Secretos del Zohar
PLAYLIST_NAME = "Secretos_del_Zohar"
OUTPUT_BASE_DIR = "transcripciones"

# Lista de videos de la playlist (obtenida manualmente)
# Necesitamos obtener esta lista primero
def get_playlist_videos_manual():
    """
    Por ahora, vamos a usar una lista predefinida.
    Más adelante podemos integrar la API de YouTube para obtener esto automáticamente.
    """
    # Esta es solo una muestra, necesitamos la lista completa
    videos = []
    
    # Por ahora, retornamos una lista vacía para ser llenada
    return videos

def extract_video_id_from_url(url):
    """Extrae el video ID de una URL de YouTube"""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11})',
        r'^([0-9A-Za-z_-]{11})$'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def sanitize_filename(filename):
    """Limpia un nombre de archivo de caracteres no válidos"""
    # Reemplazar caracteres no válidos
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def download_video_transcript(video_id, video_title, output_dir, video_number):
    """
    Descarga la transcripción de un video específico
    """
    try:
        print(f"\n[{video_number}] Procesando: {video_title}")
        print(f"    Video ID: {video_id}")
        
        # Obtener lista de transcripciones disponibles
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        # Listar idiomas disponibles
        available_languages = []
        for t in transcript_list:
            lang_info = f"{t.language} [{t.language_code}]"
            if t.is_generated:
                lang_info += " (Auto)"
            available_languages.append(lang_info)
        
        print(f"    Idiomas: {', '.join(available_languages)}")
        
        # Obtener transcripción en español
        transcript_obj = transcript_list.find_transcript(['es', 'es-ES', 'es-MX'])
        transcript_data_raw = transcript_obj.fetch()
        
        # Convertir a lista de diccionarios
        transcript_data = []
        for snippet in transcript_data_raw:
            transcript_data.append({
                'text': snippet.text,
                'start': snippet.start,
                'duration': snippet.duration
            })
        
        # Metadata
        metadata = {
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'language': transcript_obj.language,
            'language_code': transcript_obj.language_code,
            'is_auto_generated': transcript_obj.is_generated,
            'total_segments': len(transcript_data),
            'duration_minutes': transcript_data[-1]['start'] / 60 if transcript_data else 0,
            'downloaded_at': datetime.now().isoformat()
        }
        
        # Crear nombre de archivo seguro
        safe_title = sanitize_filename(video_title)
        base_filename = f"{video_number:03d}_{safe_title}"
        
        # Guardar JSON con metadata y transcripción
        json_file = os.path.join(output_dir, f"{base_filename}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': metadata,
                'transcript': transcript_data
            }, f, ensure_ascii=False, indent=2)
        
        # Guardar TXT (texto plano legible)
        txt_file = os.path.join(output_dir, f"{base_filename}.txt")
        with open(txt_file, 'w', encoding='utf-8') as f:
            # Encabezado
            f.write(f"{'='*60}\n")
            f.write(f"{video_title}\n")
            f.write(f"{'='*60}\n")
            f.write(f"Video ID: {video_id}\n")
            f.write(f"Duración: {metadata['duration_minutes']:.1f} minutos\n")
            f.write(f"Segmentos: {len(transcript_data)}\n")
            f.write(f"{'='*60}\n\n")
            
            # Transcripción
            for segment in transcript_data:
                timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
                f.write(f"[{timestamp}] {segment['text']}\n")
        
        print(f"    ✓ Guardado: {base_filename}")
        print(f"    ✓ Segmentos: {len(transcript_data)}")
        print(f"    ✓ Duración: {metadata['duration_minutes']:.1f} min")
        
        return {
            'success': True,
            'video_id': video_id,
            'video_title': video_title,
            'metadata': metadata
        }
        
    except Exception as e:
        print(f"    ✗ Error: {e}")
        return {
            'success': False,
            'video_id': video_id,
            'video_title': video_title,
            'error': str(e)
        }

def download_playlist(video_list, playlist_name):
    """
    Descarga todas las transcripciones de una playlist
    """
    # Crear estructura de directorios
    output_dir = os.path.join(OUTPUT_BASE_DIR, playlist_name)
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n" + "="*60)
    print(f"DESCARGANDO PLAYLIST: {playlist_name}")
    print(f"Total de videos: {len(video_list)}")
    print(f"Directorio de salida: {output_dir}")
    print("="*60)
    
    results = []
    successful = 0
    failed = 0
    
    for i, video_info in enumerate(video_list, 1):
        video_id = video_info['id']
        video_title = video_info.get('title', f'Video {i}')
        
        result = download_video_transcript(video_id, video_title, output_dir, i)
        results.append(result)
        
        if result['success']:
            successful += 1
        else:
            failed += 1
        
        # Pequeña pausa para no saturar la API
        time.sleep(0.5)
    
    # Guardar resumen
    summary_file = os.path.join(output_dir, "_RESUMEN.json")
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump({
            'playlist_name': playlist_name,
            'total_videos': len(video_list),
            'successful': successful,
            'failed': failed,
            'downloaded_at': datetime.now().isoformat(),
            'results': results
        }, f, ensure_ascii=False, indent=2)
    
    # Imprimir resumen
    print("\n" + "="*60)
    print("RESUMEN DE DESCARGA")
    print("="*60)
    print(f"Total de videos: {len(video_list)}")
    print(f"✓ Exitosos: {successful}")
    print(f"✗ Fallidos: {failed}")
    print(f"\nArchivos guardados en: {output_dir}")
    print("="*60)
    
    return results

if __name__ == "__main__":
    # Configuración via argparse para uso desde master processor
    import argparse
    
    parser = argparse.ArgumentParser(description='Descarga subtítulos de playlist de YouTube')
    parser.add_argument('--playlist', type=str, required=False, default='secretos_zohar',
                       help='Nombre de la playlist a descargar')
    
    # Para usar este script, necesitas proporcionar la lista de videos
    # Opción 1: Cargar desde un archivo
    # Opción 2: Definir manualmente
    
    print("NOTA: Este script necesita la lista de video IDs de la playlist.")
    print("Voy a crear un script complementario para obtener esta lista...")
    print("\nPor favor, ejecuta primero: get_playlist_videos.py")
