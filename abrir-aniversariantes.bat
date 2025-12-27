@echo off
echo.
echo ========================================
echo   GUIA RAPIDO - ANIVERSARIANTES
echo ========================================
echo.
echo Este sistema mostra os aniversariantes da igreja!
echo.
echo COMO ACESSAR:
echo -------------
echo 1. Abra o navegador
echo 2. Acesse: http://localhost:3000
echo 3. Faca login com:
echo    Email: admin@igreja.com
echo    Senha: 123456
echo.
echo 4. No menu lateral, clique em "Aniversariantes"
echo.
echo OU acesse direto:
echo    http://localhost:3000/aniversariantes.html
echo.
echo FUNCIONALIDADES:
echo ----------------
echo - Ver aniversariantes de HOJE
echo - Ver proximos 7 dias
echo - Filtrar por mes (12 botoes)
echo - Enviar emails de parabens
echo.
echo DADOS ATUAIS:
echo -------------
echo - Total de pessoas: 23
echo - Aniversariantes em Dezembro: 4
echo.
echo   2/dez  - Joao (43 anos)
echo   5/dez  - Renata Silva (29 anos)
echo   20/dez - Carlos (43 anos)
echo   26/dez - maria ap (44 anos) -- HOJE! 
echo.
echo INTEGRACAO COM EMAILS:
echo ----------------------
echo - Emails automaticos todo dia as 8h
echo - Envio manual pela pagina de Notificacoes
echo - Templates personalizados com versiculo
echo.
echo ========================================
echo.
echo Pressione qualquer tecla para abrir no navegador...
pause >nul

start http://localhost:3000/aniversariantes.html

echo.
echo Pagina aberta no navegador!
echo.
pause
