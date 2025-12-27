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

// Helper to add experience and check level up
async function addExperience(userId: string, amount: number) {
    const db = await getDatabase();
    const profile = await getUserProfile(userId);

    if (!profile) return; // Should create if not exists, but for MVP assumes profile exists or created on login

    // Create profile if null (fallback)
    const currentXp = profile?.experience || 0;
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 100) + 1; // Simple linear leveling

    await db.collection('profiles').updateOne(
        { userId },
        {
            $set: {
                experience: newXp,
                level: newLevel,
                updatedAt: new Date()
            },
            $setOnInsert: { userId, bio: '', role: 'student', stats: { meditationMinutes: 0, coursesCompleted: 0, totalSessions: 0 } }
        },
        { upsert: true }
    );
}

export async function markMeditationComplete(userId: string, meditationId: string) {
    const db = await getDatabase();
    await db.collection('progress').updateOne(
        { userId },
        {
            $addToSet: { completedMeditations: meditationId },
            $set: { lastActive: new Date() },
            $setOnInsert: { userId, completedCurriculumItems: [] }
        },
        { upsert: true }
    );
    // Add XP
    await addExperience(userId, 20);
    // Update stats
    await db.collection('profiles').updateOne({ userId }, { $inc: { "stats.totalSessions": 1, "stats.meditationMinutes": 15 } });
}

export async function markCurriculumComplete(userId: string, itemId: string) {
    const db = await getDatabase();
    await db.collection('progress').updateOne(
        { userId },
        {
            $addToSet: { completedCurriculumItems: itemId },
            $set: { lastActive: new Date() },
            $setOnInsert: { userId, completedMeditations: [], favorites: [] }
        },
        { upsert: true }
    );
    // Add XP
    await addExperience(userId, 50);
    // Update stats
    await db.collection('profiles').updateOne({ userId }, { $inc: { "stats.coursesCompleted": 1 } });
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
