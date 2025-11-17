const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Adicionando coluna data_nascimento...');

db.run(`ALTER TABLE usuarios ADD COLUMN data_nascimento DATE`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column')) {
            console.log('✅ Coluna data_nascimento já existe!');
        } else {
            console.error('❌ Erro ao adicionar coluna:', err.message);
        }
    } else {
        console.log('✅ Coluna data_nascimento adicionada com sucesso!');
    }
    
    db.close();
});
