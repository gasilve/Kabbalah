'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Meditaciones', path: '/meditacion' },
        { name: '72 Nombres', path: '/72-nombres' },
        { name: 'Árbol de la Vida', path: '/arbol-vida' },
        { name: 'Secretos del Zohar', path: '/secretos-zohar' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-deep/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                            <img
                                src="/icons/tree_of_life_icon.png"
                                alt="Tree of Life"
                                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                            />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
                            Kabbalah Mashiah
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                                        ? 'text-accent-gold bg-white/5'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background-deep border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.path)
                                    ? 'text-accent-gold bg-white/5'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
