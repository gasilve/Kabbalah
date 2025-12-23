import type { Metadata, Viewport } from "next";
import { Lato, Cinzel } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { BottomNav } from "@/components/layout/BottomNav";

const lato = Lato({ subsets: ["latin"], weight: ['300', '400', '700'], variable: "--font-lato", display: 'swap' });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#050914",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mobile-app feel
};

export const metadata: Metadata = {
  title: "Kabbalah Mashiah",
  description: "Portal de Sabiduría y Transformación Espiritual",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kabbalah",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lato.variable} ${cinzel.variable}`}>
      <body className="font-body bg-background text-foreground min-h-screen flex flex-col pb-safe selection:bg-primary/30">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-nebula bg-cover bg-center opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F29]/60 via-[#050914]/90 to-[#050914]" />
        </div>
        <AuthProvider>
          <main className="flex-grow pb-24 relative z-10 w-full max-w-md mx-auto">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
