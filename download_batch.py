"""
DESCAR GADOR EN LOTES PEQUEÑOS
Descarga 5-10 videos a la vez para evitar bloqueos de YouTube
Ejecuta este script varias veces al día hasta completar todos los videos
"""
import os
import json
import time
import random
from youtube_transcript_api import YouTubeTranscriptApi
from datetime import datetime
import re

def sanitize_filename(filename):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename[:150] if len(filename) >150 else filename

def get_completed_videos(output_dir):
    completed = set()
    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            if filename.endswith('.json') and not filename.startswith('_'):
                match = re.match(r'(\d+)_', filename)
                if match:
                    completed.add(int(match.group(1)))
    return completed

def download_video(video_id, video_title, output_dir, video_number, total_videos):
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        transcript_obj = transcript_list.find_transcript(['es', 'es-ES', 'es-MX', 'es-419'])
        transcript_data_raw = transcript_obj.fetch()
        
        transcript_data = []
        for snippet in transcript_data_raw:
            transcript_data.append({
                'text': snippet.text,
                'start': snippet.start,
                'duration': snippet.duration
            })
        
        total_words = sum(len(s['text'].split()) for s in transcript_data)
        duration_minutes = transcript_data[-1]['start'] / 60 if transcript_data else 0
        
        metadata = {
            'video_id': video_id,
            'video_title': video_title,
            'video_number': video_number,
            'video_url': f'https://www.youtube.com/watch?v={video_id}',
            'language': transcript_obj.language,
            'total_segments': len(transcript_data),
            'total_words': total_words,
            'duration_minutes': round(duration_minutes, 2),
            'downloaded_at': datetime.now().isoformat()
        }
        
        safe_title = sanitize_filename(video_title)
        base_filename = f"{video_number:03d}_{safe_title}"
        
        # Guardar JSON
        json_file = os.path.join(output_dir, f"{base_filename}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({'metadata': metadata, 'transcript': transcript_data}, f, ensure_ascii=False, indent=2)
        
        # Guardar TXT
        txt_file = os.path.join(output_dir, f"{base_filename}.txt")
        with open(txt_file, 'w', encoding='utf-8') as f:
            f.write(f"{'='*70}\n{video_title}\n{'='*70}\n")
            f.write(f"Video: https://www.youtube.com/watch?v={video_id}\n")
            f.write(f"Duración: {duration_minutes:.1f} min | Palabras: {total_words:,}\n{'='*70}\n\n")
            for segment in transcript_data:
                timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
                f.write(f"[{timestamp}] {segment['text']}\n")
        
        print(f"  ✓ {len(transcript_data)} segmentos | {total_words:,} palabras")
        return {'success': True, 'video_number': video_number}
        
    except Exception as e:
        print(f"  ✗ ERROR: {str(e)[:60]}...")
        error_file = os.path.join(output_dir, f"ERROR_{video_number:03d}_{video_id}.txt")
        with open(error_file, 'w', encoding='utf-8') as f:
            f.write(f"Video: {video_title}\nError: {str(e)}\nTimestamp: {datetime.now().isoformat()}\n")
        return {'success': False, 'video_number': video_number}

def download_small_batch():
    print("""
╔════════════════════════════════════════════════════════════════╗
║  DESCARGADOR EN LOTES PEQUEÑOS (5-10 videos por ejecución)    ║
╚════════════════════════════════════════════════════════════════╝
""")
    
    BATCH_SIZE = 10  # Cambia este número para descargar más o menos por lote
    
    playlist_file = "secretos_del_zohar_videos.json"
    if not os.path.exists(playlist_file):
        print("✗ No se encontró el archivo de playlist")
        return
    
    with open(playlist_file, 'r', encoding='utf-8') as f:
        playlist_data = json.load(f)
    
    videos = playlist_data['videos']
    output_dir = os.path.join("transcripciones", "Secretos_del_Zohar")
    os.makedirs(output_dir, exist_ok=True)
    
    completed = get_completed_videos(output_dir)
    pending = [v for i, v in enumerate(videos, 1) if i not in completed]
    
    print(f"\n📊 Estado actual:")
    print(f"  Total: {len(videos)} videos")
    print(f"  ✓ Descargados: {len(completed)}")
    print(f"  ⏳ Pendientes: {len(pending)}")
    
    if not pending:
        print("\n🎉 ¡Todos los videos están descargados!")
        return
    
    # Tomar solo los primeros BATCH_SIZE videos pendientes
    batch = pending[:BATCH_SIZE]
    
    print(f"\n🎯 En este lote descargaremos: {len(batch)} videos")
    print(f"⏱️  Tiempo estimado: ~{len(batch) * 20 / 60:.1f} minutos")
    print(f"\n{'='*70}\n")
    
    start_time = time.time()
    successful = 0
    failed = 0
    
    for idx, video_info in enumerate(batch, 1):
        original_idx = videos.index(video_info) + 1
        video_id = video_info['id']
        video_title = video_info.get('title', f'Video {original_idx}')
        
        print(f"[{idx}/{len(batch)}] {video_title[:55]}...")
        
        result = download_video(video_id, video_title, output_dir, original_idx, len(videos))
        
        if result['success']:
            successful += 1
        else:
            failed += 1
        
        # Pausa entre videos
        if idx < len(batch):
            pause = random.uniform(15, 20)
            print(f"  💤 Pausa {pause:.0f}s...")
            time.sleep(pause)
    
    elapsed = (time.time() - start_time) / 60
    total_completed = len(completed) + successful
    
    print(f"\n{'='*70}")
    print(f"  RESUMEN DE ESTE LOTE")
    print(f"{'='*70}")
    print(f"✓ Exitosos: {successful}")
    print(f"✗ Fallidos: {failed}")
    print(f"⏱️  Tiempo: {elapsed:.1f} minutos")
    print(f"\n📊 PROGRESO TOTAL: {total_completed}/{len(videos)} ({(total_completed/len(videos)*100):.1f}%)")
    print(f"⏳ Faltan: {len(videos) - total_completed} videos")
    print(f"{'='*70}\n")
    
    if total_completed < len(videos):
        remaining_batches = (len(videos) - total_completed + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"💡 Ejecuta este script {remaining_batches} veces más para completar")
        print(f"   (Recomendación: espera 30-60 min entre ejecuciones)\n")
    else:
        print("🎉 ¡DESCARGA COMPLETA!\n")

if __name__ == "__main__":
    download_small_batch()
