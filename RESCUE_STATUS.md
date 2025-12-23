# 🚑 Reporte de Operación de Rescate - Subtítulos Críticos

**Fecha:** 2025-12-22
**Estado General:** 🔄 En Progreso (Transcripción Remota)

## 📋 Resumen de Archivos

Se han identificado **11 archivos críticos** faltantes.
- **10 Archivos** fueron recuperados exitosamente (MP3 local) y están siendo procesados en el servidor Whisper.
- **1 Archivo** no pudo ser recuperado por ser PRIVADO.

### 🔴 Fallidos (Requiere Acción Manual)
| Playlist | Video ID | Título/Error | Acción Requerida |
|----------|----------|--------------|------------------|
| Letras Hebreas | `6mRl5wsqPhs` | ❌ [Private video] | Descargar manualmente o proporcionar Cookies |

### 🟢 En Proceso (Servidor Remoto)
Los siguientes archivos han sido subidos al servidor (`192.168.100.21`) y se están transcribiendo actualmente:

**Sefer Yetzirah:**
1. Clase 3 (`iK6Uz6KjJVo`)
2. Clase 4 (`ki9E5c0CTug`)
3. Clase 5 (`aA7ba_FWnwY`)
4. Clase 6 (`xMB7KkjGp-k`)
5. Clase 8 (`T4waX0ZgkdY`)
6. Clase 9 (`0IWsTxx9TSs`)
7. Clase 13 (`AA9WCAwde28`)
8. Clase 18 (`b4SHIFkmOcU`)

**Tefilá:**
1. Clase 38 (`KJM7ociVLog`)

**Nombres 72:**
1. Libro Meditaciones (`wlEtY3fphjY`)

## ⚙️ Estado Técnico
- **MP3s Locales:** Verificados y sincronizados.
- **Proceso Remoto:** Whisper está corriendo (PID detectado).
- **Tiempo Estimado:** ~2 horas (dependiendo de la cola del servidor).

## 📥 Pasos Siguientes
Una vez finalice la transcripción en el servidor, ejecuta el siguiente comando para descargar los resultados automáticamente. El script es inteligente y solo descargará lo nuevo:

```bash
python scripts/process_critical_missing.py
```

Esto descargará los `.json` y `.srt` y los colocará en las carpetas correspondientes:
- `transcripciones/tefila/`
- `transcripciones/sefer_yetzirah/`
- etc.
