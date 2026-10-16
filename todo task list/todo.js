
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";
let editingId = null;

const taskForm = document.getElementById("task-form");

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function showTasks(filter = "all") {
    currentFilter = filter;

    document.getElementById("dashboard").hidden = false;
    document.getElementById("task-form-section").hidden = true;

    document.getElementById("page-title").innerText = "My Tasks";

    document.getElementById("list-title").innerText =
        filter === "completed" ? "Completed Tasks" :
        filter === "pending" ? "Pending Tasks" : "All Tasks";

    document.querySelectorAll(".nav-btn").forEach(function(button) {
        button.classList.toggle(
            "active",
            (filter === "all" && button.textContent.includes("All Tasks")) ||
            (filter === "completed" && button.textContent.includes("Completed")) ||
            (filter === "pending" && button.textContent.includes("Pending"))
        );
    });

    renderTasks();
}

function showAddForm() {
    editingId = null;
    taskForm.reset();

    document.getElementById("form-heading").innerText = "Add New Task";
    document.getElementById("dashboard").hidden = true;
    document.getElementById("task-form-section").hidden = false;
    document.getElementById("page-title").innerText = "Add Task";

    document.querySelectorAll(".nav-btn").forEach(function(button) {
        button.classList.toggle(
            "active",
            button.textContent.includes("Add Task")
        );
    });
}

function renderTasks() {
    let search = document.getElementById("search").value.toLowerCase();
    let priorityFilter = document.getElementById("priority-filter").value;
    let filtered = tasks.filter(function(task) {
        let matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) 
            (currentFilter === "pending" && !task.completed);
        let matchesSearch = task.title.toLowerCase().includes(search);
        let matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
        return matchesFilter && matchesSearch && matchesPriority;
    });
    let html = "";
    if (filtered.length === 0) {
        html = "<tr><td colspan='5' style='text-align:center;padding:30px;'>No tasks found.</td></tr>";
    }
    filtered.forEach(function(task) {
        html += "<tr>";
        html += "<td><input class='task-done' type='checkbox' " +
                (task.completed ? "checked" : "") +
                " onchange='toggleTask(" + task.id + ")'></td>";
        html += "<td class='" + (task.completed ? "completed-title" : "") + "'>" +
                escapeHTML(task.title) + "</td>";
        html += "<td><span class='priority " + task.priority + "'>" +
                task.priority + "</span></td>";
        html += "<td>" + (task.date || "No date") + "</td>";

        html += "<td>" +
                "<button class='action-btn edit-btn' onclick='editTask(" + task.id + ")'>Edit</button>" +
                "<button class='action-btn delete-btn' onclick='deleteTask(" + task.id + ")'>Delete</button>" +
                "</td>";
        html += "</tr>";
    });
    document.getElementById("task-list").innerHTML = html;
    document.getElementById("total").innerText = tasks.length;
    document.getElementById("completed").innerText =
        tasks.filter(function(task) { return task.completed; }).length;
    document.getElementById("pending").innerText =
        tasks.filter(function(task) { return !task.completed; }).length;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let title = document.getElementById("task-title").value.trim();

    if (!title) {
        alert("Please enter a task title.");
        return;
    }

    let taskData = {
        title: title,
        priority: document.getElementById("task-priority").value,
        date: document.getElementById("task-date").value,
        description: document.getElementById("task-description").value.trim()
    };

    if (editingId !== null) {
        tasks = tasks.map(function(task) {
            return task.id === editingId
                ? { ...task, ...taskData }
                : task;
        });
    } else {
        tasks.push({
            id: Date.now(),
            ...taskData,
            completed: false
        });
    }

    saveTasks();
    showTasks(currentFilter);
});

function toggleTask(id) {
    tasks = tasks.map(function(task) {
        return task.id === id
            ? { ...task, completed: !task.completed }
            : task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    let task = tasks.find(function(item) {
        return item.id === id;
    });

    if (!task) return;

    editingId = id;

    document.getElementById("task-title").value = task.title;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-date").value = task.date;
    document.getElementById("task-description").value = task.description || "";

    document.getElementById("form-heading").innerText = "Edit Task";
    document.getElementById("dashboard").hidden = true;
    document.getElementById("task-form-section").hidden = false;
    document.getElementById("page-title").innerText = "Edit Task";
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

document.getElementById("search").addEventListener("input", renderTasks);

showTasks("all");
