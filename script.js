//////////////clock///////////////////////
function showTime() {
  let date = new Date();
  let d = date.toLocaleString("default", { weekday: "long" });
  let h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  let s = date.getSeconds(); // 0 - 59
  let session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  let time = d + " " + h + ":" + m + ":" + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;

  setTimeout(showTime, 1000);
}

showTime();

//////////////quote generator///////////////////////
const quote = document.querySelector(".quote");

setInterval(() => {
  showQuote();
}, 12000);

function showQuote() {
  fetch("https://type.fit/api/quotes")
    .then((response) => response.json())
    .then(function (data) {
      let arrayIndex = Math.floor(Math.random() * data.length);
      console.log(arrayIndex);
      quote.innerHTML = `<p class = 'quoteText'>${data[arrayIndex].text}</p><br><h3 class = 'quoteAuthor'>${data[arrayIndex].author}</h3>`;
    });
}

showQuote();

//////////////////////to do list///////////////////////////////
// On app load, get all tasks from localStorage
window.onload = loadTasks;

// On form submit add task
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // check if localStorage has any tasks
  // if not then return
  if (localStorage.getItem("tasks") == null) return;

  // Get the tasks from localStorage and convert it to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // Loop through the tasks and add them to the list
  tasks.forEach((task) => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${
      task.completed ? "checked" : ""
    }>
      <input type="text" value="${task.task}" class="task ${
      task.completed ? "completed" : ""
    }" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // return if task is empty
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // check is task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  // add task to local storage
  localStorage.setItem(
    "tasks",
    JSON.stringify([
      ...JSON.parse(localStorage.getItem("tasks") || "[]"),
      { task: task.value, completed: false },
    ])
  );

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
  <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
  <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
  loadStat();
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
  loadStat();
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach((task) => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
  loadStat();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // task already exist
  tasks.forEach((task) => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currentTask;
      return;
    }
  });
  // update task
  tasks.forEach((task) => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
/////////////////////////////////////////////////////////////////////////////////
const totalTasks = document.querySelector(".totalTasks");
const completedTasks = document.querySelector(".completedTasks");
let date = new Date();
console.log(date);
const day = date.toLocaleString("default", { weekday: "long" });
console.log(day);
///PERCENT BAR
let mon = document.querySelector(".mon-perc-bar");
let tue = document.querySelector(".tue-perc-bar");
let wed = document.querySelector(".wed-perc-bar");
let thu = document.querySelector(".thu-perc-bar");
let fri = document.querySelector(".fri-perc-bar");
let sat = document.querySelector(".sat-perc-bar");
let sun = document.querySelector(".sun-perc-bar");
///PERCENT TEXT
let monText = document.querySelector(".mon-p");
let tueText = document.querySelector(".tue-p");
let wedText = document.querySelector(".wed-p");
let thuText = document.querySelector(".thu-p");
let friText = document.querySelector(".fri-p");
let satText = document.querySelector(".sat-p");
let sunText = document.querySelector(".sun-p");
// ПЕРЕМЕННАЯ РАВНАЯ ДНЮ НЕДЕЛИ И СРАВНИВАТЬ С ТЕКУЩИМ ДНЕМ

/////////////////////NUMBER OF TASKS/////////////////////
function loadStat() {
  if (localStorage.getItem("tasks") == null) return;
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  if (tasks.length > 9) {
    totalTasks.innerHTML = `Number of tasks: ${tasks.length}`;
  } else {
    totalTasks.innerHTML = `Number of tasks: 0${tasks.length}`;
  }

  /////////////////////TASKS COMPLETED/////////////////////
  let count = [];
  async function taskCompleted() {
    tasks.forEach((task) => {
      if (task.completed) {
        count.push(task);
      }
    });
  }

  taskCompleted();
  if (count.length > 9) {
    completedTasks.innerHTML = `Tasks completed: ${count.length}`;
  } else {
    completedTasks.innerHTML = `Tasks completed: 0${count.length}`;
  }

  /////////////////////DAILY PROGRESS/////////////////////
  let taskNumber = tasks.length;
  let completedTaskNumber = count.length;
  const result = Math.round((completedTaskNumber * 100) / taskNumber);
  console.log(result);

  let progressValue = document.querySelector(".progress-value");
  let progress = document.querySelector(".progress");

  if (taskNumber > 0) {
    progress.style.background = `conic-gradient(#9c77fc ${result}%, #555 ${result}%)`;
    progressValue.textContent = `${result}%`;
  } else {
    progress.style.background = `conic-gradient(#9c77fc 0%, #555 0%)`;
    progressValue.textContent = `0%`;
  }

  //ALL DAYS STAT
  if (day === "Monday") {
    mon.style.width = `${result}%`;
    monText.innerHTML = `${result}%`;
    localStorage.setItem("Monday", result);
  } else if (day === "Tuesday") {
    tue.style.width = `${result}%`;
    tueText.innerHTML = `${result}%`;
    localStorage.setItem("Tuesday", result);
  } else if (day === "Wednesday") {
    wed.style.width = `${result}%`;
    wedText.innerHTML = `${result}%`;
    localStorage.setItem("Wednesday", result);
  } else if (day === "Thursday") {
    thu.style.width = `${result}%`;
    thuText.innerHTML = `${result}%`;
    localStorage.setItem("Thursday", result);
  } else if (day === "Friday") {
    fri.style.width = `${result}%`;
    friText.innerHTML = `${result}%`;
    localStorage.setItem("Friday", result);
  } else if (day === "Saturday") {
    sat.style.width = `${result}%`;
    satText.innerHTML = `${result}%`;
    localStorage.setItem("Saturday", result);
  } else if (day === "Sunday") {
    sun.style.width = `${result}%`;
    sunText.innerHTML = `${result}%`;
    localStorage.setItem("Sunday", result);
  }
}

loadStat();

// WEEK STAT
function weekStat() {
  ////////////////////////////////////////////////
  let monValue = localStorage.getItem("Monday");
  mon.style.width = `${monValue}%`;
  monText.innerHTML = `${monValue}%`;
  /////////////////////////////////////////////
  let tueValue = localStorage.getItem("Tuesday");
  tue.style.width = `${tueValue}%`;
  tueText.innerHTML = `${tueValue}%`;
  ////////////////////////////////////////////////
  let wedValue = localStorage.getItem("Wednesday");
  wed.style.width = `${wedValue}%`;
  wedText.innerHTML = `${wedValue}%`;
  /////////////////////////////////////////////////
  let thuValue = localStorage.getItem("Thursday");
  thu.style.width = `${thuValue}%`;
  thuText.innerHTML = `${thuValue}%`;
  ///////////////////////////////////////////////////
  let friValue = localStorage.getItem("Friday");
  fri.style.width = `${friValue}%`;
  friText.innerHTML = `${friValue}%`;
  ////////////////////////////////////////////////////
  let satValue = localStorage.getItem("Saturday");
  sat.style.width = `${satValue}%`;
  satText.innerHTML = `${satValue}%`;
  ////////////////////////////////////////////////////
  let sunValue = localStorage.getItem("Sunday");
  sun.style.width = `${sunValue}%`;
  sunText.innerHTML = `${sunValue}%`;
}
weekStat();

/////////////BUTTONS //////////////////
const dayBtn = document.getElementById("cleanDay-btn");
const cleanAllBtn = document.getElementById("cleanAll-btn");
//REMOVE CURRENT TASKS
function removeCurrentTasks() {
  localStorage.removeItem("tasks");
  document.querySelector("ul").innerHTML = "";
  let progressValue = document.querySelector(".progress-value");
  let progress = document.querySelector(".progress");
  progress.style.background = `conic-gradient(#9c77fc 0%, #555 0%)`;
  progressValue.textContent = `0%`;
  totalTasks.innerHTML = `Number of tasks: 00`;
  completedTasks.innerHTML = `Tasks completed: 00`;
}
//CLEAN WEEKLY REPORT
function cleanWeeklyReport() {
  localStorage.removeItem("Monday");
  mon.style.width = `0%`;
  monText.innerHTML = "";
  localStorage.removeItem("Tuesday");
  tue.style.width = `0%`;
  tueText.innerHTML = "";
  localStorage.removeItem("Wednesday");
  wed.style.width = `0%`;
  wedText.innerHTML = "";
  localStorage.removeItem("Thursday");
  thu.style.width = `0%`;
  thuText.innerHTML = "";
  localStorage.removeItem("Friday");
  fri.style.width = `0%`;
  friText.innerHTML = "";
  localStorage.removeItem("Saturday");
  sat.style.width = `0%`;
  satText.innerHTML = "";
  localStorage.removeItem("Sunday");
  sun.style.width = `0%`;
  sunText.innerHTML = "";
}
