
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Setup Supabase (User must have .env.local set)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Needs Service Role for writing

// Safety check
if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️  Supabase credentials missing. Running in DRY RUN mode (Console Only).");
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

interface CVEItem {
    cve: {
        id: string;
        descriptions: { lang: string; value: string }[];
        metrics?: {
            cvssMetricV31?: { cvssData: { baseScore: number; baseSeverity: string } }[];
        };
    };
}

export async function fetchNVD(startIndex = 0, resultsPerPage = 2000) {
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0/?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`;
    console.log(`Fetching CVEs from: ${url}`);

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const vulnerabilities: CVEItem[] = data.vulnerabilities;

        console.log(`Processing ${vulnerabilities.length} CVEs...`);

        const articles = vulnerabilities.map(v => {
            const cveId = v.cve.id;
            const descObject = v.cve.descriptions.find(d => d.lang === 'en') || v.cve.descriptions[0];
            const description = descObject ? descObject.value : 'No description available.';

            // Extract Score
            const metrics = v.cve.metrics?.cvssMetricV31?.[0]?.cvssData;
            const score = metrics?.baseScore || 0;
            const severity = metrics?.baseSeverity || 'UNKNOWN';

            return {
                title: `${cveId} - ${severity} Severity Vulnerability`,
                source_url: `https://nvd.nist.gov/vuln/detail/${cveId}`,
                source_name: 'NIST NVD',
                summary: description,
                categories: ['CVE / Exploit'], // Changed to plural array to match Schema
                published_at: new Date(), // NVD has specific dates, simplifying for bulk logic
                fetched_at: new Date(),
                language: 'en', // Keep EN for now, translation layer handles later
            };
        });

        // Bulk Insert
        if (supabase) {
            const { error } = await supabase.from('articles').upsert(articles, { onConflict: 'source_url' });
            if (error) console.error('Supabase Error:', error);
            else console.log(`✅ Successfully saved ${articles.length} CVEs to database.`);
        } else {
            console.log(`ℹ️  Dry Run: Would save ${articles.length} items.`);
        }

        return articles.length;

    } catch (err) {
        console.error("Failed to fetch NVD:", err);
        return 0;
    }
}

// Function to loop until we reach target
export async function seedMassiveCVEs(targetCount = 10000) {
    let currentCount = 0;
    let page = 0;
    const batchSize = 2000;

    while (currentCount < targetCount) {
        console.log(`Batch ${page + 1}: Fetching...`);
        const count = await fetchNVD(page * batchSize, batchSize);
        if (count === 0) break; // Stop on error or empty
        currentCount += count;
        page++;

        // Respect API Rate limits (approx 6 seconds delay recommended without API key)
        console.log("Waiting 6s to respect NVD API limits...");
        await new Promise(r => setTimeout(r, 6000));
    }

    console.log(`🎉 Ingestion Complete. Total Processed: ${currentCount}`);
}

// Execute if run directly
if (require.main === module) {
    seedMassiveCVEs()
        .then(() => process.exit(0))
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}
