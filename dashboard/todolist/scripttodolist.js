import { Task } from "/js_class/task.js";

document.addEventListener('DOMContentLoaded', async () => {
    const taskList = document.getElementById('task-list');
    const filterOptions = document.getElementById('filter-options'); 
    
    // Récupérer l'ID du projet sélectionné depuis le localStorage
    const selectedProjectId = localStorage.getItem("selectedProjectId");
    console.log("selectedProjectId : " + selectedProjectId);
    // Charger les tâches depuis la base de données
    let tasks = await Task.fetchTasksByProjectId(parseInt(selectedProjectId));
    
    // Appel de la méthode pour afficher les tâches dans la console
    Task.displayTasks(tasks);

    let currentFilter = 'all';

    // Fonction pour rendre les tâches visibles dans la liste
    function renderTasks() {
        taskList.innerHTML = ''; // Réinitialiser la liste des tâches
        tasks.forEach((task, index) => {
            if (
                (currentFilter === 'all') ||
                (currentFilter === 'active' && task.statut === 'En cours') ||
                (currentFilter === 'completed' && task.statut === 'Terminée')
            ) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="task-text ${task.statut === 'Terminée' ? 'Terminée' : ''}">${task.titre}</span>
                    <div class="task-actions">
                        <button class="edit-btn" data-index="${index}">Modifier</button>
                        <button class="completed-btn" data-index="${index}">Terminer</button>
                        <button class="delete-btn" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                `;
                taskList.appendChild(li);
            }
        });
    }      

    // Gérer l'ajout de tâche
    document.getElementById('task-form').addEventListener('submit', async (e) => {
        e.preventDefault();

    // Collecte des valeurs du formulaire
    const titre = document.getElementById("TitreTask").value;
    const description = document.getElementById("DescriptionTask").value;
    const statut = document.getElementById("StatutTask").value;
    const priorite = document.getElementById("PrioriteTask").value;
    const dateEch = document.getElementById("DateEchTask").value;
    const idProjet = document.getElementById("IdProjet").value;
    const idUser = document.getElementById("IdUser").value;

    console.log({ titre, description, statut, priorite, dateEch, idProjet, idUser });

    function closeAddTaskModal() {
        document.getElementById('addTaskModal').style.display = 'none';
      }

    // Appel à Task.addTask
    const newTask = new Task(titre, description, statut, priorite, dateEch, idProjet, idUser);
        const success = await newTask.addTask(); // Appeler la méthode d'ajout

        if (success) {
            tasks.push(newTask);   // Ajouter localement la nouvelle tâche
            renderTasks();         // Actualiser la liste des tâches
            closeAddTaskModal();   // Fermer la modal après l'ajout   
        } else {
            alert('Erreur lors de l\'ajout de la tâche');
        }
    });
    
    // Gérer la suppression de tâche
    // TODO supprimer mettre dans task.js avec status terminé
    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            const taskToDelete = tasks[index];
            const success = await taskToDelete.deleteTask();  // Appeler la méthode de suppression
            if (success) {
                tasks.splice(index, 1);  // Supprimer la tâche localement
                renderTasks();
            }
        }
    });

    // Gérer le filtrage des tâches
    filterOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            currentFilter = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks();
        }
    });

    // Premier rendu des tâches
    renderTasks();
});
