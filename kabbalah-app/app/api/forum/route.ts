export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const posts = await db.collection('forum')
            .find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category } = body;

        const db = await getDatabase();
        const result = await db.collection('forum').insertOne({
            title,
            content,
            category: category || 'General',
            author: {
                name: session.user.name,
                image: session.user.image,
                id: (session.user as any).id
            },
            createdAt: new Date(),
            likes: 0,
            replies: 0
        });

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
    }
}
