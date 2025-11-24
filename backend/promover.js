// Script para promover usuário - usar com o módulo do backend
const db = require('./config/database-sqlite');

const userId = process.argv[2];
const novoTipo = process.argv[3];

async function promoverUsuario() {
    if (!userId || !novoTipo) {
        console.log('\n❌ Erro: Forneça o ID do usuário e o novo tipo!\n');
        console.log('Uso: node promover.js <ID> <tipo>\n');
        console.log('Tipos: admin, tesoureiro, pastor, membro\n');
        console.log('Exemplo: node promover.js 5 admin\n');
        process.exit(1);
    }
    
    const tiposValidos = ['admin', 'tesoureiro', 'pastor', 'membro'];
    if (!tiposValidos.includes(novoTipo)) {
        console.log(`\n❌ Tipo inválido: ${novoTipo}`);
        console.log(`Tipos válidos: ${tiposValidos.join(', ')}\n`);
        process.exit(1);
    }
    
    try {
        // Buscar usuário
        const [users] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [userId]);
        const user = users[0];
        
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
        
        // Atualizar
        const [result] = await db.execute(
            'UPDATE usuarios SET tipo_usuario = ? WHERE id = ?',
            [novoTipo, userId]
        );
        
        console.log('✅ Usuário atualizado com sucesso!\n');
        
        if (['admin', 'tesoureiro', 'pastor'].includes(novoTipo)) {
            console.log('🎉 Agora este usuário tem acesso administrativo!');
            console.log('   Ao fazer login, será redirecionado para /admin.html\n');
        } else {
            console.log('👤 Usuário voltou a ser membro comum.');
            console.log('   Acesso apenas ao dashboard pessoal.\n');
        }
        
        console.log('═══════════════════════════════════════════════════════\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Erro:', error.message, '\n');
        process.exit(1);
    }
}

promoverUsuario();
