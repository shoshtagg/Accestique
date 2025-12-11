
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function populateCheatsheets() {
    console.log("🚀 Extracting Commands to populate Cheatsheets Section...");

    if (!supabaseUrl || !supabaseKey) return;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch all tutorials with commands
    const { data: tutorials } = await supabase
        .from('tutorials')
        .select('title, section, commands')
        .not('commands', 'is', null);

    if (!tutorials) return console.log("No tutorials found.");

    const cheatsheetEntries: any[] = [];

    tutorials.forEach(tut => {
        const cmds: string[] = tut.commands || [];
        cmds.forEach(cmd => {
            // Filter out junk
            if (cmd.length < 5 || cmd.length > 500) return;

            cheatsheetEntries.push({
                tool_name: tut.section || 'General',
                category: tut.section || 'Hacking',
                command_data: [{ description: tut.title, command_line: cmd }],
                created_at: new Date()
            });
        });
    });

    console.log(`Found ${cheatsheetEntries.length} commands. Syncing to DB...`);

    // Insert in batches
    const batchSize = 500;
    for (let i = 0; i < cheatsheetEntries.length; i += batchSize) {
        const batch = cheatsheetEntries.slice(i, i + batchSize);
        // Note: 'cheatsheets' table schema: tool_name, category, command_data (jsonb)
        // Since schema expects command_data to be JSON, we formatted it as array above.

        const { error } = await supabase.from('cheatsheets').insert(batch);
        if (error) console.error("Error:", error.message);
        else console.log(`Saved batch of ${batch.length} commands.`);
    }
}

// Execute if run directly
if (require.main === module) {
    populateCheatsheets()
        .then(() => process.exit(0))
        .catch((e) => { console.error(e); process.exit(1); });
}
