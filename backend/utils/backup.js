const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configurações
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');
const MAX_BACKUPS = 30; // Manter últimos 30 backups

// Criar diretório de backup se não existir
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Diretório de backups criado');
}

/**
 * Criar backup do banco de dados
 */
async function criarBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const backupFileName = `backup-${timestamp}.sqlite`;
        const backupPath = path.join(BACKUP_DIR, backupFileName);
        
        console.log(`🔄 Iniciando backup: ${backupFileName}`);
        
        // Copiar arquivo do banco de dados
        fs.copyFileSync(DB_PATH, backupPath);
        
        // Obter tamanho do arquivo
        const stats = fs.statSync(backupPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`✅ Backup criado com sucesso!`);
        console.log(`   Arquivo: ${backupFileName}`);
        console.log(`   Tamanho: ${fileSizeInMB} MB`);
        console.log(`   Local: ${BACKUP_DIR}`);
        
        // Limpar backups antigos
        await limparBackupsAntigos();
        
        return {
            success: true,
            filename: backupFileName,
            path: backupPath,
            size: fileSizeInMB,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ Erro ao criar backup:', error);
        throw error;
    }
}

/**
 * Limpar backups antigos (manter apenas os últimos MAX_BACKUPS)
 */
async function limparBackupsAntigos() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('backup-') && file.endsWith('.sqlite'))
            .map(file => ({
                name: file,
                path: path.join(BACKUP_DIR, file),
                time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);
        
        if (files.length > MAX_BACKUPS) {
            const filesToDelete = files.slice(MAX_BACKUPS);
            
            console.log(`🗑️  Removendo ${filesToDelete.length} backup(s) antigo(s)...`);
            
            for (const file of filesToDelete) {
                fs.unlinkSync(file.path);
                console.log(`   Removido: ${file.name}`);
            }
        }
    } catch (error) {
        console.error('⚠️  Erro ao limpar backups antigos:', error);
    }
}

/**
 * Listar todos os backups disponíveis
 */
function listarBackups() {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith('backup-') && file.endsWith('.sqlite'))
            .map(file => {
                const filePath = path.join(BACKUP_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    path: filePath,
                    size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
                    date: stats.mtime.toISOString(),
                    timestamp: stats.mtime.getTime()
                };
            })
            .sort((a, b) => b.timestamp - a.timestamp);
        
        return files;
    } catch (error) {
        console.error('❌ Erro ao listar backups:', error);
        return [];
    }
}

/**
 * Restaurar backup
 */
async function restaurarBackup(backupFileName) {
    try {
        const backupPath = path.join(BACKUP_DIR, backupFileName);
        
        if (!fs.existsSync(backupPath)) {
            throw new Error('Arquivo de backup não encontrado');
        }
        
        console.log(`🔄 Restaurando backup: ${backupFileName}`);
        
        // Criar backup do banco atual antes de restaurar
        const currentBackupName = `backup-before-restore-${Date.now()}.sqlite`;
        const currentBackupPath = path.join(BACKUP_DIR, currentBackupName);
        fs.copyFileSync(DB_PATH, currentBackupPath);
        console.log(`   Backup de segurança criado: ${currentBackupName}`);
        
        // Restaurar backup
        fs.copyFileSync(backupPath, DB_PATH);
        
        console.log(`✅ Backup restaurado com sucesso!`);
        
        return {
            success: true,
            restored: backupFileName,
            safetyCopy: currentBackupName
        };
    } catch (error) {
        console.error('❌ Erro ao restaurar backup:', error);
        throw error;
    }
}

/**
 * Agendar backups automáticos
 */
function agendarBackupAutomatico(intervaloHoras = 24) {
    const intervaloMs = intervaloHoras * 60 * 60 * 1000;
    
    console.log(`⏰ Backup automático agendado a cada ${intervaloHoras} horas`);
    
    // Executar primeiro backup imediatamente
    criarBackup().catch(console.error);
    
    // Agendar backups periódicos
    setInterval(() => {
        console.log('\n⏰ Executando backup automático agendado...');
        criarBackup().catch(console.error);
    }, intervaloMs);
}

/**
 * Obter estatísticas de backups
 */
function obterEstatisticasBackup() {
    try {
        const backups = listarBackups();
        const totalSize = backups.reduce((sum, backup) => {
            return sum + parseFloat(backup.size);
        }, 0);
        
        return {
            total: backups.length,
            totalSize: totalSize.toFixed(2) + ' MB',
            oldest: backups.length > 0 ? backups[backups.length - 1].date : null,
            newest: backups.length > 0 ? backups[0].date : null,
            backups: backups
        };
    } catch (error) {
        console.error('❌ Erro ao obter estatísticas:', error);
        return null;
    }
}

module.exports = {
    criarBackup,
    listarBackups,
    restaurarBackup,
    agendarBackupAutomatico,
    limparBackupsAntigos,
    obterEstatisticasBackup
};

// Se executado diretamente
if (require.main === module) {
    console.log('🔧 Utilitário de Backup do Sistema\n');
    
    const args = process.argv.slice(2);
    const comando = args[0];
    
    switch (comando) {
        case 'criar':
            criarBackup().then(() => process.exit(0)).catch(() => process.exit(1));
            break;
        case 'listar':
            const backups = listarBackups();
            console.log(`📋 Total de backups: ${backups.length}\n`);
            backups.forEach((backup, index) => {
                console.log(`${index + 1}. ${backup.name}`);
                console.log(`   Tamanho: ${backup.size}`);
                console.log(`   Data: ${new Date(backup.timestamp).toLocaleString('pt-BR')}\n`);
            });
            process.exit(0);
            break;
        case 'restaurar':
            const backupName = args[1];
            if (!backupName) {
                console.error('❌ Especifique o nome do backup');
                process.exit(1);
            }
            restaurarBackup(backupName).then(() => process.exit(0)).catch(() => process.exit(1));
            break;
        case 'stats':
            const stats = obterEstatisticasBackup();
            console.log('📊 Estatísticas de Backup:\n');
            console.log(`Total de backups: ${stats.total}`);
            console.log(`Espaço total: ${stats.totalSize}`);
            console.log(`Backup mais antigo: ${stats.oldest ? new Date(stats.oldest).toLocaleString('pt-BR') : 'N/A'}`);
            console.log(`Backup mais recente: ${stats.newest ? new Date(stats.newest).toLocaleString('pt-BR') : 'N/A'}`);
            process.exit(0);
            break;
        default:
            console.log('Uso:');
            console.log('  node backup.js criar          - Criar novo backup');
            console.log('  node backup.js listar         - Listar backups disponíveis');
            console.log('  node backup.js restaurar <nome> - Restaurar um backup');
            console.log('  node backup.js stats          - Ver estatísticas');
            process.exit(0);
    }
}
