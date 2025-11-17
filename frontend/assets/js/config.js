// Configurações da aplicação
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : `${window.location.origin}/api`,
    APP_NAME: 'Sistema de Dízimos',
    VERSION: '1.0.0'
};