-- Tabela de Despesas
CREATE TABLE IF NOT EXISTS despesas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor REAL NOT NULL,
  data_despesa DATE NOT NULL,
  data_vencimento DATE,
  data_pagamento DATE,
  forma_pagamento TEXT DEFAULT 'dinheiro',
  fornecedor_id INTEGER,
  comprovante TEXT,
  observacoes TEXT,
  observacoes_pagamento TEXT,
  status TEXT DEFAULT 'pendente',
  usuario_id INTEGER NOT NULL,
  aprovado_por INTEGER,
  valor_pago REAL,
  recorrente INTEGER DEFAULT 0,
  numero_parcelas INTEGER,
  parcela_atual INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
  FOREIGN KEY (aprovado_por) REFERENCES usuarios(id)
);

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  tipo_servico TEXT,
  observacoes TEXT,
  ativo INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ano INTEGER NOT NULL,
  mes INTEGER,
  descricao TEXT,
  total_receita REAL DEFAULT 0,
  total_despesa REAL DEFAULT 0,
  saldo_previsto REAL DEFAULT 0,
  criado_por INTEGER NOT NULL,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- Tabela de Itens do Orçamento
CREATE TABLE IF NOT EXISTS orcamento_itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orcamento_id INTEGER NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL,
  valor_previsto REAL NOT NULL,
  valor_realizado REAL DEFAULT 0,
  percentual_executado REAL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE CASCADE
);

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  acao TEXT NOT NULL,
  tabela TEXT NOT NULL,
  registro_id INTEGER,
  detalhes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS membros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  nome_completo TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  data_nascimento DATE,
  telefone TEXT,
  celular TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  estado_civil TEXT,
  profissao TEXT,
  data_batismo DATE,
  data_membro DATE,
  cargo TEXT,
  departamento TEXT,
  foto TEXT,
  observacoes TEXT,
  ativo INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de Metas
CREATE TABLE IF NOT EXISTS metas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL,
  valor_meta REAL NOT NULL,
  valor_atual REAL DEFAULT 0,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status TEXT DEFAULT 'ativa',
  categoria TEXT,
  criado_por INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- Tabela de Configurações 2FA
CREATE TABLE IF NOT EXISTS usuario_2fa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  ativo INTEGER DEFAULT 0,
  backup_codes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_despesas_data ON despesas(data_despesa);
CREATE INDEX IF NOT EXISTS idx_despesas_categoria ON despesas(categoria);
CREATE INDEX IF NOT EXISTS idx_despesas_status ON despesas(status);
CREATE INDEX IF NOT EXISTS idx_despesas_fornecedor ON despesas(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_tabela ON logs_auditoria(tabela);
CREATE INDEX IF NOT EXISTS idx_logs_data ON logs_auditoria(created_at);
CREATE INDEX IF NOT EXISTS idx_membros_ativo ON membros(ativo);
CREATE INDEX IF NOT EXISTS idx_orcamentos_ano ON orcamentos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_metas_status ON metas(status);

-- Inserir categorias padrão de despesas (se não existirem)
INSERT OR IGNORE INTO configuracoes (chave, valor, descricao)
VALUES 
  ('categorias_despesas', '["Manutenção", "Energia Elétrica", "Água", "Internet", "Telefone", "Material de Limpeza", "Material de Escritório", "Alimentação", "Transporte", "Salários", "Encargos", "Impostos", "Equipamentos", "Reformas", "Eventos", "Missões", "Ação Social", "Outros"]', 'Categorias de despesas disponíveis'),
  ('categorias_orcamento', '["Dízimos", "Ofertas", "Doações", "Eventos", "Outros"]', 'Categorias de receitas para orçamento');
