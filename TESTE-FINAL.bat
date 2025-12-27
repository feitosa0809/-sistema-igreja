@echo off
cls
echo.
echo ================================================
echo   TESTE DE ANIVERSARIANTES - PASSO A PASSO
echo ================================================
echo.
echo IMPORTANTE: Siga exatamente estas instrucoes!
echo.
echo 1. Uma pagina vai abrir no navegador
echo 2. Voce vera um botao AZUL escrito:
echo    "CLICAR AQUI PARA TESTAR"
echo.
echo 3. CLIQUE no botao azul
echo.
echo 4. Aguarde alguns segundos
echo.
echo 5. Deve aparecer:
echo    - Joao (02/12) - 43 anos
echo    - Renata Silva (05/12) - 29 anos
echo    - Carlos (20/12) - 43 anos
echo    - maria ap (26/12) - 44 anos
echo.
echo ================================================
echo   SE NAO FUNCIONAR:
echo ================================================
echo.
echo 1. Pressione F12 no navegador
echo 2. Clique na aba "Console"
echo 3. Tire print da mensagem de erro
echo.
echo ================================================
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul

start http://localhost:3000/teste-simples.html

echo.
echo Navegador aberto! Clique no botao azul!
echo.
pause
