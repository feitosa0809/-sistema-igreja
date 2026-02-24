const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database-sqlite');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Perfil do usuário
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, nome, email, telefone, endereco, data_nascimento, foto_perfil, tipo_usuario, status, data_cadastro 
      FROM usuarios 
      WHERE id = ?
    `, [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: rows[0] });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Atualizar perfil
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { nome, email, telefone, endereco, data_nascimento } = req.body;
    const normalizedNome = typeof nome === 'string' ? nome.trim() : nome;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
    const normalizedTelefone = typeof telefone === 'string' ? telefone.trim() : telefone;
    const normalizedEndereco = typeof endereco === 'string' ? endereco.trim() : endereco;
    const normalizedDataNascimento = typeof data_nascimento === 'string' ? data_nascimento.trim() : data_nascimento;
    
    // Se email foi alterado, verificar se não existe outro usuário com esse email
    if (normalizedEmail) {
      const [existingUser] = await pool.execute(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [normalizedEmail, req.user.id]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
      }
    }

    // Construir query dinamicamente apenas com campos fornecidos
    const updates = [];
    const values = [];
    
    if (normalizedNome !== undefined && normalizedNome !== '') {
      updates.push('nome = ?');
      values.push(normalizedNome);
    }
    if (normalizedEmail !== undefined && normalizedEmail !== '') {
      updates.push('email = ?');
      values.push(normalizedEmail);
    }
    if (normalizedTelefone !== undefined) {
      updates.push('telefone = ?');
      values.push(normalizedTelefone || null);
    }
    if (normalizedEndereco !== undefined) {
      updates.push('endereco = ?');
      values.push(normalizedEndereco || null);
    }
    if (normalizedDataNascimento !== undefined) {
      updates.push('data_nascimento = ?');
      values.push(normalizedDataNascimento || null);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
    
    updates.push('data_atualizacao = CURRENT_TIMESTAMP');
    values.push(req.user.id);
    
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Perfil atualizado com sucesso' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Alterar senha
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { senha_atual, nova_senha } = req.body;

    // Validações básicas
    if (!senha_atual || !nova_senha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (nova_senha.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter no mínimo 6 caracteres' });
    }

    // Buscar senha atual do usuário
    const [rows] = await pool.execute(
      'SELECT senha FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(senha_atual, rows[0].senha);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(nova_senha, 12);

    // Atualizar senha
    await pool.execute(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

module.exports = router;