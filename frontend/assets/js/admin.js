// Administração da Igreja - JavaScript Simplificado
const API_URL = `${window.location.origin}/api`;

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.init();
    }

    async init() {
        // Verificar autenticação
        if (!this.token) {
            console.log('Token não encontrado, redirecionando...');
            window.location.href = 'index.html';
            return;
        }

        // Verificar se é admin/tesoureiro/pastor
        if (!['admin', 'tesoureiro', 'pastor'].includes(this.user.tipo_usuario)) {
            console.log('Usuário sem permissão, redirecionando...');
            alert('Acesso negado! Apenas admin, tesoureiro ou pastor podem acessar esta área.');
            window.location.href = 'index.html';
            return;
        }

        console.log('Usuário logado:', this.user);

        // Inicializar dashboard
        try {
            await this.carregarRelatorioCompleto();
            await this.carregarCampanhas();
            this.setLastAccess();
            this.initCharts();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        }
    }

    async carregarRelatorioCompleto() {
        try {
            const response = await fetch(`${API_URL}/relatorios/completo`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Erro ao carregar relatório:', response.status);
                this.mostrarDadosVazios();
                return;
            }

            const data = await response.json();
            this.exibirRelatorio(data.relatorio);
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
            this.mostrarDadosVazios();
        }
    }

    exibirRelatorio(relatorio) {
        // Atualizar cards de resumo
        document.getElementById('totalUsers').textContent = relatorio.usuarios.total || 0;
        document.getElementById('totalAmount').textContent = this.formatCurrency(parseFloat(relatorio.resumo.totalArrecadado));
        document.getElementById('monthAmount').textContent = this.formatCurrency(parseFloat(relatorio.dizimos.valorTotal) + parseFloat(relatorio.ofertas.valorTotal));
        document.getElementById('pendingCount').textContent = relatorio.dizimos.lista.filter(d => d.status === 'pendente').length;

        // Atualizar resumo mensal
        document.getElementById('monthlyTithes').textContent = this.formatCurrency(parseFloat(relatorio.dizimos.valorTotal));
        document.getElementById('monthlyOfferings').textContent = this.formatCurrency(parseFloat(relatorio.ofertas.valorTotal));
        document.getElementById('monthlyTotal').textContent = this.formatCurrency(parseFloat(relatorio.resumo.totalArrecadado));

        // Preencher tabela de usuários
        this.populateUsersTable(relatorio.usuarios.lista);
        
        // Preencher transações pendentes
        this.populatePendingTransactions(relatorio.dizimos.lista, relatorio.ofertas.lista);

        // Atualizar estatísticas
        this.updateStats(relatorio);
    }

    mostrarDadosVazios() {
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('totalAmount').textContent = 'R$ 0,00';
        document.getElementById('monthAmount').textContent = 'R$ 0,00';
        document.getElementById('pendingCount').textContent = '0';
        document.getElementById('monthlyTithes').textContent = 'R$ 0,00';
        document.getElementById('monthlyOfferings').textContent = 'R$ 0,00';
        document.getElementById('monthlyTotal').textContent = 'R$ 0,00';
    }

    populateUsersTable(users) {
        const tbody = document.getElementById('usersTable')?.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum usuário cadastrado</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${this.getUserTypeBadgeColor(user.tipo_usuario)}">${user.tipo_usuario}</span></td>
                <td><span class="badge bg-${user.status === 'ativo' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>${this.formatDate(user.data_cadastro)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="alert('Funcionalidade em desenvolvimento')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    populatePendingTransactions(dizimos, ofertas) {
        const tbody = document.getElementById('pendingTransactions')?.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const pendentes = [
            ...(dizimos || []).filter(d => d.status === 'pendente').map(d => ({...d, tipo: 'Dízimo'})),
            ...(ofertas || []).filter(o => o.status === 'pendente').map(o => ({...o, tipo: 'Oferta'}))
        ].slice(0, 10);

        if (pendentes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma transação pendente</td></tr>';
            return;
        }

        pendentes.forEach(trans => {
            tbody.innerHTML += `
                <tr>
                    <td>${trans.usuario_nome || 'Anônimo'}</td>
                    <td>${trans.tipo}</td>
                    <td>R$ ${parseFloat(trans.valor).toFixed(2)}</td>
                    <td>${trans.data_pagamento || trans.data_oferta}</td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="alert('Confirmar pagamento')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="alert('Rejeitar pagamento')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    updateStats(relatorio) {
        // Maior doação
        const allDonations = [
            ...(relatorio.dizimos.lista || []),
            ...(relatorio.ofertas.lista || [])
        ];
        const maxDonation = Math.max(...allDonations.map(d => parseFloat(d.valor || 0)), 0);
        document.getElementById('maxDonation').textContent = this.formatCurrency(maxDonation);

        // Média mensal
        const avgMonthly = allDonations.length > 0 
            ? parseFloat(relatorio.resumo.totalArrecadado) / 12 
            : 0;
        document.getElementById('avgMonthly').textContent = this.formatCurrency(avgMonthly);

        // Contribuintes ativos
        const activeMembers = new Set(allDonations.map(d => d.usuario_id)).size;
        document.getElementById('activeMembers').textContent = activeMembers;

        // Taxa de crescimento (simulada)
        document.getElementById('growthRate').textContent = '12%';
    }

    getUserTypeBadgeColor(type) {
        switch(type) {
            case 'admin': return 'danger';
            case 'pastor': return 'warning';
            case 'tesoureiro': return 'info';
            default: return 'secondary';
        }
    }

    setLastAccess() {
        const now = new Date();
        const el = document.getElementById('lastAccess');
        if (el) el.textContent = this.formatDateTime(now);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    formatDateTime(date) {
        return date.toLocaleString('pt-BR');
    }

    initCharts() {
        // Gráfico de arrecadação mensal (dados simulados)
        const ctx1 = document.getElementById('monthlyChart');
        if (ctx1) {
            new Chart(ctx1.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Arrecadação',
                        data: [1200, 1900, 3000, 5000, 2000, 3000, 2500, 4000, 3500, 3800, 4200, 5000],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Gráfico pizza
        const ctx2 = document.getElementById('pieChart');
        if (ctx2) {
            new Chart(ctx2.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Dízimos', 'Ofertas'],
                    datasets: [{
                        data: [70, 30],
                        backgroundColor: ['#667eea', '#f093fb']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    async carregarCampanhas() {
        const container = document.getElementById('campaignsContainer');
        if (!container) return;

        try {
            const response = await fetch(`${API_URL}/admin/campanhas`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                container.innerHTML = '<div class="col-12"><div class="alert alert-warning">Não foi possível carregar campanhas.</div></div>';
                return;
            }

            const data = await response.json();
            const campanhas = data.campanhas || [];

            if (campanhas.length === 0) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center py-5">
                                <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                                <h4>Nenhuma campanha ativa</h4>
                                <p class="text-muted mb-0">Não há campanhas disponíveis no momento</p>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }

            container.innerHTML = campanhas.map(campanha => {
                const percentual = Math.max(0, Math.min(100, Number(campanha.percentual_atingido || 0)));
                return `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title mb-0">${campanha.titulo}</h5>
                                    <span class="badge bg-${campanha.status === 'ativa' ? 'success' : 'secondary'}">${campanha.status}</span>
                                </div>
                                <p class="text-muted mb-2">${campanha.descricao || 'Sem descrição'}</p>
                                <div class="small text-muted mb-1">Tipo: ${campanha.tipo || '-'}</div>
                                <div class="small text-muted mb-2">Período: ${this.formatDate(campanha.data_inicio)} até ${this.formatDate(campanha.data_fim)}</div>
                                <div class="progress mb-2" style="height: 10px;">
                                    <div class="progress-bar" role="progressbar" style="width: ${percentual}%" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <small>Meta: ${this.formatCurrency(campanha.valor_meta)}</small>
                                    <small>Atual: ${this.formatCurrency(campanha.valor_atual)}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Erro ao carregar campanhas:', error);
            container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Erro ao carregar campanhas.</div></div>';
        }
    }

    async criarCampanha(payload) {
        const response = await fetch(`${API_URL}/admin/campanhas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            const msg = data?.errors?.[0]?.msg || data?.error || 'Erro ao criar campanha';
            throw new Error(msg);
        }

        return data;
    }
}

// Funções globais para serem chamadas pelos elementos HTML
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active dos itens do sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    if (sectionId === 'campanhas' && adminDashboard) {
        adminDashboard.carregarCampanhas();
    }
    
    // Adicionar classe active ao item clicado
    event.target.closest('.sidebar-item')?.classList.add('active');
}

function generateReport(type) {
    alert(`Gerando relatório ${type}... Funcionalidade em desenvolvimento.`);
}

function generateCustomReport() {
    const period = document.getElementById('reportPeriod')?.value || 'month';
    const type = document.getElementById('reportType')?.value || 'all';
    alert(`Gerando relatório personalizado: ${period} - ${type}`);
}

function exportFinancial() {
    alert('Exportando dados financeiros... Use o script: node consultar-dados.js');
}

function downloadBackup() {
    const timestamp = new Date().toISOString().split('T')[0];
    alert(`Backup será salvo como: backup-igreja-${timestamp}.json\nFuncionalidade em desenvolvimento.`);
}

function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    if (fileInput?.files.length === 0) {
        alert('Selecione um arquivo de backup primeiro.');
        return;
    }
    if (confirm('Tem certeza? Esta operação substituirá todos os dados atuais.')) {
        alert('Restaurando backup... Funcionalidade em desenvolvimento.');
    }
}

function showAddUserModal() {
    alert('Modal de adicionar usuário em desenvolvimento.');
}

function showAddCampaignModal() {
    if (!adminDashboard) return;

    Swal.fire({
        title: 'Nova Campanha',
        html: `
            <div class="text-start">
                <label class="form-label">Título</label>
                <input id="campanha-titulo" class="form-control mb-2" placeholder="Ex: Reforma do Templo">
                <label class="form-label">Descrição</label>
                <textarea id="campanha-descricao" class="form-control mb-2" rows="2" placeholder="Detalhes da campanha"></textarea>
                <label class="form-label">Tipo</label>
                <input id="campanha-tipo" class="form-control mb-2" placeholder="Ex: construcao">
                <label class="form-label">Categoria (opcional)</label>
                <input id="campanha-categoria" class="form-control mb-2" placeholder="Ex: infraestrutura">
                <label class="form-label">Meta (R$)</label>
                <input id="campanha-meta" type="number" step="0.01" min="0" class="form-control mb-2" placeholder="10000">
                <label class="form-label">Data de Início</label>
                <input id="campanha-inicio" type="date" class="form-control mb-2">
                <label class="form-label">Data de Fim</label>
                <input id="campanha-fim" type="date" class="form-control">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Criar Campanha',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: async () => {
            const titulo = document.getElementById('campanha-titulo').value.trim();
            const descricao = document.getElementById('campanha-descricao').value.trim();
            const tipo = document.getElementById('campanha-tipo').value.trim();
            const categoria = document.getElementById('campanha-categoria').value.trim();
            const valorMeta = parseFloat(document.getElementById('campanha-meta').value || '0');
            const dataInicio = document.getElementById('campanha-inicio').value;
            const dataFim = document.getElementById('campanha-fim').value;

            if (!titulo || !tipo || !dataInicio || !dataFim || Number.isNaN(valorMeta)) {
                Swal.showValidationMessage('Preencha título, tipo, meta e período da campanha.');
                return false;
            }

            if (new Date(dataFim) < new Date(dataInicio)) {
                Swal.showValidationMessage('A data de fim deve ser maior ou igual à data de início.');
                return false;
            }

            try {
                await adminDashboard.criarCampanha({
                    titulo,
                    descricao,
                    tipo,
                    categoria,
                    valor_meta: valorMeta,
                    data_inicio: dataInicio,
                    data_fim: dataFim
                });
                return true;
            } catch (error) {
                Swal.showValidationMessage(error.message);
                return false;
            }
        }
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        await adminDashboard.carregarCampanhas();
        Swal.fire({
            icon: 'success',
            title: 'Campanha criada!',
            timer: 1500,
            showConfirmButton: false
        });
    });
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Inicializar dashboard quando a página carregar
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    
    // Salvar dados da igreja
    const igrejaForm = document.getElementById('igrejaForm');
    if (igrejaForm) {
        igrejaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nomeIgreja')?.value,
                cnpj: document.getElementById('cnpjIgreja')?.value,
                endereco: document.getElementById('enderecoIgreja')?.value,
                cidade: document.getElementById('cidadeIgreja')?.value,
                estado: document.getElementById('estadoIgreja')?.value,
                cep: document.getElementById('cepIgreja')?.value,
                telefone: document.getElementById('telefoneIgreja')?.value,
                email: document.getElementById('emailIgreja')?.value,
                pastor: document.getElementById('pastorIgreja')?.value
            };
            
            localStorage.setItem('dadosIgreja', JSON.stringify(dados));
            alert('Dados da igreja salvos com sucesso!');
        });
        
        // Carregar dados salvos
        const dadosSalvos = localStorage.getItem('dadosIgreja');
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            Object.keys(dados).forEach(key => {
                const element = document.getElementById(key + 'Igreja');
                if (element) element.value = dados[key] || '';
            });
        }
    }
});