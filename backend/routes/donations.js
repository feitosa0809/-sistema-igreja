const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuração do multer para upload de comprovantes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/comprovantes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'comprovante-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'), false);
    }
  }
});

// Listar todas as doações do usuário (rota unificada)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const db = require('../config/database-sqlite');

    // Query para buscar dízimos
    const queryDizimos = `
      SELECT 
        id, valor, data_pagamento as data_doacao, 'dizimo' as tipo,
        metodo_pagamento, observacoes, status, comprovante_url, data_cadastro
      FROM dizimos 
      WHERE usuario_id = ? 
      ORDER BY data_pagamento DESC 
      LIMIT ?
    `;

    // Query para buscar ofertas  
    const queryOfertas = `
      SELECT 
        id, valor, data_oferta as data_doacao, tipo_oferta as tipo,
        metodo_pagamento, observacoes, 'pendente' as status, comprovante_url, data_cadastro
      FROM ofertas 
      WHERE usuario_id = ? 
      ORDER BY data_oferta DESC 
      LIMIT ?
    `;

    // Buscar dízimos
    const dizimos = await db.query(queryDizimos, [req.user.id, parseInt(limit)]);
    
    // Buscar ofertas
    const ofertas = await db.query(queryOfertas, [req.user.id, parseInt(limit)]);
    
    // Combinar resultados
    const todasDoacoes = [...(dizimos || []), ...(ofertas || [])]
      .sort((a, b) => new Date(b.data_doacao) - new Date(a.data_doacao))
      .slice(0, parseInt(limit));

    res.json(todasDoacoes);

  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Erro ao buscar doações', details: error.message });
  }
});

// Criar nova doação (rota unificada)
router.post('/', authMiddleware, [
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('tipo').isIn(['dizimo', 'oferta', 'campanha', 'missoes']).withMessage('Tipo inválido'),
  body('metodo_pagamento').isIn(['dinheiro', 'pix', 'cartao', 'transferencia']).withMessage('Método de pagamento inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { valor, tipo, metodo_pagamento, observacoes, data_doacao } = req.body;
    const dataFinal = data_doacao || new Date().toISOString().split('T')[0];
    const db = require('../config/database-sqlite');

    // PIX e cartão são confirmados automaticamente
    const statusInicial = (metodo_pagamento === 'pix' || metodo_pagamento === 'cartao') ? 'confirmado' : 'pendente';
    const confirmadoPor = (statusInicial === 'confirmado') ? req.user.id : null;
    const dataConfirmacao = (statusInicial === 'confirmado') ? new Date().toISOString() : null;

    let result;
    
    if (tipo === 'dizimo') {
      result = await db.run(
        'INSERT INTO dizimos (usuario_id, valor, data_pagamento, metodo_pagamento, observacoes, status, confirmado_por, data_confirmacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, valor, dataFinal, metodo_pagamento, observacoes || '', statusInicial, confirmadoPor, dataConfirmacao]
      );
    } else {
      result = await db.run(
        'INSERT INTO ofertas (usuario_id, valor, data_oferta, tipo_oferta, metodo_pagamento, observacoes, status, confirmado_por, data_confirmacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user.id, valor, dataFinal, tipo, metodo_pagamento, observacoes || '', statusInicial, confirmadoPor, dataConfirmacao]
      );
    }

    res.status(201).json({
      message: 'Doação registrada com sucesso',
      id: result.insertId || result.lastID,
      tipo: tipo,
      valor: valor,
      metodo_pagamento: metodo_pagamento
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Erro ao registrar doação', details: error.message });
  }
});

// Listar dízimos do usuário logado
router.get('/dizimos', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(`
      SELECT d.*, u.nome as confirmado_por_nome 
      FROM dizimos d 
      LEFT JOIN usuarios u ON d.confirmado_por = u.id 
      WHERE d.usuario_id = ? 
      ORDER BY d.data_pagamento DESC 
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM dizimos WHERE usuario_id = ?',
      [req.user.id]
    );

    res.json({
      dizimos: rows,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching dizimos:', error);
    res.status(500).json({ error: 'Erro ao buscar dízimos' });
  }
});

// Cadastrar novo dízimo
router.post('/dizimos', authMiddleware, upload.single('comprovante'), [
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('data_pagamento').isDate().withMessage('Data inválida'),
  body('metodo_pagamento').isIn(['dinheiro', 'pix', 'cartao', 'transferencia']).withMessage('Método de pagamento inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { valor, data_pagamento, metodo_pagamento, observacoes } = req.body;
    const comprovante_url = req.file ? `/uploads/comprovantes/${req.file.filename}` : null;

    // PIX e cartão são confirmados automaticamente
    const statusInicial = (metodo_pagamento === 'pix' || metodo_pagamento === 'cartao') ? 'confirmado' : 'pendente';
    const confirmadoPor = (statusInicial === 'confirmado') ? req.user.id : null;
    const dataConfirmacao = (statusInicial === 'confirmado') ? new Date().toISOString() : null;

    const [result] = await pool.execute(
      'INSERT INTO dizimos (usuario_id, valor, data_pagamento, metodo_pagamento, comprovante_url, observacoes, status, confirmado_por, data_confirmacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, valor, data_pagamento, metodo_pagamento, comprovante_url, observacoes, statusInicial, confirmadoPor, dataConfirmacao]
    );

    res.status(201).json({
      message: 'Dízimo cadastrado com sucesso',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating dizimo:', error);
    res.status(500).json({ error: 'Erro ao cadastrar dízimo' });
  }
});

// Listar ofertas do usuário
router.get('/ofertas', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(`
      SELECT * FROM ofertas 
      WHERE usuario_id = ? 
      ORDER BY data_oferta DESC 
      LIMIT ? OFFSET ?
    `, [req.user.id, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM ofertas WHERE usuario_id = ?',
      [req.user.id]
    );

    res.json({
      ofertas: rows,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching ofertas:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
});

// Cadastrar nova oferta
router.post('/ofertas', authMiddleware, upload.single('comprovante'), [
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('data_oferta').isDate().withMessage('Data inválida'),
  body('tipo_oferta').notEmpty().withMessage('Tipo de oferta é obrigatório'),
  body('metodo_pagamento').isIn(['dinheiro', 'pix', 'cartao', 'transferencia']).withMessage('Método de pagamento inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { valor, data_oferta, tipo_oferta, metodo_pagamento, observacoes } = req.body;
    const comprovante_url = req.file ? `/uploads/comprovantes/${req.file.filename}` : null;

    // PIX e cartão são confirmados automaticamente
    const statusInicial = (metodo_pagamento === 'pix' || metodo_pagamento === 'cartao') ? 'confirmado' : 'pendente';
    const confirmadoPor = (statusInicial === 'confirmado') ? req.user.id : null;
    const dataConfirmacao = (statusInicial === 'confirmado') ? new Date().toISOString() : null;

    const [result] = await pool.execute(
      'INSERT INTO ofertas (usuario_id, valor, data_oferta, tipo_oferta, metodo_pagamento, comprovante_url, observacoes, status, confirmado_por, data_confirmacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, valor, data_oferta, tipo_oferta, metodo_pagamento, comprovante_url, observacoes, statusInicial, confirmadoPor, dataConfirmacao]
    );

    res.status(201).json({
      message: 'Oferta cadastrada com sucesso',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating oferta:', error);
    res.status(500).json({ error: 'Erro ao cadastrar oferta' });
  }
});

// Listar campanhas ativas
router.get('/campanhas', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, u.nome as criado_por_nome,
        (SELECT SUM(valor) FROM contribuicoes_campanha WHERE campanha_id = c.id AND status = 'confirmado') as total_arrecadado
      FROM campanhas c 
      JOIN usuarios u ON c.criado_por = u.id 
      WHERE c.status = 'ativa' 
      ORDER BY c.data_inicio DESC
    `);

    res.json({ campanhas: rows });

  } catch (error) {
    console.error('Error fetching campanhas:', error);
    res.status(500).json({ error: 'Erro ao buscar campanhas' });
  }
});

