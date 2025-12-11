"use client";

import { useState, useEffect } from "react";
import { Terminal, Shield, Code, ChevronRight } from "lucide-react";
import { getTutorials } from "@/lib/actions";
import Link from "next/link";

type LevelId = "Beginner" | "Intermediate" | "Expert";

const levels: {
  id: LevelId;
  title: string;
  subtitle: string;
  color: string;
  textColor: string;
  icon: typeof Terminal;
}[] = [
  {
    id: "Beginner",
    title: "Novice // Script Kiddie",
    subtitle: "Fondations & premiers labos",
    color: "border-green-500",
    textColor: "text-green-400",
    icon: Terminal,
  },
  {
    id: "Intermediate",
    title: "Operative // Pentester",
    subtitle: "Ops en cours / audits clients",
    color: "border-cyan-500",
    textColor: "text-cyan-400",
    icon: Code,
  },
  {
    id: "Expert",
    title: "Elite // Red Teamer",
    subtitle: "Campagnes offensives avancées",
    color: "border-red-600",
    textColor: "text-red-400",
    icon: Shield,
  },
];

const levelTopics: Record<LevelId, string[]> = {
  Beginner: [
    "Fondations : modèles OSI/TCP-IP, bases Linux & ligne de commande",
    "Premiers scans réseau (Nmap), découverte de services",
    "Introduction au web hacking : requêtes HTTP, cookies, sessions",
    "Méthodologie de base : reconnaissance, énumération, exploitation simple",
  ],
  Intermediate: [
    "Exploitation web intermédiaire : injections, XSS, auth bypass",
    "Escalade de privilèges Linux/Windows, exploitation de services",
    "Active Directory : concepts clés, premiers labos d’attaque",
    "Automatisation (Python, Bash) + outils (Burp, Metasploit, etc.)",
  ],
  Expert: [
    "Chaînage d’exploits et scénarios Red Team de bout en bout",
    "Post-exploitation, pivoting, mouvement latéral",
    "Bypass EDR/SIEM, OPSEC offensive",
    "Préparation de rapports avancés et livrables clients",
  ],
};

function getSeverityInfo(title: string) {
  const parts = title.split(" - ");
  const main = parts[0] ?? title;
  const meta = parts.slice(1).join(" - ");

  let severity: "CRITICAL" | "HIGH" | "UNKNOWN" | "OTHER" = "OTHER";
  if (title.includes("CRITICAL")) severity = "CRITICAL";
  else if (title.includes("HIGH")) severity = "HIGH";
  else if (title.includes("UNKNOWN")) severity = "UNKNOWN";

  return { main, meta, severity };
}

