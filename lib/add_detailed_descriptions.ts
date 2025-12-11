import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Detailed descriptions for each command
const commandDescriptions: Record<string, Record<string, string>> = {
    'Linux': {
        'uname -a': 'Affiche toutes les informations système : nom du kernel, version, architecture. Essentiel pour identifier les vulnérabilités kernel et choisir les exploits appropriés.',
        'history': 'Affiche l\'historique des commandes exécutées. Peut révéler des mots de passe, chemins sensibles ou actions d\'administrateurs.',
        'sudo -l': 'Liste les commandes que l\'utilisateur actuel peut exécuter avec sudo. Critique pour l\'escalade de privilèges.',
        'find / -perm -4000 2>/dev/null': 'Recherche tous les binaires SUID sur le système. Les binaires SUID mal configurés permettent souvent l\'escalade de privilèges.',
        'ps aux': 'Liste tous les processus en cours avec leurs propriétaires. Utile pour identifier les services vulnérables ou les processus root exploitables.',
        'netstat -tulpn': 'Affiche toutes les connexions réseau actives et les ports en écoute. Permet d\'identifier les services exposés et les backdoors potentielles.',
        'ls -la': 'Liste tous les fichiers avec permissions détaillées, y compris les fichiers cachés. Essentiel pour l\'énumération de répertoires.',
        'cat /etc/passwd': 'Affiche la liste des utilisateurs système. Permet d\'identifier les comptes à cibler pour l\'escalade de privilèges.',
        'w': 'Montre qui est connecté au système et ce qu\'ils font. Utile pour éviter la détection pendant un pentest.',
        'crontab -l': 'Liste les tâches cron de l\'utilisateur actuel. Les scripts cron mal sécurisés peuvent être exploités pour l\'escalade de privilèges.',
    },
    'Windows': {
        'net user': 'Liste tous les comptes utilisateurs locaux. Première étape de l\'énumération Windows pour identifier les cibles.',
        'systeminfo': 'Affiche les informations système détaillées : OS, patches, architecture. Crucial pour identifier les vulnérabilités et exploits applicables.',
        'tasklist': 'Liste tous les processus en cours. Permet d\'identifier les antivirus, EDR et services vulnérables.',
        'netstat -ano': 'Affiche toutes les connexions réseau avec les PID. Utile pour identifier les backdoors et services exposés.',
        'net share': 'Liste tous les partages réseau. Peut révéler des données sensibles accessibles.',
        'net localgroup': 'Affiche les groupes locaux. Permet d\'identifier les membres du groupe Administrateurs.',
        'whoami /priv': 'Affiche les privilèges de l\'utilisateur actuel. Essentiel pour planifier l\'escalade de privilèges.',
        'ipconfig /all': 'Affiche la configuration réseau complète. Utile pour le pivoting et l\'identification du réseau interne.',
    },
    'Nmap': {
        'nmap -sV': 'Scan de détection de version des services. Identifie les versions exactes pour rechercher des exploits spécifiques.',
        'nmap -p-': 'Scan de tous les 65535 ports TCP. Exhaustif mais lent, révèle les services sur ports non-standards.',
        'nmap -sC': 'Exécute les scripts NSE par défaut. Détecte les vulnérabilités courantes et configurations faibles.',
        'nmap -A': 'Scan agressif : détection OS, version, scripts, traceroute. Très bruyant mais très informatif.',
        'nmap -sU': 'Scan UDP des ports courants. Identifie les services UDP comme SNMP, DNS qui sont souvent négligés.',
        'nmap -O': 'Détection du système d\'exploitation via fingerprinting TCP/IP. Aide à choisir les exploits appropriés.',
        'nmap -sS': 'Scan SYN furtif (half-open). Plus discret qu\'un scan TCP connect complet.',
        'nmap --script vuln': 'Exécute tous les scripts de détection de vulnérabilités NSE. Identifie les failles connues automatiquement.',
    },
    'Python': {
        'python3 -m http.server': 'Démarre un serveur HTTP simple. Utile pour exfiltrer des données ou servir des payloads lors d\'un pentest.',
        'pip install': 'Installe un package Python. Permet d\'ajouter rapidement des outils comme requests, pwntools, scapy.',
        'python3 -m venv venv': 'Crée un environnement virtuel isolé. Bonne pratique pour éviter les conflits de dépendances.',
    },
    'Metasploit': {
        'use exploit/': 'Sélectionne un module d\'exploit spécifique. Première étape pour configurer une attaque dans Metasploit.',
        'set RHOSTS': 'Définit la cible de l\'exploit. RHOSTS peut être une IP unique, une plage ou un fichier.',
        'set LHOST': 'Définit l\'IP locale pour le reverse shell. Doit être accessible depuis la cible.',
        'exploit': 'Lance l\'exploitation. Si réussi, ouvre une session Meterpreter ou un shell.',
        'sessions -l': 'Liste toutes les sessions actives. Permet de gérer plusieurs machines compromises.',
        'search': 'Recherche des exploits, payloads ou modules par mot-clé. Essentiel pour trouver le bon outil.',
        'msfvenom': 'Génère un payload Meterpreter. À exécuter sur la cible pour obtenir un shell.',
        'hashdump': 'Dump les hashes NTLM depuis le SAM. Commande Meterpreter pour extraire les mots de passe Windows.',
        'screenshot': 'Prend une capture d\'écran de la machine cible. Commande Meterpreter pour la reconnaissance visuelle.',
    },
    'SQL': {
        '\' OR 1=1--': 'Injection SQL basique pour contourner l\'authentification. Fonctionne si l\'entrée n\'est pas sanitisée.',
        '\' UNION SELECT': 'Début d\'une injection UNION. Permet d\'extraire des données de tables arbitraires.',
        '\' AND SLEEP': 'Injection SQL time-based blind. Si la réponse est retardée, l\'injection fonctionne.',
        'admin\'--': 'Bypass d\'authentification simple. Commente le reste de la requête SQL pour se connecter comme admin.',
    },
    'Netcat': {
        'nc -lvnp': 'Écoute sur un port en mode verbose. Utilisé pour recevoir des reverse shells.',
        'nc -e /bin/bash': 'Envoie un shell bash. Reverse shell classique (nécessite nc avec -e).',
    },
    'Wireshark': {
        'http': 'Filtre pour afficher uniquement le trafic HTTP. Permet d\'analyser les requêtes web et identifier les credentials en clair.',
        'ip.src': 'Filtre par IP source. Isole le trafic provenant d\'une machine spécifique.',
        'tcp.port': 'Filtre par port TCP. Utile pour analyser un service spécifique comme SSH (22) ou HTTP (80).',
        'frame contains': 'Recherche un mot dans tous les paquets. Peut révéler des credentials transmis en clair.',
    },
    'WiFi': {
        'airmon-ng start': 'Active le mode moniteur sur l\'interface WiFi. Nécessaire pour capturer le trafic sans fil.',
        'airodump-ng': 'Scanne tous les réseaux WiFi à portée. Affiche les BSSID, canaux, encryption et clients connectés.',
        'aireplay-ng --deauth': 'Envoie des paquets de deauthentification. Force les clients à se reconnecter pour capturer le handshake.',
        'aircrack-ng': 'Tente de cracker le mot de passe WPA à partir d\'un fichier de capture et d\'une wordlist.',
    },
    'Burp Suite': {
        'Intercept': 'Active l\'interception des requêtes HTTP. Permet de modifier les requêtes avant qu\'elles n\'atteignent le serveur.',
        'Intruder': 'Fuzzing automatisé. Utile pour tester les injections et brute force.',
        'Repeater': 'Modification manuelle de requêtes. Permet de tester différentes payloads rapidement.',
    },
};

