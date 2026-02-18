// Gestão de Despesas

let despesas = [];
let fornecedores = [];
let categorias = [];

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;
    
    await carregarCategorias();
    await carregarFornecedores();
    await carregarDespesas();
    await carregarEstatisticas();
    preencherFiltros();
});

// Carregar categorias de despesas
async function carregarCategorias() {
    try {
        const response = await fetch(`${API_URL}/config`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        const config = data.find(c => c.chave === 'categorias_despesas');
        if (config) {
            categorias = JSON.parse(config.valor);
            
            // Preencher selects de categoria
            const selects = ['categoria', 'filtroCategoria'];
            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    categorias.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat;
                        option.textContent = cat;
                        select.appendChild(option);
                    });
                }
            });
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Carregar fornecedores
async function carregarFornecedores() {
    try {
        const response = await fetch(`${API_URL}/fornecedores`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        fornecedores = data.fornecedores || [];
        
        // Preencher select de fornecedores
        const select = document.getElementById('fornecedorId');
        if (select) {
            select.innerHTML = '<option value="">Nenhum</option>';
            fornecedores.forEach(f => {
                const option = document.createElement('option');
                option.value = f.id;
                option.textContent = f.nome;
                select.appendChild(option);
            });
        }

        // Listar fornecedores na modal
        const tbody = document.getElementById('fornecedoresList');
        if (tbody) {
            tbody.innerHTML = fornecedores.map(f => `
                <tr>
                    <td>${f.nome}</td>
                    <td>${f.cnpj || '-'}</td>
                    <td>${f.telefone || '-'}</td>
                    <td>${f.tipo_servico || '-'}</td>
                    <td>${formatarMoeda(f.total_gasto || 0)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarFornecedor(${f.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

// Carregar despesas
async function carregarDespesas() {
    try {
        const params = new URLSearchParams();
        const categoria = document.getElementById('filtroCategoria')?.value;
        const status = document.getElementById('filtroStatus')?.value;
        const mes = document.getElementById('filtroMes')?.value;
        const ano = document.getElementById('filtroAno')?.value;

        if (categoria) params.append('categoria', categoria);
        if (status) params.append('status', status);
        if (mes) params.append('mes', mes);
        if (ano) params.append('ano', ano);

        const response = await fetch(`${API_URL}/despesas?${params}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        despesas = data.despesas || [];
        
        renderizarDespesas();
    } catch (error) {
        console.error('Erro ao carregar despesas:', error);
        mostrarErro('Erro ao carregar despesas');
    }
}

// Renderizar tabela de despesas
function renderizarDespesas() {
    const tbody = document.getElementById('despesasList');
    
    if (despesas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Nenhuma despesa encontrada</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = despesas.map(d => {
        const statusBadge = {
            'pago': 'success',
            'pendente': 'warning',
            'vencido': 'danger'
        }[d.status] || 'secondary';

        return `
            <tr>
                <td>${formatarData(d.data_despesa)}</td>
                <td>${d.descricao}</td>
                <td>${d.categoria}</td>
                <td>${d.fornecedor_nome || '-'}</td>
                <td>${formatarMoeda(d.valor)}</td>
                <td>
                    <span class="badge bg-${statusBadge}">${d.status.toUpperCase()}</span>
                </td>
                <td>${d.data_vencimento ? formatarData(d.data_vencimento) : '-'}</td>
                <td>
                    ${d.status !== 'pago' ? `
                        <button class="btn btn-sm btn-success" onclick="pagarDespesa(${d.id})" title="Marcar como Pago">
                            <i class="bi bi-check-circle"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-primary" onclick="editarDespesa(${d.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirDespesa(${d.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                    ${d.comprovante ? `
                        <a href="${d.comprovante}" target="_blank" class="btn btn-sm btn-info" title="Ver Comprovante">
                            <i class="bi bi-file-earmark"></i>
                        </a>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// Carregar estatísticas
async function carregarEstatisticas() {
    try {
        const mes = document.getElementById('filtroMes')?.value;
        const ano = document.getElementById('filtroAno')?.value;
        const params = new URLSearchParams();
        
        if (mes) params.append('mes', mes);
        if (ano) params.append('ano', ano);

        const response = await fetch(`${API_URL}/despesas/stats/resumo?${params}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        if (data.geral) {
            document.getElementById('totalPago').textContent = formatarMoeda(data.geral.total_pago || 0);
            document.getElementById('totalPendente').textContent = formatarMoeda(data.geral.total_pendente || 0);
            document.getElementById('totalVencido').textContent = formatarMoeda(data.geral.total_vencido || 0);
            document.getElementById('totalGeral').textContent = formatarMoeda(data.geral.total_geral || 0);
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Salvar despesa
async function salvarDespesa() {
    const id = document.getElementById('despesaId').value;
    const formData = new FormData();
    
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('valor', document.getElementById('valor').value);
    formData.append('data_despesa', document.getElementById('dataDespesa').value);
    formData.append('data_vencimento', document.getElementById('dataVencimento').value);
    formData.append('fornecedor_id', document.getElementById('fornecedorId').value);
    formData.append('forma_pagamento', document.getElementById('formaPagamento').value);
    formData.append('observacoes', document.getElementById('observacoes').value);

    const comprovante = document.getElementById('comprovante').files[0];
    if (comprovante) {
        formData.append('comprovante', comprovante);
    }

    try {
        const url = id ? `${API_URL}/despesas/${id}` : `${API_URL}/despesas`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (response.ok) {
            mostrarSucesso(id ? 'Despesa atualizada!' : 'Despesa cadastrada!');
            bootstrap.Modal.getInstance(document.getElementById('despesaModal')).hide();
            document.getElementById('despesaForm').reset();
            await carregarDespesas();
            await carregarEstatisticas();
        } else {
            const error = await response.json();
            mostrarErro(error.error || 'Erro ao salvar despesa');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao salvar despesa');
    }
}

// Editar despesa
async function editarDespesa(id) {
    try {
        const response = await fetch(`${API_URL}/despesas/${id}`, {
            headers: getAuthHeaders()
        });
        const despesa = await response.json();

        document.getElementById('despesaId').value = despesa.id;
        document.getElementById('descricao').value = despesa.descricao;
        document.getElementById('categoria').value = despesa.categoria;
        document.getElementById('valor').value = despesa.valor;
        document.getElementById('dataDespesa').value = despesa.data_despesa;
        document.getElementById('dataVencimento').value = despesa.data_vencimento || '';
        document.getElementById('fornecedorId').value = despesa.fornecedor_id || '';
        document.getElementById('formaPagamento').value = despesa.forma_pagamento;
        document.getElementById('observacoes').value = despesa.observacoes || '';

        document.getElementById('despesaModalLabel').textContent = 'Editar Despesa';
        new bootstrap.Modal(document.getElementById('despesaModal')).show();
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao carregar despesa');
    }
}

// Marcar como pago
async function pagarDespesa(id) {
    const valor = prompt('Digite o valor pago:');
    if (!valor) return;

    try {
        const response = await fetch(`${API_URL}/despesas/${id}/pagar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                valor_pago: parseFloat(valor),
                data_pagamento: new Date().toISOString().split('T')[0]
            })
        });

        if (response.ok) {
            mostrarSucesso('Despesa marcada como paga!');
            await carregarDespesas();
            await carregarEstatisticas();
        } else {
            mostrarErro('Erro ao pagar despesa');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao pagar despesa');
    }
}

// Excluir despesa
async function excluirDespesa(id) {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;

    try {
        const response = await fetch(`${API_URL}/despesas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            mostrarSucesso('Despesa excluída!');
            await carregarDespesas();
            await carregarEstatisticas();
        } else {
            mostrarErro('Erro ao excluir despesa');
        }
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro ao excluir despesa');
    }
}

// Preencher filtros
function preencherFiltros() {
    const mesSelect = document.getElementById('filtroMes');
    const anoSelect = document.getElementById('filtroAno');
    
    // Meses
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    meses.forEach((mes, i) => {
        const option = document.createElement('option');
        option.value = (i + 1).toString().padStart(2, '0');
        option.textContent = mes;
        mesSelect.appendChild(option);
    });

    // Anos
    const anoAtual = new Date().getFullYear();
    for (let ano = anoAtual; ano >= anoAtual - 5; ano--) {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        anoSelect.appendChild(option);
    }
}

// Filtrar despesas
function filtrarDespesas() {
    carregarDespesas();
    carregarEstatisticas();
}

// Limpar filtros
function limparFiltros() {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroMes').value = '';
    document.getElementById('filtroAno').value = '';
    carregarDespesas();
    carregarEstatisticas();
}

// Formatar data
function formatarData(data) {
    if (!data) return '-';
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

// Formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}

// Mensagens
function mostrarSucesso(msg) {
    alert(msg); // Substituir por toast ou notificação
}

function mostrarErro(msg) {
    alert(msg); // Substituir por toast ou notificação
}
