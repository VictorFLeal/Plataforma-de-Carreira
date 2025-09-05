// assets/js/perfil.js (VERSÃO COMPLETA E CORRIGIDA)

document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados de todas as fontes necessárias
    const user = window.currentUser;
    const resumeData = JSON.parse(localStorage.getItem('resumeData'));
    const profileData = JSON.parse(localStorage.getItem('userProfileData'));

    loadProfilePhoto();

    // A página de perfil depende de dados do perfil para ser exibida
    if (!profileData) {
        alert('Nenhum dado de perfil encontrado. Por favor, edite seu perfil primeiro.');
        window.location.href = '/pages/editar-perfil.html';
        return;
    }

    // Preenche a página com todos os dados
    populateProfileData(user, resumeData, profileData);
    
    // CHAMADA RESTAURADA: Ativa os botões da página
    setupProfileButtons(resumeData);
});

/**
 * Preenche todos os elementos da página de perfil com os dados carregados.
 */
function populateProfileData(user, resumeData, profileData) {
    const personalResume = resumeData ? resumeData.personalInfo || {} : {};
    const personalProfile = profileData || {};

    // --- Sidebar ---
    document.getElementById('profile-name').textContent = personalResume.nome || user.name;
    document.getElementById('profile-role').textContent = personalResume.cargo || 'Cargo não definido';
    document.getElementById('profile-title-pro').textContent = personalProfile.tituloProfissional || 'Título não definido';
    
    document.getElementById('profile-email').innerHTML = `📧 <span>${personalResume.email || user.email}</span>`;
    document.getElementById('profile-phone').innerHTML = `📞 <span>${personalResume.telefone || 'Não informado'}</span>`;
    document.getElementById('profile-linkedin').innerHTML = `🔗 <span>${personalResume.linkedin || 'Não informado'}</span>`;
    document.getElementById('profile-address').innerHTML = `📍 <span>${personalProfile.endereco || 'Não informado'}</span>`;
    document.getElementById('profile-birthdate').innerHTML = `🎂 <span>${personalProfile.nascimento || 'Não informado'}</span>`;
    
    // --- Conteúdo Principal ---
    document.getElementById('academic-instituicao').textContent = personalProfile.instituicao || 'Não informado';
    document.getElementById('academic-curso').textContent = personalProfile.cursoAtual || 'Não informado';
    document.getElementById('academic-semestre').textContent = personalProfile.semestreAtual || 'Não informado'; // Corrigido
    document.getElementById('academic-previsao').textContent = personalProfile.previsaoTermino || 'Não informado';
    
    document.getElementById('career-objetivo').textContent = personalProfile.objetivoPosFormatura || 'Não informado';
    document.getElementById('career-preferencias').textContent = personalProfile.preferenciasTrabalho || 'Não informado';
}

/**
 * FUNÇÃO RESTAURADA: Configura os botões de ação da página.
 */
function setupProfileButtons(resumeData) {
    const exportButton = document.getElementById('export-profile-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            // Verifica se os dados do CURRÍCULO existem, pois são eles que serão exportados
            if (!resumeData) {
                alert("Para exportar, os dados do seu currículo precisam estar preenchidos. Por favor, visite o Construtor de Currículo.");
                return;
            }
            // Reutiliza nossa função de exportação do arquivo export-pdf.js
            generatePdfViaPrint(resumeData);
        });
    }
}

/**
 * Carrega a foto de perfil do localStorage e a exibe na página.
 */
function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    const profilePhotoImg = document.getElementById('profile-photo');
    if (savedPhoto && profilePhotoImg) {
        profilePhotoImg.src = savedPhoto;
        // Atualiza a foto no header também, para manter a consistência
        const headerPhoto = document.getElementById('dropdown-user-photo');
        if(headerPhoto) headerPhoto.src = savedPhoto;
    }
}