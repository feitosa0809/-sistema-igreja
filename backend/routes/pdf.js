const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');
const pdfGenerator = require('../utils/pdfGenerator');
const path = require('path');

// Aplicar middleware de autenticação
router.use(authMiddleware);

// POST /api/pdf/dizimos
// Gera relatório de dízimos em PDF
router.post('/dizimos', requireRole(['admin', 'tesoureiro', 'pastor']), async (req, res) => {
  try {
    const { mesAno } = req.body; // Formato: YYYY-MM

    if (!mesAno || !/^\d{4}-\d{2}$/.test(mesAno)) {
      return res.status(400).json({ error: 'Formato de mês/ano inválido. Use YYYY-MM' });
    }

    // Buscar dízimos do período
    const dizimos = await db.all(`
      SELECT 
        d.*,
        u.nome as nome_usuario
      FROM dizimos d
      LEFT JOIN usuarios u ON u.id = d.usuario_id
      WHERE strftime('%Y-%m', d.data_pagamento) = ?
      ORDER BY d.data_pagamento DESC
    `, [mesAno]);

    // Buscar configurações da igreja
    const config = await db.all('SELECT * FROM configuracoes_igreja LIMIT 1');
    const configIgreja = config[0] || {};

    // Gerar PDF
    const [ano, mes] = mesAno.split('-');
    const periodo = `${mes}/${ano}`;
    
    const resultado = await pdfGenerator.gerarRelatorioDizimos(
      { dizimos },
      periodo,
      configIgreja
    );

    res.json({
      mensagem: 'Relatório de dízimos gerado com sucesso',
      arquivo: resultado.fileName,
      downloadUrl: `/api/pdf/download/${resultado.fileName}`
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de dízimos:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar relatório de dízimos',
      detalhes: error.message 
    });
  }
});

// POST /api/pdf/ofertas
// Gera relatório de ofertas em PDF
router.post('/ofertas', requireRole(['admin', 'tesoureiro', 'pastor']), async (req, res) => {
  try {
    const { mesAno } = req.body; // Formato: YYYY-MM

    if (!mesAno || !/^\d{4}-\d{2}$/.test(mesAno)) {
      return res.status(400).json({ error: 'Formato de mês/ano inválido. Use YYYY-MM' });
    }

    // Buscar ofertas do período
    const ofertas = await db.all(`
      SELECT 
        o.*,
        u.nome as nome_usuario,
        c.nome as campanha_nome
      FROM ofertas o
      LEFT JOIN usuarios u ON u.id = o.usuario_id
      LEFT JOIN campanhas c ON c.id = o.campanha_id
      WHERE strftime('%Y-%m', o.data) = ?
      ORDER BY o.data DESC
    `, [mesAno]);

    // Buscar configurações da igreja
    const config = await db.all('SELECT * FROM configuracoes_igreja LIMIT 1');
    const configIgreja = config[0] || {};

    // Gerar PDF
    const [ano, mes] = mesAno.split('-');
    const periodo = `${mes}/${ano}`;
    
    const resultado = await pdfGenerator.gerarRelatorioOfertas(
      { ofertas },
      periodo,
      configIgreja
    );

    res.json({
      mensagem: 'Relatório de ofertas gerado com sucesso',
      arquivo: resultado.fileName,
      downloadUrl: `/api/pdf/download/${resultado.fileName}`
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de ofertas:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar relatório de ofertas',
      detalhes: error.message 
    });
  }
});

// POST /api/pdf/financeiro
// Gera relatório financeiro consolidado em PDF
router.post('/financeiro', requireRole(['admin', 'tesoureiro', 'pastor']), async (req, res) => {
  try {
    const { mesAno } = req.body; // Formato: YYYY-MM

    if (!mesAno || !/^\d{4}-\d{2}$/.test(mesAno)) {
      return res.status(400).json({ error: 'Formato de mês/ano inválido. Use YYYY-MM' });
    }

    // Buscar dízimos do período
    const dizimos = await db.all(`
      SELECT 
        d.*,
        u.nome as nome_usuario
      FROM dizimos d
      LEFT JOIN usuarios u ON u.id = d.usuario_id
      WHERE strftime('%Y-%m', d.data_pagamento) = ?
      ORDER BY d.data_pagamento DESC
    `, [mesAno]);

    // Buscar ofertas do período
    const ofertas = await db.all(`
      SELECT 
        o.*,
        u.nome as nome_usuario,
        c.nome as campanha_nome
      FROM ofertas o
      LEFT JOIN usuarios u ON u.id = o.usuario_id
      LEFT JOIN campanhas c ON c.id = o.campanha_id
      WHERE strftime('%Y-%m', o.data) = ?
      ORDER BY o.data DESC
    `, [mesAno]);

    // Buscar configurações da igreja
    const config = await db.all('SELECT * FROM configuracoes_igreja LIMIT 1');
    const configIgreja = config[0] || {};

    // Gerar PDF
    const [ano, mes] = mesAno.split('-');
    const periodo = `${mes}/${ano}`;
    
    const resultado = await pdfGenerator.gerarRelatorioFinanceiro(
      { dizimos, ofertas },
      periodo,
      configIgreja
    );

    res.json({
      mensagem: 'Relatório financeiro gerado com sucesso',
      arquivo: resultado.fileName,
      downloadUrl: `/api/pdf/download/${resultado.fileName}`
    });

  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar relatório financeiro',
      detalhes: error.message 
    });
  }
});

// GET /api/pdf/download/:filename
// Download de relatório PDF
router.get('/download/:filename', requireRole(['admin', 'tesoureiro', 'pastor']), (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validar nome do arquivo (evitar path traversal)
    if (!/^[a-zA-Z0-9\-_]+\.pdf$/.test(filename)) {
      return res.status(400).json({ error: 'Nome de arquivo inválido' });
    }

    const filePath = path.join(pdfGenerator.reportsDir, filename);

    // Verificar se arquivo existe
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Enviar arquivo
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Erro ao fazer download:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Erro ao fazer download do arquivo' });
        }
      }
    });

  } catch (error) {
    console.error('Erro no download:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer download',
      detalhes: error.message 
    });
  }
});

// GET /api/pdf/listar
// Lista relatórios PDF gerados
router.get('/listar', requireRole(['admin', 'tesoureiro', 'pastor']), (req, res) => {
  try {
    const fs = require('fs');
    const files = fs.readdirSync(pdfGenerator.reportsDir);
    
    const relatorios = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const stats = fs.statSync(path.join(pdfGenerator.reportsDir, file));
        return {
          nome: file,
          tamanho: stats.size,
          data: stats.mtime,
          downloadUrl: `/api/pdf/download/${file}`
        };
      })
      .sort((a, b) => b.data - a.data); // Mais recentes primeiro

    res.json(relatorios);

  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    res.status(500).json({ 
      error: 'Erro ao listar relatórios',
      detalhes: error.message 
    });
  }
});

// DELETE /api/pdf/:filename
// Deletar relatório PDF
router.delete('/:filename', requireRole(['admin']), (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validar nome do arquivo
    if (!/^[a-zA-Z0-9\-_]+\.pdf$/.test(filename)) {
      return res.status(400).json({ error: 'Nome de arquivo inválido' });
    }

    const filePath = path.join(pdfGenerator.reportsDir, filename);

    // Verificar se arquivo existe
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Deletar arquivo
    fs.unlinkSync(filePath);

    res.json({ mensagem: 'Relatório deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar relatório:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar relatório',
      detalhes: error.message 
    });
  }
});

module.exports = router;
