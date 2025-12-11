import { getStats, getCheatsheets, getTutorials, getLatestThreats } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const stats = await getStats();
    const cheatsheets = await getCheatsheets('Tout', 5);
    const tutorials = await getTutorials('Beginner', 5);
    const threats = await getLatestThreats(5);

    return (
        <main className="min-h-screen bg-black text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-cyan-400">🔍 Diagnostic de la Base de Données</h1>

            <div className="space-y-8">
                {/* Stats */}
                <section className="bg-gray-900 p-6 rounded-lg border border-cyan-500">
                    <h2 className="text-2xl font-bold mb-4 text-green-400">📊 Statistiques</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black p-4 rounded">
                            <div className="text-3xl font-mono text-red-500">{stats.articles.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Articles</div>
                        </div>
                        <div className="bg-black p-4 rounded">
                            <div className="text-3xl font-mono text-green-500">{stats.cheatsheets.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Cheatsheets</div>
                        </div>
                        <div className="bg-black p-4 rounded">
                            <div className="text-3xl font-mono text-cyan-500">{stats.tutorials.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Tutoriels</div>
                        </div>
                        <div className="bg-black p-4 rounded">
                            <div className="text-3xl font-mono text-yellow-500">{stats.categories.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Catégories</div>
                        </div>
                    </div>
                </section>

                {/* Sample Cheatsheets */}
                <section className="bg-gray-900 p-6 rounded-lg border border-green-500">
                    <h2 className="text-2xl font-bold mb-4 text-green-400">📜 Échantillon Cheatsheets ({cheatsheets.length})</h2>
                    <div className="space-y-2">
                        {cheatsheets.slice(0, 5).map((sheet: any) => (
                            <div key={sheet.id} className="bg-black p-3 rounded text-sm">
                                <span className="text-cyan-400 font-mono">#{sheet.id}</span> -
                                <span className="text-white ml-2">{sheet.tool_name}</span> -
                                <span className="text-gray-400 ml-2">{sheet.category}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sample Tutorials */}
                <section className="bg-gray-900 p-6 rounded-lg border border-blue-500">
                    <h2 className="text-2xl font-bold mb-4 text-blue-400">📚 Échantillon Tutoriels ({tutorials.length})</h2>
                    <div className="space-y-2">
                        {tutorials.slice(0, 5).map((tut: any) => (
                            <div key={tut.id} className="bg-black p-3 rounded text-sm">
                                <span className="text-cyan-400 font-mono">#{tut.id}</span> -
                                <span className="text-white ml-2">{tut.title}</span> -
                                <span className="text-gray-400 ml-2">[{tut.difficulty}]</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sample Threats */}
                <section className="bg-gray-900 p-6 rounded-lg border border-red-500">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">🚨 Échantillon Articles/Menaces ({threats.length})</h2>
                    <div className="space-y-2">
                        {threats.slice(0, 5).map((threat: any) => (
                            <div key={threat.id} className="bg-black p-3 rounded text-sm">
                                <span className="text-cyan-400 font-mono">#{threat.id}</span> -
                                <span className="text-white ml-2">{threat.title}</span>
                                <div className="text-gray-500 text-xs mt-1">{threat.source_name}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="bg-green-900/30 border border-green-500 p-4 rounded">
                    <p className="text-green-400 font-bold">✅ Si vous voyez des chiffres ci-dessus, la base de données fonctionne parfaitement !</p>
                    <p className="text-gray-400 mt-2">Le problème vient probablement du rendu client-side sur la page d'accueil.</p>
                </div>
            </div>
        </main>
    );
}
