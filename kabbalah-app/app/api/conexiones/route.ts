export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();

        // Simular o buscar datos reales de la comunidad
        // En una app real, esto vendría de agregaciones o contadores en Redis/Mongo
        const [userCount, activeSessions, forumPosts] = await Promise.all([
            db.collection('users').countDocuments(),
            db.collection('progress').countDocuments({
                lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }),
            db.collection('forum').countDocuments(),
        ]);

        return NextResponse.json({
            stats: {
                totalUsers: userCount,
                activeToday: activeSessions || Math.floor(Math.random() * 50) + 100, // Fallback a random si es muy bajo para demo
                forumPosts: forumPosts
            },
            nextEvent: {
                title: 'Conexión de Shabat',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                isLive: false
            }
        });
    } catch (error) {
        console.error('Error fetching community data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
