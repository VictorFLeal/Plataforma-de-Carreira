// assets/js/script.js - Lógica Principal da Página Inicial (index.html)

document.addEventListener("DOMContentLoaded", () => {
  // Tenta carregar os dados globais e do localStorage
  const user = window.currentUser;
  const courses = window.coursesData;
  const jobs = window.jobsData;
  const resumeData = JSON.parse(localStorage.getItem("resumeData"));

  // Chama as funções para configurar a página inicial
  updateWelcomeMessage(user);
  updateProfileProgress(user, resumeData);
  populateRecommendations(courses, jobs);
  setupExportButton(resumeData);
  
  // NOVA CHAMADA DE FUNÇÃO
  setupUserProfileDropdown(user);
});

/**
 * Atualiza a mensagem de boas-vindas com o nome do usuário.
 */
function updateWelcomeMessage(user) {
  const el = document.getElementById("welcome-message");
  if (el && user && user.name)
    el.textContent = `Bem-vindo(a) de volta, ${user.name}!`;
}

/**
 * Calcula e exibe a porcentagem de preenchimento do perfil.
 */
function updateProfileProgress(user, resumeData) {
  const progressBar = document.getElementById("profile-progress-bar");
  const progressText = document.getElementById("progress-text");
  if (!progressBar || !progressText) return;

  let completion = 0;
  const totalPoints = 5; 

  if (user && user.name) completion++;
  if (resumeData && resumeData.personalInfo && resumeData.personalInfo.resumo) completion++;
  if (resumeData && resumeData.experiences && resumeData.experiences.length > 0) completion++;
  if (resumeData && resumeData.education && resumeData.education.length > 0) completion++;
  if (resumeData && resumeData.skills && resumeData.skills.length > 0) completion++;
  
  const percentage = Math.round((completion / totalPoints) * 100);
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `Seu perfil está ${percentage}% completo.`;
}

/**
 * Preenche os cards de recomendação de cursos e vagas.
 */
function populateRecommendations(courses, jobs) {
  const coursesList = document.getElementById("cursos-list");
  const vagasList = document.getElementById("vagas-list");

  if (coursesList && courses && courses.length > 0) {
    coursesList.innerHTML = `<p><strong>${courses[0].title}</strong> na plataforma ${courses[0].platform}.</p>`;
  }
  
  if (vagasList && jobs && jobs.length > 0) {
    vagasList.innerHTML = `<p><strong>${jobs[0].title}</strong> na empresa ${jobs[0].company}.</p>`;
  }
}

/**
 * Configura o botão "Exportar para PDF" da página inicial.
 */
function setupExportButton(resumeData) {
  const exportButton = document.querySelector(".export-pdf");
  if (exportButton) {
    exportButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!resumeData) {
        alert("Você precisa criar e salvar um currículo antes de exportar!");
        window.location.href = "/pages/curriculo.html";
        return;
      }
      
      generatePdfViaPrint(resumeData);
    });
  }
}


/**
 * NOVA FUNÇÃO: Configura o menu dropdown do usuário.
 */
function setupUserProfileDropdown(user) {
    const avatarButton = document.getElementById('user-avatar-btn');
    const dropdownMenu = document.getElementById('user-dropdown-menu');

    if (!avatarButton || !dropdownMenu) {
        console.error("Elementos do dropdown do usuário não encontrados.");
        return;
    }
    
    // 1. Preenche os dados do usuário no menu
    if (user) {
        document.getElementById('dropdown-user-name').textContent = user.name || 'Usuário';
        document.getElementById('dropdown-user-email').textContent = user.email || 'email@exemplo.com';
        // Se no futuro você tiver uma foto de perfil, pode atualizar o 'src' da imagem aqui.
        // document.getElementById('dropdown-user-photo').src = user.photoURL || '/assets/images/avatar-default.svg';
    }

    // 2. Lógica para abrir/fechar o menu
    avatarButton.addEventListener('click', (event) => {
        // Impede que o clique no botão feche o menu imediatamente (ver lógica abaixo)
        event.stopPropagation(); 
        dropdownMenu.classList.toggle('show');
    });

    // 3. Lógica para fechar o menu se clicar fora dele
    window.addEventListener('click', (event) => {
        // Se o menu estiver aberto e o clique NÃO foi dentro do menu
        if (dropdownMenu.classList.contains('show') && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}