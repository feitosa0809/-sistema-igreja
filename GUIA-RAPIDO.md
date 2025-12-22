# 🎯 Guia Rápido de Uso - Sistema de Gestão Financeira

## ⚡ Início Rápido (3 minutos)

### 1. Instalar e Iniciar
```bash
cd backend
npm install
npm start
```

### 2. Acessar
Abra: `http://localhost:3000`

### 3. Primeiro Login
- Cadastre-se (primeiro usuário = admin)
- Configure a igreja em ⚙️ **Configurações**

---

## 👤 Como Usar (Membros)

### Registrar um Dízimo

1. **Login** → Menu lateral → **💰 Meus Dízimos**
2. Clique em **"Novo Dízimo"**
3. Preencha:
   - Valor
   - Data do pagamento
   - Método (PIX, Dinheiro, etc.)
   - Envie comprovante (opcional)
4. Clique em **"Registrar"**
5. Aguarde confirmação do tesoureiro

### Ver Histórico

- **Meus Dízimos** → Veja todos os seus pagamentos
- Filtre por período ou status
- Baixe comprovantes

---

## 👨‍💼 Como Usar (Tesoureiro/Admin)

### Confirmar Pagamentos

1. **💰 Pagamentos** → Veja pendentes
2. Clique em **"Ver Detalhes"**
3. Verifique comprovante
4. Clique **"Confirmar"** ou **"Cancelar"**
5. Email automático enviado ao membro ✅

### Gerar Relatórios

1. **📊 Relatórios**
2. Escolha tipo:
   - Por período
   - Por método de pagamento
   - Por usuário
3. **"Gerar Relatório"**
4. **"Exportar PDF"** (opcional)

### Ver Dashboard

- **📈 Dashboard** → Visão geral:
  - Total arrecadado
  - Gráficos de contribuições
  - Estatísticas mensais
  - Top contribuintes

---

## 👥 Gerenciar Usuários (Admin)

### Criar Novo Usuário

1. **👥 Gerenciar Usuários**
2. **"➕ Novo Usuário"**
3. Preencha dados
4. Escolha tipo:
   - **Membro**: Doar e ver próprios dízimos
   - **Tesoureiro**: Confirmar pagamentos
   - **Pastor**: Relatórios e emails
   - **Admin**: Acesso total

### Promover Usuário

1. **Gerenciar Usuários** → Busque o usuário
2. **"✏️ Editar"**
3. Altere **"Tipo de Usuário"**
4. **"Salvar"**

---

## 🔔 Enviar Notificações (Admin/Pastor)

### Email de Aniversário

1. **🔔 Notificações**
2. **"Enviar Emails de Aniversário"**
3. Sistema envia automaticamente para aniversariantes do dia 🎂

### Email Personalizado

1. **🔔 Notificações**
2. Role até **"Email Personalizado"**
3. Adicione destinatários (um por vez)
4. Digite assunto e mensagem
5. **"Enviar Email Personalizado"**

### Configurar SMTP

1. **⚙️ Configurações**
2. Role até **"Configurações de E-mail"**
3. Preencha:
   - Servidor SMTP (ex: smtp.gmail.com)
   - Porta (587 ou 465)
   - Usuário e senha
4. **"Salvar"**
5. Teste em **Notificações** → **"Testar Conexão SMTP"**

---

## 🎂 Aniversariantes

### Ver Aniversariantes

1. **🎂 Aniversariantes**
2. Veja:
   - **Hoje**: Aniversariantes de hoje
   - **Mês Atual**: Todos do mês
   - **Próximos 30 dias**

### Envio Automático

- Sistema envia emails **automaticamente às 8h** da manhã
- Para envio manual: **Notificações** → **"Enviar Emails de Aniversário"**

---

## ⚙️ Configurações da Igreja

### Dados Gerais

- Nome da igreja
- CNPJ
- Endereço completo
- Telefone e email
- Site

### Dados Bancários

- Nome do banco
- Agência e conta
- Titular da conta

### PIX

- Tipo de chave (CPF, CNPJ, Email, Telefone)
- Chave PIX
- QR Code (URL da imagem)

### Email (SMTP)

- Servidor SMTP
- Porta
- Usuário e senha
- Email para notificações

---

## 💾 Backup e Segurança

### Backup Automático

- **Ativo por padrão**: A cada 24 horas
- Salvo em: `backend/backups/`
- Mantém últimos 30 backups

### Backup Manual

1. **⚙️ Configurações**
2. Role até **"Backup do Sistema"**
3. **"Fazer Backup Agora"**
4. Arquivo salvo em `backend/backups/`

### Restaurar Backup

```bash
# Copie um backup para substituir o banco atual
cp backend/backups/backup-2025-01-15.sqlite backend/database.sqlite
```

---

## 📱 Atalhos Importantes

| Função | Atalho/Link |
|--------|-------------|
| Dashboard | `/dashboard.html` |
| Meus Dízimos | `/pagamentos.html` |
| Relatórios | `/relatorios.html` |
| Notificações | `/notificacoes.html` |
| Aniversariantes | `/aniversariantes.html` |
| Configurações | `/configuracoes.html` |
| Gerenciar Usuários | `/admin.html` |

---

## 🔐 Tipos de Permissão

### Membro
- ✅ Ver próprios dízimos
- ✅ Registrar novos dízimos
- ✅ Editar perfil
- ❌ Confirmar pagamentos
- ❌ Ver relatórios gerais

### Tesoureiro
- ✅ Tudo que membro pode
- ✅ Confirmar/cancelar pagamentos
- ✅ Ver relatórios financeiros
- ✅ Exportar relatórios
- ❌ Gerenciar usuários

### Pastor
- ✅ Tudo que tesoureiro pode
- ✅ Ver aniversariantes
- ✅ Enviar emails
- ✅ Ver todos os relatórios
- ❌ Gerenciar usuários

### Admin
- ✅ Acesso total ao sistema
- ✅ Gerenciar usuários
- ✅ Alterar configurações
- ✅ Fazer backups

---

## ⚠️ Problemas Comuns

### "Não consigo fazer login"
- Verifique email e senha
- Use **"Esqueci minha senha"** (se configurado)
- Contate o administrador

### "Email não está sendo enviado"
- Verifique configuração SMTP em **Configurações**
- Teste em **Notificações** → **"Testar SMTP"**
- Para Gmail, use **Senha de App** (não a senha normal)

### "Comprovante não carrega"
- Formatos aceitos: JPG, PNG, PDF
- Tamanho máximo: 10MB
- Tente novamente ou use outro arquivo

### "Relatório está vazio"
- Verifique se há dados no período
- Tente outro intervalo de datas
- Verifique se há dízimos confirmados

---

## 💡 Dicas Úteis

1. **Confirmação de Dízimos**: Sempre confirme assim que verificar o pagamento
2. **Comprovantes**: Incentive membros a enviarem comprovantes
3. **Backups**: Baixe backups importantes periodicamente
4. **Relatórios**: Exporte relatórios mensais para arquivo
5. **Emails**: Configure SMTP para comunicação automática

---

## 📞 Precisa de Ajuda?

### Documentação Completa
Veja: `INSTALACAO.md` para guia detalhado

### Verificar Status do Sistema
Acesse: `http://localhost:3000/api/health`

### Logs de Erro
Verifique o terminal onde o servidor está rodando

---

**Que Deus abençoe o ministério! 🙏**
