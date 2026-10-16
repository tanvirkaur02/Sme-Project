let students = JSON.parse(localStorage.getItem("students")) || [];

if (!localStorage.getItem("demoStudentsAdded")) {
    students = [
        {
            id: 1,
            name: "Aman Sharma",
            roll: "101",
            course: "B.Tech CSE",
            department: "Computer Science"
        },
        {
            id: 2,
            name: "Simran Kaur",
            roll: "102",
            course: "B.Tech CSE",
            department: "Computer Science"
        },
        {
            id: 3,
            name: "Rahul Kumar",
            roll: "103",
            course: "BCA",
            department: "Computer Applications"
        }
    ];

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("demoStudentsAdded", "true");
}

let courses = [
    "B.Tech CSE",
    "B.Tech ECE",
    "BBA",
    "BCA"
];

let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showPage(page) {
    document.getElementById("dashboard-header").style.display =
        page == "dashboard" ? "block" : "none";

    document.getElementById("dashboard-cards").style.display =
        page == "dashboard" ? "grid" : "none";

    document.getElementById("students-page").style.display =
        page == "students" ? "block" : "none";

    document.getElementById("courses-page").style.display =
        page == "courses" ? "block" : "none";

    document.getElementById("attendance-page").style.display =
        page == "attendance" ? "block" : "none";

    document.getElementById("departments-page").style.display =
        page == "departments" ? "block" : "none";
}

function showDashboard() {
    showPage("dashboard");
    updateDashboard();
}

function showStudents() {
    showPage("students");

    document.querySelector("#students-page .section-heading h2").innerText =
        "Student Directory";

    document.getElementById("search").value = "";

    displayStudents(students);
}

function showCourses() {
    showPage("courses");
    displayCourses();
}

function showAttendance() {
    showPage("attendance");
    displayAttendance();
}

function showDepartments() {
    showPage("departments");
    displayDepartments();
}

function updateDashboard() {
    let today = new Date().toISOString().slice(0, 10);

let presentCount = 0;
let absentCount = 0;
let unmarkedCount = 0;

students.forEach(function(student) {
    let status = attendance[student.id]?.[today] || "";

    if (status === "Present") {
        presentCount++;
    } else if (status === "Absent") {
        absentCount++;
    } else {
        unmarkedCount++;
    }
});

document.getElementById("today-present").innerText = presentCount;
document.getElementById("today-absent").innerText = absentCount;
document.getElementById("today-unmarked").innerText = unmarkedCount;
    document.getElementById("total-students").innerText =
        students.length;

    document.getElementById("total-courses").innerText =
        courses.length;

    let total = 0;
    let count = 0;

    students.forEach(function(student) {
        if (attendance[student.id]) {
            let records = Object.values(attendance[student.id]);
            records.forEach(function(status) {
                total += status == "Present" ? 100 : 0;
                count++;
            });
        }
        
    });

    document.getElementById("average-attendance").innerText =
        count ? Math.round(total / count) + "%" : "0%";
}

function showForm() {
    document.getElementById("student-form").style.display = "block";
}

function hideForm() {
    document.getElementById("student-form").style.display = "none";
}

function addStudent() {
    let name = document.getElementById("student-name").value.trim();
    let roll = document.getElementById("student-roll").value.trim();
    let course = document.getElementById("student-course").value.trim();
    let department = document.getElementById("student-department").value.trim();

    if (!name || !roll || !course || !department) {
        alert("Please fill all student details.");
        return;
    }

    let exists = students.some(function(student) {
        return student.roll.toLowerCase() == roll.toLowerCase();
    });

    if (exists) {
        alert("This roll number already exists.");
        return;
    }

    let newStudent = {
        id: Date.now(),
        name: name,
        roll: roll,
        course: course,
        department: department
    };

    students.push(newStudent);
    saveStudents();
    displayStudents(students);
    updateDashboard();
    hideForm();

    document.getElementById("student-name").value = "";
    document.getElementById("student-roll").value = "";
    document.getElementById("student-course").value = "";
    document.getElementById("student-department").value = "";

    alert("Student added successfully!");
}

function displayStudents(data) {
    let html = "";

    if (data.length == 0) {
        html = "<tr><td colspan='6'>No students found.</td></tr>";
    }

    data.forEach(function(student) {
        html += "<tr>";
        html += "<td>" + student.id + "</td>";
        html += "<td>" + student.name + "</td>";
        html += "<td>" + student.roll + "</td>";
        html += "<td>" + student.course + "</td>";
        html += "<td>" + student.department + "</td>";
        html += "<td>";
        html += "<button onclick='viewStudent(" + student.id + ")'>View</button>";
        html += "<button onclick='editStudent(" + student.id + ")'>Edit</button>";
        html += "<button onclick='deleteStudent(" + student.id + ")'>Delete</button>";
        html += "</td></tr>";
    });

    document.getElementById("student-list").innerHTML = html;
}

