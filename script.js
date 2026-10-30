const input = document.getElementById("input");
const addbtn = document.getElementById("addbtn");
const Tasklist = document.getElementById("Task-list");
const emptyState = document.getElementById("noTaskNote");

const totalCount = document.getElementById("totalcount");
const completedCount = document.getElementById("completedcount");
const remainingCount = document.getElementById("remainingcount");

const allTasksbtn = document.getElementById("Filterall");
const completedbtn = document.getElementById("FilterCompleted");
const pendingbtn = document.getElementById("FilterRemaining");
const clearbtn = document.getElementById("FilterTrash");

const mobilemenu = document.getElementById("mobilemenu");
const closebtn = document.getElementById("closebtn");
const sidenavs = document.querySelector(".sidenavs");

const lightmood = document.getElementById("lightmood");
const darkmood = document.getElementById("darkmood");

let taskarr = [];
let currentFilter = "all";

function creatTask(task, index) {
    if (!task || typeof task.text !== "string" || task.text.trim() === "") {
        return;
    }

    const divcont = document.createElement("div");
    divcont.classList.add("containerdiv");

    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    const tasktext = document.createElement("span");
    tasktext.textContent = task.text;
    tasktext.classList.add("task-text");

    const taskStatus = document.createElement("span");
    taskStatus.classList.add("task-status");

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-action", "task-actions");

    const li = document.createElement("li");
    li.style.listStyleType = "none";
    li.classList.add("task-item");

    const Deletbtn = document.createElement("button");
    Deletbtn.type = "button";
    Deletbtn.classList.add("task-delete-btn");
    Deletbtn.setAttribute("aria-label", "Delete task");
    Deletbtn.title = "Delete task";
    Deletbtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    const Editbtn = document.createElement("button");
    Editbtn.type = "button";
    Editbtn.classList.add("task-edit-btn");
    Editbtn.setAttribute("aria-label", "Edit task");
    Editbtn.title = "Edit task";
    Editbtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    const Checkbox = document.createElement("input");
    Checkbox.type = "checkbox";
    Checkbox.classList.add("cbox");
    Checkbox.setAttribute("aria-label", "Mark task as completed");

    taskInfo.append(Checkbox);
    taskInfo.append(tasktext);
    taskInfo.append(taskStatus);

    taskActions.append(Editbtn);
    taskActions.append(Deletbtn);

    divcont.append(taskInfo);
    divcont.append(taskActions);
    li.append(divcont);

    function updateTaskAppearance() {
        Checkbox.checked = Boolean(taskarr[index] && taskarr[index].completed);
        li.classList.toggle("check", Checkbox.checked);
        taskStatus.textContent = Checkbox.checked ? "Completed" : "Pending";
        taskStatus.classList.toggle("completed", Checkbox.checked);
        Checkbox.setAttribute(
            "aria-label",
            Checkbox.checked ? "Mark task as pending" : "Mark task as completed"
        );
    }

    Editbtn.addEventListener("click", function () {
        if (!taskarr[index]) {
            return;
        }

        const NewTasktext = prompt("Enter your Task!", taskarr[index].text);

        if (NewTasktext !== null && NewTasktext.trim() !== "") {
            taskarr[index].text = NewTasktext.trim();
            tasktext.textContent = taskarr[index].text;
            saveTask();
            updateTaskDisplay();
        }
    });

    Deletbtn.addEventListener("click", function () {
        taskarr.splice(index, 1);
        saveTask();
        showTask();
        updateCounter();
    });

    Checkbox.addEventListener("change", function () {
        if (!taskarr[index]) {
            return;
        }

        taskarr[index].completed = Checkbox.checked;
        updateTaskAppearance();
        saveTask();
        updateCounter();
        applyTaskFilter();
    });

    updateTaskAppearance();
    Tasklist.append(li);
    applyFilterToTask(li, task);
}

function showTask() {
    Tasklist.innerHTML = "";

    for (let i = 0; i < taskarr.length; i++) {
        creatTask(taskarr[i], i);
    }

    updateTaskDisplay();
    updateCounter();
    updateFilterButtons();
}

function updateCounter() {
    const total = taskarr.length;
    let completeds = 0;

    for (let i = 0; i < taskarr.length; i++) {
        if (taskarr[i].completed) {
            completeds++;
        }
    }

    const remaining = total - completeds;

    totalCount.textContent = total;
    completedCount.textContent = completeds;
    remainingCount.textContent = remaining;
}

function updateTaskDisplay() {
    const hasTasks = taskarr.length > 0;

    emptyState.style.display = hasTasks ? "none" : "flex";
    Tasklist.style.display = hasTasks ? "block" : "none";
}

function saveTask() {
    localStorage.setItem("task", JSON.stringify(taskarr));
}

function loadTask() {
    const savedTasks = localStorage.getItem("task");

    if (savedTasks !== null) {
        try {
            const parsedTasks = JSON.parse(savedTasks);

            if (Array.isArray(parsedTasks)) {
                taskarr = parsedTasks
                    .filter(task => task && typeof task.text === "string")
                    .map(task => ({
                        text: task.text,
                        completed: Boolean(task.completed)
                    }));
            } else {
                taskarr = [];
            }
        } catch (error) {
            taskarr = [];
        }
    }

    showTask();
}

