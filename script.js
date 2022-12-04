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
  removeAllDoneTodos();
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
  if (isInputValid(input.value)) {
    const newEntry = new ToDoItem(input.value, false, generateId());
    appState.todos.push(newEntry);

    updateLocalStorage();
    render();
  }

  input.value = ""; //clear input field
}

/**
 * delete todo-item matching clicked button (compares todo-item id with button name)
 */
function deleteSingleEntry() {
  const index = appState.todos.findIndex((e) => e.id === parseInt(this.name));
  appState.todos.splice(index, 1);

  updateLocalStorage();
  render();
}

/**
 * remove ToDoItems with property "isDone === true"
 * return remaining content of todos array after splicing
 */

function removeAllDoneTodos() {
  if (appState.todos.length <= 0) {
    console.log("Nothing to delete");
  }

  appState.todos = appState.todos.filter((e) => e.isDone === false);

  updateLocalStorage();
  render();
}

/**
 * let user edit todo-item's description
 * prevent more than 1 editing element (div, input, buttons) to be visible
 * check if there is already an editing element existing in todo-list ul element
 * activeEditingElementBtn variable saves current active editBtn button element
 */
let activeEditingElementBtn = null;
function editEntry() {
  //logic
  const index = appState.todos.findIndex((e) => e.id === parseInt(this.name)); //this: editBtn
  const listItemInput = document.getElementById(parseInt(this.name)); //input checkbox element (sibling)
  const listElement = listItemInput.parentElement; //li element (parent)

  /**
   * check if activeEditingElementBtn matches currently clicked editBtn button element
   */
  if (activeEditingElementBtn != this) {
    /* remove existing editing element (the one which was opened before and is still visible) */
    if (activeEditingElementBtn != null) {
      //console.log("active: ", activeEditingElementBtn.name);
      const toRemove = document.getElementById(
        parseInt(activeEditingElementBtn.name)
      ).parentElement.nextSibling;
      console.dir(toRemove);
      activeEditingElementBtn.classList.remove("bg-clr-red02");
      if (toRemove != null) {
        toRemove.remove();
      }
    }
    /* overwrite activeEditingElementBtn to this as the current active/open/visible editing element */
    activeEditingElementBtn = this;

    this.classList.add("bg-clr-red02"); //editBtn extra styling

    //structure
    //TODO: tidy code by implementing additional functions
    const container = document.createElement("div");
    container.classList.add("editTextInput");

    const arrowSymbol = document.createElement("p");
    arrowSymbol.innerText = "↪";
    arrowSymbol.classList.add("arrowSymbol");

    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("placeholder", "Edit Todo Title here...");
    inputText.value = appState.todos[index].description;

    const confirmBtn = document.createElement("button");
    confirmBtn.innerText = "✓";
    confirmBtn.classList.add("confirmBtn");

    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "✕";

    container.appendChild(arrowSymbol);
    container.appendChild(inputText);
    container.appendChild(confirmBtn);
    container.appendChild(cancelBtn);

    listElement.parentNode.insertBefore(container, listElement.nextSibling);

    //event listeners for confirm and cancel buttons
    confirmBtn.addEventListener("click", function () {
      if (isInputValid(inputText.value)) {
        appState.todos[index].description = inputText.value;

        updateLocalStorage();
        render();
      }
    });

    //render to hide editing element
    cancelBtn.addEventListener("click", function () {
      render();
    });
  }
}

//WIP
function moveEntry(direction) {
  /* switch (direction) {
     case "up":
       break;
     case "down":
       break;
   } */
}

/**
 * set ToDoItem's "isDone"-property to either true or false
 */
function toggleProgress() {
  const entry = this;
  //console.dir(this);
  const index = appState.todos.findIndex((e) => e.id === parseInt(entry.id));

  appState.todos[index].isDone = entry.checked;

  updateLocalStorage();
  render();
}

/**
 * check if text input is valid
 * @param {*} inputVal input element value from user input
 * @returns false if input text length is less than 5 chars and if todo item's description is already used
 */
function isInputValid(inputVal) {
  const foundExistingEntry = findExistingEntry();

  if (inputVal.length < 5) {
    renderErrorMsg("Input ivalid! Must consist of 5 characters at least!");
    return false;
  }

  if (inputVal.length >= 5 && foundExistingEntry == null) {
    return true;
  } else {
    renderErrorMsg("Input invalid! Todo already exists!");
  }

  return false;
}

/**
 * find already existing todo-item if present (case sensitive)
 * @returns todo-item id
 */
function findExistingEntry() {
  const inputVal = input.value;

  const inputLowerCase = appState.todos.find(
    (e) => e.description.toLowerCase() === inputVal
  );
  const inputUpperCase = appState.todos.find(
    (e) => e.description.toUpperCase() === inputVal
  );

  if (inputLowerCase != null) {
    console.log(inputLowerCase.id);
    return inputLowerCase.id;
  }

  if (inputUpperCase != null) {
    console.log(inputUpperCase.id);
    return inputUpperCase.id;
  }
}

/*****************************************************************************************************/

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
 * @param {*} filterProp state's filter property
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

//TODO: tidy code by implementing additional functions
function createMarkupStructure(entry) {
  const listItem = document.createElement("li");

  const todoEntry = document.createElement("input");
  todoEntry.setAttribute("type", "checkbox");
  todoEntry.setAttribute("id", entry.id);
  todoEntry.checked = entry.isDone;

  todoEntry.addEventListener("change", toggleProgress);

  const entryLabel = document.createElement("label");
  entryLabel.setAttribute("for", todoEntry.id);
  entryLabel.innerText = entry.description;

  listItem.appendChild(todoEntry);
  listItem.appendChild(entryLabel);
  toDoList.appendChild(listItem);

  createUtilityButtons(listItem, todoEntry.id);
}

function createUtilityButtons(listItem, id) {
  const btnContainer = document.createElement("div");
  //edit
  const editBtn = document.createElement("button");
  editBtn.setAttribute("name", id);
  editBtn.innerText = "✏️";
  editBtn.addEventListener("click", editEntry);
  btnContainer.appendChild(editBtn);

  //move up or down
  const moveUpBtn = document.createElement("button");
  moveUpBtn.setAttribute("name", id);
  moveUpBtn.innerText = "⬆";
  const directionUp = "up";
  moveUpBtn.addEventListener("click", moveEntry(directionUp)); //NYI
  btnContainer.appendChild(moveUpBtn);

  const moveDownBtn = document.createElement("button");
  moveDownBtn.setAttribute("name", id);
  moveDownBtn.innerText = "⬇";
  const directionDown = "down";
  moveDownBtn.addEventListener("click", moveEntry(directionDown)); //NYI
  btnContainer.appendChild(moveDownBtn);

  //delete
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("name", id);
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", deleteSingleEntry);
  btnContainer.appendChild(deleteBtn);

  listItem.appendChild(btnContainer);
}
/**
 * tell user why their input is invalid by briefly rendering element with corresponding text
 * @param {*} message corresponding text: either not enough characters or duplicate input
 */
function renderErrorMsg(message) {
  errorMsg.innerText = message;
  errorMsg.classList.remove("vis-hidden");

  setTimeout(function () {
    errorMsg.classList.add("vis-hidden");
  }, 3000);
}

/*****************************************************************************************************/

/**
 * get data from local storage (todo-items as array)
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
 * load todo-items to local storage
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
