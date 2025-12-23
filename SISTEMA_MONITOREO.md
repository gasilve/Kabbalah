# Sistema de Monitoreo Automático - Documentación

## 🔧 Problema Resuelto

**Error original:** El procesamiento falló después de 38 minutos debido a un error de encoding de Windows (cp1252) que no podía manejar emojis en los `print()` statements.

**Solución implementada:**
1. ✅ Agregado soporte UTF-8 explícito para Windows
2. ✅ Eliminados TODOS los emojis de `extract_content_ai.py`
3. ✅ Creado sistema de monitoreo automático (watchdog)

---

## 🤖 Watchdog Monitor - Sistema Automático

### Archivo: `watchdog_monitor.py`

**Funcionalidad:**
- Verifica cada 5 minutos que el proceso esté corriendo
- Cuenta archivos procesados para detectar progreso
- Auto-reinicia el proceso si detecta fallo (después de 2 verificaciones)
- Genera logs detallados en `logs/watchdog.log`

### Cómo Usar el Watchdog

#### Opción 1: Modo Automático (Con Auto-Restart)
```powershell
cd c:\Users\paparinots\Documents\Kabbalah
python watchdog_monitor.py
```

El watchdog:
- ✅ Verificará cada 5 minutos
- ✅ Reiniciará automáticamente si el proceso fall a
- ✅ Registrará todo en `logs/watchdog.log`

#### Opción 2: Modo Solo Notificación (Sin Auto-Restart)

Edita `watchdog_monitor.py` línea 12:
```python
AUTO_RESTART = False  # Cambiar a False
```

Luego ejecuta:
```powershell
python watchdog_monitor.py
```

En este modo:
- ✅ Solo notificará si el proceso se detiene
- ❌ NO reiniciará automáticamente
- ℹ️ Te dirá el comando para reiniciar manualmente

---

## 📊 Estado Actual

### Proceso Principal
- **Estado:** ✅ CORRIENDO
- **Inicio:** 2025-12-11 10:49:12
- **Fase actual:** FASE 1 - Descarga de subtítulos
- **Finalización estimada:** 2025-12-12 03:44:12  (~17 horas)
- **Log:** `logs/master_processor_20251211_104912.log`

### Cambios Implementados
1. **Encoding UTF-8:** Script ahora funciona correctamente en Windows
2. **Sin emojis:** Todos los `print()` usan texto ASCII seguro
3. **Watchdog:** Monitor automático con auto-restart

---

## 🔍 Cómo Monitorear

### Ver Log del Proceso Principal
```powershell
Get-Content logs\master_processor_20251211_104912.log -Tail 50 -Wait
```

### Ver Log del Watchdog (si lo activaste)
```powershell
Get-Content logs\watchdog.log -Tail 50 -Wait
```

### Verificar Archivos Procesados
```powershell
Get-ChildItem contenido_procesado -Filter *_extracted.json | Measure-Object
```

### Ver Procesos Python Activos
```powershell
Get-Process python
```

---

## ⚠️ Qué Hace si Detecta un Error

### Sin Watchdog:
1. El proceso se detiene
2. Debes revisar manualmente los logs
3. Reiniciar manualmente: `python master_playlist_processor.py`

### Con Watchdog (AUTO_RESTART=True):
1. Detecta que el proceso se detuvo (después de 2 checks = 10 minutos)
2. Reinicia automáticamente el proceso
3. Registra el evento en `logs/watchdog.log`
4. Continúa monitoreando

### Con Watchdog (AUTO_RESTART=False):
1. Detecta que el proceso se detuvo
2. Te notifica en los logs
3. Te dice el comando exacto para reiniciar
4. Continúa verificando

---

## 📁 Archivos del Sistema de Monitoreo

| Archivo | Propósito |
|---------|-----------|
| `master_playlist_processor.py` | Proceso principal (CORREGIDO) |
| `scripts/extract_content_ai.py` | Extracción con IA (CORREGIDO) |
| `watchdog_monitor.py` | Monitor automático (NUEVO) |
| `logs/master_processor_*.log` | Logs del proceso principal |
| `logs/watchdog.log` | Logs del monitor (si está activo) |

---

## ✅ Verificación de Correcciones

### Errores Corregidos:
1. ✅ `UnicodeEncodeError` en línea 523 (📂 emoji)
2. ✅ Todos los demás emojis problema áticos (🤖📊✓✗💾📹🧪⏸️🎯🎉)
3. ✅ Falta de declaración UTF-8 en el script

### Cambios Aplicados:
```python
# Agregado al inicio del script:
# -*- coding: utf-8 -*-
import sys
import os

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
```

### Ejemplos de Reemplazos:
- `🤖 Procesando...` → `[AI] Procesando...`
- `📂 Playlist` → `[PLAYLIST] Procesando:`
- `✓ Extraído` → `[OK] Extraido`
- `💾 Guardado` → `[SAVED] Guardado`

---

## 🚀 Próximos Pasos Recomendados

### 1. Dejar Corriendo (Recomendado)
El proceso ahora debería completarse sin problemas. Simplemente déjalo corriendo.

### 2. Activar Watchdog (Opcional pero Recomendado)
En una nueva terminal PowerShell:
```powershell
cd c:\Users\paparinots\Documents\Kabbalah
python watchdog_monitor.py
```

Esto te dará tranquilidad total - si algo falla, se reiniciará automáticamente.

### 3. Verificar Mañana
Después de ~17 horas (mañana ~4 AM), verifica:
```powershell
# Ver si terminó
Get-Content logs\master_processor_20251211_104912.log -Tail 100

# Contar archivos procesados
Get-ChildItem contenido_procesado -Filter *_extracted.json | Measure-Object

# Deberías ver ~298 archivos
```

---

## 💡 Consejos

1. **No cierres la ventana de PowerShell** donde corre el proceso principal
2. **Puedes activar el watchdog en otra ventana** para mayor seguridad
3. **Puedes cerrar esta conversación** - el proceso seguirá corriendo
4. **Los logs están guardados** - puedes revisar qué pasó en cualquier momento

---

**Resumen:** Sistema robusto con auto-monitoreo implementado. El procesamiento debería completarse exitosamente en ~17 horas.
