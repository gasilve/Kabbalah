'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    Edit2,
    Zap,
    Medal,
    TrendingUp,
    BookOpen,
    User,
    Bell,
    Globe,
    Crown,
    LogOut,
    Sparkles,
    Check,
    Heart
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const sefirotAchievements = [
    { id: 'keter', name: 'Keter', icon: 'brightness_7', completed: true, position: 'top' },
    { id: 'binah', name: 'Binah', icon: 'psychology', completed: false, position: 'top-left' },
    { id: 'chochmah', name: 'Chochmah', icon: 'lightbulb', completed: true, position: 'top-right' },
    { id: 'gevurah', name: 'Gevurah', icon: 'balance', completed: false, position: 'mid-left' },
    { id: 'tiferet', name: 'Tiferet', icon: 'heart', completed: true, position: 'center', highlight: true },
    { id: 'chesed', name: 'Chesed', icon: 'volunteer_activism', completed: true, position: 'mid-right' },
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<{ profile: any; progress: any } | null>(null);

    React.useEffect(() => {
        if (session) {
            fetch('/api/user/dashboard')
                .then(res => res.json())
                .then(setData)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session]);

    const userData = {
        name: session?.user?.name || "Daniela S.",
        role: data?.profile?.role || "Buscadora de Luz",
        bio: data?.profile?.bio || '"La chispa divina reside en la contemplación del silencio."',
        level: data?.profile?.level || 1,
        meditationMin: data?.profile?.stats?.meditationMinutes || 0,
        meditationTrend: "+0%",
        coursesDone: data?.progress?.completedCurriculumItems?.length || 0,
        coursesTotal: 12,
        currentCourse: data?.profile?.currentCourse || "Introducción",
        avatar: session?.user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCV5JtW0bUwiKHzIKEJCGffCoS0vwyWZ85lUPpEulQohY4FFLfEaiLQGuwucuZC4Do9rdk4_j9DCpCseXNacbAjA2ZW8SBQwXC5FBCxoYmla2AVB4_bjvMcgdANxAfwCLk2-m5h7qDSix1QDyKV6XPTN7OIMyx8SSfqlPNfMIrAKruZhrKmR1784Bcyty6hl1k4YwWSs1yWw5A8Bd4vcqJLF1kuChfHJzfnao9rFwlQetYWlfBlY2jyu2YJcoHugRVH2YtHDpRHl4iF"
    };

    const isSefiraCompleted = (id: string) => {
        return data?.progress?.completedCurriculumItems?.includes(id) || false;
    };

    return (
        <div className="min-h-screen pb-32 pt-6">
            {/* Header Area */}
            <div className="flex items-center justify-between px-6 mb-8">
                <div className="w-10" /> {/* Spacer */}
                <h1 className="text-xl font-display text-white tracking-widest text-center">Perfil</h1>
                <button className="text-primary text-sm font-bold tracking-wider hover:opacity-80 transition-opacity">
                    EDITAR
                </button>
            </div>

            <main className="max-w-md mx-auto px-4 space-y-8">
                {/* Profile Hero */}
                <div className="flex flex-col items-center">
                    <div className="relative group mb-4">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative w-32 h-32 rounded-full p-1 bg-slate-950 border border-primary/30">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={userData.avatar}
                                    alt={userData.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-white/10 px-3 py-1 rounded-full shadow-xl flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Nvl. {userData.level}</span>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-display text-white mb-1">{userData.name}</h2>
                    <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">{userData.role}</p>
                    <p className="text-slate-400 text-sm italic text-center max-w-[280px] leading-relaxed">
                        {userData.bio}
                    </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Meditación Card */}
                    <div className="glass-panel border-white/5 p-4 rounded-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Meditación</span>
                        </div>
                        <div className="mb-3">
                            <span className="text-3xl font-bold text-white tracking-tight">{userData.meditationMin}</span>
                            <span className="text-xs text-slate-500 ml-1">min</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-emerald-500 font-bold">{userData.meditationTrend} esta semana</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[65%]" />
                        </div>
                    </div>

                    {/* Cursos Card */}
                    <div className="glass-panel border-white/5 p-4 rounded-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow-gold" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cursos</span>
                        </div>
                        <div className="mb-3">
                            <span className="text-3xl font-bold text-white tracking-tight">{userData.coursesDone}</span>
                            <span className="text-xs text-slate-500 ml-1">/ {userData.coursesTotal}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3 text-primary">
                            <BookOpen className="w-3 h-3" />
                            <span className="text-[10px] font-bold">{userData.currentCourse}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[75%] shadow-glow-gold" />
                        </div>
                    </div>
                </div>

                {/* Tree of Life Achievements */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-display text-white flex items-center gap-2 pt-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Árbol de la Vida
                        </h3>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline pt-2">VER TODO</span>
                    </div>

                    <div className="glass-panel border-white/5 p-8 rounded-3xl relative overflow-hidden flex justify-center">
                        {/* Background SVG Connections */}
                        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 300 300">
                            <line x1="150" y1="50" x2="80" y2="100" stroke="currentColor" strokeWidth="1" />
                            <line x1="150" y1="50" x2="220" y2="100" stroke="currentColor" strokeWidth="1" />
                            <line x1="80" y1="100" x2="220" y2="100" stroke="currentColor" strokeWidth="1" />
                            <line x1="80" y1="100" x2="150" y2="150" stroke="currentColor" strokeWidth="1" />
                            <line x1="220" y1="100" x2="150" y2="150" stroke="currentColor" strokeWidth="1" />
                            <line x1="80" y1="100" x2="80" y2="200" stroke="currentColor" strokeWidth="1" />
                            <line x1="220" y1="100" x2="220" y2="200" stroke="currentColor" strokeWidth="1" />
                            <line x1="150" y1="150" x2="80" y2="200" stroke="currentColor" strokeWidth="1" />
                            <line x1="150" y1="150" x2="220" y2="200" stroke="currentColor" strokeWidth="1" />
                        </svg>

                        <div className="relative z-10 grid grid-cols-3 gap-y-8 gap-x-4 w-full">
                            {/* Keter (Top Center) */}
                            <div className="col-start-2 flex flex-col items-center gap-2">
                                <SefiraBadge
                                    completed={isSefiraCompleted('keter')}
                                    icon={<Sparkles className="w-5 h-5" />}
                                    name="Keter"
                                    glow
                                />
                            </div>

                            {/* Binah & Chochmah (Level 2) */}
                            <div className="col-start-1 flex flex-col items-center gap-2 mt-4">
                                <SefiraBadge
                                    completed={isSefiraCompleted('binah')}
                                    name="Binah"
                                />
                            </div>
                            <div className="col-start-3 flex flex-col items-center gap-2 mt-4">
                                <SefiraBadge
                                    completed={isSefiraCompleted('chochmah')}
                                    icon={<Sparkles className="w-5 h-5" />}
                                    name="Chochmah"
                                />
                            </div>

                            {/* Gevurah & Chesed (Level 3) */}
                            <div className="col-start-1 flex flex-col items-center gap-2">
                                <SefiraBadge
                                    completed={isSefiraCompleted('gevurah')}
                                    name="Gevurah"
                                />
                            </div>
                            {/* Tiferet (Center) */}
                            <div className="col-start-2 flex flex-col items-center gap-2 -mt-4">
                                <SefiraBadge
                                    completed={isSefiraCompleted('tiferet')}
                                    icon={<Heart className="w-7 h-7 fill-white" />}
                                    name="Tiferet"
                                    large
                                    glow
                                />
                            </div>
                            <div className="col-start-3 flex flex-col items-center gap-2">
                                <SefiraBadge
                                    completed={isSefiraCompleted('chesed')}
                                    icon={<Check className="w-5 h-5" />}
                                    name="Chesed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="space-y-4">
                    <h3 className="text-lg font-display text-white px-1">Ajustes</h3>
                    <div className="glass-panel border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                        <MenuButton icon={<User className="text-blue-400" />} label="Cuenta" />
                        <MenuButton icon={<Bell className="text-primary" />} label="Notificaciones" badge />
                        <MenuButton icon={<Globe className="text-emerald-400" />} label="Idioma" value="Español" />
                        <MenuButton icon={<Crown className="text-amber-400" />} label="Suscripción" tag="PRO" />
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-slate-900 group-hover:bg-rose-500/20 transition-colors">
                                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-500" />
                                </div>
                                <span className="text-sm font-medium text-slate-400 group-hover:text-rose-500">Cerrar Sesión</span>
                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SefiraBadge({ completed, name, icon, large = false, glow = false }: { completed: boolean; name: string; icon?: React.ReactNode; large?: boolean; glow?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative rounded-full flex items-center justify-center border transition-all duration-500
                    ${large ? 'w-16 h-16' : 'w-12 h-12'}
                    ${completed
                        ? 'bg-primary/20 border-primary shadow-glow-gold'
                        : 'bg-white/5 border-white/10 opacity-40'
                    }
                `}
            >
                {glow && completed && (
                    <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse" />
                )}
                <div className={`relative z-10 flex items-center justify-center ${completed ? 'text-primary' : 'text-slate-500'}`}>
                    {icon}
                </div>
                {completed && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-[2px] border border-slate-950">
                        <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                )}
            </motion.div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${completed ? 'text-white' : 'text-slate-600'}`}>{name}</span>
        </div>
    );
}

function MenuButton({ icon, label, value, tag, badge }: { icon: React.ReactNode; label: string; value?: string; tag?: string; badge?: boolean }) {
    return (
        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-900">
                    {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                </div>
                <span className="text-sm font-medium text-slate-200">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {value && <span className="text-[10px] font-bold text-slate-500">{value}</span>}
                {tag && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{tag}</span>}
                {badge && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
            </div>
        </button>
    );
}
