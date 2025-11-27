const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware } = require('../middleware/auth');

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
    if (!['admin', 'tesoureiro', 'pastor'].includes(req.user.tipo_usuario)) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
};

// Listar todos os usuários (exceto o próprio usuário logado)
router.get('/', authMiddleware, isAdmin, (req, res) => {
    try {
        const usuarios = db.query(`
            SELECT id, nome, email, tipo_usuario, status, data_cadastro
            FROM usuarios
            WHERE id != ?
            ORDER BY 
                CASE tipo_usuario
                    WHEN 'admin' THEN 1
                    WHEN 'pastor' THEN 2
                    WHEN 'tesoureiro' THEN 3
                    ELSE 4
                END,
                nome
        `, [req.user.id]);

        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Promover/Rebaixar usuário
router.put('/:id/tipo', authMiddleware, isAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_usuario } = req.body;

        // Validar tipo de usuário
        const tiposValidos = ['admin', 'pastor', 'tesoureiro', 'membro'];
        if (!tiposValidos.includes(tipo_usuario)) {
            return res.status(400).json({ error: 'Tipo de usuário inválido' });
        }

        // Não permitir modificar o próprio usuário
        if (parseInt(id) === req.user.id) {
            return res.status(403).json({ error: 'Você não pode modificar seu próprio tipo de usuário' });
        }

        // Verificar se usuário existe
        const usuario = db.query('SELECT * FROM usuarios WHERE id = ?', [id])[0];
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualizar tipo de usuário
        db.execute(
            'UPDATE usuarios SET tipo_usuario = ? WHERE id = ?',
            [tipo_usuario, id]
        );

        res.json({ 
            message: 'Tipo de usuário atualizado com sucesso',
            usuario: {
                id: parseInt(id),
                nome: usuario.nome,
                tipo_usuario
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar tipo de usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar tipo de usuário' });
    }
});

// Ativar/Desativar usuário
router.put('/:id/status', authMiddleware, isAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validar status
        if (!['ativo', 'inativo'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        // Não permitir modificar o próprio usuário
        if (parseInt(id) === req.user.id) {
            return res.status(403).json({ error: 'Você não pode modificar seu próprio status' });
        }

        // Verificar se usuário existe
        const usuario = db.query('SELECT * FROM usuarios WHERE id = ?', [id])[0];
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Atualizar status
        db.execute(
            'UPDATE usuarios SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ 
            message: `Usuário ${status === 'ativo' ? 'ativado' : 'desativado'} com sucesso`,
            usuario: {
                id: parseInt(id),
                nome: usuario.nome,
                status
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
});

// Excluir usuário
router.delete('/:id', authMiddleware, isAdmin, (req, res) => {
    try {
        const { id } = req.params;

        // Não permitir excluir o próprio usuário
        if (parseInt(id) === req.user.id) {
            return res.status(403).json({ error: 'Você não pode excluir sua própria conta' });
        }

        // Verificar se usuário existe
        const usuario = db.query('SELECT * FROM usuarios WHERE id = ?', [id])[0];
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verificar se usuário tem dízimos ou ofertas registrados
        const dizimos = db.query('SELECT COUNT(*) as total FROM dizimos WHERE usuario_id = ?', [id])[0];
        const ofertas = db.query('SELECT COUNT(*) as total FROM ofertas WHERE usuario_id = ?', [id])[0];

        if (dizimos.total > 0 || ofertas.total > 0) {
            return res.status(400).json({ 
                error: 'Não é possível excluir este usuário pois possui registros de dízimos ou ofertas associados. Considere desativar o usuário ao invés de excluí-lo.'
            });
        }

        // Excluir usuário
        db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

        res.json({ 
            message: 'Usuário excluído com sucesso',
            usuario: {
                id: parseInt(id),
                nome: usuario.nome
            }
        });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
});

module.exports = router;
