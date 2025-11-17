# MANUAL RÁPIDO - SISTEMA DE DÍZIMOS NA IGREJA

## 🚀 INSTALAÇÃO RÁPIDA (5 MINUTOS)

### **📋 REQUISITOS MÍNIMOS:**
- Windows 10/11
- 4GB RAM
- 2GB espaço livre
- Internet banda larga
- Wi-Fi para dispositivos móveis

### **⚡ INSTALAÇÃO EXPRESS:**

#### **1. Instalar Node.js (2 minutos):**
```
1. Acesse: https://nodejs.org/
2. Baixe versão LTS (recomendada)
3. Instale com configurações padrão
4. Reinicie o computador
```

#### **2. Instalar http-server (1 minuto):**
```
1. Abra PowerShell como Administrador
2. Execute: npm install -g http-server
3. Aguarde instalação
```

#### **3. Configurar IP da rede (1 minuto):**
```
1. Abra PowerShell
2. Execute: ipconfig | findstr "IPv4"
3. Anote o IP (exemplo: 192.168.1.100)
4. Edite: frontend/assets/js/config.js
5. Altere para seu IP:
   API_BASE_URL: 'http://SEU_IP_AQUI:3000/api'
```

#### **4. Iniciar sistema (1 minuto):**
```
1. Clique duas vezes em: iniciar-sistema.bat
2. Aguarde as janelas abrirem
3. Sistema abrirá automaticamente no navegador
```

---

## 📱 COMO USAR NA IGREJA

### **👥 PARA MEMBROS:**

#### **💻 No computador:**
```
1. Abra navegador
2. Digite: http://SEU_IP:3001
3. Registre-se ou faça login
4. Clique "Área de Pagamentos"
5. Preencha dízimo ou oferta
6. Escolha forma de pagamento
7. Confirme transação
```

#### **📱 No celular:**
```
1. Conecte no Wi-Fi da igreja
2. Abra navegador (Chrome/Safari)
3. Digite: http://SEU_IP:3001
4. Use versão mobile: /mobile.html
5. Mesmo processo do computador
```

### **👨‍💼 PARA ADMINISTRADORES:**

#### **🏛️ Área administrativa:**
```
1. Login com conta admin
2. Menu "Administração"
3. Acesse: http://SEU_IP:3001/admin.html

Funcionalidades:
✓ Gerenciar dados da igreja
✓ Controlar usuários
✓ Aprovar transações
✓ Gerar relatórios
✓ Fazer backup
```

---

## 🔧 OPERAÇÃO DIÁRIA

### **🌅 INICIAR SISTEMA (MANHÃ):**
```
→ Clique: iniciar-sistema.bat
→ Aguarde 30 segundos
→ Verifique: status-sistema.bat
```

### **🌙 PARAR SISTEMA (NOITE):**
```
→ Clique: parar-sistema.bat
→ Sistema será parado com segurança
```

### **📊 VERIFICAR STATUS:**
```
→ Clique: status-sistema.bat
→ Ver se tudo está funcionando
```

### **💾 BACKUP (SEMANAL):**
```
→ Clique: backup-automatico.ps1
→ Aguarde conclusão
→ Backup salvo em D:\Backup\
```

---

## 🆘 RESOLUÇÃO DE PROBLEMAS

### **❌ Sistema não inicia:**
```
1. Verificar se Node.js está instalado
2. Executar como Administrador
3. Verificar internet
4. Reiniciar computador
```

### **📱 Celular não acessa:**
```
1. Verificar Wi-Fi conectado
2. Confirmar IP correto no config.js
3. Testar no computador primeiro
4. Verificar firewall do Windows
```

### **🐌 Sistema lento:**
```
1. Fechar programas desnecessários
2. Verificar uso de memória
3. Reiniciar sistema
4. Verificar internet
```

### **💾 Backup não funciona:**
```
1. Executar como Administrador
2. Verificar espaço em disco
3. Criar pasta D:\Backup\ manualmente
4. Verificar permissões
```

---

## 📞 CONTATOS DE EMERGÊNCIA

### **🔧 Suporte Técnico:**
```
📱 WhatsApp: (XX) XXXXX-XXXX
📧 Email: suporte@igreja.com
⏰ Horário: Segunda a Sexta, 9h-17h
```

### **🚨 Problemas Críticos:**
```
Se o sistema parar completamente:
1. Executar: parar-sistema.bat
2. Aguardar 2 minutos
3. Executar: iniciar-sistema.bat
4. Se não resolver: reiniciar computador
5. Contatar suporte técnico
```

---

## 💰 CUSTOS MENSAIS

### **💡 Energia elétrica:**
```
Computador ligado 12h/dia:
• Consumo: ~150W
• Custo mensal: ~R$ 30-50
```

### **📡 Internet:**
```
• Plano mínimo: 10Mbps
• Custo: R$ 80-150/mês
```

### **📱 Total mensal: R$ 110-200**

---

## 🎯 CHECKLIST DE IMPLANTAÇÃO

### **✅ ANTES DO PRIMEIRO DIA:**
```
☐ Instalar Node.js
☐ Instalar http-server  
☐ Configurar IP da rede
☐ Testar no computador
☐ Testar no celular
☐ Configurar Wi-Fi
☐ Treinar 2 pessoas da equipe
☐ Fazer backup inicial
☐ Criar contas de admin
☐ Cadastrar dados da igreja
```

### **✅ NO PRIMEIRO DIA DE USO:**
```
☐ Iniciar sistema cedo
☐ Verificar acesso Wi-Fi
☐ Orientar membros presencialmente
☐ Acompanhar primeiras transações
☐ Anotar dúvidas dos usuários
☐ Verificar relatórios
☐ Fazer backup do dia
```

### **✅ PRIMEIRA SEMANA:**
```
☐ Monitorar diariamente
☐ Coletar feedback
☐ Ajustar configurações
☐ Treinar mais pessoas
☐ Documentar problemas
☐ Otimizar processos
```

---

## 🎉 RESUMO EXECUTIVO

### **⚡ INSTALAÇÃO:**
1. **Instalar Node.js** (2 min)
2. **Configurar IP** (1 min)  
3. **Executar iniciar-sistema.bat** (1 min)
4. **Pronto para usar!**

### **📱 ACESSO:**
- **Computador:** http://SEU_IP:3001
- **Celular:** Mesmo endereço no Wi-Fi
- **Admin:** /admin.html

### **💰 CUSTO:**
- **Inicial:** R$ 0 (se já tem PC)
- **Mensal:** R$ 110-200 (energia + internet)

### **👥 CAPACIDADE:**
- **Usuários:** Ilimitado
- **Transações:** Ilimitado  
- **Dispositivos:** Todos da rede

### **🔒 SEGURANÇA:**
- **Dados locais:** Não saem da igreja
- **Backup automático:** Semanal
- **Autenticação:** Login obrigatório

---

**🙏 Sistema pronto para abençoar a gestão dos dízimos da sua igreja!**

**📞 Dúvidas? Entre em contato com o suporte técnico!**