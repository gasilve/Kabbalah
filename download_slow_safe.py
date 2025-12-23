"""
Script ULTRA-CONSERVADOR para evitar bloqueos de YouTube
Pausas muy largas entre descargas para completar los 100 videos sin problemas
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
                match = re.match(r'(\d+)_', filename)
                if match:
                    completed.add(int(match.group(1)))
    return completed

def download_video_transcript(video_id, video_title, output_dir, video_number, total_videos):
    """Descarga la transcripción de un video específico"""
    try:
        print(f"\n{'='*70}")
        print(f"[{video_number}/{total_videos}] {video_title[:55]}...")
        print(f"{'='*70}")
        
        # Obtener transcripciones
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
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
            f.write(f"Duración: {duration_minutes:.1f} min | Palabras: {total_words:,}\n")
            f.write(f"{'='*70}\n\n")
            
            for segment in transcript_data:
                timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
                f.write(f"[{timestamp}] {segment['text']}\n")
        
        print(f"✓ OK: {len(transcript_data)} seg | {total_words:,} palabras | {duration_minutes:.1f} min")
        
        return {
            'success': True,
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'metadata': metadata
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"✗ ERROR: {error_msg[:80]}...")
        
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

def download_batch_conservative():
    """Descarga con pausas MUY largas para evitar bloqueos"""
    
    print("""
╔════════════════════════════════════════════════════════════════════╗
║    DESCARGADOR ULTRA-CONSERVADOR                                   ║
║    Pausas largas para evitar bloqueos de YouTube                   ║
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
    output_dir = os.path.join("transcripciones", playlist_name)
    os.makedirs(output_dir, exist_ok=True)
    
    # Verificar videos ya completados
    completed = get_completed_videos(output_dir)
    pending = [v for i, v in enumerate(videos, 1) if i not in completed]
    
    print(f"\n📁 Playlist: {playlist_name}")
    print(f"📊 Total: {len(videos)} videos")
    print(f"✓ Descargados: {len(completed)}")
    print(f"⏳ Pendientes: {len(pending)}")
    
    if len(pending) == 0:
        print("\n🎉 ¡Todos los videos ya están descargados!")
        return
    
    print(f"\n{'='*70}")
    print("⚙️  CONFIGURACIÓN ULTRA-CONSERVADORA:")
    print(f"{'='*70}")
    print("• Pausa entre videos: 10-15 segundos (aleatorio)")
    print("• Pausa cada 5 videos: 60 segundos")
    print("• Pausa cada 15 videos: 120 segundos (2 minutos)")
    print("• Esto tomará tiempo pero evitará bloqueos 100%")
    print(f"{'='*70}")
    print(f"\n⏱️  Tiempo estimado: ~{len(pending) * 14 / 60:.0f} minutos")
    print(f"{'='*70}\n")
    
    input("✋ Presiona ENTER para comenzar la descarga lenta y segura...")
    print(f"\n{'='*70}\n")
    
    # Variables
    results = []
    successful = 0
    failed = 0
    consecutive_failures = 0
    start_time = time.time()
    
    # Procesar pending
    for idx, video_info in enumerate(pending, 1):
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
            consecutive_failures = 0
        else:
            failed += 1
            consecutive_failures += 1
            
            # Si hay muchos fallos consecutivos, pausar MÁS
            if consecutive_failures >= 3:
                print(f"\n⚠️  3 fallos consecutivos. Pausa extendida de 5 minutos...")
                time.sleep(300)
                consecutive_failures = 0
            elif 'blocking' in result.get('error', '').lower():
                print(f"\n⚠️  Bloqueo detectado. Pausa de 3 minutos...")
                time.sleep(180)
        
        # Progreso
        total_completed = len(completed) + successful
        progress = (total_completed / len(videos)) * 100
        elapsed = (time.time() - start_time) / 60
        
        print(f"📊 Global: {total_completed}/{len(videos)} ({progress:.1f}%) | Sesión: ✓{successful} ✗{failed} | Tiempo: {elapsed:.1f}min")
        
        # Pausas estratégicas MUY conservadoras
        if idx < len(pending):
            if idx % 15 == 0:
                print(f"\n⏸️  PAUSA LARGA (120 seg) - Checkpoint cada 15 videos...")
                for i in range(120, 0, -10):
                    print(f"   {i} segundos...", end='\r')
                    time.sleep(10)
                print()
            elif idx % 5 == 0:
                print(f"\n⏸️  Pausa media (60 seg) - Checkpoint cada 5 videos...")
                for i in range(60, 0, -10):
                    print(f"   {i} segundos...", end='\r')
                    time.sleep(10)
                print()
            else:
                # Pausa aleatoria 10-15 segundos
                pause = random.uniform(10, 15)
                print(f"⏸️  Pausa: {pause:.0f}s...", end=' ')
                time.sleep(pause)
                print("✓")
    
    # Resumen final
    elapsed_total = (time.time() - start_time) / 60
    total_completed = len(completed) + successful
    
    print(f"\n\n{'='*70}")
    print(f"{'  RESUMEN FINAL  ':^70}")
    print(f"{'='*70}")
    print(f"✓  Exitosos en esta sesión: {successful}")
    print(f"✗  Fallidos: {failed}")
    print(f"⏱️  Tiempo total: {elapsed_total:.1f} minutos")
    print(f"\n📊 PROGRESO TOTAL: {total_completed}/{len(videos)} ({(total_completed/len(videos)*100):.1f}%)")
    print(f"⏳ Faltan: {len(videos) - total_completed} videos")
    print(f"{'='*70}\n")
    
    if len(videos) - total_completed > 0:
        print("💡 Para continuar con los restantes, ejecuta el script nuevamente.")
    else:
        print("🎉 ¡DESCARGA COMPLETA DE LOS 100 VIDEOS INICIALES!")
        print("\nAhora necesitamos obtener los 67 videos faltantes para completar los 167 totales.")

if __name__ == "__main__":
    download_batch_conservative()
