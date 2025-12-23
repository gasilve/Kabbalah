'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Music, Sun, Moon, Sunrise, Sunset, Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

interface Prayer {
    id: string;
    title: string;
    hebrew: string;
    phonetic: string;
    translation: string;
    moment: 'shacharit' | 'mincha' | 'arvit' | 'any';
    audioUrl?: string; // Ruta al archivo de audio en public/audio/hebrew/prayers/
}

// Datos iniciales (se enriquecerán con la API)
const INITIAL_PRAYERS: Prayer[] = [
    {
        id: 'modeh-ani',
        title: 'Modeh Ani',
        hebrew: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם',
        phonetic: 'Modeh ani lefanecha Melech chai vekayam',
        translation: 'Doy gracias ante Ti, Rey vivo y eterno',
        moment: 'shacharit',
        audioUrl: '/audio/hebrew/prayers/modeh_ani.mp3'
    },
    {
        id: 'shema',
        title: 'Shema Yisrael',
        hebrew: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד',
        phonetic: 'Shema Yisrael Adonai Eloheinu Adonai Echad',
        translation: 'Escucha Israel, Adonai es nuestro Dios, Adonai es Uno',
        moment: 'any',
        audioUrl: '/audio/hebrew/prayers/shema.mp3'
    },
    {
        id: 'ana-bekoach',
        title: 'Ana Bekoach',
        hebrew: 'אָנָּא בְּכֹחַ גְּדֻלַּת יְמִינְךָ תַּתִּיר צְרוּרָה',
        phonetic: 'Ana bekoach gedulat yemincha tatir tzerura',
        translation: 'Te ruego, con el gran poder de tu diestra, libera a los atados',
        moment: 'shacharit',
        audioUrl: '/audio/hebrew/prayers/ana_bekoach.mp3'
    }
];

const MOMENTS = [
    { id: 'shacharit', label: 'Mañana', icon: Sunrise, color: 'text-yellow-400' },
    { id: 'mincha', label: 'Tarde', icon: Sun, color: 'text-orange-400' },
    { id: 'arvit', label: 'Noche', icon: Moon, color: 'text-blue-400' },
    { id: 'any', label: 'Cualquier momento', icon: BookOpen, color: 'text-white' }
];

export default function TefilaPage() {
    const [selectedMoment, setSelectedMoment] = useState('shacharit');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    // Efecto para manejar el audio
    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [audio]);

    const handlePlay = (prayer: Prayer) => {
        if (playingId === prayer.id) {
            audio?.pause();
            setPlayingId(null);
        } else {
            if (audio) {
                audio.pause();
            }
            if (prayer.audioUrl) {
                const newAudio = new Audio(prayer.audioUrl);
                newAudio.onended = () => setPlayingId(null);
                newAudio.play().catch(e => console.error("Error playing audio:", e));
                setAudio(newAudio);
                setPlayingId(prayer.id);
            }
        }
    };

    const filteredPrayers = INITIAL_PRAYERS.filter(p =>
        selectedMoment === 'any' ? true : p.moment === selectedMoment || p.moment === 'any'
    );

    return (
        <div className="min-h-screen relative pb-24">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <BookOpen className="w-8 h-8 text-accent-gold" />
                        <h1 className="text-4xl font-bold text-white">
                            Tefilá y Kavanah
                        </h1>
                        <BookOpen className="w-8 h-8 text-accent-gold" />
                    </div>
                    <p className="text-xl text-accent-gold font-hebrew">
                        תְּפִלָּה וְכַוָּנָה
                    </p>
                    <p className="text-white/70 mt-2">
                        Conexión espiritual a través de la palabra sagrada
                    </p>
                </motion.div>

                {/* Moment Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {MOMENTS.map((moment) => {
                        const Icon = moment.icon;
                        const isSelected = selectedMoment === moment.id;
                        return (
                            <button
                                key={moment.id}
                                onClick={() => setSelectedMoment(moment.id)}
                                className={`
                   flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                   ${isSelected
                                        ? 'bg-accent-gold text-background-deep shadow-lg shadow-accent-gold/20 scale-105'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }
                 `}
                            >
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-background-deep' : moment.color}`} />
                                <span className="font-medium">{moment.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Prayers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <AnimatePresence mode="popLayout">
                        {filteredPrayers.map((prayer, index) => (
                            <motion.div
                                key={prayer.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full p-6 hover:border-accent-gold/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white group-hover:text-accent-gold transition-colors">
                                            {prayer.title}
                                        </h3>
                                        <button
                                            onClick={() => handlePlay(prayer)}
                                            className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${playingId === prayer.id
                                                    ? 'bg-accent-gold text-background-deep animate-pulse'
                                                    : 'bg-white/10 text-white hover:bg-accent-gold hover:text-background-deep'
                                                }
                      `}
                                        >
                                            {playingId === prayer.id ? (
                                                <Pause className="w-5 h-5" />
                                            ) : (
                                                <Play className="w-5 h-5 ml-1" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-hebrew text-white mb-2 leading-relaxed">
                                                {prayer.hebrew}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-accent-gold text-sm font-medium mb-1">Fonética</p>
                                            <p className="text-white/80 italic">
                                                {prayer.phonetic}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-white/50 text-sm font-medium mb-1">Traducción</p>
                                            <p className="text-white/90">
                                                {prayer.translation}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
