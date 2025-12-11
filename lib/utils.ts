export async function reloadSchemaCache(supabase: any) {
    // Try to force a schema reload by making a simple request
    // This is a known workaround for PGRST205
    console.log("🔄 Attempting to refresh Supabase schema cache...");
    try {
        await supabase.from('articles').select('count', { count: 'exact', head: true });
    } catch (e) { /* ignore */ }
} 
