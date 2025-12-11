'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Cpu, BookOpen, Terminal, Database, FileText, Layers, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Chargement dynamique des composants lourds
const HeroScene = dynamic(
  () => import('@/components/HeroScene'), 
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20" />
    )
  }
);

const CheatsheetCard = dynamic(
  () => import('@/components/CheatsheetCard'), 
  { ssr: false }
);

type Stats = {
  articles: number;
  cheatsheets: number;
  categories: number;
  tutorials: number;
};

type LatestItem = {
  id: string | number;
  type: 'Article' | 'Cheatsheet';
  title: string;
};

// Composant pour l'affichage des cartes de statistiques
function StatsCards({ stats }: { stats: Stats | null }) {
  const loading = !stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
      {[
        {
          id: 'articles',
          key: 'articles',
          label: 'Articles / CVEs',
          bgClass: 'bg-red-900/30',
          borderClass: 'border-red-500',
          textClass: 'text-red-400',
          barGradient: 'from-red-500 via-red-400 to-red-300',
        },
        {
          id: 'cheatsheets',
          key: 'cheatsheets',
          label: 'Cheatsheets',
          bgClass: 'bg-green-900/30',
          borderClass: 'border-green-500',
          textClass: 'text-green-400',
          barGradient: 'from-green-500 via-green-400 to-green-300',
        },
        {
          id: 'categories',
          key: 'categories',
          label: 'Catégories',
          bgClass: 'bg-blue-900/30',
          borderClass: 'border-blue-500',
          textClass: 'text-blue-400',
          barGradient: 'from-blue-500 via-blue-400 to-blue-300',
        },
        {
          id: 'tutorials',
          key: 'tutorials',
          label: 'Tutoriels',
          bgClass: 'bg-purple-900/30',
          borderClass: 'border-purple-500',
          textClass: 'text-purple-400',
          barGradient: 'from-purple-500 via-purple-400 to-purple-300',
        },
      ].map((stat, index) => {
        const value = stats?.[stat.key as keyof Stats] ?? 0;

        return (
        <div 
          key={stat.id}
          className={`${stat.bgClass} border-2 ${stat.borderClass} p-5 sm:p-6 rounded-lg text-center card-hover animate-slide-up min-w-0`}
          style={{
            animationDelay: `${0.1 * (index + 1)}s`,
            viewTransitionName: `stat-${stat.id}`
          }}
        >
          <div className="mb-1 text-xs font-mono uppercase tracking-widest text-gray-400 flex items-center justify-center gap-2">
            <span className={`h-2 w-2 rounded-full ${loading ? 'bg-gray-600 animate-pulse' : 'bg-neon-green animate-pulse-slow'}`} />
            {loading ? 'SYNC EN COURS…' : 'SYNC OK // LIVE DATA'}
          </div>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${stat.textClass} mb-1 leading-none`}>
            {loading ? '—' : value.toLocaleString('fr-FR')}
          </div>
          <div className="text-sm text-gray-200 uppercase font-bold mb-2">{stat.label}</div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full bg-gradient-to-r ${stat.barGradient} transition-all duration-700`}
              style={{ width: loading ? '0%' : `${Math.min(100, 10 + (value % 90))}%` }}
            />
          </div>
        </div>
      );
      })}
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latest, setLatest] = useState<LatestItem[]>([]);
  const [logTime, setLogTime] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setStats(data);
        }
      } catch (e) {
        console.error('❌ Error fetching stats:', e);
      }
    };

    fetchStats();

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/latest');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setLatest(data);
        }
      } catch (e) {
        console.error('❌ Error fetching latest:', e);
      }
    };

    fetchLatest();

    // Initialisation de l'heure d'affichage pour éviter les décalages SSR/CSR
    if (isMounted && !logTime) {
      setLogTime(new Date().toLocaleTimeString('fr-FR'));
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Préchargement des polices et ressources critiques */}
      <link
        rel="preload"
        href="/fonts/space-mono.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Background supplémentaire propre à la home (par-dessus le layout global) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-blue-900/10" />
        <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-purple-500/25 blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
        {/* 3D Scene */}
        <div className="absolute inset-0 -z-10">
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20" />
            }
          >
            <HeroScene />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Bloc gauche : texte principal */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-neon-green/50 rounded-full bg-black/60 backdrop-blur-sm animate-fade-in">
                <Sparkles className="h-4 w-4 text-neon-green" />
                <span className="text-neon-green text-xs sm:text-sm font-mono tracking-widest uppercase">
                  Accestique Node // Cyber Defense Grid ONLINE
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-4 leading-tight">
                <span className="block text-xs sm:text-sm text-cyan-400/80 font-mono mb-2">
                  Base de Connaissances Cybersécurité
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-gradient">
                  ACCESTIQUE
                </span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 font-light max-w-2xl lg:max-w-xl leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.15s' }}
              >
                Une plateforme <span className="text-cyan-400 font-medium">full-stack cybersécurité</span> :
                veille menaces, cheatsheets opérationnelles, tutoriels structurés et workflows prêts à déployer sur le terrain.
              </p>
              <p
                className="text-xs sm:text-sm text-gray-500 font-mono max-w-2xl lg:max-w-xl animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                Objectif&nbsp;: réduire le temps entre <span className="text-cyan-300">"je cherche une commande"</span> et
                <span className="text-cyan-300">"je lance mon opération"</span>.
              </p>

              <div
                className="flex flex-col sm:flex-row items-center gap-4 mb-8 animate-fade-in"
                style={{ animationDelay: '0.25s' }}
              >
                <button className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_24px_rgba(34,211,238,0.7)] neon-button">
                  Démarrer la Mission
                </button>
                <button className="w-full sm:w-auto px-8 py-4 border border-gray-600 hover:border-cyan-400 text-white font-bold rounded-lg transition-all backdrop-blur-sm bg-black/40 hover:bg-black/70 neon-button">
                  Voir la Veille Menaces
                </button>
              </div>

              {/* Mini terminal de statut */}
              <div className="hidden md:block w-full max-w-xl bg-black/70 border border-cyan-500/30 rounded-lg p-3 font-mono text-xs text-gray-300 shadow-[0_0_24px_rgba(8,47,73,0.7)] animate-slide-up" style={{ animationDelay: '0.35s' }}>
                <div className="flex items-center justify-between mb-1 text-[10px] text-gray-500">
                  <span>accestique@core ~/status</span>
                  <span>LATENCY &lt; 80ms // UPTIME 99.9%</span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-cyan-500/40 via-transparent to-cyan-500/40 mb-2" />
                <p>&gt; System check: <span className="text-neon-green">OK</span></p>
                <p>&gt; Knowledge clusters mounted: <span className="text-cyan-400">Academy</span>, <span className="text-cyan-400">Threat Intel</span>, <span className="text-cyan-400">Cheatsheets</span></p>
              </div>
            </div>

            {/* Bloc droit : résumé stats / badges (version compacte pour éviter les chevauchements) */}
            <div className="flex-1 w-full">
              <div className="bg-black/75 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-[0_0_45px_rgba(8,47,73,0.9)] backdrop-blur-md animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.25em]">
                    DATA CLUSTER // LIVE
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/50 text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Liste compacte des stats pour le hero */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-300 font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-gray-800/70">
                    <span className="text-gray-400">Articles / CVEs</span>
                    <span className="text-red-400 font-semibold">
                      {stats ? stats.articles.toLocaleString('fr-FR') : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-800/70">
                    <span className="text-gray-400">Cheatsheets</span>
                    <span className="text-green-400 font-semibold">
                      {stats ? stats.cheatsheets.toLocaleString('fr-FR') : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-800/70">
                    <span className="text-gray-400">Catégories</span>
                    <span className="text-blue-400 font-semibold">
                      {stats ? stats.categories.toLocaleString('fr-FR') : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-400">Tutoriels</span>
                    <span className="text-purple-400 font-semibold">
                      {stats ? stats.tutorials.toLocaleString('fr-FR') : '—'}
                    </span>
                  </div>
                </div>

                {/* Ligne de synthèse */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-gray-400">
                  <p>
                    Total indexé :
                    <span className="text-cyan-400 font-semibold ml-1">
                      {stats
                        ? (stats.articles + stats.cheatsheets + stats.tutorials).toLocaleString('fr-FR')
                        : '—'}{' '}
                      ressources
                    </span>
                  </p>
                  <p className="font-mono text-[10px] sm:text-xs text-gray-500">
                    &gt; Source: Supabase // Articles, Cheatsheets, Tutoriels &amp; Catégories
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Bloc Pour qui ? */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-5 card-hover">
              <p className="font-mono text-xs text-cyan-500 mb-2">// Pour les apprenants</p>
              <h3 className="text-lg font-bold text-white mb-2">Étudiants &amp; autodidactes</h3>
              <p className="text-sm text-gray-400">
                Construire des bases solides en cybersécurité&nbsp;: réseau, Linux, méthodologie offensive, bonnes pratiques.
                Idéal pour préparer des certifications ou des CTF.
              </p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-5 card-hover">
              <p className="font-mono text-xs text-cyan-500 mb-2">// Pour les opérationnels</p>
              <h3 className="text-lg font-bold text-white mb-2">Pentesters &amp; Red Team</h3>
              <p className="text-sm text-gray-400">
                Réduire le temps de préparation d&apos;un engagement&nbsp;: retrouver rapidement la bonne cheatsheet, le bon
                script ou le bon playbook pour chaque phase.
              </p>
            </div>
            <div className="bg-black/60 border border-gray-800 rounded-xl p-5 card-hover">
              <p className="font-mono text-xs text-cyan-500 mb-2">// Pour la défense</p>
              <h3 className="text-lg font-bold text-white mb-2">Blue Team &amp; SOC</h3>
              <p className="text-sm text-gray-400">
                Exploiter la veille et les contenus pour enrichir les détections SIEM/EDR, documenter les incidents et
                alimenter les formations internes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION VALEUR / POURQUOI ACCESTIQUE */}
      <section className="py-18 sm:py-20 bg-gradient-to-b from-black to-cyan-900/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-mono text-xs text-cyan-500/80 mb-2">// Cyber Ops Enablement</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4">
              Pourquoi connecter votre équipe à Accestique ?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
              Réduisez le temps de recherche, standardisez vos playbooks, et alignez équipes Red, Blue et Purple sur une
              <span className="text-cyan-300"> base de connaissances commune et actionnable</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Shield className="h-10 w-10 text-cyan-400 mx-auto" />,
                title: 'Offensive & Red Team',
                description:
                  "Cheatsheets prêtes à l'emploi, modules de pentest, recon et exploitation pour accélérer vos engagements.",
              },
              {
                icon: <Cpu className="h-10 w-10 text-cyan-400 mx-auto" />,
                title: 'Détection & Blue Team',
                description:
                  "Contextes d'attaque, IOC et scénarios pour alimenter vos règles SIEM, détections EDR et tableaux SOC.",
              },
              {
                icon: <Database className="h-10 w-10 text-cyan-400 mx-auto" />,
                title: 'Connaissance Unifiée',
                description:
                  'Une base centralisée de contenus techniques, constamment enrichie avec CVEs, TTPs et guides opérationnels.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="relative overflow-hidden bg-gray-950/70 p-6 rounded-xl border border-cyan-500/25 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] card-hover"
              >
                <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.4),transparent_60%)]" />
                <div className="mb-4 relative z-10">{feature.icon}</div>
                <h3 className="relative z-10 text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="relative z-10 text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION PARCOURS / CTA */}
      <section className="py-16 border-y border-cyan-900/40 bg-black/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center">
            <div>
              <p className="font-mono text-xs text-cyan-500/80 mb-2">// Learning Pipeline</p>
              <h2 className="text-3xl font-bold text-white mb-4">
                Un pipeline complet : de Script Kiddie à Red Teamer.
              </h2>
              <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-xl">
                Parcours débutant, intermédiaire et expert, reliés à des cheatsheets et scénarios d'attaque concrets.
                Optimisé pour l'apprentissage solo comme pour la montée en compétence d'une équipe entière.
              </p>

              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full border border-green-500 flex items-center justify-center text-[10px] text-green-400">
                    01
                  </span>
                  <p className="text-gray-300">
                    <span className="text-green-400">Novice // Script Kiddie :</span> fondamentaux réseaux, Linux, méthodo offensive.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full border border-cyan-500 flex items-center justify-center text-[10px] text-cyan-400">
                    02
                  </span>
                  <p className="text-gray-300">
                    <span className="text-cyan-400">Operative // Pentester :</span> exploitation, mouvement latéral, post-exploitation.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full border border-red-500 flex items-center justify-center text-[10px] text-red-400">
                    03
                  </span>
                  <p className="text-gray-300">
                    <span className="text-red-400">Elite // Red Teamer :</span> campagnes, emulation adversaire, opérations complexes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(8,47,73,0.8)]">
              <p className="font-mono text-xs text-gray-400 mb-4">// Quick Access</p>
              <div className="space-y-3 text-sm">
                <Link
                  href="/academy"
                  className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-gray-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-gray-200">Accéder à l'Académie</span>
                  <span className="text-cyan-400 text-xs font-mono">/academy</span>
                </Link>
                <Link
                  href="/threat-intel"
                  className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-gray-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-gray-200">Scanner les dernières menaces</span>
                  <span className="text-cyan-400 text-xs font-mono">/threat-intel</span>
                </Link>
                <Link
                  href="/cheatsheets"
                  className="flex items-center justify-between p-3 rounded-lg bg-black/60 border border-gray-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-gray-200">Déployer une cheatsheet</span>
                  <span className="text-cyan-400 text-xs font-mono">/cheatsheets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTEURS DE MISSION */}
      <section className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-xs text-cyan-500/80 mb-2">// Mission Profiles</p>
            <h2 className="text-3xl font-bold mb-3 text-white flex items-center justify-center gap-3">
              <span className="w-10 h-px bg-cyan-500 rounded" />
              Secteurs de Mission
              <span className="w-10 h-px bg-cyan-500 rounded" />
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Adaptez vos opérations aux différents fronts : défense SOC, offensive, veille et formation continue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Blue Team', desc: 'Stratégies de défense, corrélation SIEM, playbooks SOC prêts à adapter.' },
              { icon: Terminal, title: 'Red Team', desc: 'Cheatsheets offensives, campagnes, OPSEC et scénarios d’attaque avancés.' },
              { icon: Cpu, title: 'Threat Intel', desc: 'Flux de menaces, CVEs, TTPs et surface d’attaque en constante mise à jour.' },
              { icon: BookOpen, title: 'Académie', desc: "Parcours guidés, modules pédagogiques et documentation structurée." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group p-6 border border-gray-800 bg-gray-950/70 hover:bg-gray-900/80 rounded-xl transition-all cursor-pointer hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
              >
                <item.icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:text-neon-green transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APERÇU CHEATSHEET / OPS */}
      <section className="py-20 bg-gray-950/70 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="font-mono text-xs text-cyan-500/80 mb-2">// Ops Preview</p>
            <h2 className="text-3xl font-bold text-white mb-2">Opérations Instantanées</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Déployez en quelques secondes des commandes de reconnaissance, d’exploitation ou de post-exploitation grâce aux
              cheatsheets prêtes à l’emploi.
            </p>
          </div>

          <CheatsheetCard
            title="Reconnaissance Nmap"
            commands={[
              {
                id: '1',
                tool: 'Nmap',
                command: 'nmap -sC -sV -oN nmap.txt 10.10.10.10',
                description: 'Scan de scripts standard et détection de version sur la cible.',
              },
              {
                id: '2',
                tool: 'Nmap',
                command: 'nmap -p- --min-rate=1000 10.10.10.10',
                description: 'Scan rapide de tous les ports TCP pour cartographier la surface d’attaque.',
              },
              {
                id: '3',
                tool: 'Gobuster',
                command:
                  'gobuster dir -u http://10.10.10.10 -w /usr/share/wordlists/dirb/common.txt',
                description: 'Brute-force des répertoires web pour découvrir des endpoints cachés.',
              },
            ]}
          />
        </div>
      </section>

      {/* CONSOLE / LOGS */}
      <section className="py-12 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/80 border border-cyan-500/30 rounded-xl p-4 sm:p-5 font-mono text-xs text-gray-300 shadow-[0_0_35px_rgba(8,47,73,0.8)]">
            <div className="flex items-center justify-between mb-2 text-[10px] text-gray-500">
              <span>accestique@console ~/ops.log</span>
              <span>MODE: <span className="text-neon-green">TRAINING</span> | OPS | LAB</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 via-transparent to-cyan-500/50 mb-2" />
            <p>&gt; [ {logTime ?? '--:--:--'} ] Session initialisée pour l&apos;opérateur.</p>
            <p>&gt; [ +00:03 ] Chargement du corpus: Articles, Cheatsheets, Tutoriels.</p>
            <p>&gt; [ +00:05 ] Veille menaces synchronisée avec le flux Supabase.</p>
            <p>&gt; [ +00:08 ] Interface interactive prête pour les opérations de test et de formation.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
