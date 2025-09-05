// Este script verifica qual formulário está na página (login ou registro)
// e aplica a lógica correta para cada um.

// --- LÓGICA PARA A PÁGINA DE LOGIN ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio real do formulário

        // 1. Aqui você colocaria a lógica para validar o login e senha do usuário
        console.log("Login efetuado com sucesso! Redirecionando para o dashboard...");

        // 2. Redireciona o usuário para a página principal (dashboard)
        window.location.href = 'index.html';
    });
}


// --- LÓGICA PARA A PÁGINA DE REGISTRO ---
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio real do formulário

        // Validação para verificar se as senhas coincidem
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return; // Interrompe a execução se as senhas forem diferentes
        }

        // Se a validação passar:
        console.log("Conta criada com sucesso! Redirecionando para o teste vocacional...");

        // Redireciona o usuário para a página do teste vocacional, como planejado
        window.location.href = 'vocational-test.html';
    });
}