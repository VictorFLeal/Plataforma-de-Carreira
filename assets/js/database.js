// assets/js/database.js

const mockUser = {
  id: 'user123',
  name: 'Victor',
  email: 'victor.leal@email.com'
};

const mockCourses = [
    {
        title: "Bootcamp de Desenvolvedor Web Full Stack",
        platform: "Trybe",
        url: "#",
    },
    {
        title: "Formação Completa em UI/UX Design",
        platform: "Alura",
        url: "#",
    },
];

const mockJobs = [
    {
        title: "Desenvolvedor(a) Frontend Jr",
        company: "Nubank",
        location: "Remoto",
        url: "#",
    },
    {
        title: "UI/UX Designer Pleno",
        company: "iFood",
        location: "São Paulo, SP",
        url: "#",
    },
];

// Disponibiliza as variáveis para serem usadas em outros scripts.
window.currentUser = mockUser;
window.coursesData = mockCourses;
window.jobsData = mockJobs;