# 🧪 GUIA DE TESTE - Sistema Dízimo v2.0

## 📋 Checklist Completo de Testes

Este guia permite testar todas as funcionalidades implementadas na versão 2.0.

---

## 🚀 PREPARAÇÃO

### 1. Atualizar o Sistema
```bash
# Execute:
atualizar-sistema.bat
```

### 2. Iniciar o Servidor
```bash
# Execute:
iniciar-sistema.bat
```

### 3. Acessar o Sistema
```
http://localhost:3000
```

### 4. Fazer Login
```
Email: admin@igreja.com
Senha: admin123
```

---

## ✅ TESTES POR MÓDULO

### 1️⃣ MÓDULO DE DESPESAS

**Página:** `http://localhost:3000/despesas.html`

#### Testes a Realizar:

- [ ] **Visualizar Dashboard de Despesas**
  - Verificar cards de estatísticas (Total Pago, Pendente, Vencido, Total Geral)
  - Valores devem estar em R$ 0,00 inicialmente

- [ ] **Criar Nova Despesa**
  1. Clicar em "Nova Despesa"
  2. Preencher formulário:
     - Descrição: "Conta de Luz"
     - Categoria: "Energia Elétrica"
     - Valor: 500.00
     - Data: Data atual
     - Forma de Pagamento: PIX
  3. Salvar
  4. ✅ Verificar se apareceu na lista

- [ ] **Upload de Comprovante**
  1. Criar despesa
  2. Fazer upload de uma imagem ou PDF
  3. ✅ Verificar ícone de comprovante na listagem

- [ ] **Filtrar Despesas**
  - Filtrar por categoria
  - Filtrar por mês
  - Filtrar por status
  - ✅ Resultados devem atualizar

- [ ] **Marcar como Pago**
  1. Clicar no botão verde (✓) em uma despesa pendente
  2. Informar valor pago
  3. ✅ Status deve mudar para "PAGO"
  4. ✅ Estatísticas devem atualizar

- [ ] **Editar Despesa**
  1. Clicar no botão azul (✏️)
  2. Modificar descrição
  3. Salvar
  4. ✅ Mudanças devem aparecer

- [ ] **Excluir Despesa**
  1. Clicar no botão vermelho (🗑️)
  2. Confirmar
  3. ✅ Despesa deve sumir

---

### 2️⃣ GESTÃO DE FORNECEDORES

**Acesso:** Dentro de `despesas.html`, botão "Fornecedores"

#### Testes a Realizar:

- [ ] **Listar Fornecedores**
  - Abrir modal de fornecedores
  - Verificar listagem vazia ou com fornecedores

- [ ] **Criar Fornecedor**
  1. Clicar "Novo Fornecedor"
  2. Preencher:
     - Nome: "Eletricidade Ltda"
     - CNPJ: "12.345.678/0001-90"
     - Telefone: "(11) 1234-5678"
     - Email: "contato@eletricidade.com"
     - Tipo: "Energia Elétrica"
  3. Salvar
  4. ✅ Deve aparecer na lista

- [ ] **Usar Fornecedor em Despesa**
  1. Criar nova despesa
  2. Selecionar fornecedor criado
  3. Salvar
  4. ✅ Nome do fornecedor deve aparecer na listagem

---

### 3️⃣ SISTEMA DE ORÇAMENTO

**Página:** `http://localhost:3000/orcamento.html`

#### Testes a Realizar:

- [ ] **Criar Orçamento Anual**
  1. Clicar "Novo Orçamento"
  2. Configurar:
     - Ano: 2026
     - Mês: (deixar vazio para anual)
     - Descrição: "Orçamento 2026"
  3. Adicionar Receitas:
     - Dízimos: R$ 50.000
     - Ofertas: R$ 20.000
  4. Adicionar Despesas:
     - Salários: R$ 30.000
     - Manutenção: R$ 15.000
  5. Salvar
  6. ✅ Verificar totais no preview
  7. ✅ Verificar na listagem

