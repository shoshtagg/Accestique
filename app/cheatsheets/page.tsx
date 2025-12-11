'use client';

import { useState, useEffect } from 'react';
import CheatsheetCard from '@/components/CheatsheetCard';
import { getCheatsheets } from '@/lib/actions';
import Link from 'next/link';

// Common Categories for quick filtering - Updated to match database
const CATEGORIES = ["Tout", "Web Security", "Exploits", "Linux", "Windows", "SQL", "Python", "Metasploit", "Nmap", "WiFi", "Burp Suite", "Netcat", "Wireshark", "General"];

// Category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "Tout": "Toutes les catégories confondues - Explorez l'intégralité de notre bibliothèque de commandes et techniques.",
    "Web Security": "Techniques de sécurité web : XSS, CSRF, OWASP Top 10, injections, contournement d'authentification, et exploitation d'applications web.",
    "Exploits": "CVE, vulnérabilités connues, proof-of-concepts et exploits publics pour tests de pénétration et recherche en sécurité.",
    "Linux": "Commandes Linux pour pentesting : escalade de privilèges, énumération système, SUID, reverse shells, et exploitation de configurations.",
    "Windows": "PowerShell, CMD, Active Directory, exploitation Windows, dump SAM/NTDS, contournement UAC et post-exploitation.",
    "SQL": "Injections SQL : Union-based, Boolean-based, Time-based, extraction de données, contournement WAF et exploitation de bases de données.",
    "Python": "Scripts Python pour hacking : serveurs HTTP, reverse shells, scanners, automatisation et outils de pentesting personnalisés.",
    "Metasploit": "Framework Metasploit : exploitation, payloads, Meterpreter, post-exploitation, pivoting et sessions interactives.",
    "Nmap": "Scans réseau avec Nmap : découverte d'hôtes, énumération de ports, détection de services, scripts NSE et fingerprinting OS.",
    "WiFi": "Hacking WiFi : Aircrack-ng, capture de handshakes WPA, attaques deauth, cracking de mots de passe et rogue AP.",
    "Burp Suite": "Proxy d'interception Burp : scanner de vulnérabilités, Intruder, Repeater, manipulation de requêtes HTTP et testing web.",
    "Netcat": "Swiss Army Knife du réseau : reverse shells, bind shells, transfert de fichiers, port scanning et backdoors.",
    "Wireshark": "Analyse de paquets réseau : filtres de capture, suivi de flux TCP, extraction de credentials et forensics réseau.",
    "General": "Outils et techniques diverses : cryptographie, forensics, OSINT, social engineering et méthodologies de pentesting."
};

