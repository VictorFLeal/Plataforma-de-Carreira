// assets/js/configuracoes.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // 1. Define o estado inicial do toggle baseado no localStorage
    if (localStorage.getItem('theme') === 'dark') {
        themeToggle.checked = true;
    }

    // 2. Adiciona o listener para a mudança de estado
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Se o toggle for ativado, adiciona a classe e salva no localStorage
            document.documentElement.classList.add('theme-dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // Se o toggle for desativado, remove a classe e salva no localStorage
            document.documentElement.classList.remove('theme-dark');
            localStorage.setItem('theme', 'light');
        }
    });
});