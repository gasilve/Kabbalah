import fs from 'fs';
import path from 'path';

// Definición de tipos
export interface VideoMetadata {
    titulo: string;
    video_id: string;
    duracion_minutos: number;
    tipo: string;
}

export interface Meditacion {
    titulo: string;
    descripcion: string;
    instrucciones: string;
    timestamp_inicio: number;
    timestamp_fin: number;
    nombres_divinos_usados: string[];
    proposito: string[];
    video_id?: string;
    video_title?: string;
}

export interface NombreDivino {
    nombre_hebreo: string;
    transliteracion: string;
    tipo: string;
    descripcion: string;
    cuando_usar: string[];
    video_id?: string;
    video_title?: string;
}

export interface Concepto {
    termino: string;
    hebreo?: string;
    definicion: string;
    explicacion: string;
    video_id?: string;
    video_title?: string;
    timestamp?: number;
}

export interface Revelacion {
    titulo: string;
    revelation: string; // Mapeado de 'explicacion' o 'definicion' si es profundo
    parasha: string;
    level: 'principiante' | 'intermedio' | 'avanzado';
    themes: string[];
    biblical_ref?: string;
    video_id: string;
    video_title: string;
    timestamp: number;
    source: string;
}

export interface QA {
    question: string;
    answer: string;
    category: string;
    video_id: string;
    video_title: string;
    timestamp: number;
    keywords: string[];
}

// Ruta a los archivos procesados (ajustar para producción si es necesario)
// En desarrollo, leemos directamente del sistema de archivos local
const PROCESSED_DIR = path.join(process.cwd(), '..', 'contenido_procesado');

class DataService {
    private cache: any = null;

    constructor() {
        // Intentar cargar caché inicial si existe
    }

    // Leer todos los archivos JSON procesados
    private getFiles() {
        try {
            if (!fs.existsSync(PROCESSED_DIR)) {
                console.warn(`Directorio no encontrado: ${PROCESSED_DIR}`);
                return [];
            }
            return fs.readdirSync(PROCESSED_DIR).filter(file => file.endsWith('_extracted.json'));
        } catch (error) {
            console.error("Error leyendo directorio de contenido:", error);
            return [];
        }
    }

    // Cargar y unificar todos los datos
    getAllData() {
        if (this.cache) return this.cache;

        const files = this.getFiles();
        const allData = {
            meditaciones: [] as Meditacion[],
            nombres_divinos: [] as NombreDivino[],
            conceptos: [] as Concepto[],
            revelaciones: [] as Revelacion[],
            qa: [] as QA[]
        };

        files.forEach(file => {
            try {
                const filePath = path.join(PROCESSED_DIR, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                const meta = data.metadata;

                // Procesar Meditaciones
                if (data.meditaciones) {
                    data.meditaciones.forEach((m: any) => {
                        allData.meditaciones.push({
                            ...m,
                            video_id: meta.video_id,
                            video_title: meta.titulo
                        });
                    });
                }

                // Procesar Nombres Divinos
                if (data.nombres_divinos) {
                    data.nombres_divinos.forEach((n: any) => {
                        allData.nombres_divinos.push({
                            ...n,
                            video_id: meta.video_id,
                            video_title: meta.titulo
                        });
                    });
                }

                // Procesar Conceptos como Q&A y Revelaciones
                if (data.conceptos) {
                    data.conceptos.forEach((c: any) => {
                        // Agregar a conceptos generales
                        allData.conceptos.push({
                            ...c,
                            video_id: meta.video_id,
                            video_title: meta.titulo
                        });

                        // Convertir a Q&A
                        allData.qa.push({
                            question: `¿Qué es ${c.termino}?`,
                            answer: c.definicion + (c.explicacion ? ` ${c.explicacion}` : ''),
                            category: "Conceptos de Kabbalah",
                            video_id: meta.video_id,
                            video_title: meta.titulo,
                            timestamp: 0, // Default, idealmente vendría del JSON
                            keywords: [c.termino, ...(c.referencias_cruzadas || [])]
                        });

                        // Si tiene explicación larga, convertir a Revelación potencial
                        if (c.explicacion && c.explicacion.length > 100) {
                            allData.revelaciones.push({
                                titulo: `El secreto de ${c.termino}`,
                                revelation: c.explicacion,
                                parasha: "General", // TODO: Extraer de título si es posible
                                level: "intermedio",
                                themes: [c.termino],
                                video_id: meta.video_id,
                                video_title: meta.titulo,
                                timestamp: 0,
                                source: "Zohar"
                            });
                        }
                    });
                }

            } catch (e) {
                console.error(`Error procesando archivo ${file}:`, e);
            }
        });

        this.cache = allData;
        return allData;
    }

    // Getters específicos
    getMeditaciones() { return this.getAllData().meditaciones; }
    getNombresDivinos() { return this.getAllData().nombres_divinos; }
    getRevelaciones() { return this.getAllData().revelaciones; }
    getQA() { return this.getAllData().qa; }

    // Buscar globalmente
    search(query: string) {
        const data = this.getAllData();
        const q = query.toLowerCase();

        return {
            meditaciones: data.meditaciones.filter((m: Meditacion) =>
                m.titulo.toLowerCase().includes(q) || m.proposito.some((p: string) => p.includes(q))
            ),
            conceptos: data.conceptos.filter((c: Concepto) =>
                c.termino.toLowerCase().includes(q) || c.definicion.toLowerCase().includes(q)
            ),
            revelaciones: data.revelaciones.filter((r: Revelacion) =>
                r.titulo.toLowerCase().includes(q) || r.revelation.toLowerCase().includes(q)
            )
        };
    }
}

export const dataService = new DataService();