export default function CheatsheetsPage() {
    const [selectedCat, setSelectedCat] = useState("Tout");
    const [cheatsheets, setCheatsheets] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const BATCH_SIZE = 100;

    // Reset when category changes
    useEffect(() => {
        setCheatsheets([]);
        setOffset(0);
        setHasMore(true);
        loadInitial();
    }, [selectedCat]);

    const loadInitial = async () => {
        setLoading(true);
        const data = await getCheatsheets(selectedCat, BATCH_SIZE, 0);
        setCheatsheets(data);
        setOffset(BATCH_SIZE);
        setHasMore(data.length === BATCH_SIZE);
        setLoading(false);
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const data = await getCheatsheets(selectedCat, BATCH_SIZE, offset);

        if (data.length < BATCH_SIZE) {
            setHasMore(false);
        }

        setCheatsheets(prev => [...prev, ...data]);
        setOffset(prev => prev + BATCH_SIZE);
        setLoadingMore(false);
    };

    return (
        <main className="min-h-screen bg-black pt-24 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* HERO CHEATSHEETS - même structure que academy : gauche / droite */}
                <section className="mb-16">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                        {/* Colonne gauche : texte + catégories */}
                        <div className="flex-1">
                            <header className="mb-8">
                                <p className="font-mono text-xs text-cyan-500/80 mb-2">// Ops Library</p>
                                <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-neon-green to-cyan-400 text-glow">
                                    Cheatsheets Opérationnelles
                                </h1>
                                <p className="text-gray-300 max-w-xl text-sm sm:text-base">
                                    Commandes essentielles, snippets et workflows prêts à copier/coller pour vos audits, CTF et opérations
                                    offensives/défensives.
                                </p>
                            </header>

                            {/* Category Filter */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                    <span className="text-xl">🏷️</span>
                                    Filtrer par catégorie
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCat(cat)}
                                            className={`px-4 py-3 rounded-xl font-mono text-xs sm:text-sm transition-all border-2 neon-button relative overflow-hidden group ${
                                                selectedCat === cat
                                                    ? 'bg-cyan-600 text-black font-bold box-glow border-cyan-400'
                                                    : 'bg-gray-900/50 text-gray-300 border-gray-700 hover:border-cyan-400/50 hover:bg-gray-800'
                                            }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-1">
                                                <span>{cat}</span>
                                                {selectedCat === cat && <span className="text-lg">✓</span>}
                                            </span>
                                            {selectedCat !== cat && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Instruction bloc */}
                            <div className="max-w-xl text-xs sm:text-sm text-gray-500 font-mono">
                                <p>
                                    Sélectionne une catégorie pour filtrer les cheatsheets. Ou explore l'intégralité de la bibliothèque avec {""}
                                    <span className="text-cyan-400">Tout</span>.
                                </p>
                            </div>
                        </div>

                        {/* Colonne droite : carte catégorie actuelle */}
                        <div className="flex-1 w-full">
                            <div className="bg-gray-950/80 border-2 border-cyan-500 rounded-2xl p-6 sm:p-7 lg:p-8">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-cyan-400 text-2xl">🔧</div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-mono font-bold uppercase text-cyan-400">
                                                {selectedCat}
                                            </h2>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                                Catégorie sélectionnée
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/60 text-[10px] font-mono text-cyan-300 tracking-wide">
                                            PROFIL D'UTILISATION
                                        </span>
                                    </div>
                                </div>

                                {CATEGORY_DESCRIPTIONS[selectedCat] && (
                                    <div className="rounded-lg bg-black/60 border border-gray-800 px-4 py-3">
                                        <p className="font-mono text-[11px] text-cyan-400 mb-2">// Description</p>
                                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                            {CATEGORY_DESCRIPTIONS[selectedCat]}
                                        </p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-center py-6">
                                        <span className="text-cyan-500 animate-pulse font-mono text-xs">
                                            Chargement des modules...
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Liste des cheatsheets */}
                <section className="mt-4">
                    <div className="bg-black/40 border border-cyan-900/40 rounded-2xl p-5 sm:p-6">
                        {/* Encart pédagogique : comment utiliser cette page */}
                        {!loading && (
                            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-2 border-cyan-700/40 rounded-xl p-6 sm:p-8 backdrop-blur-sm mb-8 hover:border-cyan-500/70 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-600/30 border border-cyan-500/50">
                                            <span className="text-lg font-bold text-cyan-400">📖</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-1">Comment utiliser cette page</h3>
                                        <p className="text-xs sm:text-sm text-gray-400">Suivez ces 3 étapes simples pour maîtriser les cheatsheets</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {[
                                        { step: 1, icon: '🏷️', title: 'Filtrer par catégorie', desc: 'Sélectionne une catégorie (ou explore "Tout") pour filtrer les cheatsheets par domaine.' },
                                        { step: 2, icon: '🔍', title: 'Parcourir les cheatsheets', desc: 'Parcours les cheatsheets proposés et ouvre celui qui correspond à ton besoin immédiat.' },
                                        { step: 3, icon: '⚙️', title: 'Exécuter et apprendre', desc: 'Copie les commandes, exécute-les dans ton environnement, et complète avec l\'Académie pour le contexte.' }
                                    ].map((item) => (
                                        <div key={item.step} className="flex gap-4 group">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-600/40 to-blue-600/40 border border-cyan-500/40 group-hover:border-cyan-400/70 transition-colors">
                                                    <span className="text-sm font-bold text-cyan-300 group-hover:text-cyan-200">{item.step}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-base">{item.icon}</span>
                                                    <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pl-6">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-cyan-700/20">
                                    <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                        <span className="text-cyan-400">💡</span>
                                        Astuce : Utilisez la recherche pour trouver rapidement des commandes spécifiques
                                    </p>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-10">
                                <span className="text-cyan-500 animate-pulse font-mono">Chargement des modules...</span>
                            </div>
                        )}

                        {!loading && cheatsheets.length > 0 && (
                            <>
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mb-4" />
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {cheatsheets.map((sheet, idx) => (
                                        <Link
                                            key={`${sheet.id}-${idx}`}
                                            href={`/cheatsheets/${sheet.id}`}
                                            className="block hover:scale-[1.02] transition-transform"
                                        >
                                            <CheatsheetCard
                                                title={sheet.tool_name + ' - ' + sheet.category}
                                                commands={Array.isArray(sheet.command_data) ? sheet.command_data.map((c: any, i: number) => ({
                                                    id: `${sheet.id}-${i}`,
                                                    tool: sheet.tool_name,
                                                    command: c.command_line || c.command,
                                                    description: c.description
                                                })) : []}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        {!loading && cheatsheets.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                Aucun résultat pour cette catégorie.
                            </div>
                        )}
                    </div>

                    {/* Load More Button */}
                    {!loading && hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_24px_rgba(34,211,238,0.5)]"
                            >
                                {loadingMore ? 'Chargement...' : `Charger ${BATCH_SIZE} cheatsheets supplémentaires`}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">
                                {cheatsheets.length.toLocaleString('fr-FR')} cheatsheets affichés
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
