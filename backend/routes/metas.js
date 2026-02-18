const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');

// Listar todas as metas
router.get('/', auth, (req, res) => {
  const { status, tipo } = req.query;
  
  let sql = `
    SELECT m.*, u.nome as criado_por_nome,
      ROUND((m.valor_atual * 100.0 / m.valor_meta), 2) as percentual_atingido
    FROM metas m
    LEFT JOIN usuarios u ON m.criado_por = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    sql += ' AND m.status = ?';
    params.push(status);
  }

  if (tipo) {
    sql += ' AND m.tipo = ?';
    params.push(tipo);
  }

  sql += ' ORDER BY m.data_fim DESC';

  db.all(sql, params, (err, metas) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ metas });
  });
});

// Buscar meta por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT m.*, u.nome as criado_por_nome,
      ROUND((m.valor_atual * 100.0 / m.valor_meta), 2) as percentual_atingido
    FROM metas m
    LEFT JOIN usuarios u ON m.criado_por = u.id
    WHERE m.id = ?
  `;

  db.get(sql, [id], (err, meta) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }
    res.json(meta);
  });
});

// Criar nova meta
router.post('/', auth, (req, res) => {
  const {
    titulo,
    descricao,
    tipo,
    valor_meta,
    data_inicio,
    data_fim,
    categoria
  } = req.body;

  if (!titulo || !tipo || !valor_meta || !data_inicio || !data_fim) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: titulo, tipo, valor_meta, data_inicio, data_fim' 
    });
  }

  // Verificar permissão
  if (!['admin', 'pastor', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  const sql = `
    INSERT INTO metas (
      titulo, descricao, tipo, valor_meta, data_inicio, data_fim,
      categoria, criado_por, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ativa')
  `;

  db.run(sql, [
    titulo,
    descricao || null,
    tipo,
    parseFloat(valor_meta),
    data_inicio,
    data_fim,
    categoria || null,
    req.usuario.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Log de auditoria
    const logSql = `
      INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(logSql, [
      req.usuario.id,
      'CREATE',
      'metas',
      this.lastID,
      JSON.stringify({ titulo, tipo, valor_meta })
    ]);

    res.status(201).json({
      message: 'Meta criada com sucesso',
      id: this.lastID
    });
  });
});

// Atualizar progresso da meta
router.put('/:id/progresso', auth, (req, res) => {
  const { id } = req.params;
  const { valor_atual } = req.body;

  if (valor_atual === undefined) {
    return res.status(400).json({ error: 'valor_atual é obrigatório' });
  }

  // Buscar meta para verificar se atingiu o objetivo
  db.get('SELECT valor_meta FROM metas WHERE id = ?', [id], (err, meta) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    const novoStatus = valor_atual >= meta.valor_meta ? 'concluida' : 'ativa';

    const sql = `
      UPDATE metas SET
        valor_atual = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [parseFloat(valor_atual), novoStatus, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Log
      const logSql = `
        INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(logSql, [
        req.usuario.id,
        'UPDATE',
        'metas',
        id,
        JSON.stringify({ valor_atual, status: novoStatus })
      ]);

      res.json({ 
        message: 'Progresso atualizado',
        status: novoStatus
      });
    });
  });
});

// Atualizar meta
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descricao,
    tipo,
    valor_meta,
    data_inicio,
    data_fim,
    categoria,
    status
  } = req.body;

  const sql = `
    UPDATE metas SET
      titulo = ?,
      descricao = ?,
      tipo = ?,
      valor_meta = ?,
      data_inicio = ?,
      data_fim = ?,
      categoria = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [
    titulo,
    descricao || null,
    tipo,
    parseFloat(valor_meta),
    data_inicio,
    data_fim,
    categoria || null,
    status || 'ativa',
    id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Log
    const logSql = `
      INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(logSql, [
      req.usuario.id,
      'UPDATE',
      'metas',
      id,
      JSON.stringify({ titulo, tipo, valor_meta, status })
    ]);

    res.json({ message: 'Meta atualizada com sucesso' });
  });
});

// Deletar meta
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  if (!['admin', 'pastor'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  db.run('DELETE FROM metas WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Log
    const logSql = `
      INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(logSql, [
      req.usuario.id,
      'DELETE',
      'metas',
      id,
      JSON.stringify({ acao: 'deletado' })
    ]);

    res.json({ message: 'Meta deletada com sucesso' });
  });
});

// Estatísticas de metas
router.get('/stats/resumo', auth, (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_metas,
      SUM(CASE WHEN status = 'ativa' THEN 1 ELSE 0 END) as ativas,
      SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) as concluidas,
      SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
      AVG(valor_atual * 100.0 / valor_meta) as percentual_medio
    FROM metas
  `;

  db.get(sql, [], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(stats);
  });
});

module.exports = router;
