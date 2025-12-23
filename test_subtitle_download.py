"""
Script de prueba para descargar subtítulos de YouTube usando youtube-transcript-api
"""
from youtube_transcript_api import YouTubeTranscriptApi
import json

# Video ID del primer video de la playlist
video_id = "_gdJDqEgW7g"  # Kabbalah: Secretos del Zohar - clase 1 Preliminares

print(f"Descargando subtítulos del video: {video_id}")
print("-" * 60)

try:
    # Obtener la lista de transcripciones disponibles
    api = YouTubeTranscriptApi()
    transcript_list = api.list(video_id)
    
    print("✓ Transcripciones disponibles:")
    for t in transcript_list:
        is_auto = " (Automático)" if t.is_generated else " (Manual)"
        print(f"  - {t.language} [{t.language_code}]{is_auto}")
    
    # Obtener la transcripción en español
    print("\nObteniendo transcripción en español...")
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
    
    print(f"\n✓ Subtítulos descargados exitosamente!")
    print(f"✓ Idioma: {transcript_obj.language} ({transcript_obj.language_code})")
    print(f"✓ ¿Generado automáticamente?: {'Sí' if transcript_obj.is_generated else 'No (Manual)'}")
    print(f"✓ Total de segmentos: {len(transcript_data)}")
    print(f"✓ Duración aproximada: {transcript_data[-1]['start'] / 60:.1f} minutos")
    
    print("\n" + "=" * 60)
    print("PRIMEROS 5 SEGMENTOS:")
    print("=" * 60)
    
    # Mostrar los primeros 5 segmentos
    for segment in transcript_data[:5]:
        timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
        print(f"\n[{timestamp}] {segment['text']}")
    
    print("\n" + "=" * 60)
    print("ÚLTIMOS 3 SEGMENTOS:")
    print("=" * 60)
    
    # Mostrar los últimos 3 segmentos
    for segment in transcript_data[-3:]:
        timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
        print(f"\n[{timestamp}] {segment['text']}")
    
    # Guardar el transcript completo en un archivo JSON
    output_file = f"transcript_{video_id}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(transcript_data, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print(f"✓ Transcripción completa guardada en: {output_file}")
    
    # Crear también una versión de texto plano
    text_file = f"transcript_{video_id}.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        for segment in transcript_data:
            timestamp = f"{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}"
            f.write(f"[{timestamp}] {segment['text']}\n")
    
    print(f"✓ Versión de texto guardada en: {text_file}")
    
    # Estadísticas
    total_text = " ".join([s['text'] for s in transcript_data])
    word_count = len(total_text.split())
    print("\n" + "=" * 60)
    print("ESTADÍSTICAS:")
    print("=" * 60)
    print(f"Total de palabras: {word_count:,}")
    print(f"Total de caracteres: {len(total_text):,}")
    print(f"Duración del video: {transcript_data[-1]['start'] / 60:.1f} minutos")
    print(f"Promedio palabras/minuto: {word_count / (transcript_data[-1]['start'] / 60):.0f}")
    
    print("\n" + "=" * 60)
    print("CONCLUSIÓN:")
    print("=" * 60)
    print("✓ ¡Los subtítulos se descargaron exitosamente!")
    print("✓ Este mismo proceso se puede automatizar para los 167 videos")
    print("✓ Costo: $0 (totalmente GRATIS)")
    print("✓ Tiempo estimado: ~30 minutos para toda la playlist")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
