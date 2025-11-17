$loginData = @{
    email = "joao@teste.com"
    senha = "123456"
} | ConvertTo-Json

try {
    Write-Host "Testando login..."
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    Write-Host "LOGIN REALIZADO COM SUCESSO!"
    Write-Host "Token: $($loginResponse.token)"
    Write-Host "Usuario: $($loginResponse.user.nome)"
    
    # Testar acesso com token
    Write-Host "Testando acesso ao perfil..."
    $headers = @{ Authorization = "Bearer $($loginResponse.token)" }
    $profile = Invoke-RestMethod -Uri "http://localhost:3000/api/users/profile" -Method GET -Headers $headers
    Write-Host "PERFIL ACESSADO COM SUCESSO!"
    Write-Host "ID: $($profile.id)"
    Write-Host "Nome: $($profile.nome)"
    Write-Host "Email: $($profile.email)"
    
} catch {
    Write-Host "ERRO NO LOGIN:"
    Write-Host $_.Exception.Message
}