// Funções para gerenciar modals
function showNovoDizimoModal() {
    const modalHtml = `
        <div class="modal fade" id="novoDizimoModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Novo Dízimo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="novoDizimoForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="dizimoValor" class="form-label">Valor (R$)</label>
                                <input type="number" class="form-control" id="dizimoValor" step="0.01" min="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label for="dizimoData" class="form-label">Data do Pagamento</label>
                                <input type="date" class="form-control" id="dizimoData" required>
                            </div>
                            <div class="mb-3">
                                <label for="dizimoMetodo" class="form-label">Método de Pagamento</label>
                                <select class="form-select" id="dizimoMetodo" required>
                                    <option value="">Selecione...</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">PIX</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="transferencia">Transferência</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="dizimoComprovante" class="form-label">Comprovante (opcional)</label>
                                <input type="file" class="form-control" id="dizimoComprovante" accept="image/*">
                            </div>
                            <div class="mb-3">
                                <label for="dizimoObservacoes" class="form-label">Observações</label>
                                <textarea class="form-control" id="dizimoObservacoes" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Dízimo</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    // Set today as default date
    document.getElementById('dizimoData').value = new Date().toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('novoDizimoModal'));
    modal.show();
    
    // Add form submit handler
    document.getElementById('novoDizimoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('valor', document.getElementById('dizimoValor').value);
        formData.append('data_pagamento', document.getElementById('dizimoData').value);
        formData.append('metodo_pagamento', document.getElementById('dizimoMetodo').value);
        formData.append('observacoes', document.getElementById('dizimoObservacoes').value);
        
        const comprovante = document.getElementById('dizimoComprovante').files[0];
        if (comprovante) {
            formData.append('comprovante', comprovante);
        }
        
        submitDizimo(formData);
    });
}

function showNovaOfertaModal() {
    const modalHtml = `
        <div class="modal fade" id="novaOfertaModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nova Oferta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="novaOfertaForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="ofertaValor" class="form-label">Valor (R$)</label>
                                <input type="number" class="form-control" id="ofertaValor" step="0.01" min="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label for="ofertaData" class="form-label">Data da Oferta</label>
                                <input type="date" class="form-control" id="ofertaData" required>
                            </div>
                            <div class="mb-3">
                                <label for="ofertaTipo" class="form-label">Tipo de Oferta</label>
                                <input type="text" class="form-control" id="ofertaTipo" placeholder="Ex: Oferta de Gratidão, Missões, etc." required>
                            </div>
                            <div class="mb-3">
                                <label for="ofertaMetodo" class="form-label">Método de Pagamento</label>
                                <select class="form-select" id="ofertaMetodo" required>
                                    <option value="">Selecione...</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">PIX</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="transferencia">Transferência</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="ofertaComprovante" class="form-label">Comprovante (opcional)</label>
                                <input type="file" class="form-control" id="ofertaComprovante" accept="image/*">
                            </div>
                            <div class="mb-3">
                                <label for="ofertaObservacoes" class="form-label">Observações</label>
                                <textarea class="form-control" id="ofertaObservacoes" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-success">Salvar Oferta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    // Set today as default date
    document.getElementById('ofertaData').value = new Date().toISOString().split('T')[0];
    
    const modal = new bootstrap.Modal(document.getElementById('novaOfertaModal'));
    modal.show();
    
    // Add form submit handler
    document.getElementById('novaOfertaForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('valor', document.getElementById('ofertaValor').value);
        formData.append('data_oferta', document.getElementById('ofertaData').value);
        formData.append('tipo_oferta', document.getElementById('ofertaTipo').value);
        formData.append('metodo_pagamento', document.getElementById('ofertaMetodo').value);
        formData.append('observacoes', document.getElementById('ofertaObservacoes').value);
        
        const comprovante = document.getElementById('ofertaComprovante').files[0];
        if (comprovante) {
            formData.append('comprovante', comprovante);
        }
        
        submitOferta(formData);
    });
}

function showContribuirModal(campanhaId, campanhaName) {
    const modalHtml = `
        <div class="modal fade" id="contribuirModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Contribuir para: ${campanhaName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="contribuirForm">
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="contribuicaoValor" class="form-label">Valor (R$)</label>
                                <input type="number" class="form-control" id="contribuicaoValor" step="0.01" min="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label for="contribuicaoMetodo" class="form-label">Método de Pagamento</label>
                                <select class="form-select" id="contribuicaoMetodo" required>
                                    <option value="">Selecione...</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">PIX</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="transferencia">Transferência</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="contribuicaoComprovante" class="form-label">Comprovante (opcional)</label>
                                <input type="file" class="form-control" id="contribuicaoComprovante" accept="image/*">
                            </div>
                            <div class="mb-3">
                                <label for="contribuicaoObservacoes" class="form-label">Observações</label>
                                <textarea class="form-control" id="contribuicaoObservacoes" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Contribuir</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    const modal = new bootstrap.Modal(document.getElementById('contribuirModal'));
    modal.show();
    
    // Add form submit handler
    document.getElementById('contribuirForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('valor', document.getElementById('contribuicaoValor').value);
            formData.append('metodo_pagamento', document.getElementById('contribuicaoMetodo').value);
            formData.append('observacoes', document.getElementById('contribuicaoObservacoes').value);
            
            const comprovante = document.getElementById('contribuicaoComprovante').files[0];
            if (comprovante) {
                formData.append('comprovante', comprovante);
            }
            
            await apiService.uploadFile(`/donations/campanhas/${campanhaId}/contribuir`, formData);
            hideModal('contribuirModal');
            showToast('Contribuição realizada com sucesso!', 'success');
            showCampanhas();
        } catch (error) {
            showToast('Erro ao realizar contribuição: ' + error.message, 'danger');
        }
    });
}

function hideModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}