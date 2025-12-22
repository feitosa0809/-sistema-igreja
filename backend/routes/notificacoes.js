const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const emailService = require('../utils/emailService');
const db = require('../config/database-sqlite');

// Aplicar middleware de autenticação
router.use(authMiddleware);

// POST /api/notificacoes/testar-email
// Testa configurações de email
router.post('/testar-email', requireRole(['admin']), async (req, res) => {
  try {
    const resultado = await emailService.testarConfiguracoesEmail();
    
    if (resultado.success) {
      res.json({
        sucesso: true,
        mensagem: 'Configurações de email testadas com sucesso! O servidor SMTP está funcionando.'
      });
    } else {
      res.status(400).json({
        sucesso: false,
        mensagem: 'Erro ao testar configurações de email',
        erro: resultado.message
      });
    }

  } catch (error) {
    console.error('Erro ao testar email:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao testar configurações de email',
      erro: error.message
    });
  }
});

// POST /api/notificacoes/enviar-confirmacao-dizimo
// Envia email de confirmação de dízimo manualmente
router.post('/enviar-confirmacao-dizimo', requireRole(['admin', 'tesoureiro']), async (req, res) => {
  try {
    const { dizimoId } = req.body;

    if (!dizimoId) {
      return res.status(400).json({ error: 'ID do dízimo é obrigatório' });
    }

    // Buscar dízimo
    const dizimos = await db.all(`
      SELECT d.*, u.nome, u.email
      FROM dizimos d
      INNER JOIN usuarios u ON u.id = d.usuario_id
      WHERE d.id = ?
    `, [dizimoId]);

    if (dizimos.length === 0) {
      return res.status(404).json({ error: 'Dízimo não encontrado' });
    }

    const dizimo = dizimos[0];
    const usuario = { nome: dizimo.nome, email: dizimo.email };

    // Enviar email
    await emailService.enviarEmailConfirmacaoDizimo(dizimo, usuario);

    res.json({
      sucesso: true,
      mensagem: 'Email de confirmação enviado com sucesso',
      destinatario: dizimo.email
    });

  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao enviar email',
      erro: error.message
    });
  }
});

// POST /api/notificacoes/enviar-aniversario
// Envia email de aniversário para um usuário
router.post('/enviar-aniversario', requireRole(['admin', 'pastor']), async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    // Buscar usuário
    const usuarios = await db.all(`
      SELECT id, nome, email, data_nascimento
      FROM usuarios
      WHERE id = ? AND status = 'ativo'
    `, [usuarioId]);

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const usuario = usuarios[0];

    if (!usuario.email) {
      return res.status(400).json({ error: 'Usuário não possui email cadastrado' });
    }

    // Enviar email
    await emailService.enviarEmailAniversario(usuario);

    res.json({
      sucesso: true,
      mensagem: 'Email de aniversário enviado com sucesso',
      destinatario: usuario.email
    });

  } catch (error) {
    console.error('Erro ao enviar email de aniversário:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao enviar email',
      erro: error.message
    });
  }
});

// POST /api/notificacoes/enviar-aniversarios-automatico
// Envia emails de aniversário para todos os aniversariantes do dia
router.post('/enviar-aniversarios-automatico', requireRole(['admin', 'pastor']), async (req, res) => {
  try {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');

    // Buscar aniversariantes do dia
    const aniversariantes = await db.all(`
      SELECT id, nome, email, data_nascimento
      FROM usuarios
      WHERE strftime('%m-%d', data_nascimento) = ?
      AND status = 'ativo'
      AND email IS NOT NULL
      AND email != ''
    `, [`${mes}-${dia}`]);

    if (aniversariantes.length === 0) {
      return res.json({
        sucesso: true,
        mensagem: 'Nenhum aniversariante hoje',
        enviados: 0
      });
    }

    const resultados = [];
    let enviados = 0;
    let erros = 0;

    // Enviar email para cada aniversariante
    for (const usuario of aniversariantes) {
      try {
        await emailService.enviarEmailAniversario(usuario);
        resultados.push({
          nome: usuario.nome,
          email: usuario.email,
          status: 'enviado'
        });
        enviados++;
      } catch (error) {
        resultados.push({
          nome: usuario.nome,
          email: usuario.email,
          status: 'erro',
          erro: error.message
        });
        erros++;
      }
    }

    res.json({
      sucesso: true,
      mensagem: `Processo concluído: ${enviados} emails enviados, ${erros} erros`,
      total: aniversariantes.length,
      enviados,
      erros,
      detalhes: resultados
    });

  } catch (error) {
    console.error('Erro ao enviar emails de aniversário automático:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar emails de aniversário',
      erro: error.message
    });
  }
});

// POST /api/notificacoes/enviar-personalizado
// Envia email personalizado
router.post('/enviar-personalizado', requireRole(['admin', 'pastor']), async (req, res) => {
  try {
    const { destinatarios, assunto, mensagem } = req.body;

    if (!destinatarios || !Array.isArray(destinatarios) || destinatarios.length === 0) {
      return res.status(400).json({ error: 'Lista de destinatários é obrigatória' });
    }

    if (!assunto || !mensagem) {
      return res.status(400).json({ error: 'Assunto e mensagem são obrigatórios' });
    }

    // Buscar informações da igreja para template
    const igrejaInfo = await emailService.getIgrejaInfo();

    // Template HTML
    const conteudoHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${igrejaInfo.nome}</h1>
          </div>
          <div class="content">
            ${mensagem}
          </div>
          <div class="footer">
            <p><strong>${igrejaInfo.nome}</strong></p>
            ${igrejaInfo.endereco ? `<p>${igrejaInfo.endereco}</p>` : ''}
            ${igrejaInfo.telefone ? `<p>Telefone: ${igrejaInfo.telefone}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const resultados = [];
    let enviados = 0;
    let erros = 0;

    // Enviar para cada destinatário
    for (const email of destinatarios) {
      try {
        await emailService.enviarEmailPersonalizado(email, assunto, conteudoHtml);
        resultados.push({
          email,
          status: 'enviado'
        });
        enviados++;
      } catch (error) {
        resultados.push({
          email,
          status: 'erro',
          erro: error.message
        });
        erros++;
      }
    }

    res.json({
      sucesso: true,
      mensagem: `Processo concluído: ${enviados} emails enviados, ${erros} erros`,
      total: destinatarios.length,
      enviados,
      erros,
      detalhes: resultados
    });

  } catch (error) {
    console.error('Erro ao enviar emails personalizados:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao enviar emails',
      erro: error.message
    });
  }
});

// GET /api/notificacoes/historico
// Lista histórico de notificações enviadas (futuro: implementar tabela de log)
router.get('/historico', requireRole(['admin', 'pastor']), async (req, res) => {
  try {
    // Por enquanto retorna vazio, mas pode ser implementado com tabela de log
    res.json({
      mensagem: 'Funcionalidade de histórico será implementada em breve',
      notificacoes: []
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar histórico',
      erro: error.message
    });
  }
});

module.exports = router;
