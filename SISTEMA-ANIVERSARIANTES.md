# 🎂 Sistema de Aniversariantes

## ✨ Nova Funcionalidade Implementada

Sistema completo de gerenciamento de aniversariantes para a igreja, incluindo:

### 📋 **Recursos Implementados**

#### 1. **Campo Data de Nascimento**
- ✅ Adicionado no cadastro de usuários
- ✅ Campo opcional no formulário de registro
- ✅ Armazenado no banco de dados SQLite

#### 2. **API de Aniversariantes** (`/api/birthdays`)
- ✅ `GET /month/:mes` - Lista aniversariantes do mês
- ✅ `GET /today` - Aniversariantes de hoje
- ✅ `GET /upcoming` - Próximos 7 dias
- ✅ `GET /stats` - Estatísticas por mês

#### 3. **Página Web Completa** (`aniversariantes.html`)
- ✅ Design bonito e responsivo
- ✅ Aniversariantes de hoje (destaque especial)
- ✅ Próximos 7 dias
- ✅ Seletor de mês (todos os 12 meses)
- ✅ Exibição de idade calculada automaticamente
- ✅ Cards coloridos e animados
- ✅ Estatísticas em tempo real

---

## 🚀 **Como Usar**

### **1. Migrar Banco Existente**

Se você já tem usuários cadastrados, execute:

```powershell
cd backend\migrations
node migrate.js
```

Isso adiciona a coluna `data_nascimento` sem perder dados existentes.

### **2. Cadastrar Novo Usuário**

1. Acesse a página de registro
2. Preencha todos os campos incluindo **Data de Nascimento**
3. Complete o cadastro normalmente

### **3. Visualizar Aniversariantes**

**Opção 1:** Menu Principal
- No sistema, clique em "Aniversariantes" no menu superior

**Opção 2:** Admin
- No painel admin, clique em "Aniversariantes" no menu lateral

**Opção 3:** Direto
- Acesse: `http://localhost:3001/aniversariantes.html`

---

## 📊 **Funcionalidades da Tela**

### **Dashboard de Estatísticas**
```
┌─────────────────────────────────────────┐
│  Aniversariantes Hoje    │     2        │
│  Neste Mês               │    15        │
│  Próximos 7 Dias         │     5        │
└─────────────────────────────────────────┘
```

### **Aniversariantes de Hoje**
- 🎂 Destaque especial com badge "HOJE!"
- 🎉 Ícone de bolo de aniversário
- 📧 Email do aniversariante
- 📱 Telefone (se cadastrado)
- 🎁 Idade calculada automaticamente

### **Próximos 7 Dias**
- 🎈 Lista dos próximos aniversários
- 📅 Quantos dias faltam
- 👤 Informações de contato

### **Seletor de Mês**
- 📆 12 botões (Janeiro a Dezembro)
- ✨ Mês atual destacado
- 🔄 Clique para trocar de mês
- 📋 Lista completa de aniversariantes

---

## 🎨 **Layout da Página**

```
╔══════════════════════════════════════════════╗
║  🏛️ Sistema Igreja - Aniversariantes        ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📊 ESTATÍSTICAS                             ║
║  [Hoje] [Este Mês] [Próximos 7 Dias]        ║
║                                              ║
║  🎉 ANIVERSARIANTES DE HOJE                  ║
║  ┌──────────────────────────────────────┐   ║
║  │ 🎂 João Silva            32 anos     │   ║
║  │ 📧 joao@email.com                    │   ║
║  └──────────────────────────────────────┘   ║
║                                              ║
║  📅 PRÓXIMOS 7 DIAS                          ║
║  ┌──────────────────────────────────────┐   ║
║  │ 🎈 Maria Santos (em 3 dias)          │   ║
║  └──────────────────────────────────────┘   ║
║                                              ║
║  🗓️ SELETOR DE MÊS                           ║
║  [Jan][Fev][Mar][Abr][Mai][Jun]...          ║
║                                              ║
║  📋 ANIVERSARIANTES DE NOVEMBRO              ║
║  ┌──────────────────────────────────────┐   ║
║  │ 🎉 Pedro Costa - 05/11  28 anos      │   ║
║  │ 🎉 Ana Lima - 15/11     42 anos      │   ║
║  │ 🎉 Carlos Souza - 25/11 35 anos      │   ║
║  └──────────────────────────────────────┘   ║
╚══════════════════════════════════════════════╝
```

