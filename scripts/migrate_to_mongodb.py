"""
Script de migración de contenido procesado a MongoDB
Sube los archivos JSON enriquecidos a MongoDB y crea índices para búsqueda rápida
"""

import json
import os
from pathlib import Path
from pymongo import MongoClient, ASCENDING, TEXT
from datetime import datetime

# Configuración de MongoDB
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = 'kabbalah_app'

# Directorio de contenido procesado
CONTENT_DIR = Path(__file__).parent.parent / 'contenido_procesado'

def connect_to_mongodb():
    """Conecta a MongoDB"""
    client = MongoClient(MONGODB_URI)
    db = client[DATABASE_NAME]
    print(f"✅ Conectado a MongoDB: {DATABASE_NAME}")
    return db

def create_indexes(db):
    """Crea índices para búsqueda eficiente"""
    
    print("\n📊 Creando índices...")
    
    # Índices para meditaciones
    db.meditaciones.create_index([("titulo", TEXT), ("descripcion", TEXT)])
    db.meditaciones.create_index("intenciones")
    db.meditaciones.create_index("video_id")
    
    # Índices para glosario
    db.glosario.create_index([("simbolo", TEXT), ("significado_mistico", TEXT)])
    db.glosario.create_index("temas_relacionados")
    
    # Índices para Q&A
    db.preguntas.create_index([("pregunta", TEXT), ("respuesta", TEXT)])
    db.preguntas.create_index("categoria")
    db.preguntas.create_index("problemas_que_resuelve")
    db.preguntas.create_index("conceptos_clave")
    
    # Índices para revelaciones
    db.revelaciones.create_index([("titulo", TEXT), ("revelacion", TEXT)])
    db.revelaciones.create_index("nivel_profundidad")
    db.revelaciones.create_index("temas")
    
    # Índices para clases (resúmenes)
    db.clases.create_index([("resumen_breve", TEXT), ("resumen_detallado", TEXT)])
    db.clases.create_index("temas_principales")
    db.clases.create_index("parasha_relacionada")
    db.clases.create_index("video_id")
    
    print("✅ Índices creados")

def migrate_content(db):
    """Migra contenido de archivos JSON a MongoDB"""
    
    # Buscar archivos JSON enriquecidos
    json_files = list(CONTENT_DIR.glob("*_enhanced.json"))
    
    if not json_files:
        print("⚠️  No se encontraron archivos *_enhanced.json")
        print(f"Buscado en: {CONTENT_DIR}")
        return
    
    print(f"\n📁 Encontrados {len(json_files)} archivos para migrar")
    
    stats = {
        'clases': 0,
        'meditaciones': 0,
        'simbolos': 0,
        'preguntas': 0,
        'revelaciones': 0
    }
    
    for json_file in json_files:
        print(f"\n📄 Procesando: {json_file.name}")
        
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Migrar resumen de clase
        if 'resumen_clase' in data:
            resumen = data['resumen_clase']
            resumen['migrated_at'] = datetime.now()
            resumen['source_file'] = json_file.name
            
            db.clases.update_one(
                {'video_id': resumen['video_id']},
                {'$set': resumen},
                upsert=True
            )
            stats['clases'] += 1
        
        # Migrar meditaciones
        for meditacion in data.get('meditaciones', []):
            meditacion['video_id'] = data['resumen_clase']['video_id']
            meditacion['video_titulo'] = data['resumen_clase']['titulo']
            meditacion['migrated_at'] = datetime.now()
            
            db.meditaciones.insert_one(meditacion)
            stats['meditaciones'] += 1
        
        # Migrar glosario de símbolos
        for simbolo in data.get('glosario_simbolos', []):
            simbolo['video_id'] = data['resumen_clase']['video_id']
            simbolo['video_titulo'] = data['resumen_clase']['titulo']
            simbolo['migrated_at'] = datetime.now()
            
            # Usar update para evitar duplicados de símbolos
            db.glosario.update_one(
                {
                    'simbolo': simbolo['simbolo'],
                    'video_id': simbolo['video_id']
                },
                {'$set': simbolo},
                upsert=True
            )
            stats['simbolos'] += 1
        
        # Migrar Q&A
        for qa in data.get('preguntas_respuestas', []):
            qa['video_id'] = data['resumen_clase']['video_id']
            qa['video_titulo'] = data['resumen_clase']['titulo']
            qa['migrated_at'] = datetime.now()
            
            db.preguntas.insert_one(qa)
            stats['preguntas'] += 1
        
        # Migrar revelaciones
        for revelacion in data.get('revelaciones_secretos', []):
            revelacion['video_id'] = data['resumen_clase']['video_id']
            revelacion['video_titulo'] = data['resumen_clase']['titulo']
            revelacion['migrated_at'] = datetime.now()
            
            db.revelaciones.insert_one(revelacion)
            stats['revelaciones'] += 1
    
    # Resumen
    print(f"\n\n{'='*70}")
    print(f"{'  MIGRACIÓN COMPLETADA  ':^70}")
    print(f"{'='*70}")
    print(f"✅ Clases migradas: {stats['clases']}")
    print(f"✅ Meditaciones: {stats['meditaciones']}")
    print(f"✅ Símbolos del glosario: {stats['simbolos']}")
    print(f"✅ Preguntas y respuestas: {stats['preguntas']}")
    print(f"✅ Revelaciones: {stats['revelaciones']}")
    print(f"{'='*70}\n")

def verify_migration(db):
    """Verifica que la migración fue exitosa"""
    
    print("\n🔍 Verificando migración...")
    
    counts = {
        'clases': db.clases.count_documents({}),
        'meditaciones': db.meditaciones.count_documents({}),
        'glosario': db.glosario.count_documents({}),
        'preguntas': db.preguntas.count_documents({}),
        'revelaciones': db.revelaciones.count_documents({})
    }
    
    print("\n📊 Contenido en MongoDB:")
    for collection, count in counts.items():
        print(f"   • {collection}: {count} documentos")
    
    # Mostrar ejemplos de búsqueda
    print("\n🔎 Ejemplos de búsqueda:")
    
    # Meditación por intención
    med = db.meditaciones.find_one({'intenciones': 'salud'})
    if med:
        print(f"   ✓ Meditación para 'salud': {med.get('titulo', 'N/A')}")
    
    # Símbolo del glosario
    sim = db.glosario.find_one({})
    if sim:
        print(f"   ✓ Símbolo en glosario: {sim.get('simbolo', 'N/A')}")
    
    # Pregunta por problema
    qa = db.preguntas.find_one({'problemas_que_resuelve': {'$exists': True}})
    if qa and qa.get('problemas_que_resuelve'):
        print(f"   ✓ Pregunta sobre: {qa['problemas_que_resuelve'][0] if qa['problemas_que_resuelve'] else 'N/A'}")

def main():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║  MIGRACIÓN DE CONTENIDO A MONGODB                                ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    # Conectar a MongoDB
    db = connect_to_mongodb()
    
    # Crear índices
    create_indexes(db)
    
    # Migrar contenido
    migrate_content(db)
    
    # Verificar
    verify_migration(db)
    
    print("\n💾 Migración completada exitosamente")

if __name__ == "__main__":
    main()
