const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressSlider = document.getElementById('progressSlider');
    const startPoint = document.getElementById('startPoint');

    const totalLength = progressBar.getTotalLength();
    progressBar.style.strokeDasharray = totalLength;
    progressBar.style.strokeDashoffset = totalLength;

    function updateProgress(value) {
      const progress = value / 100;
      const dashoffset = totalLength * (1 - progress);
      progressBar.style.strokeDashoffset = dashoffset;
      progressText.textContent = `${value}%`;
      
      // Gestion de l'opacité du point de départ
      if (value === 0) {
        startPoint.style.opacity = 1;
      } else {
        startPoint.style.opacity = 0;
      }
    }

    progressSlider.addEventListener('input', (e) => {
      updateProgress(parseInt(e.target.value));
    });

    // Animation initiale
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += 1;
      if (progress > 100) {
        clearInterval(animationInterval);
      } else {
        updateProgress(progress);
        progressSlider.value = progress;
      }
    }, 50);

    function toggleRoleOptions() {
      const roleSelect = document.getElementById('roleSelect');
      const roleOptions = document.getElementById('roleOptions');
      const adminOptions = document.getElementById('adminOptions');
      const projectManagerOptions = document.getElementById('projectManagerOptions');
      const memberOptions = document.getElementById('memberOptions');

      roleOptions.classList.remove('show');
      adminOptions.style.display = 'none';
      projectManagerOptions.style.display = 'none';
      memberOptions.style.display = 'none';

      if (roleSelect.value) {
        roleOptions.classList.add('show');
        switch (roleSelect.value) {
          case 'admin':
            adminOptions.style.display = 'block';
            break;
          case 'projectManager':
            projectManagerOptions.style.display = 'block';
            break;
          case 'member':
            memberOptions.style.display = 'block';
            break;
        }
      }
    }