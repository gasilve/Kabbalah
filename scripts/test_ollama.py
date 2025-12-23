from openai import OpenAI
import os
import sys

print("Iniciando prueba de conexion...")
try:
    client = OpenAI(
        api_key="ollama",
        base_url="http://192.168.100.21:11434/v1"
    )
    print(f"Cliente creado para: {client.base_url}")
    print("Listando modelos...")
    models = client.models.list()
    print(f"Exito! Modelos encontrados: {len(models.data)}")
    for m in models.data:
        print(f" - {m.id}")
except Exception as e:
    print(f"ERROR: {e}")
