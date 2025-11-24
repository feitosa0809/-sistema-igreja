const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware } = require('../middleware/auth');

// Rota para relatório completo (somente admin)
router.get('/completo', authMiddleware, async (req, res) => {
    try {
        // Verificar se é admin
        if (req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Somente administradores.' });
        }

        // Buscar todos os dados
        const usuarios = await db.query('SELECT id, nome, email, tipo_usuario, status, data_nascimento, data_cadastro FROM usuarios');
        
        const dizimos = await db.query(`
            SELECT d.*, u.nome as usuario_nome 
            FROM dizimos d 
            LEFT JOIN usuarios u ON d.usuario_id = u.id
            ORDER BY d.data_pagamento DESC
        `);
        
        const ofertas = await db.query(`
            SELECT o.*, u.nome as usuario_nome 
            FROM ofertas o 
            LEFT JOIN usuarios u ON o.usuario_id = u.id
            ORDER BY o.data_cadastro DESC
        `);
        
        const campanhas = await db.query('SELECT * FROM campanhas ORDER BY data_cadastro DESC');

        // Calcular totais
        const totalDizimos = dizimos.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        const totalOfertas = ofertas.reduce((sum, o) => sum + parseFloat(o.valor || 0), 0);
        const totalGeral = totalDizimos + totalOfertas;

        res.json({
            sucesso: true,
            relatorio: {
                usuarios: {
                    total: usuarios.length,
                    lista: usuarios
                },
                dizimos: {
                    total: dizimos.length,
                    valorTotal: totalDizimos.toFixed(2),
                    lista: dizimos
                },
                ofertas: {
                    total: ofertas.length,
                    valorTotal: totalOfertas.toFixed(2),
                    lista: ofertas
                },
                campanhas: {
                    total: campanhas.length,
                    lista: campanhas
                },
                resumo: {
                    totalUsuarios: usuarios.length,
                    totalDizimos: totalDizimos.toFixed(2),
                    totalOfertas: totalOfertas.toFixed(2),
                    totalArrecadado: totalGeral.toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
});

// Rota para relatório resumido
router.get('/resumo', authMiddleware, async (req, res) => {
    try {
        if (req.user.tipo_usuario !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Somente administradores.' });
        }

        const totalUsuarios = await db.query('SELECT COUNT(*) as total FROM usuarios');
        const totalDizimos = await db.query('SELECT COUNT(*) as total, SUM(valor) as soma FROM dizimos');
        const totalOfertas = await db.query('SELECT COUNT(*) as total, SUM(valor) as soma FROM ofertas');
        const totalCampanhas = await db.query('SELECT COUNT(*) as total FROM campanhas');

        res.json({
            sucesso: true,
            resumo: {
                usuarios: totalUsuarios[0].total,
                dizimos: {
                    quantidade: totalDizimos[0].total,
                    valor: parseFloat(totalDizimos[0].soma || 0).toFixed(2)
                },
                ofertas: {
                    quantidade: totalOfertas[0].total,
                    valor: parseFloat(totalOfertas[0].soma || 0).toFixed(2)
                },
                campanhas: totalCampanhas[0].total,
                totalArrecadado: (parseFloat(totalDizimos[0].soma || 0) + parseFloat(totalOfertas[0].soma || 0)).toFixed(2)
            }
        });
    } catch (error) {
        console.error('Erro ao gerar resumo:', error);
        res.status(500).json({ error: 'Erro ao gerar resumo' });
    }
});

module.exports = router;
