const addBtn = document.querySelector("#btn-add");
const input = document.querySelector("#todo-input");
const toDoList = document.querySelector("#todo-list");

const toDos = [];

class toDoItem {
  constructor(value, progress) {
    this.value = value;
    this.progress = progress;
  }
}

addBtn.addEventListener("click", function () {
  addTodoItem();
});

/**
 * add input value to list container
 * @param {*} event
 */
function addTodoItem(event) {
  const newEntry = new toDoItem(input.value, "open");
  toDos.push(newEntry);

  let li = document.createElement("li");
  li.append(newEntry.value);
  toDoList.appendChild(li);

  //debug
  console.log("Added Entry: " + input.value);
  console.log(toDos);
}

function toggleProgress() {}

function removeTodoItem() {}

function filterTodoItems() {}

function render() {}
