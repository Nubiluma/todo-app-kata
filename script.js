class ToDoItem {
  constructor(description, isDone, id) {
    this.description = description;
    this.isDone = isDone;
    this.id = id;
  }
}

/*****************************************************************************************************/

let idCounter = 0;
const filterOptions = ["all", "done", "open"];

const addBtn = document.querySelector("#btn-add");
const rmBtn = document.querySelector("#btn-remove");
const input = document.querySelector("#todo-input");
const toDoList = document.querySelector("#todo-list");

//test
const fstEntry = new ToDoItem("Learn HTML", false, generateId());
const sndEntry = new ToDoItem("Learn CSS", false, generateId());
const trdEntry = new ToDoItem("Learn JS", false, generateId());

/*****************************************************************************************************/

const appState = {
  filter: "all",
  todos: [fstEntry, sndEntry, trdEntry],
};

addBtn.addEventListener("click", function () {
  addTodoItem();
});

rmBtn.addEventListener("click", function () {
  removeDoneTodos();
});

/*****************************************************************************************************/

/**
 * add input value as new ToDoItem
 */
function addTodoItem() {
  const newEntry = new ToDoItem(input.value, false, generateId());
  appState.todos.push(newEntry);

  render();
}

/**
 * remove ToDoItems with property "isDone === true"
 * return remaining content of todos array after splicing
 */

function removeDoneTodos() {
  const doneTodos = appState.todos.filter((e) => e.isDone === true);
  //DEBUG:
  /* if (doneTodos.length <= 0) {
    console.log("nothing to remove");
  }
  console.log("done:");
  console.log(doneTodos);
  console.log("all:");
  console.log(appState.todos); */

  for (let i = 0; i < doneTodos.length; i++) {
    const index = appState.todos.indexOf(doneTodos[i]);
    appState.todos.splice(index, 1);
  }

  console.log(appState);
  render();
}

//TODO: tidy code by implementing additional functions
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

/**
 * set ToDoItem's "isDone"-property to either true or false
 */
function toggleProgress() {
  const entry = this;
  const index = appState.todos.findIndex((e) => e.id == entry.id);
  console.log("toggled entry index: " + index);

  if (entry.checked) {
    appState.todos[index].isDone = true;
    //console.log(appState.todos[index]);
  } else {
    appState.todos[index].isDone = false;
    //console.log(appState.todos[index]);
  }

  //entry.classList.toggle("todo--status");
}

/**
 * render markup of todo list content
 */
function render() {
  toDoList.innerHTML = "";
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
