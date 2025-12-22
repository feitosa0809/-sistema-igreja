const nodemailer = require('nodemailer');
const db = require('../config/database-sqlite');

// Cache do transporter para evitar recriação
let transporterCache = null;
let configCache = null;

/**
 * Obtém ou cria o transporter de email com base nas configurações da igreja
 */
async function getEmailTransporter() {
  try {
    // Buscar configurações SMTP do banco
    const config = await db.all('SELECT * FROM configuracoes_igreja LIMIT 1');
    
    if (!config || config.length === 0) {
      throw new Error('Configurações de email não encontradas. Configure o SMTP nas configurações da igreja.');
    }

    const emailConfig = config[0];

    // Verificar se há configuração SMTP válida
    if (!emailConfig.smtp_host || !emailConfig.smtp_user || !emailConfig.smtp_password) {
      throw new Error('Configurações SMTP incompletas. Configure host, usuário e senha nas configurações da igreja.');
    }

    // Verificar se precisa recriar o transporter (configurações mudaram)
    const configKey = `${emailConfig.smtp_host}-${emailConfig.smtp_port}-${emailConfig.smtp_user}`;
    if (transporterCache && configCache === configKey) {
      return transporterCache;
    }

    // Criar novo transporter
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp_host,
      port: parseInt(emailConfig.smtp_port) || 587,
      secure: emailConfig.smtp_secure === 1 || emailConfig.smtp_secure === '1', // true para porta 465, false para outras
      auth: {
        user: emailConfig.smtp_user,
        pass: emailConfig.smtp_password
      },
      tls: {
        rejectUnauthorized: false // Para servidores com certificado self-signed
      }
    });

    // Verificar conexão
    await transporter.verify();

    // Cachear transporter
    transporterCache = transporter;
    configCache = configKey;

    return transporter;

  } catch (error) {
    console.error('Erro ao configurar email transporter:', error);
    throw error;
  }
}

/**
 * Obtém informações da igreja para usar nos emails
 */
async function getIgrejaInfo() {
  try {
    const config = await db.all('SELECT * FROM configuracoes_igreja LIMIT 1');
    if (config && config.length > 0) {
      return {
        nome: config[0].nome_igreja || 'Igreja',
        email: config[0].email_notificacao || config[0].email || 'noreply@igreja.com',
        telefone: config[0].telefone || '',
        endereco: config[0].endereco || '',
        site: config[0].site || ''
      };
    }
    return {
      nome: 'Igreja',
      email: 'noreply@igreja.com',
      telefone: '',
      endereco: '',
      site: ''
    };
  } catch (error) {
    console.error('Erro ao buscar informações da igreja:', error);
    return {
      nome: 'Igreja',
      email: 'noreply@igreja.com',
      telefone: '',
      endereco: '',
      site: ''
    };
  }
}

/**
 * Envia email de confirmação de dízimo
 */
