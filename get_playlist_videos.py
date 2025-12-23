"""
Script para obtener la lista de videos de una playlist de YouTube
usando web scraping simple (sin necesidad de API key)
"""
import json
import re
import requests
from datetime import datetime

def get_playlist_videos(playlist_id):
    """
    Obtiene la lista de videos de una playlist usando web scraping
    """
    print(f"Obteniendo videos de la playlist: {playlist_id}")
    
    # URL de la playlist
    playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"
    
    try:
        # Obtener el HTML de la playlist
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(playlist_url, headers=headers)
        response.raise_for_status()
        
        html_content = response.text
        
        # Buscar el objeto ytInitialData que contiene la información de la playlist
        pattern = r'var ytInitialData = ({.*?});'
        match = re.search(pattern, html_content)
        
        if not match:
            print("No se pudo encontrar la data inicial de YouTube")
            return None
        
        data = json.loads(match.group(1))
        
        # Navegar por la estructura de datos para obtener los videos
        videos = []
        
        try:
            # La estructura puede variar, intentamos encontrar los videos
            contents = data['contents']['twoColumnBrowseResultsRenderer']['tabs'][0]['tabRenderer']['content']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'][0]['playlistVideoListRenderer']['contents']
            
            for item in contents:
                if 'playlistVideoRenderer' in item:
                    video_data = item['playlistVideoRenderer']
                    
                    video_id = video_data['videoId']
                    title = video_data['title']['runs'][0]['text']
                    
                    # Obtener índice en la playlist
                    index = video_data.get('index', {}).get('simpleText', '0')
                    
                    videos.append({
                        'id': video_id,
                        'title': title,
                        'index': index,
                        'url': f'https://www.youtube.com/watch?v={video_id}'
                    })
            
            print(f"✓ Se encontraron {len(videos)} videos")
            return videos
            
        except KeyError as e:
            print(f"Error navegando la estructura de datos: {e}")
            # Intentar método alternativo - buscar en el HTML directamente
            return extract_videos_from_html(html_content)
    
    except Exception as e:
        print(f"Error obteniendo playlist: {e}")
        return None

def extract_videos_from_html(html_content):
    """
    Método alternativo: extraer videos directamente del HTML
    """
    print("Intentando método alternativo de extracción...")
    
    # Buscar todos los video IDs en el HTML
    video_id_pattern = r'"videoId":"([a-zA-Z0-9_-]{11})"'
    video_ids = re.findall(video_id_pattern, html_content)
    
    # Buscar títulos
    title_pattern = r'"title":{"runs":\[{"text":"([^"]+)"}]'
    titles = re.findall(title_pattern, html_content)
    
    # Combinar (eliminar duplicados manteniendo orden)
    seen_ids = set()
    videos = []
    
    for i, (video_id, title) in enumerate(zip(video_ids, titles), 1):
        if video_id not in seen_ids:
            seen_ids.add(video_id)
            videos.append({
                'id': video_id,
                'title': title,
                'index': str(i),
                'url': f'https://www.youtube.com/watch?v={video_id}'
            })
    
    print(f"✓ Método alternativo encontró {len(videos)} videos")
    return videos

def save_playlist_data(videos, playlist_name, output_file="playlist_videos.json"):
    """
    Guarda la lista de videos en un archivo JSON
    """
    data = {
        'playlist_name': playlist_name,
        'total_videos': len(videos),
        'extracted_at': datetime.now().isoformat(),
        'videos': videos
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Lista guardada en: {output_file}")
    return data

if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║  EXTRACTOR DE LISTA DE VIDEOS DE PLAYLIST                  ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    # Playlist: Secretos del Zohar
    PLAYLIST_ID = "PLJMifOLgCzqXqs1HCd-n4m6YQleyzNL2v"
    PLAYLIST_NAME = "Secretos_del_Zohar"
    
    print(f"\nPlaylist: {PLAYLIST_NAME}")
    print(f"ID: {PLAYLIST_ID}\n")
    
    videos = get_playlist_videos(PLAYLIST_ID)
    
    if videos:
        save_playlist_data(videos, PLAYLIST_NAME, "secretos_del_zohar_videos.json")
        
        print("\n" + "="*60)
        print("PRIMEROS 5 VIDEOS:")
        print("="*60)
        for video in videos[:5]:
            print(f"{video['index']}. {video['title']}")
            print(f"   ID: {video['id']}")
        
        print("\n...")
        print(f"\nTotal: {len(videos)} videos")
        print("\n✓ Listo para descargar subtítulos!")
    else:
        print("\n✗ No se pudieron obtener los videos de la playlist")
