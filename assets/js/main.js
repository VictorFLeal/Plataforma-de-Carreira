// main.js - Lógica para a página inicial

document.addEventListener('DOMContentLoaded', () => {
    
    const exportPdfBtn = document.getElementById('export-pdf-main-btn');

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', (event) => {
            // Previne que o clique no botão siga o link da seção inteira.
            event.preventDefault();
            event.stopPropagation();

            console.log("Tentando exportar PDF da página inicial...");

            // 1. Tenta buscar os dados do currículo salvos no navegador.
            const savedData = localStorage.getItem('resumeData');

            // 2. Verifica se os dados existem.
            if (!savedData) {
                // Se não existem, avisa o usuário e o direciona.
                alert('Você precisa criar um currículo antes de exportar!\n\nVamos te levar para a página de criação.');
                window.location.href = 'curriculo.html';
                return;
            }

            // Se os dados existem, inicia o processo de criação do PDF.
            const data = JSON.parse(savedData);
            generatePdfFromData(data);
        });
    }
});


/**
 * Função que gera o PDF a partir dos dados do currículo.
 * @param {object} data - O objeto com todos os dados do currículo.
 */
function generatePdfFromData(data) {
    console.log("Gerando PDF com os dados:", data);

    // 1. Cria um elemento HTML temporário e invisível para montar o currículo.
    const resumeContainer = document.createElement('div');
    // Para a biblioteca funcionar corretamente, o elemento precisa estar no DOM.
    // O estilizamos para que não seja visível para o usuário.
    resumeContainer.style.position = 'absolute';
    resumeContainer.style.left = '-9999px';
    resumeContainer.style.width = '8.5in'; // Largura de uma folha A4
    resumeContainer.style.padding = '1in'; // Margens
    resumeContainer.style.background = 'white';
    resumeContainer.style.fontFamily = "'Poppins', sans-serif";
    resumeContainer.innerHTML = buildResumeHtml(data);
    
    document.body.appendChild(resumeContainer);

    // 2. Configurações do arquivo PDF.
    const userFullName = data.personalInfo.nome || 'Candidato';
    const fileName = `Currículo_${userFullName.replace(/\s+/g, '_')}.pdf`;
    const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // 3. Usa a biblioteca html2pdf para gerar o PDF e iniciar o download.
    html2pdf().from(resumeContainer).set(opt).save().then(() => {
        // 4. Remove o elemento temporário da página após o PDF ser gerado.
        document.body.removeChild(resumeContainer);
        console.log("PDF gerado e elemento temporário removido.");
    });
}


/**
 * Constrói o HTML do currículo a partir do objeto de dados.
 * @param {object} data - O objeto com todos os dados do currículo.
 * @returns {string} - Uma string contendo o HTML do currículo.
 */
function buildResumeHtml(data) {
    const p = data.personalInfo || {};

    // Mapeia os arrays para HTML
    const experiencesHtml = (data.experiences || []).map(exp => `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between;">
                <h4 style="margin:0; font-size: 14pt;">${exp.cargo || ''}</h4>
                <span style="font-style: italic; color: #555;">${exp.periodo || ''}</span>
            </div>
            <p style="margin:2px 0; font-weight: bold; font-size: 12pt;">${exp.empresa || ''}</p>
            <p style="margin:2px 0; color: #333;">${exp.descricao || ''}</p>
        </div>
    `).join('');

    const educationHtml = (data.education || []).map(edu => `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between;">
                <h4 style="margin:0; font-size: 14pt;">${edu.curso || ''}</h4>
                <span style="font-style: italic; color: #555;">${edu.periodo || ''}</span>
            </div>
            <p style="margin:2px 0; font-weight: bold; font-size: 12pt;">${edu.instituicao || ''}</p>
        </div>
    `).join('');

    const skillsHtml = (data.skills || []).length > 0 ? `<p>${data.skills.join(', ')}</p>` : '';
    
    const languagesHtml = (data.languages || []).map(lang => `
        <p style="margin: 2px 0;"><strong>${lang.idioma || ''}:</strong> ${lang.nivel || ''}</p>
    `).join('');

    // Monta o HTML final com estilos inline para garantir a aparência no PDF
    return `
        <div style="text-align: center;">
            <h1 style="font-size: 28pt; margin: 0;">${p.nome || 'Seu Nome'}</h1>
            <h2 style="font-size: 18pt; color: #3B82F6; margin: 5px 0; font-weight: normal;">${p.cargo || 'Cargo Desejado'}</h2>
            <p style="font-size: 11pt; color: #555; margin-top: 10px;">
                ${p.email || ''} | ${p.telefone || ''} | ${p.linkedin || ''}
            </p>
        </div>

        <hr style="border: 1px solid #3B82F6; margin: 20px 0;">

        <h3 style="color: #3B82F6; font-size: 14pt; border-bottom: 2px solid #3B82F6; padding-bottom: 5px;">RESUMO</h3>
        <p>${p.resumo || ''}</p>

        <h3 style="color: #3B82F6; font-size: 14pt; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; margin-top: 20px;">EXPERIÊNCIA</h3>
        ${experiencesHtml}
        
        <h3 style="color: #3B82F6; font-size: 14pt; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; margin-top: 20px;">FORMAÇÃO</h3>
        ${educationHtml}

        <h3 style="color: #3B82F6; font-size: 14pt; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; margin-top: 20px;">HABILIDADES</h3>
        ${skillsHtml}
        
        <h3 style="color: #3B82F6; font-size: 14pt; border-bottom: 2px solid #3B82F6; padding-bottom: 5px; margin-top: 20px;">IDIOMAS</h3>
        ${languagesHtml}
    `;
}