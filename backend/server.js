const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const donationRoutes = require('./routes/donations');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const birthdayRoutes = require('./routes/birthdays');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Permitir localhost e qualquer IP da rede 192.168.x.x
    if (!origin || origin.match(/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):(3001|3000)$/)) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir tudo durante desenvolvimento
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/birthdays', birthdayRoutes);

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

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Backend rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em:`);
  console.log(`   - Local: http://localhost:${PORT}/api`);
  console.log(`   - Rede: http://192.168.4.12:${PORT}/api`);
  console.log(`📊 Health check: http://192.168.4.12:${PORT}/api/health`);
  console.log(`📱 Acesso de celular/tablet: http://192.168.4.12:${PORT}`);
});