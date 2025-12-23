'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl mb-4"
                    >
                        ✡️
                    </motion.div>
                    <h1
                        className="text-3xl font-serif font-bold mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #FBBF24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Kabbalah
                    </h1>
                    <p className="text-gray-400 text-sm">Tu camino hacia la luz</p>
                </div>

                {/* Login Card */}
                <div
                    className="p-6 rounded-2xl"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <h2 className="text-xl font-bold text-white text-center mb-6">
                        Iniciar Sesión
                    </h2>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-100 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continuar con Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-gray-500">o</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Continue as Guest */}
                    <Link href="/">
                        <button className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                            Continuar como invitado
                        </button>
                    </Link>
                </div>

                {/* Terms */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Al continuar, aceptas nuestros{' '}
                    <Link href="/terms" className="text-accent-gold hover:underline">
                        Términos de Servicio
                    </Link>{' '}
                    y{' '}
                    <Link href="/privacy" className="text-accent-gold hover:underline">
                        Política de Privacidad
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
