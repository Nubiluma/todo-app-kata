class ToDoItem {
  constructor(description, isDone, id) {
    this.description = description;
    this.isDone = isDone;
    this.id = id;
  }
}

let idCounter = 0;

const addBtn = document.querySelector("#btn-add");
const rmBtn = document.querySelector("#btn-remove");
const input = document.querySelector("#todo-input");
const toDoList = document.querySelector("#todo-list");

//test
const fstEntry = new ToDoItem("Learn HTML", false, generateId());
const sndEntry = new ToDoItem("Learn CSS", false, generateId());
const trdEntry = new ToDoItem("Learn JS", false, generateId());

const filterOptions = ["all", "done", "open"];

const appState = {
  filter: "all",
  todos: [fstEntry, sndEntry, trdEntry],
};

//console.log(appState.todos[0]);

addBtn.addEventListener("click", function () {
  addTodoItem();
});

rmBtn.addEventListener("click", function () {
  removeDoneTodos();
});

//console.dir(toDoList);

/**
 * add input value to list
 */
function addTodoItem() {
  const newEntry = new ToDoItem(input.value, true, generateId());
  appState.todos.push(newEntry);

  createMarkupStructure(newEntry);
}

/**
 * remove ToDoItems with property "isDone === true"
 */

function removeDoneTodos() {
  const doneTodos = appState.todos.filter((e) => e.isDone === true);

  for (let i = 0; i < appState.todos.length; i++) {
    if (doneTodos.length > 0) {
      appState.todos.splice(doneTodos.indexOf(i), 1);
    }
  }

  console.log(appState);
}

function toggleProgress() {
  const entry = this;
  const index = appState.todos.findIndex((e) => e.id == entry.id);
  console.log("index: " + index);

  if (entry.checked) {
    appState.todos[index].isDone = true;
    console.log(appState.todos[index]);
  } else {
    appState.todos[index].isDone = false;
    console.log(appState.todos[index]);
  }

  //entry.classList.toggle("todo--status");
}

function createMarkupStructure(entry) {
  const listItem = document.createElement("li");

  const todoEntry = document.createElement("input");
  todoEntry.setAttribute("type", "checkbox");
  todoEntry.setAttribute("id", entry.id);

  todoEntry.addEventListener("change", toggleProgress);

  let entryLabel = document.createElement("label");
  entryLabel.setAttribute("for", todoEntry.id);
  entryLabel.append(entry.description);

  listItem.appendChild(todoEntry);
  listItem.appendChild(entryLabel);
  toDoList.appendChild(listItem);
}

function render() {
  for (let i = 0; i < appState.todos.length; i++) {
    createMarkupStructure(appState.todos[i]);
  }
}

/**
 * generate id for label and input relations
 */

function generateId() {
  idCounter++;
  return "E-" + idCounter.toString();
}

render();
