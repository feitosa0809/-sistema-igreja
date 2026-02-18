@echo off
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  🚀 ATUALIZAÇÃO DO SISTEMA DÍZIMO - NOVAS FUNCIONALIDADES   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 Instalando novas dependências...
cd backend
call npm install exceljs speakeasy qrcode excel4node

echo.
echo 🗄️ Executando migrations do banco de dados...
call npm run migrate

echo.
echo ✅ Atualização concluída com sucesso!
echo.
echo 📋 NOVAS FUNCIONALIDADES DISPONÍVEIS:
echo    ✓ Módulo de Despesas
echo    ✓ Gestão de Fornecedores
echo    ✓ Sistema de Orçamento
echo    ✓ Sistema de Metas
echo    ✓ Módulo de Membros
echo    ✓ Logs de Auditoria
echo    ✓ Autenticação 2FA
echo    ✓ Exportação para Excel
echo    ✓ Tema Claro/Escuro
echo.
echo 🌐 Para iniciar o sistema, execute: iniciar-sistema.bat
echo 📖 Leia NOVAS-FUNCIONALIDADES.md para mais informações
echo.
pause
