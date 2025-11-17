# Script de teste de cadastro
Write-Host "🧪 Testando endpoint de cadastro..." -ForegroundColor Cyan

$body = '{"nome":"Usuario Teste","email":"teste@igreja.com","senha":"123456","telefone":"11999999999","data_nascimento":"1990-11-17"}'

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing

    Write-Host "`n✅ CADASTRO FUNCIONANDO!" -ForegroundColor Green
    Write-Host "Status:" $response.StatusCode
    Write-Host "`nResposta:"
    $response.Content | ConvertFrom-Json | Format-List

} catch {
    Write-Host "`n❌ ERRO NO CADASTRO!" -ForegroundColor Red
    Write-Host "Mensagem:" $_.Exception.Message
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nDetalhes do erro:"
        $_.ErrorDetails.Message
    }
}

Write-Host "`n✅ API está configurada em: http://localhost:3000/api" -ForegroundColor Green
Write-Host "✅ Frontend está em: http://localhost:3001" -ForegroundColor Green
Write-Host "`n💡 Atualize a página do navegador (Ctrl+F5) para aplicar mudanças" -ForegroundColor Yellow
