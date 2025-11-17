@echo off
title Sistema de Dizimos - Igreja - Parar
color 0C

echo.
echo  ========================================
echo   SISTEMA DE DIZIMOS E OFERTAS - IGREJA
echo  ========================================
echo.
echo  Parando servidores...
echo.

REM Matar todos os processos Node.js
echo  [1/2] Parando servidores Backend e Frontend...
taskkill /f /im node.exe >nul 2>&1

REM Aguardar
timeout /t 2 >nul

REM Verificar se os processos foram parados
echo  [2/2] Verificando se os servidores pararam...
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
    echo  ✓ Backend parado (porta 3000 livre)
) else (
    echo  ! Backend ainda pode estar rodando
)

netstat -ano | findstr ":3001" >nul
if errorlevel 1 (
    echo  ✓ Frontend parado (porta 3001 livre)
) else (
    echo  ! Frontend ainda pode estar rodando
)

echo.
echo  ========================================
echo   SISTEMA PARADO COM SUCESSO!
echo  ========================================
echo.
echo   Para INICIAR novamente:
echo   → Execute: iniciar-sistema.bat
echo.
echo   Para VERIFICAR status:
echo   → Execute: status-sistema.bat
echo.
echo  ========================================
echo.
echo  Pressione qualquer tecla para fechar...
pause >nul