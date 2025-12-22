const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const backup = require('../utils/backup');
const path = require('path');
const fs = require('fs');

// Middleware para autenticar
const authenticateToken = authMiddleware;
const requireAdmin = requireRole(['admin']);

// POST - Criar backup manual
router.post('/criar', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await backup.criarBackup();
        res.json({
            message: 'Backup criado com sucesso',
            ...result
        });
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        res.status(500).json({ error: 'Erro ao criar backup' });
    }
});

// GET - Listar backups disponíveis
router.get('/listar', authenticateToken, requireAdmin, (req, res) => {
    try {
        const backups = backup.listarBackups();
        res.json({
            total: backups.length,
            backups
        });
    } catch (error) {
        console.error('Erro ao listar backups:', error);
        res.status(500).json({ error: 'Erro ao listar backups' });
    }
});

// GET - Obter estatísticas de backup
router.get('/estatisticas', authenticateToken, requireAdmin, (req, res) => {
    try {
        const stats = backup.obterEstatisticasBackup();
        res.json(stats);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
});

// POST - Restaurar backup
router.post('/restaurar/:filename', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { filename } = req.params;
        const result = await backup.restaurarBackup(filename);
        res.json({
            message: 'Backup restaurado com sucesso',
            ...result
        });
    } catch (error) {
        console.error('Erro ao restaurar backup:', error);
        res.status(500).json({ error: 'Erro ao restaurar backup: ' + error.message });
    }
});

// GET - Download de backup
router.get('/download/:filename', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const backupPath = path.join(__dirname, '..', 'backups', filename);
        
        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ error: 'Backup não encontrado' });
        }
        
        res.download(backupPath, filename);
    } catch (error) {
        console.error('Erro ao fazer download do backup:', error);
        res.status(500).json({ error: 'Erro ao fazer download' });
    }
});

// DELETE - Deletar backup específico
router.delete('/:filename', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const backupPath = path.join(__dirname, '..', 'backups', filename);
        
        if (!fs.existsSync(backupPath)) {
            return res.status(404).json({ error: 'Backup não encontrado' });
        }
        
        fs.unlinkSync(backupPath);
        
        res.json({ message: 'Backup deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar backup:', error);
        res.status(500).json({ error: 'Erro ao deletar backup' });
    }
});

module.exports = router;
