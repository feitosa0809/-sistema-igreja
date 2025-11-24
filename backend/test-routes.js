console.log('Testando carregamento de rotas...\n');

try {
  console.log('1. Carregando auth...');
  const authRoutes = require('./routes/auth');
  console.log('✅ auth carregado');

  console.log('2. Carregando users...');
  const userRoutes = require('./routes/users');
  console.log('✅ users carregado');

  console.log('3. Carregando donations...');
  const donationRoutes = require('./routes/donations');
  console.log('✅ donations carregado');

  console.log('4. Carregando reports...');
  const reportRoutes = require('./routes/reports');
  console.log('✅ reports carregado');

  console.log('5. Carregando admin...');
  const adminRoutes = require('./routes/admin');
  console.log('✅ admin carregado');

  console.log('6. Carregando birthdays...');
  const birthdayRoutes = require('./routes/birthdays');
  console.log('✅ birthdays carregado');

  console.log('7. Carregando relatorios...');
  const relatoriosRoutes = require('./routes/relatorios');
  console.log('✅ relatorios carregado');

  console.log('\n✅ Todos os módulos carregados com sucesso!');
} catch (error) {
  console.error('\n❌ Erro ao carregar módulo:', error.message);
  console.error(error.stack);
  process.exit(1);
}
