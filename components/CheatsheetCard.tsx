'use client';

import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';

interface Command {
  id: string;
  tool: string;
  command: string;
  description: string;
}

interface CheatsheetCardProps {
  title: string;
  commands: Command[];
}

export default function CheatsheetCard({ title, commands }: CheatsheetCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate intelligent description based on command content
  const cleanDescription = (desc: string, command: string, tool: string): string => {
    // If we have a good description already, use it
    if (desc && !desc.startsWith('#') && !desc.includes('CVE-') && !desc.startsWith('From:') && desc.length > 30) {
      return desc;
    }

    // Analyze command to provide educational description
    const cmd = command.toLowerCase();

    // Linux commands
    if (cmd.includes('uname')) return 'Affiche les informations système (kernel, version, architecture). Utilisé pour identifier les vulnérabilités kernel et choisir les exploits compatibles avec la cible.';
    if (cmd.includes('history')) return 'Affiche l\'historique des commandes shell. Peut révéler des mots de passe en clair, chemins sensibles, ou actions d\'administrateurs précédentes.';
    if (cmd.includes('sudo -l')) return 'Liste les privilèges sudo de l\'utilisateur actuel. Essentiel pour identifier les vecteurs d\'escalade de privilèges via sudo.';
    if (cmd.includes('find') && cmd.includes('4000')) return 'Recherche les binaires SUID sur le système. Les fichiers SUID mal configurés permettent souvent d\'exécuter du code avec les privilèges root.';
    if (cmd.includes('ps aux')) return 'Liste tous les processus en cours d\'exécution. Permet d\'identifier les services vulnérables, processus root exploitables, ou antivirus actifs.';
    if (cmd.includes('netstat')) return 'Affiche les connexions réseau actives et ports en écoute. Utile pour identifier les services exposés, backdoors, ou tunnels établis.';
    if (cmd.includes('ls -la')) return 'Liste tous les fichiers avec permissions détaillées, y compris les fichiers cachés. Première étape de l\'énumération pour trouver des fichiers sensibles.';
    if (cmd.includes('/etc/passwd')) return 'Affiche la liste des comptes utilisateurs système. Permet d\'identifier les comptes à cibler pour l\'escalade de privilèges ou le cracking de mots de passe.';
    if (cmd.includes('crontab')) return 'Affiche les tâches planifiées (cron jobs). Les scripts cron mal sécurisés peuvent être modifiés pour exécuter du code avec des privilèges élevés.';
    if (cmd.includes('bash') && cmd.includes('/dev/tcp')) return 'Établit un reverse shell bash vers l\'attaquant. Permet de prendre le contrôle à distance de la machine compromise sans laisser de fichier sur le disque.';
    if (cmd.includes('wget') || cmd.includes('curl')) return 'Télécharge des fichiers depuis un serveur distant. Utilisé pour transférer des outils, exploits, ou scripts sur la machine cible.';

    // Windows commands
    if (cmd.includes('net user')) return 'Liste tous les comptes utilisateurs Windows locaux. Première étape de l\'énumération pour identifier les comptes administrateurs et utilisateurs actifs.';
    if (cmd.includes('systeminfo')) return 'Affiche les informations système détaillées (OS, patches, architecture). Crucial pour identifier les vulnérabilités non patchées et choisir les exploits appropriés.';
    if (cmd.includes('tasklist')) return 'Liste tous les processus en cours. Permet d\'identifier les antivirus, EDR (Endpoint Detection and Response), et services vulnérables.';
    if (cmd.includes('whoami /priv')) return 'Affiche les privilèges et groupes de l\'utilisateur actuel. Essentiel pour planifier l\'escalade de privilèges et identifier les tokens exploitables.';
    if (cmd.includes('net localgroup')) return 'Affiche les groupes locaux et leurs membres. Permet d\'identifier qui a des privilèges administrateurs sur la machine.';
    if (cmd.includes('ipconfig')) return 'Affiche la configuration réseau complète. Utile pour le pivoting, identifier le réseau interne, et planifier les mouvements latéraux.';
    if (cmd.includes('certutil')) return 'Télécharge des fichiers en contournant les restrictions. Technique native Windows pour exfiltrer des outils sans déclencher les antivirus.';

    // Nmap commands
    if (cmd.includes('nmap -sv')) return 'Scan de détection de version des services. Identifie les versions exactes des logiciels pour rechercher des exploits spécifiques dans les bases CVE.';
    if (cmd.includes('nmap -p-')) return 'Scan exhaustif de tous les 65535 ports TCP. Révèle les services sur ports non-standards souvent négligés par les scans rapides.';
    if (cmd.includes('nmap -sc')) return 'Exécute les scripts NSE (Nmap Scripting Engine) par défaut. Détecte automatiquement les vulnérabilités courantes et configurations faibles.';
    if (cmd.includes('nmap -a')) return 'Scan agressif combinant détection OS, version, scripts et traceroute. Très informatif mais bruyant et facilement détectable par les IDS/IPS.';
    if (cmd.includes('nmap -su')) return 'Scan des ports UDP. Identifie les services UDP comme SNMP, DNS, TFTP qui sont souvent négligés mais peuvent être vulnérables.';
    if (cmd.includes('nmap --script vuln')) return 'Exécute tous les scripts de détection de vulnérabilités NSE. Identifie automatiquement les failles connues comme EternalBlue, Shellshock, etc.';

    // Metasploit commands
    if (cmd.includes('use exploit')) return 'Sélectionne un module d\'exploit Metasploit. Première étape pour configurer et lancer une attaque contre une vulnérabilité spécifique.';
    if (cmd.includes('set rhosts')) return 'Définit la cible de l\'exploit. Peut être une IP unique, une plage CIDR, ou un fichier contenant plusieurs cibles.';
    if (cmd.includes('set lhost')) return 'Définit l\'IP de l\'attaquant pour le reverse shell. Cette IP doit être accessible depuis la cible pour établir la connexion.';
    if (cmd.includes('msfvenom')) return 'Génère un payload personnalisé (reverse shell, bind shell, etc.). Peut être compilé en .exe, .elf, ou autres formats selon la cible.';
    if (cmd.includes('hashdump')) return 'Extrait les hashes NTLM du SAM Windows. Ces hashes peuvent être crackés offline ou utilisés pour des attaques Pass-the-Hash.';
    if (cmd.includes('sessions')) return 'Gère les sessions Meterpreter actives. Permet de basculer entre plusieurs machines compromises et gérer les shells ouverts.';

    // SQL Injection
    if (cmd.includes('\' or 1=1')) return 'Injection SQL basique pour contourner l\'authentification. Fonctionne si l\'application ne valide pas correctement les entrées utilisateur.';
    if (cmd.includes('union select')) return 'Injection SQL UNION pour extraire des données. Permet de récupérer des informations de tables arbitraires en combinant les résultats de requêtes.';
    if (cmd.includes('sleep(')) return 'Injection SQL time-based blind. Si la réponse est retardée, confirme que l\'injection fonctionne même sans message d\'erreur visible.';

    // Netcat
    if (cmd.includes('nc -lvnp')) return 'Écoute sur un port pour recevoir des connexions. Utilisé côté attaquant pour recevoir des reverse shells depuis les machines compromises.';
    if (cmd.includes('nc -e')) return 'Envoie un shell vers l\'attaquant. Établit un reverse shell permettant le contrôle à distance de la machine compromise.';

    // WiFi
    if (cmd.includes('airmon-ng')) return 'Active le mode moniteur sur l\'interface WiFi. Nécessaire pour capturer le trafic sans fil et effectuer des attaques WiFi.';
    if (cmd.includes('airodump-ng')) return 'Scanne les réseaux WiFi à portée. Affiche les BSSID, canaux, type de chiffrement, et clients connectés pour choisir une cible.';
    if (cmd.includes('aireplay-ng') && cmd.includes('deauth')) return 'Envoie des paquets de deauthentification. Force les clients à se reconnecter pour capturer le handshake WPA nécessaire au cracking.';
    if (cmd.includes('aircrack-ng')) return 'Tente de cracker le mot de passe WPA/WPA2. Utilise une wordlist pour tester des millions de combinaisons contre le handshake capturé.';

    // Python
    if (cmd.includes('python') && cmd.includes('http.server')) return 'Démarre un serveur HTTP simple en Python. Utile pour exfiltrer des données, servir des payloads, ou héberger des fichiers pendant un pentest.';
    if (cmd.includes('pip install')) return 'Installe un package Python. Permet d\'ajouter rapidement des bibliothèques comme requests, scapy, pwntools pour le pentesting.';

    // Wireshark
    if (cmd.includes('http') && !cmd.includes('://')) return 'Filtre Wireshark pour afficher uniquement le trafic HTTP. Permet d\'analyser les requêtes web et capturer des credentials transmis en clair.';
    if (cmd.includes('ip.src') || cmd.includes('ip.dst')) return 'Filtre Wireshark par adresse IP. Isole le trafic d\'une machine spécifique pour analyser ses communications réseau.';
    if (cmd.includes('tcp.port')) return 'Filtre Wireshark par port TCP. Utile pour analyser un service spécifique comme SSH (22), HTTP (80), ou RDP (3389).';

    // Burp Suite
    if (cmd.includes('intercept')) return 'Active l\'interception des requêtes HTTP dans Burp. Permet de modifier les requêtes/réponses en temps réel avant qu\'elles n\'atteignent le serveur.';
    if (cmd.includes('intruder')) return 'Outil de fuzzing automatisé de Burp Suite. Teste automatiquement des milliers de payloads pour trouver des injections SQL, XSS, etc.';
    if (cmd.includes('repeater')) return 'Outil de modification manuelle de Burp Suite. Permet de rejouer et modifier des requêtes HTTP pour tester différentes payloads rapidement.';

    // Generic fallback based on tool
    if (tool.includes('Linux')) return 'Commande Linux pour l\'énumération système et l\'escalade de privilèges. Utilisée pendant la phase de post-exploitation pour comprendre l\'environnement.';
    if (tool.includes('Windows')) return 'Commande Windows pour l\'énumération et la collecte d\'informations. Essentielle pour identifier les vecteurs d\'attaque et planifier l\'escalade de privilèges.';
    if (tool.includes('Nmap')) return 'Commande Nmap pour la reconnaissance réseau. Permet de découvrir les hôtes actifs, ports ouverts, et services en cours d\'exécution.';
    if (tool.includes('Metasploit')) return 'Commande Metasploit Framework pour l\'exploitation de vulnérabilités. Outil puissant pour automatiser les attaques et gérer les sessions post-exploitation.';
    if (tool.includes('SQL')) return 'Technique d\'injection SQL pour exploiter les bases de données. Permet d\'extraire, modifier, ou supprimer des données sensibles.';
    if (tool.includes('Python')) return 'Script Python pour l\'automatisation et le pentesting. Permet de créer des outils personnalisés adaptés à des scénarios d\'attaque spécifiques.';
    if (tool.includes('WiFi')) return 'Commande pour le hacking WiFi. Utilisée pour auditer la sécurité des réseaux sans fil et tester la robustesse des mots de passe WPA/WPA2.';
    if (tool.includes('Burp')) return 'Fonctionnalité de Burp Suite pour le test de sécurité web. Outil professionnel pour identifier les vulnérabilités dans les applications web.';
    if (tool.includes('Wireshark')) return 'Filtre Wireshark pour l\'analyse de trafic réseau. Permet de capturer et analyser les paquets pour identifier des failles de sécurité.';
    if (tool.includes('Netcat')) return 'Commande Netcat pour la communication réseau. Outil polyvalent pour établir des shells, transférer des fichiers, ou scanner des ports.';

    // Ultimate fallback
    return 'Technique de sécurité offensive utilisée en pentesting. Consultez la documentation officielle de l\'outil pour plus de détails sur son utilisation et ses options.';
  };

  return (
    <div className="bg-gray-900 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.1)] hover:border-cyan-500/50 transition-all">
      <div className="p-4 border-b border-cyan-500/20 bg-gray-900/80 flex items-center justify-between">
        <h3 className="text-xl font-bold text-cyan-400 font-mono tracking-wider">
          {"> " + title}
        </h3>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {commands.map((cmd) => {
          const cleanDesc = cleanDescription(cmd.description, cmd.command, cmd.tool);

          return (
            <div
              key={cmd.id}
              className="group bg-black/40 border border-gray-800 rounded-lg p-3 hover:border-cyan-500/50 transition-all"
            >
              {/* Description */}
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed">
                  {cleanDesc}
                </p>
              </div>

              {/* Command */}
              <div className="flex items-center justify-between gap-3 bg-gray-950 rounded p-2 border border-gray-800">
                <code className="text-neon-green font-mono text-sm flex-1 break-all">
                  {cmd.command}
                </code>
                <button
                  onClick={() => copyToClipboard(cmd.command, cmd.id)}
                  className="flex-shrink-0 p-1.5 hover:bg-cyan-500/10 rounded transition-colors"
                  title="Copier la commande"
                >
                  {copiedId === cmd.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
