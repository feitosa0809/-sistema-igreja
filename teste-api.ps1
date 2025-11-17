$userData = @{
    nome = "João Silva"
    email = "joao@teste.com"
    telefone = "11999999999"
    endereco = "Rua Teste, 123"
    senha = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body $userData
    Write-Host "✅ CADASTRO REALIZADO COM SUCESSO!"
    Write-Host "Usuário ID: $($response.user.id)"
    Write-Host "Nome: $($response.user.nome)"
    Write-Host "Email: $($response.user.email)"
} catch {
    Write-Host "❌ ERRO NO CADASTRO:"
    Write-Host $_.Exception.Message
}