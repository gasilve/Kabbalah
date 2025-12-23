'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Star, Bell, ExternalLink } from "lucide-react";

// Mock events data
const EVENTS = [
    {
        id: 1,
        title: 'Shabat de Rosh Jodesh Tevet',
        description: 'Celebración especial del nuevo mes hebreo con meditaciones guiadas y estudio del Zohar.',
        date: 'Viernes 6 Dic',
        time: '19:00 - 22:00',
        location: 'Online (Zoom)',
        attendees: 120,
        isFeatured: true,
        type: 'shabbat',
    },
    {
        id: 2,
        title: 'Taller: Los 72 Nombres en tu Vida',
        description: 'Aprende a usar los 72 nombres sagrados para transformar situaciones cotidianas.',
        date: 'Domingo 8 Dic',
        time: '16:00 - 18:00',
        location: 'Online (Zoom)',
        attendees: 45,
        isFeatured: false,
        type: 'workshop',
    },
    {
        id: 3,
        title: 'Janucá: 8 Noches de Luz',
        description: 'Celebración comunitaria de Janucá con encendido de velas, meditaciones y enseñanzas.',
        date: '25-30 Dic',
        time: '20:00',
        location: 'Online + Presencial',
        attendees: 200,
        isFeatured: true,
        type: 'holiday',
    },
    {
        id: 4,
        title: 'Retiro de Meditación Kabbalística',
        description: 'Un fin de semana de inmersión profunda en las prácticas meditativas de la Kabbalah.',
        date: '10-12 Enero',
        time: 'Todo el día',
        location: 'Por confirmar',
        attendees: 30,
        isFeatured: false,
        type: 'retreat',
    },
];

const TYPE_COLORS = {
    shabbat: '#FBBF24',
    workshop: '#3B82F6',
    holiday: '#A855F7',
    retreat: '#10B981',
};

const TYPE_LABELS = {
    shabbat: 'Shabat',
    workshop: 'Taller',
    holiday: 'Festividad',
    retreat: 'Retiro',
};

export default function EventosPage() {
    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/conexiones" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Eventos Especiales</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Featured Events */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent-gold" />
                    Destacados
                </h3>
                <div className="space-y-4 mb-8">
                    {EVENTS.filter(e => e.isFeatured).map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                                border: '1px solid rgba(251,191,36,0.3)',
                            }}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                        style={{
                                            background: `${TYPE_COLORS[event.type as keyof typeof TYPE_COLORS]}30`,
                                            color: TYPE_COLORS[event.type as keyof typeof TYPE_COLORS],
                                        }}
                                    >
                                        {TYPE_LABELS[event.type as keyof typeof TYPE_LABELS]}
                                    </span>
                                    <button className="p-1.5 rounded-full hover:bg-white/10">
                                        <Bell className="h-4 w-4 text-gray-400" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-serif font-bold text-white mt-3">{event.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{event.description}</p>

                                <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {event.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {event.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {event.attendees} participantes
                                    </span>
                                    <button className="px-4 py-2 rounded-lg bg-accent-gold text-background-deep text-sm font-bold">
                                        Inscribirse
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* All Events */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Próximos Eventos
                </h3>
                <div className="space-y-3">
                    {EVENTS.filter(e => !e.isFeatured).map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="p-4 rounded-xl flex items-center gap-4"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <div
                                className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold"
                                style={{
                                    background: `${TYPE_COLORS[event.type as keyof typeof TYPE_COLORS]}20`,
                                    color: TYPE_COLORS[event.type as keyof typeof TYPE_COLORS],
                                }}
                            >
                                {event.date.split(' ')[1]}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">{event.date} • {event.time}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
