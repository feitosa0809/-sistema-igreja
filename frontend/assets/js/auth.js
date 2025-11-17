// Funções de autenticação
let currentUser = null;

async function login(email, password) {
    try {
        const data = await apiService.call('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha: password })
        });

        apiService.setToken(data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showApp();
        showDashboard();
        showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

async function register(userData) {
    try {
        const data = await apiService.call('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        apiService.setToken(data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showApp();
        showDashboard();
        showToast('Cadastro realizado com sucesso!', 'success');
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
        showApp();
        showDashboard();
    } else {
        showLoginForm();
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