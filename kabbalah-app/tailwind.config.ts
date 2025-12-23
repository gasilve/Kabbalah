import type { Config } from "tailwindcss";
// Tailwind v4 migration note: Some complex utilities moved to CSS directly


const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Prototype Palette
                primary: {
                    DEFAULT: "#FBBF24", // Amber-400
                    dark: "#B45309",
                },
                background: {
                    DEFAULT: "#050914", // Deep Void
                    dark: "#050914",
                    card: "rgba(16, 24, 45, 0.7)", // card-glass
                },
                accent: {
                    purple: "#8B5CF6",
                    blue: "#3B82F6",
                    gold: "#F59E0B",
                },
                "card-border": "rgba(255, 255, 255, 0.1)",
                secondary: {
                    DEFAULT: "#E5E7EB", // Ethereal Silver
                    muted: "#9CA3AF",
                },
            },
            fontFamily: {
                display: ["Cinzel", "serif"],
                body: ["Lato", "sans-serif"],
                sans: ["Lato", "sans-serif"],
                serif: ["Cinzel", "serif"],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'gold': '0 0 15px rgba(212, 175, 55, 0.3)',
                'glow-gold': '0 0 20px rgba(251, 191, 36, 0.25)',
                'glow-card': '0 4px 30px rgba(0, 0, 0, 0.5)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #C5A028 100%)',
                'midnight-gradient': 'linear-gradient(to bottom, #050511, #1A1F3A)',
                'nebula': "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')",
                'mystic-gradient': "linear-gradient(180deg, rgba(5,9,20,0) 0%, rgba(5,9,20,1) 90%)",
            }
        },
    },
    plugins: [],
};

export default config;
