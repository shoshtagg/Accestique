import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Category mapping based on keywords
const categoryMappings = [
    { keywords: ['nmap', 'port scan', 'network scan'], category: 'Nmap' },
    { keywords: ['linux', 'ubuntu', 'debian', 'centos', 'bash', 'shell'], category: 'Linux' },
    { keywords: ['windows', 'powershell', 'cmd', 'microsoft', 'active directory'], category: 'Windows' },
    { keywords: ['metasploit', 'msfconsole', 'meterpreter', 'msf'], category: 'Metasploit' },
    { keywords: ['netcat', 'nc ', 'reverse shell'], category: 'Netcat' },
    { keywords: ['wireshark', 'packet', 'pcap', 'network analysis'], category: 'Wireshark' },
    { keywords: ['python', 'pip', 'django', 'flask'], category: 'Python' },
    { keywords: ['sql', 'mysql', 'postgresql', 'database', 'injection'], category: 'SQL' },
    { keywords: ['burp', 'burpsuite'], category: 'Burp Suite' },
    { keywords: ['web', 'http', 'xss', 'csrf', 'owasp'], category: 'Web Security' },
    { keywords: ['wifi', 'wireless', 'aircrack'], category: 'WiFi' },
    { keywords: ['exploit', 'vulnerability', 'cve'], category: 'Exploits' },
];

function categorizeCheatsheet(toolName: string, commandData: any[]): string {
    const text = (toolName + ' ' + JSON.stringify(commandData)).toLowerCase();

    for (const mapping of categoryMappings) {
        for (const keyword of mapping.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return mapping.category;
            }
        }
    }

    return 'General';
}

async function recategorizeCheatsheets() {
    console.log("🔄 Fetching all cheatsheets...");

    const { data: allCheatsheets, error } = await supabase
        .from('cheatsheets')
        .select('*')
        .limit(21256); // Get all

    if (error || !allCheatsheets) {
        console.error("Error fetching:", error);
        return;
    }

    console.log(`📊 Found ${allCheatsheets.length} cheatsheets`);
    console.log("🏷️  Recategorizing...\n");

    const updates: any[] = [];
    const categoryCounts: Record<string, number> = {};

    for (const sheet of allCheatsheets) {
        const newCategory = categorizeCheatsheet(sheet.tool_name, sheet.command_data || []);

        if (newCategory !== sheet.category) {
            updates.push({
                id: sheet.id,
                category: newCategory,
                tool_name: newCategory // Also update tool_name to match category
            });
        }

        categoryCounts[newCategory] = (categoryCounts[newCategory] || 0) + 1;
    }

    console.log("📈 Category distribution:");
    Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
        });

    console.log(`\n✏️  Updating ${updates.length} cheatsheets...`);

    // Update in batches
    const batchSize = 100;
    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);

        for (const update of batch) {
            await supabase
                .from('cheatsheets')
                .update({ category: update.category, tool_name: update.tool_name })
                .eq('id', update.id);
        }

        console.log(`   Progress: ${Math.min(i + batchSize, updates.length)}/${updates.length}`);
    }

    console.log("\n✅ Recategorization complete!");
}

recategorizeCheatsheets();
