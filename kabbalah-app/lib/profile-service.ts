import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface UserProfile {
    userId: string;
    level: number;
    experience: number;
    bio: string;
    role: string;
    sefiraAlignment: {
        keter: boolean;
        chochmah: boolean;
        binah: boolean;
        chesed: boolean;
        gevurah: boolean;
        tiferet: boolean;
        netzaj: boolean;
        hod: boolean;
        yesod: boolean;
        malkut: boolean;
    };
    stats: {
        meditationMinutes: number;
        coursesCompleted: number;
        totalSessions: number;
    };
    updatedAt: Date;
}

export interface UserProgress {
    userId: string;
    completedMeditations: string[]; // array of IDs
    completedCurriculumItems: string[]; // array of Sefirot/Slug IDs
    favorites: string[]; // array of meditation/content IDs
    lastActive: Date;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const db = await getDatabase();
    return db.collection<UserProfile>('profiles').findOne({ userId });
}

export async function updateUserProfile(userId: string, update: Partial<UserProfile>) {
    const db = await getDatabase();
    return db.collection('profiles').updateOne(
        { userId },
        {
            $set: { ...update, updatedAt: new Date() },
            $setOnInsert: { userId }
        },
        { upsert: true }
    );
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
    const db = await getDatabase();
    return db.collection<UserProgress>('progress').findOne({ userId });
}

export async function markMeditationComplete(userId: string, meditationId: string) {
    const db = await getDatabase();
    return db.collection('progress').updateOne(
        { userId },
        {
            $addToSet: { completedMeditations: meditationId },
            $set: { lastActive: new Date() },
            $setOnInsert: { userId, completedCurriculumItems: [] }
        },
        { upsert: true }
    );
}

export async function markCurriculumComplete(userId: string, itemId: string) {
    const db = await getDatabase();
    return db.collection('progress').updateOne(
        { userId },
        {
            $addToSet: { completedCurriculumItems: itemId },
            $set: { lastActive: new Date() },
            $setOnInsert: { userId, completedMeditations: [], favorites: [] }
        },
        { upsert: true }
    );
}

export async function toggleFavorite(userId: string, itemId: string) {
    const db = await getDatabase();
    const progress = await getUserProgress(userId);

    const isFavorite = progress?.favorites?.includes(itemId);

    return db.collection('progress').updateOne(
        { userId },
        {
            [isFavorite ? '$pull' : '$addToSet']: { favorites: itemId },
            $set: { lastActive: new Date() },
            $setOnInsert: { userId, completedMeditations: [], completedCurriculumItems: [] }
        },
        { upsert: true }
    );
}
