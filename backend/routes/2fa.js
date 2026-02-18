const express = require('express');
const router = express.Router();
const db = require('../config/database-sqlite');
const { authMiddleware: auth } = require('../middleware/auth');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Ativar 2FA para o usuário
router.post('/enable', auth, async (req, res) => {
  try {
    const userId = req.usuario.id;

    // Gerar secret
    const secret = speakeasy.generateSecret({
      name: `Sistema Dízimo (${req.usuario.email})`,
      length: 32
    });

    // Gerar backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
    }

    // Salvar no banco
    const sql = `
      INSERT OR REPLACE INTO usuario_2fa (usuario_id, secret, ativo, backup_codes)
      VALUES (?, ?, 0, ?)
    `;

    db.run(sql, [
      userId,
      secret.base32,
      JSON.stringify(backupCodes)
    ], async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Gerar QR Code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      res.json({
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: backupCodes,
        message: 'Escaneie o QR Code com seu app autenticador e confirme com um código'
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar e confirmar ativação do 2FA
router.post('/verify', auth, (req, res) => {
  const { token } = req.body;
  const userId = req.usuario.id;

  if (!token) {
    return res.status(400).json({ error: 'Token é obrigatório' });
  }

  // Buscar secret do usuário
  db.get('SELECT * FROM usuario_2fa WHERE usuario_id = ?', [userId], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!config) {
      return res.status(404).json({ error: '2FA não configurado' });
    }

    // Verificar token
    const verified = speakeasy.totp.verify({
      secret: config.secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (verified) {
      // Ativar 2FA
      db.run(
        'UPDATE usuario_2fa SET ativo = 1 WHERE usuario_id = ?',
        [userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Log
          const logSql = `
            INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.run(logSql, [
            userId,
            'ENABLE_2FA',
            'usuario_2fa',
            config.id,
            JSON.stringify({ acao: '2FA ativado' })
          ]);

          res.json({ message: '2FA ativado com sucesso!' });
        }
      );
    } else {
      res.status(400).json({ error: 'Token inválido' });
    }
  });
});

// Desativar 2FA
router.post('/disable', auth, (req, res) => {
  const { senha, token } = req.body;
  const userId = req.usuario.id;

  if (!senha || !token) {
    return res.status(400).json({ error: 'Senha e token são obrigatórios' });
  }

  // Verificar senha
  const bcrypt = require('bcryptjs');
  db.get('SELECT senha FROM usuarios WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: 'Erro ao verificar usuário' });
    }

    bcrypt.compare(senha, user.senha, (err, match) => {
      if (!match) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      // Buscar configuração 2FA
      db.get('SELECT * FROM usuario_2fa WHERE usuario_id = ?', [userId], (err, config) => {
        if (err || !config) {
          return res.status(404).json({ error: '2FA não configurado' });
        }

        // Verificar token
        const verified = speakeasy.totp.verify({
          secret: config.secret,
          encoding: 'base32',
          token: token,
          window: 2
        });

        if (verified) {
          // Desativar e deletar
          db.run('DELETE FROM usuario_2fa WHERE usuario_id = ?', [userId], (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Log
            const logSql = `
              INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
              VALUES (?, ?, ?, ?, ?)
            `;
            db.run(logSql, [
              userId,
              'DISABLE_2FA',
              'usuario_2fa',
              config.id,
              JSON.stringify({ acao: '2FA desativado' })
            ]);

            res.json({ message: '2FA desativado com sucesso' });
          });
        } else {
          res.status(400).json({ error: 'Token inválido' });
        }
      });
    });
  });
});

// Verificar 2FA no login (usado pelo auth.js)
router.post('/validate', async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ error: 'userId e token são obrigatórios' });
  }

  db.get('SELECT * FROM usuario_2fa WHERE usuario_id = ? AND ativo = 1', [userId], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!config) {
      return res.status(404).json({ error: '2FA não está ativo' });
    }

    // Verificar se é um backup code
    const backupCodes = JSON.parse(config.backup_codes || '[]');
    if (backupCodes.includes(token)) {
      // Remover backup code usado
      const newBackupCodes = backupCodes.filter(code => code !== token);
      db.run(
        'UPDATE usuario_2fa SET backup_codes = ? WHERE id = ?',
        [JSON.stringify(newBackupCodes), config.id]
      );
      
      return res.json({ valid: true, method: 'backup_code' });
    }

    // Verificar token TOTP
    const verified = speakeasy.totp.verify({
      secret: config.secret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    res.json({ valid: verified, method: 'totp' });
  });
});

// Verificar status do 2FA
router.get('/status', auth, (req, res) => {
  const userId = req.usuario.id;

  db.get('SELECT ativo FROM usuario_2fa WHERE usuario_id = ?', [userId], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      enabled: config ? config.ativo === 1 : false
    });
  });
});

// Gerar novos backup codes
router.post('/regenerate-backup-codes', auth, (req, res) => {
  const userId = req.usuario.id;

  // Gerar novos códigos
  const backupCodes = [];
  for (let i = 0; i < 10; i++) {
    backupCodes.push(
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }

  db.run(
    'UPDATE usuario_2fa SET backup_codes = ? WHERE usuario_id = ?',
    [JSON.stringify(backupCodes), userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Log
      const logSql = `
        INSERT INTO logs_auditoria (usuario_id, acao, tabela, registro_id, detalhes)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(logSql, [
        userId,
        'REGENERATE_BACKUP_CODES',
        'usuario_2fa',
        userId,
        JSON.stringify({ acao: 'Novos backup codes gerados' })
      ]);

      res.json({
        message: 'Novos backup codes gerados',
        backupCodes: backupCodes
      });
    }
  );
});

module.exports = router;
