import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();

        // Find the class by video_id
        const clase = await db.collection('clases').findOne({ video_id: id });

        if (!clase) {
            return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
        }

        // Fetch related meditations
        const meditations = await db.collection('meditaciones').find({ clase_id: id }).toArray();

        // Fetch related questions
        const questions = await db.collection('preguntas').find({ clase_id: id }).toArray();

        // Fetch related concepts (this might need refinement based on how concepts are linked)
        // For now, we'll try to match concepts mentioned in the class if we had links
        // But for MVP, we'll just return the class and direct related items

        return NextResponse.json({
            ...clase,
            meditations,
            questions
        });
    } catch (error) {
        console.error('Error fetching class detail:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
