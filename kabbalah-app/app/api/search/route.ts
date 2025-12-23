import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
        }

        const db = await getDatabase();

        // Búsqueda en múltiples colecciones
        const [meditaciones, preguntas, simbolos, revelaciones, clases] = await Promise.all([
            db.collection('meditaciones').find(
                { $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(5).toArray(),

            db.collection('preguntas').find(
                { $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(5).toArray(),

            db.collection('glosario').find(
                { $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(5).toArray(),

            db.collection('revelaciones').find(
                { $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(5).toArray(),

            db.collection('clases').find(
                { $text: { $search: query } },
                { score: { $meta: 'textScore' } }
            ).sort({ score: { $meta: 'textScore' } }).limit(5).toArray(),
        ]);

        return NextResponse.json({
            results: {
                meditaciones: meditaciones.map(m => ({ ...m, type: 'meditacion' })),
                preguntas: preguntas.map(p => ({ ...p, type: 'pregunta' })),
                simbolos: simbolos.map(s => ({ ...s, type: 'simbolo' })),
                revelaciones: revelaciones.map(r => ({ ...r, type: 'revelacion' })),
                clases: clases.map(c => ({ ...c, type: 'clase' }))
            },
            total: meditaciones.length + preguntas.length + simbolos.length + revelaciones.length + clases.length
        });
    } catch (error) {
        console.error('Error in search:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
