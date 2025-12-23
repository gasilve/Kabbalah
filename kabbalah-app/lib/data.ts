import contentData from '../data/content.json';

export type Intention = {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    icono: string;
    color: string;
    contenido_relacionado: string[];
};

export type Meditation = {
    id: string;
    titulo: string;
    video_id: string;
    video_title: string;
    duracion_minutos: number;
    descripcion: string;
    intenciones: string[];
    color_ui: string;
    icono: string;
    instrucciones_completas?: string;
    nombres_divinos?: {
        nombre: string;
        hebreo: string;
        tipo: string;
        rol: string;
        timestamp: number;
    }[];
    letras_hebreas?: {
        secuencia: string;
        nombres: string[];
        transliteracion: string;
        proposito: string;
        visualizacion?: string;
        timestamp: number;
    }[];
    conceptos?: {
        termino: string;
        hebreo?: string;
        definicion: string;
        tipos?: string[];
        relacion?: string;
        uso_meditacion?: string;
        poder?: string;
    }[];
    experiencias_compartidas?: {
        experiencia: string;
        contexto?: string;
        timestamp: number;
    }[];
};

export type DivineName = {
    id: string;
    nombre: string;
    hebreo: string;
    tipo: string;
    descripcion: string;
    cuando_usar: string[];
    color: string;
    fuente?: string[];
};

export const getIntentions = (): Intention[] => {
    return contentData.intenciones;
};

export const getMeditations = (): Meditation[] => {
    return contentData.meditaciones;
};

export const getMeditationById = (id: string): Meditation | undefined => {
    return contentData.meditaciones.find(m => m.id === id);
};

export const getDivineNames = (): DivineName[] => {
    return contentData.nombres_divinos_catalogo;
};

export const getMeditationsByIntention = (intentionSlug: string): Meditation[] => {
    return contentData.meditaciones.filter(m => m.intenciones.includes(intentionSlug));
};
