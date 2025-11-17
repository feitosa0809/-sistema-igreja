# Script de Teste Completo do Sistema Igreja
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  TESTE COMPLETO DO SISTEMA IGREJA" -ForegroundColor Cyan  
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @()
$email = "teste$(Get-Random -Minimum 1000 -Maximum 9999)@igreja.com"

# TESTE 1: Health Check
Write-Host "TESTE 1: Health Check do Backend" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -UseBasicParsing
    Write-Host "   OK - Backend ONLINE - Status: $($health.status)" -ForegroundColor Green
    $testResults += "OK Health Check"
} catch {
    Write-Host "   ERRO - Backend OFFLINE" -ForegroundColor Red
    $testResults += "ERRO Health Check"
}

# TESTE 2: Cadastro de Usuário com Data de Nascimento
Write-Host ""
Write-Host "TESTE 2: Cadastro de Usuário com data de nascimento" -ForegroundColor Yellow
$cadastroBody = @{
    nome = "Joao Teste Silva"
    email = $email
    senha = "123456"
    telefone = "11999999999"
    data_nascimento = "1990-11-17"
} | ConvertTo-Json

try {
    $cadastro = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
        -Method POST -Body $cadastroBody -ContentType "application/json"
    Write-Host "   OK - Cadastro realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Email: $email" -ForegroundColor White
    Write-Host "   Token recebido" -ForegroundColor White
    $token = $cadastro.token
    $testResults += "OK Cadastro"
} catch {
    Write-Host "   ERRO no cadastro: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "ERRO Cadastro"
    $token = $null
}

# TESTE 3: Login
Write-Host ""
Write-Host "TESTE 3: Login" -ForegroundColor Yellow
$loginBody = @{
    email = $email
    senha = "123456"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   OK - Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Nome: $($login.user.nome)" -ForegroundColor White
    $token = $login.token
    $testResults += "OK Login"
} catch {
    Write-Host "   ERRO no login: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "ERRO Login"
}

# TESTE 4: Aniversariantes de Hoje
Write-Host ""
Write-Host "TESTE 4: Buscar Aniversariantes de Hoje" -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $aniversariantes = Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/today" `
            -Method GET -Headers $headers
        Write-Host "   OK - Endpoint funcionando!" -ForegroundColor Green
        Write-Host "   Aniversariantes hoje: $($aniversariantes.total)" -ForegroundColor White
        if ($aniversariantes.total -gt 0) {
            $aniversariantes.aniversariantes | ForEach-Object {
                $nome = $_.nome
                $idade = $_.idade
                Write-Host "      - $nome - $idade anos" -ForegroundColor Cyan
            }
        }
        $testResults += "OK Aniversariantes Hoje"
    } catch {
        Write-Host "   ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "ERRO Aniversariantes Hoje"
    }
} else {
    Write-Host "   PULADO - sem token" -ForegroundColor Yellow
    $testResults += "PULADO Aniversariantes Hoje"
}

# TESTE 5: Aniversariantes do Mês
Write-Host ""
Write-Host "TESTE 5: Buscar Aniversariantes do Mes (Novembro)" -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $anivMes = Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/month/11" `
            -Method GET -Headers $headers
        Write-Host "   OK - Endpoint funcionando!" -ForegroundColor Green
        Write-Host "   Aniversariantes em Novembro: $($anivMes.total)" -ForegroundColor White
        if ($anivMes.total -gt 0) {
            $anivMes.aniversariantes | Select-Object -First 3 | ForEach-Object {
                $nome = $_.nome
                $dia = $_.dia
                $idade = $_.idade
                Write-Host "      - $nome - Dia $dia/11 - $idade anos" -ForegroundColor Cyan
            }
        }
        $testResults += "OK Aniversariantes Mes"
    } catch {
        Write-Host "   ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "ERRO Aniversariantes Mes"
    }
} else {
    Write-Host "   PULADO - sem token" -ForegroundColor Yellow
    $testResults += "PULADO Aniversariantes Mes"
}

