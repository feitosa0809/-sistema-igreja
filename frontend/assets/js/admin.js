// Administração da Igreja - JavaScript
class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('userData') || '{}');
        this.init();
    }

    async init() {
        // Verificar autenticação
        if (!this.token) {
            window.location.href = '/index.html';
            return;
        }

        // Verificar permissão de admin
        if (!['admin', 'pastor', 'tesoureiro'].includes(this.user.tipo_usuario)) {
            alert('Acesso negado! Você não tem permissão para acessar esta área.');
            window.location.href = '/index.html';
            return;
        }

        // Inicializar dashboard
        this.loadDashboardData();
        this.loadCharts();
        this.setLastAccess();
    }

    async loadDashboardData() {
        try {
            // Carregar estatísticas do dashboard
            await Promise.all([
                this.loadUserStats(),
                this.loadFinancialStats(),
                this.loadPendingTransactions()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        }
    }

    async loadUserStats() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/admin/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('totalUsers').textContent = data.usuarios.length;
                this.populateUsersTable(data.usuarios);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    async loadFinancialStats() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/donations`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.calculateFinancialStats(data.donations || []);
            }
        } catch (error) {
            console.error('Erro ao carregar dados financeiros:', error);
        }
    }

    calculateFinancialStats(donations) {
        const total = donations.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        const thisMonth = donations.filter(d => {
            const date = new Date(d.data_cadastro);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
        const monthTotal = thisMonth.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);

        document.getElementById('totalAmount').textContent = this.formatCurrency(total);
        document.getElementById('monthAmount').textContent = this.formatCurrency(monthTotal);

        // Calcular pendentes (simulado)
        document.getElementById('pendingCount').textContent = '0';
        
        // Atualizar resumo mensal
        const tithes = thisMonth.filter(d => d.tipo === 'dizimo').reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        const offerings = thisMonth.filter(d => d.tipo === 'oferta').reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        
        document.getElementById('monthlyTithes').textContent = this.formatCurrency(tithes);
        document.getElementById('monthlyOfferings').textContent = this.formatCurrency(offerings);
        document.getElementById('monthlyTotal').textContent = this.formatCurrency(monthTotal);
    }

    async loadPendingTransactions() {
        // Simular transações pendentes (pode ser implementado no backend)
        const pendingTable = document.getElementById('pendingTransactions').querySelector('tbody');
        pendingTable.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma transação pendente</td></tr>';
    }

    loadCharts() {
        // Gráfico de arrecadação mensal
        const ctx1 = document.getElementById('monthlyChart').getContext('2d');
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Arrecadação',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Gráfico pizza
        const ctx2 = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx2, {
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

    populateUsersTable(users) {
        const tbody = document.getElementById('usersTable').querySelector('tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${this.getUserTypeBadgeColor(user.tipo_usuario)}">${user.tipo_usuario}</span></td>
                <td><span class="badge bg-${user.status === 'ativo' ? 'success' : 'danger'}">${user.status}</span></td>
                <td>${this.formatDate(user.data_cadastro)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="adminDashboard.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="adminDashboard.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
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
        document.getElementById('lastAccess').textContent = this.formatDateTime(now);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    formatDateTime(date) {
        return date.toLocaleString('pt-BR');
    }

    // Métodos para gerenciar seções
    showSection(sectionId) {
        // Esconder todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remover classe active dos itens do sidebar
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Mostrar seção selecionada
        document.getElementById(sectionId).classList.add('active');
        
        // Adicionar classe active ao item clicado
        event.target.classList.add('active');
    }

    // Métodos para exportação e relatórios
    generateReport(type) {
        alert(`Gerando relatório ${type}... Funcionalidade em desenvolvimento.`);
    }

    generateCustomReport() {
        const period = document.getElementById('reportPeriod').value;
        const type = document.getElementById('reportType').value;
        alert(`Gerando relatório personalizado: ${period} - ${type}`);
    }

    exportFinancial() {
        alert('Exportando dados financeiros... Funcionalidade em desenvolvimento.');
    }

    // Métodos para backup
    downloadBackup() {
        const data = {
            timestamp: new Date().toISOString(),
            igreja: {
                nome: document.getElementById('nomeIgreja').value,
                cnpj: document.getElementById('cnpjIgreja').value
            },
            // Aqui seria incluído todos os dados
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-igreja-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.addBackupToHistory();
    }

    restoreBackup() {
        const fileInput = document.getElementById('backupFile');
        if (fileInput.files.length === 0) {
            alert('Selecione um arquivo de backup primeiro.');
            return;
        }

        if (confirm('Tem certeza? Esta operação substituirá todos os dados atuais.')) {
            alert('Restaurando backup... Funcionalidade em desenvolvimento.');
        }
    }

    addBackupToHistory() {
        const historyContainer = document.getElementById('backupHistory');
        const now = new Date();
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <div>
                <strong>Backup Automático</strong><br>
                <small class="text-muted">${this.formatDateTime(now)}</small>
            </div>
            <span class="badge bg-success rounded-pill">Concluído</span>
        `;
        historyContainer.insertBefore(item, historyContainer.firstChild);
    }

    // Modal para adicionar usuário
    showAddUserModal() {
        alert('Modal de adicionar usuário em desenvolvimento.');
    }

    // Modal para adicionar campanha
    showAddCampaignModal() {
        alert('Modal de adicionar campanha em desenvolvimento.');
    }

    // Editar usuário
    editUser(userId) {
        alert(`Editando usuário ID: ${userId}`);
    }

    // Deletar usuário
    deleteUser(userId) {
        if (confirm('Tem certeza que deseja deletar este usuário?')) {
            alert(`Deletando usuário ID: ${userId}`);
        }
    }

    // Logout
    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '/index.html';
        }
    }
}

// Funções globais para serem chamadas pelos elementos HTML
function showSection(sectionId) {
    adminDashboard.showSection(sectionId);
}

function generateReport(type) {
    adminDashboard.generateReport(type);
}

function generateCustomReport() {
    adminDashboard.generateCustomReport();
}

function exportFinancial() {
    adminDashboard.exportFinancial();
}

function downloadBackup() {
    adminDashboard.downloadBackup();
}

function restoreBackup() {
    adminDashboard.restoreBackup();
}

function showAddUserModal() {
    adminDashboard.showAddUserModal();
}

function showAddCampaignModal() {
    adminDashboard.showAddCampaignModal();
}

function logout() {
    adminDashboard.logout();
}

// Inicializar dashboard quando a página carregar
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Salvamento dos dados da igreja
document.addEventListener('DOMContentLoaded', () => {
    const igrejaForm = document.getElementById('igrejaForm');
    if (igrejaForm) {
        igrejaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nomeIgreja').value,
                cnpj: document.getElementById('cnpjIgreja').value,
                endereco: document.getElementById('enderecoIgreja').value,
                cidade: document.getElementById('cidadeIgreja').value,
                estado: document.getElementById('estadoIgreja').value,
                cep: document.getElementById('cepIgreja').value,
                telefone: document.getElementById('telefoneIgreja').value,
                email: document.getElementById('emailIgreja').value,
                pastor: document.getElementById('pastorIgreja').value
            };
            
            // Salvar no localStorage (em produção seria no servidor)
            localStorage.setItem('dadosIgreja', JSON.stringify(dados));
            
            alert('Dados da igreja salvos com sucesso!');
        });
    }
    
    // Carregar dados salvos
    const dadosSalvos = localStorage.getItem('dadosIgreja');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        Object.keys(dados).forEach(key => {
            const element = document.getElementById(key + 'Igreja');
            if (element) {
                element.value = dados[key] || '';
            }
        });
    }
});