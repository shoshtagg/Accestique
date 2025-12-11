import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// On vérifie les clés, mais on évite de faire crasher tout le build si elles manquent
if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing Supabase credentials - Script will not run');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTutorialsLanguage() {
    // Double sécurité : si pas de clés, on arrête la fonction proprement sans erreur
    if (!supabaseUrl || !supabaseKey) return;

    try {
        console.log('📚 Fetching all tutorials...');

        // Get all tutorials
        const { data: tutorials, error: fetchError } = await supabase
            .from('tutorials')
            .select('*');

        if (fetchError) {
            console.error('❌ Error fetching tutorials:', fetchError.message);
            return;
        }

        if (!tutorials || tutorials.length === 0) {
            console.log('⚠️ No tutorials found');
            return;
        }

        console.log(`📊 Found ${tutorials.length} tutorials`);

        // Update all tutorials to have language = 'fr'
        const { error: updateError } = await supabase
            .from('tutorials')
            .update({ language: 'fr' })
            // CORRECTION : Utilisation de .not() pour cibler tout ce qui n'est pas null
            .not('id', 'is', null);

        if (updateError) {
            console.error('❌ Error updating tutorials:', updateError.message);
            return;
        }

        console.log(`✅ Successfully updated all tutorials to French`);

        // Verify the update
        const { data: verifyData, error: verifyError } = await supabase
            .from('tutorials')
            .select('id, title, language, difficulty')
            .eq('language', 'fr');

        if (verifyError) {
            console.error('❌ Error verifying update:', verifyError.message);
            return;
        }

        console.log(`✅ Verification: ${verifyData?.length || 0} tutorials are now in French`);
        console.log('\n📋 Sample of updated tutorials:');
        verifyData?.slice(0, 5).forEach((t: any) => {
            console.log(`   • ${t.title} (${t.difficulty}) - Language: ${t.language}`);
        });

    } catch (error) {
        console.error('❌ Exception:', error);
    }
}

// IMPORTANT : Cette ligne est commentée pour ne pas bloquer le déploiement Vercel.
// updateTutorialsLanguage();
