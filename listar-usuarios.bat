@echo off
chcp 65001 > nul
title 📋 Listar Usuários do Sistema
color 0B

echo.
echo ══════════════════════════════════════════════════════════
echo    📋 LISTA DE USUÁRIOS DO SISTEMA
echo ══════════════════════════════════════════════════════════
echo.

cd backend
node listar-usuarios.js

echo.
echo ══════════════════════════════════════════════════════════
echo.
echo 💡 TIPOS DE USUÁRIO:
echo    👑 Admin       = Acesso total ao sistema
echo    ⛪ Pastor       = Relatórios e emails
echo    💰 Tesoureiro  = Confirmar pagamentos
echo    👤 Membro      = Ver próprios dados
echo.
echo ══════════════════════════════════════════════════════════
echo.
pause
