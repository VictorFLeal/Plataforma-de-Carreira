// assets/js/editar-perfil.js

document.addEventListener('DOMContentLoaded', () => {
    loadProfileDataForEdit();
    setupPhotoUpload();

    // Este listener só funciona se o botão com id="save-profile-btn" existir no HTML
    const saveButton = document.getElementById('save-profile-btn');
    if (saveButton) {
        saveButton.addEventListener('click', saveProfileData);
    } else {
        console.error("ERRO: Botão de salvar não encontrado! Verifique o ID no HTML.");
    }
});

// Esta função precisa do <h3 id="profile-name"> para funcionar
function loadProfileDataForEdit() {
    const user = window.currentUser;
    document.getElementById('profile-name').textContent = user.name || "[Nome do Usuário]";

    const profileData = JSON.parse(localStorage.getItem('userProfileData'));
    if (profileData) {
        document.getElementById('titulo-profissional').value = profileData.tituloProfissional || '';
        document.getElementById('cpf').value = profileData.cpf || '';
        document.getElementById('nascimento').value = profileData.nascimento || '';
        document.getElementById('endereco').value = profileData.endereco || '';
        document.getElementById('instituicao').value = profileData.instituicao || '';
        document.getElementById('curso-atual').value = profileData.cursoAtual || '';
        document.getElementById('semestre-atual').value = profileData.semestreAtual || '';
        document.getElementById('previsao-termino').value = profileData.previsaoTermino || '';
        document.getElementById('objetivo-pos-formatura').value = profileData.objetivoPosFormatura || '';
        document.getElementById('preferencias-trabalho').value = profileData.preferenciasTrabalho || '';
    }
    loadProfilePhoto();
}

function saveProfileData() {
    const profileData = {
        tituloProfissional: document.getElementById('titulo-profissional').value,
        cpf: document.getElementById('cpf').value,
        nascimento: document.getElementById('nascimento').value,
        endereco: document.getElementById('endereco').value,
        instituicao: document.getElementById('instituicao').value,
        cursoAtual: document.getElementById('curso-atual').value,
        semestreAtual: document.getElementById('semestre-atual').value,
        previsaoTermino: document.getElementById('previsao-termino').value,
        objetivoPosFormatura: document.getElementById('objetivo-pos-formatura').value,
        preferenciasTrabalho: document.getElementById('preferencias-trabalho').value,
    };
    localStorage.setItem('userProfileData', JSON.stringify(profileData));
    alert('Perfil salvo com sucesso!');
    window.location.href = '/pages/perfil.html';
}

function setupPhotoUpload() {
    const photoContainer = document.querySelector('.profile-photo-container');
    const photoUploadInput = document.getElementById('photo-upload');
    const profilePhoto = document.getElementById('profile-photo');

    if (photoContainer && photoUploadInput && profilePhoto) {
        photoContainer.addEventListener('click', () => {
            photoUploadInput.click();
        });

        photoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageDataUrl = e.target.result;
                    profilePhoto.src = imageDataUrl;
                    localStorage.setItem('userProfilePhoto', imageDataUrl);
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    const profilePhoto = document.getElementById('profile-photo');
    if (savedPhoto && profilePhoto) {
        profilePhoto.src = savedPhoto;
    }
}