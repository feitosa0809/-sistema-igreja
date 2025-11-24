const db = require('./backend/config/database-sqlite');

db.query('PRAGMA table_info(campanhas)').then(cols => {
    console.log('Colunas da tabela campanhas:');
    cols.forEach(c => console.log(`- ${c.name}`));
    process.exit(0);
});
