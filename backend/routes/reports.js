const express = require('express');
const pool = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Dashboard geral - apenas admin/tesoureiro/pastor
router.get('/dashboard', authMiddleware, requireRole(['admin', 'tesoureiro', 'pastor']), async (req, res) => {
  try {
    // Total de dízimos confirmados no mês atual
    const [dizimosMes] = await pool.execute(`
      SELECT SUM(valor) as total 
      FROM dizimos 
      WHERE status = 'confirmado' 
      AND MONTH(data_pagamento) = MONTH(CURRENT_DATE()) 
      AND YEAR(data_pagamento) = YEAR(CURRENT_DATE())
    `);

    // Total de ofertas confirmadas no mês atual
    const [ofertasMes] = await pool.execute(`
      SELECT SUM(valor) as total 
      FROM ofertas 
      WHERE status = 'confirmado' 
      AND MONTH(data_oferta) = MONTH(CURRENT_DATE()) 
      AND YEAR(data_oferta) = YEAR(CURRENT_DATE())
    `);

    // Dízimos pendentes
    const [dizimosPendentes] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM dizimos 
      WHERE status = 'pendente'
    `);

    // Usuários ativos
    const [usuariosAtivos] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM usuarios 
      WHERE status = 'ativo'
    `);

    // Campanhas ativas
    const [campanhasAtivas] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM campanhas 
      WHERE status = 'ativa'
    `);

    res.json({
      dizimos_mes: dizimosMes[0].total || 0,
      ofertas_mes: ofertasMes[0].total || 0,
      dizimos_pendentes: dizimosPendentes[0].total || 0,
      usuarios_ativos: usuariosAtivos[0].total || 0,
      campanhas_ativas: campanhasAtivas[0].total || 0
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

// Relatório de dízimos por período
router.get('/dizimos', authMiddleware, requireRole(['admin', 'tesoureiro', 'pastor']), async (req, res) => {
  try {
    const { data_inicio, data_fim, status = 'confirmado' } = req.query;

    let query = `
      SELECT d.*, u.nome as usuario_nome, u.email as usuario_email 
      FROM dizimos d 
      JOIN usuarios u ON d.usuario_id = u.id 
      WHERE d.status = ?
    `;
    let params = [status];

    if (data_inicio) {
      query += ' AND d.data_pagamento >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      query += ' AND d.data_pagamento <= ?';
      params.push(data_fim);
    }

    query += ' ORDER BY d.data_pagamento DESC';

    const [rows] = await pool.execute(query, params);

    // Calcular totais
    const total = rows.reduce((sum, dizimo) => sum + parseFloat(dizimo.valor), 0);

    res.json({
      dizimos: rows,
      total,
      periodo: { data_inicio, data_fim },
      status
    });

  } catch (error) {
    console.error('Error fetching dizimos report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório de dízimos' });
  }
});

// Relatório pessoal do usuário
router.get('/meus-dizimos', authMiddleware, async (req, res) => {
  try {
    const { ano = new Date().getFullYear() } = req.query;

    const [rows] = await pool.execute(`
      SELECT 
        MONTH(data_pagamento) as mes,
        SUM(valor) as total,
        COUNT(*) as quantidade
      FROM dizimos 
      WHERE usuario_id = ? 
      AND status = 'confirmado'
      AND YEAR(data_pagamento) = ?
      GROUP BY MONTH(data_pagamento)
      ORDER BY mes
    `, [req.user.id, ano]);

    // Total do ano
    const [totalAno] = await pool.execute(`
      SELECT SUM(valor) as total 
      FROM dizimos 
      WHERE usuario_id = ? 
      AND status = 'confirmado'
      AND YEAR(data_pagamento) = ?
    `, [req.user.id, ano]);

    res.json({
      dizimos_por_mes: rows,
      total_ano: totalAno[0].total || 0,
      ano: parseInt(ano)
    });

  } catch (error) {
    console.error('Error fetching personal report:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório pessoal' });
  }
});

module.exports = router;