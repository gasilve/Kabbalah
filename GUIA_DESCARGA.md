# Guía: Cómo Completar la Descarga de Subtítulos

## ✅ Estado Actual
- **Descargados:** 31 videos de 100
- **Pendientes:** 69 videos
- **Carpeta:** `transcripciones/Secretos_del_Zohar/`

## 🚨 Problema Encontrado
YouTube bloquea la IP cuando intentamos descargar muchos videos seguidos de forma automática.

## 💡 Solución: Descarga en Lotes Pequeños

He creado un script que descarga **5-10 videos a la vez**.

### 📝 Cómo Usar

#### Opción 1: Lotes de 10 videos (Recomendado)
```bash
python download_batch.py
```

Este script:
- Descarga 10 videos automáticamente
- Se detiene solo
- Muestra tu progreso

**Para completar los 69 restantes:**
1. Ejecuta el script
2. Espera 30-60 minutos
3. Ejecuta el script de nuevo
4. Repite 7 veces más hasta completar

#### Opción 2: Cambiar tamaño del lote

Edita el archivo `download_batch.py` y cambia la línea:
```python
BATCH_SIZE = 10  # Cambia este número
```

Valores sugeridos:
- `5` = Muy seguro, más ejecuciones necesarias
- `10` = Balanceado (recomendado)
- `15` = Más rápido pero más riesgo de bloqueo

### ⏱️ Tiempo Estimado

**Para completar los 69 videos restantes:**
- Con lotes de 10: ~7 ejecuciones en 1-2 días
- Tiempo por lote: ~3-4 minutos
- Pausa recomendada: 30-60 minutos entre ejecuciones

## 📊 Seguimiento de Progreso

El script siempre muestra:
```
📊 Estado actual:
  Total: 100 videos
  ✓ Descargados: 31
  ⏳ Pendientes: 69
```

## 🎯 Próximos Pasos

### Paso 1: Completar los 100 actuales
Ejecuta `python download_batch.py` varias veces hasta completar

### Paso 2: Obtener los 67 videos faltantes
Una vez completemos los 100, tenemos que:
1. Extraer la lista completa de 167 videos de la playlist
2. Identificar cuáles nos faltan
3. Descargar los 67 restantes

## 🛠️ Scripts Disponibles

### `download_batch.py` ⭐ (USAR ESTE)
- Descarga en lotes pequeños
- Seguro y confiable
- Fácil de usar

### `download_slow_safe.py`
- Descarga todo de una vez (MUY lento)
- Pausas largas
- Solo usar si quieres dejarlo corriendo toda la noche

### `download_all_subtitles.py`
- Descarga rápida (BLOQUEA RÁPIDO)
- No recomendado por ahora

## 💾 Archivos Descargados

Cada clase tiene 2 archivos:

### `.json` - Formato estructurado
```json
{
  "metadata": {
    "video_title": "...",
    "duration_minutes": 67.4,
    "total_words": 6264
  },
  "transcript": [
    {"text": "...", "start": 3.5, "duration": 2.1}
  ]
}
```

### `.txt` - Formato legible
```
[00:03] Le vamos a echar valor porque
[00:06] vamos a iniciar un Shiur sobre el Zohar
...
```

## ❓ ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que estés en la carpeta correcta: `cd C:\Users\paparinots\Documents\Kabbalah`
2. Verifica que Python esté instalado: `python --version`
3. Si hay errores, revisa los archivos `ERROR_*.txt` en la carpeta de transcripciones

## 🎉 Una Vez Completado

Cuando tengamos los 100 videos:
- Veremos cuántos tienen contenido válido
- Buscaremos los 67 faltantes
- Continuaremos con las otras playlists (Tefila, Árbol de la Vida, etc.)
