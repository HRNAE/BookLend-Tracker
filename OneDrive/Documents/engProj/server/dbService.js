const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

//  Create three DB pools
const db1 = mysql.createPool({
  host: process.env.DB1_HOST,
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  database: process.env.DB1_DATABASE,
  port: process.env.DB1_PORT
});

const db2 = mysql.createPool({
  host: process.env.DB2_HOST,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_DATABASE,
  port: process.env.DB2_PORT
});

const db3 = mysql.createPool({
  host: process.env.DB3_HOST,
  user: process.env.DB3_USER,
  password: process.env.DB3_PASSWORD,
  database: process.env.DB3_DATABASE,
  port: process.env.DB3_PORT
});

//  Test DB connections
[db1, db2, db3].forEach((pool, idx) => {
  pool.getConnection((err, conn) => {
    if (err) console.error(`DB${idx + 1} connection error:`, err.message);
    else {
      console.log(`DB${idx + 1} connected successfully!`);
      conn.release();
    }
  });
});

let instance = null;

class DbService {
  static getDbServiceInstance() {
    if (!instance) instance = new DbService();
    return instance;
  }

  //  Insert a new book/student
  async insertNewBook(bookName, author, bookNumber) {
    const dateAdded = new Date();
    const sql = `INSERT INTO names (title, author, book_id, date_added, available) VALUES (?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
      db1.query(sql, [bookName, author, bookNumber, dateAdded, 1], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  }

  async insertNewStudent(studentName, studentId) {
    const dateAdded = new Date();
    const sql = `INSERT INTO names (student_name, student_id, date_added) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db2.query(sql, [studentName, studentId, dateAdded], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      });
    });
  }

  //  Get all data from all three DBs
  async getAllData() {
    const queryDB = (pool, sql) =>
      new Promise((resolve, reject) => {
        pool.query(sql, (err, results) => (err ? reject(err) : resolve(results)));
      });

    const sql = "SELECT * FROM names";

    const [db1Data, db2Data, db3Data] = await Promise.all([
      queryDB(db1, sql),
      queryDB(db2, sql),
      queryDB(db3, sql),
    ]);

    return { db1: db1Data, db2: db2Data, db3: db3Data };
  }
}

module.exports = { DbService };
