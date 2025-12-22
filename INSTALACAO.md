# 📘 Guia Completo de Instalação - Sistema de Gestão Financeira de Igrejas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior) - [Download aqui](https://nodejs.org/)
- **Git** (opcional, para clonar o repositório)
- Um navegador web moderno (Chrome, Firefox, Edge)

## 🚀 Passo a Passo da Instalação

### 1. Preparar o Ambiente

1. **Baixe ou clone o projeto** para uma pasta em seu computador
2. **Abra o terminal/prompt de comando** na pasta do projeto

### 2. Configurar o Backend (Servidor)

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install
```

### 3. Configurar Variáveis de Ambiente

1. **Copie o arquivo `.env.example` e renomeie para `.env`**:
   ```bash
   # No Windows (PowerShell):
   Copy-Item .env.example .env
   
   # No Linux/Mac:
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`** com suas configurações:
   - Abra o arquivo `.env` em um editor de texto
   - **IMPORTANTE**: Substitua `JWT_SECRET` por uma chave secreta forte
   
   **Para gerar uma chave secreta segura**, execute:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Configure as opções de email** (opcional, pode ser feito depois pelo painel):
   - Se for usar Gmail, veja a seção "Configuração de Email" abaixo
   - Se for usar outro provedor, consulte a documentação do provedor

### 4. Iniciar o Servidor

```bash
# Ainda dentro da pasta backend
npm start

# Ou use o script do diretório raiz:
cd ..
npm run start:backend
```

Você deverá ver:
```
🚀 Servidor rodando na porta 3000
🌐 Acesse: http://localhost:3000
💾 Backup automático ativado
🎂 Emails de aniversário agendados
```

### 5. Acessar o Sistema

1. **Abra seu navegador** e acesse: `http://localhost:3000`
2. **Faça o primeiro cadastro** - o primeiro usuário será automaticamente admin

## 📧 Configuração de Email (SMTP)

### Usando Gmail

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma "Senha de app"**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Email" e "Outros"
   - Copie a senha gerada (16 caracteres)

3. **Configure no `.env` OU no painel de Configurações**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASSWORD=senha-de-app-de-16-caracteres
   SMTP_SECURE=false
   ```

### Usando Outlook/Hotmail

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=seu-email@outlook.com
SMTP_PASSWORD=sua-senha
SMTP_SECURE=false
```

### Outros Provedores

| Provedor | Host | Porta |
|----------|------|-------|
| Yahoo | smtp.mail.yahoo.com | 587 |
| UOL | smtp.uol.com.br | 587 |
| iCloud | smtp.mail.me.com | 587 |

## ⚙️ Configuração Inicial no Sistema

### 1. Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em "Cadastrar"
3. Preencha seus dados (o primeiro usuário será automaticamente ADMIN)
4. Faça login

### 2. Configurar Dados da Igreja

1. No menu lateral, clique em **"⚙️ Configurações"**
2. Preencha:
   - **Dados Gerais**: Nome, CNPJ, endereço, telefone, etc.
   - **Dados Bancários**: Informações da conta da igreja
   - **PIX**: Tipo de chave e chave PIX
   - **Configurações de Email**: Configure o SMTP se não fez no `.env`

3. Clique em **"Salvar Configurações"**

### 3. Testar Envio de Email

1. Acesse **"🔔 Notificações"** no menu
2. Clique em **"Testar Conexão SMTP"**
3. Se aparecer "✅ Sucesso", está tudo certo!

## 👥 Gerenciamento de Usuários

### Criar Novos Usuários

**Opção 1: Auto-cadastro**
- Usuários podem se cadastrar pelo site
- Novos usuários começam como "membro"

**Opção 2: Admin cria**
1. Acesse **"👥 Gerenciar Usuários"** (apenas admin)
2. Clique em **"➕ Novo Usuário"**
3. Preencha os dados e defina o tipo (membro, tesoureiro, pastor)

### Tipos de Usuário

