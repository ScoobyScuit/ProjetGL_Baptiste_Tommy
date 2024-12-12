/**
 * @file toggleRole.js
 * @brief Script de gestion des interactions dynamiques pour l'interface utilisateur. 
 * Gère l'affichage du mode d'inscription, du mode de connexion et des options liées au rôle sélectionné.
 */

// Sélection des boutons
const registerBtn = document.getElementById("register"); // Bouton pour basculer vers l'inscription
const loginBtn = document.getElementById("login");       // Bouton pour basculer vers la connexion
const container = document.getElementById("container");  // Conteneur principal pour l'effet actif

/**
 * @brief Active le mode d'inscription en ajoutant la classe "active" au conteneur principal.
 */
registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

/**
 * @brief Active le mode de connexion en supprimant la classe "active" du conteneur principal.
 */
loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

/**
 * @brief Gère l'affichage des options en fonction du rôle sélectionné.
 * Affiche ou masque les options disponibles selon le rôle choisi dans la liste déroulante.
 */
function toggleRoleOptions() {
  const roleSelect = document.getElementById('roleSelect'); /**< Sélecteur pour le choix du rôle */
  const roleOptions = document.getElementById('roleOptions'); /**< Conteneur des options générales */
  const adminOptions = document.getElementById('adminOptions'); /**< Options spécifiques à l'administrateur */

  roleOptions.classList.remove('show'); // Réinitialise l'affichage
  adminOptions.style.display = 'none';

  if (roleSelect.value) {
    roleOptions.classList.add('show');
    switch (roleSelect.value) {
      case 'Administrateur':
        adminOptions.style.display = 'block';
        break;
    }
  }
}
