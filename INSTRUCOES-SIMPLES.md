# 🚀 COMO COLOCAR SEU SISTEMA ONLINE - PASSO A PASSO ILUSTRADO

## ✅ OPÇÃO MAIS FÁCIL: GLITCH.COM (2 MINUTOS)

### 📋 O QUE VOCÊ VAI FAZER:
1. Entrar no Glitch
2. Fazer upload dos arquivos
3. Sistema online automaticamente!

---

## 🎯 PASSO 1: CRIAR CONTA NO GLITCH

1. **Abra seu navegador**
2. **Digite:** https://glitch.com
3. **Clique em:** "Sign Up" (canto superior direito)
4. **Use:** Sua conta Google, GitHub ou Email
5. **Pronto!** Você já está logado

---

## 🎯 PASSO 2: CRIAR NOVO PROJETO

1. **Clique em:** "New Project" (botão roxo grande)
2. **Selecione:** "glitch-hello-node" (template Node.js)
3. **Aguarde 10 segundos** (ele cria o projeto)
4. **Você verá:** Um editor de código online

---

## 🎯 PASSO 3: PREPARAR OS ARQUIVOS

### No seu computador (Windows Explorer):

1. **Abra duas pastas:**
   - Pasta 1: `F:\Backup\disco c\tcc1` (seu projeto)
   - Pasta 2: Deixe essa janela aberta

2. **No Glitch (navegador):**
   - Você verá à esquerda: "Files" (lista de arquivos)

---

## 🎯 PASSO 4: COPIAR ARQUIVOS

### 📄 Arquivo 1: package.json

**No Glitch:**
1. Clique em `package.json` (à esquerda)
2. **DELETE TUDO** que está lá
3. **COPIE** o conteúdo do arquivo `package.json` do seu projeto
4. **COLE** no Glitch

### 📄 Arquivo 2: server-completo.js

**No Glitch:**
1. Clique em "New File" (+ ao lado de Files)
2. Digite: `server-completo.js`
3. Pressione Enter
4. **COPIE** o conteúdo do arquivo `server-completo.js` do seu projeto
5. **COLE** no Glitch

### 📁 Pasta frontend

**No Glitch:**
1. Clique em "Assets" (ícone de imagem, embaixo)
2. Clique em "Upload an asset"
3. **ARRASTE** a pasta `frontend` inteira
4. Aguarde upload (pode demorar 1-2 minutos)

---

## 🎯 PASSO 5: AJUSTAR package.json

No Glitch, no arquivo `package.json`, certifique-se que tem:

```json
{
  "name": "sistema-igreja",
  "main": "server-completo.js",
  "scripts": {
    "start": "node server-completo.js"
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

---

## 🎯 PASSO 6: TESTAR

1. **No Glitch, clique em:** "Show" (canto superior direito)
2. **Selecione:** "In a New Window"
3. **PRONTO!** Seu sistema está online!

**URL será algo como:** `https://seu-projeto-nome.glitch.me`

---

## ❌ SE NÃO FUNCIONAR - PLANO B

### OPÇÃO 2: RENDER.COM (PRECISA INSTALAR GIT)

#### Instalar Git (5 minutos):

1. **Baixe:** https://git-scm.com/download/win
2. **Execute** o instalador
3. **Clique:** Next, Next, Next... (tudo padrão)
4. **Reinicie** o VS Code

#### Depois de instalar Git:

```powershell
# 1. Inicializar Git
git init
git add .
git commit -m "Deploy inicial"

# 2. Criar repositório no GitHub (pelo navegador)
# - Vá em github.com
# - Clique em "New repository"
# - Nome: sistema-igreja
# - Clique em "Create repository"

# 3. Conectar e enviar
git remote add origin URL_DO_SEU_REPOSITORIO
git branch -M main
git push -u origin main
```

#### No Render:

1. **Acesse:** https://render.com
2. **Cadastre-se** grátis
3. **New +** → **Web Service**
4. **Connect** seu GitHub
5. **Select** o repositório
6. **Deploy!**

---

## 📱 OPÇÃO 3: EU SUBO PRA VOCÊ

Se nada disso funcionar, me diga e eu:

1. ✅ Instalo Git pra você
2. ✅ Crio conta no GitHub
3. ✅ Faço todo o processo
4. ✅ Te entrego o link pronto

**Escolha qual opção você quer:**
- [ ] Tentar Glitch sozinho (RECOMENDADO)
- [ ] Quer que eu instale Git e faça tudo
- [ ] Tem alguma dúvida específica

---

## 🎥 RESUMO VISUAL GLITCH:

```
1. glitch.com → Sign Up
2. New Project → glitch-hello-node
3. Copiar package.json
4. Criar server-completo.js e copiar código
5. Upload pasta frontend
6. Clicar em "Show"
7. ✅ ONLINE!
```

**TEMPO TOTAL: 2-5 MINUTOS**

---

## 💡 DICA: TESTE LOCAL PRIMEIRO

Antes de subir, teste localmente:

```powershell
node server-completo.js
```

Acesse: http://localhost:3000

Se funcionar local, vai funcionar online!

---

## 🆘 PRECISA DE AJUDA?

Me diga em qual passo você está travado:
1. Criar conta Glitch?
2. Copiar arquivos?
3. Fazer upload?
4. Outra coisa?

**Vou te ajudar passo a passo!**
