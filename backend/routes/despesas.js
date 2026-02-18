const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para upload de comprovantes de despesas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/despesas';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'despesa-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Erro: Apenas imagens e PDFs são permitidos!');
    }
  }
});

// Listar todas as despesas (com filtros)
router.get('/', auth, async (req, res) => {
  try {
    const { categoria, mes, ano, status, fornecedor } = req.query;
    
    let sql = `
      SELECT d.*, u.nome as registrado_por, f.nome as fornecedor_nome
      FROM despesas d
      LEFT JOIN usuarios u ON d.usuario_id = u.id
      LEFT JOIN fornecedores f ON d.fornecedor_id = f.id
      WHERE 1=1
    `;
    const params = [];

    if (categoria) {
      sql += ' AND d.categoria = ?';
      params.push(categoria);
    }

    if (mes) {
      sql += ' AND strftime("%m", d.data_despesa) = ?';
      params.push(mes.toString().padStart(2, '0'));
    }

    if (ano) {
      sql += ' AND strftime("%Y", d.data_despesa) = ?';
      params.push(ano.toString());
    }

    if (status) {
      sql += ' AND d.status = ?';
      params.push(status);
    }

    if (fornecedor) {
      sql += ' AND d.fornecedor_id = ?';
      params.push(fornecedor);
    }

    sql += ' ORDER BY d.data_despesa DESC, d.created_at DESC';

    db.all(sql, params, (err, despesas) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ despesas });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar despesa por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = `
    SELECT d.*, u.nome as registrado_por, f.nome as fornecedor_nome
    FROM despesas d
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    LEFT JOIN fornecedores f ON d.fornecedor_id = f.id
    WHERE d.id = ?
  `;

  db.get(sql, [id], (err, despesa) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    res.json(despesa);
  });
});

