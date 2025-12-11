export default function NotFound() {
    return (
        <main className="min-h-screen bg-black pt-20 px-4 pb-20 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 text-glow-red mb-4">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-white mb-4 text-glow">
                        Tutoriel Introuvable
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Le tutoriel que vous recherchez n'existe pas ou a été déplacé.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <a
                        href="/academy"
                        className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all neon-button box-glow"
                    >
                        ← Retour à l'Académie
                    </a>
                    <a
                        href="/"
                        className="px-8 py-4 border border-gray-600 hover:border-white text-white font-bold rounded-lg transition-all neon-button"
                    >
                        Accueil
                    </a>
                </div>

                <div className="mt-12 p-6 bg-gray-900/50 border border-yellow-500/30 rounded-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-yellow-400 font-bold mb-2">💡 Suggestion</p>
                    <p className="text-gray-300 text-sm">
                        Explorez notre bibliothèque de plus de 10 000 tutoriels organisés par niveau de difficulté.
                    </p>
                </div>
            </div>
        </main>
    );
}
