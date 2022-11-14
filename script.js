class ToDoItem {
  constructor(description, isDone) {
    this.description = description;
    this.isDone = isDone;
  }
}

const addBtn = document.querySelector("#btn-add");
const rmBtn = document.querySelector("#btn-remove");
const input = document.querySelector("#todo-input");
const toDoList = document.querySelector("#todo-list");

//test
const fstEntry = new ToDoItem("Learn HTML", false);
const sndEntry = new ToDoItem("Learn CSS", false);
const trdEntry = new ToDoItem("Learn JS", false);

const filterOptions = ["all", "done", "open"];

const appState = {
  filter: "all",
  todos: [fstEntry, sndEntry, trdEntry],
};

console.log(appState);

addBtn.addEventListener("click", function () {
  addTodoItem();
});

rmBtn.addEventListener("click", function () {
  removeDoneTodos();
});

//console.dir(toDoList);

/**
 * add input value to list
 * @param {*} event
 */
function addTodoItem(event) {
  const newEntry = new ToDoItem(input.value, true);
  appState.todos.push(newEntry);

  createMarkupStructure(newEntry);
}

/**
 * remove ToDoItems with property "isDone === true"
 */

function removeDoneTodos() {
  const doneTodos = appState.todos.filter((e) => e.isDone === true);

  /* console.log("filter: ");
  console.log(doneTodos); */

  for (let i = 0; i < appState.todos.length; i++) {
    if (doneTodos.length > 0) {
      appState.todos.splice(doneTodos.indexOf(i), 1);
    }
  }

  console.log(appState);
}

//to do: property isDone -> true/false
function toggleProgress(event) {
  console.dir(event);

  /* const checkbox = event.children.item(1).checked;
  console.log(checkbox); */

  //if (entry)

  //entry.classList.toggle("todo--status");
}

function createMarkupStructure(entry) {
  const listItem = document.createElement("li");

  const todoEntry = document.createElement("input");
  todoEntry.setAttribute("type", "checkbox");

  if (!todoEntry.hasAttribute("id")) {
    todoEntry.setAttribute("id", generateId());
  }

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
let idCounter = 0;
function generateId() {
  idCounter++;
  return idCounter.toString();
}

render();
