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

        if (query) {
            const [meditaciones, preguntas, conceptos, clases] = await Promise.all([
                db.collection('meditaciones').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('preguntas').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('conceptos').find({ $text: { $search: query } }).limit(10).toArray(),
                db.collection('clases').find({ $text: { $search: query } }).limit(10).toArray(),
            ]);

            return NextResponse.json({
                meditaciones,
                preguntas,
                conceptos,
                clases
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
                    const pageMed = parseInt(searchParams.get('page') || '1');
                    const limitMed = parseInt(searchParams.get('limit') || '20');
                    const skipMed = (pageMed - 1) * limitMed;
                    const meditaciones = await db.collection('meditaciones').find(filter).skip(skipMed).limit(limitMed).toArray();
                    return NextResponse.json(meditaciones);

                case 'glosario':
                case 'conceptos':
                    if (simbolo) filter.term = new RegExp(simbolo, 'i');
                    const conceptosData = await db.collection('conceptos').find(filter).limit(100).toArray();
                    return NextResponse.json(conceptosData);

                case 'historias':
                    const historias = await db.collection('clases').find({ "didactica.historias.0": { $exists: true } }).limit(50).toArray();
                    return NextResponse.json(historias);

                case 'qa':
                case 'preguntas':
                    const preguntas = await db.collection('preguntas').find(filter).limit(50).toArray();
                    return NextResponse.json(preguntas);

                case 'clases':
                    const page = parseInt(searchParams.get('page') || '1');
                    const limit = parseInt(searchParams.get('limit') || '12');
                    const skip = (page - 1) * limit;

                    const [clases, total] = await Promise.all([
                        db.collection('clases').find(filter).skip(skip).limit(limit).toArray(),
                        db.collection('clases').countDocuments(filter)
                    ]);

                    return NextResponse.json({
                        current_page: page,
                        total_pages: Math.ceil(total / limit),
                        total_items: total,
                        data: clases
                    });

                default:
                    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
            }
        }

        const [totalMeditaciones, totalPreguntas, totalConceptos, totalClases] = await Promise.all([
            db.collection('meditaciones').countDocuments(),
            db.collection('preguntas').countDocuments(),
            db.collection('conceptos').countDocuments(),
            db.collection('clases').countDocuments(),
        ]);

        return NextResponse.json({
            stats: {
                meditaciones: totalMeditaciones,
                preguntas: totalPreguntas,
                conceptos: totalConceptos,
                clases: totalClases
            }
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
