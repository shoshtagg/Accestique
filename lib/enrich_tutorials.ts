import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate detailed tutorial content based on difficulty
function generateTutorialContent(title: string, difficulty: string, summary: string): string {
    const intro = difficulty === 'Beginner'
        ? `# Introduction pour Débutants\n\nCe guide est conçu pour les personnes qui débutent en cybersécurité. Nous allons explorer ${title} de manière progressive et accessible.\n\n`
        : difficulty === 'Intermediate'
            ? `# Guide Intermédiaire\n\nCe tutoriel s'adresse aux praticiens ayant des bases en sécurité offensive. Nous approfondirons ${title} avec des techniques avancées.\n\n`
            : `# Guide Expert\n\nCe module avancé couvre ${title} en profondeur. Destiné aux pentesters expérimentés et red teamers.\n\n`;

    const context = `## Contexte\n\n${summary || 'Cette vulnérabilité ou technique est importante dans le contexte de la sécurité offensive moderne.'}\n\n`;

    const objectives = difficulty === 'Beginner'
        ? `## Objectifs d'Apprentissage\n\n- Comprendre les concepts de base\n- Identifier les vecteurs d'attaque\n- Apprendre les outils essentiels\n- Pratiquer dans un environnement contrôlé\n\n`
        : difficulty === 'Intermediate'
            ? `## Objectifs\n\n- Maîtriser les techniques d'exploitation\n- Comprendre les mécanismes de défense\n- Développer des stratégies d'attaque\n- Analyser les résultats et pivoting\n\n`
            : `## Objectifs Avancés\n\n- Exploitation complexe et chaînage d'attaques\n- Contournement des protections modernes\n- Développement de payloads personnalisés\n- Post-exploitation et persistance\n\n`;

    const prerequisites = difficulty === 'Beginner'
        ? `## Prérequis\n\n- Connaissances de base en ligne de commande Linux/Windows\n- Compréhension des réseaux TCP/IP\n- Machine virtuelle de test (Kali Linux recommandé)\n- Environnement de lab sécurisé\n\n`
        : difficulty === 'Intermediate'
            ? `## Prérequis\n\n- Expérience en pentesting basique\n- Maîtrise des outils Metasploit, Nmap, Burp Suite\n- Compréhension des protocoles réseau\n- Connaissance en scripting (Python, Bash)\n\n`
            : `## Prérequis\n\n- Expérience significative en red teaming\n- Maîtrise avancée des frameworks d'exploitation\n- Compétences en développement d'exploits\n- Connaissance approfondie des systèmes d'exploitation\n\n`;

    const methodology = `## Méthodologie\n\n### Phase 1: Reconnaissance\n\nLa première étape consiste à collecter un maximum d'informations sur la cible :\n\n- **Énumération passive** : OSINT, recherche DNS, analyse de métadonnées\n- **Énumération active** : Scans de ports, détection de services, fingerprinting\n- **Cartographie du réseau** : Identification de la topologie et des points d'entrée\n\n### Phase 2: Analyse de Vulnérabilités\n\nIdentification des failles exploitables :\n\n- Scan automatisé avec Nessus, OpenVAS, ou Nmap NSE\n- Analyse manuelle des services exposés\n- Recherche de CVE correspondantes\n- Évaluation de la surface d'attaque\n\n### Phase 3: Exploitation\n\nExploitation des vulnérabilités identifiées :\n\n- Sélection et configuration de l'exploit approprié\n- Test dans un environnement de lab\n- Exécution contrôlée sur la cible\n- Établissement d'un accès initial\n\n### Phase 4: Post-Exploitation\n\nConsolidation de l'accès et progression :\n\n- Escalade de privilèges\n- Collecte de credentials\n- Pivoting vers d'autres systèmes\n- Établissement de persistance\n\n`;

    const tools = difficulty === 'Beginner'
        ? `## Outils Essentiels\n\n### Nmap\nScanner de réseau pour la découverte d'hôtes et de services.\n\`\`\`bash\nnmap -sV -sC <target>\n\`\`\`\n\n### Metasploit Framework\nPlateforme d'exploitation complète.\n\`\`\`bash\nmsfconsole\nuse exploit/...\n\`\`\`\n\n### Burp Suite\nProxy d'interception pour le test d'applications web.\n\n`
        : difficulty === 'Intermediate'
            ? `## Outils Avancés\n\n### Metasploit + Meterpreter\nExploitation et post-exploitation avancée.\n\n### Cobalt Strike\nFramework de red teaming professionnel.\n\n### BloodHound\nAnalyse des chemins d'attaque Active Directory.\n\n### Empire/Covenant\nFrameworks C2 pour post-exploitation.\n\n`
            : `## Arsenal Expert\n\n### Développement d'Exploits\n- Fuzzing avec AFL, Boofuzz\n- Analyse de binaires avec IDA Pro, Ghidra\n- Développement de shellcode personnalisé\n\n### Infrastructure C2\n- Cobalt Strike avec malleable profiles\n- Redirecteurs et domain fronting\n- Exfiltration covert channels\n\n### Techniques d'Évasion\n- Obfuscation de payloads\n- Contournement EDR/AV\n- Living off the land (LOLBins)\n\n`;

    const practicalExample = `## Exemple Pratique\n\n### Scénario\n\nVous êtes engagé pour tester la sécurité d'une infrastructure d'entreprise. Voici comment procéder :\n\n**Étape 1 : Reconnaissance**\n\`\`\`bash\n# Scan initial\nnmap -sn 192.168.1.0/24\n\n# Scan détaillé des hôtes actifs\nnmap -sV -sC -p- 192.168.1.10\n\`\`\`\n\n**Étape 2 : Identification des Vulnérabilités**\n\`\`\`bash\n# Scripts de vulnérabilités Nmap\nnmap --script vuln 192.168.1.10\n\n# Recherche de CVE\nsearchsploit <service_name> <version>\n\`\`\`\n\n**Étape 3 : Exploitation**\n\`\`\`bash\n# Lancement de Metasploit\nmsfconsole\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS 192.168.1.10\nset LHOST 192.168.1.5\nexploit\n\`\`\`\n\n**Étape 4 : Post-Exploitation**\n\`\`\`bash\n# Dans Meterpreter\ngetuid\nhashdump\nscreenshot\n\`\`\`\n\n`;

    const bestPractices = `## Bonnes Pratiques\n\n### Sécurité Opérationnelle\n\n- **Toujours obtenir une autorisation écrite** avant tout test\n- **Documenter toutes les actions** pour le rapport final\n- **Utiliser un VPN** pour masquer votre IP source\n- **Nettoyer les traces** après le test (logs, fichiers temporaires)\n\n### Méthodologie\n\n- Suivre une approche systématique et reproductible\n- Tester dans un lab avant la production\n- Maintenir une communication constante avec le client\n- Respecter le scope défini dans le contrat\n\n### Éthique\n\n- Ne jamais exfiltrer de données réelles\n- Respecter la confidentialité des informations découvertes\n- Signaler immédiatement les vulnérabilités critiques\n- Ne pas causer de dommages aux systèmes testés\n\n`;

    const resources = `## Ressources Complémentaires\n\n### Documentation Officielle\n\n- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)\n- [PTES - Penetration Testing Execution Standard](http://www.pentest-standard.org/)\n- [MITRE ATT&CK Framework](https://attack.mitre.org/)\n\n### Formations Recommandées\n\n- **Offensive Security** : OSCP, OSEP, OSED\n- **eLearnSecurity** : eCPPT, eCPTX\n- **SANS** : GPEN, GWAPT, GXPN\n\n### Labs de Pratique\n\n- **HackTheBox** : Machines réalistes pour s'entraîner\n- **TryHackMe** : Parcours guidés pour débutants\n- **VulnHub** : VMs vulnérables à télécharger\n- **PentesterLab** : Exercices web spécialisés\n\n`;

    const conclusion = `## Conclusion\n\nCe guide vous a fourni les bases ${difficulty === 'Beginner' ? 'essentielles' : difficulty === 'Intermediate' ? 'avancées' : 'expertes'} pour comprendre et exploiter cette technique. La pratique régulière dans des environnements contrôlés est essentielle pour maîtriser ces compétences.\n\n### Prochaines Étapes\n\n1. Pratiquer dans un lab personnel\n2. Participer à des CTF (Capture The Flag)\n3. Contribuer à la communauté (writeups, outils)\n4. Continuer l'apprentissage avec des ressources avancées\n\n**Rappel Important** : Ces techniques doivent être utilisées uniquement dans un cadre légal et éthique, avec autorisation explicite.\n\n`;

    return intro + context + objectives + prerequisites + methodology + tools + practicalExample + bestPractices + resources + conclusion;
}

async function enrichTutorials() {
    console.log("🚀 Enriching tutorials with detailed content...\n");

    // Get all tutorials
    const { data: tutorials, error } = await supabase
        .from('tutorials')
        .select('*')
        .limit(50000);

    if (error || !tutorials) {
        console.error("Error fetching tutorials:", error);
        return;
    }

    console.log(`📚 Found ${tutorials.length} tutorials to enrich\n`);

    let updated = 0;
    const batchSize = 10;

    for (let i = 0; i < tutorials.length; i += batchSize) {
        const batch = tutorials.slice(i, i + batchSize);

        for (const tutorial of batch) {
            // Generate rich content
            const richContent = generateTutorialContent(
                tutorial.title,
                tutorial.difficulty,
                tutorial.content
            );

            // Update tutorial
            await supabase
                .from('tutorials')
                .update({ content: richContent })
                .eq('id', tutorial.id);

            updated++;
        }

        console.log(`   Progress: ${Math.min(i + batchSize, tutorials.length)}/${tutorials.length} (${updated} enriched)`);
    }

    console.log(`\n✅ Enriched ${updated} tutorials with detailed content!`);
}

enrichTutorials();