function editStudent(id) {
    let student = students.find(function(s) {
        return s.id == id;
    });

    if (!student) return;

    let name = prompt("Enter student name:", student.name);
    if (name == null || !name.trim()) return;

    let roll = prompt("Enter roll number:", student.roll);
    if (roll == null || !roll.trim()) return;

    let course = prompt("Enter course:", student.course);
    if (course == null || !course.trim()) return;

    let department = prompt("Enter department:", student.department);
    if (department == null || !department.trim()) return;

    let duplicate = students.some(function(s) {
    return s.roll.toLowerCase() == roll.trim().toLowerCase()
           && s.id != id;
});

if (duplicate) {
    alert("This roll number already exists!");
    return;
}
    student.name = name.trim();
    student.roll = roll.trim();
    student.course = course.trim();
    student.department = department.trim();

    saveStudents();
    displayStudents(students);
    updateDashboard();
}

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    students = students.filter(function(s) {
        return s.id != id;
    });

    delete attendance[id];
    localStorage.setItem("attendance", JSON.stringify(attendance));

    saveStudents();
    displayStudents(students);
    updateDashboard();
}

document.getElementById("search").addEventListener("input", function() {
    let value = this.value.toLowerCase();

    let filtered = students.filter(function(student) {
        return student.name.toLowerCase().includes(value) ||
               student.roll.toLowerCase().includes(value);
    });

    displayStudents(filtered);
});


function displayCourses() {
    let html = "";

    courses.forEach(function(course) {
        let courseStudents = students.filter(function(student) {
            return student.course.toLowerCase() === course.toLowerCase();
        });

        html += "<div class='info-card course-card' " +
                "onclick='showCourseStudents(" + JSON.stringify(course) + ")' " +
                "style='cursor:pointer;'>";

        html += "<h3>" + course + "</h3>";
        html += "<p>Enrolled students: " + courseStudents.length + "</p>";
        html += "<p>Click to view students</p>";
        html += "</div>";
    });

    document.getElementById("course-list").innerHTML = html;
}

function displayDepartments() {
    let departments = [...new Set(students.map(function(s) {
        return s.department;
    }))];

    let html = "";

    if (departments.length == 0) {
        html = "<p>No departments yet. Add a student first.</p>";
    }

    departments.forEach(function(department) {
        let count = students.filter(function(student) {
            return student.department == department;
        }).length;

        html += "<div class='info-card'>";
        html += "<h3>" + department + "</h3>";
        html += "<p>Total students: " + count + "</p>";
        html += "<button onclick=\"showDepartmentStudents(" +
                JSON.stringify(department) + ")\">View Students</button>";
        html += "</div>";
    });

    document.getElementById("department-list").innerHTML = html;
}

function showDepartmentStudents(department) {

    // Open the Students page
    showStudents();

    // Filter students by department
    let filtered = students.filter(function(student) {
        return student.department === department;
    });

    // Display only the selected department's students
    displayStudents(filtered);

    // Update the page heading
    document.querySelector("#students-page .section-heading h2").innerText =
        department + " Students";
}

function markAttendance(id, status) {
    let date = new Date().toISOString().slice(0, 10);

    if (!attendance[id]) {
        attendance[id] = {};
    }

    attendance[id][date] = status;

    localStorage.setItem("attendance", JSON.stringify(attendance));

}
function displayAttendance() {
    let html = "";
    let today = new Date().toISOString().slice(0, 10);

    if (students.length === 0) {
        html = "<p>Add students first to record attendance.</p>";
    }

    students.forEach(function(student) {
        let status = attendance[student.id]?.[today] || "";

        html += "<div class='info-card'>";
        html += "<h3>" + student.name + " (" + student.roll + ")</h3>";
        html += "<p>Course: " + student.course + "</p>";
    html += "<p>Today's status: <b>" +
    (status || "Not Marked") + "</b></p>";

        html += "<button onclick='markAttendance(" + student.id + ", \"Present\")' " +
                (status === "Present" ? "disabled" : "") + ">Present</button>";

        html += "<button onclick='markAttendance(" + student.id + ", \"Absent\")' " +
                (status === "Absent" ? "disabled" : "") + ">Absent</button>";

        html += "</div>";
    });

    document.getElementById("attendance-list").innerHTML = html;
}



displayStudents(students);
updateDashboard();

function viewStudent(id) {
    let student = students.find(function(s) {
        return s.id == id;
    });

    if (student) {
        alert(
            "Name: " + student.name +
            "\nRoll Number: " + student.roll +
            "\nCourse: " + student.course +
            "\nDepartment: " + student.department
        );
    }
}

function showCourseStudents(course) {
    let courseStudents = students.filter(function(student) {
        return student.course.toLowerCase() === course.toLowerCase();
    });

    let html = "<h2>" + course + " Students</h2>";

    if (courseStudents.length === 0) {
        html += "<p>No students enrolled in this course.</p>";
    } else {
        html += "<ul>";

        courseStudents.forEach(function(student) {
            html += "<li>" + student.name +
                    " — Roll No: " + student.roll + "</li>";
        });

        html += "</ul>";
    }

    html += "<button onclick='showCourses()'>Back to Courses</button>";

    document.getElementById("course-list").innerHTML = html;
}
