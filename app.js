const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("users.db", (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS managers (
      manager_id TEXT PRIMARY KEY,
      is_active BOOLEAN DEFAULT 1
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      mob_num TEXT NOT NULL UNIQUE,
      pan_num TEXT NOT NULL UNIQUE,
      manager_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
    )`
  );
});

// Create User
app.post("/create_user", (req, res) => {
  const { full_name, mob_num, pan_num, manager_id } = req.body;
  if (!full_name || !mob_num || !pan_num || !manager_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const user_id = uuidv4();
  const query = `INSERT INTO users (user_id, full_name, mob_num, pan_num, manager_id) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [user_id, full_name, mob_num, pan_num, manager_id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error: " + err.message });
    }
    res.json({ message: "✅ User created successfully", user_id });
  });
});

// Get Users (GET request with query parameters)
app.get("/get_users", (req, res) => {
  const { user_id, mob_num, manager_id } = req.query;
  let query = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (user_id) {
    query += " AND user_id = ?";
    params.push(user_id);
  }
  if (mob_num) {
    query += " AND mob_num = ?";
    params.push(mob_num);
  }
  if (manager_id) {
    query += " AND manager_id = ?";
    params.push(manager_id);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    res.json({ users: rows });
  });
});

// Delete User
app.post("/delete_user", (req, res) => {
  const { user_id, mob_num } = req.body;
  if (!user_id && !mob_num) {
    return res.status(400).json({ error: "Provide user_id or mob_num" });
  }

  db.run("DELETE FROM users WHERE user_id = ? OR mob_num = ?", [user_id, mob_num], function (err) {
    if (err) return res.status(500).json({ error: "Database error: " + err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "✅ User deleted successfully" });
  });
});

// Update User
app.post("/update_user", (req, res) => {
  const { user_id, update_data } = req.body;
  if (!user_id || !update_data || Object.keys(update_data).length === 0) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  let updateFields = [];
  let values = [];

  for (const key in update_data) {
    updateFields.push(`${key} = ?`);
    values.push(update_data[key]);
  }

  values.push(user_id);

  db.run(
    `UPDATE users SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: "Database error: " + err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "✅ User updated successfully" });
    }
  );
});

// Gracefully Close Database on Exit
process.on("SIGINT", () => {
  db.close(() => {
    console.log("🔒 Database connection closed.");
    process.exit(0);
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
