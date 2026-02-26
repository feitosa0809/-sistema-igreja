const { execSync } = require('child_process');

function killPort3000IfNeeded() {
  try {
    const output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
    const lines = output.split(/\r?\n/);

    const pids = new Set();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (!trimmed.includes(':3000')) continue;
      if (!trimmed.toUpperCase().includes('LISTENING')) continue;

      const parts = trimmed.split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) {
        pids.add(pid);
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        console.log(`🧹 Processo encerrado na porta 3000 (PID ${pid})`);
      } catch {
        // Ignorar falhas individuais para não interromper o start
      }
    }
  } catch {
    // Se netstat/taskkill falhar, segue start normal
  }
}

killPort3000IfNeeded();
require('../server');
