// Gestão de Orçamento

let orcamentos = [];
let itensCounter = 0;
let categorias = {
    receita: ['Dízimos', 'Ofertas', 'Doações', 'Eventos', 'Outros'],
    despesa: ['Manutenção', 'Energia Elétrica', 'Água', 'Internet', 'Salários', 'Eventos', 'Missões', 'Outros']
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!verificarAutenticacao()) return;
    
    await carregarOrcamentos();
    document.getElementById('filtroAno').value = new Date().getFullYear();
});

async function carregarOrcamentos() {
    try {
        const ano = document.getElementById('filtroAno').value;
        const response = await fetch(`${API_URL}/orcamento?ano=${ano}`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        orcamentos = data.orcamentos || [];
        
        renderizarOrcamentos();
        calcularTotais();
        renderizarGraficos();
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
    }
}

function renderizarOrcamentos() {
    const tbody = document.getElementById('orcamentosList');
    
    if (orcamentos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum orçamento encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = orcamentos.map(o => {
        const periodo = o.mes ? `${getMesNome(o.mes)}/${o.ano}` : `${o.ano}`;
        const statusBadge = o.status === 'ativo' ? 'success' : 'secondary';
        
        return `
            <tr>
                <td>${periodo}</td>
                <td>${o.descricao || '-'}</td>
                <td>${formatarMoeda(o.total_receita)}</td>
                <td>${formatarMoeda(o.total_despesa)}</td>
                <td><strong>${formatarMoeda(o.saldo_previsto)}</strong></td>
                <td><span class="badge bg-${statusBadge}">${o.status.toUpperCase()}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalhes(${o.id})" title="Detalhes">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="verComparativo(${o.id})" title="Comparativo">
                        <i class="bi bi-graph-up"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function calcularTotais() {
    const totalReceita = orcamentos.reduce((sum, o) => sum + (o.total_receita || 0), 0);
    const totalDespesa = orcamentos.reduce((sum, o) => sum + (o.total_despesa || 0), 0);
    const saldo = totalReceita - totalDespesa;

    document.getElementById('totalReceita').textContent = formatarMoeda(totalReceita);
    document.getElementById('totalDespesa').textContent = formatarMoeda(totalDespesa);
    document.getElementById('saldoTotal').textContent = formatarMoeda(saldo);
}

function renderizarGraficos() {
    // Gráfico de Evolução
    const ctxOrcamento = document.getElementById('chartOrcamento').getContext('2d');
    const labels = orcamentos.map(o => o.mes ? getMesNome(o.mes) : 'Anual');
    
    new Chart(ctxOrcamento, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita Prevista',
                data: orcamentos.map(o => o.total_receita),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: 'Despesa Prevista',
                data: orcamentos.map(o => o.total_despesa),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Gráfico de Pizza - Categorias
    const ctxCategorias = document.getElementById('chartCategorias').getContext('2d');
    new Chart(ctxCategorias, {
        type: 'doughnut',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [
                    orcamentos.reduce((sum, o) => sum + o.total_receita, 0),
                    orcamentos.reduce((sum, o) => sum + o.total_despesa, 0)
                ],
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)']
            }]
        }
    });
}

function adicionarItem(tipo) {
    itensCounter++;
    const container = document.getElementById('itensContainer');
    const cats = tipo === 'receita' ? categorias.receita : categorias.despesa;
    const cor = tipo === 'receita' ? 'success' : 'danger';
    
    const itemDiv = document.createElement('div');
    itemDiv.className = `card mb-2 border-${cor}`;
    itemDiv.id = `item-${itensCounter}`;
    itemDiv.innerHTML = `
        <div class="card-body p-2">
            <div class="row g-2">
                <div class="col-md-4">
                    <select class="form-control form-control-sm item-categoria" required>
                        <option value="">Categoria...</option>
                        ${cats.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control form-control-sm item-valor" placeholder="Valor" step="0.01" required onchange="calcularPreview()">
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control form-control-sm item-obs" placeholder="Observações">
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-sm btn-danger" onclick="removerItem(${itensCounter})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <input type="hidden" class="item-tipo" value="${tipo}">
            </div>
        </div>
    `;
    container.appendChild(itemDiv);
}

function removerItem(id) {
    document.getElementById(`item-${id}`).remove();
    calcularPreview();
}

function calcularPreview() {
    const itens = document.querySelectorAll('#itensContainer .card');
    let totalReceita = 0;
    let totalDespesa = 0;

    itens.forEach(item => {
        const tipo = item.querySelector('.item-tipo').value;
        const valor = parseFloat(item.querySelector('.item-valor').value) || 0;
        
        if (tipo === 'receita') {
            totalReceita += valor;
        } else {
            totalDespesa += valor;
        }
    });

    document.getElementById('totalReceitaPreview').textContent = formatarMoeda(totalReceita);
    document.getElementById('totalDespesaPreview').textContent = formatarMoeda(totalDespesa);
    document.getElementById('saldoPreview').textContent = formatarMoeda(totalReceita - totalDespesa);
}

async function salvarOrcamento() {
    const itensCards = document.querySelectorAll('#itensContainer .card');
    const itens = [];

    itensCards.forEach(card => {
        const categoria = card.querySelector('.item-categoria').value;
        const valor = card.querySelector('.item-valor').value;
        const obs = card.querySelector('.item-obs').value;
        const tipo = card.querySelector('.item-tipo').value;

        if (categoria && valor) {
            itens.push({
                categoria,
                tipo,
                valor_previsto: parseFloat(valor),
                observacoes: obs || null
            });
        }
    });

    if (itens.length === 0) {
        alert('Adicione pelo menos um item ao orçamento');
        return;
    }

    const data = {
        ano: parseInt(document.getElementById('ano').value),
        mes: document.getElementById('mes').value || null,
        descricao: document.getElementById('descricao').value,
        itens: itens
    };

    try {
        const response = await fetch(`${API_URL}/orcamento`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Orçamento criado com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('orcamentoModal')).hide();
            document.getElementById('orcamentoForm').reset();
            document.getElementById('itensContainer').innerHTML = '';
            itensCounter = 0;
            await carregarOrcamentos();
        } else {
            const error = await response.json();
            alert(error.error || 'Erro ao criar orçamento');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao criar orçamento');
    }
}

async function verComparativo(id) {
    try {
        const response = await fetch(`${API_URL}/orcamento/${id}/comparativo`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        console.log('Comparativo:', data);
        // Implementar visualização do comparativo
        alert('Função de comparativo em desenvolvimento');
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function verDetalhes(id) {
    try {
        const response = await fetch(`${API_URL}/orcamento/${id}`, {
            headers: getAuthHeaders()
        });
        const orcamento = await response.json();
        
        console.log('Detalhes:', orcamento);
        // Implementar visualização detalhada
        alert('Função de detalhes em desenvolvimento');
    } catch (error) {
        console.error('Erro:', error);
    }
}

function getMesNome(mes) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses[mes - 1] || mes;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}
