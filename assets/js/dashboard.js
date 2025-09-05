// Este evento garante que o script só rode depois que toda a página for carregada.
document.addEventListener('DOMContentLoaded', () => {

    // 1. PEGAR O PERFIL DO USUÁRIO
    // Pega o perfil salvo no localStorage durante o teste vocacional.
    const userProfile = localStorage.getItem('userVocationalProfile');

    // Se não houver perfil, não faz nada.
    if (!userProfile) {
        console.log("Perfil vocacional não encontrado. O usuário precisa completar o teste.");
        return;
    }

    console.log("Perfil do usuário:", userProfile);

    // 2. FILTRAR O CONTEÚDO
    // Filtra os cursos e vagas do 'banco de dados' com base no perfil do usuário.
    const recommendedCourses = mockCourses.filter(course =>
        course.tags.some(tag => userProfile.includes(tag))
    );

    const recommendedJobs = mockJobs.filter(job =>
        job.tags.some(tag => userProfile.includes(tag))
    );

    // 3. EXIBIR O CONTEÚDO NA TELA
    renderContent('cursos-list', recommendedCourses, createCourseCard);
    renderContent('vagas-list', recommendedJobs, createJobCard);
});


/**
 * Função genérica para renderizar conteúdo em um container.
 * @param {string} containerId - O ID do elemento onde o conteúdo será inserido.
 * @param {Array} items - O array de dados (cursos ou vagas).
 * @param {Function} cardCreator - A função que cria o HTML para cada item.
 */
function renderContent(containerId, items, cardCreator) {
    const container = document.getElementById(containerId);

    // Se não houver container ou items, não faz nada.
    if (!container || items.length === 0) {
        return; // Mantém a mensagem "Nenhuma recomendação..."
    }

    // Limpa o conteúdo placeholder
    container.innerHTML = '';
    container.classList.remove('content-placeholder'); // Remove a classe que centraliza o texto

    // Cria e adiciona um card para cada item
    items.forEach(item => {
        const cardHtml = cardCreator(item);
        container.innerHTML += cardHtml;
    });
}


// --- Funções para criar os cards de HTML ---

/**
 * Cria o HTML para um card de curso.
 * @param {object} course - O objeto do curso.
 * @returns {string} - O HTML do card.
 */
function createCourseCard(course) {
    return `
        <a href="${course.url}" target="_blank" class="recommendation-card">
            <h4 class="card-title">${course.title}</h4>
            <p class="card-subtitle">${course.platform}</p>
        </a>
    `;
}

/**
 * Cria o HTML para um card de vaga.
 * @param {object} job - O objeto da vaga.
 * @returns {string} - O HTML do card.
 */
function createJobCard(job) {
    return `
        <a href="${job.url}" target="_blank" class="recommendation-card">
            <h4 class="card-title">${job.title}</h4>
            <p class="card-subtitle">${job.company} - ${job.location}</p>
        </a>
    `;
}