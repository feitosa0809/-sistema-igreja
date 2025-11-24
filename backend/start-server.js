// Script para iniciar o servidor com logs de erro
process.on('uncaughtException', (error) => {
    console.error('❌ ERRO NÃO CAPTURADO:', error);
    console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ PROMISE REJEITADA:', reason);
});

// Iniciar o servidor
require('./server.js');
