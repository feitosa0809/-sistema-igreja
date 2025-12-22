const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor de teste rodando na porta ${PORT}`);
});

// Manter o processo vivo
process.stdin.resume();
