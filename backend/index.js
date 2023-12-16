const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// MIDDLEWARES:
app.use(cors()); // Frontend Connection;
app.use(express.json()); // Database Connection to get json files;

// ROUTES:
// get all todos:
app.get("/todos", async (req, res) => {
  try {
    pool.query("SELECT * FROM todos", (err, result) => {
      if (err) throw err;

      res.status(200).json(result.rows);
    });
  } catch (err) {
    console.error(err.message);
  }
});

// get a todo:
app.get("/todos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM todos WHERE id = $1", [id], (err, result) => {
      if (err) throw err;

      res.status(200).json(result.rows[0]);
    });
  } catch (err) {
    console.error(err.message);
  }
});

// create a todo:
app.post("/todos", (req, res) => {
  try {
    const { description } = req.body;
    pool.query(
      "INSERT INTO todos (description) VALUES ($1) RETURNING *",
      [description],
      (err, result) => {
        if (err) throw err;

        res.status(201).json(result.rows[0]);
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

// update a todo:
app.put("/todos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description } = req.body;
    pool.query(
      "UPDATE todos SET description = $2 WHERE id = $1",
      [id, description],
      (err, result) => {
        if (err) throw err;

        res
          .status(200)
          .json(`A todo with the ID ${id} was successfully updated`);
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

// delete a todo:
app.delete("/todos/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    pool.query("DELETE FROM todos WHERE id = $1", [id], (err, result) => {
      if (err) throw err;

      res.status(200).json(`A todo with the ID ${id} was successfully deleted`);
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => console.log("Server running on PORT 5000"));
