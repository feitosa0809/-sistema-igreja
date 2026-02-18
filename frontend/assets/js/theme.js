// Gestão de Tema (Claro/Escuro)

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggleButton();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  createThemeToggleButton() {
    // Verifica se o botão já existe
    if (document.getElementById('themeToggle')) return;

    // Encontrar a navbar
    const navbar = document.querySelector('.navbar-nav.ms-auto');
    if (!navbar) return;

    // Criar item do menu
    const themeToggleItem = document.createElement('li');
    themeToggleItem.className = 'nav-item';
    themeToggleItem.innerHTML = `
      <a class="nav-link" href="#" id="themeToggle" title="Alternar tema">
        <i class="bi bi-moon-stars" id="themeIcon"></i>
      </a>
    `;

    // Inserir antes do dropdown do usuário
    const userDropdown = navbar.querySelector('.dropdown');
    if (userDropdown) {
      navbar.insertBefore(themeToggleItem, userDropdown);
    } else {
      navbar.appendChild(themeToggleItem);
    }

    // Adicionar evento de clique
    document.getElementById('themeToggle').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });

    this.updateToggleButton();
  }

  updateToggleButton() {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = this.currentTheme === 'light' 
        ? 'bi bi-moon-stars' 
        : 'bi bi-sun';
    }
  }
}

// Inicializar o gerenciador de temas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
