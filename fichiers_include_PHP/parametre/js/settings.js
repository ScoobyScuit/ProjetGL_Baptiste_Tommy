import { User } from "/js_class/user.js";
import { Task } from "/js_class/task.js";

(async function () {
  const userSelect = document.getElementById("user-select");
  const roleSelect = document.getElementById("role-select");
  const updateRoleBtn = document.getElementById("update-role-btn");

  const taskSelect = document.getElementById("task-select");
  const assignUserSelect = document.getElementById("assign-user-select");
  const assignTaskBtn = document.getElementById("assign-task-btn");

  // Charger les utilisateurs
  const users = await User.fetchAllUsers();

  users.forEach((user) => {
    userSelect.innerHTML += `<option value="${user.IdUser}">${user.NomUser} ${user.PrenomUser} (${user.RoleUser})</option>`;
    assignUserSelect.innerHTML += `<option value="${user.IdUser}">${user.NomUser} ${user.PrenomUser}</option>`;
  });

  // Charger les tâches
  const tasks = await Task.fetchTaskData();
  tasks.forEach((task) => {
    taskSelect.innerHTML += `<option value="${task.id}">${task.titre} (Échéance: ${task.dateEcheance})</option>`;
  });

  // Mettre à jour le rôle d'un utilisateur
  updateRoleBtn.addEventListener("click", async () => {
    const selectedUserId = userSelect.value;
    const newRole = roleSelect.value;

    const result = await User.updateUserRole(selectedUserId, newRole);
    if (result) {
      alert("Rôle mis à jour avec succès !");
    } else {
      alert("Erreur lors de la mise à jour du rôle.");
    }
  });

  // Assigner un utilisateur à une tâche
  assignTaskBtn.addEventListener("click", async () => {
    const selectedTaskId = taskSelect.value;
    const selectedUserId = assignUserSelect.value;

    const result = await Task.assignUserToTask(selectedTaskId, selectedUserId);
    if (result) {
      alert("Utilisateur assigné à la tâche avec succès !");
    } else {
      alert("Erreur lors de l'assignation de l'utilisateur à la tâche.");
    }
  });
})();