async function addDetailedDescriptions() {
    console.log("🔄 Adding detailed descriptions to ALL cheatsheets...\n");

    // Get all cheatsheets
    const { data: allSheets, error } = await supabase
        .from('cheatsheets')
        .select('*')
        .limit(50000);

    if (error || !allSheets) {
        console.error("Error fetching cheatsheets:", error);
        return;
    }

    console.log(`📚 Found ${allSheets.length} cheatsheets to process\n`);

    let updated = 0;
    const batchSize = 100;

    for (let i = 0; i < allSheets.length; i += batchSize) {
        const batch = allSheets.slice(i, i + batchSize);

        for (const sheet of batch) {
            const category = sheet.category;
            const commandData = sheet.command_data || [];

            if (!commandDescriptions[category]) continue;

            let needsUpdate = false;
            const updatedCommands = commandData.map((c: any) => {
                const cmdLine = c.command_line || '';

                // Find matching description
                for (const [cmdPattern, description] of Object.entries(commandDescriptions[category])) {
                    if (cmdLine.includes(cmdPattern)) {
                        needsUpdate = true;
                        return {
                            ...c,
                            description: description
                        };
                    }
                }

                // If no match, keep original or add generic description
                if (!c.description || c.description.startsWith('#')) {
                    needsUpdate = true;
                    return {
                        ...c,
                        description: `Commande ${category} pour pentesting et sécurité offensive.`
                    };
                }

                return c;
            });

            if (needsUpdate) {
                await supabase
                    .from('cheatsheets')
                    .update({ command_data: updatedCommands })
                    .eq('id', sheet.id);

                updated++;
            }
        }

        console.log(`   Progress: ${Math.min(i + batchSize, allSheets.length)}/${allSheets.length} (${updated} updated)`);
    }

    console.log(`\n✅ Updated ${updated} cheatsheets with detailed descriptions!`);
}

addDetailedDescriptions();
