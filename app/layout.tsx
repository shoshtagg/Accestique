import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Terminal } from "lucide-react";
import { Analytics } from "@vercel/analytics/react"; // 1. Import ajouté ici

const inter = Inter({ 
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: "Accestique | Base de Connaissances Cybersécurité",
    description: "Plateforme de Cybersécurité : De Zéro à Héros",
    keywords: ["cybersécurité", "hacking éthique", "pentest", "sécurité informatique", "tutoriels cybersécurité"],
    authors: [{ name: 'Accestique Team' }],
    creator: 'Accestique',
    publisher: 'Accestique',
    metadataBase: new URL('https://accestique.fr'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://accestique.fr',
        title: 'Accestique | Base de Connaissances Cybersécurité',
        description: 'Plateforme de Cybersécurité : De Zéro à Héros',
        siteName: 'Accestique',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    colorScheme: 'dark',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth">
            <head>
                <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.vercel-insights.com;" />
                <meta name="referrer" content="strict-origin-when-cross-origin" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </head>
            <body className={`${inter.className} bg-black min-h-screen text-white selection:bg-cyan-500/30 selection:text-cyan-100 antialiased`}>
                <div className="relative min-h-screen overflow-x-hidden">
                    <div className="pointer-events-none fixed inset-0 -z-10">
                        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),transparent_60%)]" />
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    </div>

                    {/* Navigation Bar */}
                    <header className="fixed top-0 w-full z-50 border-b border-cyan-500/25 bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60 shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                        <nav aria-label="Navigation principale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg border border-cyan-500/50 bg-black/80 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                        <Terminal className="text-neon-green h-4 w-4" aria-hidden="true" />
                                    </div>
                                    <a href="/" className="text-xl font-bold tracking-[0.3em] text-white uppercase hover:text-cyan-400 transition-colors">
                                        Accestique<span className="text-cyan-400">_</span>
                                        <span className="sr-only">Page d'accueil</span>
                                    </a>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline gap-2 rounded-full border border-cyan-500/20 bg-black/60 px-3 py-1 shadow-[0_0_25px_rgba(8,47,73,0.6)]">
                                        <a href="/" className="relative px-3 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-cyan-300 transition-all hover:bg-cyan-500/10">
                                            <span className="font-mono">Accueil</span>
                                        </a>
                                        <a href="/academy" className="relative px-3 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-cyan-300 transition-all hover:bg-cyan-500/10">
                                            <span className="font-mono">Académie</span>
                                        </a>
                                        <a href="/threat-intel" className="relative px-3 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-cyan-300 transition-all hover:bg-cyan-500/10">
                                            <span className="font-mono">Veille Menaces</span>
                                        </a>
                                        <a href="/cheatsheets" className="relative px-3 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-cyan-300 transition-all hover:bg-cyan-500/10">
                                            <span className="font-mono">Cheatsheets</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>

                    {/* Main Content */}
                    <main className="pt-16 min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-cyan-500/20 bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-lg mt-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-lg border border-cyan-500/50 bg-black/80 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                            <Terminal className="text-neon-green h-4 w-4" aria-hidden="true" />
                                        </div>
                                        <span className="text-lg font-bold tracking-wider font-mono">
                                            ACCESTIQUE<span className="text-cyan-400">_</span>
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 max-w-sm">
                                        Infrastructure pensée pour les opérations de cybersécurité modernes.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:justify-end">
                                    <div className="flex flex-col gap-2">
                                        <a href="/about" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">→ À propos</a>
                                        <a href="/privacy" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">→ Confidentialité</a>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <a href="/terms" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">→ Conditions</a>
                                        <a href="/contact" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">→ Contact</a>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-cyan-500/10 pt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs font-mono text-gray-600">ANNÉE</p>
                                        <p className="text-sm text-gray-400">{new Date().getFullYear()} Accestique</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono text-gray-600">STATUT</p>
                                        <p className="text-sm text-neon-green font-bold">● En Production</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono text-gray-600">DROITS</p>
                                        <p className="text-sm text-gray-400">Tous réservés ©</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
                
                {/* 2. Balise Analytics ajoutée ici */}
                <Analytics />
                
            </body>
        </html>
    );
}
