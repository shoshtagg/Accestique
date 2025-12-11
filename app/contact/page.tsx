export default function ContactPage() {
    return (
        <main className="min-h-screen bg-transparent pt-24 px-4 pb-16 flex items-center justify-center">
            <div className="max-w-3xl w-full mx-auto">
                <div className="mb-10 text-center">
                    <p className="font-mono text-sm text-cyan-400/80 mb-2">// Secure Uplink Established</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-neon-green to-cyan-400 text-glow">
                        Contact Opérations Accestique
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                        Canal de contact pour partenariats, signalement de vulnérabilités, demandes de formation ou opérations offensives/défensives.
                    </p>
                </div>

                <div className="grid md:grid-cols-[2fr,1.3fr] gap-6 items-stretch">
                    <div className="bg-black/70 border border-cyan-500/40 rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.25)] card-hover">
                        <p className="font-mono text-xs text-gray-500 mb-3">$ whois contact.accestique</p>
                        <a
                            href="mailto:contact.accestique@gmail.com"
                            className="inline-flex items-center gap-3 text-2xl md:text-3xl font-mono text-cyan-300 hover:text-neon-green transition-colors break-all"
                        >
                            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                            contact.accestique@gmail.com
                        </a>
                        <p className="mt-4 text-gray-400 text-sm">
                            Réponse prioritaire pour :
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-300 font-mono">
                            <li>&gt; Bug bounty &amp; divulgation responsable</li>
                            <li>&gt; Demandes d\'audit de sécurité</li>
                            <li>&gt; Formations &amp; conférences</li>
                        </ul>
                    </div>

                    <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-6 md:p-7 flex flex-col justify-between">
                        <div>
                            <p className="font-mono text-xs text-gray-500 mb-2">// Signal Crypto</p>
                            <p className="text-gray-400 text-sm mb-4">
                                PGP public key en cours de déploiement. Pour les échanges hautement sensibles, indiquez-le dans l\'objet du mail.
                            </p>
                        </div>
                        <div className="mt-4">
                            <p className="font-mono text-xs text-cyan-500/80 mb-1">[Availabilities]</p>
                            <p className="text-xs text-gray-500">Temps de réponse moyen : &lt; 24h ouvrées</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