async function enviarEmailConfirmacaoDizimo(dizimo, usuario) {
  try {
    const transporter = await getEmailTransporter();
    const igrejaInfo = await getIgrejaInfo();

    const dataFormatada = new Date(dizimo.data_pagamento).toLocaleDateString('pt-BR');
    const valorFormatado = parseFloat(dizimo.valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const mailOptions = {
      from: `"${igrejaInfo.nome}" <${igrejaInfo.email}>`,
      to: usuario.email,
      subject: `✅ Dízimo Confirmado - ${igrejaInfo.nome}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-label { font-weight: bold; color: #666; }
            .info-value { color: #333; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Dízimo Confirmado</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${usuario.nome}</strong>!</p>
              
              <p>Seu dízimo foi confirmado com sucesso. Que Deus abençoe sua generosidade!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #667eea;">Detalhes do Dízimo</h3>
                <div class="info-row">
                  <span class="info-label">Data:</span>
                  <span class="info-value">${dataFormatada}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Valor:</span>
                  <span class="info-value" style="color: #28a745; font-weight: bold; font-size: 1.2em;">${valorFormatado}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tipo de Pagamento:</span>
                  <span class="info-value">${dizimo.tipo_pagamento}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Status:</span>
                  <span class="info-value" style="color: #28a745; font-weight: bold;">CONFIRMADO</span>
                </div>
              </div>
              
              <p style="font-style: italic; color: #666;">
                "Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, 
                e depois fazei prova de mim, diz o SENHOR dos Exércitos, se eu não vos abrir as janelas 
                do céu, e não derramar sobre vós uma bênção tal, que dela vos advenha a maior abastança."
                <br><strong>Malaquias 3:10</strong>
              </p>
            </div>
            <div class="footer">
              <p><strong>${igrejaInfo.nome}</strong></p>
              ${igrejaInfo.endereco ? `<p>${igrejaInfo.endereco}</p>` : ''}
              ${igrejaInfo.telefone ? `<p>Telefone: ${igrejaInfo.telefone}</p>` : ''}
              ${igrejaInfo.site ? `<p><a href="${igrejaInfo.site}">${igrejaInfo.site}</a></p>` : ''}
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de confirmação de dízimo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erro ao enviar email de confirmação de dízimo:', error);
    throw error;
  }
}

/**
 * Envia email de lembrete de aniversário
 */
async function enviarEmailAniversario(usuario) {
  try {
    const transporter = await getEmailTransporter();
    const igrejaInfo = await getIgrejaInfo();

    const mailOptions = {
      from: `"${igrejaInfo.nome}" <${igrejaInfo.email}>`,
      to: usuario.email,
      subject: `🎂 Feliz Aniversário! - ${igrejaInfo.nome}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 2.5em; }
            .content { background: #fff3cd; padding: 30px; border-radius: 0 0 10px 10px; }
            .balloon { font-size: 3em; text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎂 FELIZ ANIVERSÁRIO!</h1>
            </div>
            <div class="content">
              <div class="balloon">🎈🎉🎁</div>
              
              <p style="font-size: 1.2em; text-align: center;">
                Querido(a) <strong>${usuario.nome}</strong>,
              </p>
              
              <p style="text-align: center;">
                Toda a família <strong>${igrejaInfo.nome}</strong> deseja a você um feliz aniversário!
              </p>
              
              <p style="text-align: center; font-style: italic; color: #856404; margin: 30px 0;">
                "O SENHOR te abençoe e te guarde; o SENHOR faça resplandecer o seu rosto sobre ti 
                e tenha misericórdia de ti; o SENHOR sobre ti levante o seu rosto e te dê a paz."
                <br><strong>Números 6:24-26</strong>
              </p>
              
              <p style="text-align: center;">
                Que Deus continue abençoando sua vida com saúde, paz, alegria e prosperidade!
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 1.5em; margin: 0;">🎊 Parabéns! 🎊</p>
              </div>
            </div>
            <div class="footer">
              <p><strong>${igrejaInfo.nome}</strong></p>
              ${igrejaInfo.endereco ? `<p>${igrejaInfo.endereco}</p>` : ''}
              ${igrejaInfo.telefone ? `<p>Telefone: ${igrejaInfo.telefone}</p>` : ''}
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de aniversário enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erro ao enviar email de aniversário:', error);
    throw error;
  }
}

/**
 * Envia email personalizado
 */
async function enviarEmailPersonalizado(destinatario, assunto, conteudoHtml) {
  try {
    const transporter = await getEmailTransporter();
    const igrejaInfo = await getIgrejaInfo();

    const mailOptions = {
      from: `"${igrejaInfo.nome}" <${igrejaInfo.email}>`,
      to: destinatario,
      subject: assunto,
      html: conteudoHtml
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email personalizado enviado:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Erro ao enviar email personalizado:', error);
    throw error;
  }
}

/**
 * Testa configuração de email
 */
async function testarConfiguracoesEmail() {
  try {
    const transporter = await getEmailTransporter();
    await transporter.verify();
    return { success: true, message: 'Configurações de email válidas!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  enviarEmailConfirmacaoDizimo,
  enviarEmailAniversario,
  enviarEmailPersonalizado,
  testarConfiguracoesEmail,
  getEmailTransporter,
  getIgrejaInfo
};
