// Arquivo principal da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Initialize toast container
    createToastContainer();
    
    // Check authentication status
    checkAuth();
    
    // Add event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await login(email, password);
        });
    }

    // Register form
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                nome: document.getElementById('regNome').value,
                email: document.getElementById('regEmail').value,
                telefone: document.getElementById('regTelefone').value,
                endereco: document.getElementById('regEndereco').value,
                data_nascimento: document.getElementById('regDataNascimento').value,
                senha: document.getElementById('regPassword').value
            };
            await register(userData);
        });
    }
}

// Toast notification system
function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
}

function showToast(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const iconClasses = {
        'success': 'fas fa-check-circle text-success',
        'danger': 'fas fa-exclamation-circle text-danger',
        'warning': 'fas fa-exclamation-triangle text-warning',
        'info': 'fas fa-info-circle text-info'
    };

    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header">
                <i class="${iconClasses[type]} me-2"></i>
                <strong class="me-auto">${CONFIG.APP_NAME}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    document.getElementById('toast-container').insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showToast('Ocorreu um erro inesperado. Tente novamente.', 'danger');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('Erro de conexão. Verifique sua internet.', 'warning');
});