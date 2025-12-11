import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCounts() {
    const categories = ['Nmap', 'Linux', 'Windows', 'Python', 'Metasploit', 'SQL', 'Netcat', 'Wireshark', 'WiFi', 'Burp Suite', 'Web Security', 'Exploits'];

    console.log("📊 Cheatsheet counts by category:\n");

    for (const cat of categories) {
        const { count } = await supabase
            .from('cheatsheets')
            .select('*', { count: 'exact', head: true })
            .eq('category', cat);

        console.log(`   ${cat.padEnd(20)}: ${count}`);
    }

    const { count: total } = await supabase
        .from('cheatsheets')
        .select('*', { count: 'exact', head: true });

    console.log(`\n   ${'TOTAL'.padEnd(20)}: ${total}`);
}

checkCounts();
