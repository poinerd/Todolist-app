const addTodo = document.getElementById("add_todo");
const inputField = document.getElementById("input_field");
const deleteConfirmationCard = document.getElementById("delete_confirmation_card");
const confirmDelete = document.getElementById("confirm_delete");
const cancelDelete = document.getElementById("cancel_delete");
const noTodos = document.getElementById("no_todos");
const allTodosContainer = document.getElementById("all_todos_container");
const deleteAllTodosButton = document.getElementById("delete_all_todos");

let todos = [];
let todoIndex = null;
let deleteMode = "single";
const STORAGE_KEY = 'todos';

addTodo.disabled = true;

const saveTodos = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const loadTodos = () => {
  const RAW = localStorage.getItem(STORAGE_KEY);
  if (RAW) {
    try {
      todos = JSON.parse(RAW);
    } catch (e) {
      console.error("Error parsing todos from localStorage", e);
      todos = [];
    }
  }
};

function renderTodoList() {
  if (todos.length === 0) {
    noTodos.style.display = "block";
    allTodosContainer.style.display = "none";
    deleteAllTodosButton.style.display = "none";
    return;
  }

  noTodos.style.display = "none";
  deleteAllTodosButton.style.display = "block";
  allTodosContainer.style.display = "block";
  allTodosContainer.innerHTML = '';

  todos.forEach((todo, index) => {
    let task = document.createElement("div");
    task.className = "todo";
    task.innerHTML = `
      <span id="todo_text" class="todo_text">${todo.text}</span>
      <div class="buttons_container">
        <button onclick="startEdit(${todo.id})" class="edit_btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg></button>

        </button>
        <button onclick="deleteTodo(event)" data-index="${index}" class="delete_btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>

        </button>
      </div>
    `;
    allTodosContainer.appendChild(task);
  });
}

function createTodo() {
  if (check_input_field()) {
    const INPUT_VALUE = inputField.value.trim();
    const TASK = {
      text: INPUT_VALUE,
      done: false,
      id: todos.length + 1
    };
    todos.push(TASK);
    saveTodos();
    renderTodoList();
    inputField.value = "";
    addTodo.disabled = true;
    addTodo.classList.remove("btn_1_active");
  }
}

function startEdit(id) {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return;

  const todoDiv = allTodosContainer.children[index];
  const span = todoDiv.querySelector(".todo_text");

  const input = document.createElement("input");
  input.type = "text";
  input.value = todos[index].text;
  input.className = "edit_input";




  span.replaceWith(input);
  input.focus();

  const finishEdit = () => {
    const newText = input.value.trim();
    if (newText) {
      todos[index].text = newText;
      saveTodos();
    }
    renderTodoList();
  };

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      finishEdit();
    }
  });

  input.addEventListener("blur", finishEdit);
}

function display_confirmation(mode) {
  deleteMode = mode;
  deleteConfirmationCard.style.display = "flex";
}

confirmDelete.addEventListener("click", () => {
  if (deleteMode === "single" && todoIndex !== null) {
    todos.splice(todoIndex, 1);
  } else if (deleteMode === "all") {
    todos = [];
  }
  saveTodos();
  deleteConfirmationCard.style.display = "none";
  renderTodoList();
});

cancelDelete.addEventListener("click", () => {
  deleteConfirmationCard.style.display = "none";
});

function check_input_field() {
  return inputField.value.trim() !== "";
}

inputField.addEventListener("input", () => {
  if (inputField.value.trim() !== "") {
    addTodo.disabled = false;
    addTodo.classList.add("btn_1_active");
  } else {
    addTodo.disabled = true;
    addTodo.classList.remove("btn_1_active");
  }
});

addTodo.addEventListener('click', (event) => {
  event.preventDefault();
  createTodo();
});

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && document.activeElement === inputField) {
    event.preventDefault();
    createTodo();
  }
});

deleteAllTodosButton.addEventListener("click", () => {
  if (todos.length > 0) {
    display_confirmation("all");
  }
});

function deleteTodo(event) {
  todoIndex = parseInt(event.target.closest("button").getAttribute("data-index"));
  display_confirmation("single");
}

loadTodos();
renderTodoList();
