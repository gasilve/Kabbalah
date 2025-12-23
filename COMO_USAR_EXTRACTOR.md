# Guía de Uso: Script de Extracción con IA

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
pip install openai python-dotenv
```

### 2. Configurar API Key de OpenAI

**Opción A: Variable de Entorno (Recomendado)**
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="tu-api-key-aqui"

# O agregar a .env
echo OPENAI_API_KEY=tu-api-key-aqui > .env
```

**Opción B: Hardcoded (Solo para pruebas)**
Edita `extract_content_ai.py` y reemplaza:
```python
client = OpenAI(api_key="tu-api-key-aqui")
```

### 3. Obtener API Key

1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Copia y guárdala

**Costo Estimado:**
- GPT-4 Turbo: ~$0.01 por video
- Total para 31 videos: ~$0.30 USD

---

## 📋 Uso del Script

### Modo Prueba (3 videos)

```bash
python extract_content_ai.py 3
```

Esto procesará solo los primeros 3 videos para validar que todo funciona.

### Procesar Todos los Videos

```bash
python extract_content_ai.py
```

---

## 📁 Salida del Script

El script crea:

```
contenido_procesado/
├── 001_Kabbalah_ Secretos del Zohar - clase 1_extracted.json
├── 002_Kabbalah_ Secretos del Zohar - clase 2_extracted.json
├── ...
└── _RESUMEN_GENERAL.json
```

### Estructura de Cada Archivo

```json
{
  "metadata": {
    "titulo": "Kabbalah: Secretos del Zohar - clase 1",
    "video_id": "_gdJDqEgW7g",
    "duracion_minutos": 67.45,
    "tipo": "ensenanza"
  },
  "meditaciones": [
    {
      "titulo": "Meditación de...",
      "descripcion": "...",
      "instrucciones": "Texto completo...",
      "timestamp_inicio": 120.5,
      "timestamp_fin": 180.0,
      "nombres_divinos_usados": ["Metatron"],
      "proposito": ["transformacion"],
      "letras_hebreas": [...]
    }
  ],
  "nombres_divinos": [...],
  "letras_hebreas": [...],
  "conceptos": [...],
  "intenciones_principales": ["sabiduria", "conexion"]
}
```

---

## ⏱️ Tiempo Estimado

- **3 videos (prueba)**: ~5-10 minutos
- **31 videos (completo)**: ~45-60 minutos

Incluye pausas de 2 segundos entre requests para evitar rate limiting.

---

## 🔍 Validación de Resultados

Después de procesar 3 videos, revisa:

1. **Calidad de extracción**: ¿GPT-4 identificó correctamente las meditaciones?
2. **Nombres divinos**: ¿Están bien extraídos?
3. **Letras hebreas**: ¿Están en UTF-8 correctamente?
4. **Conceptos**: ¿Las definiciones tienen sentido?

Si todo se ve bien, procesa los 31 videos completos.

---

## ❓ Solución de Problemas

### Error: "No se encontró OPENAI_API_KEY"
→ Configura la variable de entorno (ver arriba)

### Error: "Rate limit exceeded"
→ El script ya tiene pausas de 2s, pero si aún falla, aumenta la pausa en línea ~250

### Error: JSON inválido
→ GPT-4 a veces devuelve texto extra. El script usa `response_format` para forzar JSON

### Caracteres hebreos se ven mal
→ Asegúrate de que tu editor/consola use UTF-8

---

## 📊 Próximos Pasos

Una vez procesados los 31 videos:

1. ✅ Revisar `_RESUMEN_GENERAL.json`
2. ✅ Validar algunos archivos extraídos
3. ✅ Crear base de datos en Supabase
4. ✅ Importar contenido
5. ✅ Empezar desarrollo de la app Next.js

---

## 💡 Tips

- **Primera vez**: Procesa solo 3 videos para validar
- **API Key**: No la compartas ni la subas a Git
- **Pausas**: Si tienes plan pago de OpenAI, puedes reducir las pausas
- **Calidad**: GPT-4 Turbo es muy bueno, pero siempre revisa algunos resultados

---

## 🎯 Listo para Empezar

```bash
# 1. Configura API key
$env:OPENAI_API_KEY="sk-..."

# 2. Prueba con 3 videos
python extract_content_ai.py 3

# 3. Si todo bien, procesa todos
python extract_content_ai.py
```

¡Listo! 🚀
