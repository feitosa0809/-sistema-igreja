# 💰 Sistema de Gestão Financeira para Igrejas

Sistema completo e moderno para gestão de dízimos, ofertas e finanças de igrejas, com interface intuitiva e recursos avançados.

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-blue)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Destaques

- 🎯 **100% Pronto para Uso** - Sistema completo e testado
- 🚀 **Instalação Simplificada** - Script automatizado de setup
- 💾 **Sem Banco Complexo** - Usa SQLite (sem necessidade de MySQL)
- 📧 **Emails Automáticos** - Confirmações e aniversários
- 📊 **Relatórios Completos** - Exportação em PDF
- 🎂 **Gestão de Aniversariantes** - Envio automático de felicitações
- 💰 **Sistema de Pagamentos** - PIX, Cartão, Transferência, Dinheiro
- 🔐 **Segurança Completa** - JWT, autenticação e permissões
- 💾 **Backup Automático** - Diário e sob demanda
- 📱 **Totalmente Responsivo** - Funciona em todos os dispositivos


## � Instalação Rápida (2 minutos)

### Método 1: Script Automatizado (Recomendado - Windows)

```bash
# Duplo clique em:
setup-inicial.bat
```

Pronto! O script irá:
1. ✅ Verificar Node.js
2. ✅ Instalar dependências
3. ✅ Criar arquivo .env
4. ✅ Gerar chave secreta JWT

### Método 2: Manual

```bash
# 1. Instalar dependências
cd backend
npm install

# 2. Configurar ambiente
copy .env.example .env
# Edite .env e configure JWT_SECRET

# 3. Iniciar servidor
npm start
```

### Acessar o Sistema

Abra seu navegador em: **http://localhost:3000**

🎉 **Primeiro cadastro será automaticamente ADMIN!**

## 📖 Documentação Completa

- 📘 **[Guia de Instalação Completo](INSTALACAO.md)** - Passo a passo detalhado
- 🎯 **[Guia Rápido de Uso](GUIA-RAPIDO.md)** - Como usar todas as funcionalidades

## ⚡ Início Rápido

### Iniciar o Sistema

**Windows:**
```bash
# Duplo clique em:
iniciar-sistema.bat

# Ou manualmente:
cd backend
npm start
```

Acesse: `http://localhost:3000`

### Parar o Sistema

**Windows:**
```bash
# Duplo clique em:
parar-sistema.bat
```

## 📁 Estrutura do Projeto

```
tcc1/
├── backend/                    # API Rest (Node.js + Express + SQLite)
│   ├── config/                # Configurações do banco de dados
│   ├── middleware/            # Middlewares de autenticação
│   ├── routes/               # Rotas da API (15+ endpoints)
│   ├── utils/                # Serviços (email, PDF, backup)
│   ├── public/uploads/       # Upload de comprovantes
│   ├── backups/              # Backups automáticos
│   ├── database.sqlite       # Banco de dados SQLite
│   ├── server.js             # Servidor principal
│   └── .env                  # Variáveis de ambiente
│
├── frontend/                  # Interface do usuário (SPA)
│   ├── assets/
│   │   ├── css/              # Estilos modernos
│   │   └── js/               # Scripts JavaScript
│   ├── index.html            # Login
│   ├── dashboard.html        # Dashboard
│   ├── pagamentos.html       # Gestão de pagamentos
│   ├── relatorios.html       # Relatórios
│   ├── notificacoes.html     # Sistema de emails
│   ├── aniversariantes.html  # Aniversariantes
│   ├── configuracoes.html    # Configurações da igreja
│   └── admin.html            # Painel administrativo
│
├── setup-inicial.bat          # Script de instalação automática
├── iniciar-sistema.bat        # Atalho para iniciar
├── parar-sistema.bat          # Atalho para parar
├── INSTALACAO.md             # Guia completo de instalação
├── GUIA-RAPIDO.md            # Guia rápido de uso
└── README.md                 # Este arquivo
```


## 📋 Funcionalidades Completas

### 👤 Para Membros:
- ✅ Cadastro e login seguro
- ✅ Registro de dízimos com comprovante (imagem/PDF)
- ✅ Histórico completo de contribuições
- ✅ Dashboard personalizado
- ✅ Edição de perfil com foto
- ✅ Comprovantes de pagamento em PDF

