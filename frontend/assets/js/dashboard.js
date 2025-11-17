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