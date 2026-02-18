const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth, requireRole } = require('../middleware/auth');

// Listar logs de auditoria
router.get('/', auth, (req, res) => {
  // Apenas admin pode ver logs
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { 
    usuario_id, 
    tabela, 
    acao, 
    data_inicio, 
    data_fim,
    limit = 100,
    offset = 0
  } = req.query;

  let sql = `
    SELECT l.*, u.nome as usuario_nome, u.email
    FROM logs_auditoria l
    LEFT JOIN usuarios u ON l.usuario_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (usuario_id) {
    sql += ' AND l.usuario_id = ?';
    params.push(usuario_id);
  }

  if (tabela) {
    sql += ' AND l.tabela = ?';
    params.push(tabela);
  }

  if (acao) {
    sql += ' AND l.acao = ?';
    params.push(acao);
  }

  if (data_inicio) {
    sql += ' AND DATE(l.created_at) >= ?';
    params.push(data_inicio);
  }

  if (data_fim) {
    sql += ' AND DATE(l.created_at) <= ?';
    params.push(data_fim);
  }

  sql += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, logs) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Contar total
    let countSql = `
      SELECT COUNT(*) as total
      FROM logs_auditoria l
      WHERE 1=1
    `;
    const countParams = [];

    if (usuario_id) {
      countSql += ' AND l.usuario_id = ?';
      countParams.push(usuario_id);
    }
    if (tabela) {
      countSql += ' AND l.tabela = ?';
      countParams.push(tabela);
    }
    if (acao) {
      countSql += ' AND l.acao = ?';
      countParams.push(acao);
    }
    if (data_inicio) {
      countSql += ' AND DATE(l.created_at) >= ?';
      countParams.push(data_inicio);
    }
    if (data_fim) {
      countSql += ' AND DATE(l.created_at) <= ?';
      countParams.push(data_fim);
    }

    db.get(countSql, countParams, (err, count) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        logs,
        total: count.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    });
  });
});

// Estatísticas de auditoria
router.get('/stats', auth, (req, res) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const sql = `
    SELECT 
      acao,
      tabela,
      COUNT(*) as quantidade,
      DATE(created_at) as data
    FROM logs_auditoria
    WHERE DATE(created_at) >= DATE('now', '-30 days')
    GROUP BY acao, tabela, DATE(created_at)
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Ações por usuário
    const sqlUsuarios = `
      SELECT 
        u.nome,
        u.email,
        COUNT(*) as total_acoes,
        l.acao,
        COUNT(l.acao) as quantidade
      FROM logs_auditoria l
      JOIN usuarios u ON l.usuario_id = u.id
      WHERE DATE(l.created_at) >= DATE('now', '-30 days')
      GROUP BY u.id, l.acao
      ORDER BY total_acoes DESC
      LIMIT 10
    `;

    db.all(sqlUsuarios, [], (err, usuarios) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        atividades: stats,
        usuarios_ativos: usuarios
      });
    });
  });
});

// Exportar logs
router.get('/export', auth, (req, res) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const { data_inicio, data_fim } = req.query;

  let sql = `
    SELECT l.*, u.nome as usuario_nome, u.email
    FROM logs_auditoria l
    LEFT JOIN usuarios u ON l.usuario_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (data_inicio) {
    sql += ' AND DATE(l.created_at) >= ?';
    params.push(data_inicio);
  }

  if (data_fim) {
    sql += ' AND DATE(l.created_at) <= ?';
    params.push(data_fim);
  }

  sql += ' ORDER BY l.created_at DESC';

  db.all(sql, params, (err, logs) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Converter para CSV
    const header = 'ID,Usuário,Email,Ação,Tabela,Registro ID,Data,Detalhes\n';
    const csv = logs.map(log => {
      return `${log.id},"${log.usuario_nome}","${log.email}","${log.acao}","${log.tabela}",${log.registro_id},"${log.created_at}","${log.detalhes || ''}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=auditoria_${Date.now()}.csv`);
    res.send(header + csv);
  });
});

module.exports = router;
