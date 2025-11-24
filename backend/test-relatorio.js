// Teste isolado da rota de relatórios
const db = require('./config/database-sqlite');

async function testarRelatorio() {
    try {
        console.log('🔄 Testando queries do relatório...\n');
        
        console.log('1. Consultando usuários...');
        const usuarios = await db.query('SELECT id, nome, email, tipo_usuario, status, data_nascimento, data_cadastro FROM usuarios');
        console.log(`✅ ${usuarios.length} usuários encontrados`);
        
        console.log('\n2. Consultando dízimos...');
        const dizimos = await db.query(`
            SELECT d.*, u.nome as usuario_nome 
            FROM dizimos d 
            LEFT JOIN usuarios u ON d.usuario_id = u.id
            ORDER BY d.data_pagamento DESC
        `);
        console.log(`✅ ${dizimos.length} dízimos encontrados`);
        
        console.log('\n3. Consultando ofertas...');
        const ofertas = await db.query(`
            SELECT o.*, u.nome as usuario_nome 
            FROM ofertas o 
            LEFT JOIN usuarios u ON o.usuario_id = u.id
            ORDER BY o.data_cadastro DESC
        `);
        console.log(`✅ ${ofertas.length} ofertas encontradas`);
        
        console.log('\n✅ Todas as queries funcionaram!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testarRelatorio();
