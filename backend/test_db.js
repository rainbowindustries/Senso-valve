import supabase from './src/config/supabase.js';

async function testConnection() {
    console.log("=== SUPABASE DATABASE CONTENTS ===");
    
    const tables = ['products', 'categories', 'gallery', 'certificates', 'admins'];
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*');
                
            if (error) {
                console.error(`Error querying table "${table}":`, error.message);
            } else {
                console.log(`\n--- TABLE: ${table} (${data.length} rows) ---`);
                console.log(JSON.stringify(data, null, 2));
            }
        } catch (err) {
            console.error(`Exception querying table "${table}":`, err.message);
        }
    }
}

testConnection();
