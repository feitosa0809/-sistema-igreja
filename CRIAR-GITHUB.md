# 📝 PASSO A PASSO - CRIAR GITHUB E DEPLOY

## 🎯 PASSO 1: CRIAR CONTA NO GITHUB (5 minutos)

1. **Abra seu navegador**
2. **Acesse:** https://github.com
3. **Clique em:** "Sign up" (botão verde, canto superior direito)
4. **Preencha:**
   - **Enter your email:** Digite seu melhor email
   - **Create a password:** Crie uma senha forte (mínimo 8 caracteres)
   - **Enter a username:** Escolha um nome de usuário (ex: `igrejajesus`, `sistemachurch`, etc.)
   - **Email preferences:** Pode desmarcar se não quiser emails
5. **Solve the puzzle:** Complete o desafio de segurança
6. **Clique em:** "Create account"
7. **Verifique seu email:** GitHub enviou um código
8. **Digite o código** de verificação
9. **Pronto!** Conta criada

---

## 🎯 PASSO 2: CRIAR REPOSITÓRIO

1. **No GitHub, clique em:** "+" (canto superior direito)
2. **Selecione:** "New repository"
3. **Preencha:**
   - **Repository name:** `sistema-igreja` (exatamente assim)
   - **Description:** `Sistema de gestão para igreja`
   - **Public** (deixe marcado)
   - **⚠️ IMPORTANTE:** NÃO marque "Add a README file"
   - **⚠️ IMPORTANTE:** NÃO adicione .gitignore
   - **⚠️ IMPORTANTE:** NÃO escolha license
4. **Clique em:** "Create repository" (botão verde)

---

## 🎯 PASSO 3: COPIAR URL DO REPOSITÓRIO

Após criar, você verá uma página com várias opções.

**Procure por:** "…or push an existing repository from the command line"

**Você verá algo assim:**
```
git remote add origin https://github.com/SEU-USUARIO/sistema-igreja.git
git branch -M main
git push -u origin main
```

**COPIE A URL:** `https://github.com/SEU-USUARIO/sistema-igreja.git`

**Exemplo:**
- Se seu usuário é `joaosilva`, a URL será:
- `https://github.com/joaosilva/sistema-igreja.git`

---

## 🎯 PASSO 4: ME ENVIE A URL

**Cole aqui a URL que você copiou!**

Exemplo: `https://github.com/joaosilva/sistema-igreja.git`

**Depois que você me enviar, eu faço:**

```powershell
# 1. Conectar ao GitHub
git remote add origin SUA_URL

# 2. Enviar código
git push -u origin main

# 3. Abrir Render e fazer deploy
```

---

## 🎯 PASSO 5: EU TERMINO O RESTO

Depois que você me passar a URL, eu:

1. ✅ Faço push do código para GitHub
2. ✅ Abro https://render.com
3. ✅ Configuro deploy automático
4. ✅ Te dou o link do sistema online!

---

## ❓ DÚVIDAS COMUNS

### "Qual usuário escolher no GitHub?"
- Pode ser qualquer coisa (ex: `igrejajesus`, `sistemachurch`)
- Sem espaços, sem caracteres especiais
- Vai aparecer na URL: `github.com/SEU-USUARIO`

### "Precisa de cartão de crédito?"
- ❌ NÃO! GitHub e Render são 100% grátis

### "Quanto tempo demora?"
- ⏱️ Criar conta GitHub: 3-5 minutos
- ⏱️ Eu fazer deploy: 2 minutos
- **TOTAL: ~7 minutos**

---

## 🚀 RESUMO VISUAL

```
1. github.com → Sign up
2. Criar conta com email
3. Verificar email
4. Criar repositório "sistema-igreja"
5. Copiar URL (https://github.com/...)
6. Me enviar a URL
7. EU FAÇO O RESTO!
```

---

## 📧 O QUE VOCÊ PRECISA ME ENVIAR:

**Apenas isso:**
```
https://github.com/SEU-USUARIO/sistema-igreja.git
```

**Exemplo real:**
```
https://github.com/joaosilva/sistema-igreja.git
```

---

**Vá criar sua conta agora e me envie a URL! Estou esperando!** 🎯
