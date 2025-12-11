'use client';

import { useEffect, useState } from 'react';
import { Search, Command, X, Filter, Zap } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Rechercher une vulnérabilité, un exploit..." }: SearchBarProps) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = [
        { icon: '🔓', text: 'CVE-2024', label: 'CVE Récentes' },
        { icon: '🦠', text: 'malware', label: 'Malware' },
        { icon: '⚠️', text: 'buffer overflow', label: 'Buffer Overflow' },
        { icon: '💥', text: 'RCE', label: 'Exécution Remote' },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const input = document.getElementById('threat-search') as HTMLInputElement;
                input?.focus();
            }
            if (e.key === 'Escape' && isFocused) {
                const input = document.getElementById('threat-search') as HTMLInputElement;
                input?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onSearch(e.target.value);
    };

    const handleClear = () => {
        setInputValue('');
        onSearch('');
        document.getElementById('threat-search')?.focus();
    };

    const handleSuggestionClick = (text: string) => {
        setInputValue(text);
        onSearch(text);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Backdrop glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

            <div className="relative">
                {/* Main search container */}
                <div className={`relative flex items-center bg-black/60 backdrop-blur-sm border transition-all duration-300 rounded-xl p-4 group ${
                    isFocused 
                        ? 'border-cyan-500/80 bg-black/80 shadow-lg shadow-cyan-500/20' 
                        : 'border-cyan-500/30 bg-black/60 hover:border-cyan-500/50'
                }`}>
                    {/* Search Icon */}
                    <Search className="w-5 h-5 text-cyan-400 flex-shrink-0 transition-colors group-hover:text-cyan-300" />

                    {/* Input */}
                    <input
                        id="threat-search"
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowSuggestions(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 font-mono ml-4 text-sm outline-none"
                    />

                    {/* Clear Button */}
                    {inputValue && (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 hover:text-cyan-400 transition-colors mr-3 p-1 hover:bg-gray-800/50 rounded"
                            title="Effacer la recherche"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Keyboard shortcut hint - Desktop */}
                    <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-gray-700/50">
                        <kbd className="px-3 py-1.5 rounded-lg bg-gray-900/60 border border-gray-700/60 text-xs text-gray-400 font-mono font-bold flex items-center gap-1.5 hover:bg-gray-800/60 transition-colors">
                            <Command className="w-3.5 h-3.5" />
                            K
                        </kbd>
                        {inputValue && (
                            <kbd className="px-2 py-1 rounded bg-gray-900/60 border border-gray-700/60 text-xs text-gray-400 font-mono">
                                ESC
                            </kbd>
                        )}
                    </div>

                    {/* Filter indicator - Tablet */}
                    <div className="hidden md:flex lg:hidden ml-3 text-cyan-400/60">
                        <Filter className="w-4 h-4" />
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && isFocused && !inputValue && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3 space-y-2 z-50 shadow-lg shadow-cyan-500/10">
                        <div className="text-xs font-mono text-gray-500 mb-2 px-2">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Recherches populaires
                        </div>
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion.text)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-black/40 hover:bg-cyan-500/10 transition-colors border border-gray-700/30 hover:border-cyan-500/50 group/btn"
                            >
                                <span className="text-lg">{suggestion.icon}</span>
                                <div className="text-left flex-1">
                                    <p className="text-white text-sm group-hover/btn:text-cyan-300 transition-colors">{suggestion.text}</p>
                                    <p className="text-gray-500 text-xs">{suggestion.label}</p>
                                </div>
                                <div className="text-gray-500 text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity">→</div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Helper text */}
                {isFocused && !inputValue && (
                    <p className="mt-3 text-xs text-gray-500 text-center font-mono">
                        💡 Tapez pour filtrer • <kbd className="bg-gray-900/50 px-1 rounded">ESC</kbd> pour fermer
                    </p>
                )}

                {/* Search results count hint */}
                {inputValue && (
                    <p className="mt-2 text-xs text-cyan-400/70 text-center font-mono animate-pulse">
                        🔍 Filtre actif • Appuyez sur <kbd className="bg-gray-900/50 px-1.5 rounded">ESC</kbd> pour réinitialiser
                    </p>
                )}
            </div>
        </div>
    );
}
