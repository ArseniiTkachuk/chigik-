
let tasks = [];
let currentFilter = "all";

const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clear-btn");
const themeBtn = document.getElementById("theme-btn");
const filterBtns = document.querySelectorAll(".filter");

function save() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
        console.error(e);
    }
}

function load() {
    try {
        const saved = localStorage.getItem("tasks");
        if (saved) tasks = JSON.parse(saved);
        if (localStorage.getItem("theme") === "dark") setTheme(true);
    } catch (e) {
        console.error(e);
    }
}


function addTask() {
    const text = input.value.trim();
    if (text === "") return;

    tasks.push({ id: Date.now(), text: text, done: false });
    input.value = "";
    input.focus();
    save();
    render();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    save();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
}

function clearDone() {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
}



function render() {
    list.innerHTML = "";


    const visible = tasks.filter(t => {
        if (currentFilter === "active") return !t.done;
        if (currentFilter === "done") return t.done;
        return true;
    });

    if (visible.length === 0) {
        const msg = document.createElement("p");
        msg.className = "empty";
        msg.textContent = tasks.length === 0
            ? "Поки що порожньо. Додай першу справу."
            : "Тут нічого немає.";
        list.appendChild(msg);
    }

    visible.forEach(task => {
        const li = document.createElement("li");
        if (task.done) li.classList.add("done");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const span = document.createElement("span");
        span.textContent = task.text;

        const del = document.createElement("button");
        del.className = "delete";
        del.textContent = "×";
        del.setAttribute("aria-label", "Видалити справу");
        del.addEventListener("click", () => deleteTask(task.id));

        li.append(checkbox, span, del);
        list.appendChild(li);
    });

    // Лічильник
    const left = tasks.filter(t => !t.done).length;
    counter.textContent = "Залишилось: " + left;
}


function setTheme(dark) {
    document.body.classList.toggle("dark", dark);
    themeBtn.textContent = dark ? "Світла тема" : "Темна тема";
}


addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

clearBtn.addEventListener("click", clearDone);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        render();
    });
});

themeBtn.addEventListener("click", () => {
    const dark = !document.body.classList.contains("dark");
    setTheme(dark);
    try {
        localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
});


load();
render();