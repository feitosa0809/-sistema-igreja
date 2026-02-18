const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');

// Listar orçamentos
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

  db.all(sql, params, (err, orcamentos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ orcamentos });
  });
});

// Buscar orçamento por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT o.*, u.nome as criado_por_nome
    FROM orcamentos o
    LEFT JOIN usuarios u ON o.criado_por = u.id
    WHERE o.id = ?
  `;

  db.get(sql, [id], (err, orcamento) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!orcamento) {
      return res.status(404).json({ error: 'Orçamento não encontrado' });
    }

    // Buscar itens do orçamento
    const sqlItens = 'SELECT * FROM orcamento_itens WHERE orcamento_id = ?';
    db.all(sqlItens, [id], (err, itens) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      orcamento.itens = itens;
      res.json(orcamento);
    });
  });
});

// Criar orçamento
router.post('/', auth, (req, res) => {
  const { ano, mes, descricao, itens } = req.body;

  if (!ano || !itens || itens.length === 0) {
    return res.status(400).json({ error: 'Ano e itens são obrigatórios' });
  }

  // Verificar permissão
  if (!['admin', 'pastor', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  // Calcular totais
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

    const orcamentoId = this.lastID;

    // Inserir itens do orçamento
    const sqlItem = `
      INSERT INTO orcamento_itens (
        orcamento_id, categoria, tipo, valor_previsto, observacoes
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sqlItem);
    itens.forEach(item => {
      stmt.run([
        orcamentoId,
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
      orcamentoId,
      JSON.stringify({ ano, mes, total_receita, total_despesa })
    ]);

    res.status(201).json({
      message: 'Orçamento criado com sucesso',
      id: orcamentoId
    });
  });
});

// Atualizar item do orçamento com valor realizado
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
    res.json({ message: 'Valor realizado atualizado' });
  });
});

// Comparar orçado vs realizado
router.get('/:id/comparativo', auth, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      categoria,
      tipo,
      SUM(valor_previsto) as previsto,
      SUM(valor_realizado) as realizado,
      SUM(valor_previsto - valor_realizado) as diferenca,
      AVG(percentual_executado) as percentual_medio
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

module.exports = router;
