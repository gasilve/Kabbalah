'use client';

import {
    Compass,
    BookOpen,
    Library,
    Users,
    User,
    Network,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export function BottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-6 left-4 right-4 z-50 transition-all duration-300">
            <div className="glass-panel bg-[#0B1026]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-2 py-1 flex items-center justify-around h-20">
                <NavLink href="/explorar" icon={Compass} label="Explorar" active={isActive('/explorar')} />
                <NavLink href="/meditacion" icon={BookOpen} label="Estudio" active={isActive('/meditacion')} />

                {/* Central Journey Button */}
                <Link href="/journey" className="relative -top-6 group">
                    <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-b from-slate-800 to-black border ${isActive('/journey') ? 'border-primary shadow-glow-gold' : 'border-white/20'} flex flex-col items-center justify-center z-10 relative transition-all duration-300`}>
                        <Network className={`w-8 h-8 ${isActive('/journey') ? 'text-primary' : 'text-primary/70'} transition-colors group-hover:text-primary ${isActive('/journey') ? 'animate-pulse-glow' : ''}`} />
                    </div>
                    <span className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[0.6rem] font-bold mt-1 tracking-wider uppercase transition-all duration-300 ${isActive('/journey') ? 'text-primary opacity-100' : 'text-primary/60 opacity-80 group-hover:opacity-100'}`}>
                        Camino
                    </span>
                </Link>

                <NavLink href="/conexiones" icon={Users} label="Comunidad" active={isActive('/conexiones')} />

                <Link
                    href="/perfil"
                    className="flex flex-col items-center justify-center w-14 h-full group"
                >
                    <div className={`relative transition-all duration-300 ${isActive('/perfil') ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Profile" className="w-6 h-6 rounded-full border border-primary/40" />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                        {isActive('/perfil') && (
                            <motion.div layoutId="nav-bg" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                    </div>
                    <span className={`text-[0.6rem] font-medium transition-colors ${isActive('/perfil') ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                        Perfil
                    </span>
                </Link>
            </div>
        </nav>
    );
}

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center w-14 h-full group">
            <div className={`relative transition-all duration-300 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                <Icon className={`w-6 h-6 ${active ? 'animate-pulse-glow' : ''}`} />
                {active && (
                    <motion.div
                        layoutId="nav-glow-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        transition={{ duration: 0.2 }}
                    />
                )}
            </div>
            <span className={`text-[0.6rem] font-medium transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {label}
            </span>
        </Link>
    );
}

