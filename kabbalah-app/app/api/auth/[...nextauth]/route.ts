import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import getClientPromise from '@/lib/mongodb';

// Check required variables at runtime (not build time)
if (process.env.NODE_ENV === 'production' && !process.env.CI) {
    if (!process.env.NEXTAUTH_SECRET) console.warn('NEXTAUTH_SECRET is missing');
    if (!process.env.GOOGLE_CLIENT_ID) console.warn('GOOGLE_CLIENT_ID is missing');
}

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
        error: '/login', // Redirect errors back to login
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt', // Use JWT for sessions to reduce DB pressure on Edge
    },
    debug: true, // Enable temporarily for troubleshooting
    callbacks: {
        async session({ session, token, user }) {
            // Include user ID in session
            if (session.user) {
                (session.user as any).id = token.sub || (user as any)?.id;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
