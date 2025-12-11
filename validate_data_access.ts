
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl ? "Found" : "Missing");
console.log("KEY:", supabaseKey ? "Found" : "Missing");

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking Articles...");
    const { count: artCount, error: artError } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    console.log("Articles:", artCount, "Error:", artError?.message);

    console.log("Checking Tutorials...");
    const { count: tutCount, error: tutError } = await supabase.from('tutorials').select('*', { count: 'exact', head: true });
    console.log("Tutorials:", tutCount, "Error:", tutError?.message);

    console.log("Checking Cheatsheets...");
    const { count: cheatCount, error: cheatError } = await supabase.from('cheatsheets').select('*', { count: 'exact', head: true });
    console.log("Cheatsheets:", cheatCount, "Error:", cheatError?.message);
}

check();
