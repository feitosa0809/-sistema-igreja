# 🏛️ GUIA COMPLETO: IMPLANTAÇÃO NA IGREJA

## 🚀 COMO COLOCAR O SISTEMA PARA RODAR NA IGREJA

### **📋 OPÇÕES DE IMPLANTAÇÃO**

#### **🔥 OPÇÃO 1: SERVIDOR LOCAL NA IGREJA (Recomendado)**
- **Vantagens:** Controle total, sem custos mensais, dados locais
- **Desvantagens:** Requer manutenção local

#### **☁️ OPÇÃO 2: SERVIDOR NA NUVEM**
- **Vantagens:** Acesso de qualquer lugar, backup automático
- **Desvantagens:** Custo mensal, dependência de internet

#### **💻 OPÇÃO 3: COMPUTADOR DA IGREJA**
- **Vantagens:** Simples, sem custos extras
- **Desvantagens:** Computador deve ficar sempre ligado

---

## 🏆 **OPÇÃO 1: SERVIDOR LOCAL (MAIS PROFISSIONAL)**

### **🖥️ Hardware Necessário:**

#### **Opção Econômica (R$ 1.500-2.500):**
```
🖥️ Mini PC ou Raspberry Pi 4:
   • Processador: Intel Celeron ou ARM Quad-core
   • RAM: 4GB-8GB
   • Armazenamento: 128GB SSD
   • Rede: Ethernet + Wi-Fi
   
📡 Roteador Wi-Fi:
   • Internet banda larga (10Mbps+)
   • Wi-Fi para acesso móvel
```

#### **Opção Profissional (R$ 3.000-5.000):**
```
🖥️ Servidor Dedicado:
   • Intel Core i3 ou superior
   • RAM: 8GB-16GB
   • Armazenamento: 256GB SSD
   • UPS (No-break) para proteção
```

### **⚙️ Configuração do Servidor:**

#### **1. Preparar o Ambiente:**
```powershell
# Instalar Node.js LTS (versão 18 ou 20)
# Download: https://nodejs.org/

# Instalar Git (para versionamento)
# Download: https://git-scm.com/

# Instalar PM2 (gerenciador de processos)
npm install -g pm2
npm install -g pm2-windows-startup
```

#### **2. Configurar o Sistema:**
```powershell
# Copiar projeto para servidor
# Exemplo: C:\SistemaDizimos\

# Instalar dependências
cd C:\SistemaDizimos\backend
npm install

cd C:\SistemaDizimos\frontend  
npm install -g http-server
```

#### **3. Configurar Inicialização Automática:**
```powershell
# Configurar PM2 para iniciar com Windows
pm2-startup install

# Iniciar serviços com PM2
cd C:\SistemaDizimos\backend
pm2 start server.js --name "backend-igreja"

cd C:\SistemaDizimos\frontend
pm2 start "http-server -p 3001 -a 0.0.0.0 -c-1 --cors" --name "frontend-igreja"

# Salvar configuração
pm2 save
```

### **🌐 Configuração de Rede:**

#### **1. IP Fixo para o Servidor:**
```
1. Acesse configurações de rede
2. Configure IP fixo (ex: 192.168.1.100)
3. DNS: 8.8.8.8 e 8.8.4.4
4. Gateway: IP do roteador
```

#### **2. Configurar Roteador:**
```
🔧 Port Forwarding (para acesso externo):
   • Porta 3000 → 192.168.1.100:3000 (Backend)
   • Porta 3001 → 192.168.1.100:3001 (Frontend)

📡 Wi-Fi da Igreja:
   • Nome: "IgrejaWiFi" 
   • Senha: "senha_segura_123"
   • WPA2/WPA3 para segurança
```

---

## ☁️ **OPÇÃO 2: SERVIDOR NA NUVEM**

### **🌤️ Provedores Recomendados:**

#### **AWS (Amazon) - Mais Profissional:**
```
💰 Custo: ~R$ 50-150/mês
📦 Serviço: EC2 t3.micro
💾 Storage: 20GB SSD
🌍 Localização: São Paulo
```

#### **DigitalOcean - Mais Simples:**
```
💰 Custo: ~R$ 30-80/mês  
📦 Serviço: Droplet $6/mês
💾 Storage: 25GB SSD
🌍 Localização: São Paulo
```

#### **Google Cloud - Créditos Gratuitos:**
```
💰 Custo: Grátis por 12 meses
📦 Serviço: Compute Engine
💾 Storage: 30GB
🎁 US$ 300 em créditos
```

### **🚀 Configuração na Nuvem:**

#### **1. Criar Servidor:**
```bash
# Escolher Ubuntu 20.04 LTS
# Configurar chave SSH
# Abrir portas 80, 443, 3000, 3001
```

