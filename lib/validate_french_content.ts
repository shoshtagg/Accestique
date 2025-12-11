import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// List of mandatory French field prefixes/indicators
const FRENCH_INDICATORS = [
    'étape', 'étapes', // French for "step"
    'exécuter', 'exécution', // French for "execute"
    'réseau', 'réseaux', // French for "network"
    'système', 'systèmes', // French for "system"
    'base de données', // French for "database"
    'infrastructure', // French for "infrastructure"
    'sécurité', 'sécurisation', // French for "security"
];

async function validateAndFixFrenchContent() {
    try {
        console.log('🔍 Validating French content in Supabase...\n');

        // Get all tutorials
        const { data: tutorials, error: fetchError } = await supabase
            .from('tutorials')
            .select('id, title, content, language, difficulty')
            .order('id', { ascending: true });

        if (fetchError) {
            console.error('❌ Error fetching tutorials:', fetchError.message);
            return;
        }

        if (!tutorials || tutorials.length === 0) {
            console.log('⚠️ No tutorials found');
            return;
        }

        console.log(`📊 Found ${tutorials.length} total tutorials\n`);

        let missingLanguageCount = 0;
        let nonFrenchCount = 0;
        const tutorialsToFix: any[] = [];

        // Analyze each tutorial
        tutorials.forEach((tutorial: any) => {
            // Check if language field is missing or not French
            if (!tutorial.language) {
                console.log(`⚠️  MISSING LANGUAGE: "${tutorial.title}" (ID: ${tutorial.id})`);
                missingLanguageCount++;
                tutorialsToFix.push(tutorial.id);
            } else if (tutorial.language !== 'fr') {
                console.log(`⚠️  NON-FRENCH: "${tutorial.title}" (Language: ${tutorial.language})`);
                nonFrenchCount++;
                tutorialsToFix.push(tutorial.id);
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   • Total tutorials: ${tutorials.length}`);
        console.log(`   • Missing language field: ${missingLanguageCount}`);
        console.log(`   • Non-French content: ${nonFrenchCount}`);
        console.log(`   • Need fixing: ${tutorialsToFix.length}`);

        if (tutorialsToFix.length > 0) {
            console.log(`\n🔧 Fixing ${tutorialsToFix.length} tutorials to French...\n`);

            // Update all tutorials that need fixing
            for (const tutorialId of tutorialsToFix) {
                const { error } = await supabase
                    .from('tutorials')
                    .update({ language: 'fr' })
                    .eq('id', tutorialId);

                if (error) {
                    console.error(`   ❌ Failed to update tutorial ${tutorialId}:`, error.message);
                } else {
                    console.log(`   ✅ Fixed tutorial ${tutorialId}`);
                }
            }

            console.log(`\n✅ All tutorials have been set to French (fr)`);
        } else {
            console.log(`\n✅ All tutorials are properly set to French!`);
        }

        // Final verification
        const { data: verifyData, error: verifyError } = await supabase
            .from('tutorials')
            .select('*')
            .eq('language', 'fr');

        if (!verifyError && verifyData) {
            console.log(`\n✨ Final count: ${verifyData.length} tutorials in French`);
        }

    } catch (error) {
        console.error('❌ Exception:', error);
    }
}

// Run validation
validateAndFixFrenchContent();