### 👨‍💼 Para Tesoureiros:
- ✅ Aprovação/cancelamento de dízimos
- ✅ Visualização de todos os pagamentos
- ✅ Relatórios financeiros detalhados
- ✅ Exportação de relatórios em PDF
- ✅ Dashboard administrativo
- ✅ Gestão de métodos de pagamento

### 👨‍🏫 Para Pastores:
- ✅ Acesso a todos os relatórios
- ✅ Envio de emails personalizados
- ✅ Gestão de aniversariantes
- ✅ Envio automático de felicitações
- ✅ Visualização de estatísticas

### 🔐 Para Administradores:
- ✅ Controle total de usuários
- ✅ Promoção/rebaixamento de permissões
- ✅ Configurações da igreja
- ✅ Configuração de SMTP para emails
- ✅ Gestão de PIX e dados bancários
- ✅ Backup manual e automático
- ✅ Logs do sistema

### 🎂 Sistema de Aniversários:
- ✅ Lista de aniversariantes do dia/mês
- ✅ Envio automático diário às 8h
- ✅ Envio manual em lote
- ✅ Templates de email personalizáveis
- ✅ Notificação por email

### 📧 Sistema de Notificações:
- ✅ Emails de confirmação de dízimo
- ✅ Emails de aniversário
- ✅ Emails personalizados em massa
- ✅ Teste de configuração SMTP
- ✅ Templates HTML profissionais

### 💾 Sistema de Backup:
- ✅ Backup automático diário
- ✅ Backup manual sob demanda
- ✅ Manutenção de histórico (30 dias)
- ✅ Download de backups
- ✅ Restauração simplificada


## 🛠 Tecnologias Utilizadas

### Backend:
- **Node.js 14+** - Plataforma JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados leve e eficiente
- **JWT** - Autenticação segura com tokens
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos
- **bcryptjs** - Criptografia de senhas
- **Helmet + CORS** - Segurança HTTP

### Frontend:
- **HTML5 + CSS3** - Estrutura e estilo moderno
- **JavaScript (Vanilla)** - Sem frameworks pesados
- **Bootstrap 5** - UI responsiva e elegante
- **Font Awesome 6** - Ícones profissionais
- **SweetAlert2** - Alertas bonitos
- **Fetch API** - Comunicação assíncrona

### Destaques Técnicos:
- ⚡ Sem necessidade de MySQL - SQLite integrado
- 🔒 Autenticação JWT com refresh tokens
- 📧 Sistema de emails completo com SMTP
- 💾 Backup automático agendado
- 📱 Design responsivo mobile-first
- 🎨 Interface moderna com gradientes
- ⚙️ Configuração centralizada

## 📡 Principais Rotas da API

### Autenticação (`/api/auth`)
- `POST /register` - Registro de usuário
- `POST /login` - Login e obtenção de token

### Usuários (`/api/users` e `/api/usuarios`)
- `GET /profile` - Perfil do usuário logado
- `PUT /profile` - Atualizar perfil
- `POST /upload-foto` - Upload de foto de perfil

### Doações (`/api/donations`)
- `GET /meus-dizimos` - Dízimos do usuário
- `POST /dizimo` - Registrar novo dízimo
- `GET /todos` - Todos os dízimos (admin)
- `PUT /:id/confirmar` - Confirmar dízimo (tesoureiro)

### Relatórios (`/api/relatorios` e `/api/reports`)
- `GET /dashboard` - Dados do dashboard
- `GET /por-periodo` - Relatório por período
- `GET /por-metodo` - Relatório por método de pagamento
- `GET /anual` - Relatório anual completo

### Configurações (`/api/config`)
- `GET /` - Obter configurações da igreja
- `PUT /` - Atualizar configurações (admin)

### Notificações (`/api/notificacoes`)
- `POST /testar-email` - Testar configuração SMTP
- `POST /enviar-aniversarios-automatico` - Emails de aniversário
- `POST /enviar-personalizado` - Email personalizado

### Aniversariantes (`/api/birthdays`)
- `GET /hoje` - Aniversariantes de hoje
- `GET /mes` - Aniversariantes do mês
- `GET /proximos` - Próximos aniversários

### Backup (`/api/backup`)
- `POST /criar` - Criar backup manual
- `GET /listar` - Listar backups disponíveis
- `GET /download/:filename` - Download de backup

### Admin (`/api/admin`)
- `GET /usuarios` - Listar todos usuários
- `PUT /usuarios/:id/tipo` - Alterar tipo de usuário
- `GET /estatisticas` - Estatísticas gerais

