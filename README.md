# Sistema de Dízimos - Organizado em Backend e Frontend

Sistema completo para gestão de dízimos e ofertas de igrejas, agora organizado em arquitetura separada.

## 📁 Estrutura do Projeto

```
tcc1/
├── backend/                    # API Rest (Node.js + Express)
│   ├── config/                # Configurações do banco de dados
│   ├── middleware/            # Middlewares de autenticação
│   ├── routes/               # Rotas da API
│   ├── public/uploads/       # Upload de arquivos
│   ├── package.json
│   ├── server.js             # Servidor principal
│   └── .env                  # Variáveis de ambiente
│
├── frontend/                  # Interface do usuário (SPA)
│   ├── assets/
│   │   ├── css/              # Estilos CSS
│   │   └── js/               # Scripts JavaScript
│   ├── package.json
│   └── index.html            # Página principal
│
└── README.md                 # Este arquivo
```

## 🚀 Como Executar

### Backend (API)

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais do MySQL:
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=dizimo_app
```

4. Execute o servidor:
```bash
npm start
```
ou para desenvolvimento:
```bash
npm run dev
```

### Frontend (Interface)

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001

## 📋 Funcionalidades

### Para Membros:
- ✅ Cadastro e login
- ✅ Registro de dízimos com comprovante
- ✅ Histórico pessoal de contribuições
- ✅ Participação em campanhas
- ✅ Dashboard personalizado

### Para Administradores/Tesoureiros:
- ✅ Aprovação de dízimos pendentes
- ✅ Relatórios financeiros
- ✅ Gestão de campanhas
- ✅ Controle de usuários
- ✅ Dashboard administrativo

## 🛠 Tecnologias

### Backend:
- Node.js + Express.js
- MySQL (com mysql2)
- JWT para autenticação
- Multer para upload de arquivos
- bcryptjs para criptografia
- Helmet + CORS para segurança

### Frontend:
- HTML5 + CSS3 + JavaScript (Vanilla)
- Bootstrap 5 para UI
- Font Awesome para ícones
- Fetch API para comunicação com backend

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `PUT /api/users/password` - Alterar senha

### Dízimos e Ofertas
- `GET /api/donations/dizimos` - Listar dízimos
- `POST /api/donations/dizimos` - Cadastrar dízimo
- `GET /api/donations/ofertas` - Listar ofertas
- `POST /api/donations/ofertas` - Cadastrar oferta

### Campanhas
- `GET /api/donations/campanhas` - Listar campanhas
- `POST /api/donations/campanhas/:id/contribuir` - Contribuir

### Relatórios
- `GET /api/reports/dashboard` - Dashboard administrativo
- `GET /api/reports/meus-dizimos` - Relatório pessoal

### Administração
- `GET /api/admin/dizimos/pendentes` - Dízimos pendentes
- `PUT /api/admin/dizimos/:id/confirmar` - Confirmar dízimo
- `GET /api/admin/usuarios` - Listar usuários

## 🔒 Segurança

- Autenticação JWT
- Validação de dados com express-validator
- Rate limiting
- Helmet para headers de segurança
- CORS configurado
- Upload seguro de arquivos

## 🗄 Banco de Dados

O sistema cria automaticamente as seguintes tabelas:
- `usuarios` - Dados dos usuários
- `dizimos` - Registros de dízimos
- `ofertas` - Registros de ofertas
- `campanhas` - Campanhas da igreja
- `contribuicoes_campanha` - Contribuições para campanhas
- `configuracoes` - Configurações do sistema

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend no terminal
2. Abra o console do navegador para erros do frontend
3. Confirme que o banco MySQL está rodando
4. Verifique se as URLs estão corretas no config.js

## 📄 Licença

MIT License