const express = require('express');
const router = express.Router();
const pool = require('../config/database-sqlite');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Middleware para autenticar
const authenticateToken = authMiddleware;
const requireAdmin = requireRole(['admin', 'tesoureiro', 'pastor']);

// GET - Buscar configurações da igreja
router.get('/', authenticateToken, async (req, res) => {
    try {
        const config = await pool.query('SELECT * FROM configuracoes_igreja LIMIT 1');
        
        if (config.length === 0) {
            // Criar configuração padrão se não existir
            await pool.run(`
                INSERT INTO configuracoes_igreja (
                    nome_igreja, pix_chave, pix_tipo, mensagem_boas_vindas, rodape_recibo
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                'Minha Igreja',
                'igreja@exemplo.com.br',
                'email',
                'Bem-vindo(a) ao sistema de gestão da nossa igreja!',
                'Que Deus abençoe a sua contribuição!'
            ]);
            
            const newConfig = await pool.query('SELECT * FROM configuracoes_igreja LIMIT 1');
            return res.json(newConfig[0]);
        }
        
        res.json(config[0]);
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

// PUT - Atualizar configurações da igreja (apenas admin)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const {
            nome_igreja,
            cnpj,
            endereco,
            telefone,
            email,
            site,
            logo_url,
            banco_nome,
            banco_codigo,
            agencia,
            conta,
            titular,
            pix_tipo,
            pix_chave,
            pix_qrcode_url,
            email_notificacao,
            smtp_host,
            smtp_port,
            smtp_user,
            smtp_password,
            smtp_secure,
            mensagem_boas_vindas,
            rodape_recibo
        } = req.body;
        
        // Verificar se existe configuração
        const existing = await pool.query('SELECT id FROM configuracoes_igreja LIMIT 1');
        
        if (existing.length === 0) {
            // Inserir nova configuração
            await pool.run(`
                INSERT INTO configuracoes_igreja (
                    nome_igreja, cnpj, endereco, telefone, email, site, logo_url,
                    banco_nome, banco_codigo, agencia, conta, titular,
                    pix_tipo, pix_chave, pix_qrcode_url,
                    email_notificacao, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure,
                    mensagem_boas_vindas, rodape_recibo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                nome_igreja, cnpj, endereco, telefone, email, site, logo_url,
                banco_nome, banco_codigo, agencia, conta, titular,
                pix_tipo, pix_chave, pix_qrcode_url,
                email_notificacao, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure,
                mensagem_boas_vindas, rodape_recibo
            ]);
        } else {
            // Atualizar configuração existente
            await pool.run(`
                UPDATE configuracoes_igreja SET
                    nome_igreja = ?,
                    cnpj = ?,
                    endereco = ?,
                    telefone = ?,
                    email = ?,
                    site = ?,
                    logo_url = ?,
                    banco_nome = ?,
                    banco_codigo = ?,
                    agencia = ?,
                    conta = ?,
                    titular = ?,
                    pix_tipo = ?,
                    pix_chave = ?,
                    pix_qrcode_url = ?,
                    email_notificacao = ?,
                    smtp_host = ?,
                    smtp_port = ?,
                    smtp_user = ?,
                    smtp_password = ?,
                    smtp_secure = ?,
                    mensagem_boas_vindas = ?,
                    rodape_recibo = ?,
                    data_atualizacao = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [
                nome_igreja, cnpj, endereco, telefone, email, site, logo_url,
                banco_nome, banco_codigo, agencia, conta, titular,
                pix_tipo, pix_chave, pix_qrcode_url,
                email_notificacao, smtp_host, smtp_port, smtp_user, smtp_password, smtp_secure,
                mensagem_boas_vindas, rodape_recibo,
                existing[0].id
            ]);
        }
        
        // Buscar configuração atualizada
        const updated = await pool.query('SELECT * FROM configuracoes_igreja LIMIT 1');
        
        res.json({
            message: 'Configurações atualizadas com sucesso',
            config: updated[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
});

// GET - Buscar dados públicos da igreja (sem autenticação)
router.get('/publico', async (req, res) => {
    try {
        const config = await pool.query(`
            SELECT 
                nome_igreja, endereco, telefone, email, site, logo_url,
                pix_tipo, pix_chave, pix_qrcode_url,
                mensagem_boas_vindas
            FROM configuracoes_igreja 
            LIMIT 1
        `);
        
        if (config.length === 0) {
            return res.json({
                nome_igreja: 'Minha Igreja',
                pix_chave: 'igreja@exemplo.com.br',
                pix_tipo: 'email',
                mensagem_boas_vindas: 'Bem-vindo(a)!'
            });
        }
        
        res.json(config[0]);
    } catch (error) {
        console.error('Erro ao buscar dados públicos:', error);
        res.status(500).json({ error: 'Erro ao buscar dados públicos' });
    }
});

module.exports = router;
