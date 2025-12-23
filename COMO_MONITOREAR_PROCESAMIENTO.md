# Cómo Monitorear el Procesamiento de Playlists

## 🚀 Proceso en Ejecución

El **Master Playlist Processor** está corriendo en background procesando todas las playlists.

**Tiempo estimado total:** ~16-17 horas  
**Finalización estimada:** 2025-12-11 18:17:47

---

## 📊  Monitorear Progreso

### Opción 1: Ver Logs en Tiempo Real (PowerShell)

```powershell
# Desde la carpeta Kabbalah
cd c:\Users\paparinots\Documents\Kabbalah

# Ver las últimas 50 líneas del log y seguir actualizaciones
Get-Content logs\master_processor_*.log -Tail 50 -Wait
```

**Presiona `Ctrl+C` para salir del monitoreo sin detener el proceso.**

### Opción 2: Ver Última Actualización del Log

```powershell
# Ver solo las últimas líneas sin seguir
Get-Content logs\master_processor_*.log -Tail 30
```

### Opción 3: Verificar Archivos Procesados

```powershell
# Ver cuántos archivos se han procesado con IA
Get-ChildItem contenido_procesado -Filter *_extracted.json | Measure-Object

# Ver los más recientes
Get-ChildItem contenido_procesado -Filter *_extracted.json | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 10 Name, LastWriteTime
```

---

## 🎯 Estado de las Fases

### FASE 1: Descarga de Subtítulos (YOUTUBE)

| Playlist | Videos Total | Pendientes | Estado |
|----------|--------------|------------|--------|
| Sefer Yetzirah | 19 | ~14 | 🔄 En progreso |
| Tefilá | 48 | ~47 | 🔄 En progreso |
| Árbol de la Vida | 64 | 64 | ⏳ Próximo |
| Secretos del Zohar | 167 | ~162 | ⏳ Próximo |

**Tiempo estimado FASE 1:** 2-4 horas

### FASE 2: Procesamiento con IA (DeepSeek)

Comenzará automáticamente después de completar la Fase 1.

**Tiempo estimado FASE 2:** 10-14 horas

---

## ⚠️ Qué Hacer si el Proceso se Detiene

El script tiene **reintentos automáticos**, pero si necesitas intervenir:

### Verificar que está corriendo

```powershell
Get-Process python
```

Si no ves procesos de Python, el script se detuvo.

### Reiniciar el Proceso

```powershell
cd c:\Users\paparinots\Documents\Kabbalah
python master_playlist_processor.py
```

**El script es inteligente:**
- Se salta videos ya descargados
- Resume desde donde quedó
- No duplica trabajo

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `logs/master_processor_FECHA.log` | Log completo del proceso |
| `download_progress.json` | Tracking de descargas de YouTube |
| `transcripciones/[playlist]/` | Sub títulos descargados (JSON) |
| `contenido_procesado/` | Contenido procesado con IA (JSON) |

---

## 🔥 Comandos Útiles

### Ver Procesos de Python Activos

```powershell
Get-Process python | Format-Table Id, ProcessName, CPU, StartTime
```

### Ver Consumo de CPU/Memoria

```powershell
Get-Process python | Sort-Object CPU -Descending | Select-Object -First 5
```

### Verificar Espacio en Disco

```powershell
Get-PSDrive C | Select-Object Used, Free
```

---

## ✅ Criterios de Éxito

El proceso habrá terminado exitosamente cuando:

1. ✓ Todas las playlists muestren "ya está completamente descargado"
2. ✓ Todas las playlists muestren "ya está completamente procesado"
3. ✓ El log final diga "Master Playlist Processor finalizado exitosamente"
4. ✓ Veas ~298 archivos en `contenido_procesado/`

---

## 💡 Consejos

- **No cierres** la ventana de PowerShell donde corre el proceso
- **Puedes cerrar esta sesión** de Gemini - el proceso seguirá corriendo
- **El proceso es seguro** de dejar corriendo toda la noche
- **Los datos se guardan continuamente** - no se pierde progreso

---

## 🆘 Soporte

Si algo sale mal, revisa estos logs:
1. `logs/master_processor_FECHA.log` - Log principal
2. Mensajes de error en la consola
3. Archivos `ERROR_*.txt` en carpetas de transcripciones

**Para reportar un error, incluye:**
- Últimas 100 líneas del log
- Mensaje de error completo
- Hora aproximada cuando ocurrió
