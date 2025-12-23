import os
import requests
import json
from openai import OpenAI

# Configuración
OLLAMA_BASE_URL = "http://192.168.100.21:11434/v1"
MODEL = "llama3.1:8b"

print(f"Probando conexión a {OLLAMA_BASE_URL}...")

try:
    # 1. Prueba básica de conectividad HTTP
    response = requests.get(f"{OLLAMA_BASE_URL.replace('/v1', '')}/api/tags")
    if response.status_code == 200:
        print("✓ Servidor Ollama accesible")
        models = [m['name'] for m in response.json()['models']]
        print(f"   Modelos disponibles: {models}")
    else:
        print(f"✗ Servidor responde con error {response.status_code}")

    # 2. Prueba con cliente OpenAI
    client = OpenAI(
        base_url=OLLAMA_BASE_URL,
        api_key="ollama"
    )
    
    print(f"\nProbando inferencia con modelo '{MODEL}'...")
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": "Di 'Hola Mundo' en español brevísimamente."}],
    )
    
    print(f"✓ Respuesta recibida: {response.choices[0].message.content}")
    print("\n¡Todo listo para usar Ollama!")

except Exception as e:
    print(f"\n✗ Error: {e}")
