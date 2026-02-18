const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware } = require('../middleware/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// GET /api/dashboard/resumo-financeiro
// Retorna resumo financeiro unificado focado em dízimos e ofertas
router.get('/resumo-financeiro', async (req, res) => {
  try {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const mesAnoAtual = `${ano}-${mes}`;

    // Total de dízimos e ofertas do mês
    const totalArrecadado = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          SUM(CASE WHEN tipo = 'dizimo' THEN valor ELSE 0 END) as total_dizimos,
          SUM(CASE WHEN tipo = 'oferta' THEN valor ELSE 0 END) as total_ofertas,
          COUNT(CASE WHEN tipo = 'dizimo' THEN 1 END) as qtd_dizimos,
          COUNT(CASE WHEN tipo = 'oferta' THEN 1 END) as qtd_ofertas
        FROM donations
        WHERE strftime('%Y-%m', data_pagamento) = ?
      `, [mesAnoAtual], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Destinação dos dízimos (onde o dinheiro foi usado)
    const destinacao = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          COUNT(*) as total_registros,
          SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as total_pago,
          SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente
        FROM despesas
        WHERE strftime('%Y-%m', data_despesa) = ?
      `, [mesAnoAtual], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Campanhas ativas
    const campanhas = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          COUNT(*) as total_ativas,
          SUM(valor_meta) as total_meta,
          SUM(valor_atual) as total_arrecadado
        FROM metas
        WHERE status = 'ativa'
        AND date(data_fim) >= date('now')
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0] || {});
      });
    });

    // Metas de arrecadação do ano
    const metasAno = await new Promise((resolve, reject) => {
      db.get(`
        SELECT 
          SUM(total_receita) as meta_anual,
          SUM(total_despesa) as despesa_prevista
        FROM orcamentos
        WHERE ano = ? AND status = 'ativo'
      `, [ano], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Membros dizimistas ativos (contribuíram nos últimos 3 meses)
    const membrosAtivos = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(DISTINCT membro_id) as total
        FROM donations
        WHERE tipo = 'dizimo'
        AND data_pagamento >= date('now', '-3 months')
      `, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const totalDizimos = parseFloat(totalArrecadado?.total_dizimos || 0);
    const totalOfertas = parseFloat(totalArrecadado?.total_ofertas || 0);
    const totalMes = totalDizimos + totalOfertas;

    res.json({
      periodo: {
        mes: mesAnoAtual,
        ano: ano
      },
      arrecadacao: {
        dizimos: {
          total: totalDizimos.toFixed(2),
          quantidade: totalArrecadado?.qtd_dizimos || 0
        },
        ofertas: {
          total: totalOfertas.toFixed(2),
          quantidade: totalArrecadado?.qtd_ofertas || 0
        },
        total_mes: totalMes.toFixed(2)
      },
      destinacao: {
        total_pago: parseFloat(destinacao?.total_pago || 0).toFixed(2),
        total_pendente: parseFloat(destinacao?.total_pendente || 0).toFixed(2),
        registros: destinacao?.total_registros || 0
      },
      campanhas: {
        ativas: campanhas?.total_ativas || 0,
        meta_total: parseFloat(campanhas?.total_meta || 0).toFixed(2),
        arrecadado: parseFloat(campanhas?.total_arrecadado || 0).toFixed(2),
        percentual: campanhas?.total_meta > 0 
          ? ((campanhas.total_arrecadado / campanhas.total_meta) * 100).toFixed(1)
          : 0
      },
      metas_anuais: {
        meta_receita: parseFloat(metasAno?.meta_anual || 0).toFixed(2),
        despesa_prevista: parseFloat(metasAno?.despesa_prevista || 0).toFixed(2)
      },
      membros_dizimistas: membrosAtivos?.total || 0,
      transparencia: {
        saldo_mes: (totalMes - parseFloat(destinacao?.total_pago || 0)).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar resumo financeiro',
      detalhes: error.message 
    });
  }
});

// GET /api/dashboard/evolucao-mensal
// Retorna evolução financeira dos últimos 6 meses
router.get('/evolucao-mensal', async (req, res) => {
  try {
    const meses = [];
    
    // Gerar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      meses.push(`${ano}-${mes}`);
    }

    const evolucao = [];

    for (const mesAno of meses) {
      // Dízimos do mês
      const dizimos = await db.all(`
        SELECT SUM(valor) as total
        FROM dizimos 
        WHERE strftime('%Y-%m', data_pagamento) = ?
        AND status = 'confirmado'
      `, [mesAno]);

      // Ofertas do mês
      const ofertas = await db.all(`
        SELECT SUM(valor) as total
        FROM ofertas 
        WHERE strftime('%Y-%m', data) = ?
      `, [mesAno]);

      const totalDizimos = parseFloat(dizimos[0]?.total || 0);
      const totalOfertas = parseFloat(ofertas[0]?.total || 0);

      evolucao.push({
        mes: mesAno,
        dizimos: totalDizimos.toFixed(2),
        ofertas: totalOfertas.toFixed(2),
        total: (totalDizimos + totalOfertas).toFixed(2)
      });
    }

    res.json(evolucao);

  } catch (error) {
    console.error('Erro ao buscar evolução mensal:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar evolução mensal',
      detalhes: error.message 
    });
  }
});

// GET /api/dashboard/campanhas-progresso
// Retorna progresso das campanhas ativas
router.get('/campanhas-progresso', async (req, res) => {
  try {
    const db = require('../config/database-sqlite');

    const campanhas = await db.all(`
      SELECT 
        c.id,
        c.nome,
        c.descricao,
        c.meta,
        c.data_inicio,
        c.data_fim,
        COALESCE(SUM(o.valor), 0) as arrecadado
      FROM campanhas c
      LEFT JOIN ofertas o ON o.campanha_id = c.id
      WHERE c.status = 'ativa'
      AND c.data_fim >= date('now')
      GROUP BY c.id
      ORDER BY c.data_fim ASC
      LIMIT 5
    `);

    const resultado = campanhas.map(campanha => {
      const meta = parseFloat(campanha.meta || 0);
      const arrecadado = parseFloat(campanha.arrecadado || 0);
      const percentual = meta > 0 ? (arrecadado / meta * 100).toFixed(1) : 0;

      return {
        id: campanha.id,
        nome: campanha.nome,
        descricao: campanha.descricao,
        meta: meta.toFixed(2),
        arrecadado: arrecadado.toFixed(2),
        percentual: parseFloat(percentual),
        dataInicio: campanha.data_inicio,
        dataFim: campanha.data_fim
      };
    });

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao buscar progresso de campanhas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar progresso de campanhas',
      detalhes: error.message 
    });
  }
});

// GET /api/dashboard/top-dizimistas
// Retorna os 10 maiores dizimistas do ano
router.get('/top-dizimistas', async (req, res) => {
  try {
    const db = require('../config/database-sqlite');
    const anoAtual = new Date().getFullYear();

    const dizimistas = await db.all(`
      SELECT 
        u.id,
        u.nome,
        u.foto_perfil,
        COUNT(d.id) as quantidade,
        SUM(d.valor) as total
      FROM usuarios u
      INNER JOIN dizimos d ON d.usuario_id = u.id
      WHERE strftime('%Y', d.data_pagamento) = ?
      AND d.status = 'confirmado'
      GROUP BY u.id
      ORDER BY total DESC
      LIMIT 10
    `, [String(anoAtual)]);

    const resultado = dizimistas.map(diz => ({
      id: diz.id,
      nome: diz.nome,
      fotoPerfil: diz.foto_perfil,
      quantidade: diz.quantidade,
      total: parseFloat(diz.total || 0).toFixed(2)
    }));

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao buscar top dizimistas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar top dizimistas',
      detalhes: error.message 
    });
  }
});

// GET /api/dashboard/distribuicao-tipos
// Retorna distribuição de receitas por tipo
router.get('/distribuicao-tipos', async (req, res) => {
  try {
    const db = require('../config/database-sqlite');
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const mesAnoAtual = `${ano}-${mes}`;

    // Total de dízimos
    const dizimos = await db.all(`
      SELECT SUM(valor) as total
      FROM dizimos 
      WHERE strftime('%Y-%m', data_pagamento) = ?
      AND status = 'confirmado'
    `, [mesAnoAtual]);

    // Ofertas por tipo
    const ofertas = await db.all(`
      SELECT 
        tipo,
        SUM(valor) as total
      FROM ofertas 
      WHERE strftime('%Y-%m', data) = ?
      GROUP BY tipo
    `, [mesAnoAtual]);

    const totalDizimos = parseFloat(dizimos[0]?.total || 0);
    
    const distribuicao = [
      {
        tipo: 'Dízimos',
        total: totalDizimos.toFixed(2),
        cor: '#667eea'
      }
    ];

    // Adicionar ofertas por tipo
    ofertas.forEach(oferta => {
      const cores = {
        'oferta': '#764ba2',
        'campanha': '#f093fb',
        'missoes': '#4facfe',
        'construcao': '#43e97b',
        'outros': '#fa709a'
      };

      distribuicao.push({
        tipo: oferta.tipo.charAt(0).toUpperCase() + oferta.tipo.slice(1),
        total: parseFloat(oferta.total || 0).toFixed(2),
        cor: cores[oferta.tipo] || '#95a5a6'
      });
    });

    res.json(distribuicao);

  } catch (error) {
    console.error('Erro ao buscar distribuição por tipos:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar distribuição por tipos',
      detalhes: error.message 
    });
  }
});

// GET /api/dashboard/aniversariantes-mes
// Retorna aniversariantes do mês atual
router.get('/aniversariantes-mes', async (req, res) => {
  try {
    const db = require('../config/database-sqlite');
    const mesAtual = String(new Date().getMonth() + 1).padStart(2, '0');

    const aniversariantes = await db.all(`
      SELECT 
        id,
        nome,
        foto_perfil,
        data_nascimento
      FROM usuarios
      WHERE strftime('%m', data_nascimento) = ?
      AND status = 'ativo'
      ORDER BY strftime('%d', data_nascimento) ASC
      LIMIT 10
    `, [mesAtual]);

    const resultado = aniversariantes.map(pessoa => ({
      id: pessoa.id,
      nome: pessoa.nome,
      fotoPerfil: pessoa.foto_perfil,
      dataNascimento: pessoa.data_nascimento
    }));

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao buscar aniversariantes do mês:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar aniversariantes do mês',
      detalhes: error.message 
    });
  }
});

module.exports = router;
