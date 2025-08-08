const addTodo = document.getElementById("add_todo");
const inputField = document.getElementById("input_field");
const todoContainer = document.getElementById("todo_container"); // main list wrapper
const deleteConfirmationCard = document.getElementById("delete_confirmation_card");
const confirmDelete = document.getElementById("confirm_delete");
const cancelDelete = document.getElementById("cancel_delete");
const noTodos = document.getElementById("no_todos");
const allTodosContainer = document.getElementById("all_todos_container");
const deleteAllTodosButton = document.getElementById("delete_all_todos");


let todos = [];
let todoIndex = 0;

addTodo.disabled = true;

const STORAGE_KEY='todos';

saveTodos=()=>{
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}


loadTodos=()=>{
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){
    try{
      todos=JSON.parse(raw);
    }catch(e){
      console.error("Error parsing todos from localStorage", e);
      todos=[];
    }
  }
}

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
    const singleTodo = document.createElement("div");
    singleTodo.classList.add("todo");
    if (todo.done) {
      singleTodo.classList.add("done");
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete_btn");
    deleteBtn.setAttribute("data-index", index);
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      todoIndex = parseInt(event.target.getAttribute("data-index"));
      display_confirmation();
    });

    singleTodo.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos(); // Save after toggle
      renderTodoList();
    });

    singleTodo.appendChild(textSpan);
    singleTodo.appendChild(deleteBtn);
    todoContainer.appendChild(singleTodo);
  });
}

confirmDelete.addEventListener("click", () => {
  todos.splice(todoIndex, 1);
  saveTodos(); // Save after delete
  deleteConfirmationCard.style.display = "none";
  renderTodoList();
});

cancelDelete.addEventListener("click", () => {
  deleteConfirmationCard.style.display = "none";
});

function display_confirmation() {
  deleteConfirmationCard.style.display = "block";
}

function check_input_field() {
  const todoText = inputField.value.trim();
  if (todoText !== "") {
    todos.push({ text: todoText, done: false });
    saveTodos(); // Save after add
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

addTodo.addEventListener("click", check_input_field);

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    check_input_field();
  }
});


deleteAllTodosButton.addEventListener("click", () => {


  if (todos.length > 0) {
    if (confirm("Are you sure you want to delete all todos?")) {
      todos = [];
      saveTodos(); 
      renderTodoList();
    }
  }
  else {
    alert("No todos to delete.");
  }
})     



// ------------------ INITIAL LOAD ------------------
loadTodos();
renderTodoList();
