# Instrucciones para Activar el Servidor Ollama Remoto

## Servidor: 192.168.100.21 (Usuario: willy)

### Opción 1: SSH y verificar/iniciar Ollama

```bash
# Conectarse al servidor
ssh willy@192.168.100.21
# Password: Passw0rd

# Verificar si Ollama está corriendo
systemctl status ollama
# O si se ejecuta manualmente:
ps aux | grep ollama

# Si no está corriendo, iniciarlo
ollama serve

# En otra terminal, verificar que el modelo esté instalado
ollama list
ollama pull llama3.1:8b
```

### Opción 2: Verificar conectividad desde Windows

```powershell
# Desde tu PC Windows
ping 192.168.100.21

# Verificar puerto
Test-NetConnection -ComputerName 192.168.100.21 -Port 11434

# Probar el endpoint HTTP
Invoke-WebRequest -Uri "http://192.168.100.21:11434/" -TimeoutSec 5
```

### Opción 3: Usar Ollama en localhost (alternativa)

Si no puedes conectarte al servidor remoto, puedes usar Ollama localmente:

1. Descargar Ollama para Windows: https://ollama.com/download
2. Instalarlo y ejecutar:
   ```powershell
   ollama serve
   ollama pull llama3.1:8b
   ```
3. En `.env` cambiar:
   ```
   OLLAMA_HOST=localhost
   ```

## Después de verificar conexión

```bash
# Test rápido
cd c:\Users\paparinots\Documents\Kabbalah\scripts
python test_ollama_connection.py

# Si pasa la prueba, procesar 1 video de prueba
python enhanced_content_extractor.py --input "..\transcripciones\Secretos_del_Zohar" --limit 1

# Si funciona, procesar todo
python process_with_ollama_remote.py
```
