const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function toggleRoleOptions() {
    const roleSelect = document.getElementById('roleSelect');
    const roleOptions = document.getElementById('roleOptions');
    const adminOptions = document.getElementById('adminOptions');


    roleOptions.classList.remove('show');
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