// Funções de autenticação
let currentUser = null;

async function login(email, password) {
    try {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const data = await apiService.call('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: normalizedEmail, senha: password })
        });

        apiService.setToken(data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Redirecionar baseado no tipo de usuário
        if (['admin', 'tesoureiro', 'pastor'].includes(currentUser.tipo_usuario)) {
            // Administradores vão para o painel admin
            window.location.href = 'admin.html';
        } else {
            // Membros vão para o dashboard de membros
            showApp();
            showDashboard();
        }
        
        showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

async function register(userData) {
    try {
        const normalizedUserData = {
            ...userData,
            email: String(userData.email || '').trim().toLowerCase()
        };
        const data = await apiService.call('/auth/register', {
            method: 'POST',
            body: JSON.stringify(normalizedUserData)
        });

        apiService.setToken(data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Novos usuários são sempre membros, vão para dashboard de membros
        showApp();
        showDashboard();
        showToast('Cadastro realizado com sucesso! Bem-vindo(a)!', 'success');
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

function logout() {
    apiService.clearToken();
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginForm();
    showToast('Logout realizado com sucesso!', 'info');
}

function checkAuth() {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken && storedUser) {
        currentUser = JSON.parse(storedUser);
        apiService.setToken(storedToken);
        
        // Verificar se está na página correta
        const isAdminPage = window.location.pathname.includes('admin.html');
        const isAdmin = ['admin', 'tesoureiro', 'pastor'].includes(currentUser.tipo_usuario);
        
        // Apenas impedir que membros acessem admin
        if (!isAdmin && isAdminPage) {
            // Membro tentando acessar admin - redirecionar
            alert('Acesso negado! Você não tem permissão para acessar esta área.');
            window.location.href = 'index.html';
        } else if (!isAdminPage) {
            // Na página index.html (membros ou admin)
            showApp();
            showDashboard();
        }
    } else {
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        } else {
            showLoginForm();
        }
    }
}

// UI functions
function showLoginForm() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showApp() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    document.getElementById('userName').textContent = currentUser.nome;
    
    // Show admin menu if user is admin/tesoureiro/pastor
    if (['admin', 'tesoureiro', 'pastor'].includes(currentUser.tipo_usuario)) {
        document.getElementById('adminMenu').style.display = 'block';
    }
}