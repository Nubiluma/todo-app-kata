class ToDoItem {
  constructor(description, isDone, id) {
    this.description = description;
    this.isDone = isDone;
    this.id = id;
  }
}

/*****************************************************************************************************/

const addBtn = document.querySelector("#btn-add");
const rmBtn = document.querySelector("#btn-remove");
const input = document.querySelector("#todo-input");
const filterAll = document.querySelector("#all");
const filterOpen = document.querySelector("#open");
const filterDone = document.querySelector("#done");
const toDoList = document.querySelector("#todo-list");

const filterOptions = [filterAll, filterOpen, filterDone];

//test
const fstEntry = new ToDoItem("Learn HTML", false, 1);
const sndEntry = new ToDoItem("Learn CSS", false, 2);
const trdEntry = new ToDoItem("Learn JS", false, 3);

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

for (const el of filterOptions) {
  el.addEventListener("change", (e) => {
    appState.filter = e.target.id;
    //console.log(appState.filter);
    filterTodos();
  });
}

render();

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
  todoEntry.checked = entry.isDone;

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
  //console.log("toggled entry index: " + index);

  if (entry.checked) {
    appState.todos[index].isDone = true;
  } else {
    appState.todos[index].isDone = false;
  }

  render();
}
/**
 * toggle connected label element's text-decoration (line-through)
 * @param {*} entry targeted li-Element
 */
function renderProgress(entry) {
  const labelElement = document.getElementById(entry.id).nextSibling;
  /* console.dir(labelElement);
  console.log(entry.isDone); */
  if (entry.isDone) {
    labelElement.classList.add("todo--status");
  } else {
    labelElement.classList.remove("todo--status");
  }
}

/**
 * WIP
 */
function filterTodos() {
  if (appState.filter === "open") {
    filterOpen.checked = true;
    filterAll.checked = false;
    filterDone.checked = false;
  } else if (appState.filter === "done") {
    filterDone.checked = true;
    filterOpen.checked = false;
    filterAll.checked = false;
  } else {
    filterAll.checked = true;
    filterDone.checked = false;
    filterOpen.checked = false;
  }
}

/**
 * render markup of todo list content
 */
function render() {
  toDoList.innerHTML = "";

  filterTodos();
  for (let i = 0; i < appState.todos.length; i++) {
    createMarkupStructure(appState.todos[i]);
    renderProgress(appState.todos[i]);
    //console.log(appState.todos[i]);
  }
}

/**
 * generate id for label and input relations
 */

function generateId() {
  return Date.now();
}

//console.log(appState);
