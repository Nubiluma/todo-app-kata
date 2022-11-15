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

/*****************************************************************************************************/

const appState = {
  filter: "all",
  todos: [],
};

addBtn.addEventListener("click", function () {
  addTodoItem();
  input.value = ""; //clear input field
});

rmBtn.addEventListener("click", function () {
  removeDoneTodos();
});

for (const el of filterOptions) {
  el.addEventListener("change", (e) => {
    appState.filter = e.target.id;
    manageFilterOptions();
    render();
  });
}

getLocalData();
render();

/*****************************************************************************************************/

/**
 * add input value as new ToDoItem
 */
function addTodoItem() {
  if (input.value.length >= 5) {
    const newEntry = new ToDoItem(input.value, false, generateId());
    appState.todos.push(newEntry);
    updateLocalStorage();
    render();
  } else {
    console.log("Description too short");
  }
}

/**
 * remove ToDoItems with property "isDone === true"
 * return remaining content of todos array after splicing
 */

function removeDoneTodos() {
  //const doneTodos = appState.todos.filter((e) => e.isDone === true);
  //filterTodos("done");

  for (let i = 0; i < appState.todos.length; i++) {
    if (appState.todos[i].isDone) {
      appState.todos.splice(i, 1);
    }
    //const index = appState.todos.indexOf(doneTodos[i]);
  }

  console.log("new state:");
  console.log(appState);

  updateLocalStorage();
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

  if (entry.checked) {
    appState.todos[index].isDone = true;
  } else {
    appState.todos[index].isDone = false;
  }

  updateLocalStorage();
  render();
}
/**
 * toggle connected label element's text-decoration (line-through)
 * @param {*} entry targeted li-Element
 */
function renderProgress(entry) {
  const labelElement = document.getElementById(entry.id).nextSibling; //BUG (nextSibling): Uncaught TypeError
  console.dir(labelElement);

  if (entry.isDone) {
    labelElement.classList.add("todo--status");
  } else {
    labelElement.classList.remove("todo--status");
  }
}

/**
 *
 * @returns either array of all, done or open todos depending on state's filter property
 */
function filterTodos(filterProp) {
  if (filterProp === "open") {
    return appState.todos.filter((e) => e.isDone === false);
  } else if (filterProp === "done") {
    return appState.todos.filter((e) => e.isDone === true);
  } else {
    return appState.todos;
  }
}

/**
 * Restrict active checkboxes (filter options) to exactly 1
 */
function manageFilterOptions() {
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
  const filteredTodos = filterTodos(appState.filter);
  //console.log(filteredTodos);

  manageFilterOptions();
  for (let i = 0; i < appState.todos.length; i++) {
    if (filteredTodos.length > 0) {
      createMarkupStructure(filteredTodos[i]);
      renderProgress(appState.todos[i]);
    }
    //console.log(appState.todos[i]);
  }
}

/**
 * get data from local storage (todo items as array)
 */
function getLocalData() {
  if (localStorage.getItem("todos")) {
    const todoData = JSON.parse(localStorage.getItem("todos"));
    appState.todos = todoData;
  }
}

/**
 *
 */
function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(appState.todos));
}

/**
 * generate id for label and input relations
 */

function generateId() {
  return Date.now();
}

//console.log(appState);
