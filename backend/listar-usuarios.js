// Script para listar todos os usuários e seus tipos
const pool = require('./config/database-sqlite');

async function listarUsuarios() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           LISTA DE TODOS OS USUÁRIOS DO SISTEMA           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const usuarios = await pool.query(`
      SELECT id, nome, email, tipo_usuario, status, data_cadastro
      FROM usuarios
      ORDER BY 
        CASE tipo_usuario
          WHEN 'admin' THEN 1
          WHEN 'pastor' THEN 2
          WHEN 'tesoureiro' THEN 3
          ELSE 4
        END,
        nome
    `);

    if (usuarios.length === 0) {
      console.log('❌ Nenhum usuário cadastrado no sistema.\n');
      process.exit(0);
    }

    // Estatísticas
    const stats = {
      total: usuarios.length,
      admin: usuarios.filter(u => u.tipo_usuario === 'admin').length,
      pastor: usuarios.filter(u => u.tipo_usuario === 'pastor').length,
      tesoureiro: usuarios.filter(u => u.tipo_usuario === 'tesoureiro').length,
      membro: usuarios.filter(u => u.tipo_usuario === 'membro').length,
      ativos: usuarios.filter(u => u.status === 'ativo').length,
      inativos: usuarios.filter(u => u.status === 'inativo').length
    };

    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total de usuários: ${stats.total}`);
    console.log(`   👑 Administradores: ${stats.admin}`);
    console.log(`   ⛪ Pastores: ${stats.pastor}`);
    console.log(`   💰 Tesoureiros: ${stats.tesoureiro}`);
    console.log(`   👤 Membros: ${stats.membro}`);
    console.log(`   ✅ Ativos: ${stats.ativos}`);
    console.log(`   ❌ Inativos: ${stats.inativos}\n`);

    console.log('═'.repeat(120));
    console.log('ID'.padEnd(5) + 'NOME'.padEnd(30) + 'EMAIL'.padEnd(35) + 'TIPO'.padEnd(15) + 'STATUS'.padEnd(10) + 'CADASTRO');
    console.log('═'.repeat(120));

    usuarios.forEach(user => {
      const id = String(user.id).padEnd(5);
      const nome = user.nome.substring(0, 28).padEnd(30);
      const email = user.email.substring(0, 33).padEnd(35);
      
      // Ícone e cor por tipo
      let tipo = '';
      switch(user.tipo_usuario) {
        case 'admin':
          tipo = '👑 Admin'.padEnd(15);
          break;
        case 'pastor':
          tipo = '⛪ Pastor'.padEnd(15);
          break;
        case 'tesoureiro':
          tipo = '💰 Tesoureiro'.padEnd(15);
          break;
        default:
          tipo = '👤 Membro'.padEnd(15);
      }

      const status = (user.status === 'ativo' ? '✅ Ativo' : '❌ Inativo').padEnd(10);
      const data = new Date(user.data_cadastro).toLocaleDateString('pt-BR');

      console.log(id + nome + email + tipo + status + data);
    });

    console.log('═'.repeat(120));

    // Destacar administradores
    console.log('\n👑 ADMINISTRADORES DO SISTEMA:');
    const admins = usuarios.filter(u => u.tipo_usuario === 'admin');
    if (admins.length > 0) {
      admins.forEach(admin => {
        console.log(`   ✅ ${admin.nome} (${admin.email}) - Status: ${admin.status}`);
      });
    } else {
      console.log('   ⚠️  Nenhum administrador cadastrado!');
    }

    console.log('\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

listarUsuarios();
