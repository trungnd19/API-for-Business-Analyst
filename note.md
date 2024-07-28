1. Create a New Database: CREATE DATABASE todo_db;

2. Use the New Database: USE todo_db;

3. Create the todos Table:

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
);

4. Create connection and connect connection
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

5. Create a new todo:
- Lấy thông tin todo: {title, completed} từ request body
- Dùng câu lệnh insert into để ghi vào DB

6. Update a todo:
- Lấy thông tin id của todo gửi lên từ request param
- Lấy thông tin title, completed mới từ request body
- Dùng câu lệnh: update... set... where...

7. Delete a todo:
- Lấy thông tin id của todo gửi lên từ request param
- Dùng câu lệnh: DELETE FROM table_name WHERE condition;