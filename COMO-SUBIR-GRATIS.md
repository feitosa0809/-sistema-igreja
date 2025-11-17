# 🚀 COMO SUBIR O SISTEMA GRÁTIS NA INTERNET

## 🎯 OPÇÕES 100% GRATUITAS

---

## ✅ OPÇÃO 1: RENDER (RECOMENDADO - MAIS FÁCIL)

### **Por que escolher:**
- ✅ Totalmente gratuito
- ✅ Backend + Frontend no mesmo lugar
- ✅ Banco SQLite funciona direto
- ✅ Deploy automático via GitHub
- ✅ HTTPS gratuito
- ✅ Domínio: `seu-app.onrender.com`

### **Passo a Passo:**

#### 1️⃣ **Preparar o Projeto**

Crie arquivo `package.json` na raiz do projeto:
```json
{
  "name": "sistema-igreja",
  "version": "1.0.0",
  "scripts": {
    "start": "node backend/server.js",
    "build": "echo 'Build concluído'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "better-sqlite3": "^9.2.2"
  }
}
```

#### 2️⃣ **Criar conta no Render**
- Acesse: https://render.com
- Clique em "Get Started for Free"
- Use sua conta do GitHub

#### 3️⃣ **Subir no GitHub**
```powershell
# No seu projeto
git init
git add .
git commit -m "Sistema Igreja completo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sistema-igreja.git
git push -u origin main
```

#### 4️⃣ **Deploy no Render**
1. No Render, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Configure:
   - **Name:** sistema-igreja
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Clique em "Create Web Service"
5. Aguarde 2-5 minutos

#### 5️⃣ **Configurar Frontend**
No arquivo `frontend/assets/js/config.js`:
```javascript
const API_BASE_URL = 'https://sistema-igreja.onrender.com/api';
```

**Pronto! Sistema online em:** `https://sistema-igreja.onrender.com`

---

## ✅ OPÇÃO 2: RAILWAY (ALTERNATIVA EXCELENTE)

### **Por que escolher:**
- ✅ $5 de crédito grátis por mês
- ✅ Muito rápido
- ✅ Deploy automático
- ✅ PostgreSQL grátis (se quiser trocar SQLite)

### **Passo a Passo:**

#### 1️⃣ **Criar conta**
- Acesse: https://railway.app
- Login com GitHub

#### 2️⃣ **Deploy**
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha seu repositório
4. Railway detecta Node.js automaticamente
5. Clique em "Deploy"

#### 3️⃣ **Gerar domínio**
1. Vá em "Settings"
2. Clique em "Generate Domain"
3. Copie o domínio: `seu-app.up.railway.app`

#### 4️⃣ **Atualizar frontend**
```javascript
const API_BASE_URL = 'https://seu-app.up.railway.app/api';
```

---

## ✅ OPÇÃO 3: VERCEL (FRONTEND) + RENDER (BACKEND)

### **Melhor para:**
- Frontend super rápido
- Separar backend/frontend

### **Passo a Passo:**

#### **Backend no Render:**
1. Siga os passos da Opção 1
2. Deploy apenas da pasta `backend`
3. Anote a URL: `https://api-igreja.onrender.com`

#### **Frontend no Vercel:**
1. Acesse: https://vercel.com
2. Login com GitHub
3. Clique em "Add New" → "Project"
4. Selecione repositório
5. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Other
6. Deploy

#### **Configurar API:**
No `config.js`:
```javascript
const API_BASE_URL = 'https://api-igreja.onrender.com/api';
```

---

## ✅ OPÇÃO 4: FLY.IO (GRÁTIS PARA SEMPRE)

### **Vantagens:**
- Recursos generosos grátis
- Muito estável
- PostgreSQL grátis incluído

### **Passo a Passo:**

#### 1️⃣ **Instalar CLI**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

#### 2️⃣ **Criar conta e login**
```powershell
fly auth signup
# Ou se já tem conta:
fly auth login
```

#### 3️⃣ **Criar arquivo fly.toml na raiz:**
```toml
app = "sistema-igreja"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3000"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

#### 4️⃣ **Deploy**
```powershell
fly launch
fly deploy
```

#### 5️⃣ **Abrir app**
```powershell
fly open
```

---

## ✅ OPÇÃO 5: GLITCH (IDEAL PARA TESTES)

### **Vantagens:**
- Editor online
- Deploy instantâneo
- Sem configuração

### **Passo a Passo:**

1. Acesse: https://glitch.com
2. Clique em "New Project" → "Import from GitHub"
3. Cole URL do seu repositório
4. Sistema já fica online automaticamente
5. URL: `https://sistema-igreja.glitch.me`

