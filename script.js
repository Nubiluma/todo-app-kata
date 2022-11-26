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
const errorMsg = document.querySelector("#aside-input-error");

const filterOptions = [filterAll, filterOpen, filterDone];

/*****************************************************************************************************/

const appState = {
  filter: "all",
  todos: [],
};

addBtn.addEventListener("click", function (event) {
  event.preventDefault();
  addTodoItem();
});

rmBtn.addEventListener("click", function () {
  removeDoneTodos();
});

for (const el of filterOptions) {
  el.addEventListener("change", (e) => {
    appState.filter = e.target.id;
    localStorage.setItem("filter", appState.filter);
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
  if (isInputValid()) {
    const newEntry = new ToDoItem(input.value, false, generateId());
    appState.todos.push(newEntry);

    updateLocalStorage();
    render();
  }
  //clear input field
  input.value = "";
}

function isInputValid() {
  const inputVal = input.value;
  const found = appState.todos.find((e) => e.description == inputVal);
  if (inputVal.length >= 5 && found == null) {
    return true;
  }
  if (inputVal.length < 5) {
    renderErrorMsg("Input ivalid! Must consist of 5 characters at least!");
  }
  if (found != null) {
    renderErrorMsg("Input invalid! Todo already exists!");
  }

  console.log("Input invalid");
  return false;
}

/**
 * remove ToDoItems with property "isDone === true"
 * return remaining content of todos array after splicing
 */

function removeDoneTodos() {
  if (appState.todos.length <= 0) {
    console.log("Nothing to delete");
  }

  appState.todos = appState.todos.filter((e) => e.isDone === false);

  /* console.log("new state:");
  console.log(appState); */

  updateLocalStorage();
  render();
}

//TODO: tidy code by implementing additional functions
function createMarkupStructure(entry) {
  //console.log(entry);
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

  appState.todos[index].isDone = entry.checked;

  updateLocalStorage();
  render();
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
 * render markup of todo list content
 */
function render() {
  toDoList.innerHTML = "";
  const filteredTodos = filterTodos(appState.filter);
  //console.log(filteredTodos);

  for (const todo of filteredTodos) {
    createMarkupStructure(todo);
  }

  renderFilter();
}

/**
 * check filter-checkbox of last chosen filter (saved in localStorage)
 * needed for rendering filter option after site refreshing
 */
function renderFilter() {
  switch (appState.filter) {
    case "all":
      filterAll.checked = true;
      break;
    case "open":
      filterOpen.checked = true;
      break;
    case "done":
      filterDone.checked = true;
      break;
  }
}

function renderErrorMsg(message) {
  errorMsg.innerText = message;
  errorMsg.classList.remove("vis-hidden");

  setTimeout(function () {
    errorMsg.classList.add("vis-hidden");
  }, 3000);
}

/**
 * get data from local storage (todo items as array)
 */
function getLocalData() {
  if (localStorage.getItem("todos")) {
    const todoData = JSON.parse(localStorage.getItem("todos"));
    appState.todos = todoData;
  }
  if (localStorage.getItem("filter")) {
    appState.filter = localStorage.getItem("filter");
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
