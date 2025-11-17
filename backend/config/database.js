const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dizimo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Função para criar as tabelas
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Criar tabela de usuários
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        endereco TEXT,
        tipo_usuario ENUM('membro', 'tesoureiro', 'pastor', 'admin') DEFAULT 'membro',
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de dízimos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS dizimos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data_pagamento DATE NOT NULL,
        metodo_pagamento ENUM('dinheiro', 'pix', 'cartao', 'transferencia') NOT NULL,
        comprovante_url VARCHAR(500),
        observacoes TEXT,
        status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
        confirmado_por INT,
        data_confirmacao TIMESTAMP NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (confirmado_por) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de ofertas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ofertas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        valor DECIMAL(10,2) NOT NULL,
        data_oferta DATE NOT NULL,
        tipo_oferta VARCHAR(100) NOT NULL,
        metodo_pagamento ENUM('dinheiro', 'pix', 'cartao', 'transferencia') NOT NULL,
        comprovante_url VARCHAR(500),
        observacoes TEXT,
        status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de campanhas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS campanhas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        meta_valor DECIMAL(10,2),
        valor_arrecadado DECIMAL(10,2) DEFAULT 0,
        data_inicio DATE NOT NULL,
        data_fim DATE,
        status ENUM('ativa', 'finalizada', 'cancelada') DEFAULT 'ativa',
        criado_por INT NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de contribuições para campanhas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contribuicoes_campanha (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campanha_id INT NOT NULL,
        usuario_id INT,
        valor DECIMAL(10,2) NOT NULL,
        data_contribuicao DATE NOT NULL,
        metodo_pagamento ENUM('dinheiro', 'pix', 'cartao', 'transferencia') NOT NULL,
        comprovante_url VARCHAR(500),
        observacoes TEXT,
        status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campanha_id) REFERENCES campanhas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      )
    `);

    // Criar tabela de configurações
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS configuracoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chave VARCHAR(100) UNIQUE NOT NULL,
        valor TEXT,
        descricao TEXT,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    connection.release();
    console.log('✅ Database inicializado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar database:', error);
  }
}

// Inicializar database na inicialização
initializeDatabase();

module.exports = pool;