function addTask() {
    const inputTask = input.value.trim();

    if (inputTask === "") {
        input.focus();
        return;
    }

    taskarr.push({
        text: inputTask,
        completed: false
    });

    saveTask();
    input.value = "";
    currentFilter = "all";
    showTask();
    input.focus();
}

addbtn.addEventListener("click", addTask);

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function applyFilterToTask(li, task) {
    if (currentFilter === "completed") {
        li.style.display = task.completed ? "" : "none";
    } else if (currentFilter === "pending") {
        li.style.display = task.completed ? "none" : "";
    } else {
        li.style.display = "";
    }
}

function applyTaskFilter() {
    const items = Tasklist.children;

    for (let i = 0; i < items.length; i++) {
        const checkbox = items[i].querySelector('input[type="checkbox"]');

        if (currentFilter === "completed") {
            items[i].style.display = checkbox.checked ? "" : "none";
        } else if (currentFilter === "pending") {
            items[i].style.display = checkbox.checked ? "none" : "";
        } else {
            items[i].style.display = "";
        }
    }

    updateFilterButtons();
}

function updateFilterButtons() {
    allTasksbtn.classList.toggle("active", currentFilter === "all");
    completedbtn.classList.toggle("active", currentFilter === "completed");
    pendingbtn.classList.toggle("active", currentFilter === "pending");
}

allTasksbtn.addEventListener("click", function () {
    currentFilter = "all";
    applyTaskFilter();
});

completedbtn.addEventListener("click", function () {
    currentFilter = "completed";
    applyTaskFilter();
});

pendingbtn.addEventListener("click", function () {
    currentFilter = "pending";
    applyTaskFilter();
});

clearbtn.addEventListener("click", function () {
    taskarr = taskarr.filter(task => !task.completed);
    saveTask();
    showTask();
});

function openMobileMenu() {
    if (!sidenavIsAvailable()) {
        return;
    }

    sidenavs.classList.add("mobile-open");
    document.body.classList.add("menu-open");
    mobilemenu.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
    if (!sidenavIsAvailable()) {
        return;
    }

    sidenavs.classList.remove("mobile-open");
    document.body.classList.remove("menu-open");
    mobilemenu.setAttribute("aria-expanded", "false");
}

function sidenavIsAvailable() {
    return Boolean(sidenavs && mobilemenu && closebtn);
}

if (mobilemenu && sidenavs) {
    mobilemenu.setAttribute("aria-expanded", "false");
    mobilemenu.setAttribute("aria-controls", "mobileMenu");

    mobilemenu.addEventListener("click", function () {
        if (sidenavs.classList.contains("mobile-open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

if (closebtn) {
    closebtn.addEventListener("click", closeMobileMenu);
}

document.addEventListener("click", function (event) {
    if (
        sidenavs &&
        mobilemenu &&
        sidenavs.classList.contains("mobile-open") &&
        !sidenavs.contains(event.target) &&
        !mobilemenu.contains(event.target)
    ) {
        closeMobileMenu();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
});

function setTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("todo-theme", isLight ? "light" : "dark");

    if (lightmood) {
        lightmood.setAttribute("aria-pressed", String(isLight));
        lightmood.setAttribute("aria-label", "Switch to light mode");
    }

    if (darkmood) {
        darkmood.setAttribute("aria-pressed", String(!isLight));
        darkmood.setAttribute("aria-label", "Switch to dark mode");
    }
}

if (lightmood) {
    lightmood.addEventListener("click", function () {
        setTheme("light");
    });
}

if (darkmood) {
    darkmood.addEventListener("click", function () {
        setTheme("dark");
    });
}

const savedTheme = localStorage.getItem("todo-theme");
setTheme(savedTheme === "light" ? "light" : "dark");

const mobileHome = document.getElementById("mobileHome");
const mobileStat = document.getElementById("mobileStat");
const mobileFilter = document.getElementById("mobileFilter");
const mobileClear = document.getElementById("mobileClear");

if (mobileHome) {
    mobileHome.addEventListener("click", function () {
        currentFilter = "all";
        applyTaskFilter();
        closeMobileMenu();
        document.querySelector(".AlltaskContainer").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

if (mobileStat) {
    mobileStat.addEventListener("click", function () {
        closeMobileMenu();
        document.querySelector(".TaskSummary-Container").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

if (mobileFilter) {
    mobileFilter.addEventListener("click", function () {
        closeMobileMenu();
        document.querySelector(".FilterTaskContainer").scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

if (mobileClear) {
    mobileClear.addEventListener("click", function () {
        taskarr = taskarr.filter(task => !task.completed);
        saveTask();
        showTask();
    });
}

document.querySelectorAll(".menu-item").forEach(function (item, index) {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    function activateMenuItem() {
        closeMobileMenu();

        if (index === 0) {
            input.focus();
            document.querySelector(".AlltaskContainer").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (index === 1) {
            document.querySelector(".TaskSummary-Container").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (index === 2) {
            document.querySelector(".FilterTaskContainer").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (index === 3) {
            taskarr = taskarr.filter(task => !task.completed);
            saveTask();
            showTask();
        }
    }

    item.addEventListener("click", activateMenuItem);
    item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateMenuItem();
        }
    });
});

loadTask();
