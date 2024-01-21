const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

app.use(bodyParser.json());
let conn = null;

// function connectMySQL
const connectMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test",
    port: "8889",
  });
};
const port = 3000;
app.listen(port, async () => {
  await connectMySQL();

  console.log(`Server is running on port ${port}`);
});

let users = [];
let couter = 1;

app.get("/testdb", async (req, res) => {
  //   mysql
  //     .createConnection({
  //       host: "localhost",
  //       user: "root",
  //       password: "root",
  //       database: "test",
  //       port: "8889",
  //     })
  //     .then((conn) => {
  //       // สิ่งนี้เราเรียกกันว่า promise
  //       conn
  //         .query("SELECT * FROM users")
  //         .then((results) => {
  //           res.json(results[0]);
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching users:", error.message);
  //           res.status(500).json({ error: "Error fetching users" });
  //         });
  //     });
  try {
    let results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/users", async (req, res) => {
  try {
    let results = await conn.query("SELECT * FROM users");
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let [results] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.post("/users", async (req, res) => {
  const data = req.body;

  try {
    const result = await conn.query("INSERT INTO users SET ?", data);
    const userId = result[0].insertId;
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await conn.query("UPDATE users SET ? WHERE id = ?", [
      data,
      id,
    ]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", userId: id });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await conn.query("DELETE FROM users WHERE id = ?", [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully", userId: id });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Error deleting user" });
  }
});
