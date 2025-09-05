// assets/js/export-pdf.js - VERSÃO FINAL (POP-UP DE IMPRESSÃO DIMENSIONADO)

function generatePdfViaPrint(data) {
  console.log("MÉTODO DE IMPRESSÃO: Abrindo pop-up dimensionado para impressão.");

  const fullHtmlContent = buildResumeHtmlString(data);

  // --- A MUDANÇA ESTÁ AQUI ---
  // Adicionamos as dimensões da janela (width, height) no terceiro parâmetro.
  // 816x1056 pixels é aproximadamente o tamanho de uma folha A4 em uma tela padrão (96 DPI).
  const printWindow = window.open('', '_blank', 'width=816,height=1056,scrollbars=yes');
  
  printWindow.document.open();
  printWindow.document.write(fullHtmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus(); 
    printWindow.print(); 
    printWindow.close(); 
  }, 500); 
}


function buildResumeHtmlString(data) {
  const p = data.personalInfo || {};
  const experiencesHtml = (data.experiences || []).map(exp => `<div class="item-block"><div class="item-header"><h4>${exp.cargo || ""}</h4><span class="period">${exp.periodo || ""}</span></div><div class="item-details"><p class="company">${exp.empresa || ""}</p><p class="description">${exp.descricao || ""}</p></div></div>`).join("");
  const educationHtml = (data.education || []).map(edu => `<div class="item-block"><div class="item-header"><h4>${edu.curso || ""}</h4><span class="period">${edu.periodo || ""}</span></div><div class="item-details"><p class="institution">${edu.instituicao || ""}</p></div></div>`).join("");
  const skillsHtml = (data.skills || []).length > 0 ? `<p class="skills-list">${data.skills.join(", ")}</p>` : "";
  const languagesHtml = (data.languages || []).map(lang => `<p><strong>${lang.idioma || ""}:</strong> ${lang.nivel || ""}</p>`).join("");
  const linkedinLink = p.linkedin ? `<a href="https://www.${p.linkedin}" target="_blank" style="color: inherit; text-decoration: none;">${p.linkedin.replace(/^(https?:\/\/)?(www\.)?/i, "")}</a>` : "";

  const resumeBodyHtml = `
    <div class="header-section"><h1>${p.nome || "Seu Nome"}</h1><h2>${p.cargo || "Cargo Desejado"}</h2><p class="contact-info"><span>${p.email || ""}</span><span>${p.telefone || ""}</span><span>${linkedinLink}</span></p></div>
    <hr class="divider"><h3 class="section-title">RESUMO</h3><div class="section-content"><p>${p.resumo || ""}</p></div>
    <h3 class="section-title">EXPERIÊNCIA</h3><div class="section-content">${experiencesHtml}</div>
    <h3 class="section-title">FORMAÇÃO</h3><div class="section-content">${educationHtml}</div>
    <h3 class="section-title">HABILIDADES</h3><div class="section-content">${skillsHtml}</div>
    <h3 class="section-title">IDIOMAS</h3><div class="section-content languages-list">${languagesHtml}</div>
  `;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Currículo de ${p.nome || "Candidato"}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
      
      <style>
        @page {
          margin: 0; 
        }
        
        body { 
          font-family: 'Open Sans', sans-serif; 
          color: #333; 
          line-height: 1.6; 
          margin: 0;
          padding: 0.75in;
          background-color: #fff;
          
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact; 
        }

        @media print {
            a[href]:after {
                content: none !important;
            }
        }
        
        * { box-sizing: border-box; }
        .header-section { text-align: center; margin-bottom: 25px; }
        .header-section h1 { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 26pt; color: #2c3e50; margin-bottom: 5px; }
        .header-section h2 { font-family: 'Roboto', sans-serif; font-weight: 500; font-size: 16pt; color: #3498db; margin-bottom: 15px; }
        .header-section .contact-info { font-size: 10pt; color: #7f8c8d; line-height: 1.4; }
        .header-section .contact-info span:not(:last-child)::after { content: " | "; white-space: pre; }
        .divider { border: none; border-top: 1px solid #ecf0f1; margin: 25px 0; }
        .section-title { font-family: 'Roboto', sans-serif; font-weight: 700; font-size: 13pt; color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .section-content { margin-bottom: 20px; }
        .section-content p { font-size: 10.5pt; margin-bottom: 10px; }
        .item-block { margin-bottom: 18px; page-break-inside: avoid; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px; }
        .item-header h4 { font-family: 'Roboto', sans-serif; font-weight: 600; font-size: 12pt; color: #2c3e50; }
        .item-header span.period { font-family: 'Open Sans', sans-serif; font-style: italic; font-size: 9.5pt; color: #7f8c8d; }
        .item-details p { font-size: 10pt; margin: 2px 0; }
        .item-details .company, .item-details .institution { font-weight: 600; color: #555; }
        .item-details .description { color: #444; margin-top: 5px; }
        .skills-list { font-size: 10.5pt; margin-bottom: 20px; }
        .languages-list p { font-size: 10.5pt; margin-bottom: 5px; }
        .languages-list p strong { color: #555; }
      </style>
    </head>
    <body>
      ${resumeBodyHtml}
    </body>
    </html>
  `;
}