# Script de Backup Automático do Sistema de Dízimos
# Execute este script regularmente para fazer backup dos dados

param(
    [string]$DestinoPadrao = "D:\Backup\SistemaDizimos"
)

# Configurações
$DataAtual = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$PastaOrigem = Split-Path $MyInvocation.MyCommand.Path
$PastaDestino = "$DestinoPadrao\Backup_$DataAtual"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BACKUP DO SISTEMA DE DÍZIMOS - IGREJA" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a pasta de destino existe
Write-Host "[1/6] Verificando pasta de destino..." -ForegroundColor Yellow
if (!(Test-Path $DestinoPadrao)) {
    Write-Host "Criando pasta de backup: $DestinoPadrao" -ForegroundColor Green
    New-Item -ItemType Directory -Path $DestinoPadrao -Force | Out-Null
}

# Criar pasta do backup atual
Write-Host "[2/6] Criando pasta do backup atual..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $PastaDestino -Force | Out-Null

# Parar serviços temporariamente para backup consistente
Write-Host "[3/6] Parando serviços temporariamente..." -ForegroundColor Yellow
$ProcessosParados = @()
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    $ProcessosParados += $_.Id
    Stop-Process -Id $_.Id -Force
}
Start-Sleep -Seconds 3

try {
    # Backup dos arquivos do sistema
    Write-Host "[4/6] Fazendo backup dos arquivos..." -ForegroundColor Yellow
    
    # Copiar backend
    $BackendOrigem = Join-Path $PastaOrigem "backend"
    $BackendDestino = Join-Path $PastaDestino "backend"
    if (Test-Path $BackendOrigem) {
        Copy-Item -Path $BackendOrigem -Destination $BackendDestino -Recurse -Force
        Write-Host "  ✓ Backend copiado" -ForegroundColor Green
    }
    
    # Copiar frontend
    $FrontendOrigem = Join-Path $PastaOrigem "frontend"
    $FrontendDestino = Join-Path $PastaDestino "frontend"
    if (Test-Path $FrontendOrigem) {
        Copy-Item -Path $FrontendOrigem -Destination $FrontendDestino -Recurse -Force
        Write-Host "  ✓ Frontend copiado" -ForegroundColor Green
    }
    
    # Copiar scripts
    $Scripts = @("*.bat", "*.ps1", "*.md")
    foreach ($Script in $Scripts) {
        Get-ChildItem -Path $PastaOrigem -Filter $Script | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination $PastaDestino -Force
        }
    }
    Write-Host "  ✓ Scripts copiados" -ForegroundColor Green
    
    # Backup especial do banco de dados
    Write-Host "[5/6] Fazendo backup do banco de dados..." -ForegroundColor Yellow
    $DatabaseOrigem = Join-Path $BackendOrigem "database.sqlite"
    $DatabaseDestino = Join-Path $PastaDestino "database_$DataAtual.sqlite"
    if (Test-Path $DatabaseOrigem) {
        Copy-Item -Path $DatabaseOrigem -Destination $DatabaseDestino -Force
        Write-Host "  ✓ Banco de dados copiado" -ForegroundColor Green
    }
    
    # Criar relatório de backup
    Write-Host "[6/6] Criando relatório de backup..." -ForegroundColor Yellow
    $Relatorio = @"
BACKUP DO SISTEMA DE DÍZIMOS
=============================

Data/Hora: $DataAtual
Origem: $PastaOrigem
Destino: $PastaDestino

Arquivos incluídos:
- Backend completo (Node.js)
- Frontend completo (HTML/JS/CSS)
- Banco de dados SQLite
- Scripts de inicialização
- Documentação

Tamanho total: $('{0:N2} MB' -f ((Get-ChildItem -Path $PastaDestino -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB))

Status: SUCESSO
"@
    
    $Relatorio | Out-File -FilePath (Join-Path $PastaDestino "RELATORIO-BACKUP.txt") -Encoding UTF8
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " BACKUP REALIZADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Localização: $PastaDestino" -ForegroundColor White
    Write-Host "Tamanho: $('{0:N2} MB' -f ((Get-ChildItem -Path $PastaDestino -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB))" -ForegroundColor White
    
    # Limpar backups antigos (manter apenas os últimos 7)
    Write-Host ""
    Write-Host "Limpando backups antigos..." -ForegroundColor Yellow
    Get-ChildItem -Path $DestinoPadrao -Filter "Backup_*" | Sort-Object CreationTime -Descending | Select-Object -Skip 7 | ForEach-Object {
        Write-Host "Removendo backup antigo: $($_.Name)" -ForegroundColor Gray
        Remove-Item -Path $_.FullName -Recurse -Force
    }
    
} catch {
    Write-Host ""
    Write-Host "ERRO durante o backup: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Reiniciar serviços
    Write-Host ""
    Write-Host "Reiniciando sistema..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    # Verificar se existe script de inicialização
    $ScriptIniciar = Join-Path $PastaOrigem "iniciar-sistema.bat"
    if (Test-Path $ScriptIniciar) {
        Start-Process -FilePath $ScriptIniciar -WindowStyle Hidden
        Write-Host "Sistema reiniciado automaticamente" -ForegroundColor Green
    } else {
        Write-Host "Execute iniciar-sistema.bat para reiniciar" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")