'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Globe, Moon, Volume2, Eye, Shield, HelpCircle, Info, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ConfiguracionPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [language, setLanguage] = useState('es');

    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/perfil" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Configuración</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
                {/* Appearance Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Apariencia
                    </h3>
                    <div className="space-y-2">
                        <SettingItem
                            icon={Moon}
                            title="Modo Oscuro"
                            subtitle="Siempre activo para tu práctica nocturna"
                            toggle
                            enabled={darkMode}
                            onToggle={() => setDarkMode(!darkMode)}
                        />
                        <SettingItem
                            icon={Globe}
                            title="Idioma"
                            subtitle="Español"
                            chevron
                        />
                    </div>
                </motion.div>

                {/* Sound Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Sonido
                    </h3>
                    <div className="space-y-2">
                        <SettingItem
                            icon={Volume2}
                            title="Efectos de Sonido"
                            subtitle="Sonidos al completar acciones"
                            toggle
                            enabled={soundEnabled}
                            onToggle={() => setSoundEnabled(!soundEnabled)}
                        />
                    </div>
                </motion.div>

                {/* Privacy Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Privacidad
                    </h3>
                    <div className="space-y-2">
                        <SettingItem
                            icon={Eye}
                            title="Perfil Visible"
                            subtitle="Otros pueden ver tu progreso"
                            toggle
                            enabled={false}
                        />
                        <SettingItem
                            icon={Shield}
                            title="Política de Privacidad"
                            chevron
                        />
                    </div>
                </motion.div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Acerca de
                    </h3>
                    <div className="space-y-2">
                        <SettingItem
                            icon={HelpCircle}
                            title="Ayuda y Soporte"
                            chevron
                        />
                        <SettingItem
                            icon={Info}
                            title="Versión"
                            subtitle="1.0.0 (Beta)"
                        />
                    </div>
                </motion.div>

                {/* Credits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center pt-6"
                >
                    <p className="text-xs text-gray-500">
                        Kabbalah Mashiah © 2024
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                        Basado en las enseñanzas de Rabbi Gozlan
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

// Reusable Setting Item Component
function SettingItem({
    icon: Icon,
    title,
    subtitle,
    toggle,
    enabled,
    onToggle,
    chevron
}: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    toggle?: boolean;
    enabled?: boolean;
    onToggle?: () => void;
    chevron?: boolean;
}) {
    return (
        <div
            className="p-4 rounded-xl flex items-center gap-4"
            style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-accent-gold/20">
                <Icon className="h-5 w-5 text-accent-gold" />
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>

            {toggle && (
                <button
                    onClick={onToggle}
                    className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-accent-gold' : 'bg-gray-600'
                        }`}
                >
                    <motion.div
                        animate={{ x: enabled ? 24 : 2 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                    />
                </button>
            )}

            {chevron && (
                <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
        </div>
    );
}
