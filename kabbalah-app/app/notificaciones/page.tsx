'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Bell, Book, Clock, Calendar, Star, Check } from "lucide-react";
import { useState } from "react";

const NOTIFICATION_SETTINGS = [
    {
        id: 'daily_zohar',
        title: 'Zohar Diario',
        description: 'Recibe un pasaje del Zohar cada día',
        icon: Book,
        enabled: true,
    },
    {
        id: 'meditation_reminder',
        title: 'Recordatorio de Meditación',
        description: 'Recordatorio para tu práctica diaria',
        icon: Clock,
        enabled: true,
    },
    {
        id: 'shabbat',
        title: 'Horarios de Shabat',
        description: 'Notificación de entrada y salida de Shabat',
        icon: Calendar,
        enabled: false,
    },
    {
        id: 'holidays',
        title: 'Festividades Judías',
        description: 'Alertas de próximas festividades',
        icon: Star,
        enabled: true,
    },
    {
        id: 'achievements',
        title: 'Logros',
        description: 'Cuando desbloqueas un nuevo logro',
        icon: Star,
        enabled: true,
    },
];

export default function NotificacionesPage() {
    const [settings, setSettings] = useState(NOTIFICATION_SETTINGS);

    const toggleSetting = (id: string) => {
        setSettings(prev => prev.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
    };

    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/perfil" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Notificaciones</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl mb-6 flex items-center gap-3"
                    style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                >
                    <Bell className="h-5 w-5 text-blue-400" />
                    <p className="text-sm text-gray-300">
                        Configura qué notificaciones quieres recibir para tu práctica espiritual.
                    </p>
                </motion.div>

                {/* Settings List */}
                <div className="space-y-3">
                    {settings.map((setting, idx) => (
                        <motion.div
                            key={setting.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-xl flex items-center gap-4"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <div
                                className="h-10 w-10 rounded-full flex items-center justify-center"
                                style={{
                                    background: setting.enabled
                                        ? 'rgba(251,191,36,0.2)'
                                        : 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <setting.icon className={`h-5 w-5 ${setting.enabled ? 'text-accent-gold' : 'text-gray-500'}`} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-white">{setting.title}</h3>
                                <p className="text-xs text-gray-400">{setting.description}</p>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => toggleSetting(setting.id)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-accent-gold' : 'bg-gray-600'
                                    }`}
                            >
                                <motion.div
                                    animate={{ x: setting.enabled ? 24 : 2 }}
                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                                />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Notification Time */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 rounded-xl"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent-gold" />
                        Hora del Recordatorio
                    </h3>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2 rounded-lg bg-accent-gold/20 text-accent-gold text-sm font-medium">
                            07:00 AM
                        </button>
                        <button className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-sm">
                            Cambiar
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
