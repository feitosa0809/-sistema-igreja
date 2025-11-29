// Funções relacionadas a dízimos e ofertas
async function showDizimos() {
    try {
        const data = await apiService.call('/donations/dizimos');
        
        let content = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-hand-holding-heart"></i> Meus Dízimos</h2>
                <button class="btn btn-primary" onclick="showNovoDizimoModal()">
                    <i class="fas fa-plus"></i> Novo Dízimo
                </button>
            </div>
        `;

        if (data.dizimos.length === 0) {
            content += `
                <div class="text-center py-5">
                    <i class="fas fa-hand-holding-heart fa-3x text-muted mb-3"></i>
                    <h4>Nenhum dízimo cadastrado</h4>
                    <p class="text-muted">Comece registrando seu primeiro dízimo</p>
                </div>
            `;
        } else {
            content += `
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Método</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.dizimos.forEach(dizimo => {
                const statusBadge = getStatusBadge(dizimo.status);
                const dataFormatada = new Date(dizimo.data_pagamento).toLocaleDateString('pt-BR');
                const isPendente = dizimo.status === 'pendente';
                
                let acoesHtml = '<div class="btn-group" role="group">';
                
                // Botão Ver Detalhes
                acoesHtml += `
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetalhesDizimo(${dizimo.id})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                `;
                
                // Botão Comprovante (se existir)
                if (dizimo.comprovante_url) {
                    acoesHtml += `
                        <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${dizimo.comprovante_url}" 
                           target="_blank" 
                           class="btn btn-sm btn-outline-info" 
                           title="Ver comprovante">
                            <i class="fas fa-file-invoice"></i>
                        </a>
                    `;
                }
                
                // Botão Editar (só se pendente)
                if (isPendente) {
                    acoesHtml += `
                        <button class="btn btn-sm btn-outline-warning" onclick="editarDizimo(${dizimo.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    `;
                }
                
                // Botão Excluir (só se pendente)
                if (isPendente) {
                    acoesHtml += `
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirDizimo(${dizimo.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }
                
                acoesHtml += '</div>';
                
                content += `
                    <tr>
                        <td>${dataFormatada}</td>
                        <td>R$ ${parseFloat(dizimo.valor).toFixed(2)}</td>
                        <td>${formatMetodoPagamento(dizimo.metodo_pagamento)}</td>
                        <td>${statusBadge}</td>
                        <td>${acoesHtml}</td>
                    </tr>
                `;
            });

            content += '</tbody></table></div>';
        }

        document.getElementById('content').innerHTML = content;
    } catch (error) {
        showToast('Erro ao carregar dízimos: ' + error.message, 'danger');
    }
}

async function showOfertas() {
    try {
        const data = await apiService.call('/donations/ofertas');
        
        let content = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-gift"></i> Minhas Ofertas</h2>
                <button class="btn btn-success" onclick="showNovaOfertaModal()">
                    <i class="fas fa-plus"></i> Nova Oferta
                </button>
            </div>
        `;

        if (data.ofertas.length === 0) {
            content += `
                <div class="text-center py-5">
                    <i class="fas fa-gift fa-3x text-muted mb-3"></i>
                    <h4>Nenhuma oferta cadastrada</h4>
                    <p class="text-muted">Comece registrando sua primeira oferta</p>
                </div>
            `;
        } else {
            content += `
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Método</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.ofertas.forEach(oferta => {
                const statusBadge = getStatusBadge(oferta.status);
                const dataFormatada = new Date(oferta.data_oferta).toLocaleDateString('pt-BR');
                const isPendente = oferta.status === 'pendente';
                
                let acoesHtml = '<div class="btn-group" role="group">';
                
                // Botão Ver Detalhes
                acoesHtml += `
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetalhesOferta(${oferta.id})" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                `;
                
                // Botão Comprovante (se existir)
                if (oferta.comprovante_url) {
                    acoesHtml += `
                        <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${oferta.comprovante_url}" 
                           target="_blank" 
                           class="btn btn-sm btn-outline-info" 
                           title="Ver comprovante">
                            <i class="fas fa-file-invoice"></i>
                        </a>
                    `;
                }
                
                // Botão Editar (só se pendente)
                if (isPendente) {
                    acoesHtml += `
                        <button class="btn btn-sm btn-outline-warning" onclick="editarOferta(${oferta.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    `;
                }
                
                // Botão Excluir (só se pendente)
                if (isPendente) {
                    acoesHtml += `
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirOferta(${oferta.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }
                
                acoesHtml += '</div>';
                
                content += `
                    <tr>
                        <td>${dataFormatada}</td>
                        <td>R$ ${parseFloat(oferta.valor).toFixed(2)}</td>
                        <td>${oferta.tipo_oferta}</td>
                        <td>${formatMetodoPagamento(oferta.metodo_pagamento)}</td>
                        <td>${statusBadge}</td>
                        <td>${acoesHtml}</td>
                    </tr>
                `;
            });

            content += '</tbody></table></div>';
        }

        document.getElementById('content').innerHTML = content;
    } catch (error) {
        showToast('Erro ao carregar ofertas: ' + error.message, 'danger');
    }
}

async function showCampanhas() {
    try {
        const data = await apiService.call('/donations/campanhas');
        
        let content = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-bullhorn"></i> Campanhas Ativas</h2>
            </div>
        `;

        if (data.campanhas.length === 0) {
            content += `
                <div class="text-center py-5">
                    <i class="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                    <h4>Nenhuma campanha ativa</h4>
                    <p class="text-muted">Não há campanhas disponíveis no momento</p>
                </div>
            `;
        } else {
            content += '<div class="row">';
            
            data.campanhas.forEach(campanha => {
                const porcentagem = campanha.meta_valor ? (campanha.total_arrecadado / campanha.meta_valor * 100).toFixed(1) : 0;
                
                content += `
                    <div class="col-md-6 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">${campanha.nome}</h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text">${campanha.descricao || 'Sem descrição'}</p>
                                ${campanha.meta_valor ? `
                                    <div class="mb-3">
                                        <small class="text-muted">Meta: R$ ${parseFloat(campanha.meta_valor).toFixed(2)}</small>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${porcentagem}%" 
                                                 aria-valuenow="${porcentagem}" aria-valuemin="0" aria-valuemax="100">
                                                ${porcentagem}%
                                            </div>
                                        </div>
                                        <small class="text-success">Arrecadado: R$ ${parseFloat(campanha.total_arrecadado || 0).toFixed(2)}</small>
                                    </div>
                                ` : ''}
                                <button class="btn btn-primary" onclick="showContribuirModal(${campanha.id}, '${campanha.nome}')">
                                    <i class="fas fa-hand-holding-heart"></i> Contribuir
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            content += '</div>';
        }

        document.getElementById('content').innerHTML = content;
    } catch (error) {
        showToast('Erro ao carregar campanhas: ' + error.message, 'danger');
    }
}

function showAdmin() {
    // Redirecionar para a página de administração completa
    window.location.href = '/admin.html';
}

function showProfile() {
    document.getElementById('content').innerHTML = `
        <h2><i class="fas fa-user-edit"></i> Meu Perfil</h2>
        <p>Seção de perfil em desenvolvimento...</p>
    `;
}

// Utility functions
function getStatusBadge(status) {
    switch (status) {
        case 'confirmado':
            return '<span class="badge bg-success">Confirmado</span>';
        case 'pendente':
            return '<span class="badge bg-warning">Pendente</span>';
        case 'cancelado':
            return '<span class="badge bg-danger">Cancelado</span>';
        default:
            return '<span class="badge bg-secondary">Desconhecido</span>';
    }
}

function formatMetodoPagamento(metodo) {
    const metodos = {
        'dinheiro': 'Dinheiro',
        'pix': 'PIX',
        'cartao': 'Cartão',
        'transferencia': 'Transferência'
    };
    return metodos[metodo] || metodo;
}

// Form submission handlers
async function submitDizimo(formData) {
    try {
        await apiService.uploadFile('/donations/dizimos', formData);
        hideModal('novoDizimoModal');
        showToast('Dízimo cadastrado com sucesso!', 'success');
        showDizimos();
    } catch (error) {
        showToast('Erro ao cadastrar dízimo: ' + error.message, 'danger');
    }
}

async function submitOferta(formData) {
    try {
        await apiService.uploadFile('/donations/ofertas', formData);
        hideModal('novaOfertaModal');
        showToast('Oferta cadastrada com sucesso!', 'success');
        showOfertas();
    } catch (error) {
        showToast('Erro ao cadastrar oferta: ' + error.message, 'danger');
    }
}

// Funções de ações para dízimos
async function verDetalhesDizimo(id) {
    try {
        const response = await apiService.call(`/donations/dizimos`);
        const dizimo = response.dizimos.find(d => d.id === id);
        
        if (!dizimo) {
            showToast('Dízimo não encontrado', 'error');
            return;
        }
        
        const dataFormatada = new Date(dizimo.data_pagamento).toLocaleDateString('pt-BR');
        const statusBadge = getStatusBadge(dizimo.status);
        
        const detalhes = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <strong>Data:</strong> ${dataFormatada}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Valor:</strong> R$ ${parseFloat(dizimo.valor).toFixed(2)}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Método:</strong> ${formatMetodoPagamento(dizimo.metodo_pagamento)}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Status:</strong> ${statusBadge}
                </div>
                ${dizimo.observacao ? `
                    <div class="col-12 mb-3">
                        <strong>Observação:</strong><br>
                        ${dizimo.observacao}
                    </div>
                ` : ''}
                ${dizimo.comprovante_url ? `
                    <div class="col-12">
                        <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${dizimo.comprovante_url}" 
                           target="_blank" 
                           class="btn btn-info">
                            <i class="fas fa-file-invoice me-2"></i>Ver Comprovante
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        Swal.fire({
            title: 'Detalhes do Dízimo',
            html: detalhes,
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
    } catch (error) {
        showToast('Erro ao carregar detalhes: ' + error.message, 'danger');
    }
}

async function editarDizimo(id) {
    showToast('Funcionalidade de edição em desenvolvimento', 'info');
}

async function excluirDizimo(id) {
    const resultado = await Swal.fire({
        title: 'Confirmar exclusão?',
        text: 'Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });
    
    if (resultado.isConfirmed) {
        try {
            await apiService.call(`/donations/dizimos/${id}`, 'DELETE');
            showToast('Dízimo excluído com sucesso!', 'success');
            showDizimos();
        } catch (error) {
            showToast('Erro ao excluir dízimo: ' + error.message, 'danger');
        }
    }
}

// Funções de ações para ofertas
async function verDetalhesOferta(id) {
    try {
        const response = await apiService.call(`/donations/ofertas`);
        const oferta = response.ofertas.find(o => o.id === id);
        
        if (!oferta) {
            showToast('Oferta não encontrada', 'error');
            return;
        }
        
        const dataFormatada = new Date(oferta.data_oferta).toLocaleDateString('pt-BR');
        const statusBadge = getStatusBadge(oferta.status);
        
        const detalhes = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <strong>Data:</strong> ${dataFormatada}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Valor:</strong> R$ ${parseFloat(oferta.valor).toFixed(2)}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Tipo:</strong> ${oferta.tipo_oferta}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Método:</strong> ${formatMetodoPagamento(oferta.metodo_pagamento)}
                </div>
                <div class="col-md-6 mb-3">
                    <strong>Status:</strong> ${statusBadge}
                </div>
                ${oferta.observacao ? `
                    <div class="col-12 mb-3">
                        <strong>Observação:</strong><br>
                        ${oferta.observacao}
                    </div>
                ` : ''}
                ${oferta.comprovante_url ? `
                    <div class="col-12">
                        <a href="${CONFIG.API_BASE_URL.replace('/api', '')}${oferta.comprovante_url}" 
                           target="_blank" 
                           class="btn btn-info">
                            <i class="fas fa-file-invoice me-2"></i>Ver Comprovante
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
        
        Swal.fire({
            title: 'Detalhes da Oferta',
            html: detalhes,
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
    } catch (error) {
        showToast('Erro ao carregar detalhes: ' + error.message, 'danger');
    }
}

async function editarOferta(id) {
    showToast('Funcionalidade de edição em desenvolvimento', 'info');
}

async function excluirOferta(id) {
    const resultado = await Swal.fire({
        title: 'Confirmar exclusão?',
        text: 'Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });
    
    if (resultado.isConfirmed) {
        try {
            await apiService.call(`/donations/ofertas/${id}`, 'DELETE');
            showToast('Oferta excluída com sucesso!', 'success');
            showOfertas();
        } catch (error) {
            showToast('Erro ao excluir oferta: ' + error.message, 'danger');
        }
    }
}