// Contribuir para campanha
router.post('/campanhas/:id/contribuir', authMiddleware, upload.single('comprovante'), [
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('metodo_pagamento').isIn(['dinheiro', 'pix', 'cartao', 'transferencia']).withMessage('Método de pagamento inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campanhaId = req.params.id;
    const { valor, metodo_pagamento, observacoes } = req.body;
    const comprovante_url = req.file ? `/uploads/comprovantes/${req.file.filename}` : null;

    // Verificar se campanha existe e está ativa
    const [campanhaRows] = await pool.execute(
      'SELECT id FROM campanhas WHERE id = ? AND status = "ativa"',
      [campanhaId]
    );

    if (campanhaRows.length === 0) {
      return res.status(404).json({ error: 'Campanha não encontrada ou inativa' });
    }

    const [result] = await pool.execute(
      'INSERT INTO contribuicoes_campanha (campanha_id, usuario_id, valor, data_contribuicao, metodo_pagamento, comprovante_url, observacoes) VALUES (?, ?, ?, CURDATE(), ?, ?, ?)',
      [campanhaId, req.user.id, valor, metodo_pagamento, comprovante_url, observacoes]
    );

    res.status(201).json({
      message: 'Contribuição realizada com sucesso',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating contribuicao:', error);
    res.status(500).json({ error: 'Erro ao realizar contribuição' });
  }
});

// Excluir dízimo (apenas se pendente e do próprio usuário)
router.delete('/dizimos/:id', authMiddleware, async (req, res) => {
  try {
    const dizimoId = req.params.id;
    const userId = req.user.userId || req.user.id;

    // Verificar se o dízimo existe e pertence ao usuário
    const dizimo = await pool.query(
      'SELECT * FROM dizimos WHERE id = ? AND usuario_id = ?',
      [dizimoId, userId]
    );

    if (!dizimo || dizimo.length === 0) {
      return res.status(404).json({ error: 'Dízimo não encontrado' });
    }

    // Verificar se está pendente
    if (dizimo[0].status !== 'pendente') {
      return res.status(400).json({ error: 'Apenas dízimos pendentes podem ser excluídos' });
    }

    await pool.run('DELETE FROM dizimos WHERE id = ?', [dizimoId]);

    res.json({ message: 'Dízimo excluído com sucesso' });

  } catch (error) {
    console.error('Error deleting dizimo:', error);
    res.status(500).json({ error: 'Erro ao excluir dízimo' });
  }
});

// Excluir oferta (apenas se pendente e do próprio usuário)
router.delete('/ofertas/:id', authMiddleware, async (req, res) => {
  try {
    const ofertaId = req.params.id;
    const userId = req.user.userId || req.user.id;

    // Verificar se a oferta existe e pertence ao usuário
    const oferta = await pool.query(
      'SELECT * FROM ofertas WHERE id = ? AND usuario_id = ?',
      [ofertaId, userId]
    );

    if (!oferta || oferta.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    // Verificar se está pendente
    if (oferta[0].status !== 'pendente') {
      return res.status(400).json({ error: 'Apenas ofertas pendentes podem ser excluídas' });
    }

    await pool.run('DELETE FROM ofertas WHERE id = ?', [ofertaId]);

    res.json({ message: 'Oferta excluída com sucesso' });

  } catch (error) {
    console.error('Error deleting oferta:', error);
    res.status(500).json({ error: 'Erro ao excluir oferta' });
  }
});

module.exports = router;