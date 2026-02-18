const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');

// Listar todos os fornecedores
router.get('/', auth, (req, res) => {
  const sql = `
    SELECT f.*, 
      COUNT(d.id) as total_despesas,
      SUM(d.valor) as total_gasto
    FROM fornecedores f
    LEFT JOIN despesas d ON f.id = d.fornecedor_id
    WHERE f.ativo = 1
    GROUP BY f.id
    ORDER BY f.nome
  `;

  db.all(sql, [], (err, fornecedores) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ fornecedores });
  });
});

// Buscar fornecedor por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT f.*,
      COUNT(d.id) as total_despesas,
      SUM(d.valor) as total_gasto
    FROM fornecedores f
    LEFT JOIN despesas d ON f.id = d.fornecedor_id
    WHERE f.id = ?
    GROUP BY f.id
  `;

  db.get(sql, [id], (err, fornecedor) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  });
});

// Criar novo fornecedor
router.post('/', auth, (req, res) => {
  const {
    nome,
    cnpj,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    tipo_servico,
    observacoes
  } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  const sql = `
    INSERT INTO fornecedores (
      nome, cnpj, telefone, email, endereco, cidade, estado, cep,
      tipo_servico, observacoes, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.run(sql, [
    nome,
    cnpj || null,
    telefone || null,
    email || null,
    endereco || null,
    cidade || null,
    estado || null,
    cep || null,
    tipo_servico || null,
    observacoes || null
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
      'fornecedores',
      this.lastID,
      JSON.stringify({ nome, cnpj, tipo_servico })
    ]);

    res.status(201).json({
      message: 'Fornecedor cadastrado com sucesso',
      id: this.lastID
    });
  });
});

// Atualizar fornecedor
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const {
    nome,
    cnpj,
    telefone,
    email,
    endereco,
    cidade,
    estado,
    cep,
    tipo_servico,
    observacoes
  } = req.body;

  const sql = `
    UPDATE fornecedores SET
      nome = ?,
      cnpj = ?,
      telefone = ?,
      email = ?,
      endereco = ?,
      cidade = ?,
      estado = ?,
      cep = ?,
      tipo_servico = ?,
      observacoes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [
    nome,
    cnpj || null,
    telefone || null,
    email || null,
    endereco || null,
    cidade || null,
    estado || null,
    cep || null,
    tipo_servico || null,
    observacoes || null,
    id
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
      'UPDATE',
      'fornecedores',
      id,
      JSON.stringify({ nome, cnpj, tipo_servico })
    ]);

    res.json({ message: 'Fornecedor atualizado com sucesso' });
  });
});

// Desativar fornecedor
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  // Verificar permissão
  if (!['admin', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  const sql = 'UPDATE fornecedores SET ativo = 0 WHERE id = ?';

  db.run(sql, [id], function(err) {
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
      'DELETE',
      'fornecedores',
      id,
      JSON.stringify({ acao: 'desativado' })
    ]);

    res.json({ message: 'Fornecedor desativado com sucesso' });
  });
});

module.exports = router;
