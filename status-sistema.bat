@echo off
title Sistema de Dizimos - Igreja - Status
color 0B

echo.
echo  ========================================
echo   SISTEMA DE DIZIMOS E OFERTAS - IGREJA
echo   STATUS DO SISTEMA
echo  ========================================
echo.

REM Verificar se Node.js esta instalado
echo  [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  ❌ Node.js NAO INSTALADO
    echo      Download: https://nodejs.org/
) else (
    for /f "tokens=*" %%i in ('node --version') do echo  ✓ Node.js %%i instalado
)

echo.
REM Verificar se http-server esta instalado
echo  [2/5] Verificando http-server...
http-server --version >nul 2>&1
if errorlevel 1 (
    echo  ❌ http-server NAO INSTALADO
    echo      Execute: npm install -g http-server
) else (
    for /f "tokens=*" %%i in ('http-server --version') do echo  ✓ http-server %%i instalado
)

echo.
REM Verificar Backend (porta 3000)
echo  [3/5] Verificando Backend (porta 3000)...
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
    echo  ❌ Backend NAO ESTA RODANDO
) else (
    echo  ✓ Backend RODANDO na porta 3000
    
    REM Testar API
    echo      Testando API...
    powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -TimeoutSec 5; Write-Host '     ✓ API funcionando' } catch { Write-Host '     ❌ API nao responde' }" 2>nul
)

echo.
REM Verificar Frontend (porta 3001)
echo  [4/5] Verificando Frontend (porta 3001)...
netstat -ano | findstr ":3001" >nul
if errorlevel 1 (
    echo  ❌ Frontend NAO ESTA RODANDO
) else (
    echo  ✓ Frontend RODANDO na porta 3001
)

echo.
REM Verificar conectividade de rede
echo  [5/5] Verificando rede...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%i
    set IP=!IP: =!
)
if defined IP (
    echo  ✓ IP da rede: %IP%
    echo      URLs de acesso:
    echo      • Local: http://localhost:3001
    echo      • Rede: http://%IP%:3001
) else (
    echo  ❌ Nao foi possivel detectar IP da rede
)

echo.
echo  ========================================
echo   RESUMO DO STATUS
echo  ========================================

REM Resumo geral
netstat -ano | findstr ":3000" >nul && netstat -ano | findstr ":3001" >nul
if errorlevel 1 (
    echo  🔴 SISTEMA NAO ESTA FUNCIONANDO
    echo.
    echo     Para iniciar:
    echo     → Execute: iniciar-sistema.bat
) else (
    echo  🟢 SISTEMA FUNCIONANDO NORMALMENTE
    echo.
    echo     URLs principais:
    echo     • Sistema: http://%IP%:3001
    echo     • Admin: http://%IP%:3001/admin.html
    echo     • Mobile: http://%IP%:3001/mobile.html
)

echo.
echo  ========================================
echo.
echo  Pressione qualquer tecla para sair...
pause >nul