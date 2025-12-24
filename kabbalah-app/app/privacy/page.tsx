'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-20 px-6 text-slate-300">
            <Link href="/login" className="inline-flex items-center gap-2 mb-8 text-primary">
                <ArrowLeft className="w-4 h-4" /> Volver al Login
            </Link>
            <h1 className="text-3xl font-display text-white mb-6">Política de Privacidad</h1>
            <div className="prose prose-invert">
                <p>En Kabbalah App respetamos tu privacidad. Tus datos de autenticación se utilizan únicamente para gestionar tu sesión y progreso.</p>
                <p>No compartimos tus datos con terceros.</p>
            </div>
        </div>
    );
}
