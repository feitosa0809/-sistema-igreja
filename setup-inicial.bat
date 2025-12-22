@echo off
echo =====================================
echo   SETUP INICIAL - Sistema de Gestao
echo =====================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Ir para pasta backend
cd backend

REM Verificar se package.json existe
if not exist package.json (
    echo [ERRO] Arquivo package.json nao encontrado!
    pause
    exit /b 1
)

echo =====================================
echo   Instalando dependencias...
echo =====================================
echo.

REM Instalar dependências
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo =====================================
echo   Configurando arquivo .env...
echo =====================================
echo.

REM Criar .env se não existir
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo [OK] Arquivo .env criado a partir do .env.example
        echo.
        echo [IMPORTANTE] Edite o arquivo backend\.env e configure:
        echo   - JWT_SECRET: Gere uma chave secreta
        echo   - Configuracoes de email SMTP (opcional)
        echo.
    ) else (
        echo [AVISO] Arquivo .env.example nao encontrado
    )
) else (
    echo [OK] Arquivo .env ja existe
)

echo.
echo =====================================
echo   Gerando JWT_SECRET...
echo =====================================
echo.

REM Gerar JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))" > jwt_temp.txt
type jwt_temp.txt
echo.
echo [DICA] Copie a linha acima e cole no arquivo backend\.env
del jwt_temp.txt

echo.
echo =====================================
echo   SETUP CONCLUIDO!
echo =====================================
echo.
echo Proximos passos:
echo.
echo 1. Edite o arquivo backend\.env:
echo    - Cole o JWT_SECRET gerado acima
echo    - Configure SMTP se quiser enviar emails
echo.
echo 2. Inicie o sistema:
echo    - Execute: iniciar-sistema.bat
echo    - Ou execute: cd backend e npm start
echo.
echo 3. Acesse: http://localhost:3000
echo.
echo 4. Faca o primeiro cadastro (sera automaticamente admin)
echo.
echo 5. Configure sua igreja em: Configuracoes
echo.
echo Para mais informacoes, leia: INSTALACAO.md
echo.

pause
