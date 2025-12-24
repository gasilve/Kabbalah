'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-20 px-6 text-slate-300">
            <Link href="/login" className="inline-flex items-center gap-2 mb-8 text-primary">
                <ArrowLeft className="w-4 h-4" /> Volver al Login
            </Link>
            <h1 className="text-3xl font-display text-white mb-6">Términos de Servicio</h1>
            <div className="prose prose-invert">
                <p>Bienvenido a Kabbalah App. Al utilizar nuestra aplicación, aceptas nuestros términos.</p>
                <p>Esta es una versión en desarrollo. El contenido es para uso educativo y personal.</p>
            </div>
        </div>
    );
}
