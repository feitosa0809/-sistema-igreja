@echo off
chcp 65001 > nul
title 🧹 Limpar Cache dos Navegadores
color 0E

echo.
echo ══════════════════════════════════════════════════════════
echo    🧹 LIMPEZA DE CACHE DOS NAVEGADORES
echo ══════════════════════════════════════════════════════════
echo.
echo Este script vai limpar o cache dos navegadores.
echo.
echo Escolha uma opção:
echo.
echo [1] Chrome / Edge
echo [2] Firefox
echo [3] Todos os navegadores
echo [4] Apenas mostrar instruções manuais
echo [0] Cancelar
echo.
set /p opcao="Digite sua escolha: "

if "%opcao%"=="1" goto chrome
if "%opcao%"=="2" goto firefox
if "%opcao%"=="3" goto todos
if "%opcao%"=="4" goto manual
if "%opcao%"=="0" goto fim
goto fim

:chrome
echo.
echo 🔵 Limpando cache do Chrome e Edge...
echo.
taskkill /F /IM chrome.exe /T >nul 2>&1
taskkill /F /IM msedge.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

REM Limpar cache do Chrome
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Service Worker" 2>nul

REM Limpar cache do Edge
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Code Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Service Worker" 2>nul

echo ✅ Cache do Chrome e Edge limpo!
goto abrir

:firefox
echo.
echo 🦊 Limpando cache do Firefox...
echo.
taskkill /F /IM firefox.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

for /d %%x in ("%APPDATA%\Mozilla\Firefox\Profiles\*") do (
    rd /s /q "%%x\cache2" 2>nul
    rd /s /q "%%x\startupCache" 2>nul
    rd /s /q "%%x\OfflineCache" 2>nul
)

echo ✅ Cache do Firefox limpo!
goto abrir

:todos
echo.
echo 🌐 Limpando cache de TODOS os navegadores...
echo.

REM Fechar navegadores
taskkill /F /IM chrome.exe /T >nul 2>&1
taskkill /F /IM msedge.exe /T >nul 2>&1
taskkill /F /IM firefox.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

REM Chrome
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Service Worker" 2>nul

REM Edge
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Code Cache" 2>nul
rd /s /q "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Service Worker" 2>nul

REM Firefox
for /d %%x in ("%APPDATA%\Mozilla\Firefox\Profiles\*") do (
    rd /s /q "%%x\cache2" 2>nul
    rd /s /q "%%x\startupCache" 2>nul
    rd /s /q "%%x\OfflineCache" 2>nul
)

echo ✅ Cache de todos os navegadores limpo!
goto abrir

:manual
echo.
echo ══════════════════════════════════════════════════════════
echo    📖 INSTRUÇÕES MANUAIS
echo ══════════════════════════════════════════════════════════
echo.
echo 🔵 CHROME / EDGE:
echo    1. Pressione: Ctrl + Shift + Delete
echo    2. Selecione "Desde sempre"
echo    3. Marque "Imagens e arquivos em cache"
echo    4. Clique em "Limpar dados"
echo.
echo 🦊 FIREFOX:
echo    1. Pressione: Ctrl + Shift + Delete
echo    2. Marque "Cache"
echo    3. Clique em "Limpar agora"
echo.
echo ⚡ ATALHO RÁPIDO (qualquer navegador):
echo    Pressione: Ctrl + Shift + R
echo    ou
echo    Pressione: Ctrl + F5
echo.
pause
goto fim

:abrir
echo.
echo ══════════════════════════════════════════════════════════
echo.
echo ✅ CACHE LIMPO COM SUCESSO!
echo.
echo 🚀 Abrindo o sistema em modo anônimo...
echo    (Sem cache, sem histórico)
echo.
timeout /t 3 /nobreak >nul

REM Tentar abrir em modo anônimo
start chrome --incognito http://localhost:3000 2>nul
start msedge --inprivate http://localhost:3000 2>nul
start firefox -private-window http://localhost:3000 2>nul

echo.
echo ══════════════════════════════════════════════════════════
echo    📋 PRÓXIMOS PASSOS
echo ══════════════════════════════════════════════════════════
echo.
echo 1. Uma janela anônima deve ter aberto automaticamente
echo 2. Faça login com:
echo    📧 Email: admin@igreja.com
echo    🔑 Senha: 123456
echo.
echo 3. Se o problema persistir:
echo    - Feche TODAS as abas do localhost:3000
echo    - Execute este script novamente
echo    - Use a opção manual (Ctrl + Shift + R)
echo.

:fim
echo.
echo Pressione qualquer tecla para sair...
pause >nul