- [ ] **Visualizar Gráficos**
  - ✅ Gráfico de linha (evolução)
  - ✅ Gráfico de pizza (categorias)
  - ✅ Valores corretos nos gráficos

- [ ] **Filtrar por Ano**
  - Selecionar ano diferente
  - ✅ Listagem deve atualizar

- [ ] **Ver Comparativo**
  - Clicar em "Comparativo" de um orçamento
  - ✅ Ver orçado vs realizado (em desenvolvimento)

---

### 4️⃣ SISTEMA DE METAS

**API Pronta - Frontend em Desenvolvimento**

#### Testes via API (Postman/Thunder Client):

- [ ] **Criar Meta**
  ```
  POST http://localhost:3000/api/metas
  Headers: Authorization: Bearer {seu_token}
  Body:
  {
    "titulo": "Meta de Arrecadação 2026",
    "tipo": "receita",
    "valor_meta": 100000,
    "data_inicio": "2026-01-01",
    "data_fim": "2026-12-31",
    "categoria": "Dízimos"
  }
  ```
  ✅ Status 201

- [ ] **Atualizar Progresso**
  ```
  PUT http://localhost:3000/api/metas/1/progresso
  Body:
  {
    "valor_atual": 50000
  }
  ```
  ✅ Status 200
  ✅ Percentual atualizado

- [ ] **Listar Metas**
  ```
  GET http://localhost:3000/api/metas
  ```
  ✅ Lista com metas criadas

---

### 5️⃣ GESTÃO DE MEMBROS

**API Pronta - Frontend em Desenvolvimento**

#### Testes via API:

- [ ] **Criar Membro**
  ```
  POST http://localhost:3000/api/membros
  Headers: 
    Authorization: Bearer {seu_token}
    Content-Type: multipart/form-data
  Body:
  {
    "nome_completo": "João da Silva",
    "cpf": "123.456.789-00",
    "data_nascimento": "1990-05-15",
    "telefone": "(11) 98765-4321",
    "email": "joao@email.com",
    "cargo": "Diácono",
    "departamento": "Louvor"
  }
  ```
  ✅ Status 201

- [ ] **Listar Membros**
  ```
  GET http://localhost:3000/api/membros
  ```
  ✅ Lista com membros

- [ ] **Aniversariantes do Mês**
  ```
  GET http://localhost:3000/api/membros/aniversariantes/mes?mes=05
  ```
  ✅ Lista aniversariantes de maio

---

### 6️⃣ LOGS DE AUDITORIA

**Acesso:** Apenas para ADMIN via API

#### Testes via API:

- [ ] **Listar Logs**
  ```
  GET http://localhost:3000/api/auditoria
  ```
  ✅ Deve mostrar todas as ações realizadas

- [ ] **Filtrar por Tabela**
  ```
  GET http://localhost:3000/api/auditoria?tabela=despesas
  ```
  ✅ Apenas logs de despesas

- [ ] **Filtrar por Ação**
  ```
  GET http://localhost:3000/api/auditoria?acao=CREATE
  ```
  ✅ Apenas criações

- [ ] **Exportar Logs CSV**
  ```
  GET http://localhost:3000/api/auditoria/export?data_inicio=2026-02-01&data_fim=2026-02-28
  ```
  ✅ Baixar arquivo CSV

- [ ] **Estatísticas**
  ```
  GET http://localhost:3000/api/auditoria/stats
  ```
  ✅ Resumo de atividades

---

### 7️⃣ AUTENTICAÇÃO 2FA

**Página:** `http://localhost:3000/perfil.html` (ou via API)

#### Testes via API:

- [ ] **Ativar 2FA**
  ```
  POST http://localhost:3000/api/2fa/enable
  Headers: Authorization: Bearer {seu_token}
  ```
  ✅ Retorna QR Code e backup codes

