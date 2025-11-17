@echo off
title Sistema de Dizimos - Igreja - Iniciar
color 0A

echo.
echo  ========================================
echo   SISTEMA DE DIZIMOS E OFERTAS - IGREJA
echo  ========================================
echo.
echo  Iniciando servidores...
echo.

REM Verificar se Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERRO: Node.js nao encontrado!
    echo  Por favor, instale Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM Matar processos anteriores
echo  [1/4] Parando processos anteriores...
taskkill /f /im node.exe >nul 2>&1

REM Aguardar
timeout /t 3 >nul

REM Iniciar Backend
echo  [2/4] Iniciando servidor Backend (API)...
cd /d "%~dp0backend"
start "Backend-Igreja" cmd /k "echo Servidor Backend da Igreja && echo URL: http://192.168.1.100:3000/api && echo. && node server.js"

REM Aguardar o backend iniciar
timeout /t 5 >nul

REM Iniciar Frontend
echo  [3/4] Iniciando servidor Frontend (Interface)...
cd /d "%~dp0frontend"
start "Frontend-Igreja" cmd /k "echo Servidor Frontend da Igreja && echo URL: http://192.168.1.100:3001 && echo. && http-server -p 3001 -a 0.0.0.0 -c-1 --cors"

REM Aguardar o frontend iniciar
timeout /t 5 >nul

REM Verificar se os servidores estao rodando
echo  [4/4] Verificando servidores...
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
    echo  AVISO: Backend pode nao ter iniciado corretamente.
) else (
    echo  ✓ Backend rodando na porta 3000
)

netstat -ano | findstr ":3001" >nul
if errorlevel 1 (
    echo  AVISO: Frontend pode nao ter iniciado corretamente.
) else (
    echo  ✓ Frontend rodando na porta 3001
)

echo.
echo  ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo  ========================================
echo.
echo   URLs de Acesso:
echo   ✓ Sistema Principal: http://192.168.1.100:3001
echo   ✓ Area de Pagamentos: http://192.168.1.100:3001/pagamentos.html
echo   ✓ Administracao: http://192.168.1.100:3001/admin.html
echo   ✓ Versao Mobile: http://192.168.1.100:3001/mobile.html
echo.
echo   Para CELULAR/TABLET:
echo   → Conecte no Wi-Fi da igreja
echo   → Acesse: http://192.168.1.100:3001
echo.
echo   Para PARAR o sistema:
echo   → Execute: parar-sistema.bat
echo.
echo  ========================================

REM Abrir pagina principal automaticamente
timeout /t 3 >nul
echo  Abrindo sistema no navegador...
start http://192.168.1.100:3001

echo.
echo  Pressione qualquer tecla para fechar...
pause >nul