import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Dictionnaire de traduction pour les termes techniques courants
const translations: Record<string, string> = {
    // Titres et sections
    'Summary': 'Résumé',
    'Methodology': 'Méthodologie',
    'Proof of Concept': 'Preuve de Concept',
    'Data Grabber': 'Collecteur de Données',
    'Tools': 'Outils',
    'Common Payloads': 'Payloads Courants',
    'Example': 'Exemple',
    'Practical Example': 'Exemple Pratique',
    'Best Practices': 'Bonnes Pratiques',
    'Security': 'Sécurité',
    'References': 'Références',
    'Labs': 'Laboratoires',
    'Tips': 'Astuces',
    'Conclusion': 'Conclusion',
    'Next Steps': 'Prochaines Étapes',

    // Descriptions
    'Cross-site scripting (XSS) is a type of computer security vulnerability':
        'Le Cross-Site Scripting (XSS) est un type de vulnérabilité de sécurité informatique',
    'typically found in web applications':
        'généralement trouvée dans les applications web',
    'XSS enables attackers to inject client-side scripts':
        'Le XSS permet aux attaquants d\'injecter des scripts côté client',
    'into web pages viewed by other users':
        'dans les pages web consultées par d\'autres utilisateurs',

    // Types d'attaques
    'Reflected XSS': 'XSS Réfléchi',
    'Stored XSS': 'XSS Stocké',
    'DOM-based XSS': 'XSS basé sur le DOM',
    'Blind XSS': 'XSS Aveugle',

    // Instructions
    'In a reflected XSS attack': 'Dans une attaque XSS réfléchie',
    'the malicious code is embedded in a link': 'le code malveillant est intégré dans un lien',
    'When the victim clicks on the link': 'Lorsque la victime clique sur le lien',
    'the code is executed in their browser': 'le code est exécuté dans son navigateur',

    // Outils
    'Network Scanner': 'Scanner Réseau',
    'Port Scanner': 'Scanner de Ports',
    'Vulnerability Scanner': 'Scanner de Vulnérabilités',

    // Général
    'Overview': 'Vue d\'ensemble',
    'Analysis': 'Analyse',
    'Context': 'Contexte',
    'Scenario': 'Scénario',
    'Step': 'Étape',
    'Phase': 'Phase',
    'Important': 'Important',
    'Note': 'Note',
    'Warning': 'Avertissement',
};

// Fonction pour traduire le contenu
function translateContent(content: string): string {
    let translated = content;

    // Remplacer les termes du dictionnaire
    for (const [english, french] of Object.entries(translations)) {
        const regex = new RegExp(english, 'gi');
        translated = translated.replace(regex, french);
    }

    // Traduire les phrases courantes
    translated = translated
        // Headers
        .replace(/# (.+)/g, (match, p1) => {
            if (p1.toLowerCase().includes('introduction')) return '# Introduction';
            if (p1.toLowerCase().includes('getting started')) return '# Pour Commencer';
            if (p1.toLowerCase().includes('advanced')) return '# Techniques Avancées';
            return match;
        })

        // Phrases courantes
        .replace(/This guide/gi, 'Ce guide')
        .replace(/This tutorial/gi, 'Ce tutoriel')
        .replace(/This section/gi, 'Cette section')
        .replace(/For example/gi, 'Par exemple')
        .replace(/In this case/gi, 'Dans ce cas')
        .replace(/As shown/gi, 'Comme montré')
        .replace(/The following/gi, 'Ce qui suit')
        .replace(/You can/gi, 'Vous pouvez')
        .replace(/We can/gi, 'Nous pouvons')
        .replace(/It is important/gi, 'Il est important')
        .replace(/Make sure/gi, 'Assurez-vous')
        .replace(/Always/gi, 'Toujours')
        .replace(/Never/gi, 'Jamais')

        // Instructions techniques
        .replace(/Run the following command/gi, 'Exécutez la commande suivante')
        .replace(/Execute/gi, 'Exécuter')
        .replace(/Install/gi, 'Installer')
        .replace(/Configure/gi, 'Configurer')
        .replace(/Test/gi, 'Tester')
        .replace(/Verify/gi, 'Vérifier')

        // Résultats
        .replace(/Output/gi, 'Sortie')
        .replace(/Result/gi, 'Résultat')
        .replace(/Success/gi, 'Succès')
        .replace(/Failed/gi, 'Échec')
        .replace(/Error/gi, 'Erreur');

    return translated;
}

async function translateTutorials() {
    console.log('🔄 Traduction des tutoriels en français...\n');

    // Récupérer tous les tutoriels
    const { data: tutorials, error } = await supabase
        .from('tutorials')
        .select('*');

    if (error) {
        console.error('❌ Erreur:', error);
        return;
    }

    if (!tutorials || tutorials.length === 0) {
        console.log('⚠️  Aucun tutoriel trouvé');
        return;
    }

    console.log(`📚 ${tutorials.length} tutoriels trouvés\n`);

    // Traduire chaque tutoriel
    for (const tutorial of tutorials) {
        console.log(`📝 Traduction: ${tutorial.title}`);

        const translatedContent = translateContent(tutorial.content || '');

        const { error: updateError } = await supabase
            .from('tutorials')
            .update({ content: translatedContent })
            .eq('id', tutorial.id);

        if (updateError) {
            console.error(`   ❌ Erreur pour ${tutorial.title}:`, updateError);
        } else {
            console.log(`   ✅ Traduit avec succès`);
        }
    }

    console.log('\n✨ Traduction des tutoriels terminée!\n');
}

async function translateCheatsheets() {
    console.log('🔄 Traduction des descriptions de cheatsheets en français...\n');

    // Récupérer tous les cheatsheets
    const { data: cheatsheets, error } = await supabase
        .from('cheatsheets')
        .select('*');

    if (error) {
        console.error('❌ Erreur:', error);
        return;
    }

    if (!cheatsheets || cheatsheets.length === 0) {
        console.log('⚠️  Aucun cheatsheet trouvé');
        return;
    }

    console.log(`📋 ${cheatsheets.length} cheatsheets trouvés\n`);

    // Traduire les descriptions de chaque cheatsheet
    for (const sheet of cheatsheets) {
        if (!sheet.command_data || !Array.isArray(sheet.command_data)) continue;

        console.log(`📝 Traduction: ${sheet.tool_name} (${sheet.category})`);

        const translatedCommands = sheet.command_data.map((cmd: any) => {
            if (cmd.description) {
                return {
                    ...cmd,
                    description: translateContent(cmd.description)
                };
            }
            return cmd;
        });

        const { error: updateError } = await supabase
            .from('cheatsheets')
            .update({ command_data: translatedCommands })
            .eq('id', sheet.id);

        if (updateError) {
            console.error(`   ❌ Erreur pour ${sheet.tool_name}:`, updateError);
        } else {
            console.log(`   ✅ Traduit avec succès`);
        }
    }

    console.log('\n✨ Traduction des cheatsheets terminée!\n');
}

async function main() {
    console.log('🌍 TRADUCTION EN FRANÇAIS - ACCESTIQUE\n');
    console.log('=====================================\n');

    await translateTutorials();
    await translateCheatsheets();

    console.log('🎉 Traduction complète terminée!\n');
    console.log('💡 Note: Les commandes techniques et payloads restent en anglais');
    console.log('   car c\'est la langue standard en cybersécurité.\n');
}

main().catch(console.error);
