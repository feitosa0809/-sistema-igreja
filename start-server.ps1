Write-Host "Iniciando servidor do sistema de igreja..." -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

Set-Location "F:\Backup\disco c\tcc1\backend"
& node server.js

Read-Host "Pressione Enter para fechar"
