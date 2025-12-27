const db = require('./config/database-sqlite');

async function testar() {
  // Data de HOJE do sistema
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  console.log('📅 Buscando aniversariantes de HOJE:', dia + '/' + mes + '/2025');
  console.log('🔍 Formato de busca:', mes + '-' + dia);

  const rows = await db.query(`
    SELECT id, nome, data_nascimento, 
           strftime('%d', data_nascimento) as dia,
           strftime('%m', data_nascimento) as mes
    FROM usuarios 
    WHERE strftime('%m-%d', data_nascimento) = ?
    AND status = 'ativo'
  `, [mes + '-' + dia]);

  console.log('\n🎂 Aniversariantes de HOJE (' + dia + '/' + mes + '):', rows.length, 'pessoas');
  rows.forEach(p => {
    console.log(`  - ${p.nome} (nascido em ${p.data_nascimento})`);
  });

  if (rows.length === 0) {
    console.log('\n⚠️ NENHUM aniversariante encontrado para hoje!');
    console.log('Verificando todos os aniversários de dezembro...\n');
    
    const dezembro = await db.query(`
      SELECT id, nome, data_nascimento, 
             strftime('%d', data_nascimento) as dia
      FROM usuarios 
      WHERE strftime('%m', data_nascimento) = '12'
      AND status = 'ativo'
      ORDER BY CAST(strftime('%d', data_nascimento) AS INTEGER)
    `);
    
    console.log('📆 Aniversários em DEZEMBRO:', dezembro.length);
    dezembro.forEach(p => {
      const dia_aniv = p.dia;
      const destaque = (dia_aniv === '26') ? ' ← HOJE!' : '';
      console.log(`  Dia ${dia_aniv}: ${p.nome}${destaque}`);
    });
  }
}

testar().catch(console.error);
