const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/membros';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'membro-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Erro: Apenas imagens são permitidas!');
    }
  }
});

// Listar todos os membros
router.get('/', auth, (req, res) => {
  const { ativo, cargo, departamento } = req.query;
  
  let sql = 'SELECT * FROM membros WHERE 1=1';
  const params = [];

  if (ativo !== undefined) {
    sql += ' AND ativo = ?';
    params.push(ativo === 'true' ? 1 : 0);
  }

  if (cargo) {
    sql += ' AND cargo = ?';
    params.push(cargo);
  }

  if (departamento) {
    sql += ' AND departamento = ?';
    params.push(departamento);
  }

  sql += ' ORDER BY nome_completo';

  db.all(sql, params, (err, membros) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ membros });
  });
});

// Buscar membro por ID
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  const sql = 'SELECT * FROM membros WHERE id = ?';

  db.get(sql, [id], (err, membro) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }
    res.json(membro);
  });
});

// Criar novo membro
router.post('/', auth, upload.single('foto'), (req, res) => {
  const {
    nome_completo, cpf, rg, data_nascimento, telefone, celular, email,
    endereco, numero, complemento, bairro, cidade, estado, cep,
    estado_civil, profissao, data_batismo, data_membro, cargo, departamento,
    observacoes, usuario_id
  } = req.body;

  if (!nome_completo) {
    return res.status(400).json({ error: 'Nome completo é obrigatório' });
  }

  const foto = req.file ? `/uploads/membros/${req.file.filename}` : null;

  const sql = `
    INSERT INTO membros (
      nome_completo, cpf, rg, data_nascimento, telefone, celular, email,
      endereco, numero, complemento, bairro, cidade, estado, cep,
      estado_civil, profissao, data_batismo, data_membro, cargo, departamento,
      foto, observacoes, usuario_id, ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.run(sql, [
    nome_completo, cpf || null, rg || null, data_nascimento || null,
    telefone || null, celular || null, email || null,
    endereco || null, numero || null, complemento || null,
    bairro || null, cidade || null, estado || null, cep || null,
    estado_civil || null, profissao || null,
    data_batismo || null, data_membro || null,
    cargo || null, departamento || null, foto, observacoes || null,
    usuario_id || null
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
      'membros',
      this.lastID,
      JSON.stringify({ nome_completo, cargo, departamento })
    ]);

    res.status(201).json({
      message: 'Membro cadastrado com sucesso',
      id: this.lastID
    });
  });
});

// Atualizar membro
router.put('/:id', auth, upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const {
    nome_completo, cpf, rg, data_nascimento, telefone, celular, email,
    endereco, numero, complemento, bairro, cidade, estado, cep,
    estado_civil, profissao, data_batismo, data_membro, cargo, departamento,
    observacoes
  } = req.body;

  // Buscar membro atual
  db.get('SELECT foto FROM membros WHERE id = ?', [id], (err, membro) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!membro) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    const foto = req.file ? `/uploads/membros/${req.file.filename}` : membro.foto;

    const sql = `
      UPDATE membros SET
        nome_completo = ?, cpf = ?, rg = ?, data_nascimento = ?,
        telefone = ?, celular = ?, email = ?,
        endereco = ?, numero = ?, complemento = ?,
        bairro = ?, cidade = ?, estado = ?, cep = ?,
        estado_civil = ?, profissao = ?,
        data_batismo = ?, data_membro = ?,
        cargo = ?, departamento = ?, foto = ?, observacoes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [
      nome_completo, cpf || null, rg || null, data_nascimento || null,
      telefone || null, celular || null, email || null,
      endereco || null, numero || null, complemento || null,
      bairro || null, cidade || null, estado || null, cep || null,
      estado_civil || null, profissao || null,
      data_batismo || null, data_membro || null,
      cargo || null, departamento || null, foto, observacoes || null,
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
        'membros',
        id,
        JSON.stringify({ nome_completo, cargo, departamento })
      ]);

      res.json({ message: 'Membro atualizado com sucesso' });
    });
  });
});

// Desativar membro
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;

  if (!['admin', 'pastor'].includes(req.usuario.tipo)) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  const sql = 'UPDATE membros SET ativo = 0 WHERE id = ?';

  db.run(sql, [id], function(err) {
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
      'membros',
      id,
      JSON.stringify({ acao: 'desativado' })
    ]);

    res.json({ message: 'Membro desativado com sucesso' });
  });
});

// Estatísticas de membros
router.get('/stats/geral', auth, (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_membros,
      SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as ativos,
      SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as inativos,
      COUNT(DISTINCT cargo) as total_cargos,
      COUNT(DISTINCT departamento) as total_departamentos
    FROM membros
  `;

  db.get(sql, [], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Por cargo
    const sqlCargos = `
      SELECT cargo, COUNT(*) as quantidade
      FROM membros
      WHERE ativo = 1 AND cargo IS NOT NULL
      GROUP BY cargo
      ORDER BY quantidade DESC
    `;

    db.all(sqlCargos, [], (err, cargos) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        geral: stats,
        por_cargo: cargos
      });
    });
  });
});

// Aniversariantes do mês
router.get('/aniversariantes/mes', auth, (req, res) => {
  const { mes } = req.query;
  const mesAtual = mes || (new Date().getMonth() + 1).toString().padStart(2, '0');

  const sql = `
    SELECT *
    FROM membros
    WHERE ativo = 1 
    AND strftime('%m', data_nascimento) = ?
    ORDER BY strftime('%d', data_nascimento)
  `;

  db.all(sql, [mesAtual], (err, membros) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ aniversariantes: membros });
  });
});

module.exports = router;
