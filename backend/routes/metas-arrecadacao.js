const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');

// Listar metas de arrecadação
router.get('/', auth, (req, res) => {
  const { ano } = req.query;
  
  let sql = `
    SELECT o.*, u.nome as criado_por_nome
    FROM orcamentos o
    LEFT JOIN usuarios u ON o.criado_por = u.id
  `;
  const params = [];

  if (ano) {
    sql += ' WHERE o.ano = ?';
    params.push(ano);
  }

  sql += ' ORDER BY o.ano DESC, o.mes DESC';

  db.all(sql, params, (err, metas) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ metas });
  });
});

// Buscar meta de arrecadação por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT o.*, u.nome as criado_por_nome
    FROM orcamentos o
    LEFT JOIN usuarios u ON o.criado_por = u.id
    WHERE o.id = ?
  `;

  db.get(sql, [id], (err, meta) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!meta) {
      return res.status(404).json({ error: 'Meta de arrecadação não encontrada' });
    }

    // Buscar itens da meta
    const sqlItens = 'SELECT * FROM orcamento_itens WHERE orcamento_id = ?';
    db.all(sqlItens, [id], (err, itens) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      meta.itens = itens;
      res.json(meta);
    });
  });
});

// Criar meta de arrecadação
router.post('/', auth, (req, res) => {
  const { ano, mes, descricao, itens } = req.body;

  if (!ano || !itens || itens.length === 0) {
    return res.status(400).json({ error: 'Ano e itens são obrigatórios' });
  }

  // Verificar permissão
  if (!['admin', 'pastor', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  // Calcular totais (focado em receitas/arrecadação)
  const total_receita = itens
    .filter(i => i.tipo === 'receita')
    .reduce((sum, i) => sum + parseFloat(i.valor_previsto), 0);
  
  const total_despesa = itens
    .filter(i => i.tipo === 'despesa')
    .reduce((sum, i) => sum + parseFloat(i.valor_previsto), 0);

  const saldo_previsto = total_receita - total_despesa;

  const sql = `
    INSERT INTO orcamentos (
      ano, mes, descricao, total_receita, total_despesa, saldo_previsto,
      criado_por, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ativo')
  `;

  db.run(sql, [
    ano,
    mes || null,
    descricao || null,
    total_receita,
    total_despesa,
    saldo_previsto,
    req.usuario.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const metaId = this.lastID;

    // Inserir itens da meta de arrecadação
    const sqlItem = `
      INSERT INTO orcamento_itens (
        orcamento_id, categoria, tipo, valor_previsto, observacoes
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sqlItem);
    itens.forEach(item => {
      stmt.run([
        metaId,
        item.categoria,
        item.tipo,
        parseFloat(item.valor_previsto),
        item.observacoes || null
      ]);
    });
    stmt.finalize();

    // Log de auditoria
    const logSql = `
      INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(logSql, [
      req.usuario.id,
      'CREATE',
      'orcamentos',
      metaId,
      JSON.stringify({ ano, mes, total_receita, total_despesa })
    ]);

    res.status(201).json({
      message: 'Meta de arrecadação criada com sucesso',
      id: metaId
    });
  });
});

// Atualizar item da meta com valor realizado/arrecadado
router.put('/itens/:id/realizado', auth, (req, res) => {
  const { id } = req.params;
  const { valor_realizado } = req.body;

  const sql = `
    UPDATE orcamento_itens SET
      valor_realizado = ?,
      percentual_executado = (? * 100.0 / valor_previsto),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [valor_realizado, valor_realizado, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Valor arrecadado atualizado' });
  });
});

// Comparar meta vs arrecadado
router.get('/:id/comparativo', auth, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      categoria,
      tipo,
      SUM(valor_previsto) as meta,
      SUM(valor_realizado) as arrecadado,
      SUM(valor_previsto - valor_realizado) as diferenca,
      AVG(percentual_executado) as percentual_atingido
    FROM orcamento_itens
    WHERE orcamento_id = ?
    GROUP BY categoria, tipo
  `;

  db.all(sql, [id], (err, comparativo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ comparativo });
  });
});

// Estatísticas de metas de arrecadação
router.get('/stats/resumo', auth, (req, res) => {
  const { ano } = req.query;

  let whereClause = '1=1';
  const params = [];

  if (ano) {
    whereClause += ' AND ano = ?';
    params.push(ano);
  }

  const sql = `
    SELECT 
      COUNT(*) as total_metas,
      SUM(total_receita) as total_meta_receita,
      SUM(total_despesa) as total_meta_despesa,
      AVG(saldo_previsto) as media_saldo_previsto,
      status
    FROM orcamentos
    WHERE ${whereClause}
    GROUP BY status
  `;

  db.all(sql, params, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ stats });
  });
});

module.exports = router;
