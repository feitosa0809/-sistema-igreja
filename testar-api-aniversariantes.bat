@echo off
echo.
echo ========================================
echo   TESTANDO API DE ANIVERSARIANTES
echo ========================================
echo.

REM Obter token de autenticação
echo [1/5] Fazendo login...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@igreja.com\",\"senha\":\"123456\"}" ^
  > token_temp.json

REM Extrair token (método simples para Windows)
FOR /F "tokens=2 delims=:," %%i IN ('type token_temp.json ^| findstr /C:"token"') DO SET TOKEN=%%i
SET TOKEN=%TOKEN:"=%
SET TOKEN=%TOKEN: =%

echo Token obtido com sucesso!
echo.

echo [2/5] Testando aniversariantes de DEZEMBRO...
echo.
curl -s http://localhost:3000/api/birthdays/month/12 ^
  -H "Authorization: Bearer %TOKEN%" | findstr /C:"total" /C:"nome"
echo.
echo.

echo [3/5] Testando aniversariantes de HOJE...
echo.
curl -s http://localhost:3000/api/birthdays/today ^
  -H "Authorization: Bearer %TOKEN%" | findstr /C:"total" /C:"nome"
echo.
echo.

echo [4/5] Testando PRÓXIMOS 7 dias...
echo.
curl -s http://localhost:3000/api/birthdays/upcoming ^
  -H "Authorization: Bearer %TOKEN%" | findstr /C:"total" /C:"nome"
echo.
echo.

echo [5/5] Testando ESTATÍSTICAS...
echo.
curl -s http://localhost:3000/api/birthdays/stats ^
  -H "Authorization: Bearer %TOKEN%" | findstr /C:"total_geral"
echo.
echo.

del token_temp.json 2>nul

echo ========================================
echo   TESTES CONCLUÍDOS!
echo ========================================
echo.
pause
