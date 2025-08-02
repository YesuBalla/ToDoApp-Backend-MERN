import todo from "../models/todo.model.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import csvParser from "csv-parser";

dotenv.config();

// Authentication of a valid user
const authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    // Verify the token and extract the user information
    const decoded = Jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded; // Store user information in req.user for further processing
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create a TODO-List item
export async function createToDo(req, res) {
  authenticateUser(req, res, async () => {
    const userId = req.user._id;
    req.body.userId = userId;
    await todo
      .create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => console.log(err));
  });
}

// Read all user-TODO-List items
export async function readToDo(req, res) {
  authenticateUser(req, res, async () => {
    const userId = req.user._id;
    try {
      const userTodos = await todo.find({ userId: userId });
      res.json(userTodos);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch user's todos." });
    }
  });
}

// Update a TODO-List item
export async function updateToDo(req, res) {
  authenticateUser(req, res, async () => {
    const { _id } = req.body.data;
    await todo
      .findByIdAndUpdate(_id, req.body.data)
      .then(() => {
        res.status(201).send("Updated Successfully...");
      })
      .catch((err) => console.log(err));
  });
}

// Delete a TODO-List item
export async function deleteToDo(req, res) {
  authenticateUser(req, res, async () => {
    const { _id } = req.body;
    await todo
      .findByIdAndDelete(_id)
      .then(() => res.set(201).send("Deleted Successfully..."))
      .catch((err) => console.log(err));
  });
}

// Bulk upload TODO-List items from a CSV file
export async function bulkUploadTodos(req, res) {
  authenticateUser(req, res, async () => {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const userId = req.user._id;
    const todos = [];

    // Read the uploaded CSV file and process the data
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        const todoItem = {
          Title: row.Title,
          Description: row.Description,
          Priority: row.Priority,
          Date: row.Date,
          Reapeat: row.Repeat,
          Status: row.Status,
          userId: userId,
        };
        todos.push(todoItem);
      })
      .on("end", async () => {
        try {
          // Bulk insert todos into the database
          const insertedTodos = await todo.insertMany(todos);

          // Remove the temporary file
          fs.unlinkSync(req.file.path);

          res
            .status(200)
            .json({ message: "Bulk upload successful", data: insertedTodos });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to process CSV file" });
        }
      });
  });
}
