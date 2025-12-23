# Estado de Procesos en Background - Kabbalah App

**Última actualización:** ${new Date().toLocaleString('es-ES', { timeZone: 'America/Argentina/Buenos_Aires' })}

---

## 🔄 Procesos Activos (MODO SUPERVISOR 🤖)

### 1. Supervisor de Procesos (Watchdog)
**Estado:** ✅ **ACTIVO Y MONITOREANDO**
- **Función:** Ejecuta secuencialmente descarga de audio, subtítulos y procesamiento de IA.
- **Resiliencia:** Si un proceso falla (ej. rate limit de YouTube), espera 60 segundos y reintenta automáticamente.
- **Comando:** `python process_supervisor.py`

### Módulos gestionados por el Supervisor:

#### A. Descarga de Audio Hebreo 🎵
- **Estado:** Gestionado automáticamente.
- **Prioridad:** 1

#### B. Descarga de Subtítulos de YouTube 📥
- **Estado:** Gestionado automáticamente.
- **Playlist:** Todas las pendientes (Secretos del Zohar, etc.)
- **Comportamiento:** Se pausará y reanudará automáticamente según límites de API.

#### C. Procesamiento con IA (Ollama) 🤖
- **Estado:** Gestionado automáticamente.
- **Comportamiento:** Iniciará cuando las descargas necesarias estén listas.

---

## 📊 Resumen de Playlists

| Playlist | Total Videos | Descargados | Procesados IA | Estado |
|----------|-------------|-------------|---------------|--------|
| **Secretos del Zohar** | 167 | 31 | 24 | 🤖 Supervisado |
| **Árbol de la Vida** | 64 | 65 | 0 | 🤖 Supervisado |
| **Sefer Yetzirah** | 19 | 12 | 0 | 🤖 Supervisado |
| **Tefilá** | 48 | 47 | 0 | 🤖 Supervisado |

---

## 🎯 Próximos Pasos Automáticos

### Prioridad Alta (En ejecución)
1. ✅ Completar descarga de audio hebreo (~15 mins)
2. 🔄 Continuar descarga de Secretos del Zohar (~4-6 horas)

### Prioridad Media (Pendiente)
3. ⏸️ Descargar videos faltantes de Sefer Yetzirah (7 videos)
4. ⏸️ Descargar video faltante de Tefilá (1 video)
5. ⏸️ Procesar con IA: Secretos del Zohar (76 videos pendientes)
6. ⏸️ Procesar con IA: Árbol de la Vida (65 videos)
7. ⏸️ Procesar con IA: Sefer Yetzirah (12 videos)
8. ⏸️ Procesar con IA: Tefilá (47 videos)

---

## 🛠️ Scripts Creados

### Nuevos Scripts de Automatización
1. **`process_all_playlists.py`** - Procesa múltiples playlists con IA secuencialmente
2. **`download_pending_playlists.py`** - Descarga subtítulos de playlists pendientes

### Scripts Corregidos
1. **`scripts/download_hebrew_audio.py`** - Corregido código de idioma hebreo

---

## ⚡ Cómo Verificar los Procesos

### Ver procesos activos en PowerShell:
```powershell
# Ver todos los procesos de Python
Get-Process python

# Ver salida de logs (si existen)
Get-Content download_log.txt -Tail 20 -Wait
```

### Verificar progreso de descargas:
```powershell
# Ver archivos descargados recientemente
Get-ChildItem transcripciones\Secretos_del_Zohar -Filter *.json | 
  Sort-Object LastWriteTime -Descending | 
  Select-Object -First 5 Name, LastWriteTime
```

### Verificar procesamiento IA:
```powershell
# Ver archivos procesados recientemente
Get-ChildItem contenido_procesado -Filter *_extracted.json | 
  Sort-Object LastWriteTime -Descending | 
  Select-Object -First 5 Name, LastWriteTime
```

---

## 📝 Notas Importantes

### Rate Limiting de YouTube
- YouTube bloquea después de ~30 videos consecutivos
- El script pausa automáticamente 2 minutos cuando detecta bloqueo
- Pausas adicionales cada 10 y 30 videos para prevenir bloqueos

### Procesamiento con IA (Ollama)
- Requiere Ollama corriendo en `http://127.0.0.1:11434`
- Modelo: `llama3.1:8b`
- Tiempo: ~2-3 minutos por video
- Los procesos se ejecutan secuencialmente para evitar sobrecarga

### Audio Hebreo
- Usa Google TTS (gtts) con código de idioma `iw`
- Descarga: 22 letras + 5 nombres divinos + 4 oraciones
- Fallback a Wikimedia Commons si gtts falla

---

## 🎨 Tareas Pendientes (UI/UX)

Estas tareas requieren intervención manual:

- [ ] Páginas de Q&A, Revelaciones, Tefilá
- [ ] Autenticación opcional (Google OAuth)
- [ ] Sistema de progreso de usuario
- [ ] Optimizaciones UI/UX
  - [ ] Mejorar animaciones
  - [ ] Optimizar carga de imágenes
  - [ ] Mejorar responsive design

---

**💡 Tip:** Los procesos en background continuarán ejecutándose. Puedes cerrar esta ventana y los procesos seguirán corriendo.
