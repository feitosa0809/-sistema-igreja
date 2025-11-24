// Funções do dashboard
async function showDashboard() {
    try {
        let content = '<div class="row">';
        
        // Admin dashboard
        if (['admin', 'tesoureiro', 'pastor'].includes(currentUser.tipo_usuario)) {
            const dashboardData = await apiService.call('/reports/dashboard');
            
            content += `
                <div class="col-md-3 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Dízimos (Mês)</h5>
                            <h3 class="text-primary">R$ ${parseFloat(dashboardData.dizimos_mes || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Ofertas (Mês)</h5>
                            <h3 class="text-success">R$ ${parseFloat(dashboardData.ofertas_mes || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Pendentes</h5>
                            <h3 class="text-warning">${dashboardData.dizimos_pendentes}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Usuários Ativos</h5>
                            <h3 class="text-info">${dashboardData.usuarios_ativos}</h3>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Member dashboard
            const personalReport = await apiService.call('/reports/meus-dizimos');
            
            content += `
                <div class="col-md-6 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Total no Ano</h5>
                            <h3 class="text-primary">R$ ${parseFloat(personalReport.total_ano || 0).toFixed(2)}</h3>
                            <small class="text-muted">${personalReport.ano}</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card dashboard-card">
                        <div class="card-body text-center">
                            <h5 class="card-title">Contribuições</h5>
                            <h3 class="text-success">${personalReport.dizimos_por_mes.length} meses</h3>
                        </div>
                    </div>
                </div>
            `;
        }

        content += '</div>';
        
        // Adicionar seção de Relatórios para Admin
        if (['admin', 'tesoureiro', 'pastor'].includes(currentUser.tipo_usuario)) {
            content += `
                <div class="row mt-4">
                    <div class="col-12">
                        <h4><i class="fas fa-chart-bar"></i> Relatórios</h4>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card bg-gradient-primary text-white" style="cursor: pointer;" onclick="window.open('relatorio-visual.html', '_blank')">
                            <div class="card-body text-center">
                                <i class="fas fa-file-alt fa-3x mb-2"></i>
                                <h5>Relatório Completo</h5>
                                <p class="mb-0">Visualize todos os dados do sistema</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card bg-gradient-info text-white" style="cursor: pointer;" onclick="window.location.href='admin.html'">
                            <div class="card-body text-center">
                                <i class="fas fa-cog fa-3x mb-2"></i>
                                <h5>Painel Admin</h5>
                                <p class="mb-0">Gerenciar usuários e transações</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card bg-gradient-success text-white" style="cursor: pointer;" onclick="gerarRelatorioCSV()">
                            <div class="card-body text-center">
                                <i class="fas fa-download fa-3x mb-2"></i>
                                <h5>Exportar Dados</h5>
                                <p class="mb-0">Baixar relatório em CSV</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        content += `
            <div class="row mt-4">
                <div class="col-12">
                    <h4>Ações Rápidas</h4>
                    <button class="btn btn-primary me-2" onclick="showNovoDizimoModal()">
                        <i class="fas fa-plus"></i> Novo Dízimo
                    </button>
                    <button class="btn btn-success me-2" onclick="showOfertas()">
                        <i class="fas fa-gift"></i> Nova Oferta
                    </button>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = content;
    } catch (error) {
        showToast('Erro ao carregar dashboard: ' + error.message, 'danger');
    }
}

// Função para exportar relatório em CSV
async function gerarRelatorioCSV() {
    try {
        showToast('Gerando relatório...', 'info');
        const data = await apiService.call('/relatorios/completo');
        
        // Criar CSV
        let csv = 'RELATÓRIO COMPLETO DO SISTEMA\n\n';
        
        // Usuários
        csv += 'USUÁRIOS\n';
        csv += 'ID,Nome,Email,Tipo,Status\n';
        data.relatorio.usuarios.lista.forEach(u => {
            csv += `${u.id},"${u.nome}","${u.email}",${u.tipo_usuario},${u.status}\n`;
        });
        
        // Dízimos
        csv += '\n\nDÍZIMOS\n';
        csv += 'ID,Usuário,Valor,Data,Método,Status\n';
        data.relatorio.dizimos.lista.forEach(d => {
            csv += `${d.id},"${d.usuario_nome}",${d.valor},${d.data_pagamento},${d.metodo_pagamento},${d.status}\n`;
        });
        
        // Ofertas
        csv += '\n\nOFERTAS\n';
        csv += 'ID,Usuário,Valor,Tipo,Data,Status\n';
        data.relatorio.ofertas.lista.forEach(o => {
            csv += `${o.id},"${o.usuario_nome || 'Anônimo'}",${o.valor},${o.tipo_oferta},${o.data_oferta},${o.status}\n`;
        });
        
        // Resumo
        csv += '\n\nRESUMO FINANCEIRO\n';
        csv += `Total Dízimos,R$ ${data.relatorio.resumo.totalDizimos}\n`;
        csv += `Total Ofertas,R$ ${data.relatorio.resumo.totalOfertas}\n`;
        csv += `TOTAL ARRECADADO,R$ ${data.relatorio.resumo.totalArrecadado}\n`;
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        showToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao exportar relatório: ' + error.message, 'danger');
    }
}