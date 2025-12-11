'use client';

import ThreatIntelFeed from '@/components/ThreatIntelFeed';

export default function NewsPage() {
    return (
        <main className="min-h-screen bg-black pt-24 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <p className="font-mono text-xs text-neon-green/80 mb-2">// Threat Intel Feed</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight text-glow-green">
                        Veille <span className="text-neon-green">Menaces &amp; Exploits</span>
                    </h1>
                    <p className="text-gray-300 mb-3 max-w-2xl mx-auto text-sm sm:text-base">
                        Flux consolidé de vulnérabilités, exploits publics et incidents majeurs, mis à jour régulièrement
                        pour alimenter vos opérations de défense et de pentest.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto font-mono">
                        Utilisation typique&nbsp;: veille quotidienne SOC, préparation d&apos;audits, rédaction de rapports et
                        recherche de nouveaux vecteurs d&apos;attaque.
                    </p>
                </header>

                <div>
                    <ThreatIntelFeed />
                </div>
            </div>
        </main>
    );
}
