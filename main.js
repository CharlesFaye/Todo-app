const form = document.getElementById('form');
const addOrUpdateTaskButton = document.getElementById('add-or-update-task-btn');
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const timesIcon = document.querySelector('.times-icon');
const formAddTaskButton = document.querySelector('.form-add-task-btn');
const title = document.querySelector("input[type='text']");
const dateOfCreation = document.querySelector("input[type='date']");
const description = document.querySelector('textarea');
const mainFormTitle = document.querySelector('.main-form-h2');
const tasksContainer = document.getElementById('tasks-container');
const main = document.querySelector('main');

/**
 * An array that stores task data retrieved from local storage.
 * If no data is found in local storage, it initializes as an empty array.
 * 
 * @type {Array<Object>}
 */
const taskData = JSON.parse(localStorage.getItem('data')) || [];

/**
 * @type {Object}
 * @description Represents the current task in the Todo app.
 */
let currentTask = {};

/**
 * Adds a new task or updates an existing task in the taskData array.
 * 
 * This function checks if a task with the same ID as the current task exists in the taskData array.
 * If it does, the existing task is updated with the new task details.
 * If it does not, a new task is created and added to the beginning of the taskData array.
 * 
 * @function
 * @name addOrUpdateTask
 * @returns {void}
 */
const addOrUpdateTask = () => {
    if(!title.value.trim()) {
        alert('Entrez un titre svp!');
        return
    } 
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
        id: `${title.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title : title.value,
        date : dateOfCreation.value,
        description : description.value 
    };
    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }
    localStorage.setItem('data', JSON.stringify(taskData))
  updateTaskContainer()
  styleOfMyTasksContainer()
  reset()
  hideForm()
}
/**
 * Updates the tasks container by clearing its current content and 
 * populating it with the latest task data.
 * 
 * This function iterates over the `taskData` array and creates a 
 * new HTML structure for each task, which includes the task's 
 * title, date, description, and buttons for editing and deleting 
 * the task. The generated HTML is then appended to the 
 * `tasksContainer` element.
 * 
 * @function
 */
const updateTaskContainer = () => {
    tasksContainer.innerHTML = "";
  
    taskData.forEach(
      ({ id, title, date, description }) => {
          tasksContainer.innerHTML += `
          <div class="task" id="${id}">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button onclick="editTask(this)" type="button" class="btn">Modifier</button>
            <button onclick="deleteTask(this)" type="button" class="btn">Supprimer</button> 
          </div>
        `
      }
    );
  };
  if(taskData.length) {
    updateTaskContainer()
}


/**
 * Resets the input fields and the current task object.
 * 
 * This function clears the values of the title, dateOfCreation, and description input fields,
 * and resets the currentTask object to an empty object.
 */
  const reset = () => {
    formAddTaskButton.textContent = "Ajouter une tâche";
    mainFormTitle.textContent = "Nouvelle tâche";
    title.value = "";
    dateOfCreation.value = "";
    description.value = "";
    form.classList.toggle('hidden');
    currentTask = {};
  }

addOrUpdateTaskButton.addEventListener('click', showForm);
formAddTaskButton.addEventListener('click', addTaskToDOM);
timesIcon.addEventListener('click', () => {
    /**
     * Checks if any of the form input fields contain values.
     *
     * @constant {boolean} formInputsContainValues - True if any of the input fields (title, dateOfCreation, or description) have values, otherwise false.
     */
    const formInputsContainValues = title.value || dateOfCreation.value || description.value;
    /**
     * Checks if the form input values have been updated compared to the current task.
     *
     * @constant {boolean} formInputValuesUpdated - A boolean indicating whether any of the form input values (title, dateOfCreation, description) 
     * have changed compared to the current  task's values.
     */
    const formInputValuesUpdated = title.value !== currentTask.title || dateOfCreation.value !== currentTask.date || description.value !== currentTask.description;
    if(formInputsContainValues && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    }
    else {
        reset()
        hideForm()
    }
    
});
cancelBtn.addEventListener('click', () => {
    confirmCloseDialog.close();
    });
confirmBtn.addEventListener('click', () => {
    confirmCloseDialog.close();
     form.classList.toggle('hidden')
     handleStyleWithHideForm()
     styleOfMyTasksContainer()
    })


/**
 * Toggles the visibility of the form and hides the create task button and tasks container.
 *
 * This function is used to show or hide the form element by toggling the 'hidden' class.
 * Additionally, it hides the create task button and the tasks container by setting their
 * display style to "none".
 */
function showForm() {
    form.classList.toggle('hidden');
    handleStyleWithDisplayForm()
}
/**
 * Hides the create task button and tasks container, and removes the border, border radius, and box shadow from the main element.
 */ 
function handleStyleWithDisplayForm() {
    addOrUpdateTaskButton.style.display = "none";
    tasksContainer.style.display = "none";
    main.style.border = "none";
    main.style.borderRadius = "none";
    main.style.boxShadow = "none";
}

/**
 * Hides the form and updates the display styles of the create task button and tasks container.
 * 
 * This function adds the 'hidden' class to the form element, sets the display style of the 
 * create task button to "block", and sets the display style of the tasks container to "flex".
 */
function hideForm() {
   form.classList.add('hidden'); 
   handleStyleWithHideForm()
}
/**
 * Applies styles to various elements to hide the form and display the task container.
 * 
 * This function performs the following actions:
 * - Sets the display style of the createTaskButton to "block".
 * - Sets the display style of the tasksContainer to "flex".
 * - Applies a border to the main element.
 * - Rounds the corners of the main element.
 * - Adds a box shadow to the main element.
 */
function handleStyleWithHideForm() {
    addOrUpdateTaskButton.style.display = "block";
    tasksContainer.style.display = "flex";
    main.style.border = "1px solid rgba(0, 0, 0, 0.5)";
    main.style.borderRadius = "10px";
    main.style.boxShadow = "5px 2px 5px var(--bg-btn-color)"; 
}


/**
 * Handles the form submission event.
 * Prevents the default form submission behavior and calls the function to add or update a task.
 *
 * @param {Event} e - The event object representing the form submission event.
 */
function submitForm(e) {
    e.preventDefault();
    
    addOrUpdateTask();
}

/**
 * Adds an event listener to the form element that triggers the submitForm function when the form is submitted.
 */
function addTaskToDOM (){
    form.addEventListener('submit', submitForm);
}

/**
 * Edits an existing task by populating the form with the task's details.
 *
 * @param {HTMLElement} buttonEl - The button element that triggered the edit action.
 */
const editTask = (buttonEl)  => {
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

    currentTask = taskData[dataArrIndex];

  title.value = currentTask.title;
  dateOfCreation.value = currentTask.date;
  description.value = currentTask.description;

  formAddTaskButton.textContent = "Mettre à jour";
  mainFormTitle.textContent = "Mise à jour de la tâche"
  showForm()
}


/**
 * Deletes a task from the DOM and updates the task data in local storage.
 *
 * @param {HTMLElement} buttonEl - The button element that was clicked to trigger the task deletion.
 */
function deleteTask(buttonEl) {
    const dataArrIndex = taskData.findIndex(item => item.id === buttonEl.parentElement.id)
    
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem('data', JSON.stringify(taskData))
}

/**
 * Applies styling to the tasks container element.
 * 
 * The styles applied are:
 * - Display set to flex
 * - Flex direction set to column
 * - Gap between items set to 15px
 * - Left border set to 3px solid black
 * - Padding set to 10px
 * - Maximum width set to 50% of the viewport width
 * - Word break set to break-word
 */
function styleOfMyTasksContainer() {
    tasksContainer.style.display = "flex";
    tasksContainer.style.flexDirection = "column";
    tasksContainer.style.gap = "15px";
    tasksContainer.style.padding = "10px";
    tasksContainer.style.maxWidth = "900px";
    tasksContainer.style.height = "100%";
    tasksContainer.style.overflowY = "auto";
    tasksContainer.style.wordBreak = "break-word";
    
}
styleOfMyTasksContainer()


/**
 * A reference to the DOM element with the class 'current-year'.
 * This element is expected to display or interact with the current year.
 * @type {Element}
 */
const currentYear = document.querySelector('.current-year');
const currentDate = new Date();
const getYear = currentDate.getFullYear();
currentYear.textContent = getYear;
