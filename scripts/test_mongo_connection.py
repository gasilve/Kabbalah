import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Cargar variables de entorno del archivo .env.local de la app
# Nota: python-dotenv busca .env por defecto, especificamos la ruta
env_path = r"..\kabbalah-app\.env.local"
load_dotenv(env_path)

uri = os.getenv("MONGODB_URI")
if not uri:
    print("❌ Error: No se encontró MONGODB_URI en .env.local")
    exit(1)

print(f"🔌 Intentando conectar a MongoDB Atlas...")
# Ocultar password en logs
safe_uri = uri.split('@')[1] if '@' in uri else '...' 
print(f"   Endpoint: ...@{safe_uri}")

try:
    client = MongoClient(uri)
    # Forzar conexión para verificar
    client.admin.command('ping')
    print("✅ ¡Conexión exitosa!")
    
    db = client.get_database()
    print(f"📁 Base de datos: {db.name}")
    
    print("enumerate collections:")
    collections = db.list_collection_names()
    if not collections:
        print("   (La base de datos está vacía, no tiene colecciones todavía)")
    else:
        for col in collections:
            count = db[col].count_documents({})
            print(f"   • {col}: {count} documentos")
            
except Exception as e:
    print(f"❌ Falló la conexión: {e}")
