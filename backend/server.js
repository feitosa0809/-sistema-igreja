console.log('🔧 Carregando dependências...');
const express = require('express');
const cors = require('cors');
const path = require('path');

console.log(' Carregando rotas...');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const donationRoutes = require('./routes/donations');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const birthdayRoutes = require('./routes/birthdays');
const relatoriosRoutes = require('./routes/relatorios');
const usuariosRoutes = require('./routes/usuarios');
const configRoutes = require('./routes/config');
const backupRoutes = require('./routes/backup');
const dashboardRoutes = require('./routes/dashboard');
const pdfRoutes = require('./routes/pdf');
const notificacoesRoutes = require('./routes/notificacoes');
const destinacaoRoutes = require('./routes/destinacao');
const metasArrecadacaoRoutes = require('./routes/metas-arrecadacao');
const auditoriaRoutes = require('./routes/auditoria');
const membrosRoutes = require('./routes/membros');
const campanhasRoutes = require('./routes/campanhas');
const exportExcelRoutes = require('./routes/export-excel');
const twoFactorRoutes = require('./routes/2fa');

console.log(' Iniciando Express...');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static('public/uploads'));

console.log(' Registrando rotas...');
// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/birthdays', birthdayRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/config', configRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/destinacao', destinacaoRoutes);
app.use('/api/metas-arrecadacao', metasArrecadacaoRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/membros', membrosRoutes);
app.use('/api/campanhas', campanhasRoutes);
app.use('/api/export', exportExcelRoutes);
app.use('/api/2fa', twoFactorRoutes);
console.log(' Rotas registradas');

// Rota de saúde da API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Servir frontend em rotas não-API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` Acesse: http://localhost:${PORT}`);
  
  // Iniciar backup automático (a cada 24 horas)
  const backup = require('./utils/backup');
  backup.agendarBackupAutomatico(24);
  console.log(' Backup automático ativado (a cada 24 horas)');

  // Iniciar envio automático de emails de aniversário (diário às 8h)
  agendarEmailsAniversario();
  console.log(' Emails de aniversário agendados (diário às 8h)');
});

// Função para agendar emails de aniversário
function agendarEmailsAniversario() {
  const emailService = require('./utils/emailService');
  const db = require('./config/database-sqlite');

  // Executar diariamente
  const verificarAniversariantes = async () => {
    try {
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');

      const aniversariantes = await db.all(`
        SELECT id, nome, email, data_nascimento
        FROM usuarios
        WHERE strftime('%m-%d', data_nascimento) = ?
        AND status = 'ativo'
        AND email IS NOT NULL
        AND email != ''
      `, [`${mes}-${dia}`]);

      if (aniversariantes.length > 0) {
        console.log(`Encontrados ${aniversariantes.length} aniversariante(s) hoje`);

        for (const usuario of aniversariantes) {
          try {
            await emailService.enviarEmailAniversario(usuario);
            console.log(` Email de aniversário enviado para ${usuario.nome}`);
          } catch (error) {
            console.error(`Erro ao enviar email para ${usuario.nome}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(' Erro ao processar aniversariantes:', error.message);
    }
  };

  // Executar imediatamente ao iniciar (para teste)
  // verificarAniversariantes();

  // Calcular tempo até as 8h da manhã
  const agora = new Date();
  const proximaExecucao = new Date();
  proximaExecucao.setHours(8, 0, 0, 0);

  // Se já passou das 8h hoje, agendar para amanhã
  if (agora.getHours() >= 8) {
    proximaExecucao.setDate(proximaExecucao.getDate() + 1);
  }

  const milissegundosAteProximaExecucao = proximaExecucao.getTime() - agora.getTime();

  // Agendar primeira execução
  setTimeout(() => {
    verificarAniversariantes();
    // Depois executar a cada 24 horas
    setInterval(verificarAniversariantes, 24 * 60 * 60 * 1000);
  }, milissegundosAteProximaExecucao);
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error(' Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Promise rejeitada não tratada:', reason);
});

server.on('error', (error) => {
  console.error(' Erro no servidor:', error);
});