- [ ] **Verificar Token**
  1. Escanear QR Code com Google Authenticator
  2. Pegar código de 6 dígitos
  3. Enviar:
  ```
  POST http://localhost:3000/api/2fa/verify
  Headers: Authorization: Bearer {seu_token}
  Body: { "token": "123456" }
  ```
  ✅ Status 200 e 2FA ativado

- [ ] **Verificar Status**
  ```
  GET http://localhost:3000/api/2fa/status
  ```
  ✅ Retorna { "enabled": true }

- [ ] **Desativar 2FA**
  ```
  POST http://localhost:3000/api/2fa/disable
  Body: {
    "senha": "sua_senha",
    "token": "codigo_do_app"
  }
  ```
  ✅ 2FA desativado

---

### 8️⃣ EXPORTAÇÃO EXCEL

#### Testes:

- [ ] **Exportar Receitas**
  ```
  GET http://localhost:3000/api/export/donations
  ```
  ✅ Baixar arquivo .xlsx com receitas

- [ ] **Exportar Despesas**
  ```
  GET http://localhost:3000/api/export/despesas?mes=02&ano=2026
  ```
  ✅ Baixar arquivo .xlsx com despesas filtradas

- [ ] **Exportar Membros**
  ```
  GET http://localhost:3000/api/export/membros
  ```
  ✅ Baixar arquivo .xlsx com membros

- [ ] **Relatório Completo**
  ```
  GET http://localhost:3000/api/export/relatorio-completo?mes=02&ano=2026
  ```
  ✅ Baixar arquivo com múltiplas abas

#### Verificações no Excel:
- [ ] Abrir arquivo baixado
- [ ] Verificar formatação de moeda (R$)
- [ ] Verificar cabeçalhos coloridos
- [ ] Verificar totais calculados
- [ ] Verificar múltiplas abas (relatório completo)

---

### 9️⃣ TEMA CLARO/ESCURO

**Qualquer Página**

#### Testes:

- [ ] **Alternar Tema**
  - Procurar ícone de lua/sol na navbar
  - Clicar para alternar
  - ✅ Tema deve mudar instantaneamente
  - ✅ Ícone deve mudar (lua ↔ sol)

- [ ] **Persistência**
  - Alterar para tema escuro
  - Fechar navegador
  - Abrir novamente
  - ✅ Tema escuro deve permanecer

- [ ] **Elementos Afetados**
  - ✅ Background
  - ✅ Cards
  - ✅ Tabelas
  - ✅ Modals
  - ✅ Forms
  - ✅ Navbar
  - ✅ Dropdowns

---

## 🎨 TESTES DE INTERFACE

### Responsividade

- [ ] **Desktop (1920x1080)**
  - Abrir em tela grande
  - ✅ Layout deve usar toda largura
  - ✅ Tabelas visíveis completas

- [ ] **Tablet (768x1024)**
  - Redimensionar navegador
  - ✅ Cards devem empilhar
  - ✅ Tabelas devem ter scroll horizontal

- [ ] **Mobile (375x667)**
  - Abrir DevTools (F12) → Device Mode
  - ✅ Menu hambúrguer
  - ✅ Cards em coluna única
  - ✅ Botões grandes e clicáveis

### Browsers

- [ ] **Chrome** - ✅ Funciona
- [ ] **Firefox** - ✅ Funciona
- [ ] **Edge** - ✅ Funciona
- [ ] **Safari** (se disponível) - ✅ Funciona

---

## 🔒 TESTES DE SEGURANÇA

### Autenticação

- [ ] **Acesso sem Login**
  - Limpar localStorage
  - Tentar acessar `/despesas.html`
  - ✅ Deve redirecionar para login

- [ ] **Token Expirado**
  - Modificar token no localStorage
  - Fazer requisição
  - ✅ Deve retornar erro 401

### Permissões

- [ ] **Usuário Comum**
  - Criar usuário tipo "membro"
  - Tentar deletar despesa
  - ✅ Deve retornar erro 403

- [ ] **Admin**
  - Login como admin
  - Acessar logs de auditoria
  - ✅ Deve funcionar

