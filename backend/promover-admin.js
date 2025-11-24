// Script para listar e promover usuários
const Database = require('./node_modules/better-sqlite3');
const db = new Database('./database.sqlite');

console.log('\n═══════════════════════════════════════════════════════');
console.log('  👥 GERENCIAMENTO DE USUÁRIOS');
console.log('═══════════════════════════════════════════════════════\n');

// Listar todos os usuários
const users = db.prepare('SELECT id, nome, email, tipo_usuario, status FROM usuarios ORDER BY id').all();

console.log('📋 USUÁRIOS CADASTRADOS:\n');
users.forEach(u => {
    const icon = u.tipo_usuario === 'admin' ? '👔' : '👤';
    const statusIcon = u.status === 'ativo' ? '✅' : '❌';
    
    console.log(`${icon} ${statusIcon} ID: ${u.id} - ${u.nome}`);
    console.log(`   📧 Email: ${u.email}`);
    console.log(`   🏷️  Tipo: ${u.tipo_usuario.toUpperCase()}`);
    console.log(`   📊 Status: ${u.status}`);
    console.log('');
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('  🔧 COMO PROMOVER USUÁRIO');
console.log('═══════════════════════════════════════════════════════\n');

console.log('Para PROMOVER um usuário a ADMINISTRADOR:');
console.log('   node promover-usuario.js <ID> admin\n');

console.log('Para DESPROMOVER (voltar a membro):');
console.log('   node promover-usuario.js <ID> membro\n');

console.log('Exemplo:');
console.log('   node promover-usuario.js 5 admin\n');

console.log('═══════════════════════════════════════════════════════\n');

db.close();
