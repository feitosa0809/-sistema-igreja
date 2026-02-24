// Gerenciamento de Usuários
let todosUsuarios = [];

// Carregar usuários ao abrir a seção
async function carregarUsuarios() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const response = await fetch(`${API_URL}/usuarios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar usuários');
        }

        const usuarios = await response.json();
        todosUsuarios = usuarios;
        
        // Aplicar filtros
        const filtroTipo = document.getElementById('filterTipo')?.value || '';
        const filtroStatus = document.getElementById('filterStatus')?.value || '';
        const busca = document.getElementById('searchUser')?.value.toLowerCase() || '';
        
        let usuariosFiltrados = usuarios;
        
        if (filtroTipo) {
            usuariosFiltrados = usuariosFiltrados.filter(u => u.tipo_usuario === filtroTipo);
        }
        
        if (filtroStatus) {
            usuariosFiltrados = usuariosFiltrados.filter(u => u.status === filtroStatus);
        }
        
        if (busca) {
            usuariosFiltrados = usuariosFiltrados.filter(u => 
                u.nome.toLowerCase().includes(busca) || 
                u.email.toLowerCase().includes(busca)
            );
        }
        
        exibirUsuarios(usuariosFiltrados);
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        mostrarAlerta('Erro ao carregar usuários', 'danger');
    }
}

// Exibir usuários na tabela
function exibirUsuarios(usuarios) {
    const tbody = document.querySelector('#usersTable tbody');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="fas fa-users fa-2x mb-2"></i>
                    <p>Nenhum usuário encontrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usuarios.map(usuario => {
        const badge = getBadgeTipo(usuario.tipo_usuario);
        const statusBadge = usuario.status === 'ativo' 
            ? '<span class="badge bg-success">Ativo</span>' 
            : '<span class="badge bg-secondary">Inativo</span>';
        
        const dataCadastro = new Date(usuario.data_cadastro).toLocaleDateString('pt-BR');
        
        return `
            <tr>
                <td>
                    <i class="fas fa-user-circle me-2 text-primary"></i>
                    ${usuario.nome}
                </td>
                <td>${usuario.email}</td>
                <td>${badge}</td>
                <td>${statusBadge}</td>
                <td>${dataCadastro}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalPromover(${usuario.id}, '${usuario.nome}', '${usuario.tipo_usuario}')" title="Alterar tipo">
                            <i class="fas fa-user-tag"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-${usuario.status === 'ativo' ? 'warning' : 'success'}" 
                                onclick="alterarStatus(${usuario.id}, '${usuario.status === 'ativo' ? 'inativo' : 'ativo'}', '${usuario.nome}')" 
                                title="${usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${usuario.status === 'ativo' ? 'ban' : 'check'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="confirmarExclusao(${usuario.id}, '${usuario.nome}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Badge de tipo de usuário
function getBadgeTipo(tipo) {
    const badges = {
        'admin': '<span class="badge bg-danger"><i class="fas fa-shield-alt me-1"></i>Admin</span>',
        'pastor': '<span class="badge bg-info"><i class="fas fa-cross me-1"></i>Pastor</span>',
        'tesoureiro': '<span class="badge bg-warning"><i class="fas fa-wallet me-1"></i>Tesoureiro</span>',
        'membro': '<span class="badge bg-secondary"><i class="fas fa-user me-1"></i>Membro</span>'
    };
    return badges[tipo] || `<span class="badge bg-secondary">${tipo}</span>`;
}

// Modal para promover/rebaixar usuário
function mostrarModalPromover(id, nome, tipoAtual) {
    const tipos = [
        { value: 'admin', label: 'Administrador', icon: 'shield-alt' },
        { value: 'pastor', label: 'Pastor', icon: 'cross' },
        { value: 'tesoureiro', label: 'Tesoureiro', icon: 'wallet' },
        { value: 'membro', label: 'Membro', icon: 'user' }
    ];
    
    const opcoesHtml = tipos
        .filter(t => t.value !== tipoAtual)
        .map(t => `
            <button class="btn btn-outline-primary w-100 mb-2" onclick="alterarTipo(${id}, '${t.value}', '${nome}')">
                <i class="fas fa-${t.icon} me-2"></i>${t.label}
            </button>
        `).join('');
    
    Swal.fire({
        title: 'Alterar Tipo de Usuário',
        html: `
            <p class="mb-3">Usuário: <strong>${nome}</strong></p>
            <p class="mb-3">Tipo atual: ${getBadgeTipo(tipoAtual)}</p>
            <p class="mb-3">Escolha o novo tipo:</p>
            ${opcoesHtml}
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        width: '500px'
    });
}

// Alterar tipo de usuário
async function alterarTipo(id, novoTipo, nome) {
    try {
        Swal.close();
        
        const resultado = await Swal.fire({
            title: 'Confirmar alteração?',
            html: `Deseja alterar o tipo de <strong>${nome}</strong> para <strong>${novoTipo}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, alterar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0d6efd'
        });
        
        if (!resultado.isConfirmed) return;
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/usuarios/${id}/tipo`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tipo_usuario: novoTipo })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao alterar tipo');
        }

        await Swal.fire({
            title: 'Sucesso!',
            text: data.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        carregarUsuarios();
    } catch (error) {
        console.error('Erro ao alterar tipo:', error);
        Swal.fire({
            title: 'Erro!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Alterar status (ativar/desativar)
async function alterarStatus(id, novoStatus, nome) {
    try {
        const acao = novoStatus === 'ativo' ? 'ativar' : 'desativar';
        
        const resultado = await Swal.fire({
            title: `${acao.charAt(0).toUpperCase() + acao.slice(1)} usuário?`,
            html: `Deseja ${acao} o usuário <strong>${nome}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sim, ${acao}`,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: novoStatus === 'ativo' ? '#198754' : '#ffc107'
        });
        
        if (!resultado.isConfirmed) return;
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/usuarios/${id}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao alterar status');
        }

        await Swal.fire({
            title: 'Sucesso!',
            text: data.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        carregarUsuarios();
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        Swal.fire({
            title: 'Erro!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Confirmar exclusão
async function confirmarExclusao(id, nome) {
    try {
        const resultado = await Swal.fire({
            title: 'ATENÇÃO!',
            html: `
                <p><strong>Esta ação não pode ser desfeita!</strong></p>
                <p>Deseja realmente excluir o usuário <strong>${nome}</strong>?</p>
                <p class="text-muted small">Nota: Usuários com dízimos/ofertas registrados não podem ser excluídos.</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        });
        
        if (!resultado.isConfirmed) return;
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao excluir usuário');
        }

        await Swal.fire({
            title: 'Excluído!',
            text: data.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        carregarUsuarios();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        Swal.fire({
            title: 'Erro!',
            text: error.message,
            icon: 'error'
        });
    }
}

// Função auxiliar para mostrar alertas
function mostrarAlerta(mensagem, tipo = 'info') {
    Swal.fire({
        text: mensagem,
        icon: tipo,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// Carregar usuários quando a seção for exibida
document.addEventListener('DOMContentLoaded', () => {
    // Observer para detectar quando a seção de usuários fica visível
    const usuariosSection = document.getElementById('usuarios');
    if (usuariosSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    carregarUsuarios();
                }
            });
        });
        
        observer.observe(usuariosSection, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
});
