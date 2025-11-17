@echo off
echo ====================================
echo     CONFIGURANDO CORDOVA/PHONEGAP
echo ====================================

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js não encontrado! Instale primeiro: https://nodejs.org
    pause
    exit /b 1
)

REM Instalar Cordova globalmente
echo Instalando Apache Cordova...
npm install -g cordova

REM Criar projeto Cordova
echo Criando projeto Cordova...
cordova create igreja-app com.igreja.dizimos "Igreja App"

cd igreja-app

REM Adicionar plataforma Android
echo Adicionando plataforma Android...
cordova platform add android

REM Copiar arquivos da aplicação web
echo Copiando arquivos do frontend...
xcopy /E /Y "..\frontend\*" "www\"

REM Instalar plugins essenciais
echo Instalando plugins...
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-inappbrowser

REM Configurar config.xml
echo Configurando aplicação...
(
echo ^<?xml version='1.0' encoding='utf-8'?^>
echo ^<widget id="com.igreja.dizimos" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0"^>
echo     ^<name^>Sistema Igreja^</name^>
echo     ^<description^>
echo         Sistema completo de gestão financeira para igrejas
echo     ^</description^>
echo     ^<author email="dev@igreja.com" href="http://igreja.com"^>
echo         Equipe de Desenvolvimento
echo     ^</author^>
echo     ^<content src="index.html" /^>
echo     ^<allow-intent href="http://*/*" /^>
echo     ^<allow-intent href="https://*/*" /^>
echo     ^<allow-intent href="tel:*" /^>
echo     ^<allow-intent href="sms:*" /^>
echo     ^<allow-intent href="mailto:*" /^>
echo     ^<allow-intent href="geo:*" /^>
echo     ^<platform name="android"^>
echo         ^<allow-intent href="market:*" /^>
echo         ^<preference name="Orientation" value="portrait" /^>
echo         ^<preference name="Fullscreen" value="false" /^>
echo         ^<preference name="KeepRunning" value="true" /^>
echo         ^<preference name="LoadUrlTimeoutValue" value="60000" /^>
echo         ^<icon src="res/android/icon-36-ldpi.png" density="ldpi" /^>
echo         ^<icon src="res/android/icon-48-mdpi.png" density="mdpi" /^>
echo         ^<icon src="res/android/icon-72-hdpi.png" density="hdpi" /^>
echo         ^<icon src="res/android/icon-96-xhdpi.png" density="xhdpi" /^>
echo         ^<icon src="res/android/icon-144-xxhdpi.png" density="xxhdpi" /^>
echo         ^<icon src="res/android/icon-192-xxxhdpi.png" density="xxxhdpi" /^>
echo     ^</platform^>
echo     ^<access origin="*" /^>
echo ^</widget^>
) > config.xml

echo ====================================
echo     CORDOVA CONFIGURADO COM SUCESSO!
echo ====================================
echo.
echo Para compilar o APK:
echo 1. cd igreja-app
echo 2. cordova build android
echo 3. cordova build android --release (para produção)
echo.
echo APK será gerado em: platforms\android\app\build\outputs\apk
echo.
pause