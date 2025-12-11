'use client';

import { useState } from 'react';
import { Copy, Check, Info, AlertCircle, Code2 } from 'lucide-react';

interface CommandDisplayProps {
    commands: any[];
}

export default function CommandDisplay({ commands }: CommandDisplayProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Extract reference/CVE info from description if available
    const extractRefInfo = (desc: string) => {
        const refMatch = desc.match(/# Reference:\s*(.+?)(?:\n|$)/);
        return refMatch ? refMatch[1].trim() : null;
    };

    return (
        <div className="space-y-6">
            {commands.map((cmd: any, index: number) => {
                const refInfo = extractRefInfo(cmd.description || '');
                const cleanDesc = (cmd.description || '').replace(/# Reference:.+?(?:\n|$)/, '').trim();

                return (
                    <div
                        key={index}
                        className="group bg-gradient-to-br from-black/60 to-black/40 border-2 border-cyan-700/40 rounded-xl overflow-hidden hover:border-cyan-500/70 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20"
                    >
                        {/* Header avec numéro et badge */}
                        <div className="bg-gradient-to-r from-cyan-900/20 to-transparent px-6 py-3 border-b border-cyan-700/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center">
                                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                                </div>
                                <span className="text-sm font-mono font-bold text-cyan-400">
                                    Cmd #{index + 1}
                                </span>
                            </div>
                            <div className="text-xs font-mono text-gray-500">
                                Technique d'attaque
                            </div>
                        </div>

                        {/* Description Section */}
                        {cleanDesc && (
                            <div className="px-6 py-4 border-b border-cyan-700/20">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <div className="p-2 bg-cyan-500/15 rounded-lg border border-cyan-500/30">
                                            <AlertCircle className="w-4 h-4 text-cyan-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                                            {cleanDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reference Info */}
                        {refInfo && (
                            <div className="px-6 py-3 bg-yellow-900/15 border-b border-cyan-700/20 border-yellow-700/20">
                                <div className="flex items-start gap-3">
                                    <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-mono text-yellow-600 mb-1 uppercase tracking-wider">Référence</p>
                                        <p className="text-sm text-yellow-200 break-words leading-relaxed">
                                            {refInfo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Command Section */}
                        <div className="px-6 py-4">
                            <div className="bg-gray-950/90 rounded-lg p-4 border border-gray-800/60 overflow-hidden group/code hover:border-cyan-600/40 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <pre className="overflow-x-auto">
                                            <code className="text-neon-green font-mono text-xs md:text-sm whitespace-pre-wrap break-words leading-relaxed block">
                                                {cmd.command_line || cmd.command || JSON.stringify(cmd)}
                                            </code>
                                        </pre>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(cmd.command_line || cmd.command || '', index)}
                                        className="flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 hover:bg-cyan-500/20 active:scale-95 group/btn"
                                        title="Copier la commande"
                                    >
                                        {copiedIndex === index ? (
                                            <div className="flex items-center gap-1.5">
                                                <Check className="w-4 h-4 text-green-400 animate-pulse" />
                                                <span className="text-xs text-green-400 font-mono hidden sm:inline">Copié!</span>
                                            </div>
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-400 group-hover/btn:text-cyan-400 transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-black/40 border-t border-cyan-700/20 flex items-center justify-between text-xs">
                            <span className="font-mono text-gray-600">
                                {cmd.tool || 'General'}
                            </span>
                            <span className="text-gray-600">Appuyez pour copier</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