#### **2. Instalar Dependências:**
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx (proxy reverso)
sudo apt install nginx -y
```

#### **3. Configurar Domínio:**
```
📡 Registrar domínio (opcional):
   • Exemplo: igreja-esperanca.com.br
   • Custo: ~R$ 40/ano
   • Configurar DNS para apontar ao servidor

🔒 Certificado SSL (HTTPS):
   • Usar Let's Encrypt (gratuito)
   • Comando: sudo certbot --nginx
```

---

## 💻 **OPÇÃO 3: COMPUTADOR DA IGREJA (MAIS SIMPLES)**

### **🖥️ Requisitos do Computador:**
```
💾 Sistema: Windows 10/11
🧠 RAM: Mínimo 4GB (recomendado 8GB)
💿 Espaço: 2GB livres
📡 Internet: Banda larga estável
```

### **⚙️ Configuração Permanente:**

#### **1. Otimizar Windows:**
```
🔋 Configurar para nunca hibernar:
   • Painel de Controle > Opções de Energia
   • Colocar computador para dormir: Nunca
   
🔄 Atualização automática:
   • Windows Update configurado
   • Reiniciar apenas madrugada
   
🚫 Desabilitar programas desnecessários:
   • msconfig > Inicialização
   • Manter apenas essenciais
```

#### **2. Scripts de Inicialização:**

**Criar arquivo: `C:\SistemaDizimos\iniciar-igreja.bat`**
```batch
@echo off
title Sistema de Dízimos - Igreja
cd "C:\SistemaDizimos\backend"
start "Backend" node server.js
timeout 10
cd "C:\SistemaDizimos\frontend"
start "Frontend" http-server -p 3001 -a 0.0.0.0 -c-1 --cors
echo Sistema iniciado! Acesse: http://192.168.1.100:3001
pause
```

**Criar arquivo: `C:\SistemaDizimos\parar-igreja.bat`**
```batch
@echo off
taskkill /f /im node.exe
echo Sistema parado!
pause
```

#### **3. Inicialização Automática:**
```
📁 Copiar iniciar-igreja.bat para:
   • C:\Users\[Usuario]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\

🔧 Ou configurar no Agendador de Tarefas:
   • Executar na inicialização do Windows
   • Executar mesmo se usuário não logado
```

---

## 📱 **CONFIGURAÇÃO DE ACESSO MÓVEL**

### **🔧 Configurar IPs e URLs:**

#### **1. Descobrir IP da Igreja:**
```powershell
ipconfig | findstr "IPv4"
# Exemplo resultado: 192.168.1.100
```

#### **2. Atualizar arquivo de configuração:**
**Editar: `frontend/assets/js/config.js`**
```javascript
const CONFIG = {
    API_BASE_URL: 'http://192.168.1.100:3000/api', // IP do servidor
    APP_NAME: 'Sistema de Dízimos - Igreja Esperança',
    VERSION: '1.0.0'
};
```

#### **3. URLs de acesso na igreja:**
```
🏠 Principal: http://192.168.1.100:3001
💰 Pagamentos: http://192.168.1.100:3001/pagamentos.html
🏛️ Admin: http://192.168.1.100:3001/admin.html
📱 Mobile: http://192.168.1.100:3001/mobile.html
```

---

## 🔒 **SEGURANÇA E BACKUP**

### **🛡️ Configurações de Segurança:**

#### **1. Firewall do Windows:**
```
🔥 Liberar portas:
   • Entrada: 3000, 3001
   • Saída: Todas
   
🚫 Bloquear acesso externo (se local):
   • Apenas rede interna
   • Protocolo: TCP
```

#### **2. Backup Automático:**
**Criar script: `backup-automatico.ps1`**
```powershell
$dataAtual = Get-Date -Format "yyyy-MM-dd_HH-mm"
$origem = "C:\SistemaDizimos"
$destino = "D:\Backup\SistemaDizimos_$dataAtual"

# Criar backup
Copy-Item -Path $origem -Destination $destino -Recurse

# Backup do banco de dados
Copy-Item -Path "$origem\backend\database.sqlite" -Destination "D:\Backup\database_$dataAtual.sqlite"

Write-Host "Backup realizado: $destino" -ForegroundColor Green
```

#### **3. Agendamento de Backup:**
```
⏰ Agendar no Windows:
   • Diário às 23:00
   • Semanal (backup completo)
   • Mensal (backup para nuvem)
```

---

## 👥 **TREINAMENTO DA EQUIPE**

### **📚 Manual de Usuários:**

#### **1. Para Membros:**
```
📱 Como usar no celular:
   1. Conectar no Wi-Fi da igreja
   2. Abrir navegador
   3. Digitar: http://192.168.1.100:3001
   4. Registrar ou fazer login
   5. Ir em "Pagamentos"
   6. Preencher dízimo/oferta

