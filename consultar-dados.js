const db = require('./backend/config/database-sqlite');

console.log('═══════════════════════════════════════════════════════════');
console.log('          📊 CONSULTA DE DADOS DO SISTEMA');
console.log('═══════════════════════════════════════════════════════════\n');

async function consultar() {
    try {
        // Consultar usuários
        const usuarios = await db.query('SELECT * FROM usuarios');
        console.log('👥 USUÁRIOS CADASTRADOS:', usuarios.length);
        console.log('───────────────────────────────────────────────────────────');
        usuarios.forEach(user => {
            console.log(`ID: ${user.id} | Nome: ${user.nome} | Email: ${user.email}`);
            console.log(`Tipo: ${user.tipo_usuario} | Status: ${user.status}`);
            console.log(`Data Nascimento: ${user.data_nascimento || 'Não informado'}`);
            console.log('─'.repeat(59));
        });

        // Consultar dízimos
        const dizimos = await db.query('SELECT d.*, u.nome as usuario_nome FROM dizimos d LEFT JOIN usuarios u ON d.usuario_id = u.id');
        console.log('\n💰 DÍZIMOS REGISTRADOS:', dizimos.length);
        console.log('───────────────────────────────────────────────────────────');
        dizimos.forEach(diz => {
            console.log(`ID: ${diz.id} | Usuário: ${diz.usuario_nome}`);
            console.log(`Valor: R$ ${parseFloat(diz.valor).toFixed(2)} | Data: ${diz.data_pagamento}`);
            console.log(`Método: ${diz.metodo_pagamento} | Status: ${diz.status}`);
            console.log('─'.repeat(59));
        });

        // Consultar ofertas
        const ofertas = await db.query('SELECT o.*, u.nome as usuario_nome FROM ofertas o LEFT JOIN usuarios u ON o.usuario_id = u.id');
        console.log('\n🎁 OFERTAS REGISTRADAS:', ofertas.length);
        console.log('───────────────────────────────────────────────────────────');
        ofertas.forEach(oferta => {
            console.log(`ID: ${oferta.id} | Usuário: ${oferta.usuario_nome || 'Anônimo'}`);
            console.log(`Valor: R$ ${parseFloat(oferta.valor).toFixed(2)} | Tipo: ${oferta.tipo_oferta}`);
            console.log(`Data: ${oferta.data_oferta} | Método: ${oferta.metodo_pagamento}`);
            console.log(`Status: ${oferta.status}`);
            console.log('─'.repeat(59));
        });

        // Consultar campanhas
        const campanhas = await db.query('SELECT * FROM campanhas');
        console.log('\n📢 CAMPANHAS:', campanhas.length);
        console.log('───────────────────────────────────────────────────────────');
        campanhas.forEach(camp => {
            console.log(`ID: ${camp.id} | Nome: ${camp.nome}`);
            console.log(`Descrição: ${camp.descricao || 'Sem descrição'}`);
            console.log(`Meta: R$ ${parseFloat(camp.meta_valor || 0).toFixed(2)} | Arrecadado: R$ ${parseFloat(camp.valor_arrecadado || 0).toFixed(2)}`);
            console.log(`Status: ${camp.status}`);
            console.log('─'.repeat(59));
        });

        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('          ✅ CONSULTA FINALIZADA');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

consultar();

