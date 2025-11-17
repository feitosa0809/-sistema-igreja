// Servidor integrado - Backend + Frontend
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend')); // Serve arquivos estáticos

// Banco de dados SQLite
let db;
try {
    db = new Database('database.sqlite');
    console.log('✅ Banco SQLite conectado');
    
    // Criar tabelas
    db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            telefone TEXT,
            data_nascimento DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            tipo TEXT NOT NULL,
            forma_pagamento TEXT NOT NULL,
            observacoes TEXT,
            data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
    `);
    console.log('✅ Tabelas criadas/verificadas');
} catch (error) {
    console.error('❌ Erro no banco:', error);
}

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// ============ ROTAS DE AUTENTICAÇÃO ============

// Registro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nome, email, senha, telefone, data_nascimento } = req.body;
        
        const senhaHash = await bcrypt.hash(senha, 10);
        const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(nome, email, senhaHash, telefone, data_nascimento);
        
        const token = jwt.sign({ id: result.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: { id: result.lastInsertRowid, nome, email }
        });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
        
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });
        
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: { id: user.id, nome: user.nome, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao fazer login' });
    }
});

// ============ ROTAS DE ANIVERSARIANTES ============

// Aniversariantes de hoje
app.get('/api/birthdays/today', authMiddleware, (req, res) => {
    try {
        const query = `
            SELECT id, nome, email, telefone, data_nascimento,
                   strftime('%d', data_nascimento) as dia,
                   strftime('%m', data_nascimento) as mes,
                   (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
            FROM usuarios
            WHERE strftime('%m-%d', data_nascimento) = strftime('%m-%d', 'now')
            ORDER BY nome
        `;
        const aniversariantes = db.prepare(query).all();
        res.json({ total: aniversariantes.length, aniversariantes });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aniversariantes' });
    }
});

// Aniversariantes do mês
app.get('/api/birthdays/month/:mes', authMiddleware, (req, res) => {
    try {
        const { mes } = req.params;
        const query = `
            SELECT id, nome, email, telefone, data_nascimento,
                   strftime('%d', data_nascimento) as dia,
                   (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
            FROM usuarios
            WHERE strftime('%m', data_nascimento) = ?
            ORDER BY CAST(strftime('%d', data_nascimento) AS INTEGER)
        `;
        const aniversariantes = db.prepare(query).all(mes.padStart(2, '0'));
        res.json({ mes: parseInt(mes), total: aniversariantes.length, aniversariantes });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aniversariantes' });
    }
});

// Próximos aniversários (7 dias)
app.get('/api/birthdays/upcoming', authMiddleware, (req, res) => {
    try {
        const query = `
            SELECT id, nome, email, telefone, data_nascimento,
                   strftime('%d', data_nascimento) as dia,
                   strftime('%m', data_nascimento) as mes,
                   (strftime('%Y', 'now') - strftime('%Y', data_nascimento)) as idade
            FROM usuarios
            WHERE data_nascimento IS NOT NULL
            ORDER BY strftime('%m-%d', data_nascimento)
        `;
        const todos = db.prepare(query).all();
        
        const hoje = new Date();
        const proximos = todos.filter(u => {
            const aniv = new Date(hoje.getFullYear(), parseInt(u.mes) - 1, parseInt(u.dia));
            if (aniv < hoje) aniv.setFullYear(hoje.getFullYear() + 1);
            const dias = Math.ceil((aniv - hoje) / (1000 * 60 * 60 * 24));
            u.dias_restantes = dias;
            return dias >= 0 && dias <= 7;
        });
        
        res.json({ total: proximos.length, aniversariantes: proximos });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar próximos aniversários' });
    }
});

// Estatísticas
app.get('/api/birthdays/stats', authMiddleware, (req, res) => {
    try {
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const estatisticas = meses.map((nome, idx) => {
            const mes = (idx + 1).toString().padStart(2, '0');
            const total = db.prepare(`
                SELECT COUNT(*) as count FROM usuarios 
                WHERE strftime('%m', data_nascimento) = ?
            `).get(mes).count;
            
            return { mes: idx + 1, nome_mes: nome, total_aniversariantes: total };
        });
        
        const total_geral = db.prepare('SELECT COUNT(*) as count FROM usuarios WHERE data_nascimento IS NOT NULL').get().count;
        
        res.json({ total_geral, por_mes: estatisticas });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

// ============ ROTAS DE PAGAMENTOS ============

// Listar pagamentos
app.get('/api/payments', authMiddleware, (req, res) => {
    try {
        const payments = db.prepare(`
            SELECT * FROM payments 
            WHERE usuario_id = ? 
            ORDER BY data_pagamento DESC
        `).all(req.userId);
        
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pagamentos' });
    }
});

// Registrar pagamento
app.post('/api/payments', authMiddleware, (req, res) => {
    try {
        const { valor, tipo, forma_pagamento, observacoes } = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO payments (usuario_id, valor, tipo, forma_pagamento, observacoes) 
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(req.userId, valor, tipo, forma_pagamento, observacoes);
        
        res.json({
            id: result.lastInsertRowid,
            message: 'Pagamento registrado com sucesso'
        });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar pagamento' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota principal - serve o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
