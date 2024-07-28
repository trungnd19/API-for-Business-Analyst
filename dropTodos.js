const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ductrung",
  database: "todo_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");

  // Function to delete all records from the todos table
  const dropAllTodos = () => {
    const sql = "DELETE FROM todos";

    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("All records deleted");

      // Optional: Close the connection after the operation
      connection.end((err) => {
        if (err) throw err;
        console.log("Database connection closed.");
      });
    });
  };

  // Call the function to drop all items
  dropAllTodos();
});

// node dropTodos.js
