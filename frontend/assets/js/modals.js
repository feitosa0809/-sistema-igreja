// Funções para gerenciar modals
function showNovoDizimoModal() {
    const modalHtml = `
        <div class="modal fade" id="novoDizimoModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
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
                                <select class="form-select" id="dizimoMetodo" required onchange="handleMetodoChange('dizimo')">
                                    <option value="">Selecione...</option>
                                    <option value="pix">PIX</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="transferencia">Transferência</option>
                                </select>
                            </div>
                            
                            <!-- PIX QR Code Section -->
                            <div id="dizimo-pix-section" style="display: none;" class="mb-3">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-qrcode"></i> Pagar com PIX</h6>
                                    <div class="text-center my-3" id="dizimo-qrcode"></div>
                                    <p class="small mb-2"><strong>Chave PIX:</strong></p>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="dizimo-pix-key" value="igreja@exemplo.com.br" readonly>
                                        <button class="btn btn-outline-secondary" type="button" onclick="copyPixKey('dizimo')">
                                            <i class="fas fa-copy"></i> Copiar
                                        </button>
                                    </div>
                                    <small class="text-muted d-block mt-2">Após realizar o pagamento, anexe o comprovante abaixo</small>
                                </div>
                            </div>
                            
                            <!-- Cartão Section -->
                            <div id="dizimo-cartao-section" style="display: none;" class="mb-3">
                                <div class="card">
                                    <div class="card-header bg-primary text-white">
                                        <h6 class="mb-0"><i class="fas fa-credit-card"></i> Dados do Cartão</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="form-label">Número do Cartão</label>
                                            <input type="text" class="form-control" id="dizimo-card-number" 
                                                   placeholder="0000 0000 0000 0000" maxlength="19">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nome no Cartão</label>
                                            <input type="text" class="form-control" id="dizimo-card-name" 
                                                   placeholder="NOME COMO NO CARTÃO">
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Validade</label>
                                                <input type="text" class="form-control" id="dizimo-card-expiry" 
                                                       placeholder="MM/AA" maxlength="5">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">CVV</label>
                                                <input type="text" class="form-control" id="dizimo-card-cvv" 
                                                       placeholder="000" maxlength="4">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Transferência Section -->
                            <div id="dizimo-transferencia-section" style="display: none;" class="mb-3">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-university"></i> Dados Bancários para Transferência</h6>
                                    <div class="mb-3">
                                        <p class="mb-1"><strong>Banco:</strong> Banco do Brasil</p>
                                        <p class="mb-1"><strong>Agência:</strong> 0001-2</p>
                                        <p class="mb-1"><strong>Conta Corrente:</strong> 12345-6</p>
                                        <p class="mb-1"><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                                        <p class="mb-0"><strong>Favorecido:</strong> Igreja Exemplo</p>
                                    </div>
                                    <hr>
                                    <p class="small mb-2"><strong>Preencha os dados da transferência:</strong></p>
                                    <div class="mb-3">
                                        <label class="form-label">Data da Transferência</label>
                                        <input type="date" class="form-control" id="dizimo-transfer-date">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Número do Comprovante/DOC</label>
                                        <input type="text" class="form-control" id="dizimo-transfer-doc" 
                                               placeholder="Ex: DOC123456 ou TED789012">
                                    </div>
                                    <small class="text-muted d-block mt-2">Após realizar a transferência, anexe o comprovante abaixo</small>
                                </div>
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
                                <select class="form-select" id="ofertaMetodo" required onchange="handleMetodoChange('oferta')">
                                    <option value="">Selecione...</option>
                                    <option value="pix">PIX</option>
                                    <option value="cartao">Cartão</option>
                                    <option value="transferencia">Transferência</option>
                                </select>
                            </div>
                            
                            <!-- PIX QR Code Section -->
                            <div id="oferta-pix-section" style="display: none;" class="mb-3">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-qrcode"></i> Pagar com PIX</h6>
                                    <div class="text-center my-3" id="oferta-qrcode"></div>
                                    <p class="small mb-2"><strong>Chave PIX:</strong></p>
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="oferta-pix-key" value="igreja@exemplo.com.br" readonly>
                                        <button class="btn btn-outline-secondary" type="button" onclick="copyPixKey('oferta')">
                                            <i class="fas fa-copy"></i> Copiar
                                        </button>
                                    </div>
                                    <small class="text-muted d-block mt-2">Após realizar o pagamento, anexe o comprovante abaixo</small>
                                </div>
                            </div>
                            
                            <!-- Cartão Section -->
                            <div id="oferta-cartao-section" style="display: none;" class="mb-3">
                                <div class="card">
                                    <div class="card-header bg-success text-white">
                                        <h6 class="mb-0"><i class="fas fa-credit-card"></i> Dados do Cartão</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label class="form-label">Número do Cartão</label>
                                            <input type="text" class="form-control" id="oferta-card-number" 
                                                   placeholder="0000 0000 0000 0000" maxlength="19">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Nome no Cartão</label>
                                            <input type="text" class="form-control" id="oferta-card-name" 
                                                   placeholder="NOME COMO NO CARTÃO">
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Validade</label>
                                                <input type="text" class="form-control" id="oferta-card-expiry" 
                                                       placeholder="MM/AA" maxlength="5">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">CVV</label>
                                                <input type="text" class="form-control" id="oferta-card-cvv" 
                                                       placeholder="000" maxlength="4">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Transferência Section -->
                            <div id="oferta-transferencia-section" style="display: none;" class="mb-3">
                                <div class="alert alert-info">
                                    <h6><i class="fas fa-university"></i> Dados Bancários para Transferência</h6>
                                    <div class="mb-3">
                                        <p class="mb-1"><strong>Banco:</strong> Banco do Brasil</p>
                                        <p class="mb-1"><strong>Agência:</strong> 0001-2</p>
                                        <p class="mb-1"><strong>Conta Corrente:</strong> 12345-6</p>
                                        <p class="mb-1"><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                                        <p class="mb-0"><strong>Favorecido:</strong> Igreja Exemplo</p>
                                    </div>
                                    <hr>
                                    <p class="small mb-2"><strong>Preencha os dados da transferência:</strong></p>
                                    <div class="mb-3">
                                        <label class="form-label">Data da Transferência</label>
                                        <input type="date" class="form-control" id="oferta-transfer-date">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Número do Comprovante/DOC</label>
                                        <input type="text" class="form-control" id="oferta-transfer-doc" 
                                               placeholder="Ex: DOC123456 ou TED789012">
                                    </div>
                                    <small class="text-muted d-block mt-2">Após realizar a transferência, anexe o comprovante abaixo</small>
                                </div>
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
                            <div id="camposCartao" class="border rounded p-3 mb-3" style="display: none;">
                                <h6 class="mb-3"><i class="fas fa-credit-card"></i> Dados do Cartão</h6>
                                <div class="mb-2">
                                    <label for="contribuicaoNomeCartao" class="form-label">Nome no Cartão</label>
                                    <input type="text" class="form-control" id="contribuicaoNomeCartao" placeholder="Nome impresso no cartão">
                                </div>
                                <div class="mb-2">
                                    <label for="contribuicaoNumeroCartao" class="form-label">Número do Cartão</label>
                                    <input type="text" class="form-control" id="contribuicaoNumeroCartao" maxlength="19" placeholder="0000 0000 0000 0000">
                                    <small id="bandeiraCartaoHint" class="text-muted">Bandeira: não identificada</small>
                                </div>
                                <div class="row">
                                    <div class="col-6 mb-2">
                                        <label for="contribuicaoValidadeCartao" class="form-label">Validade (MM/AA)</label>
                                        <input type="text" class="form-control" id="contribuicaoValidadeCartao" maxlength="5" placeholder="12/30">
                                    </div>
                                    <div class="col-6 mb-2">
                                        <label for="contribuicaoCvvCartao" class="form-label">Código de Segurança</label>
                                        <input type="password" class="form-control" id="contribuicaoCvvCartao" maxlength="4" placeholder="123">
                                    </div>
                                </div>
                                <small class="text-muted">Por segurança, o CVV e o número completo do cartão não são armazenados.</small>
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

    const metodoSelect = document.getElementById('contribuicaoMetodo');
    const camposCartao = document.getElementById('camposCartao');
    const numeroCartaoInput = document.getElementById('contribuicaoNumeroCartao');
    const validadeCartaoInput = document.getElementById('contribuicaoValidadeCartao');
    const bandeiraCartaoHint = document.getElementById('bandeiraCartaoHint');

    const detectarBandeira = (numero) => {
        if (/^4\d{12}(\d{3})?$/.test(numero)) return 'visa';
        if (/^5[1-5]\d{14}$/.test(numero)) return 'mastercard';
        return 'desconhecida';
    };

    const validarLuhn = (numero) => {
        let soma = 0;
        let deveDobrar = false;

        for (let index = numero.length - 1; index >= 0; index--) {
            let digito = parseInt(numero.charAt(index), 10);
            if (deveDobrar) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }
            soma += digito;
            deveDobrar = !deveDobrar;
        }

        return soma % 10 === 0;
    };

    metodoSelect.addEventListener('change', () => {
        const isCartao = metodoSelect.value === 'cartao';
        camposCartao.style.display = isCartao ? 'block' : 'none';
    });

    numeroCartaoInput.addEventListener('input', (e) => {
        const somenteDigitos = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatado = somenteDigitos.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = formatado;

        const bandeira = detectarBandeira(somenteDigitos);
        const labelBandeira = bandeira === 'mastercard' ? 'Mastercard' : bandeira === 'visa' ? 'Visa' : 'não identificada';
        bandeiraCartaoHint.textContent = `Bandeira: ${labelBandeira}`;
        bandeiraCartaoHint.className = bandeira === 'desconhecida' ? 'text-muted' : 'text-success';
    });

    validadeCartaoInput.addEventListener('input', (e) => {
        const somenteDigitos = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (somenteDigitos.length >= 3) {
            e.target.value = `${somenteDigitos.slice(0, 2)}/${somenteDigitos.slice(2)}`;
        } else {
            e.target.value = somenteDigitos;
        }
    });
    
    // Add form submit handler
    document.getElementById('contribuirForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const metodoPagamento = document.getElementById('contribuicaoMetodo').value;
            let observacoes = document.getElementById('contribuicaoObservacoes').value;

            if (metodoPagamento === 'cartao') {
                const nomeCartao = document.getElementById('contribuicaoNomeCartao').value.trim();
                const numeroCartao = document.getElementById('contribuicaoNumeroCartao').value.replace(/\D/g, '');
                const validadeCartao = document.getElementById('contribuicaoValidadeCartao').value.trim();
                const cvvCartao = document.getElementById('contribuicaoCvvCartao').value.trim();

                if (!nomeCartao || !numeroCartao || !validadeCartao || !cvvCartao) {
                    showToast('Preencha todos os dados do cartão.', 'warning');
                    return;
                }

                if (numeroCartao.length < 13 || numeroCartao.length > 16) {
                    showToast('Número do cartão inválido.', 'warning');
                    return;
                }

                const bandeiraCartao = detectarBandeira(numeroCartao);
                if (!['visa', 'mastercard'].includes(bandeiraCartao)) {
                    showToast('Bandeira não suportada. Use cartão Visa ou Mastercard.', 'warning');
                    return;
                }

                if (!validarLuhn(numeroCartao)) {
                    showToast('Número do cartão inválido (falha na validação).', 'warning');
                    return;
                }

                if (!/^([0][1-9]|1[0-2])\/(\d{2})$/.test(validadeCartao)) {
                    showToast('Validade do cartão inválida. Use MM/AA.', 'warning');
                    return;
                }

                const [mesValidade, anoValidade] = validadeCartao.split('/');
                const dataAtual = new Date();
                const anoAtual = Number(String(dataAtual.getFullYear()).slice(-2));
                const mesAtual = dataAtual.getMonth() + 1;
                const expirada = Number(anoValidade) < anoAtual || (Number(anoValidade) === anoAtual && Number(mesValidade) < mesAtual);
                if (expirada) {
                    showToast('Cartão com validade expirada.', 'warning');
                    return;
                }

                if (!/^\d{3,4}$/.test(cvvCartao)) {
                    showToast('Código de segurança inválido.', 'warning');
                    return;
                }

                const finalCartao = numeroCartao.slice(-4);
                const resumoCartao = `Pagamento em cartão (${bandeiraCartao.toUpperCase()}) - Nome: ${nomeCartao} - Final: **** ${finalCartao} - Validade: ${validadeCartao}`;
                observacoes = observacoes ? `${observacoes}\n${resumoCartao}` : resumoCartao;
            }

            const formData = new FormData();
            formData.append('valor', document.getElementById('contribuicaoValor').value);
            formData.append('metodo_pagamento', metodoPagamento);
            formData.append('observacoes', observacoes);
            
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

// Função para controlar exibição de seções de pagamento
function handleMetodoChange(tipo) {
    const metodo = document.getElementById(`${tipo}Metodo`).value;
    
    // Esconder todas as seções
    const pixSection = document.getElementById(`${tipo}-pix-section`);
    const cartaoSection = document.getElementById(`${tipo}-cartao-section`);
    const transferenciaSection = document.getElementById(`${tipo}-transferencia-section`);
    
    if (pixSection) pixSection.style.display = 'none';
    if (cartaoSection) cartaoSection.style.display = 'none';
    if (transferenciaSection) transferenciaSection.style.display = 'none';
    
    // Mostrar seção correspondente
    if (metodo === 'pix' && pixSection) {
        pixSection.style.display = 'block';
        generateQRCode(tipo);
    } else if (metodo === 'cartao' && cartaoSection) {
        cartaoSection.style.display = 'block';
    } else if (metodo === 'transferencia' && transferenciaSection) {
        transferenciaSection.style.display = 'block';
        // Definir data de hoje como padrão
        const today = new Date().toISOString().split('T')[0];
        const transferDateInput = document.getElementById(`${tipo}-transfer-date`);
        if (transferDateInput) transferDateInput.value = today;
    }
}

// Gerar QR Code para PIX
function generateQRCode(tipo) {
    const valor = document.getElementById(`${tipo}Valor`)?.value || '0.00';
    const chavePix = 'igreja@exemplo.com.br'; // Substituir pela chave real
    
    // Dados PIX simplificados (EMV QR Code seria mais complexo)
    const pixData = `PIX:${chavePix}:${valor}`;
    
    // Gerar QR Code usando API externa (qrserver.com)
    const qrcodeContainer = document.getElementById(`${tipo}-qrcode`);
    if (qrcodeContainer) {
        qrcodeContainer.innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData)}" 
                 alt="QR Code PIX" class="img-fluid">
        `;
    }
}

// Copiar chave PIX
function copyPixKey(tipo) {
    const pixKeyInput = document.getElementById(`${tipo}-pix-key`);
    if (pixKeyInput) {
        pixKeyInput.select();
        document.execCommand('copy');
        showToast('Chave PIX copiada!', 'success');
    }
}

// Formatar número do cartão
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar formatação para campos de cartão quando existirem
    const formatCardNumber = (input) => {
        let value = input.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        input.value = formattedValue;
    };
    
    const formatExpiry = (input) => {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        input.value = value;
    };
    
    // Listeners serão adicionados dinamicamente quando os modais forem criados
});