💻 Como usar no computador:
   • Mesmo processo
   • Interface mais ampla
```

#### **2. Para Administradores:**
```
🏛️ Acesso administrativo:
   1. Login com conta admin
   2. Menu "Administração"
   3. Gerenciar dados da igreja
   4. Aprovar transações
   5. Gerar relatórios

🗄️ Backup manual:
   1. Área Admin > Backup
   2. "Download Backup"
   3. Salvar arquivo com data
```

#### **3. Para Suporte Técnico:**
```
🔧 Reiniciar sistema:
   • Executar: parar-igreja.bat
   • Aguardar 30 segundos
   • Executar: iniciar-igreja.bat

📊 Verificar status:
   • netstat -ano | findstr ":3000"
   • netstat -ano | findstr ":3001"

🚨 Em caso de problemas:
   • Reiniciar computador
   • Verificar internet
   • Contatar suporte
```

---

## 💰 **CUSTOS ESTIMADOS**

### **💸 Opção Local (Uma vez):**
```
🖥️ Hardware:
   • Mini PC: R$ 1.500-2.500
   • UPS: R$ 300-500
   • Cabo de rede: R$ 50
   
💡 Energia mensal: ~R$ 30
📞 Internet: R$ 80-150/mês
💾 Backup nuvem: R$ 20/mês (opcional)

Total inicial: R$ 2.000-3.000
Mensal: R$ 130-200
```

### **☁️ Opção Nuvem (Mensal):**
```
🌤️ Servidor: R$ 50-150/mês
🌍 Domínio: R$ 40/ano
🔒 SSL: Grátis
📊 Monitoramento: R$ 20/mês

Total mensal: R$ 70-170
Anual: R$ 840-2.040
```

---

## ✅ **CHECKLIST DE IMPLANTAÇÃO**

### **🎯 Antes da Implantação:**
```
☐ Definir opção (Local/Nuvem/PC)
☐ Preparar hardware/servidor
☐ Configurar internet e rede
☐ Instalar dependências
☐ Configurar IPs corretos
☐ Testar todo o sistema
☐ Configurar backup
☐ Treinar equipe
☐ Criar manuais de uso
☐ Definir responsáveis
```

### **🚀 Dia da Implantação:**
```
☐ Instalar sistema no local
☐ Configurar rede Wi-Fi
☐ Testar acesso de todos dispositivos
☐ Cadastrar dados da igreja
☐ Criar contas de usuários
☐ Configurar permissões
☐ Testar transações
☐ Treinar equipe no local
☐ Fazer primeiro backup
☐ Documentar configurações
```

### **🔧 Pós-Implantação:**
```
☐ Monitorar por 1 semana
☐ Ajustar configurações
☐ Coletar feedback dos usuários
☐ Verificar backups automáticos
☐ Agendar manutenção mensal
☐ Criar contato de suporte
```

---

## 📞 **SUPORTE E MANUTENÇÃO**

### **🛠️ Manutenção Mensal:**
```
🔍 Verificações:
   • Sistema funcionando
   • Backup atualizado
   • Espaço em disco
   • Atualizações de segurança

📊 Relatórios:
   • Gerar relatório mensal
   • Estatísticas de uso
   • Performance do sistema
```

### **🆘 Contato de Emergência:**
```
📞 Suporte Técnico:
   • Criar WhatsApp da igreja
   • E-mail: suporte@igreja.com
   • Horário: Segunda a Sexta, 9h-17h

🚨 Problemas Comuns:
   • Sistema lento: Reiniciar
   • Não acessa: Verificar internet
   • Erro de login: Verificar caps lock
```

---

## 🎉 **RESUMO EXECUTIVO**

### **🏆 RECOMENDAÇÃO FINAL:**

**Para igreja pequena/média (até 200 membros):**
- ✅ **Opção 3:** Computador da igreja
- 💰 Custo: ~R$ 200/mês (energia + internet)
- 🔧 Manutenção: Simples

**Para igreja grande (200+ membros):**
- ✅ **Opção 1:** Servidor local
- 💰 Custo inicial: ~R$ 2.500
- 🔧 Manutenção: Profissional

**Para múltiplas igrejas/filiais:**
- ✅ **Opção 2:** Servidor na nuvem
- 💰 Custo: ~R$ 100/mês
- 🔧 Manutenção: Automática

### **📋 PRÓXIMOS PASSOS:**
1. **Escolher opção** baseada no tamanho da igreja
2. **Preparar infraestrutura** (hardware/internet)
3. **Agendar implantação** (final de semana)
4. **Treinar equipe** (1-2 semanas antes)
5. **Fazer backup** dos dados atuais
6. **Iniciar operação** gradualmente

**🙏 Que Deus abençoe esta ferramenta na gestão dos dízimos da igreja!**