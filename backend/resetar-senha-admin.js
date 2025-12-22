// Reset senha do admin
const pool = require('./config/database-sqlite');
const bcrypt = require('bcryptjs');

async function resetarSenhaAdmin() {
  try {
    console.log('🔄 Resetando senha do admin...\n');
    
    // Gerar hash da senha com 12 rounds (mesma configuração do sistema)
    const senhaHash = await bcrypt.hash('123456', 12);
    
    // Atualizar ou inserir admin
    const usuarios = await pool.query('SELECT id FROM usuarios WHERE email = ?', ['admin@igreja.com']);
    
    if (usuarios.length > 0) {
      // Atualizar existente
      await pool.run(`
        UPDATE usuarios 
        SET senha = ?, tipo_usuario = 'admin', status = 'ativo'
        WHERE email = ?
      `, [senhaHash, 'admin@igreja.com']);
      console.log('✅ Senha do admin ATUALIZADA!');
    } else {
      // Criar novo
      await pool.run(`
        INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, tipo_usuario, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'Administrador do Sistema',
        'admin@igreja.com',
        senhaHash,
        '(11) 98765-4321',
        '1990-05-15',
        'admin',
        'ativo'
      ]);
      console.log('✅ Admin CRIADO!');
    }
    
    // Verificar
    const admin = await pool.query('SELECT id, nome, email, tipo_usuario, status FROM usuarios WHERE email = ?', ['admin@igreja.com']);
    
    if (admin.length > 0) {
      console.log('\n📋 Dados do Admin:');
      console.log(`   ID: ${admin[0].id}`);
      console.log(`   Nome: ${admin[0].nome}`);
      console.log(`   Email: ${admin[0].email}`);
      console.log(`   Tipo: ${admin[0].tipo_usuario}`);
      console.log(`   Status: ${admin[0].status}`);
      console.log('\n🔐 Credenciais:');
      console.log('   Email: admin@igreja.com');
      console.log('   Senha: 123456');
      console.log('\n✅ Pronto para login!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

resetarSenhaAdmin();
