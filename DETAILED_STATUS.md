# 📊 Reporte Detallado de Estado - Kabbalah App
**Generado:** 2025-12-17 10:45

## 📈 Resumen General

| Playlist | Total | Descargados | Sin Subs | Procesados IA | % Completado |
|----------|-------|-------------|----------|---------------|--------------|
| arbol_vida | 64 | 64 | 0 | 0 | 0% |
| sefer_yetzirah | 19 | 12 | 7 | 12 | 63% |
| tefila | 48 | 47 | 1 | 45 | 93% |
| puertas_luz | 16 | 0 | 0 | 0 | 0% |
| shir_hashirim | 21 | 0 | 0 | 0 | 0% |
| nombres_72 | 8 | 0 | 1 | 0 | 0% |
| letras_hebreas | 16 | 0 | 0 | 0 | 0% |
| secretos_zohar | 167 | 103 | 0 | 26 | 15% |
| **TOTAL** | **359** | **226** | **9** | **83** | **23%** |

## ⚠️ ALERTA: Problemas en Procesamiento IA
El proceso de extracción con IA para `secretos_zohar` (usando servidor remoto Ollama) presenta **fallos masivos por timeout**.
- **Archivos Intentados:** 19
- **Exitosos:** 1 (Video 011_Kabbalah... re-procesado)
- **Fallidos:** 18 (Timeouts y errores de conexión JSON)
- **Estado Actual:** El proceso ha sido detenido para evitar consumo inútil de recursos. Se requiere optimización del script (skip existing, timeout handling).

## 📁 SECCION: PROCESAMIENTO ACTIVO

### 🔄 Secretos del Zohar (Whisper Integration)
Se han recuperado 71 transcripciones generadas por Whisper (JSON) desde el servidor remoto (`192.168.100.21`).
- **Ubicación:** `transcripciones/secretos_zohar/*.json`
- **Estado:** ✅ DESCARGADO | ❌ ERROR EN PROCESAMIENTO IA

---

## 📁 ARBOL_VIDA (64 videos)
- **Estado:** 64 subtítulos descargados. Pendiente de procesar con IA.

## 📁 SECRETOS_ZOHAR (167 videos)
**Actualización:** 71 videos recuperados vía Whisper.

| # | ID | Título | Descarga | IA |
|---|----|--------|----------|----|
| 1-25 | ... | ... | ✅ DOWNLOADED | ✅ PROCESSED |
| 27-167 | ... | Offline Record | ✅ WHISPER | ⚠️ FAILED (Timeout) |

*(Ver logs para más detalles)*
