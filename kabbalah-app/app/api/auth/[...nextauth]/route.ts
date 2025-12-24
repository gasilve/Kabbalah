export const runtime = 'edge';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import getClientPromise from '@/lib/mongodb';

const handler = NextAuth({
    adapter: MongoDBAdapter(getClientPromise()),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, user }) {
            // Include user ID in session
            if (session.user) {
                (session.user as any).id = user.id;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
