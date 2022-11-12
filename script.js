const addBtn = document.querySelector("#btn-add");
const rmBtn = document.querySelector("#btn-remove");
const input = document.querySelector("#todo-input");
const toDoList = document.querySelector("#todo-list");

const filterOptions = ["all", "done", "open"];

const appState = {
  filter: "all",
  todos: [],
};

class toDoItem {
  constructor(description, isDone) {
    this.description = description;
    this.isDone = isDone;
  }
}

addBtn.addEventListener("click", function () {
  addTodoItem();
});

/**
 * add input value to list
 * @param {*} event
 */
function addTodoItem(event) {
  const newEntry = new toDoItem(input.value, false);
  appState.todos.push(newEntry);

  createMarkupStructure(newEntry);

  //debug
  console.log("Added Entry: " + input.value);
  console.log(appState);
}

function removeTodoItem(event) {}

function toggleProgress(event) {
  let entry = event.target;
  entry.classList.toggle("todo--status");
}

/*

function filterTodoItems(event) {}

function render() {}
*/

function createMarkupStructure(entry) {
  let entryDiv = document.createElement("div");

  let todoEntry = document.createElement("input");
  todoEntry.setAttribute("type", "checkbox");
  todoEntry.setAttribute("id", generateId());

  //console.log(generateId());

  let entryLabel = document.createElement("label");
  entryLabel.setAttribute("for", todoEntry.id);
  entryLabel.append(entry.description);

  entryDiv.appendChild(todoEntry);
  entryDiv.appendChild(entryLabel);
  toDoList.appendChild(entryDiv);
}

/**
 * generate id for specific label and input relation
 */
let idCounter = 0;
function generateId() {
  idCounter++;
  return idCounter.toString();
}