---

## 💾 **Estrutura do Banco de Dados**

### **Tabela: usuarios**
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  data_nascimento DATE,  -- ← NOVO CAMPO
  tipo_usuario TEXT DEFAULT 'membro',
  status TEXT DEFAULT 'ativo',
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 **Endpoints da API**

### **1. Aniversariantes do Mês**
```http
GET /api/birthdays/month/:mes
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "mes": 11,
  "total": 3,
  "aniversariantes": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(11) 99999-9999",
      "data_nascimento": "1990-11-15",
      "dia": 15,
      "idade": 35
    }
  ]
}
```

### **2. Aniversariantes de Hoje**
```http
GET /api/birthdays/today
Authorization: Bearer {token}
```

### **3. Próximos 7 Dias**
```http
GET /api/birthdays/upcoming
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "total": 2,
  "aniversariantes": [
    {
      "id": 2,
      "nome": "Maria Santos",
      "dia": 18,
      "mes": 11,
      "idade": 28,
      "dias_restantes": 1
    }
  ]
}
```

### **4. Estatísticas**
```http
GET /api/birthdays/stats
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "total_geral": 45,
  "por_mes": [
    {
      "mes": 1,
      "nome_mes": "Janeiro",
      "total_aniversariantes": 4
    },
    ...
  ]
}
```

---

## 🎯 **Casos de Uso**

### **1. Pastor/Secretária**
- Ver aniversariantes do dia pela manhã
- Enviar mensagens de parabéns
- Planejar culto de aniversariantes do mês

### **2. Tesoureiro**
- Verificar aniversários próximos
- Organizar presentes/lembranças
- Relatórios mensais

### **3. Membros**
- Ver aniversários dos irmãos
- Parabenizar colegas da igreja
- Participar das celebrações

---

## 🎨 **Customização**

### **Cores do Tema**
```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cards de aniversariantes */
.birthday-person {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### **Ícones**
- 🎂 Aniversário hoje
- 🎈 Próximos aniversários
- 🎉 Aniversariantes do mês
- 🎁 Idade

---

## 📱 **Responsividade**

✅ **Desktop** - Layout completo com 3 colunas de estatísticas
✅ **Tablet** - Layout adaptado com 2 colunas
✅ **Mobile** - Layout empilhado, 1 coluna, touch-friendly

---

## 🔐 **Segurança**

- ✅ Autenticação JWT obrigatória
- ✅ Apenas usuários logados podem ver
- ✅ Data de nascimento opcional no cadastro
- ✅ Privacidade dos dados respeitada

---

## 🚀 **Testes**

### **Testar Localmente**

1. **Iniciar Backend:**
```powershell
cd backend
npm start
```

2. **Iniciar Frontend:**
```powershell
cd frontend
http-server -p 3001
```

3. **Acessar:**
```
http://localhost:3001/aniversariantes.html
```

### **Testar API**

```powershell
# Obter token de autenticação
$token = "seu_token_aqui"

# Testar aniversariantes de hoje
Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/today" `
  -Headers @{"Authorization"="Bearer $token"}

# Testar aniversariantes do mês
Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/month/11" `
  -Headers @{"Authorization"="Bearer $token"}
```

---

## 📝 **Próximas Melhorias**

### **Sugestões para Futuro:**
- [ ] Envio automático de emails de parabéns
- [ ] Notificações push no dia do aniversário
- [ ] Integração com WhatsApp para mensagens
- [ ] Relatório PDF de aniversariantes do mês
- [ ] Exportar lista para Excel
- [ ] Adicionar fotos dos aniversariantes
- [ ] Sistema de presentes/ofertas especiais
- [ ] Histórico de aniversários celebrados

---

## 🎉 **Conclusão**

Sistema completo de aniversariantes implementado com sucesso! Agora a igreja pode:

✅ Acompanhar todos os aniversários dos membros
✅ Celebrar e parabenizar adequadamente
✅ Fortalecer os laços da comunidade
✅ Ter relatórios e estatísticas organizadas

**Desenvolvido com ❤️ para as igrejas**