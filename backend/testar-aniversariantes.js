const db = require('./config/database-sqlite');

async function testarAniversariantes() {
  console.log('\n🎂 TESTANDO CONSULTAS DE ANIVERSARIANTES\n');

  try {
    // Teste 1: Aniversariantes de dezembro
    console.log('📅 Teste 1: Aniversariantes de Dezembro (mês 12)');
    const dezembro = await db.query(`
      SELECT 
        id,
        nome,
        email,
        data_nascimento,
        strftime('%d', data_nascimento) as dia,
        strftime('%m', data_nascimento) as mes,
        (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
      FROM usuarios
      WHERE 
        strftime('%m', data_nascimento) = '12'
        AND status = 'ativo'
        AND data_nascimento IS NOT NULL
      ORDER BY strftime('%d', data_nascimento)
    `);
    
    console.log(`   Encontrados: ${dezembro.length} aniversariantes`);
    dezembro.forEach(pessoa => {
      console.log(`   - ${pessoa.nome} (${pessoa.dia}/12) - ${pessoa.idade} anos`);
    });

    // Teste 2: Aniversariantes de hoje
    console.log('\n🎉 Teste 2: Aniversariantes de Hoje');
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    
    console.log(`   Data: ${dia}/${mes}/${hoje.getFullYear()}`);
    
    const aniversariantesHoje = await db.query(`
      SELECT 
        id,
        nome,
        email,
        data_nascimento,
        (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
      FROM usuarios
      WHERE 
        strftime('%d', data_nascimento) = ?
        AND strftime('%m', data_nascimento) = ?
        AND status = 'ativo'
        AND data_nascimento IS NOT NULL
      ORDER BY nome
    `, [dia, mes]);
    
    console.log(`   Encontrados: ${aniversariantesHoje.length} aniversariantes`);
    aniversariantesHoje.forEach(pessoa => {
      console.log(`   - ${pessoa.nome} - ${pessoa.idade} anos - 🎂 PARABÉNS!`);
    });

    // Teste 3: Todos os usuários com data de nascimento
    console.log('\n👥 Teste 3: Total de usuários com data de nascimento cadastrada');
    const total = await db.query(`
      SELECT COUNT(*) as total
      FROM usuarios
      WHERE data_nascimento IS NOT NULL
        AND status = 'ativo'
    `);
    
    console.log(`   Total: ${total[0].total} usuários`);

    // Teste 4: Estatísticas por mês
    console.log('\n📊 Teste 4: Aniversariantes por mês');
    const estatisticas = await db.query(`
      SELECT 
        strftime('%m', data_nascimento) as mes,
        COUNT(*) as total
      FROM usuarios
      WHERE 
        status = 'ativo'
        AND data_nascimento IS NOT NULL
      GROUP BY strftime('%m', data_nascimento)
      ORDER BY mes
    `);
    
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    estatisticas.forEach(stat => {
      const mesNome = meses[parseInt(stat.mes) - 1];
      console.log(`   ${mesNome}: ${stat.total} aniversariante(s)`);
    });

    console.log('\n✅ Todos os testes concluídos com sucesso!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erro ao testar:', error);
    console.error('Detalhes:', error.message);
    process.exit(1);
  }
}

testarAniversariantes();
