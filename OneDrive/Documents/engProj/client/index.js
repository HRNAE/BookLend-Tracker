document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
    loadBooks();
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});

const addBtn = document.querySelector('#add-book');

addBtn.onclick = function (event) {
    event.preventDefault();
    const bookName = document.querySelector('#booktitle').value;
    const author = document.querySelector('#author').value;
    const bookNumber = document.querySelector('#booknumber').value;

    document.querySelector('#booktitle').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#booknumber').value = "";

    fetch('http://localhost:5000/insert', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ bookName, author, bookNumber })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        loadBooks(); // 🔹 reload dropdown
    })
    .catch(err => console.error(err));
}


const addBtn1 = document.querySelector('#add-student');

addBtn1.onclick = function(event) {
    event.preventDefault();
    const studentName = document.querySelector('#studentname').value;
    const studentId = document.querySelector('#idnum').value;

    document.querySelector('#studentname').value = "";
    document.querySelector('#idnum').value = "";

    fetch('http://localhost:5000/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, studentId })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Server response:', data);
        loadStudents(); // 🔹 reload dropdown
    })
    .catch(err => console.error(err));
};



document.querySelector("#lendBtn").addEventListener("click", () => {
    const studentId = document.querySelector("#studentDropdown").value;
    const bookId = document.querySelector("#bookDropdown").value;


    fetch("http://localhost:5000/lend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, book_id: bookId })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadBooks(); // refresh available books after lending
    });
});


document.querySelector("#returnBtn").addEventListener("click", () => {
    const studentId = document.querySelector("#studentDropdown").value;
    const bookId = document.querySelector("#bookDropdown").value;


    if (!studentId || !bookId) {
        alert("Please select a student and a book to return.");
        return;
    }

    fetch("http://localhost:5000/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, book_id: bookId })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadBooks();    // 🔹 refresh available books
        loadStudents(); // optional: refresh students if you want
    })
    .catch(err => console.error(err));
});


function loadStudents() {
    fetch("http://localhost:5000/students")
        .then(res => res.json())
        .then(students => {
            const dropdown = document.querySelector("#studentDropdown");
            dropdown.innerHTML = '<option value="">Select a student</option>';
            students.forEach(s => {
                const option = document.createElement("option");
                option.value = s.student_id;
                option.textContent = s.student_name;
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error(err));
}

function loadBooks() {
    fetch("http://localhost:5000/books")
        .then(res => res.json())
        .then(books => {
            const dropdown = document.querySelector("#bookDropdown");
            dropdown.innerHTML = '<option value="">Select a book</option>';
            books.forEach(b => {
                const option = document.createElement("option");
                option.value = b.book_id;
                option.textContent = b.title;
                dropdown.appendChild(option);
            });
        })
        .catch(err => console.error(err));
}




function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    console.log(data);

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    }
}