### Upload de Arquivos

- [ ] **Arquivo Permitido**
  - Upload de imagem JPG
  - ✅ Deve aceitar

- [ ] **Arquivo Não Permitido**
  - Upload de arquivo .exe
  - ✅ Deve rejeitar

- [ ] **Tamanho Máximo**
  - Upload de arquivo > 5MB
  - ✅ Deve rejeitar

---

## 📊 TESTES DE DADOS

### Validações

- [ ] **Campos Obrigatórios**
  - Tentar salvar despesa sem descrição
  - ✅ Deve mostrar erro

- [ ] **Formato de Email**
  - Cadastrar fornecedor com email inválido
  - ✅ Deve validar

- [ ] **Valores Numéricos**
  - Inserir texto em campo de valor
  - ✅ Deve validar

### Integridade

- [ ] **Relacionamentos**
  - Criar despesa com fornecedor
  - Buscar despesa
  - ✅ Nome do fornecedor deve aparecer

- [ ] **Cascata**
  - Deletar orçamento
  - Verificar se itens foram deletados
  - ✅ Cascade deve funcionar

---

## 📈 TESTES DE PERFORMANCE

- [ ] **Listagem Grande**
  - Criar 100+ despesas (via script)
  - Listar todas
  - ✅ Deve carregar em < 2 segundos

- [ ] **Filtros**
  - Aplicar múltiplos filtros
  - ✅ Deve responder rápido

- [ ] **Gráficos**
  - Carregar página de orçamento
  - ✅ Gráficos devem renderizar suavemente

---

## 🐛 TESTES DE ERRO

### Erros de Rede

- [ ] **Servidor Offline**
  - Parar servidor
  - Tentar criar despesa
  - ✅ Deve mostrar erro amigável

- [ ] **Timeout**
  - Requisição lenta
  - ✅ Deve mostrar loading

### Erros de Usuário

- [ ] **Dados Inválidos**
  - Enviar JSON malformado
  - ✅ Retornar erro 400

- [ ] **ID Inexistente**
  - Buscar despesa ID 999999
  - ✅ Retornar erro 404

---

## ✅ CHECKLIST FINAL

### Funcionalidades Principais

- [ ] ✅ Despesas funcionando 100%
- [ ] ✅ Fornecedores funcionando 100%
- [ ] ✅ Orçamento funcionando 100%
- [ ] ✅ Metas (API) funcionando 100%
- [ ] ✅ Membros (API) funcionando 100%
- [ ] ✅ Auditoria funcionando 100%
- [ ] ✅ 2FA funcionando 100%
- [ ] ✅ Exportação Excel funcionando 100%
- [ ] ✅ Tema Claro/Escuro funcionando 100%

### Documentação

- [ ] ✅ README.md atualizado
- [ ] ✅ NOVAS-FUNCIONALIDADES.md criado
- [ ] ✅ CHANGELOG.md atualizado
- [ ] ✅ RESUMO-IMPLEMENTACAO.md criado
- [ ] ✅ GUIA-TESTES.md criado

### Scripts

- [ ] ✅ atualizar-sistema.bat funciona
- [ ] ✅ iniciar-sistema.bat funciona
- [ ] ✅ npm run migrate funciona

---

## 🎯 RESULTADO ESPERADO

Após executar todos os testes, você deve ter:

✅ **100% das funcionalidades testadas**  
✅ **Todas APIs funcionando**  
✅ **Frontend responsivo**  
✅ **Exportação Excel operacional**  
✅ **2FA configurável**  
✅ **Auditoria registrando**  
✅ **Tema alternável**  
✅ **Sistema pronto para produção**

---

## 📞 SUPORTE

Se encontrar algum problema:

1. Verificar logs do servidor (console)
2. Verificar console do navegador (F12)
3. Conferir arquivo `NOVAS-FUNCIONALIDADES.md`
4. Verificar se migrations foram executadas

---

**Boa sorte com os testes! 🚀**
