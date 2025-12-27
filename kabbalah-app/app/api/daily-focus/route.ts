import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        // Pick a random collection to select from: meditaciones, concepts, or classes
        const collections = ['meditaciones', 'conceptos', 'clases'];
        const collectionName = collections[Math.floor(Math.random() * collections.length)];

        const count = await db.collection(collectionName).countDocuments();
        if (count === 0) {
            return NextResponse.json({
                title: "Inicia tu camino",
                content: "Explora la biblioteca para descubrir los secretos de la Kabbalah.",
                type: "Bienvenida"
            });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomDoc = await db.collection(collectionName).find().skip(randomIndex).limit(1).next();

        if (!randomDoc) {
            return NextResponse.json({
                title: "Luz Infinita",
                content: "La vasija se ensancha con el estudio diario.",
                type: "Inspiración"
            });
        }

        // Standardize output based on source
        let result = {
            title: "",
            content: "",
            type: collectionName === 'historias' ? 'Enseñanza' : (collectionName === 'conceptos' ? 'Concepto' : 'Clase'),
            extra: ""
        };

        if (collectionName === 'meditaciones') {
            result.title = randomDoc.title || "Meditación del Día";
            result.content = randomDoc.description || "Conecta con la luz infinita.";
            result.extra = "Práctica";
        } else if (collectionName === 'conceptos') {
            result.title = randomDoc.term || "Concepto Místico";
            result.content = randomDoc.meaning || "";
            result.extra = randomDoc.hebrew || "";
        } else {
            result.title = randomDoc.title || "Clase de Hoy";
            result.content = randomDoc.summary || "";
            result.extra = randomDoc.playlist || "";
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching daily focus:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
