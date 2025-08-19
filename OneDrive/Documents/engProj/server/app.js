const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { DbService } = require('./dbService');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CREATE: insert a book
app.post('/insert', async (req, res) => {
  const db = DbService.getDbServiceInstance();
  let insertedId;

  try {
    if (req.body.bookName && req.body.author && req.body.bookNumber) {
      const { bookName, author, bookNumber } = req.body;
      insertedId = await db.insertNewBook(bookName, author, bookNumber);
    } else if (req.body.studentName && req.body.studentId) {
      const { studentName, studentId } = req.body;
      insertedId = await db.insertNewStudent(studentName, studentId);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid request body' });
    }

    res.json({ status: 'success', insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});




// READ: get all books
app.get('/getAll', async (req, res) => {
  const db = DbService.getDbServiceInstance();
  try {
    const data = await db.getAllData();
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.get("/students", async (req, res) => {
  const db = DbService.getDbServiceInstance();
  try {
    const students = await db.getAllData(); // returns { db1, db2, db3 }
    res.json(students.db2); // db2 contains student data
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/books", async (req, res) => {
  const db = DbService.getDbServiceInstance();
  try {
    const books = await db.getAllData();
    // Only return books where available = 1
    const availableBooks = books.db1.filter(b => b.available === 1);
    res.json(availableBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
