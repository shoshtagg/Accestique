import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface TutorialPageProps {
    params: {
        slug: string;
    };
}

async function getTutorialBySlug(slug: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;
    return data;
}

// Fonction pour rendre le contenu markdown en JSX
function renderMarkdown(content: string) {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Titres
        if (trimmed.startsWith('### ')) {
            elements.push(
                <h3 key={i} className="text-2xl font-bold text-cyan-400 mt-8 mb-4 animate-slide-in-left">
                    {trimmed.substring(4)}
                </h3>
            );
        } else if (trimmed.startsWith('## ')) {
            elements.push(
                <h2 key={i} className="text-3xl font-bold text-cyan-400 mt-10 mb-6 text-glow animate-slide-in-left">
                    {trimmed.substring(3)}
                </h2>
            );
        } else if (trimmed.startsWith('# ')) {
            elements.push(
                <h1 key={i} className="text-4xl font-bold text-white mt-12 mb-8 text-glow animate-slide-in-left">
                    {trimmed.substring(2)}
                </h1>
            );
        }
        // Blocs de code
        else if (trimmed.startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(
                <pre key={i} className="bg-gray-950 p-4 rounded-lg overflow-x-auto my-4 border border-cyan-500/20">
                    <code className="text-neon-green font-mono text-sm whitespace-pre">
                        {codeLines.join('\n')}
                    </code>
                </pre>
            );
        }
        // Listes numérotées
        else if (/^\d+\./.test(trimmed)) {
            const match = trimmed.match(/^(\d+)\.\s+(.+)$/);
            if (match) {
                elements.push(
                    <div key={i} className="flex gap-3 my-2">
                        <span className="text-cyan-400 font-bold flex-shrink-0">{match[1]}.</span>
                        <span className="text-gray-300">{match[2]}</span>
                    </div>
                );
            }
        }
        // Listes à puces
        else if (trimmed.startsWith('- ')) {
            elements.push(
                <div key={i} className="flex gap-3 my-2">
                    <span className="text-cyan-400 flex-shrink-0">•</span>
                    <span className="text-gray-300">{trimmed.substring(2)}</span>
                </div>
            );
        }
        // Paragraphes
        else if (trimmed.length > 0) {
            elements.push(
                <p key={i} className="my-4 text-gray-300 leading-relaxed">
                    {trimmed}
                </p>
            );
        }

        i++;
    }

    return elements;
}

export default async function TutorialPage({ params }: TutorialPageProps) {
    const tutorial = await getTutorialBySlug(params.slug);

    if (!tutorial) {
        notFound();
    }

    const difficultyColors = {
        'Beginner': 'text-green-400 border-green-500 bg-green-500/10',
        'Intermediate': 'text-cyan-400 border-cyan-500 bg-cyan-500/10',
        'Expert': 'text-red-400 border-red-500 bg-red-500/10',
    };

    const difficultyColor = difficultyColors[tutorial.difficulty as keyof typeof difficultyColors] || difficultyColors.Beginner;

    return (
        <main className="min-h-screen bg-black pt-20 px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/academy"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded border border-cyan-500/30 hover:border-cyan-400/60 bg-black/30 transition-all text-sm font-mono"
                    >
                        ← Retour à l'Académie
                    </Link>
                </div>

                {/* Tutorial Header */}
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            {tutorial.title}
                        </h1>
                        <span className={`px-4 py-2 rounded border text-xs font-bold whitespace-nowrap ${difficultyColor}`}>
                            {tutorial.difficulty}
                        </span>
                    </div>

                    {tutorial.section && (
                        <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
                            <Target className="w-4 h-4" />
                            <span>{tutorial.section}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(tutorial.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{tutorial.difficulty}</span>
                        </div>
                    </div>
                </div>

                {/* Tutorial Content */}
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 mb-8">
                    <div className="text-gray-300 leading-relaxed space-y-4">
                        {renderMarkdown(tutorial.content)}
                    </div>

                    {/* Commands Section */}
                    {tutorial.commands && tutorial.commands.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-cyan-500/20">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Commandes Clés
                            </h2>
                            <div className="space-y-4">
                                {tutorial.commands.map((cmd: any, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-black/50 border border-cyan-500/20 rounded-lg p-4"
                                    >
                                        {cmd.description && (
                                            <p className="text-gray-400 text-sm mb-3">{cmd.description}</p>
                                        )}
                                        <pre className="bg-black/40 p-3 rounded border border-gray-800/50 overflow-x-auto">
                                            <code className="text-neon-green font-mono text-xs">
                                                {cmd.command || cmd.command_line || cmd}
                                            </code>
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Footer */}
                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link
                        href="/academy"
                        className="w-full sm:w-auto px-6 py-3 bg-black/30 border border-gray-600/60 hover:border-gray-500 hover:bg-gray-700/30 text-white rounded-lg transition-all text-sm font-mono text-center"
                    >
                        ← Tous les tutoriels
                    </Link>
                    <Link
                        href="/cheatsheets"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all text-sm font-mono text-center"
                    >
                        Voir les Cheatsheets →
                    </Link>
                </div>
            </div>
        </main>
    );
}
