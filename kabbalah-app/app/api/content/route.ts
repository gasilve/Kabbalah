export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const query = searchParams.get('q');

        // Filtros específicos
        const intencion = searchParams.get('intencion');
        const simbolo = searchParams.get('simbolo');
        const categoria = searchParams.get('categoria');
        const problema = searchParams.get('problema');
        const nivel = searchParams.get('nivel');

        const db = await getDatabase();

        // Búsqueda global
        if (query) {
            const [meditaciones, preguntas, simbolos, revelaciones] = await Promise.all([
                db.collection('meditaciones').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('preguntas').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('glosario').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('revelaciones').find({ $text: { $search: query } }).limit(10).toArray(),
            ]);

            return NextResponse.json({
                meditaciones,
                preguntas,
                simbolos,
                revelaciones
            });
        }

        // Consultas por tipo
        if (type) {
            let filter: any = {};

            // Aplicar filtros según el tipo
            if (intencion) filter.intenciones = intencion;
            if (nivel) filter.nivel = nivel;
            if (categoria) filter.categoria = categoria;
            if (problema) filter.problemas_que_resuelve = problema;

            switch (type) {
                case 'meditaciones':
                    const meditaciones = await db.collection('meditaciones').find(filter).toArray();
                    return NextResponse.json(meditaciones);

                case 'glosario':
                    if (simbolo) filter.simbolo = new RegExp(simbolo, 'i');
                    const simbolos = await db.collection('glosario').find(filter).toArray();
                    return NextResponse.json(simbolos);

                case 'revelaciones':
                    if (nivel) filter.nivel_profundidad = nivel;
                    const revelaciones = await db.collection('revelaciones').find(filter).toArray();
                    return NextResponse.json(revelaciones);

                case 'qa':
                case 'preguntas':
                    const preguntas = await db.collection('preguntas').find(filter).toArray();
                    return NextResponse.json(preguntas);

                case 'clases':
                    const clases = await db.collection('clases').find(filter).toArray();
                    return NextResponse.json(clases);

                default:
                    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
            }
        }

        // Sin parámetros, devolver resumen
        const [totalMeditaciones, totalPreguntas, totalSimbolos] = await Promise.all([
            db.collection('meditaciones').countDocuments(),
            db.collection('preguntas').countDocuments(),
            db.collection('glosario').countDocuments(),
        ]);

        return NextResponse.json({
            stats: {
                meditaciones: totalMeditaciones,
                preguntas: totalPreguntas,
                simbolos: totalSimbolos
            }
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
