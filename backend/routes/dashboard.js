const express = require('express');
const router = express.Router();
const pool = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');

function obterPeriodo(req) {
  const periodo = String(req.query.periodo || '').trim();
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(periodo)) {
    return periodo;
  }

  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}`;
}

function obterAno(req) {
  const ano = String(req.query.ano || '').trim();
  if (/^\d{4}$/.test(ano)) {
    return ano;
  }
  return String(new Date().getFullYear());
}

router.use(authMiddleware);
router.use(requireRole(['admin', 'tesoureiro', 'pastor']));

router.get('/resumo-financeiro', async (req, res) => {
  try {
    const periodo = obterPeriodo(req);

    const [dizimosRows] = await pool.execute(`
      SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade,
        SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) AS pendentes
      FROM dizimos
      WHERE strftime('%Y-%m', data_pagamento) = ?
    `, [periodo]);

    const [ofertasRows] = await pool.execute(`
      SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
      FROM ofertas
      WHERE strftime('%Y-%m', data_oferta) = ?
    `, [periodo]);

    const [membrosRows] = await pool.execute(`
      SELECT COUNT(*) AS total
      FROM usuarios
      WHERE status = 'ativo'
    `);

    const [campanhasRows] = await pool.execute(`
      SELECT COUNT(*) AS total
      FROM metas
      WHERE status = 'ativa'
        AND date(data_fim) >= date('now')
    `);

    const dizimos = parseFloat(dizimosRows[0]?.total || 0);
    const ofertas = parseFloat(ofertasRows[0]?.total || 0);

    res.json({
      dizimos: {
        total: dizimos,
        quantidade: Number(dizimosRows[0]?.quantidade || 0)
      },
      ofertas: {
        total: ofertas,
        quantidade: Number(ofertasRows[0]?.quantidade || 0)
      },
      totalMes: dizimos + ofertas,
      pendentes: {
        quantidade: Number(dizimosRows[0]?.pendentes || 0)
      },
      membros: Number(membrosRows[0]?.total || 0),
      campanhas: Number(campanhasRows[0]?.total || 0),
      periodo
    });
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    res.status(500).json({
      error: 'Erro ao buscar resumo financeiro',
      detalhes: error.message
    });
  }
});

router.get('/evolucao-mensal', async (req, res) => {
  try {
    const periodo = obterPeriodo(req);

    const [rows] = await pool.execute(`
      WITH RECURSIVE ultimos_meses(offset) AS (
        SELECT 5
        UNION ALL
        SELECT offset - 1 FROM ultimos_meses WHERE offset > 0
      ),
      meses AS (
        SELECT strftime('%Y-%m', date(? || '-01', '-' || offset || ' months')) AS mes
        FROM ultimos_meses
      ),
      dizimos AS (
        SELECT strftime('%Y-%m', data_pagamento) AS mes, COALESCE(SUM(valor), 0) AS total
        FROM dizimos
        WHERE strftime('%Y-%m', data_pagamento) IN (SELECT mes FROM meses)
        GROUP BY strftime('%Y-%m', data_pagamento)
      ),
      ofertas AS (
        SELECT strftime('%Y-%m', data_oferta) AS mes, COALESCE(SUM(valor), 0) AS total
        FROM ofertas
        WHERE strftime('%Y-%m', data_oferta) IN (SELECT mes FROM meses)
        GROUP BY strftime('%Y-%m', data_oferta)
      )
      SELECT
        m.mes,
        COALESCE(d.total, 0) AS dizimos,
        COALESCE(o.total, 0) AS ofertas,
        COALESCE(d.total, 0) + COALESCE(o.total, 0) AS total
      FROM meses m
      LEFT JOIN dizimos d ON d.mes = m.mes
      LEFT JOIN ofertas o ON o.mes = m.mes
      ORDER BY m.mes ASC
    `, [periodo]);

    res.json(rows.map((item) => ({
      mes: item.mes,
      dizimos: Number(item.dizimos || 0),
      ofertas: Number(item.ofertas || 0),
      total: Number(item.total || 0)
    })));
  } catch (error) {
    console.error('Erro ao buscar evolução mensal:', error);
    res.status(500).json({
      error: 'Erro ao buscar evolução mensal',
      detalhes: error.message
    });
  }
});

router.get('/campanhas-progresso', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        titulo,
        descricao,
        valor_meta,
        valor_atual,
        data_inicio,
        data_fim,
        status
      FROM metas
      WHERE status = 'ativa'
        AND date(data_fim) >= date('now')
      ORDER BY date(data_fim) ASC
      LIMIT 5
    `);

    const resultado = rows.map((campanha) => {
      const meta = parseFloat(campanha.valor_meta || 0);
      const arrecadado = parseFloat(campanha.valor_atual || 0);
      const percentual = meta > 0 ? (arrecadado / meta) * 100 : 0;

      return {
        id: campanha.id,
        nome: campanha.titulo,
        descricao: campanha.descricao,
        meta,
        arrecadado,
        percentual: Number(percentual.toFixed(1)),
        dataInicio: campanha.data_inicio,
        dataFim: campanha.data_fim,
        status: campanha.status
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

router.get('/top-dizimistas', async (req, res) => {
  try {
    const ano = obterAno(req);

    const [rows] = await pool.execute(`
      SELECT
        u.id,
        u.nome,
        u.foto_perfil,
        COUNT(d.id) AS quantidade,
        COALESCE(SUM(d.valor), 0) AS total
      FROM usuarios u
      INNER JOIN dizimos d ON d.usuario_id = u.id
      WHERE strftime('%Y', d.data_pagamento) = ?
      GROUP BY u.id, u.nome, u.foto_perfil
      ORDER BY total DESC
      LIMIT 10
    `, [ano]);

    res.json(rows.map((item) => ({
      id: item.id,
      nome: item.nome,
      fotoPerfil: item.foto_perfil,
      quantidade: Number(item.quantidade || 0),
      total: Number(item.total || 0)
    })));
  } catch (error) {
    console.error('Erro ao buscar top dizimistas:', error);
    res.status(500).json({
      error: 'Erro ao buscar top dizimistas',
      detalhes: error.message
    });
  }
});

router.get('/distribuicao-tipos', async (req, res) => {
  try {
    const periodo = obterPeriodo(req);

    const [dizimosRows] = await pool.execute(`
      SELECT COALESCE(SUM(valor), 0) AS total
      FROM dizimos
      WHERE strftime('%Y-%m', data_pagamento) = ?
    `, [periodo]);

    const [ofertasRows] = await pool.execute(`
      SELECT
        COALESCE(tipo_oferta, 'oferta') AS tipo,
        COALESCE(SUM(valor), 0) AS total
      FROM ofertas
      WHERE strftime('%Y-%m', data_oferta) = ?
      GROUP BY COALESCE(tipo_oferta, 'oferta')
    `, [periodo]);

    const cores = {
      dizimo: '#667eea',
      oferta: '#764ba2',
      campanha: '#f093fb',
      missoes: '#4facfe',
      construcao: '#43e97b',
      outros: '#fa709a'
    };

    const distribuicao = [
      {
        tipo: 'Dízimos',
        total: Number(dizimosRows[0]?.total || 0),
        cor: cores.dizimo
      }
    ];

    ofertasRows.forEach((item) => {
      const tipoOriginal = String(item.tipo || 'oferta').toLowerCase();
      const tipoFormatado = tipoOriginal.charAt(0).toUpperCase() + tipoOriginal.slice(1);
      distribuicao.push({
        tipo: tipoFormatado,
        total: Number(item.total || 0),
        cor: cores[tipoOriginal] || '#95a5a6'
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

router.get('/aniversariantes-mes', async (req, res) => {
  try {
    const periodo = obterPeriodo(req);
    const [, mes] = periodo.split('-');

    const [rows] = await pool.execute(`
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
    `, [mes]);

    res.json(rows.map((item) => ({
      id: item.id,
      nome: item.nome,
      fotoPerfil: item.foto_perfil,
      dataNascimento: item.data_nascimento
    })));
  } catch (error) {
    console.error('Erro ao buscar aniversariantes do mês:', error);
    res.status(500).json({
      error: 'Erro ao buscar aniversariantes do mês',
      detalhes: error.message
    });
  }
});

module.exports = router;