---

## 📊 COMPARAÇÃO DAS OPÇÕES

| Opção | Facilidade | Velocidade | Estabilidade | Limite |
|-------|-----------|-----------|--------------|--------|
| **Render** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 750h/mês |
| **Railway** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $5/mês |
| **Vercel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Ilimitado* |
| **Fly.io** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 3 apps |
| **Glitch** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Dorme após 5min |

---

## 🎯 RECOMENDAÇÃO FINAL

### **Para Começar HOJE (5 minutos):**
```
🥇 RENDER - Mais fácil e completo
```

### **Para Melhor Performance:**
```
🥇 VERCEL (Frontend) + RENDER (Backend)
```

### **Para Projeto Sério:**
```
🥇 RAILWAY ou FLY.IO
```

---

## 🔧 CHECKLIST ANTES DO DEPLOY

### ✅ **Arquivos Necessários:**
- [ ] `package.json` na raiz
- [ ] `.gitignore` configurado
- [ ] `frontend/assets/js/config.js` com API URL
- [ ] Código no GitHub

### ✅ **Configurações:**
- [ ] Backend rodando na porta do `process.env.PORT`
- [ ] CORS configurado para aceitar domínio do frontend
- [ ] SQLite ou PostgreSQL configurado
- [ ] Variáveis de ambiente (JWT_SECRET)

---

## 🚀 SCRIPT RÁPIDO PARA DEPLOY NO RENDER

Crie arquivo `deploy-render.ps1`:

```powershell
Write-Host "Preparando deploy no Render..." -ForegroundColor Cyan

# 1. Criar package.json na raiz
$packageJson = @'
{
  "name": "sistema-igreja",
  "version": "1.0.0",
  "scripts": {
    "start": "node backend/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "better-sqlite3": "^9.2.2"
  }
}
'@
$packageJson | Out-File -FilePath "package.json" -Encoding utf8

# 2. Criar .gitignore
$gitignore = @'
node_modules/
*.sqlite
.env
*.log
'@
$gitignore | Out-File -FilePath ".gitignore" -Encoding utf8

Write-Host "✅ Arquivos criados!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Crie repositório no GitHub"
Write-Host "2. Execute:"
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Deploy inicial'"
Write-Host "   git remote add origin URL_DO_SEU_REPO"
Write-Host "   git push -u origin main"
Write-Host "3. Acesse render.com e conecte o repositório"
Write-Host ""
Write-Host "✅ Sistema ficará online em 5 minutos!" -ForegroundColor Green
```

Execute: `.\deploy-render.ps1`

---

## 🎉 RESULTADO FINAL

Após o deploy, você terá:

✅ **Sistema online 24/7**
✅ **URL pública:** `https://seu-app.onrender.com`
✅ **HTTPS automático** (cadeado verde)
✅ **Acesso de qualquer lugar**
✅ **Celular, tablet, computador**
✅ **100% GRATUITO**

---

## 📱 BÔNUS: DOMÍNIO PERSONALIZADO

### **Opções Gratuitas:**
1. **Freenom** - Domínios .tk, .ml, .ga grátis
2. **Cloudflare Pages** - Subdomínio grátis
3. **GitHub Pages** - `seu-usuario.github.io`

### **Conectar domínio próprio:**
No Render/Railway:
1. Vá em Settings → Custom Domain
2. Adicione seu domínio
3. Configure DNS (A record ou CNAME)
4. Aguarde propagação (5-30 min)

---

## ❓ DÚVIDAS FREQUENTES

### **O banco SQLite funciona grátis?**
✅ Sim! Render, Railway e Fly.io suportam SQLite.

### **Precisa cartão de crédito?**
❌ Não! Render é 100% grátis sem cartão.

### **O sistema fica lento?**
⚠️ Render dorme após 15min sem uso (plano grátis). Primeiro acesso demora ~30s.

### **Como manter sempre acordado?**
Use **UptimeRobot** (grátis) para fazer ping a cada 5 minutos.

### **Posso usar para igreja real?**
✅ Sim! Render grátis aguenta milhares de usuários.

---

## 🎯 RECOMENDAÇÃO #1: RENDER

**Execute agora:**

```powershell
# 1. Preparar projeto
.\deploy-render.ps1

# 2. Subir no GitHub
git init
git add .
git commit -m "Sistema Igreja - Deploy"
git remote add origin https://github.com/SEU-USUARIO/sistema-igreja.git
git push -u origin main

# 3. Render faz o resto automaticamente!
```

**Acesse:** https://render.com → New Web Service → Conectar GitHub

**Em 5 minutos seu sistema está ONLINE! 🚀**
