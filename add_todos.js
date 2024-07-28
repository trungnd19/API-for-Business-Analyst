const mysql = require("mysql2");

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ductrung",
  database: "todo_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

const todos = Array.from({ length: 100 }, (_, i) => [`Todo ${i + 1}`, false]);

connection.query(
  "INSERT INTO todos (title, completed) VALUES ?",
  [todos],
  (err, results) => {
    if (err) {
      console.error("Error inserting todos:", err);
    } else {
      console.log("Inserted 100 todos");
    }
    connection.end();
  }
);

// node add_todos.js
