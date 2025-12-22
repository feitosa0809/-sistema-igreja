// Script para verificar administradores no banco de dados
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║        📋 VERIFICAÇÃO DE ADMINISTRADORES          ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

try {
    // Buscar todos os usuários
    db.all('SELECT * FROM usuarios', [], (err, todosUsuarios) => {
        if (err) {
            console.error('❌ Erro ao buscar usuários:', err.message);
            db.close();
            return;
        }
        
        console.log('📊 TODOS OS USUÁRIOS NO BANCO:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (todosUsuarios.length === 0) {
            console.log('❌ Nenhum usuário encontrado no banco de dados!\n');
        } else {
            todosUsuarios.forEach((user, index) => {
                const tipoIcon = user.tipo_usuario === 'admin' ? '👑' : 
                               user.tipo_usuario === 'tesoureiro' ? '💰' :
                               user.tipo_usuario === 'pastor' ? '✝️' : '👤';
                
                console.log(`${index + 1}. ${tipoIcon} ${user.nome}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Tipo: ${user.tipo_usuario}`);
                console.log(`   Telefone: ${user.telefone || 'Não informado'}`);
                console.log(`   Data Nascimento: ${user.data_nascimento || 'Não informado'}`);
                console.log(`   Cadastrado em: ${user.data_cadastro}`);
                console.log('');
            });
            
            // Contar por tipo
            const admins = todosUsuarios.filter(u => u.tipo_usuario === 'admin');
            const tesoureiros = todosUsuarios.filter(u => u.tipo_usuario === 'tesoureiro');
            const pastores = todosUsuarios.filter(u => u.tipo_usuario === 'pastor');
            const membros = todosUsuarios.filter(u => u.tipo_usuario === 'membro');
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            console.log('📈 RESUMO POR TIPO:\n');
            console.log(`👑 Administradores: ${admins.length}`);
            console.log(`💰 Tesoureiros: ${tesoureiros.length}`);
            console.log(`✝️  Pastores: ${pastores.length}`);
            console.log(`👤 Membros: ${membros.length}`);
            console.log(`📊 Total: ${todosUsuarios.length}\n`);
            
            if (admins.length > 0) {
                console.log('✅ CREDENCIAIS DE ADMIN:\n');
                admins.forEach(admin => {
                    console.log(`   Nome: ${admin.nome}`);
                    console.log(`   Email: ${admin.email}`);
                    console.log(`   Senha: (a que você cadastrou, tente "123456")`);
                    console.log('');
                });
            } else {
                console.log('⚠️  NENHUM ADMINISTRADOR CADASTRADO!\n');
                console.log('💡 Para criar um administrador, cadastre-se no sistema');
                console.log('   e depois execute: node criar-admin.js\n');
            }
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        db.close();
    });
    
} catch (error) {
    console.error('❌ Erro ao verificar usuários:', error.message);
    console.error(error.stack);
    db.close();
}
