"""
Script MEJORADO con control de rate limiting y capacidad de reanudar
Versión con pausas más largas para evitar bloqueos de YouTube
"""
import os
import json
import time
import random
from youtube_transcript_api import YouTubeTranscriptApi
from datetime import datetime
import re

def sanitize_filename(filename):
    """Limpia un nombre de archivo de caracteres no válidos"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    if len(filename) > 150:
        filename = filename[:150]
    return filename

def get_completed_videos(output_dir):
    """Obtiene la lista de videos ya procesados"""
    completed = set()
    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            if filename.endswith('.json') and not filename.startswith('_'):
                # Extraer número del archivo
                match = re.match(r'(\d+)_', filename)
                if match:
                    completed.add(int(match.group(1)))
    return completed

def download_video_transcript(video_id, video_title, output_dir, video_number, total_videos):
    """Descarga la transcripción de un video específico"""
    try:
        print(f"\n{'='*70}")
        print(f"[{video_number}/{total_videos}] {video_title[:60]}...")
        print(f"{'='*70}")
        print(f"Video ID: {video_id}")
        
        # Obtener transcripciones
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        # Listar idiomas
        available_languages = []
        for t in transcript_list:
            lang_info = f"{t.language_code}"
            if t.is_generated:
                lang_info += " (auto)"
            available_languages.append(lang_info)
        
        print(f"Idiomas: {', '.join(available_languages)}")
        
        # Obtener transcripción en español
        transcript_obj = transcript_list.find_transcript(['es', 'es-ES', 'es-MX', 'es-419'])
        transcript_data_raw = transcript_obj.fetch()
        
        # Convertir a lista
        transcript_data = []
        for snippet in transcript_data_raw:
            transcript_data.append({
                'text': snippet.text,
                'start': snippet.start,
                'duration': snippet.duration
            })
        
        # Estadísticas
        total_words = sum(len(s['text'].split()) for s in transcript_data)
        duration_minutes = transcript_data[-1]['start'] / 60 if transcript_data else 0
        
        # Metadata
        metadata = {
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'video_url': f'https://www.youtube.com/watch?v={video_id}',
            'language': transcript_obj.language,
            'language_code': transcript_obj.language_code,
            'is_auto_generated': transcript_obj.is_generated,
            'total_segments': len(transcript_data),
            'total_words': total_words,
            'duration_minutes': round(duration_minutes, 2),
            'downloaded_at': datetime.now().isoformat()
        }
        
        # Nombres de archivo
        safe_title = sanitize_filename(video_title)
        base_filename = f"{video_number:03d}_{safe_title}"
        
        # Guardar JSON
        json_file = os.path.join(output_dir, f"{base_filename}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': metadata,
                'transcript': transcript_data
            }, f, ensure_ascii=False, indent=2)
        
        # Guardar TXT
        txt_file = os.path.join(output_dir, f"{base_filename}.txt")
        with open(txt_file, 'w', encoding='utf-8') as f:
            f.write(f"{'='*70}\n")
            f.write(f"{video_title}\n")
            f.write(f"{'='*70}\n")
            f.write(f"Video: https://www.youtube.com/watch?v={video_id}\n")
            f.write(f"Duración: {duration_minutes:.1f} minutos\n")
            f.write(f"Palabras: {total_words:,}\n")
            f.write(f"Segmentos: {len(transcript_data)}\n")
            f.write(f"{'='*70}\n\n")
            
            for segment in transcript_data:
                timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
                f.write(f"[{timestamp}] {segment['text']}\n")
        
        print(f"✓ Guardado exitosamente")
        print(f"✓ {len(transcript_data)} segmentos | {total_words:,} palabras | {duration_minutes:.1f} min")
        
        return {
            'success': True,
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'metadata': metadata
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"✗ ERROR: {error_msg[:100]}...")
        
        # Guardar error
        error_file = os.path.join(output_dir, f"ERROR_{video_number:03d}_{video_id}.txt")
        with open(error_file, 'w', encoding='utf-8') as f:
            f.write(f"Video: {video_title}\n")
            f.write(f"Video ID: {video_id}\n")
            f.write(f"Error: {error_msg}\n")
            f.write(f"Timestamp: {datetime.now().isoformat()}\n")
        
        return {
            'success': False,
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'error': error_msg
        }

def download_with_resume():
    """Función principal con capacidad de reanudar"""
    
    print("""
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║    DESCARGADOR MEJORADO - Con Rate Limiting                       ║
║    Kabbalah Mashiah - Secretos del Zohar                          ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
    """)
    
    # Cargar playlist
    playlist_file = "secretos_del_zohar_videos.json"
    
    if not os.path.exists(playlist_file):
        print(f"✗ Error: No se encontró {playlist_file}")
        return
    
    with open(playlist_file, 'r', encoding='utf-8') as f:
        playlist_data = json.load(f)
    
    videos = playlist_data['videos']
    playlist_name = playlist_data['playlist_name']
    
    # Crear carpeta
    # Crear carpeta (guardar en directorio padre)
    # Si estamos en scripts/, subir un nivel
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(root_dir, "transcripciones", playlist_name)
    os.makedirs(output_dir, exist_ok=True)
    
    # Verificar videos ya completados
    completed = get_completed_videos(output_dir)
    pending = [v for i, v in enumerate(videos, 1) if i not in completed]
    
    print(f"📁 Playlist: {playlist_name}")
    print(f"📊 Total de videos: {len(videos)}")
    print(f"✓ Ya descargados: {len(completed)}")
    print(f"⏳ Pendientes: {len(pending)}")
    print(f"💾 Carpeta: {output_dir}")
    
    if len(pending) == 0:
        print("\n🎉 ¡Todos los videos ya están descargados!")
        return
    
    print(f"\n{'='*70}")
    print("CONFIGURACIÓN DE DESCARGA:")
    print(f"{'='*70}")
    print("Pausa entre videos: 2-4 segundos (aleatorio)")
    print("Pausa cada 10 videos: 30 segundos")
    print("Pausa cada 30 videos: 60 segundos")
    print("Esto evita bloqueos de YouTube")
    print(f"{'='*70}")
    
    input("\nPresiona ENTER para comenzar...")
    
    # Variables de seguimiento
    results = []
    successful = 0
    failed = 0
    start_time = time.time()
    
    # Procesar pending videos
    for idx, video_info in enumerate(pending, 1):
        # Encontrar el número original del video
        original_idx = videos.index(video_info) + 1
        
        video_id = video_info['id']
        video_title = video_info.get('title', f'Video {original_idx}')
        
        result = download_video_transcript(
            video_id,
            video_title,
            output_dir,
            original_idx,
            len(videos)
        )
        
        results.append(result)
        
        if result['success']:
            successful += 1
        else:
            failed += 1
            
            # Si hay error de bloqueo, pausar más tiempo
            if 'blocking requests' in result.get('error', '').lower():
                print("\n⚠️  YouTube bloqueó la IP. Pausando 2 minutos...")
                time.sleep(120)
        
        # Progreso
        total_completed = len(completed) + successful
        progress = (total_completed / len(videos)) * 100
        print(f"\n📈 Progreso Global: {total_completed}/{len(videos)} ({progress:.1f}%)")
        print(f"   En esta sesión: ✓ {successful} | ✗ {failed}")
        
        # Pausas estratégicas más largas
        if idx < len(pending):  # Si no es el último
            if idx % 30 == 0:
                print("\n⏸️  Pausa larga (60 seg) - checkpoint cada 30 videos...")
                time.sleep(60)
            elif idx % 10 == 0:
                print("\n⏸️  Pausa media (30 seg) - checkpoint cada 10 videos...")
                time.sleep(30)
            else:
                # Pausa aleatoria entre 2-4 segundos
                pause = random.uniform(2, 4)
                print(f"⏸️  Pausa {pause:.1f}s...")
                time.sleep(pause)
    
    # Tiempo total
    elapsed_time = time.time() - start_time
    elapsed_minutes = elapsed_time / 60
    
    # Resumen
    print(f"\n\n{'='*70}")
    print(f"{'  RESUMEN DE ESTA SESIÓN  ':^70}")
    print(f"{'='*70}")
    print(f"✓  Exitosos: {successful}")
    print(f"✗  Fallidos: {failed}")
    print(f"⏱️  Tiempo: {elapsed_minutes:.1f} minutos")
    print(f"\n{'='*70}")
    print(f"{'  PROGRESO TOTAL  ':^70}")
    print(f"{'='*70}")
    total_completed = len(completed) + successful
    print(f"📊 Completados: {total_completed}/{len(videos)} ({(total_completed/len(videos)*100):.1f}%)")
    print(f"⏳ Falta: {len(videos) - total_completed} videos")
    print(f"{'='*70}\n")
    
    if len(videos) - total_completed > 0:
        print("💡 Para continuar, simplemente ejecuta el script de nuevo.")
        print("   El script se saltará los videos ya descargados.")
    else:
        print("🎉 ¡DESCARGA COMPLETA!")

if __name__ == "__main__":
    download_with_resume()