# TESTE 6: Próximos Aniversários
Write-Host ""
Write-Host "TESTE 6: Proximos Aniversarios (7 dias)" -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $proximos = Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/upcoming" `
            -Method GET -Headers $headers
        Write-Host "   OK - Endpoint funcionando!" -ForegroundColor Green
        Write-Host "   Proximos 7 dias: $($proximos.total)" -ForegroundColor White
        if ($proximos.total -gt 0) {
            $proximos.aniversariantes | Select-Object -First 3 | ForEach-Object {
                $nome = $_.nome
                $dias = $_.dias_restantes
                Write-Host "      - $nome - Em $dias dias" -ForegroundColor Cyan
            }
        }
        $testResults += "OK Proximos Aniversarios"
    } catch {
        Write-Host "   ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "ERRO Proximos Aniversarios"
    }
} else {
    Write-Host "   PULADO - sem token" -ForegroundColor Yellow
    $testResults += "PULADO Proximos Aniversarios"
}

# TESTE 7: Estatísticas de Aniversários
Write-Host ""
Write-Host "TESTE 7: Estatisticas de Aniversarios" -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/birthdays/stats" `
            -Method GET -Headers $headers
        Write-Host "   OK - Endpoint funcionando!" -ForegroundColor Green
        Write-Host "   Total de membros: $($stats.total_geral)" -ForegroundColor White
        Write-Host "   Mes com mais aniversarios:" -ForegroundColor White
        $maxMes = $stats.por_mes | Sort-Object -Property total_aniversariantes -Descending | Select-Object -First 1
        Write-Host "      $($maxMes.nome_mes) - $($maxMes.total_aniversariantes) pessoas" -ForegroundColor Cyan
        $testResults += "OK Estatisticas"
    } catch {
        Write-Host "   ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += "ERRO Estatisticas"
    }
} else {
    Write-Host "   PULADO - sem token" -ForegroundColor Yellow
    $testResults += "PULADO Estatisticas"
}

# TESTE 8: Frontend
Write-Host ""
Write-Host "TESTE 8: Verificar Frontend" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3001/index.html" -UseBasicParsing
    Write-Host "   OK - Frontend acessivel - Status: $($frontend.StatusCode)" -ForegroundColor Green
    $testResults += "OK Frontend"
} catch {
    Write-Host "   ERRO - Frontend inacessivel" -ForegroundColor Red
    $testResults += "ERRO Frontend"
}

# TESTE 9: Página de Aniversariantes
Write-Host ""
Write-Host "TESTE 9: Verificar Pagina de Aniversariantes" -ForegroundColor Yellow
try {
    $anivPage = Invoke-WebRequest -Uri "http://localhost:3001/aniversariantes.html" -UseBasicParsing
    Write-Host "   OK - Pagina acessivel - Status: $($anivPage.StatusCode)" -ForegroundColor Green
    $testResults += "OK Pagina Aniversariantes"
} catch {
    Write-Host "   ERRO - Pagina inacessivel" -ForegroundColor Red
    $testResults += "ERRO Pagina Aniversariantes"
}

# RESUMO
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  RESUMO DOS TESTES" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_ -match "^OK " }).Count
$failed = ($testResults | Where-Object { $_ -match "^ERRO " }).Count
$skipped = ($testResults | Where-Object { $_ -match "^PULADO " }).Count
$total = $testResults.Count

Write-Host ""
Write-Host "Resultados:" -ForegroundColor Yellow
$testResults | ForEach-Object { Write-Host "  $_" }

Write-Host ""
Write-Host "Estatisticas:" -ForegroundColor Yellow
Write-Host "  Passou: $passed/$total" -ForegroundColor Green
Write-Host "  Falhou: $failed/$total" -ForegroundColor Red
Write-Host "  Pulado: $skipped/$total" -ForegroundColor Yellow

$successRate = [math]::Round(($passed / $total) * 100, 1)
Write-Host ""
Write-Host "  Taxa de Sucesso: $successRate%" -ForegroundColor Cyan

if ($passed -eq $total) {
    Write-Host ""
    Write-Host "TODOS OS TESTES PASSARAM!" -ForegroundColor Green
} elseif ($passed -ge ($total * 0.7)) {
    Write-Host ""
    Write-Host "SISTEMA FUNCIONAL (alguns warnings)" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ATENCAO: Varios testes falharam" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Teste concluido!" -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
