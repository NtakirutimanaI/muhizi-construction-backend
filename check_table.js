const { AppDataSource } = require('./src/database/data-source');

AppDataSource.initialize().then(async (ds) => {
    try {
        const result = await ds.query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'insurance_settings' ORDER BY ordinal_position"
        );
        console.log('Table exists:', result.length > 0);
        if (result.length > 0) {
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log('Table insurance_settings does NOT exist!');
        }
    } catch (e) {
        console.error('Query error:', e.message);
    } finally {
        await ds.destroy();
    }
}).catch(e => {
    console.error('Init error:', e.message);
    process.exit(1);
});
