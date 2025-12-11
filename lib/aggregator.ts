import { createClient } from '@supabase/supabase-js';

// Note: Ensure @supabase/supabase-js is installed
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export interface Article {
    title: string;
    url: string;
    source: string;
    summary: string;
    content?: string;
    publishedAt: Date;
    extractedCommands: string[];
    category: string;
}

// 1. Language Stub (French Target)
async function translateToFrench(text: string): Promise<string> {
    // Placeholder: In production, integrate DeepL API here.
    // For massive volume, we might only translate Titles and Summaries.
    return text;
}

// 2. Command Extractor (The "Technical" Brain)
// Looks for code blocks or lines starting with $, #, or typical CLI patterns.
function extractCommands(text: string): string[] {
    const commands: string[] = [];

    // Regex for Markdown code blocks
    const codeBlockRegex = /```(?:bash|sh|cmd|powershell)?\s*([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        if (match[1]) commands.push(match[1].trim());
    }

    // Fallback: Look for lines starting with typical shell prompts if no blocks found
    if (commands.length === 0) {
        const lines = text.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('$ ') || trimmed.startsWith('# ') || trimmed.startsWith('sudo ')) {
                commands.push(trimmed.replace(/^[$#]\s/, ''));
            }
        });
    }

    return commands;
}

// 3. Classification System
function classifyContent(title: string, summary: string): string {
    const text = (title + " " + summary).toLowerCase();
    if (text.includes('exploit') || text.includes('cve') || text.includes('poc')) return 'Exploits & CVEs';
    if (text.includes('linux') || text.includes('bash') || text.includes('kernel')) return 'Linux Offensive';
    if (text.includes('metasploit') || text.includes('msfconsole') || text.includes('payload')) return 'Metasploit Framework';
    if (text.includes('wireless') || text.includes('wifi') || text.includes('aircrack')) return 'WiFi Hacking';
    return 'Général Cyber';
}

// 4. Source Fetching Logic
async function fetchRSS(feedUrl: string, sourceName: string): Promise<Article[]> {
    try {
        const response = await fetch(feedUrl);
        const xmlText = await response.text();

        // Quick regex XML parsing (Use a robust parser like 'fast-xml-parser' in prod)
        const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

        const articles = await Promise.all(items.map(async (item) => {
            // Extract fields
            const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
            const contentMatch = item.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/); // RSS content module

            const rawTitle = titleMatch ? titleMatch[1] : 'No Title';
            const rawDesc = descMatch ? descMatch[1] : '';
            const rawContent = contentMatch ? contentMatch[1] : rawDesc; // Fallback to description

            // Process Content
            const commands = extractCommands(rawContent);
            const category = classifyContent(rawTitle, rawDesc);

            // Localization
            const titleFr = await translateToFrench(rawTitle);
            const summaryFr = await translateToFrench(rawDesc.replace(/<[^>]*>/g, '').slice(0, 300) + '...');

            return {
                title: titleFr,
                url: linkMatch ? linkMatch[1] : '',
                source: sourceName,
                summary: summaryFr,
                publishedAt: new Date(), // Parse actual date if needed
                extractedCommands: commands,
                category
            };
        }));

        return articles;
    } catch (err) {
        console.error(`Failed to fetch ${sourceName}`, err);
        return [];
    }
}

// 5. Main Aggregator Function
export async function runMassiveAggregation() {
    const sources = [
        { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
        { name: 'Exploit-DB', url: 'https://www.exploit-db.com/rss.xml' }, // Example URL
        { name: 'Packet Storm', url: 'https://packetstormsecurity.com/feeds/news/' },
        { name: 'NIST NVD', url: 'https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml' },
        { name: 'Kali Linux News', url: 'https://www.kali.org/rss.xml' }
    ];

    console.log(`Starting Aggregation for ${sources.length} high-volume sources...`);

    let totalArticles = 0;

    for (const source of sources) {
        console.log(`Fetching ${source.name}...`);
        const articles = await fetchRSS(source.url, source.name);
        console.log(`Found ${articles.length} items from ${source.name}`);

        // Mock DB Insert
        // const { error } = await supabase.from('articles').upsert(articles.map(a => ({...})));

        totalArticles += articles.length;
    }

    console.log(`Job Complete. Processed ${totalArticles} potential entries.`);
    return totalArticles;
}
