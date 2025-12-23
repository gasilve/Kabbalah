'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface PlanetProps {
    label: string;
    icon: string;
    color: string;
    href: string;
    angle: number; // Angle in degrees
    radius: number; // Distance from center
    delay?: number;
}

function Planet({ label, icon, color, href, angle, radius, delay = 0 }: PlanetProps) {
    // Convert polar to cartesian
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5, type: "spring" }}
            className="absolute left-1/2 top-1/2"
            style={{ x, y, marginLeft: -40, marginTop: -40 }} // Center the 80px element
        >
            <Link href={href} className="group flex flex-col items-center gap-2">
                <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
            relative flex h-20 w-20 items-center justify-center rounded-full
            backdrop-blur-md border border-white/20
            shadow-[0_0_15px_rgba(0,0,0,0.3)]
            transition-all duration-300
          `}
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
                        borderColor: color
                    }}
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                    <span className="text-3xl filter drop-shadow-lg">{icon}</span>

                    {/* Orbital Ring Effect */}
                    <div className="absolute -inset-2 rounded-full border border-dashed border-white/10 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <span className="text-xs font-bold tracking-wider text-white/80 uppercase bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                    {label}
                </span>
            </Link>
        </motion.div>
    );
}

export function OrbitMenu() {
    return (
        <div className="relative h-[400px] w-full max-w-[400px] mx-auto my-12 perspective-1000">

            {/* Orbital Rings Background - Enhanced */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute h-[280px] w-[280px] rounded-full border border-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]" />
                <div className="absolute h-[380px] w-[380px] rounded-full border border-white/5 border-dashed opacity-30 animate-spin-slow-reverse" />
                {/* Nebula Glow behind */}
                <div className="absolute h-[200px] w-[200px] bg-accent-gold/5 rounded-full blur-3xl" />
            </div>

            {/* Central Sun (Tiferet) - Enhanced */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div
                    animate={{
                        boxShadow: [
                            "0 0 30px rgba(251, 191, 36, 0.4)",
                            "0 0 60px rgba(251, 191, 36, 0.6)",
                            "0 0 30px rgba(251, 191, 36, 0.4)"
                        ],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-36 w-36 items-center justify-center rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, #FBBF24, #D97706, #78350F)',
                    }}
                >
                    {/* Sun Surface Texture Effect */}
                    <div className="absolute inset-0 rounded-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                    <div className="relative z-10 text-center text-white drop-shadow-md">
                        <span className="block text-5xl font-serif font-bold filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">ת</span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] mt-2 block text-yellow-100">Tiferet</span>
                    </div>
                </motion.div>
            </div>

            {/* Orbiting Planets */}
            <Planet
                label="Salud"
                icon="💚"
                color="#10B981"
                href="/meditacion?intencion=salud"
                angle={225}
                radius={150}
                delay={0.1}
            />
            <Planet
                label="Prosperidad"
                icon="💰"
                color="#FBBF24"
                href="/meditacion?intencion=prosperidad"
                angle={315}
                radius={150}
                delay={0.2}
            />
            <Planet
                label="Árbol Vida"
                icon="🌳"
                color="#A855F7"
                href="/arbol-vida"
                angle={45}
                radius={150}
                delay={0.3}
            />
            <Planet
                label="72 Nombres"
                icon="🔯"
                color="#3B82F6"
                href="/72-nombres"
                angle={135}
                radius={150}
                delay={0.4}
            />

        </div>
    );
}
