const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Executando migrações do banco de dados...');

// Função para executar SQL de um arquivo
function executeSQLFile(filename) {
  return new Promise((resolve, reject) => {
    const sqlPath = path.join(__dirname, filename);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    db.exec(sql, (err) => {
      if (err) {
        console.error(`❌ Erro ao executar ${filename}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ ${filename} executado com sucesso!`);
        resolve();
      }
    });
  });
}

// Executar migrations sequencialmente
(async () => {
  try {
    // Migration antiga
    console.log('🔄 Adicionando coluna data_nascimento...');
    await new Promise((resolve) => {
      db.run(`ALTER TABLE usuarios ADD COLUMN data_nascimento DATE`, (err) => {
        if (err) {
          if (err.message.includes('duplicate column')) {
            console.log('✅ Coluna data_nascimento já existe!');
          } else {
            console.error('⚠️ Aviso:', err.message);
          }
        } else {
          console.log('✅ Coluna data_nascimento adicionada!');
        }
        resolve();
      });
    });

    // Nova migration com todas as tabelas
    await executeSQLFile('add_novas_tabelas.sql');
    
    console.log('🎉 Todas as migrações foram executadas com sucesso!');
    db.close();
  } catch (error) {
    console.error('❌ Erro durante as migrações:', error);
    db.close();
    process.exit(1);
  }
})();
