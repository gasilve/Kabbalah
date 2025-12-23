'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Cosmic Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/cosmic_bg.jpg')",
                }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Animated Stars */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
