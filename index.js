const addTodo = document.getElementById("add_todo");
const inputField = document.getElementById("input_field");
const todoContainer = document.getElementById("todo_container"); 
const deleteConfirmationCard = document.getElementById("delete_confirmation_card");
const confirmDelete = document.getElementById("confirm_delete");
const cancelDelete = document.getElementById("cancel_delete");
const noTodos = document.getElementById("no_todos");
const allTodosContainer = document.getElementById("all_todos_container");
const deleteAllTodosButton = document.getElementById("delete_all_todos");

let todos = [];
let todoIndex = null;
let deleteMode = "single"; // 'single' or 'all'

addTodo.disabled = true;

const STORAGE_KEY = 'todos';

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
  todoContainer.innerHTML = "";

  if (todos.length === 0) {
    noTodos.style.display = "block";
    allTodosContainer.style.display = "none";
    deleteAllTodosButton.style.display = "none";
    return;
  }

  noTodos.style.display = "none";
  deleteAllTodosButton.style.display = "block";
  allTodosContainer.style.display = "block";

  todos.forEach((todo, index) => {
    const SINGLE_TODO = document.createElement("div");
    SINGLE_TODO.classList.add("todo");
    if (todo.done) {
      SINGLE_TODO.classList.add("done");
    }

    const TEXT_SPAN = document.createElement("span");
    TEXT_SPAN.textContent = todo.text;
    TEXT_SPAN.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodoList();
    });

 
    const ACTIONS = document.createElement("div");
    ACTIONS.classList.add("todo_actions");

    const EDIT_BTN = document.createElement("button");
    EDIT_BTN.innerHTML = '<i class="fa-solid fa-pen"></i>';
    EDIT_BTN.classList.add("edit_btn");
    EDIT_BTN.setAttribute("data-index", index);
    EDIT_BTN.addEventListener("click", (event) => {
      event.stopPropagation();
      startEdit(index, TEXT_SPAN);
    });

    const DELETE_BTN = document.createElement("button");
    DELETE_BTN.innerHTML = '<i class="fa-solid fa-trash"></i>';
    DELETE_BTN.classList.add("delete_btn");
    DELETE_BTN.setAttribute("data-index", index);
    DELETE_BTN.addEventListener("click", (event) => {
      event.stopPropagation();
      todoIndex = parseInt(event.target.closest("button").getAttribute("data-index"));
      display_confirmation("single");
    });

    ACTIONS.appendChild(EDIT_BTN);
    ACTIONS.appendChild(DELETE_BTN);

    SINGLE_TODO.appendChild(TEXT_SPAN);
    SINGLE_TODO.appendChild(ACTIONS);
    todoContainer.appendChild(SINGLE_TODO);
  });
}

function startEdit(index, textSpan) {
  const currentText = todos[index].text;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.classList.add("edit_input");

  textSpan.replaceWith(input);
  input.focus();

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      finishEdit(index, input.value.trim(), input);
    }
  });

  input.addEventListener("blur", () => {
    finishEdit(index, input.value.trim(), input);
  });
}

function finishEdit(index, newText, input) {
  if (newText) {
    todos[index].text = newText;
    saveTodos();
  }
  renderTodoList();
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
  const todoText = inputField.value.trim();
  if (todoText !== "") {
    todos.push({ text: todoText, done: false });
    saveTodos();
    inputField.value = "";
    addTodo.disabled = true;
    addTodo.classList.remove("btn_1_active");
    renderTodoList();
  }
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

addTodo.addEventListener("click", (event) => {
  event.preventDefault();
  check_input_field();
});

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && document.activeElement === inputField) {
    event.preventDefault();
    check_input_field();
  }
});

deleteAllTodosButton.addEventListener("click", () => {
  if (todos.length > 0) {
    display_confirmation("all");
  }
});

loadTodos();
renderTodoList();
