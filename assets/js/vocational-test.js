// --- ELEMENTOS GLOBAIS ---
const questionsSection = document.getElementById('questions-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const manualSelectionSection = document.getElementById('manual-selection-section');
const aiResultsDiv = document.getElementById('ai-results');
let userTopProfiles = []; // Para armazenar o perfil do usuário

// --- EVENT LISTENER PRINCIPAL DO FORMULÁRIO ---
document.getElementById('vocational-form').addEventListener('submit', function(event) {
    event.preventDefault();
    questionsSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const inputs = event.target.querySelectorAll('input[type="range"]');
    inputs.forEach(input => {
        const category = input.dataset.category;
        scores[category] += parseInt(input.value, 10);
    });

    setTimeout(() => {
        callAIApi(scores);
    }, 3000); // Delay para simular processamento
});


// --- LÓGICA DA "IA" E EXIBIÇÃO DE RESULTADOS ---
function callAIApi(scores) {
    const sortedScores = Object.entries(scores).sort(([,a],[,b]) => b-a);
    userTopProfiles = sortedScores.slice(0, 3).map(item => item[0]);

    const analysisResult = generateAIResponse(userTopProfiles, scores);
    displayResults(analysisResult);
}

function displayResults(resultHtml) {
    loadingSection.classList.add('hidden');
    aiResultsDiv.innerHTML = resultHtml;
    resultsSection.classList.remove('hidden');

    document.getElementById('accept-profile-btn').addEventListener('click', handleAcceptProfile);
    document.getElementById('other-options-btn').addEventListener('click', handleOtherOptions);
    document.getElementById('redo-test-btn').addEventListener('click', handleRedoTest);
}


// --- FUNÇÕES DE AÇÃO PÓS-RESULTADO ---

// 1. Ação: Aceitar o Perfil
function handleAcceptProfile() {
    console.log("Perfil aceito:", userTopProfiles.join('-'));
    localStorage.setItem('userVocationalProfile', userTopProfiles.join('-'));

    // --- LÓGICA DE CONQUISTA ADICIONADA ---
    addAchievement({
        id: 'vocational_test_completed',
        title: 'Explorador de Carreiras',
        description: 'Você completou seu teste vocacional inicial.'
    });

    window.location.href = 'index.html';
}

// 2. Ação: Ver Outras Opções (Não aceitar)
function handleOtherOptions() {
    resultsSection.classList.add('hidden');
    populateProfessionList();
    manualSelectionSection.classList.remove('hidden');
}

// 3. Ação: Refazer o Teste
function handleRedoTest() {
    resultsSection.classList.add('hidden');
    document.getElementById('vocational-form').reset();
    questionsSection.classList.remove('hidden');
}


// --- LÓGICA PARA A SELEÇÃO MANUAL ---
function populateProfessionList() {
    const professions = [
        "Desenvolvimento de Software", "Ciência de Dados", "Design UI/UX", "Marketing Digital",
        "Engenharia Civil", "Arquitetura", "Gestão de Projetos", "Recursos Humanos",
        "Finanças e Contabilidade", "Direito", "Saúde e Medicina", "Educação", 
        "Cibersegurança", "Gestão de Produtos", "Vendas e Negócios"
    ];

    const listContainer = document.getElementById('profession-list');
    listContainer.innerHTML = '';

    professions.forEach(prof => {
        const item = document.createElement('div');
        item.className = 'profession-item';
        item.textContent = prof;
        item.dataset.profession = prof;
        item.addEventListener('click', handleProfessionSelection);
        listContainer.appendChild(item);
    });
}

let selectedProfession = null;
function handleProfessionSelection(event) {
    const allItems = document.querySelectorAll('.profession-item');
    allItems.forEach(item => item.classList.remove('selected'));

    const selectedItem = event.currentTarget;
    selectedItem.classList.add('selected');
    selectedProfession = selectedItem.dataset.profession;

    document.getElementById('confirm-selection-btn').disabled = false;
}

document.getElementById('confirm-selection-btn').addEventListener('click', () => {
    if (selectedProfession) {
        console.log("Profissão selecionada manualmente:", selectedProfession);
        localStorage.setItem('userVocationalProfile', selectedProfession);

        // --- LÓGICA DE CONQUISTA ADICIONADA ---
        addAchievement({
            id: 'vocational_test_completed',
            title: 'Explorador de Carreiras',
            description: 'Você completou seu teste vocacional inicial.'
        });

        window.location.href = 'index.html';
    }
});


// --- NOVA FUNÇÃO PARA GERENCIAR CONQUISTAS ---
/**
 * Adiciona uma nova conquista à lista do usuário no localStorage.
 * @param {object} newAchievement - O objeto da nova conquista.
 */
function addAchievement(newAchievement) {
    // Pega as conquistas existentes ou cria uma lista vazia
    const existingAchievements = JSON.parse(localStorage.getItem('userAchievements')) || [];

    // Verifica se a conquista já existe para não duplicar
    const alreadyExists = existingAchievements.some(ach => ach.id === newAchievement.id);

    if (!alreadyExists) {
        existingAchievements.push(newAchievement);
        // Salva a lista atualizada de volta no localStorage
        localStorage.setItem('userAchievements', JSON.stringify(existingAchievements));
        console.log('Nova conquista adicionada:', newAchievement.title);
    }
}


// --- CÉREBRO DA "IA": GERA A ANÁLISE ---
function generateAIResponse(topProfilesCodes, allScores) {
    const profiles = {
        R: { 
            name: "Realista", 
            desc: "Você possui uma inclinação forte para atividades práticas, concretas e tangíveis. Gosta de trabalhar com ferramentas, máquinas e resolver problemas de forma direta.", 
            careers: [
                { name: "Engenheiro(a) de Software (Embarcados/Hardware)", desc: "Projetar e construir sistemas que interagem com o mundo físico." },
                { name: "Arquiteto(a)/Engenheiro(a) Civil", desc: "Planejar e executar projetos de construção, unindo criatividade e funcionalidade." },
            ]
        },
        I: { 
            name: "Investigativo", 
            desc: "Sua mente é curiosa e analítica. Você adora resolver enigmas, investigar a fundo os problemas e buscar conhecimento.", 
            careers: [
                { name: "Cientista de Dados/Machine Learning Engineer", desc: "Analisar grandes volumes de dados para extrair insights e construir modelos preditivos." },
                { name: "Desenvolvedor(a) de Backend/Cientista da Computação", desc: "Construir a lógica e a infraestrutura por trás de sistemas complexos." },
            ]
        },
        A: { 
            name: "Artístico", 
            desc: "Você é uma pessoa criativa, intuitiva e expressiva. Gosta de trabalhar de forma original, sem muitas regras, e valoriza a beleza e a inovação.", 
            careers: [
                { name: "Designer de UI/UX (Interface e Experiência do Usuário)", desc: "Criar interfaces intuitivas e esteticamente agradáveis para softwares e aplicativos." },
                { name: "Diretor(a) de Arte/Designer Gráfico", desc: "Conceber e executar projetos visuais para campanhas e produtos." },
            ]
        },
        S: { 
            name: "Social", 
            desc: "Você tem um forte desejo de ajudar e interagir com as pessoas. Gosta de ensinar, aconselhar, cuidar e trabalhar em equipe.", 
            careers: [
                { name: "Gerente de Projetos (Agile Coach)", desc: "Facilitar equipes, remover impedimentos e promover a colaboração para o sucesso do projeto." },
                { name: "Recrutador(a) Tech/Especialista em RH", desc: "Conectar talentos a oportunidades e desenvolver pessoas na área de tecnologia." },
            ]
        },
        E: { 
            name: "Empreendedor", 
            desc: "Você é dinâmico(a), persuasivo(a) e gosta de liderar. Sente-se atraído(a por desafios, pela busca de metas e por influenciar pessoas.", 
            careers: [
                { name: "Gerente de Produto (Product Manager)", desc: "Liderar o ciclo de vida de um produto, desde a concepção até o lançamento." },
                { name: "Desenvolvedor(a) de Negócios (Business Development)", desc: "Identificar novas oportunidades e construir parcerias estratégicas." },
            ]
        },
        C: { 
            name: "Convencional", 
            desc: "Você é uma pessoa organizada, metódica e atenta aos detalhes. Gosta de seguir regras e procedimentos claros, e valoriza a ordem e a eficiência.", 
            careers: [
                { name: "Analista de QA (Quality Assurance)", desc: "Garantir a qualidade de softwares e sistemas através de testes e documentação." },
                { name: "Administrador(a) de Banco de Dados/Sistemas", desc: "Gerenciar e manter a integridade e o desempenho de sistemas e dados." },
            ]
        }
    };

    let responseHtml = `
        <p>Com base em suas respostas, identificamos seu perfil vocacional com os seguintes traços dominantes:</p>
        
        <h3>Seus Perfis Principais:</h3>
        <ul>
            <li><strong>${profiles[topProfilesCodes[0]].name}:</strong> ${profiles[topProfilesCodes[0]].desc}</li>
            <li><strong>${profiles[topProfilesCodes[1]].name}:</strong> ${profiles[topProfilesCodes[1]].desc}</li>
            <li><strong>${profiles[topProfilesCodes[2]].name}:</strong> ${profiles[topProfilesCodes[2]].desc}</li>
        </ul>

        <h3>Áreas e Carreiras Sugeridas:</h3>
        <p>A combinação de seus traços sugere um forte potencial em áreas que valorizam suas aptidões. Abaixo, destacamos algumas carreiras que podem se alinhar com seu perfil:</p>
        <ul>`;
            
    const suggestedCareers = [];
    suggestedCareers.push(...profiles[topProfilesCodes[0]].careers);
    suggestedCareers.push(...profiles[topProfilesCodes[1]].careers);

    // Remove duplicados, caso haja
    const uniqueCareers = Array.from(new Set(suggestedCareers.map(c => c.name)))
        .map(name => {
            return suggestedCareers.find(c => c.name === name)
        });

    uniqueCareers.slice(0, 5).forEach(career => { // Limita a 5 sugestões para não sobrecarregar
        responseHtml += `<li><strong>${career.name}:</strong> ${career.desc}</li>`;
    });

    responseHtml += `
        </ul>

        <h3>Dicas para seu Desenvolvimento:</h3>
        <ul>
            <li><strong>Explore a Fundo:</strong> Pesquise sobre as carreiras mencionadas, converse com profissionais da área e entenda o dia a dia de cada uma.</li>
            <li><strong>Desenvolva Habilidades:</strong> Identifique habilidades (técnicas e comportamentais) valorizadas em seu perfil e busque cursos e projetos para desenvolvê-las.</li>
            <li><strong>Ganhe Experiência:</strong> Participe de estágios ou crie projetos pessoais para aplicar seus conhecimentos.</li>
        </ul>
        <p>Lembre-se que este teste é um ponto de partida. Use essa análise para explorar as áreas que mais despertaram seu interesse!</p>
    `;
    
    return responseHtml;
}