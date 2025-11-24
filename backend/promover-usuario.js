// Script para promover usuário
const Database = require('./node_modules/better-sqlite3');
const db = new Database('./database.sqlite');

// Pegar argumentos da linha de comando
const userId = process.argv[2];
const novoTipo = process.argv[3];

if (!userId || !novoTipo) {
    console.log('\n❌ Erro: Forneça o ID do usuário e o novo tipo!\n');
    console.log('Uso: node promover-usuario.js <ID> <tipo>\n');
    console.log('Tipos disponíveis:');
    console.log('  - admin (administrador total)');
    console.log('  - tesoureiro (acesso administrativo)');
    console.log('  - pastor (acesso administrativo)');
    console.log('  - membro (usuário comum)\n');
    console.log('Exemplo: node promover-usuario.js 5 admin\n');
    process.exit(1);
}

// Validar tipo
const tiposValidos = ['admin', 'tesoureiro', 'pastor', 'membro'];
if (!tiposValidos.includes(novoTipo)) {
    console.log(`\n❌ Tipo inválido: ${novoTipo}`);
    console.log(`Tipos válidos: ${tiposValidos.join(', ')}\n`);
    process.exit(1);
}

try {
    // Verificar se usuário existe
    const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(userId);
    
    if (!user) {
        console.log(`\n❌ Usuário com ID ${userId} não encontrado!\n`);
        process.exit(1);
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  🔄 ALTERANDO TIPO DE USUÁRIO');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log(`👤 Usuário: ${user.nome}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`📊 Tipo atual: ${user.tipo_usuario.toUpperCase()}`);
    console.log(`🔄 Novo tipo: ${novoTipo.toUpperCase()}\n`);
    
    // Atualizar tipo de usuário
    const stmt = db.prepare('UPDATE usuarios SET tipo_usuario = ? WHERE id = ?');
    const result = stmt.run(novoTipo, userId);
    
    if (result.changes > 0) {
        console.log('✅ Usuário atualizado com sucesso!\n');
        
        if (novoTipo === 'admin' || novoTipo === 'tesoureiro' || novoTipo === 'pastor') {
            console.log('🎉 Agora este usuário tem acesso ao painel administrativo!');
            console.log('   Ao fazer login, será redirecionado para /admin.html\n');
        } else {
            console.log('👤 Usuário voltou a ser membro comum.');
            console.log('   Acesso apenas ao dashboard pessoal.\n');
        }
        
        console.log('═══════════════════════════════════════════════════════\n');
    } else {
        console.log('❌ Erro ao atualizar usuário.\n');
    }
    
} catch (error) {
    console.error('\n❌ Erro:', error.message, '\n');
    process.exit(1);
} finally {
    db.close();
}
