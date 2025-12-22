const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Função auxiliar para executar comandos SQL com Promise
function runAsync(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Função para criar as tabelas
async function initializeDatabase() {
  try {
    console.log('🔄 Inicializando banco SQLite...');
    
    // Criar tabela de usuários
    await runAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        data_nascimento DATE,
        foto_perfil TEXT,
        tipo_usuario TEXT DEFAULT 'membro' CHECK(tipo_usuario IN ('membro', 'tesoureiro', 'pastor', 'admin')),
        status TEXT DEFAULT 'ativo' CHECK(status IN ('ativo', 'inativo')),
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Adicionar coluna foto_perfil se não existir (para bancos existentes)
    try {
      await runAsync(`ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT`);
    } catch (err) {
      if (!err.message.includes('duplicate column')) {
        console.error('Erro ao adicionar coluna foto_perfil:', err);
      }
    }

    // Criar tabela de dízimos
    await runAsync(`
      CREATE TABLE IF NOT EXISTS dizimos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data_pagamento DATE NOT NULL,
        metodo_pagamento TEXT NOT NULL CHECK(metodo_pagamento IN ('dinheiro', 'pix', 'cartao', 'transferencia')),
        comprovante_url TEXT,
        observacoes TEXT,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'confirmado', 'cancelado')),
        confirmado_por INTEGER,
        data_confirmacao DATETIME,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (confirmado_por) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de ofertas
    await runAsync(`
      CREATE TABLE IF NOT EXISTS ofertas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        valor DECIMAL(10,2) NOT NULL,
        data_oferta DATE NOT NULL,
        tipo_oferta TEXT NOT NULL,
        metodo_pagamento TEXT NOT NULL CHECK(metodo_pagamento IN ('dinheiro', 'pix', 'cartao', 'transferencia')),
        comprovante_url TEXT,
        observacoes TEXT,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'confirmado', 'cancelado')),
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de campanhas
    await runAsync(`
      CREATE TABLE IF NOT EXISTS campanhas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        meta_valor DECIMAL(10,2),
        valor_arrecadado DECIMAL(10,2) DEFAULT 0,
        data_inicio DATE NOT NULL,
        data_fim DATE,
        status TEXT DEFAULT 'ativa' CHECK(status IN ('ativa', 'finalizada', 'cancelada')),
        criado_por INTEGER NOT NULL,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de contribuições para campanhas
    await runAsync(`
      CREATE TABLE IF NOT EXISTS contribuicoes_campanha (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campanha_id INTEGER NOT NULL,
        usuario_id INTEGER,
        valor DECIMAL(10,2) NOT NULL,
        data_contribuicao DATE NOT NULL,
        metodo_pagamento TEXT NOT NULL CHECK(metodo_pagamento IN ('dinheiro', 'pix', 'cartao', 'transferencia')),
        comprovante_url TEXT,
        observacoes TEXT,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'confirmado', 'cancelado')),
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campanha_id) REFERENCES campanhas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de configurações
    await runAsync(`
      CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chave TEXT UNIQUE NOT NULL,
        valor TEXT,
        descricao TEXT,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criar tabela de configurações da igreja
    await runAsync(`
      CREATE TABLE IF NOT EXISTS configuracoes_igreja (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_igreja TEXT NOT NULL DEFAULT 'Minha Igreja',
        cnpj TEXT,
        endereco TEXT,
        telefone TEXT,
        email TEXT,
        site TEXT,
        logo_url TEXT,
        
        banco_nome TEXT,
        banco_codigo TEXT,
        agencia TEXT,
        conta TEXT,
        titular TEXT,
        
        pix_tipo TEXT DEFAULT 'email',
        pix_chave TEXT,
        pix_qrcode_url TEXT,
        
        email_notificacao TEXT,
        smtp_host TEXT,
        smtp_port INTEGER DEFAULT 587,
        smtp_user TEXT,
        smtp_password TEXT,
        smtp_secure INTEGER DEFAULT 0,
        
        mensagem_boas_vindas TEXT,
        rodape_recibo TEXT,
        
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Banco SQLite inicializado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco SQLite:', error);
    throw error;
  }
}

// Função para executar queries
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Função para executar insert/update/delete
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ 
          insertId: this.lastID, 
          affectedRows: this.changes 
        });
      }
    });
  });
}

// Inicializar database na inicialização
initializeDatabase();

// Exportar funções para compatibilidade com MySQL
module.exports = {
  execute: (sql, params) => {
    if (sql.toLowerCase().includes('select')) {
      return query(sql, params).then(rows => [rows]);
    } else {
      return run(sql, params).then(result => [result]);
    }
  },
  query,
  run,
  db
};