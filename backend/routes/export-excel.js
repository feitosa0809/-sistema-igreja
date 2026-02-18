const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');
const ExcelJS = require('exceljs');

// Exportar dízimos/ofertas para Excel
router.get('/donations', auth, async (req, res) => {
  try {
    const { data_inicio, data_fim, tipo } = req.query;
    
    let sql = 'SELECT * FROM donations WHERE 1=1';
    const params = [];

    if (data_inicio) {
      sql += ' AND DATE(data_pagamento) >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      sql += ' AND DATE(data_pagamento) <= ?';
      params.push(data_fim);
    }

    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    sql += ' ORDER BY data_pagamento DESC';

    db.all(sql, params, async (err, donations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Criar workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Dízimos e Ofertas');

      // Definir colunas
      worksheet.columns = [
        { header: 'Data', key: 'data_pagamento', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Valor', key: 'valor', width: 15 },
        { header: 'Forma Pagamento', key: 'forma_pagamento', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Observações', key: 'observacoes', width: 30 }
      ];

      // Adicionar dados
      donations.forEach(d => {
        worksheet.addRow({
          data_pagamento: d.data_pagamento,
          tipo: d.tipo,
          valor: parseFloat(d.valor),
          forma_pagamento: d.forma_pagamento,
          status: d.status,
          observacoes: d.observacoes || ''
        });
      });

      // Formatar cabeçalho
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' }
      };

      // Formatar valores
      worksheet.getColumn('valor').numFmt = 'R$ #,##0.00';

      // Total
      const totalRow = worksheet.addRow({
        data_pagamento: '',
        tipo: 'TOTAL:',
        valor: { formula: `SUM(C2:C${donations.length + 1})` },
        forma_pagamento: '',
        status: '',
        observacoes: ''
      });
      totalRow.font = { bold: true };

      // Enviar arquivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=dizimos_ofertas_${Date.now()}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportar despesas para Excel
router.get('/despesas', auth, async (req, res) => {
  try {
    const { mes, ano, categoria } = req.query;
    
    let sql = 'SELECT * FROM despesas WHERE 1=1';
    const params = [];

    if (mes) {
      sql += ' AND strftime("%m", data_despesa) = ?';
      params.push(mes.toString().padStart(2, '0'));
    }

    if (ano) {
      sql += ' AND strftime("%Y", data_despesa) = ?';
      params.push(ano.toString());
    }

    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    sql += ' ORDER BY data_despesa DESC';

    db.all(sql, params, async (err, despesas) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Despesas');

      worksheet.columns = [
        { header: 'Data', key: 'data_despesa', width: 15 },
        { header: 'Descrição', key: 'descricao', width: 30 },
        { header: 'Categoria', key: 'categoria', width: 20 },
        { header: 'Valor', key: 'valor', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Vencimento', key: 'data_vencimento', width: 15 },
        { header: 'Observações', key: 'observacoes', width: 30 }
      ];

      despesas.forEach(d => {
        worksheet.addRow({
          data_despesa: d.data_despesa,
          descricao: d.descricao,
          categoria: d.categoria,
          valor: parseFloat(d.valor),
          status: d.status,
          data_vencimento: d.data_vencimento || '',
          observacoes: d.observacoes || ''
        });
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF5722' }
      };

      worksheet.getColumn('valor').numFmt = 'R$ #,##0.00';

      const totalRow = worksheet.addRow({
        data_despesa: '',
        descricao: '',
        categoria: 'TOTAL:',
        valor: { formula: `SUM(D2:D${despesas.length + 1})` },
        status: '',
        data_vencimento: '',
        observacoes: ''
      });
      totalRow.font = { bold: true };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=despesas_${Date.now()}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportar membros para Excel
router.get('/membros', auth, async (req, res) => {
  try {
    db.all('SELECT * FROM membros WHERE ativo = 1 ORDER BY nome_completo', [], async (err, membros) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Membros');

      worksheet.columns = [
        { header: 'Nome', key: 'nome_completo', width: 30 },
        { header: 'CPF', key: 'cpf', width: 15 },
        { header: 'Data Nascimento', key: 'data_nascimento', width: 15 },
        { header: 'Telefone', key: 'telefone', width: 15 },
        { header: 'Celular', key: 'celular', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Cargo', key: 'cargo', width: 20 },
        { header: 'Departamento', key: 'departamento', width: 20 },
        { header: 'Data Batismo', key: 'data_batismo', width: 15 },
        { header: 'Data Membro', key: 'data_membro', width: 15 }
      ];

      membros.forEach(m => {
        worksheet.addRow(m);
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2196F3' }
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=membros_${Date.now()}.xlsx`);
      
      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportar relatório completo
router.get('/relatorio-completo', auth, async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const workbook = new ExcelJS.Workbook();

    // Aba de Receitas
    const receitasSheet = workbook.addWorksheet('Receitas');
    const despesasSheet = workbook.addWorksheet('Despesas');
    const resumoSheet = workbook.addWorksheet('Resumo');

    // Buscar dados
    let whereClause = '1=1';
    const params = [];
    
    if (mes) {
      whereClause += ' AND strftime("%m", data_pagamento) = ?';
      params.push(mes.toString().padStart(2, '0'));
    }
    
    if (ano) {
      whereClause += ' AND strftime("%Y", data_pagamento) = ?';
      params.push(ano.toString());
    }

    db.all(`SELECT * FROM donations WHERE ${whereClause}`, params, (err, receitas) => {
      if (err) throw err;

      receitasSheet.columns = [
        { header: 'Data', key: 'data_pagamento', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Valor', key: 'valor', width: 15 }
      ];

      receitas.forEach(r => receitasSheet.addRow(r));
      receitasSheet.getRow(1).font = { bold: true };
      receitasSheet.getColumn('valor').numFmt = 'R$ #,##0.00';

      // Despesas
      const despesasParams = [];
      let despesasWhere = '1=1';
      
      if (mes) {
        despesasWhere += ' AND strftime("%m", data_despesa) = ?';
        despesasParams.push(mes.toString().padStart(2, '0'));
      }
      
      if (ano) {
        despesasWhere += ' AND strftime("%Y", data_despesa) = ?';
        despesasParams.push(ano.toString());
      }

      db.all(`SELECT * FROM despesas WHERE ${despesasWhere}`, despesasParams, async (err, despesas) => {
        if (err) throw err;

        despesasSheet.columns = [
          { header: 'Data', key: 'data_despesa', width: 15 },
          { header: 'Descrição', key: 'descricao', width: 30 },
          { header: 'Categoria', key: 'categoria', width: 20 },
          { header: 'Valor', key: 'valor', width: 15 }
        ];

        despesas.forEach(d => despesasSheet.addRow(d));
        despesasSheet.getRow(1).font = { bold: true };
        despesasSheet.getColumn('valor').numFmt = 'R$ #,##0.00';

        // Resumo
        const totalReceitas = receitas.reduce((sum, r) => sum + parseFloat(r.valor), 0);
        const totalDespesas = despesas.reduce((sum, d) => sum + parseFloat(d.valor), 0);

        resumoSheet.columns = [
          { header: 'Descrição', key: 'descricao', width: 30 },
          { header: 'Valor', key: 'valor', width: 20 }
        ];

        resumoSheet.addRow({ descricao: 'Total Receitas', valor: totalReceitas });
        resumoSheet.addRow({ descricao: 'Total Despesas', valor: totalDespesas });
        resumoSheet.addRow({ descricao: 'Saldo', valor: totalReceitas - totalDespesas });

        resumoSheet.getRow(1).font = { bold: true };
        resumoSheet.getColumn('valor').numFmt = 'R$ #,##0.00';

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=relatorio_completo_${Date.now()}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
