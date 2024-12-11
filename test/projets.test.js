import { Project } from '../js_class/project.js';

describe('Project Class Tests', () => {
    let project;

    beforeEach(() => {
        // Initialise une instance de Project avant chaque test
        project = new Project(
            1,
            'Test Project',
            'Description',
            '2024-01-01',
            '2024-12-31',
            101
        );
    });

    // ================= TEST UNITAIRE =================
    // Test unitaire pour vérifier la création d'un projet
    test('should add project successfully', () => {
        const newProject = new Project(
            2,
            'New Project',
            'Another description',
            '2024-02-01',
            '2024-10-31',
            102
        );
        expect(newProject.id).toBe(2);
        expect(newProject.nom).toBe('New Project');
    });

    // Test unitaire pour vérifier la suppression d'un projet
    test('should delete project successfully', async () => {
        // Arrange : Crée une instance de Project
        const project = new Project(1, 'Test Project', 'Description', '2024-01-01', '2024-12-31', 101);
    
        // Mock de la fonction fetch avec un succès
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ success: true }) // Réponse de succès
        });
    
        // Act : Appelle la méthode deleteProject
        const result = await project.deleteProject();
    
        // Assert : Vérifie le résultat et l'appel fetch
        expect(global.fetch).toHaveBeenCalledWith(
            '/fichiers_include_PHP/projet/deleteProject.php?id=1',
            { method: 'DELETE' }
        );
        expect(result).toBe(true); // Vérifie que la méthode retourne true
    });

    // ================= TEST FONCTIONNEL =================
    // Test fonctionnel pour la méthode statique fetchProjectData
    test('should fetch project data successfully', async () => {
        // Mock de fetch pour simuler une réponse réussie
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true, // Ajoute ok: true pour simuler une réponse HTTP valide
            json: () => Promise.resolve([
                {
                    IdProject: 1,
                    NomProject: 'Test Project',
                    DescriptionProject: 'Description',
                    DateDebProject: '2024-01-01',
                    DateFinProject: '2024-12-31',
                    IdChef: 101
                }
            ]),
        });
    
        // Remplace global.fetch par le mock
        global.fetch = mockFetch;
    
        // Appel de la méthode fetchProjectData
        const result = await Project.fetchProjectData();
    
        // Vérifie que fetch a été appelé avec la bonne URL
        expect(global.fetch).toHaveBeenCalledWith('/fichiers_include_PHP/getProjectData.php');
    
        // Vérifie le contenu des résultats
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        expect(result[0].nom).toBe('Test Project');
        expect(result[0].description).toBe('Description');
        expect(result[0].dateDebut).toBe('2024-01-01');
        expect(result[0].dateFin).toBe('2024-12-31');
        expect(result[0].idChef).toBe(101);
    });  
});