export default function AcademyPage() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("Beginner");
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const BATCH_SIZE = 50;

  useEffect(() => {
    void loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel]);

  const loadInitial = async () => {
    setLoading(true);
    const data = await getTutorials(selectedLevel, BATCH_SIZE, 0);
    setTutorials(data);
    setOffset(BATCH_SIZE);
    setHasMore(data.length === BATCH_SIZE);
    setLoading(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const data = await getTutorials(selectedLevel, BATCH_SIZE, offset);

    if (data.length < BATCH_SIZE) {
      setHasMore(false);
    }

    setTutorials((prev) => [...prev, ...data]);
    setOffset((prev) => prev + BATCH_SIZE);
    setLoadingMore(false);
  };

  const currentLevel = levels.find((l) => l.id === selectedLevel)!;

  return (
    <main className="min-h-screen bg-black pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* HERO ACADEMY - même structure que la home : gauche / droite */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Colonne gauche : texte + niveaux */}
            <div className="flex-1">
              <header className="mb-6">
                <p className="font-mono text-xs text-cyan-500/80 mb-2">// Training Ground</p>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-neon-green to-cyan-400 text-glow">
                  L&apos;Académie Accestique
                </h1>
                <p
                  className="text-gray-300 max-w-xl text-sm sm:text-base"
                >
                  Parcours structuré de <span className="text-cyan-300">Novice</span> à {" "}
                  <span className="text-cyan-300">Red Teamer</span>, relié directement aux cheatsheets et
                  scénarios opérationnels de la plateforme.
                </p>
                <p className="mt-3 text-[11px] sm:text-xs text-gray-500 font-mono max-w-xl">
                  Objectif&nbsp;: te donner une route claire à travers le corpus Accestique, plutôt que de
                  consommer les guides de manière isolée.
                </p>
              </header>

              {/* Bandeau indicateurs */}
              <div className="mb-6 inline-flex flex-wrap items-center justify-start gap-3 px-4 py-2 rounded-full bg-black/60 border border-cyan-900/60 shadow-[0_0_35px_rgba(8,47,73,0.7)]">
                <span className="font-mono text-[11px] text-gray-400">
                  <span className="text-neon-green">3</span> niveaux // Novice → Elite
                </span>
                <span className="h-3 w-px bg-gradient-to-b from-cyan-500/70 via-cyan-400/50 to-transparent" />
                <span className="font-mono text-[11px] text-gray-400">
                  <span className="text-cyan-300">{tutorials.length.toLocaleString("fr-FR")}</span> modules
                  chargés côté client
                </span>
                <span className="h-3 w-px bg-gradient-to-b from-cyan-500/70 via-cyan-400/50 to-transparent" />
                <span className="font-mono text-[11px] text-gray-400">
                  Lié aux <span className="text-cyan-300">cheatsheets</span> &amp; contenus de veille
                </span>
              </div>

              {/* Level Selector */}
              <div className="flex flex-wrap gap-4 mb-6">
                {levels.map((level, index) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-5 py-3 rounded-xl font-mono text-xs sm:text-sm transition-all border-2 neon-button flex items-center gap-3 min-w-[230px] justify-start text-left
                      ${
                        selectedLevel === level.id
                          ? `${level.color} bg-black/70 ${level.textColor} shadow-[0_0_24px_rgba(34,197,94,0.5)]`
                          : "border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-black/60"
                      }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                        selectedLevel === level.id ? level.color : "border-gray-700"
                      } bg-black/80`}
                    >
                      <level.icon
                        className={`w-4 h-4 ${
                          selectedLevel === level.id ? level.textColor : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="uppercase tracking-[0.18em] text-[10px] text-gray-400">
                        {level.id === "Beginner" && "NIVEAU 1"}
                        {level.id === "Intermediate" && "NIVEAU 2"}
                        {level.id === "Expert" && "NIVEAU 3"}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          selectedLevel === level.id ? level.textColor : "text-gray-200"
                        }`}
                      >
                        {level.title}
                      </span>
                      <span className="text-[11px] text-gray-500">{level.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Instruction bloc */}
              <div className="max-w-xl text-xs sm:text-sm text-gray-500 font-mono">
                <p>
                  Sélectionne un niveau pour charger les tutoriels associés. Commence par {""}
                  <span className="text-green-400">Novice</span> si tu découvres la discipline, ou passe directement
                  à <span className="text-red-400">Elite</span> pour des scénarios Red Team avancés.
                </p>
              </div>
            </div>

            {/* Colonne droite : carte niveau courant */}
            <div className="flex-1 w-full">
              <div
                className={`bg-gray-950/80 border-2 ${currentLevel.color} rounded-2xl p-6 sm:p-7 lg:p-8`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <currentLevel.icon
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${currentLevel.textColor}`}
                    />
                    <div>
                      <h2
                        className={`text-xl sm:text-2xl font-mono font-bold uppercase ${currentLevel.textColor}`}
                      >
                        {currentLevel.title}
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        {tutorials.length.toLocaleString("fr-FR")} tutoriels chargés
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/60 text-[10px] font-mono text-emerald-300 tracking-wide">
                      NIVEAU ACTUEL // EN COURS
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Progression estimée : 40%
                    </span>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-black/60 border border-gray-800 px-4 py-3">
                  <p className="font-mono text-[11px] text-cyan-400 mb-2">// Sujets couverts à ce niveau</p>
                  <ul className="text-xs sm:text-sm text-gray-300 space-y-1 list-disc list-inside">
                    {levelTopics[selectedLevel].map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </div>

                {/* Mini jauge de progression visuelle (indicative) */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mb-1">
                    <span>Pipeline d&apos;apprentissage</span>
                    <span>40%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-black/60 overflow-hidden">
                    <div className="h-full w-[40%] bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
                  </div>
                </div>

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

        {/* Liste des tutoriels */}
        <section className="mt-4">
          <div className="bg-black/40 border border-cyan-900/40 rounded-2xl p-5 sm:p-6">
            {loading && (
              <div className="text-center py-10">
                <span className="text-cyan-500 animate-pulse font-mono">Chargement des modules...</span>
              </div>
            )}

            {/* Encart pédagogique : comment utiliser l&apos;Académie */}
            {!loading && (
              <div className="mb-6 rounded-lg border border-gray-800 bg-black/60 px-4 py-3">
                <p className="font-mono text-[11px] text-cyan-400 mb-2">// Comment utiliser l&apos;Académie en 3 étapes</p>
                <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-300 space-y-1">
                  <li>Sélectionne ton niveau (Novice, Operative ou Elite) selon ton expérience actuelle.</li>
                  <li>Parcours les tutoriels proposés et ouvre ceux qui correspondent à tes objectifs du moment.</li>
                  <li>Complète avec les cheatsheets et la veille menaces pour ancrer les techniques vues en lab.</li>
                </ol>
              </div>
            )}

            {!loading && tutorials.length > 0 && (
              <>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mb-4" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tutorials.map((tutorial, i) => {
                    const { main, meta, severity } = getSeverityInfo(tutorial.title || "");

                    const severityColor =
                      severity === "CRITICAL"
                        ? "bg-red-600/80 text-white"
                        : severity === "HIGH"
                        ? "bg-orange-500/80 text-black"
                        : severity === "UNKNOWN"
                        ? "bg-gray-700 text-gray-100"
                        : "bg-slate-700 text-slate-100";

                    // Type de tutoriel approximatif basé sur le titre
                    const lowered = (tutorial.title || "").toLowerCase();
                    let typeLabel = "TUTO";
                    let typeColor = "text-cyan-300 border-cyan-400/60";

                    if (lowered.includes("lab") || lowered.includes("workshop")) {
                      typeLabel = "LAB";
                      typeColor = "text-amber-300 border-amber-400/70";
                    } else if (lowered.includes("cve")) {
                      typeLabel = "CVE";
                      typeColor = "text-fuchsia-300 border-fuchsia-400/70";
                    }

                    return (
                      <Link
                        key={tutorial.id || i}
                        href={`/academy/${tutorial.slug}`}
                        className="flex items-start gap-3 p-4 bg-black/50 rounded border border-gray-800 hover:bg-cyan-900/20 hover:border-cyan-500/60 cursor-pointer transition-all group"
                      >
                        <ChevronRight className="mt-1 w-4 h-4 text-cyan-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-mono text-cyan-200 truncate">{main}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${typeColor}`}
                              >
                                {typeLabel}
                              </span>
                              {severity !== "OTHER" && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${severityColor}`}
                                >
                                  {severity}
                                </span>
                              )}
                            </div>
                          </div>
                          {meta && (
                            <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{meta}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {!loading && tutorials.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Aucun tutoriel disponible pour ce niveau.
              </div>
            )}
          </div>

          {!loading && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_24px_rgba(34,211,238,0.5)]"
              >
                {loadingMore
                  ? "Chargement..."
                  : `Charger ${BATCH_SIZE} tutoriels supplémentaires`}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