## 🔒 Sistema de Permissões

| Funcionalidade | Membro | Tesoureiro | Pastor | Admin |
|----------------|--------|------------|--------|-------|
| Registrar dízimos | ✅ | ✅ | ✅ | ✅ |
| Ver próprios dízimos | ✅ | ✅ | ✅ | ✅ |
| Confirmar pagamentos | ❌ | ✅ | ✅ | ✅ |
| Ver todos os dízimos | ❌ | ✅ | ✅ | ✅ |
| Gerar relatórios | ❌ | ✅ | ✅ | ✅ |
| Enviar emails | ❌ | ❌ | ✅ | ✅ |
| Ver aniversariantes | ❌ | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ❌ | ✅ |
| Configurar igreja | ❌ | ❌ | ❌ | ✅ |
| Fazer backups | ❌ | ❌ | ❌ | ✅ |


## � Configuração de Email

### Provedores Suportados

O sistema funciona com qualquer provedor SMTP. Configurações comuns:

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=senha-de-app-de-16-caracteres
SMTP_SECURE=false
```
👉 Use "Senha de App" - não a senha normal! [Saiba como](https://support.google.com/accounts/answer/185833)

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=seu-email@outlook.com
SMTP_PASSWORD=sua-senha
SMTP_SECURE=false
```

**Outros Provedores:**
| Provedor | Host | Porta |
|----------|------|-------|
| Yahoo | smtp.mail.yahoo.com | 587 |
| UOL | smtp.uol.com.br | 587 |
| iCloud | smtp.mail.me.com | 587 |
| Locaweb | smtp.locaweb.com.br | 587 |

### Configurar SMTP

**Opção 1: Pelo Painel (Recomendado)**
1. Acesse **⚙️ Configurações**
2. Role até **"Configurações de E-mail"**
3. Preencha os dados do SMTP
4. Salve e teste em **🔔 Notificações**

**Opção 2: Via .env**
Edite `backend/.env` com as credenciais acima

## 🗄 Banco de Dados SQLite

### Estrutura

O sistema cria automaticamente estas tabelas:

- **usuarios** - Dados dos usuários (nome, email, tipo, foto, etc.)
- **dizimos** - Registros de dízimos com status e comprovantes
- **ofertas** - Ofertas especiais e campanhas
- **campanhas** - Campanhas ativas da igreja
- **contribuicoes_campanha** - Contribuições para campanhas
- **configuracoes** - Configurações gerais do sistema
- **configuracoes_igreja** - Dados da igreja, SMTP, PIX, banco

### Migrations

O sistema já vem com migração para adicionar campo `data_nascimento`:
```bash
# Executar migration manualmente (se necessário)
cd backend/migrations
node migrate.js
```

### Backup e Restauração

**Backup automático:**
- A cada 24 horas
- Mantém últimos 30 backups
- Salvo em `backend/backups/`

**Backup manual:**
1. Acesse **⚙️ Configurações**
2. Clique em **"Fazer Backup Agora"**

**Restaurar backup:**
```bash
# Substitua database.sqlite por um backup
cp backend/backups/backup-2025-01-15.sqlite backend/database.sqlite
```


## 📱 Interface e Páginas

### Páginas Disponíveis

- 🏠 **index.html** - Login e cadastro
- 📊 **dashboard.html** - Dashboard com estatísticas
- 💰 **pagamentos.html** - Gestão de dízimos e pagamentos
- 📈 **relatorios.html** - Relatórios completos (PDF)
- 🔔 **notificacoes.html** - Envio de emails
- 🎂 **aniversariantes.html** - Gestão de aniversariantes
- ⚙️ **configuracoes.html** - Configurações da igreja
- 👥 **admin.html** - Painel administrativo
- 👤 **perfil.html** - Perfil do usuário

### Design Responsivo

O sistema se adapta perfeitamente a:
- 💻 **Desktop** (1920x1080 ou superior)
- 💻 **Laptop** (1366x768 ou superior)
- 📱 **Tablet** (768x1024)
- 📱 **Smartphone** (375x667 ou superior)

### Recursos Visuais

- 🎨 Gradientes modernos roxo/violeta
- 🌈 Cores temáticas por função
- ✨ Animações suaves
- 📊 Gráficos interativos
- 🖼️ Upload de imagens com preview
- 🎭 Modais responsivos
- 🔔 Notificações toast elegantes

