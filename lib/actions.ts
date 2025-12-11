'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("🔧 Actions.ts loaded. URL:", !!supabaseUrl, "Key:", !!supabaseKey ? "Present" : "MISSING");

const supabase = createClient(supabaseUrl, supabaseKey);


export async function getLatestThreats(limit = 100, offset = 0) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

export async function searchThreats(query: string) {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
            .limit(50);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Search Error:", error);
        return [];
    }
}

export async function getStats() {
    console.log("⚡ getStats action called");
    try {
        // Note: count='exact' can be slow on huge tables, but acceptable for 10-50k rows.
        const [articles, cheatsheets, tutorials, categories] = await Promise.all([
            supabase.from('articles').select('id', { count: 'exact', head: true }),
            supabase.from('cheatsheets').select('id', { count: 'exact', head: true }),
            supabase.from('tutorials').select('id', { count: 'exact', head: true }),
            supabase.from('categories').select('id', { count: 'exact', head: true })
        ]);

        console.log("⚡ Stats Result:", {
            art: articles.count,
            sheet: cheatsheets.count,
            tut: tutorials.count,
            cat: categories.count
        });

        return {
            articles: articles.count || 0,
            cheatsheets: cheatsheets.count || 0,
            tutorials: tutorials.count || 0,
            categories: categories.count || 0
        };
    } catch (err) {
        console.error("❌ Stats Error:", err);
        return { articles: 0, cheatsheets: 0, tutorials: 0, categories: 0 };
    }
}

export async function getCheatsheets(category?: string, limit = 50, offset = 0) {
    console.log(`⚡ getCheatsheets called for: ${category}`);
    try {
        let query = supabase
            .from('cheatsheets')
            .select('*')
            .order('id', { ascending: false }) // Newest first
            .range(offset, offset + limit - 1);

        if (category && category !== 'Tout') {
            query = query.filter('category', 'ilike', `%${category}%`);
        }

        const { data, error } = await query;
        if (error) {
            console.error("❌ Cheatsheet Error:", error.message);
            return [];
        }
        return data;
    } catch (e) {
        console.error("❌ Cheatsheet Exception:", e);
        return [];
    }
}

export async function getTutorials(difficulty?: string, limit = 50, offset = 0) {
    console.log(`⚡ getTutorials called for: ${difficulty}`);
    try {
        let query = supabase
            .from('tutorials')
            .select('*')
            .eq('is_published', true)
            .eq('language', 'fr')
            .order('id', { ascending: true }) // Stable order
            .range(offset, offset + limit - 1);

        if (difficulty) {
            // Map UI IDs to DB values if necessary, but we stored 'Beginner', 'Intermediate', 'Expert'
            // UI uses lowercase ids, so capitalized them
            const capitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            query = query.eq('difficulty', capitalized);
        }

        const { data, error } = await query;
        if (error) {
            console.error("❌ Tutorial Error:", error.message);
            return [];
        }
        return data;
    } catch (e) {
        console.error("❌ Tutorial Exception:", e);
        return [];
    }
}
