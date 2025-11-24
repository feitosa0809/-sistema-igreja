// Script para gerenciar usuários - usar com o módulo do backend
const db = require('./config/database-sqlite');

async function listarUsuarios() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  👥 USUÁRIOS CADASTRADOS');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const [users] = await db.execute('SELECT id, nome, email, tipo_usuario, status FROM usuarios ORDER BY id');
    
    users.forEach(u => {
        const icon = ['admin', 'tesoureiro', 'pastor'].includes(u.tipo_usuario) ? '👔' : '👤';
        const statusIcon = u.status === 'ativo' ? '✅' : '❌';
        
        console.log(`${icon} ${statusIcon} ID: ${u.id} - ${u.nome}`);
        console.log(`   📧 Email: ${u.email}`);
        console.log(`   🏷️  Tipo: ${u.tipo_usuario.toUpperCase()}`);
        console.log(`   📊 Status: ${u.status}`);
        console.log('');
    });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  🔧 COMO PROMOVER USUÁRIO A ADMINISTRADOR');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('Use o comando:');
    console.log('   node promover.js <ID> <tipo>\n');
    
    console.log('Tipos disponíveis:');
    console.log('   • admin - Administrador total');
    console.log('   • tesoureiro - Acesso administrativo');
    console.log('   • pastor - Acesso administrativo');
    console.log('   • membro - Usuário comum\n');
    
    console.log('Exemplo para promover o usuário ID 5:');
    console.log('   node promover.js 5 admin\n');
    
    console.log('═══════════════════════════════════════════════════════\n');
    
    process.exit(0);
}

listarUsuarios().catch(err => {
    console.error('❌ Erro:', err.message);
    process.exit(1);
});