## 🆘 Solução de Problemas

### Erro: "Port 3000 already in use"

**Windows:**
```bash
# Encontrar e matar processo
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Ou use:
parar-sistema.bat
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Erro ao enviar emails

**Checklist:**
1. ✅ SMTP configurado em Configurações ou .env?
2. ✅ Para Gmail, está usando "Senha de App"?
3. ✅ Testou a conexão em Notificações > Testar SMTP?
4. ✅ Firewall bloqueando porta 587/465?

### Banco de dados corrompido

```bash
# Restaurar de um backup
cd backend
cp backups/backup-YYYY-MM-DD.sqlite database.sqlite

# Ou criar novo banco (perde dados!)
rm database.sqlite
npm start
```

### Página em branco

1. Abra o **Console do navegador** (F12)
2. Verifique erros de JavaScript
3. Confirme que API está rodando: `http://localhost:3000/api/health`
4. Limpe cache do navegador (Ctrl+Shift+Del)

### Comprovante não carrega

- ✅ Formatos aceitos: JPG, PNG, PDF
- ✅ Tamanho máximo: 10MB
- ✅ Verifique se pasta `backend/public/uploads/comprovantes/` existe

## 🚀 Deploy e Produção

### Preparar para Produção

1. **Configurar .env de produção:**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<chave-super-segura-64-caracteres>
```

2. **Instalar apenas dependências de produção:**
```bash
cd backend
npm install --production
```

3. **Usar HTTPS** (obrigatório para produção):
   - Configure SSL/TLS
   - Use nginx ou Apache como proxy reverso

### Acesso Externo (Internet)

**Opções:**

1. **Servidor VPS** (Recomendado)
   - DigitalOcean, AWS, Azure, etc.
   - Configure domínio e SSL

2. **Ngrok** (Teste rápido)
   ```bash
   ngrok http 3000
   ```

3. **Port Forwarding** (Rede local)
   - Configure no roteador
   - Use DNS dinâmico (No-IP, DynDNS)

### Recomendações de Segurança

- 🔒 **SEMPRE use HTTPS** em produção
- 🔑 **JWT_SECRET forte** (64+ caracteres)
- 🛡️ **Configure firewall** (apenas porta necessária)
- 📧 **Use senhas de app** para email
- 💾 **Backups regulares** (diário automático + semanal manual)
- 🔐 **Senhas fortes** para todos os usuários
- 🚫 **Nunca compartilhe .env** ou credenciais

## 📞 Suporte e Manutenção

### Logs do Sistema

**Ver logs em tempo real:**
```bash
cd backend
npm start
# Logs aparecem no terminal
```

**Verificar saúde da API:**
```
http://localhost:3000/api/health
```
Resposta esperada: `{"status":"OK","timestamp":"...","uptime":...}`

### Manutenção Regular

**Semanal:**
- ✅ Verificar backups
- ✅ Confirmar dízimos pendentes

**Mensal:**
- ✅ Gerar relatórios mensais
- ✅ Exportar relatórios em PDF
- ✅ Baixar backup importante

**Trimestral:**
- ✅ Atualizar Node.js e dependências
- ✅ Revisar permissões de usuários
- ✅ Limpar comprovantes antigos (se necessário)

### Atualizar Sistema

```bash
# Fazer backup primeiro!
cd backend
npm run backup

# Atualizar dependências
npm update

# Reiniciar
npm start
```

## 🎯 Roadmap Futuro

Funcionalidades planejadas:

- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp
- [ ] Relatórios avançados com gráficos
- [ ] Sistema de campanhas ativo
- [ ] Área de membros estendida
- [ ] API pública documentada (Swagger)
- [ ] Testes automatizados
- [ ] Docker container

## 📄 Licença

Este projeto está sob a licença **MIT**.

Você é livre para:
- ✅ Usar comercialmente
- ✅ Modificar
- ✅ Distribuir
- ✅ Uso privado

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

Desenvolvido com ❤️ para ajudar igrejas a gerenciar suas finanças de forma simples e eficiente.

## 🙏 Agradecimentos

- Comunidade Node.js
- Bootstrap e Font Awesome
- Todas as igrejas que inspiraram este projeto

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

**🙏 Que Deus abençoe o ministério de sua igreja!**

---

## 📚 Links Úteis

- [Documentação Node.js](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Nodemailer Guide](https://nodemailer.com/)