// Criar nova despesa
router.post('/', auth, upload.single('comprovante'), async (req, res) => {
  try {
    const {
      descricao,
      categoria,
      valor,
      data_despesa,
      data_vencimento,
      forma_pagamento,
      fornecedor_id,
      observacoes,
      recorrente,
      numero_parcelas,
      parcela_atual
    } = req.body;

    // Validações
    if (!descricao || !categoria || !valor || !data_despesa) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: descrição, categoria, valor e data_despesa' 
      });
    }

    const comprovante = req.file ? `/uploads/despesas/${req.file.filename}` : null;

    const sql = `
      INSERT INTO despesas (
        descricao, categoria, valor, data_despesa, data_vencimento,
        forma_pagamento, fornecedor_id, comprovante, observacoes,
        status, usuario_id, recorrente, numero_parcelas, parcela_atual
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      descricao,
      categoria,
      parseFloat(valor),
      data_despesa,
      data_vencimento || null,
      forma_pagamento || 'dinheiro',
      fornecedor_id || null,
      comprovante,
      observacoes || null,
      'pendente',
      req.usuario.id,
      recorrente === 'true' || recorrente === true ? 1 : 0,
      numero_parcelas || null,
      parcela_atual || null
    ];

    db.run(sql, params, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Registrar log de auditoria
      const logSql = `
        INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(logSql, [
        req.usuario.id,
        'CREATE',
        'despesas',
        this.lastID,
        JSON.stringify({ descricao, valor, categoria })
      ]);

      res.status(201).json({
        message: 'Despesa registrada com sucesso',
        id: this.lastID
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar despesa
router.put('/:id', auth, upload.single('comprovante'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      descricao,
      categoria,
      valor,
      data_despesa,
      data_vencimento,
      forma_pagamento,
      fornecedor_id,
      observacoes,
      status
    } = req.body;

    // Buscar despesa atual para log
    db.get('SELECT * FROM despesas WHERE id = ?', [id], (err, despesaAntiga) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!despesaAntiga) {
        return res.status(404).json({ error: 'Despesa não encontrada' });
      }

      const comprovante = req.file 
        ? `/uploads/despesas/${req.file.filename}` 
        : despesaAntiga.comprovante;

      const sql = `
        UPDATE despesas SET
          descricao = ?,
          categoria = ?,
          valor = ?,
          data_despesa = ?,
          data_vencimento = ?,
          forma_pagamento = ?,
          fornecedor_id = ?,
          comprovante = ?,
          observacoes = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
        descricao,
        categoria,
        parseFloat(valor),
        data_despesa,
        data_vencimento || null,
        forma_pagamento,
        fornecedor_id || null,
        comprovante,
        observacoes || null,
        status || despesaAntiga.status,
        id
      ];

      db.run(sql, params, function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Registrar log de auditoria
        const logSql = `
          INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.run(logSql, [
          req.usuario.id,
          'UPDATE',
          'despesas',
          id,
          JSON.stringify({ antes: despesaAntiga, depois: { descricao, valor, categoria, status } })
        ]);

        res.json({ message: 'Despesa atualizada com sucesso' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar despesa
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  // Verificar permissão (apenas admin e tesoureiro)
  if (!['admin', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão para deletar despesas' });
  }

  // Buscar despesa para log
  db.get('SELECT * FROM despesas WHERE id = ?', [id], (err, despesa) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    db.run('DELETE FROM despesas WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Registrar log de auditoria
      const logSql = `
        INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(logSql, [
        req.usuario.id,
        'DELETE',
        'despesas',
        id,
        JSON.stringify(despesa)
      ]);

      res.json({ message: 'Despesa deletada com sucesso' });
    });
  });
});

// Aprovar/Pagar despesa
router.post('/:id/pagar', auth, (req, res) => {
  const { id } = req.params;
  const { data_pagamento, valor_pago, observacoes_pagamento } = req.body;

  // Verificar permissão
  if (!['admin', 'tesoureiro'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão para aprovar pagamentos' });
  }

  const sql = `
    UPDATE despesas SET
      status = 'pago',
      data_pagamento = ?,
      valor_pago = ?,
      observacoes_pagamento = ?,
      aprovado_por = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [
    data_pagamento || new Date().toISOString().split('T')[0],
    valor_pago,
    observacoes_pagamento || null,
    req.usuario.id,
    id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Registrar log
    const logSql = `
      INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(logSql, [
      req.usuario.id,
      'PAYMENT',
      'despesas',
      id,
      JSON.stringify({ valor_pago, data_pagamento })
    ]);

    res.json({ message: 'Despesa marcada como paga' });
  });
});

// Estatísticas de despesas
router.get('/stats/resumo', auth, (req, res) => {
  const { mes, ano } = req.query;
  
  let whereClause = '1=1';
  const params = [];

  if (mes) {
    whereClause += ' AND strftime("%m", data_despesa) = ?';
    params.push(mes.toString().padStart(2, '0'));
  }

  if (ano) {
    whereClause += ' AND strftime("%Y", data_despesa) = ?';
    params.push(ano.toString());
  }

  const sql = `
    SELECT 
      COUNT(*) as total_despesas,
      SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as total_pago,
      SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente,
      SUM(CASE WHEN status = 'vencido' THEN valor ELSE 0 END) as total_vencido,
      SUM(valor) as total_geral,
      categoria,
      COUNT(*) as quantidade
    FROM despesas
    WHERE ${whereClause}
    GROUP BY categoria
  `;

  db.all(sql, params, (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Estatísticas gerais
    const sqlGeral = `
      SELECT 
        COUNT(*) as total_despesas,
        SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as total_pago,
        SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente,
        SUM(CASE WHEN status = 'vencido' THEN valor ELSE 0 END) as total_vencido,
        SUM(valor) as total_geral
      FROM despesas
      WHERE ${whereClause}
    `;

    db.get(sqlGeral, params, (err, geral) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        geral,
        por_categoria: stats
      });
    });
  });
});

module.exports = router;
