'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import { getLatestThreats, searchThreats } from '@/lib/actions';
import { AlertTriangle, Shield, Clock, ExternalLink, Zap } from 'lucide-react';

export default function ThreatIntelFeed() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const BATCH_SIZE = 100;

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getLatestThreats(BATCH_SIZE, 0);
        setArticles(data);
        setOffset(BATCH_SIZE);
        setHasMore(data.length === BATCH_SIZE);
        setLoading(false);
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore || searchQuery) return;

        setLoadingMore(true);
        const data = await getLatestThreats(BATCH_SIZE, offset);

        if (data.length < BATCH_SIZE) {
            setHasMore(false);
        }

        setArticles(prev => [...prev, ...data]);
        setOffset(prev => prev + BATCH_SIZE);
        setLoadingMore(false);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query) {
            loadData();
            return;
        }
        setLoading(true);
        const data = await searchThreats(query);
        setArticles(data);
        setHasMore(false); // Disable load more during search
        setLoading(false);
    };

    // Déterminer le niveau de sévérité
    const getSeverityLevel = (title: string) => {
        if (title.includes('CRITICAL') || title.includes('CRITICAL')) return { level: 'CRITIQUE', color: 'red' };
        if (title.includes('HIGH')) return { level: 'ÉLEVÉE', color: 'orange' };
        if (title.includes('MEDIUM')) return { level: 'MOYENNE', color: 'yellow' };
        return { level: 'BASSE', color: 'gray' };
    };

    // Déterminer le type de menace
    const getThreatType = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('cve') || cat.includes('exploit')) return '🔓 CVE/Exploit';
        if (cat.includes('malware')) return '🦠 Malware';
        if (cat.includes('breach')) return '⚠️ Breach';
        if (cat.includes('vulnerability')) return '🔓 Vulnérabilité';
        return '🎯 Menace';
    };

    return (
        <div>
            {/* Search Section */}
            <div className="mb-12">
                <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-2 border-red-700/40 rounded-2xl p-8 backdrop-blur-sm mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                        <h2 className="text-xl font-bold text-red-400">Recherche Avancée</h2>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <div className="mt-4 text-sm text-gray-400 flex items-center justify-between">
                        <span className="font-mono">
                            {articles.length.toLocaleString('fr-FR')} menaces affichées
                        </span>
                        {hasMore && !searchQuery && (
                            <span className="text-cyan-400 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                Scroll pour charger plus
                            </span>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                            <p className="text-cyan-500 font-mono text-sm">Accès au Mainframe...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* CVE Feed Grid */}
            {!loading && articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.map((article) => {
                        const severity = getSeverityLevel(article.title);
                        const threatType = getThreatType(article.categories?.[0]);
                        const severityColors = {
                            red: 'from-red-900/30 border-red-700/40 hover:border-red-500/70',
                            orange: 'from-orange-900/30 border-orange-700/40 hover:border-orange-500/70',
                            yellow: 'from-yellow-900/30 border-yellow-700/40 hover:border-yellow-500/70',
                            gray: 'from-gray-900/30 border-gray-700/40 hover:border-gray-500/70'
                        };
                        const colorClass = severityColors[severity.color as keyof typeof severityColors];
                        
                        const severityBadgeColors = {
                            red: 'bg-red-600/30 border-red-500/60 text-red-300',
                            orange: 'bg-orange-600/30 border-orange-500/60 text-orange-300',
                            yellow: 'bg-yellow-600/30 border-yellow-500/60 text-yellow-300',
                            gray: 'bg-gray-600/30 border-gray-500/60 text-gray-300'
                        };
                        const badgeClass = severityBadgeColors[severity.color as keyof typeof severityBadgeColors];

                        return (
                            <article 
                                key={article.id} 
                                className={`group bg-gradient-to-br ${colorClass} rounded-xl border-2 p-6 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/20 flex flex-col h-full`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1">
                                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                            {threatType}
                                        </span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase whitespace-nowrap ${badgeClass}`}>
                                        {severity.level}
                                    </div>
                                </div>

                                {/* Title / CVE */}
                                <a 
                                    href={article.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group/link flex-1"
                                >
                                    <h2 className="text-sm md:text-base font-bold text-white mb-3 leading-snug group-hover/link:text-cyan-300 transition-colors line-clamp-3">
                                        {article.title}
                                    </h2>
                                </a>

                                {/* Summary */}
                                <p className="text-xs md:text-sm text-gray-400 mb-4 leading-relaxed line-clamp-4 flex-1">
                                    {article.summary}
                                </p>

                                {/* Footer */}
                                <div className="border-t border-gray-700/40 pt-3 space-y-2">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3 h-3 text-gray-600" />
                                            <span className="font-mono">{article.source_name}</span>
                                        </div>
                                        <a 
                                            href={article.source_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                            title="Ouvrir la source"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Clock className="w-3 h-3" />
                                        <span className="font-mono">
                                            {new Date(article.published_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* External link indicator */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="text-center py-20">
                    <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 font-mono">Aucune menace trouvée. Veuillez refiner votre recherche.</p>
                </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && !searchQuery && (
                <div className="text-center mt-14">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-red-500/30 font-mono text-sm"
                    >
                        {loadingMore ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⚙️</span>
                                Chargement...
                            </span>
                        ) : (
                            `Charger ${BATCH_SIZE} articles supplémentaires`
                        )}
                    </button>
                    <p className="text-sm text-gray-500 mt-4 font-mono">
                        📊 Environ {(10000 - articles.length).toLocaleString('fr-FR')} articles supplémentaires disponibles
                    </p>
                </div>
            )}
        </div>
    );
}
