const express = require("express");
const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Cross-Origin Resource Sharing: By default, web applications are restricted to make requests to the same origin (domain, protocol, and port)
// cors() allows your application to accept requests from different origins,
// which is useful when your frontend and backend are hosted on different domains or ports.
app.use(cors());
// bodyParser.json() converts the received JSON data into a JavaScript object.
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Get all todos
// app.get("/todos", (req, res) => {
//   connection.query("SELECT * FROM todos", (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       const todos = results.map((todo) => ({
//         ...todo,
//         completed: todo.completed === 1,
//       }));
//       res.json(todos);
//     }
//   });
// });

// offset: specifies the number of records to skip before starting to return records.
// Calculation of offset: offset = (page - 1) * limit
// - page: The current page number.
// - limit: The number of records to return per page.
// - For example, if you are on page 3 and the limit is 10, the offset will be (3 - 1) * 10 = 20.
// This means the query will skip the first 20 records and start returning records from the 21st onward.

// The COUNT() function returns the number of records returned by a select query.
// COUNT(id): Counts rows where id is not NULL.


// "SELECT * FROM todos LIMIT ? OFFSET ?"
// Limit: số bản ghi sẽ trả ra
// Offset:  the number of rows to skip before starting to return rows
// OFFSET 20: The query will skip the first 20 rows and start returning rows from the 21st row onward.

// Get all todos with pagination
app.get("/todos", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  connection.query(
    "SELECT COUNT(id) AS numberOfTodos FROM todos",
    (err, countResult) => {
      if (err) {
        return res.status(500).send(err);
      }

      const total = countResult[0].numberOfTodos;

      connection.query(
        "SELECT * FROM todos LIMIT ? OFFSET ?",
        [limit, offset],
        (err, results) => {
          if (err) {
            res.status(500).send(err);
          } else {
            const todos = results.map((todo) => ({
              ...todo,
              completed: todo.completed === 1,
            }));
            res.json({
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
              todos,
            });
          }
        }
      );
    }
  );
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, completed } = req.body;
  connection.query(
    "INSERT INTO todos (title, completed) VALUES (?, ?)",
    [title, completed],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ id: results.insertId, title, completed });
      }
    }
  );
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  connection.query(
    "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
    [title, completed, id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM todos WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
