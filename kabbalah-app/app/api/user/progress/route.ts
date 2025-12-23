import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { markMeditationComplete, markCurriculumComplete } from '@/lib/profile-service';

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await request.json();
        const { type, id } = body;

        if (type === 'meditation') {
            await markMeditationComplete(userId, id);
        } else if (type === 'curriculum') {
            await markCurriculumComplete(userId, id);
        } else {
            return NextResponse.json({ error: 'Tipo de progreso inválido' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
