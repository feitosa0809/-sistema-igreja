// Script para criar dados de teste
const pool = require('./config/database-sqlite');
const bcrypt = require('bcryptjs');

async function criarDadosTeste() {
  try {
    console.log('🔧 Criando dados de teste...\n');

    // Verificar se já existem usuários
    const usuarios = await pool.query('SELECT COUNT(*) as total FROM usuarios');
    const totalUsuarios = usuarios[0].total;

    console.log(`📊 Total de usuários existentes: ${totalUsuarios}\n`);

    if (totalUsuarios === 0) {
      console.log('👤 Criando usuário admin...');
      
      const senhaHash = await bcrypt.hash('123456', 10);
      
      await pool.run(`
        INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, tipo_usuario, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'Administrador',
        'admin@igreja.com',
        senhaHash,
        '(11) 98765-4321',
        '1990-05-15',
        'admin',
        'ativo'
      ]);
      
      console.log('✅ Admin criado: admin@igreja.com / 123456\n');
    }

    // Criar usuários de teste com aniversários em diferentes meses
    console.log('👥 Criando usuários de teste com aniversários...');
    
    const usuariosTeste = [
      { nome: 'João Silva', email: 'joao@teste.com', data: '1985-12-25', tipo: 'membro' },
      { nome: 'Maria Santos', email: 'maria@teste.com', data: '1992-12-20', tipo: 'membro' },
      { nome: 'Pedro Costa', email: 'pedro@teste.com', data: '1988-01-10', tipo: 'tesoureiro' },
      { nome: 'Ana Paula', email: 'ana@teste.com', data: '1995-02-14', tipo: 'membro' },
      { nome: 'Carlos Eduardo', email: 'carlos@teste.com', data: '1990-03-21', tipo: 'pastor' },
      { nome: 'Juliana Lima', email: 'juliana@teste.com', data: '1987-04-05', tipo: 'membro' },
      { nome: 'Roberto Alves', email: 'roberto@teste.com', data: '1993-05-18', tipo: 'membro' },
      { nome: 'Fernanda Souza', email: 'fernanda@teste.com', data: '1991-06-30', tipo: 'membro' },
      { nome: 'Ricardo Oliveira', email: 'ricardo@teste.com', data: '1989-07-12', tipo: 'membro' },
      { nome: 'Patricia Rocha', email: 'patricia@teste.com', data: '1994-08-25', tipo: 'membro' },
      { nome: 'Marcelo Dias', email: 'marcelo@teste.com', data: '1986-09-08', tipo: 'membro' },
      { nome: 'Claudia Martins', email: 'claudia@teste.com', data: '1992-10-15', tipo: 'membro' },
      { nome: 'Fernando Gomes', email: 'fernando@teste.com', data: '1988-11-22', tipo: 'membro' },
      { nome: 'Renata Silva', email: 'renata@teste.com', data: '1996-12-05', tipo: 'membro' }
    ];

    const senhaTestHash = await bcrypt.hash('123456', 10);

    for (const usuario of usuariosTeste) {
      try {
        // Verificar se já existe
        const existe = await pool.query('SELECT id FROM usuarios WHERE email = ?', [usuario.email]);
        
        if (existe.length === 0) {
          await pool.run(`
            INSERT INTO usuarios (nome, email, senha, data_nascimento, tipo_usuario, status)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            usuario.nome,
            usuario.email,
            senhaTestHash,
            usuario.data,
            usuario.tipo,
            'ativo'
          ]);
          console.log(`✅ ${usuario.nome} - ${usuario.data}`);
        }
      } catch (err) {
        console.log(`⚠️ ${usuario.nome} - Já existe`);
      }
    }

    console.log('\n💰 Criando dízimos de teste...');

    // Buscar IDs dos usuários
    const todosUsuarios = await pool.query('SELECT id FROM usuarios WHERE tipo_usuario != "admin"');
    
    if (todosUsuarios.length > 0) {
      // Criar alguns dízimos confirmados nos últimos 3 meses
      const hoje = new Date();
      
      for (let i = 0; i < 20; i++) {
        const usuarioAleatorio = todosUsuarios[Math.floor(Math.random() * todosUsuarios.length)];
        const diasAtras = Math.floor(Math.random() * 90); // Últimos 90 dias
        const data = new Date(hoje);
        data.setDate(data.getDate() - diasAtras);
        
        const valores = [50, 100, 150, 200, 250, 300, 500, 1000];
        const valor = valores[Math.floor(Math.random() * valores.length)];
        
        const metodos = ['pix', 'dinheiro', 'transferencia', 'cartao'];
        const metodo = metodos[Math.floor(Math.random() * metodos.length)];
        
        await pool.run(`
          INSERT INTO dizimos (usuario_id, valor, data_pagamento, metodo_pagamento, status)
          VALUES (?, ?, ?, ?, 'confirmado')
        `, [
          usuarioAleatorio.id,
          valor,
          data.toISOString().split('T')[0],
          metodo
        ]);
      }
      
      console.log('✅ 20 dízimos criados\n');
    }

    // Estatísticas finais
    const agora = new Date();
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios WHERE status = 'ativo') as usuarios,
        (SELECT COUNT(*) FROM dizimos) as dizimos,
        (SELECT SUM(valor) FROM dizimos WHERE status = 'confirmado') as total_dizimos,
        (SELECT COUNT(*) FROM usuarios WHERE data_nascimento IS NOT NULL AND strftime('%m', data_nascimento) = ?) as aniv_mes
    `, [String(agora.getMonth() + 1).padStart(2, '0')]);

    console.log('📊 RESUMO DOS DADOS:');
    console.log('===================');
    console.log(`👥 Usuários ativos: ${stats[0].usuarios}`);
    console.log(`💰 Total de dízimos: ${stats[0].dizimos}`);
    console.log(`💵 Valor total: R$ ${(stats[0].total_dizimos || 0).toFixed(2)}`);
    console.log(`🎂 Aniversariantes este mês: ${stats[0].aniv_mes}`);
    console.log('\n✅ Dados de teste criados com sucesso!');
    console.log('\n🔑 Login de teste:');
    console.log('   Email: admin@igreja.com');
    console.log('   Senha: 123456');
    console.log('\n💡 Agora acesse http://localhost:3000 e faça login!');

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  }
  
  process.exit(0);
}

criarDadosTeste();
