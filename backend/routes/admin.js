const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Middleware para rotas admin
router.use(authMiddleware);
router.use(requireRole(['admin', 'tesoureiro', 'pastor']));

// Listar todos os dízimos pendentes
router.get('/dizimos/pendentes', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT d.*, u.nome as usuario_nome, u.email as usuario_email 
      FROM dizimos d 
      JOIN usuarios u ON d.usuario_id = u.id 
      WHERE d.status = 'pendente' 
      ORDER BY d.data_cadastro DESC
    `);

    res.json({ dizimos: rows });

  } catch (error) {
    console.error('Error fetching pending dizimos:', error);
    res.status(500).json({ error: 'Erro ao buscar dízimos pendentes' });
  }
});

// Confirmar dízimo
router.put('/dizimos/:id/confirmar', requireRole(['admin', 'tesoureiro']), async (req, res) => {
  try {
    const dizimoId = req.params.id;

    const [result] = await pool.execute(
      'UPDATE dizimos SET status = "confirmado", confirmado_por = ?, data_confirmacao = NOW() WHERE id = ? AND status = "pendente"',
      [req.user.id, dizimoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dízimo não encontrado ou já processado' });
    }

    res.json({ message: 'Dízimo confirmado com sucesso' });

  } catch (error) {
    console.error('Error confirming dizimo:', error);
    res.status(500).json({ error: 'Erro ao confirmar dízimo' });
  }
});

// Rejeitar dízimo
router.put('/dizimos/:id/rejeitar', requireRole(['admin', 'tesoureiro']), async (req, res) => {
  try {
    const dizimoId = req.params.id;

    const [result] = await pool.execute(
      'UPDATE dizimos SET status = "cancelado", confirmado_por = ?, data_confirmacao = NOW() WHERE id = ? AND status = "pendente"',
      [req.user.id, dizimoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dízimo não encontrado ou já processado' });
    }

    res.json({ message: 'Dízimo rejeitado' });

  } catch (error) {
    console.error('Error rejecting dizimo:', error);
    res.status(500).json({ error: 'Erro ao rejeitar dízimo' });
  }
});

// Criar nova campanha
router.post('/campanhas', requireRole(['admin', 'pastor']), [
  body('nome').notEmpty().withMessage('Nome da campanha é obrigatório'),
  body('data_inicio').isDate().withMessage('Data de início inválida'),
  body('meta_valor').optional().isFloat({ min: 0 }).withMessage('Meta deve ser um valor positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, descricao, meta_valor, data_inicio, data_fim } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO campanhas (nome, descricao, meta_valor, data_inicio, data_fim, criado_por) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, meta_valor, data_inicio, data_fim, req.user.id]
    );

    res.status(201).json({
      message: 'Campanha criada com sucesso',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating campanha:', error);
    res.status(500).json({ error: 'Erro ao criar campanha' });
  }
});

// Listar todos os usuários
router.get('/usuarios', requireRole(['admin']), async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, nome, email, telefone, tipo_usuario, status, data_cadastro 
      FROM usuarios 
      ORDER BY nome
    `);

    res.json({ usuarios: rows });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Atualizar tipo de usuário
router.put('/usuarios/:id/tipo', requireRole(['admin']), [
  body('tipo_usuario').isIn(['membro', 'tesoureiro', 'pastor', 'admin']).withMessage('Tipo de usuário inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { tipo_usuario } = req.body;

    const [result] = await pool.execute(
      'UPDATE usuarios SET tipo_usuario = ? WHERE id = ?',
      [tipo_usuario, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Tipo de usuário atualizado com sucesso' });

  } catch (error) {
    console.error('Error updating user type:', error);
    res.status(500).json({ error: 'Erro ao atualizar tipo de usuário' });
  }
});

module.exports = router;