
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// List of high-quality "Awesome" lists and cheat sheet content URLs (Raw Markdown)
const TARGET_FILES = [
    { category: 'Web Pentesting', url: 'https://raw.githubusercontent.com/SwisskyRepo/PayloadsAllTheThings/master/SQL%20Injection/README.md', title: 'SQL Injection Master Guide' },
    { category: 'Web Pentesting', url: 'https://raw.githubusercontent.com/SwisskyRepo/PayloadsAllTheThings/master/XSS%20Injection/README.md', title: 'XSS Injection Master Guide' },
    { category: 'Linux Offensive', url: 'https://raw.githubusercontent.com/SwisskyRepo/PayloadsAllTheThings/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md', title: 'Linux Privilege Escalation' },
    { category: 'Network Security', url: 'https://raw.githubusercontent.com/trimstray/the-book-of-secret-knowledge/master/README.md', title: 'The Book of Secret Knowledge' },
    { category: 'Blue Team/Défense', url: 'https://raw.githubusercontent.com/L1ghtn1ng/Blue-Team-Cheatsheet/master/README.md', title: 'Blue Team Cheatsheet' }
];

function extractCodeBlocks(markdown: string): string[] {
    const regex = /```[\s\S]*?```/g;
    const matches = markdown.match(regex) || [];
    return matches.map(block => block.replace(/```[a-z]*\n?|```/g, '').trim());
}

export async function fetchGithubContent() {
    console.log("🚀 Starting Github Knowledge Ingestion...");

    for (const file of TARGET_FILES) {
        console.log(`Fetching ${file.title}...`);
        try {
            const res = await fetch(file.url);
            if (!res.ok) continue;

            const text = await res.text();

            // Extract Commands
            const commands = extractCodeBlocks(text);

            // We create a tutorial entry for each massive guide
            const tutorial = {
                title: file.title,
                slug: file.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                content: text, // Saving full markdown
                difficulty: 'Intermediate', // Default
                section: file.category,
                commands: commands, // Save extracted commands specifically
                is_published: true
            };

            // Upsert into Tutorials
            if (supabase) {
                const { error } = await supabase.from('tutorials').upsert(tutorial, { onConflict: 'slug' });
                if (error) console.error(`Error saving ${file.title}:`, error.message);
                else console.log(`✅ Saved ${file.title} with ${commands.length} extracted commands.`);
            } else {
                console.log(`ℹ️ Dry Run: ${file.title} parsed. Size: ${text.length} chars.`);
            }

        } catch (err) {
            console.error(`Failed to fetch ${file.url}`, err);
        }
    }
}

// Execute if run directly
if (require.main === module) {
    fetchGithubContent()
        .then(() => process.exit(0))
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}
