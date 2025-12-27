@echo off
cls
echo.
echo ========================================
echo   CORRECAO APLICADA - ANIVERSARIANTES
echo ========================================
echo.
echo PROBLEMA: Token nao estava sendo encontrado
echo CAUSA: Pagina procurava 'token' mas o sistema usa 'authToken'
echo SOLUCAO: Corrigido para usar 'authToken' em todas as funcoes
echo.
echo ========================================
echo   COMO TESTAR AGORA:
echo ========================================
echo.
echo OPCAO 1 - Se voce JA FEZ LOGIN hoje:
echo -----------------------------------------
echo   1. Abra: http://localhost:3000/aniversariantes.html
echo   2. Deve carregar os aniversariantes automaticamente!
echo.
echo OPCAO 2 - Se AINDA NAO fez login:
echo -----------------------------------------
echo   1. Abra: http://localhost:3000
echo   2. Faca login:
echo      Email: admin@igreja.com
echo      Senha: 123456
echo   3. Clique em "Aniversariantes" no menu
echo   4. Deve mostrar 4 aniversariantes de dezembro!
echo.
echo ========================================
echo   RESULTADO ESPERADO:
echo ========================================
echo.
echo Voce deve ver:
echo - 4 aniversariantes em Dezembro
echo - Joao (02/dez) - 43 anos
echo - Renata Silva (05/dez) - 29 anos
echo - Carlos (20/dez) - 43 anos
echo - maria ap (26/dez) - 44 anos [HOJE!]
echo.
echo ========================================
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

echo.
echo Abrindo navegador...
start http://localhost:3000/aniversariantes.html

echo.
echo Se aparecer erro "Token nao encontrado", 
echo faca login primeiro em: http://localhost:3000
echo.
pause
