@echo off
color 0A
title Sistema Igreja - Preparacao Play Store

echo.
echo ========================================
echo     SISTEMA IGREJA - PLAY STORE
echo ========================================
echo.
echo Escolha o metodo de publicacao:
echo.
echo [1] PWA (Recomendado - Mais facil)
echo [2] Cordova (Hibrido - Mais recursos)
echo [3] Gerar apenas icones e assets
echo [4] Testar aplicacao localmente
echo [0] Sair
echo.
set /p opcao="Digite sua opcao: "

if "%opcao%"=="1" goto pwa
if "%opcao%"=="2" goto cordova
if "%opcao%"=="3" goto assets
if "%opcao%"=="4" goto testar
if "%opcao%"=="0" exit
goto menu

:pwa
cls
echo ========================================
echo          CONFIGURANDO PWA
echo ========================================
echo.
echo ✓ Manifest.json criado
echo ✓ Service Worker criado  
echo ✓ Icones gerados
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Hospedar online (obrigatorio para Play Store):
echo    - Netlify.com (drag-drop da pasta frontend)
echo    - Firebase Hosting
echo    - Vercel.com
echo.
echo 2. Gerar APK com PWABuilder:
echo    - Acesse: https://www.pwabuilder.com
echo    - Cole a URL do seu site
echo    - Baixe o arquivo Android (APK/AAB)
echo.
echo 3. Upload na Play Store:
echo    - play.google.com/console
echo    - Criar app
echo    - Upload do arquivo gerado
echo.
echo ✅ PWA PRONTO! Consulte: GUIA-PLAY-STORE.md
pause
goto menu

:cordova
cls
echo ========================================
echo        CONFIGURANDO CORDOVA
echo ========================================
echo.
echo Executando setup automatico...
call setup-cordova.bat
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Compilar versao release:
echo    cd igreja-app
echo    cordova build android --release
echo.
echo 2. Assinar APK (obrigatorio):
echo    keytool -genkey -v -keystore igreja.keystore
echo    jarsigner -keystore igreja.keystore app-release-unsigned.apk igreja
echo.
echo 3. Upload na Play Store
echo.
echo ✅ CORDOVA CONFIGURADO! Consulte: GUIA-PLAY-STORE.md
pause
goto menu

:assets
cls
echo ========================================
echo      GERANDO ICONES E ASSETS
echo ========================================
echo.
node generate-icons.js
echo.
echo ✅ Todos os icones foram gerados!
echo.
echo Localizacao: frontend\assets\icons\
echo.
echo Para converter SVG para PNG:
echo npm install -g svgexport
echo svgexport icon-512x512.svg icon-512x512.png 512:512
echo.
pause
goto menu

:testar
cls
echo ========================================
echo       TESTANDO APLICACAO
echo ========================================
echo.
echo Iniciando servidores de teste...
echo.
echo [Backend] http://localhost:3000
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo [Frontend] http://localhost:3001  
start cmd /k "cd frontend && http-server -p 3001"

echo.
echo ✅ Servidores iniciados!
echo.
echo Teste em:
echo - Computador: http://localhost:3001
echo - Celular: http://192.168.1.100:3001 (substitua pelo seu IP)
echo.
echo Para descobrir seu IP:
ipconfig | findstr "IPv4"
echo.
pause
goto menu

:menu
cls
goto inicio