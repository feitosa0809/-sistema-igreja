# 🔄 CHANGELOG - Sistema de Gestão Financeira para Igrejas

## [2.0.1] - 2026-02-23

### 🔐 Correções
- Normalização de email no login e cadastro (`trim` + lowercase) para evitar falhas por espaços e caixa alta
- Validação adicional para rejeitar email vazio com mensagem explícita na API de autenticação

### 🧹 Limpeza do Projeto
- Removidos arquivos auxiliares Windows (`.bat`) não essenciais para execução via Node/NPM
- Removidos documentos técnicos/operacionais redundantes que não impactam o funcionamento da aplicação

### 📝 Documentação
- `README.md` atualizado para fluxo único de execução manual (`npm start`)
- `INSTALACAO.md` atualizado com comandos válidos do projeto (remoção de referências antigas)
- Removidas referências a arquivos excluídos na documentação

### ✅ Compatibilidade
- Backend e frontend mantidos sem alteração funcional fora da autenticação
- Execução principal preservada em `node backend/server.js` e `npm start`

## [2.0.0] - 2026-02-17

### 🎉 Principais Adições

#### Novos Módulos Completos
- ✨ **Módulo de Despesas** - Controle total de gastos da igreja
- ✨ **Gestão de Fornecedores** - Cadastro e controle de fornecedores
- ✨ **Sistema de Orçamento** - Planejamento financeiro anual/mensal
- ✨ **Sistema de Metas** - Acompanhamento de objetivos financeiros
- ✨ **Módulo de Membros** - Gestão completa de membros da igreja
- ✨ **Logs de Auditoria** - Rastreamento completo de ações
- ✨ **Autenticação 2FA** - Segurança adicional com dois fatores

#### Novas Funcionalidades
- ✨ Exportação para Excel (receitas, despesas, membros, relatórios)
- ✨ Tema claro/escuro alternável
- ✨ Comparativo orçado vs realizado
- ✨ Estatísticas avançadas por categoria
- ✨ Upload de comprovantes (despesas e pagamentos)
- ✨ Aniversariantes do mês
- ✨ Backup codes para recuperação 2FA
- ✨ Gráficos interativos com Chart.js

### 🗄️ Banco de Dados
#### Novas Tabelas
- `despesas` - Controle de despesas
- `fornecedores` - Cadastro de fornecedores
- `orcamentos` - Planejamento orçamentário
- `orcamento_itens` - Itens do orçamento
- `logs_auditoria` - Auditoria de ações
- `membros` - Cadastro de membros
- `metas` - Metas financeiras
- `usuario_2fa` - Configuração de 2FA

#### Novos Índices
- Otimização de consultas por data
- Índices em categorias e status
- Melhoria de performance em relatórios

### 🔧 API - Novos Endpoints

#### Despesas (14 endpoints)
- `GET /api/despesas` - Listar com filtros
- `POST /api/despesas` - Criar despesa
- `PUT /api/despesas/:id` - Atualizar
- `DELETE /api/despesas/:id` - Deletar
- `POST /api/despesas/:id/pagar` - Marcar como pago
- `GET /api/despesas/stats/resumo` - Estatísticas

#### Fornecedores (5 endpoints)
- CRUD completo de fornecedores
- Estatísticas de gastos por fornecedor

#### Orçamento (7 endpoints)
- Criação e gestão de orçamentos
- Comparativo orçado vs realizado
- Atualização de valores realizados

#### Metas (8 endpoints)
- Gestão de metas financeiras
- Atualização de progresso
- Estatísticas de metas

#### Membros (7 endpoints)
- CRUD completo com upload de foto
- Aniversariantes do mês
- Estatísticas de membros

#### Auditoria (3 endpoints)
- Listagem de logs com filtros
- Estatísticas de atividades
- Exportação em CSV

#### 2FA (6 endpoints)
- Ativar/desativar 2FA
- Geração de QR Code
- Validação de tokens
- Regeneração de backup codes

