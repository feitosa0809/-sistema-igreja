$loginData = @{
    email = "joao@teste.com"
    senha = "123456"
} | ConvertTo-Json

try {
    Write-Host "1. Testando login..."
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    Write-Host "✅ Login OK - Token: $($loginResponse.token.Substring(0,20))..."
    
    Write-Host "`n2. Testando endpoint GET /api/donations..."
    $headers = @{ Authorization = "Bearer $($loginResponse.token)" }
    $donations = Invoke-RestMethod -Uri "http://localhost:3000/api/donations" -Headers $headers
    Write-Host "✅ GET donations OK - Retornou: $($donations.Length) registros"
    
    Write-Host "`n3. Testando POST /api/donations..."
    $donationData = @{
        valor = 100.50
        tipo = "dizimo"
        metodo_pagamento = "pix"
        observacoes = "Teste endpoint"
    } | ConvertTo-Json
    
    $newDonation = Invoke-RestMethod -Uri "http://localhost:3000/api/donations" -Method POST -ContentType "application/json" -Headers $headers -Body $donationData
    Write-Host "✅ POST donations OK - ID: $($newDonation.id)"
    
    Write-Host "`n4. Testando GET novamente..."
    $donations2 = Invoke-RestMethod -Uri "http://localhost:3000/api/donations" -Headers $headers
    Write-Host "✅ GET donations OK - Agora tem: $($donations2.Length) registros"
    
    Write-Host "`n🎉 TODOS OS ENDPOINTS FUNCIONANDO!"
    
} catch {
    Write-Host "❌ ERRO: $($_.Exception.Message)"
    Write-Host "Detalhes: $($_.Exception.Response.StatusCode)"
}