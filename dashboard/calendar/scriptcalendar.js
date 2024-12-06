const timelineContent = document.getElementById('timeline-content');
    const calendarElement = document.getElementById('calendar');
    let tasks = [];
    let selectedDate = moment();
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.tab-button');
      
      function switchTab(e) {
        const tab = e.target;
        const tabId = tab.dataset.tab;

        // Update active classes
        document.querySelector('.tab-button.active').classList.remove('active');
        document.querySelector('.tab-content.active').classList.remove('active');

        tab.classList.add('active');
        document.querySelector(`#${tabId}-tab`).classList.add('active');
      }

      // Event listeners for tab buttons
      tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
      });
    });
    function isOverlapping(task1, task2) {
      return task1.date === task2.date &&
             task1.hour < (task2.hour + task2.duration) &&
             task2.hour < (task1.hour + task1.duration) &&
             Math.abs(task1.top - task2.top) < 30;
    }

    function findNonOverlappingPosition(newTask) {
      let overlap = true;
      while (overlap) {
        overlap = tasks.some(task => isOverlapping(newTask, task));
        if (overlap) {
          newTask.top += 30;
        }
      }
      return newTask;
    }

    function createCalendar() {
      const startOfMonth = moment(selectedDate).startOf('month');
      const endOfMonth = moment(selectedDate).endOf('month');
      const daysInMonth = endOfMonth.diff(startOfMonth, 'days') + 1;
    
      const currentDate = moment(); // Récupère la date actuelle
    
      calendarElement.innerHTML = `
        <div class="calendar-header">
          <button onclick="changeMonth(-1)" class="precedent"><i class="fa-solid fa-angles-left"></i> Précédent</button>
          <h2>${selectedDate.format('MMMM YYYY')}</h2>
          <button onclick="changeMonth(1)" class="suivant">Suivant <i class="fa-solid fa-angles-right"></i></button>
        </div>
        <div class="calendar-grid">
          ${Array.from({ length: daysInMonth }, (_, i) => {
            const day = moment(startOfMonth).add(i, 'days');
            const isActive = day.isSame(currentDate, 'day'); // Compare jour et mois
    
            return `<div class="calendar-day${isActive ? ' active' : ''}" 
                         data-date="${day.format('YYYY-MM-DD')}" 
                         data-month="${day.month()}" 
                         onclick="selectDate('${day.format('YYYY-MM-DD')}')">
                      ${day.format('D')}
                    </div>`;
          }).join('')}
        </div>
      `;
    }
    

    function createTimeline() {
      timelineContent.innerHTML = '';
      const date = moment(selectedDate);

      const dayElement = document.createElement('div');
      dayElement.className = 'day-row';
      dayElement.innerHTML = `
        <div class="day-header">
          <div>${date.format('dddd')}</div>
          <div>${date.format('DD/MM/YYYY')}</div>
        </div>
        <div class="hours" data-date="${date.format('YYYY-MM-DD')}">
          ${Array.from({length: 24}, (_, i) => `
            <div class="hour" data-hour="${i}">
              <span class="hour-label">${i.toString().padStart(2, '0')}:00</span>
            </div>
          `).join('')}
        </div>
      `;
      timelineContent.appendChild(dayElement);

      renderTasks();
      updateCurrentTimeIndicator();
    }

    function selectDate(dateString) {
      selectedDate = moment(dateString);
      createCalendar();
      
      // Switch to the timeline tab
      document.querySelector('.tab-button[data-tab="timeline"]').click();
    }

    function changeMonth(delta) {
      selectedDate.add(delta, 'month');
      createCalendar();
      createTimeline();
    }

    function renderTasks() {
      document.querySelectorAll('.task').forEach(task => task.remove());
      const hoursContainer = document.querySelector('.hours');
      
      if (hoursContainer) {
        const date = hoursContainer.getAttribute('data-date');
        tasks.filter(task => task.date === date).forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.className = 'task';
          taskElement.innerHTML = `
            <div class="task-title">${task.name}</div>
            <div class="task-details">
              <span class="task-time">${task.hour.toString().padStart(2, '0')}:00</span>
              <span class="task-duration">(${task.duration}h)</span>
            </div>
            <div class="task-description">${task.description || 'Pas de description'}</div>
            <button class="edit-button">Edit</button>
            <button class="expand-button">+</button>
          `;
          taskElement.setAttribute('data-id', task.id);
          
          taskElement.querySelector('.edit-button').onclick = () => openEditModal(task.id);
          taskElement.querySelector('.expand-button').onclick = (e) => toggleTaskExpansion(e, task.id);
          
          const hourWidth = 150;
          taskElement.style.left = `${task.left}px`;
          taskElement.style.top = `${task.top}px`;
          taskElement.style.width = `${task.duration * hourWidth - 4}px`;

          hoursContainer.appendChild(taskElement);
        });
      }
      
      initDragAndDrop();
    }

    function toggleTaskExpansion(event, taskId) {
      event.stopPropagation();
      const taskElement = event.target.closest('.task');
      taskElement.classList.toggle('expanded');
      const expandButton = taskElement.querySelector('.expand-button');
      expandButton.textContent = taskElement.classList.contains('expanded') ? '-' : '+';
    }

    function openAddTaskModal() {
      document.getElementById('addTaskModal').style.display = 'block';
      document.getElementById('newTaskDate').value = selectedDate.format('YYYY-MM-DD');
    }

    function closeAddTaskModal() {
      document.getElementById('addTaskModal').style.display = 'none';
    }

    function addTask() {
      const name = document.getElementById('newTaskName').value;
      const date = document.getElementById('newTaskDate').value;
      const hour = parseInt(document.getElementById('newTaskHour').value);
      const duration = parseInt(document.getElementById('newTaskDuration').value);
      const description = document.getElementById('newTaskDescription').value;
      if (name && date && !isNaN(hour) && duration) {
        const hourWidth = 150;
        const newTask = { 
          id: Date.now().toString(), 
          name, 
          date,
          hour,
          duration,
          left: hour * hourWidth,
          top: 25,
          description 
        };

        const nonOverlappingTask = findNonOverlappingPosition(newTask);
        tasks.push(nonOverlappingTask);
        renderTasks();
        closeAddTaskModal();
        document.getElementById('newTaskName').value = '';
        document.getElementById('newTaskDate').value = '';
        document.getElementById('newTaskHour').value = '';
        document.getElementById('newTaskDuration').value = '';
        document.getElementById('newTaskDescription').value = '';
      }
    }

    function openEditModal(taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editTaskDate').value = task.date;
        document.getElementById('editTaskHour').value = task.hour;
        document.getElementById('editTaskDuration').value = task.duration;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskModal').style.display = 'block';
      }
    }

    function updateTask() {
      const taskId = document.getElementById('editTaskId').value;
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const updatedTask = {
          ...tasks[taskIndex],
          name: document.getElementById('editTaskName').value,
          date: document.getElementById('editTaskDate').value,
          hour: parseInt(document.getElementById('editTaskHour').value),
          duration: parseInt(document.getElementById('editTaskDuration').value),
          description: document.getElementById('editTaskDescription').value
        };
        
        const hourWidth = 150;
        updatedTask.left = updatedTask.hour * hourWidth;
        updatedTask.top = 25;

        const nonOverlappingTask = findNonOverlappingPosition(updatedTask);
        tasks[taskIndex] = nonOverlappingTask;
        document.getElementById('editTaskModal').style.display = 'none';
        renderTasks();
      }
    }

    function initDragAndDrop() {
      interact('.task').draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: '.hours',
            endOnly: true
          })
        ],
        autoScroll: true,
        listeners: {
          start (event) {
            if (event.target.classList.contains('edit-button') || 
                event.target.classList.contains('expand-button')) {
              return;
            }
            event.target.classList.add('dragging');
          },
          move (event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          end (event) {
            event.target.classList.remove('dragging');
            const taskId = event.target.getAttribute('data-id');
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              const container = event.target.closest('.hours');
              if (container) {
                const x = parseFloat(event.target.getAttribute('data-x')) || 0;
                const y = parseFloat(event.target.getAttribute('data-y')) || 0;
                
                const hourWidth = 150;
                const newLeft = tasks[taskIndex].left + x;
                const newTop = Math.max(0, Math.min(container.clientHeight - event.target.offsetHeight, tasks[taskIndex].top + y));
                
                const newHour = Math.max(0, Math.min(23, Math.floor(newLeft / hourWidth)));
                
                const updatedTask = {
                  ...tasks[taskIndex],
                  hour: newHour,
                  left: newLeft,
                  top: newTop
                };

                let overlap = true;
                while (overlap) {
                  overlap = tasks.some((task, index) => 
                    index !== taskIndex && isOverlapping(updatedTask, task)
                  );
                  if (overlap) {
                    updatedTask.top += 30;
                  }
                }

                tasks[taskIndex] = updatedTask;
                
                event.target.setAttribute('data-x', 0);
                event.target.setAttribute('data-y', 0);
                event.target.style.transform = '';
                
                renderTasks();
              }
            }
          }
        }
      });
    }

    // TODO :
    // function populateHourSelect() {
    //   const selects = [
    //     document.getElementById('newTaskHour'),
    //     document.getElementById('editTaskHour')
    //   ];
    //   selects.forEach(select => {
    //     for (let i = 0; i < 24; i++) {
    //       const option = document.createElement('option');
    //       option.value = i;
    //       option.textContent = `${i.toString().padStart(2, '0')}:00`;
    //       select.appendChild(option);
    //     }
    //   });
    // }

    function updateCurrentTimeIndicator() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Récupération des éléments nécessaires
      const hoursContainer = document.querySelector('.hours');
      const indicator = document.querySelector('.current-time-indicator') || document.createElement('div');
      const timeLabel = document.querySelector('.current-time-label') || document.createElement('div');
      
      if (!hoursContainer) return;
    
      // Créer l'indicateur s'il n'existe pas encore
      if (!indicator.parentNode) {
        indicator.className = 'current-time-indicator';
        hoursContainer.appendChild(indicator);
      }
    
      if (!timeLabel.parentNode) {
        timeLabel.className = 'current-time-label';
        indicator.appendChild(timeLabel);
      }
    
      timeLabel.textContent = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
      // Calcul dynamique
      const hourWidth = hoursContainer.querySelector('.hour').offsetWidth; // Largeur d'une heure
      const totalMinutesInDay = currentHour * 60 + currentMinute;
      const totalDayWidth = hourWidth * 24; // Largeur totale pour 24h
    
      const leftPosition = (totalMinutesInDay / (24 * 60)) * totalDayWidth + 110;
    
      indicator.style.left = `${leftPosition}px`;
    
      setTimeout(updateCurrentTimeIndicator, 60000); // Mise à jour chaque minute
    }
    
    // Appeler la fonction au chargement
    updateCurrentTimeIndicator();

    createCalendar();
    createTimeline();
    // TODO : populateHourSelect();
    // document.getElementById('newTaskDate').value = selectedDate.format('YYYY-MM-DD');
    
    document.querySelector('.close').addEventListener('click', () => {
      document.getElementById('editTaskModal').style.display = 'none';
    });
    document.getElementById('addTaskModal').querySelector('.close').addEventListener('click', closeAddTaskModal);
    
    function initTabs() {
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tabName = button.getAttribute('data-tab');
          
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));

          button.classList.add('active');
          document.getElementById(`${tabName}-tab`).classList.add('active');

          if (tabName === 'calendar') {
            createCalendar();
          } else {
            createTimeline();
          }
        });
      });
    }

    document.addEventListener('DOMContentLoaded', initTabs);