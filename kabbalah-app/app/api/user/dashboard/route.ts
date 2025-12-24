import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserProfile, getUserProgress } from '@/lib/profile-service';

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        const [profile, progress] = await Promise.all([
            getUserProfile(userId),
            getUserProgress(userId)
        ]);

        return NextResponse.json({
            profile: profile || null,
            progress: progress || {
                completedMeditations: [],
                completedCurriculumItems: [],
                favorites: [],
                lastActive: new Date()
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
