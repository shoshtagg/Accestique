import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
    console.log("Checking cheatsheet categories...");

    const { data, error } = await supabase
        .from('cheatsheets')
        .select('tool_name, category')
        .limit(20);

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log("\nSample cheatsheets:");
    data?.forEach((item, i) => {
        console.log(`${i + 1}. Tool: "${item.tool_name}" | Category: "${item.category}"`);
    });

    // Check for Windows specifically
    const { data: windowsData } = await supabase
        .from('cheatsheets')
        .select('tool_name, category')
        .ilike('category', '%Windows%')
        .limit(5);

    console.log(`\n\nWindows cheatsheets found: ${windowsData?.length || 0}`);
    windowsData?.forEach((item, i) => {
        console.log(`${i + 1}. ${item.tool_name} - ${item.category}`);
    });
}

checkCategories();
