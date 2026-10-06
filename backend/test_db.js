import supabase from './src/config/supabase.js';

async function testConnection() {
    console.log("Testing Supabase tables...");

    const tables = ['products', 'categories', 'gallery', 'certificates', 'users'];

    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.error(`Error querying table "${table}":`, error.message, error);
            } else {
                console.log(`Table "${table}" queried successfully. Found ${data.length} row(s) (limited to 1).`);
            }
        } catch (err) {
            console.error(`Exception querying table "${table}":`, err);
        }
    }
}

testConnection();