#### Exportação (4 endpoints)
- Exportar receitas para Excel
- Exportar despesas para Excel
- Exportar membros para Excel
- Relatório completo multi-abas

### 📦 Dependências Adicionadas
```json
{
  "exceljs": "^4.4.0",
  "speakeasy": "^2.0.0",
  "qrcode": "^1.5.3",
  "excel4node": "^1.8.2"
}
```

### 🎨 Frontend

#### Novas Páginas
- `despesas.html` - Gestão de despesas
- `orcamento.html` - Planejamento orçamentário
- Interface preparada para metas e membros

#### Novos Scripts JavaScript
- `despesas.js` - Lógica de despesas
- `orcamento.js` - Lógica de orçamento
- `theme.js` - Gerenciador de temas

#### Novos Estilos
- `theme-dark.css` - Tema escuro completo
- Transições suaves entre temas
- Scrollbar customizada

### 🔒 Segurança

#### Melhorias de Segurança
- ✅ Autenticação de dois fatores (TOTP)
- ✅ Backup codes para recuperação
- ✅ Logs completos de auditoria
- ✅ Rastreamento de todas as ações
- ✅ Upload seguro de arquivos com validação
- ✅ Proteção contra CSRF mantida

#### Auditoria
- Registro automático de CREATE, UPDATE, DELETE
- Rastreamento de usuário e timestamp
- Detalhes em JSON de cada ação
- Filtros avançados para consulta

### 📊 Relatórios e Exportação

#### Exportação Excel
- Formatação automática de moeda
- Cabeçalhos coloridos por tipo
- Fórmulas para totais automáticos
- Múltiplas abas em relatórios completos
- Filtros customizáveis

#### Novos Gráficos
- Evolução orçado vs realizado
- Gráficos de pizza por categoria
- Visualização de metas e progresso

### 🚀 Performance

#### Otimizações
- Índices adicionados em campos chave
- Consultas otimizadas com JOINs eficientes
- Cache de configurações
- Lazy loading de imagens

### 📱 Responsividade
- Todas as novas páginas 100% responsivas
- Otimizado para mobile, tablet e desktop
- Cards e tabelas adaptativas

### 🔧 Infraestrutura

#### Scripts Novos
- `atualizar-sistema.bat` - Instalação automatizada
- `npm run migrate` - Executar migrations
- Migration única consolidada

#### Documentação
- `NOVAS-FUNCIONALIDADES.md` - Documentação completa
- `CHANGELOG.md` - Histórico de mudanças
- Comentários aprimorados no código

### 🐛 Correções
- Ajustes em validações de formulários
- Melhorias em mensagens de erro
- Tratamento de erros aprimorado em uploads

### 🎯 Próximas Versões (Planejado)

#### v2.1.0 (Março 2026)
- Dashboard executivo avançado
- Gráficos de previsão e tendências
- Relatórios personalizáveis
- Páginas de Metas e Membros completas

#### v2.2.0 (Abril 2026)
- Integração com PIX QR Code dinâmico
- Integração com Mercado Pago/PagSeguro
- WhatsApp Business API
- Notificações push PWA

#### v2.3.0 (Maio 2026)
- Reconciliação bancária (OFX/CSV)
- App mobile híbrido
- Certificados digitais para membros
- Controle de presença

---

## [1.0.0] - 2025-12-21

### Lançamento Inicial
- Sistema completo de gestão de dízimos e ofertas
- Autenticação JWT
- 4 níveis de permissão
- Dashboard com gráficos
- Relatórios em PDF
- Sistema de backup automático
- Envio de emails
- Aniversariantes automático
- PWA básico

---

**Total de Endpoints:** 80+  
**Total de Tabelas:** 15  
**Linhas de Código:** 15.000+  
**Tecnologias:** Node.js, Express, SQLite, Bootstrap 5, Chart.js  

🎉 **Sistema 100% funcional e pronto para uso!**