- **Membro**: Pode doar e ver seus próprios dízimos
- **Tesoureiro**: Pode confirmar pagamentos e ver relatórios
- **Pastor**: Acesso a relatórios e envio de emails
- **Admin**: Acesso total ao sistema

## 💰 Funcionalidades Principais

### 1. Registrar Dízimos/Ofertas

**Como membro**:
1. Acesse **"💰 Meus Dízimos"**
2. Clique em **"Novo Dízimo"**
3. Preencha valor, data e método
4. Envie comprovante (se tiver)

**Como tesoureiro/admin**:
1. Acesse **"💰 Pagamentos"**
2. Veja todos os pagamentos pendentes
3. Confirme ou cancele

### 2. Relatórios

1. Acesse **"📊 Relatórios"**
2. Escolha o tipo:
   - Por período
   - Por método de pagamento
   - Por tipo de contribuição
3. Exporte em PDF se necessário

### 3. Aniversariantes

1. Acesse **"🎂 Aniversariantes"**
2. Veja aniversariantes do dia/mês
3. Envie emails automáticos (requer SMTP configurado)

### 4. Backups Automáticos

- O sistema faz backup automático a cada 24 horas
- Backups ficam em `backend/backups/`
- Você também pode fazer backup manual em **"Configurações > Backup"**

## 🔧 Scripts Úteis

### Iniciar Sistema (Windows)

Duplo clique em:
- `iniciar-sistema.bat` - Inicia o backend

### Parar Sistema (Windows)

Duplo clique em:
- `parar-sistema.bat` - Para todos os processos Node.js

### Via Linha de Comando

```bash
# Iniciar backend
cd backend
npm start

# Ou do diretório raiz:
npm run start:backend
```

## 🐛 Solução de Problemas

### Erro: "Porta 3000 já está em uso"

```bash
# Windows: Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <numero-do-PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot find module"

```bash
# Reinstale as dependências
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Erro ao enviar emails

1. Verifique se o SMTP está configurado corretamente
2. Para Gmail, certifique-se de usar "Senha de app"
3. Teste a conexão em **Notificações > Testar SMTP**

### Banco de dados corrompido

```bash
# O sistema cria backups automáticos
# Para restaurar, copie um backup de backend/backups/ para:
cp backend/backups/backup-YYYY-MM-DD.sqlite backend/database.sqlite
```

## 📱 Acesso Externo (Opcional)

### Para acessar de outros dispositivos na mesma rede:

1. Descubra o IP local do computador:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. No navegador de outro dispositivo, acesse:
   ```
   http://SEU-IP-LOCAL:3000
   ```
   Exemplo: `http://192.168.1.100:3000`

### Para acesso pela Internet:

Você precisará configurar:
1. Port forwarding no roteador (porta 3000)
2. Um domínio ou DNS dinâmico
3. **IMPORTANTE**: Configure HTTPS para segurança

## 🔒 Segurança

### Práticas Recomendadas:

1. **Nunca compartilhe o arquivo `.env`**
2. **Use senhas fortes** para todos os usuários
3. **Mantenha backups regulares**
4. **Atualize o Node.js** periodicamente
5. **Para produção**: Use HTTPS e configure firewall

## 📞 Suporte

### Logs do Sistema

Os logs aparecem no terminal onde o servidor está rodando.

### Verificar Status

Acesse: `http://localhost:3000/api/health`

Se retornar `{"status":"OK"}`, o servidor está funcionando.

## 🎯 Próximos Passos

1. ✅ Configure os dados da igreja
2. ✅ Teste o envio de emails
3. ✅ Crie alguns usuários de teste
4. ✅ Registre alguns dízimos
5. ✅ Explore os relatórios
6. ✅ Configure backup manual se necessário

---

## 🎉 Pronto!

Seu sistema está configurado e pronto para uso!

Para dúvidas ou problemas, consulte este guia ou verifique os logs do sistema.

**Que Deus abençoe o ministério de sua igreja! 🙏**
