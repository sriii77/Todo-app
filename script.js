let todoItemsContainer = document.getElementById("todoItemsContainer");
let userInputElement = document.getElementById("todoUserInput");
let taskDescriptionInput = document.getElementById("taskDescriptionInput");
let dueDateInput = document.getElementById("dueDateInput");
let priorityInput = document.getElementById("priorityInput");
let progressInput = document.getElementById("progressInput");
let searchBar = document.getElementById("searchBar");
let addTodoButton = document.getElementById("addTodoButton");
let editPopup = document.getElementById("editPopup");
let editTaskNameInput = document.getElementById("editTaskName");
let editTaskDescriptionInput = document.getElementById("editTaskDescription");
let editDueDateInput = document.getElementById("editDueDate");
let editPriorityInput = document.getElementById("editPriority");
let editProgressInput = document.getElementById("editProgress");
let updateTodoButton = document.getElementById("updateTodoButton");
let closePopupButton = document.getElementById("closePopupButton");
let editedTodoId;

function getItemsFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getItemsFromLocalStorage();
let todosCount = todoList.length;

function saveTodoListToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);

    displayTodoList(parsedTodoList);
}

function displayTodoList(tasks) {
    todoItemsContainer.innerHTML = "";
    if (tasks.length === 0) {
        todoItemsContainer.innerHTML = "<li>No tasks found</li>";
    } else {
        tasks.forEach(todo => createAndAppendTodoCard(todo));
    }
}

function searchTasks(searchText) {
    let filteredTasks = todoList.filter(todo => {
        let taskString = `${todo.text} ${todo.description} ${todo.dueDate} ${todo.priority} ${todo.progress}`;
        return taskString.toLowerCase().includes(searchText.toLowerCase());
    });
    displayTodoList(filteredTasks);
}

function resetSearch() {
    searchBar.value = "";
    displayTodoList(todoList);
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    todoList = todoList.filter(todo => todo.uniqueNo !== parseInt(todoId.slice(4)));
    saveTodoListToLocalStorage();
}

function openEditPopup(todo) {
    editTaskNameInput.value = todo.text;
    editTaskDescriptionInput.value = todo.description;
    editDueDateInput.value = todo.dueDate;
    editPriorityInput.value = todo.priority;
    editProgressInput.value = todo.progress;
    editedTodoId = todo.uniqueNo;
    editPopup.style.display = "block";
}

function closeEditPopup() {
    editPopup.style.display = "none";
}

closePopupButton.onclick = function() {
    closeEditPopup();
};

updateTodoButton.onclick = function() {
    let editedTaskName = editTaskNameInput.value;
    let editedTaskDescription = editTaskDescriptionInput.value;
    let editedDueDate = editDueDateInput.value;
    let editedPriority = editPriorityInput.value;
    let editedProgress = editProgressInput.value;

    if (editedTaskName === "" || editedTaskDescription === "" || editedDueDate === "" || editedPriority === "" || editedProgress === "") {
        alert("Enter valid text");
        return;
    }

    todoList = todoList.map(todo => {
        if (todo.uniqueNo === editedTodoId) {
            return {
                ...todo,
                text: editedTaskName,
                description: editedTaskDescription,
                dueDate: editedDueDate,
                priority: editedPriority,
                progress: editedProgress
            };
        }
        return todo;
    });

    saveTodoListToLocalStorage();
    closeEditPopup();
    displayTodoList(todoList);

    searchBar.value = "";
};

function validateTodoInput(taskName, taskDescription, dueDate, priority, progress) {
    let errors = [];

    if (taskName === "") {
        errors.push("Task name is required.");
    }

    if (taskDescription === "") {
        errors.push("Task description is required.");
    }

    if (dueDate === "") {
        errors.push("Due date is required.");
    }

    if (priority === "") {
        errors.push("Priority is required.");
    }

    if (progress === "") {
        errors.push("Progress is required.");
    }

    return errors;
}

function generateUniqueId(prefix) {
    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    const uniqueId = `${prefix}_${timestamp}_${randomString}`;
    return uniqueId;
}

addTodoButton.onclick = function() {
    let taskName = userInputElement.value;
    let taskDescription = taskDescriptionInput.value;
    let dueDate = dueDateInput.value;
    let priority = priorityInput.value;
    let progress = progressInput.value;

    let errors = validateTodoInput(taskName, taskDescription, dueDate, priority, progress);

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    todosCount++;
    let newTodo = {
        text: taskName,
        description: taskDescription,
        dueDate: dueDate,
        priority: priority,
        progress: progress,
        uniqueNo: todosCount,
        id: generateUniqueId('task')
    };
    todoList.push(newTodo);

    createAndAppendTodoCard(newTodo);
    userInputElement.value = "";
    taskDescriptionInput.value = "";
    dueDateInput.value = "";
    priorityInput.value = "";
    progressInput.value = "";

    saveTodoListToLocalStorage();
};

searchBar.addEventListener("input", function() {
    let searchText = searchBar.value.trim();
    if (searchText === "") {
        resetSearch();
    } else {
        searchTasks(searchText);
    }
});

function createAndAppendTodoCard(todo) {
    let todoId = 'todo' + todo.uniqueNo;

    let todoCard = document.createElement("div");
    todoCard.classList.add("todo-card");
    todoCard.id = todoId;

    let labelElement = document.createElement("label");
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = `Name: ${todo.text}\nDescription: ${todo.description}\nDue Date: ${todo.dueDate}\nPriority: ${todo.priority}\nStatus: ${todo.progress}`;
    
    // Set color based on priority
    if (todo.priority === "low") {
        labelElement.style.backgroundColor = "#ccffcc";
    } else if (todo.priority === "medium") {
        labelElement.style.backgroundColor = "#b3d9ff";
    } else if (todo.priority === "high") {
        labelElement.style.backgroundColor = "red";
        labelElement.style.color="white";
    }

    
    let editIcon = document.createElement("i");
    editIcon.classList.add("far", "fa-edit", "edit-icon");
    editIcon.onclick = function() {
        openEditPopup(todo);
    };

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    todoCard.appendChild(labelElement);
    todoCard.appendChild(editIcon);
    todoCard.appendChild(deleteIcon);

    todoItemsContainer.appendChild(todoCard);
}

displayTodoList(todoList);
