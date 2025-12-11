'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/actions';
import { Database, FileText, Terminal, Layers } from 'lucide-react';

export default function LiveStats({ initialData }: { initialData?: any }) {
    const [stats, setStats] = useState(initialData || { articles: 0, cheatsheets: 0, tutorials: 0, categories: 0 });

    const fetchStats = () => {
        if (!initialData) setStats({ articles: 0, cheatsheets: 0, tutorials: 0, categories: 0 });
        getStats()
            .then(setStats)
            .catch(err => console.error("LiveStats Error:", err));
    };

    useEffect(() => {
        if (!initialData) fetchStats();
    }, []);

    const items = [
        { label: 'Menaces Indexées', count: stats.articles, icon: Database, color: 'text-red-500' },
        { label: 'Cheatsheets', count: stats.cheatsheets, icon: Terminal, color: 'text-neon-green' },
        { label: 'Tutoriels', count: stats.tutorials, icon: FileText, color: 'text-cyan-500' },
        { label: 'Bases de Données', count: stats.categories, icon: Layers, color: 'text-yellow-500' }, // Renamed for effect
    ];

    return (
        <div className="relative group/stats py-6">
            <div className="absolute -top-4 right-0 opacity-0 group-hover/stats:opacity-100 transition-opacity">
                <button onClick={fetchStats} className="text-xs text-cyan-500 hover:text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-cyan-900">
                    ⟳ Actualiser Flux
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-gray-900/80 backdrop-blur border border-gray-800 p-4 rounded-xl flex items-center gap-3 hover:border-cyan-500/30 transition-colors">
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                        <div>
                            <div className="text-2xl font-bold font-mono text-white">
                                {item.count > 0 ? item.count.toLocaleString() : <span className="animate-pulse">...</span>}
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
