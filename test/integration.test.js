import { Project } from "../js_class/project.js";
import { Task } from "../js_class/task.js";
import { Comments } from "../js_class/comments.js";
import { User } from "../js_class/user.js";

describe("Integration Test: Users, Projects, Tasks, and Comments", () => {
  beforeAll(() => {
    global.fetch = jest.fn(); // Mock global fetch
  });

  afterAll(() => {
    global.fetch.mockRestore(); // Nettoie les mocks après les tests
  });

  test("should fetch users, projects, tasks, and comments successfully", async () => {
    // === Étape 1 : Simuler fetchUserData ===
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
            IdUser: 1,
            NomUser: 'User A',
            PrenomUser: 'User prenom A',
            EmailUser: 'userA@mail.com',
            RoleUser: 'membre'
        }),
    });

    const user = await User.fetchUserData();

    // Vérifie que l'objet User est correctement instancié
    expect(user).not.toBeNull();
    expect(user.id).toBe(1);
    expect(user.nom).toBe('User A');
    expect(user.prenom).toBe('User prenom A');
    expect(user.email).toBe('userA@mail.com');
    expect(user.role).toBe('membre');

    // === Étape 2 : Simuler fetchProjectData ===
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            IdProject: 1,
            NomProject: "Projet A",
            DescriptionProject: "Description Projet A",
            DateDebProject: "2024-01-01",
            DateFinProject: "2024-12-31",
            IdChef: 101,
          },
        ]),
    });

    const projects = await Project.fetchProjectData();

    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe(1);
    expect(projects[0].nom).toBe("Projet A");
    expect(projects[0].description).toBe("Description Projet A");
    expect(projects[0].idChef).toBe(101);

    // === Étape 3 : Simuler fetchTasksByProjectId (Tâches associées au projet) ===
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
            Promise.resolve([
                {
                    IdTask: 1,
                    TitreTask: "Task A",
                    DescriptionTask: "Description Task A",
                    StatutTask: "In Progress",
                    PrioriteTask: 1,
                    DateDebutTask: "2024-01-01",
                    DateEchTask: "2024-01-31",
                    IdProject: 1,
                    IdUser: 1
                }
            ]),
    });
    
    const tasks = await Task.fetchTasksByProjectId(1);
    
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(1);
    expect(tasks[0].titre).toBe("Task A");
    expect(tasks[0].description).toBe("Description Task A");
    expect(tasks[0].statut).toBe("In Progress");
    expect(tasks[0].priorite).toBe(1);
    expect(tasks[0].dateDebut).toBe("2024-01-01");
    expect(tasks[0].dateEcheance).toBe("2024-01-31");
    expect(tasks[0].idProjet).toBe(1);
    expect(tasks[0].idUser).toBe(1);
    

    // === Étape 4 : Simuler getCommentsByTask (Commentaires associés à la tâche) ===
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            IdCom: 1,
            IdTask: 1, // Clé étrangère vers la tâche
            IdUser: 1, // Clé étrangère vers l'utilisateur
            ContentCom: "This is a comment",
            DateCom: "2024-01-01",
          },
        ]),
    });

    const comments = await Comments.fetchCommentsByTaskId(1);

    expect(comments).toHaveLength(1);
    expect(comments[0].id).toBe(1);
    expect(comments[0].idTask).toBe(1); // Vérifie la clé étrangère
    expect(comments[0].idUser).toBe(1); // Vérifie la clé étrangère vers User
    expect(comments[0].contenu).toBe("This is a comment");
    expect(comments[0].date).toBe("2024-01-01");
  });
});
