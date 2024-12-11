import { User } from "../js_class/user.js";

describe("User Class Tests", () => {
  let user;
  
  beforeEach(() => {
    // Initialise une instance de User avant chaque test
    user = new User(1, "User A", "User AA", "userA@mail.com", "pw", "Membre");
  });

  // ================= TESTS UNITAIRES =================
  // Test unitaire pour la création d'un nouvel user
  test("should create a User instance correctly", () => {
    const newUser = new User(
      2,
      "User B",
      "User BB",
      "userB@mail.com",
      "pw",
      "Membre"
    );
    expect(newUser.id).toBe(2);
    expect(newUser.nom).toBe("User B");
    expect(newUser.prenom).toBe("User BB");
    expect(newUser.email).toBe("userB@mail.com");
    expect(newUser.password).toBe("pw");
    expect(newUser.role).toBe("Membre");
  });

  // Test unitaire pour afficher l'utilisateur
  test("should display user information correctly", () => {
    console.log = jest.fn(); // Mock de console.log

    user.displayInfo();

    expect(console.log).toHaveBeenCalledWith(
      "Id: 1, Nom: User A, Prénom: User AA, Email: userA@mail.com, Rôle: Membre"
    );
  });

  // ================= TESTS FONCTIONNELS =================
  beforeAll(() => {
    global.fetch = jest.fn(); // Mock global fetch
    jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error

  });

  afterAll(() => {
    global.fetch.mockRestore(); // Restaure fetch après les tests
    console.error.mockRestore(); // Restaure console.error  
});

  // Test fonctionnel pour fetch les données d'un utilisateur
  test("should fetch user data successfully", async () => {
    // Simule une réponse réussie pour fetchUserData
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          IdUser: 2,
          NomUser: "User B",
          PrenomUser: "User BB",
          EmailUser: "userB@mail.com",
          RoleUser: "Admin",
        }),
    });

    const fetchedUser = await User.fetchUserData();

    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser.id).toBe(2);
    expect(fetchedUser.nom).toBe("User B");
    expect(fetchedUser.prenom).toBe("User BB");
    expect(fetchedUser.email).toBe("userB@mail.com");
    expect(fetchedUser.role).toBe("Admin");
  });


    // Test fonctionnel pour fetch les données de tous les utilisateurs
  test("should fetch all users successfully", async () => {
    // Simule une réponse réussie pour fetchAllUsers
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { IdUser: 1, NomUser: "User A", PrenomUser: "AA", EmailUser: "a@mail.com", RoleUser: "Membre" },
          { IdUser: 2, NomUser: "User B", PrenomUser: "BB", EmailUser: "b@mail.com", RoleUser: "Admin" },
        ]),
    });

    const users = await User.fetchAllUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(2);
    expect(users[0].IdUser).toBe(1);
    expect(users[1].NomUser).toBe("User B");
  });

     // Test fonctionnel pour fetch les données d'un utilisateur spécifique
  test("should fetch user by ID successfully", async () => {
    // Simule une réponse réussie pour fetchUserById
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          IdUser: 3,
          NomUser: "User C",
          PrenomUser: "User CC",
          EmailUser: "userC@mail.com",
          RoleUser: "Chef",
        }),
    });

    const userById = await User.fetchUserById(3);

    expect(userById).not.toBeNull();
    expect(userById.IdUser).toBe(3);
    expect(userById.NomUser).toBe("User C");
    expect(userById.PrenomUser).toBe("User CC");
    expect(userById.EmailUser).toBe("userC@mail.com");
  });

 // Test fonctionnel pour modifier le role d'un utilisateur
  test("should update user role successfully", async () => {
    // Simule une réponse réussie pour updateUserRole
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const result = await User.updateUserRole(1, "Admin");

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "/fichiers_include_PHP/profil/updateRole.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, role: "Admin" }),
      }
    );
  });

  test("should handle fetchUserData failure gracefully", async () => {
    // Simule une réponse échouée
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const result = await User.fetchUserData();

    expect(result).toBeNull();
  });
});
