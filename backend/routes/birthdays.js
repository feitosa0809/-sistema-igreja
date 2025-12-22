const express = require('express');
const pool = require('../config/database-sqlite');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Listar aniversariantes do mês
router.get('/month/:mes?', authMiddleware, async (req, res) => {
  try {
    const mes = req.params.mes || new Date().getMonth() + 1; // Mês atual se não especificado
    
    const query = `
      SELECT 
        id,
        nome,
        email,
        telefone,
        data_nascimento,
        strftime('%d', data_nascimento) as dia_aniversario,
        strftime('%m', data_nascimento) as mes_aniversario,
        (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
      FROM usuarios
      WHERE 
        strftime('%m', data_nascimento) = ?
        AND status = 'ativo'
        AND data_nascimento IS NOT NULL
      ORDER BY strftime('%d', data_nascimento)
    `;

    const rows = await pool.query(query, [mes.toString().padStart(2, '0')]);
    const resultados = Array.isArray(rows) ? rows : [];

    res.json({
      mes: parseInt(mes),
      total: resultados.length,
      aniversariantes: resultados.map(row => ({
        id: row.id,
        nome: row.nome,
        email: row.email,
        telefone: row.telefone,
        data_nascimento: row.data_nascimento,
        dia: parseInt(row.dia_aniversario),
        idade: row.idade
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar aniversariantes:', error);
    res.status(500).json({ error: 'Erro ao buscar aniversariantes', message: error.message });
  }
});

// Aniversariantes de hoje
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');

    const query = `
      SELECT 
        id,
        nome,
        email,
        telefone,
        data_nascimento,
        (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
      FROM usuarios
      WHERE 
        strftime('%d', data_nascimento) = ?
        AND strftime('%m', data_nascimento) = ?
        AND status = 'ativo'
        AND data_nascimento IS NOT NULL
      ORDER BY nome
    `;

    const rows = await pool.query(query, [dia, mes]);
    const resultados = Array.isArray(rows) ? rows : [];

    res.json({
      data: hoje.toISOString().split('T')[0],
      total: resultados.length,
      aniversariantes: resultados.map(row => ({
        id: row.id,
        nome: row.nome,
        email: row.email,
        telefone: row.telefone,
        data_nascimento: row.data_nascimento,
        idade: row.idade
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar aniversariantes de hoje:', error);
    res.status(500).json({ error: 'Erro ao buscar aniversariantes de hoje', message: error.message });
  }
});

// Próximos aniversários (próximos 7 dias)
router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const hoje = new Date();
    const proximos7dias = [];
    
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      proximos7dias.push({
        dia: data.getDate().toString().padStart(2, '0'),
        mes: (data.getMonth() + 1).toString().padStart(2, '0')
      });
    }

    const query = `
      SELECT 
        id,
        nome,
        email,
        telefone,
        data_nascimento,
        strftime('%d', data_nascimento) as dia,
        strftime('%m', data_nascimento) as mes,
        (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
      FROM usuarios
      WHERE 
        status = 'ativo'
        AND data_nascimento IS NOT NULL
      ORDER BY strftime('%m', data_nascimento), strftime('%d', data_nascimento)
    `;

    const rows = await pool.query(query);
    const resultados = Array.isArray(rows) ? rows : [];
    
    const aniversariantesProximos = resultados.filter(row => {
      return proximos7dias.some(d => d.dia === row.dia && d.mes === row.mes);
    }).map(row => {
      const dataAniv = new Date(hoje.getFullYear(), parseInt(row.mes) - 1, parseInt(row.dia));
      const diasRestantes = Math.ceil((dataAniv - hoje) / (1000 * 60 * 60 * 24));
      
      return {
        id: row.id,
        nome: row.nome,
        email: row.email,
        telefone: row.telefone,
        data_nascimento: row.data_nascimento,
        dia: parseInt(row.dia),
        mes: parseInt(row.mes),
        idade: row.idade,
        dias_restantes: diasRestantes
      };
    }).sort((a, b) => a.dias_restantes - b.dias_restantes);

    res.json({
      total: aniversariantesProximos.length,
      aniversariantes: aniversariantesProximos
    });

  } catch (error) {
    console.error('Erro ao buscar próximos aniversários:', error);
    res.status(500).json({ error: 'Erro ao buscar próximos aniversários', message: error.message });
  }
});

// Estatísticas de aniversários
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT 
        strftime('%m', data_nascimento) as mes,
        COUNT(*) as total
      FROM usuarios
      WHERE 
        status = 'ativo'
        AND data_nascimento IS NOT NULL
      GROUP BY strftime('%m', data_nascimento)
      ORDER BY mes
    `;

    const rows = await pool.query(query);
    const resultados = Array.isArray(rows) ? rows : [];

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const estatisticas = meses.map((nome, index) => {
      const mesNum = (index + 1).toString().padStart(2, '0');
      const dados = resultados.find(r => r.mes === mesNum);
      return {
        mes: index + 1,
        nome_mes: nome,
        total_aniversariantes: dados ? dados.total : 0
      };
    });

    const totalGeral = resultados.reduce((acc, row) => acc + row.total, 0);

    res.json({
      total_geral: totalGeral,
      por_mes: estatisticas
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas', message: error.message });
  }
});

module.exports = router;
